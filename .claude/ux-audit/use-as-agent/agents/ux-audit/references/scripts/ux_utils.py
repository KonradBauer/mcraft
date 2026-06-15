"""ux_utils — shared utilities for interactive HTML deliverable mutation.

Single-file library covering 4 logical sections:
  1. shell_template      — extract / mutate / write embedded JSON data blocks
  2. data_block_mutator  — path-navigation and in-place mutation helpers
  3. html_inspector      — debug / validation helpers
  4. json_inspector      — CLI inspector for JSON arrays (layout-map / Phantom output)

Stdlib only — no pip dependencies. No cross-section imports: each section
is independently usable. API surface designed for both web-sandbox (string-in /
string-out) and CLI (file I/O) contexts per FIN-008.
"""

from __future__ import annotations

import json
import re
import sys
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Generator

# ============================================================
# shell_template — extract / mutate / write embedded JSON data blocks
# ============================================================


def extract_data_block(html_str: str, block_id: str) -> tuple[str, dict, str]:
    """Locate a JSON data block by id and return a three-part split.

    Finds a ``<script type="application/json" id="{block_id}">...</script>``
    element anywhere in *html_str*, JSON-decodes its body, and returns the
    three parts needed to splice a mutated version back in without touching
    the surrounding HTML.

    Args:
        html_str:  Full HTML document as a string.
        block_id:  The ``id`` attribute value of the target ``<script>`` tag.

    Returns:
        (prefix, data_dict, suffix) where *prefix* is everything up to and
        including the opening ``<script>`` tag (and its inner whitespace),
        *data_dict* is the parsed JSON object, and *suffix* is everything from
        the closing ``</script>`` tag to the end of the document.

    Raises:
        ValueError: If no ``<script>`` tag with the given id is found.

    Example:
        pre, data, suf = extract_data_block(html, "wireframes-findings-data")
    """
    pattern = re.compile(
        r'(<script[^>]+type="application/json"[^>]+id="'
        + re.escape(block_id)
        + r'"[^>]*>\s*)(\{.*?\})(\s*</script>)',
        re.DOTALL,
    )
    match = pattern.search(html_str)
    if match is None:
        raise ValueError(
            f"extract_data_block: no <script type='application/json' id='{block_id}'> "
            f"found in the supplied HTML string"
        )
    open_tag = match.group(1)
    json_body = match.group(2)
    close_tag = match.group(3)
    data = json.loads(json_body)
    prefix = html_str[: match.start()] + open_tag
    suffix = close_tag + html_str[match.end() :]
    return prefix, data, suffix


def write_data_block(prefix: str, data: dict, suffix: str) -> str:
    """Re-assemble an HTML document from the three parts produced by extract_data_block.

    Serializes *data* with ``ensure_ascii=False`` and ``indent=2`` so Polish
    diacritics and curly quotes survive round-trips without escaping, then
    splices the result between *prefix* and *suffix*.

    Args:
        prefix:  Everything up to and including the opening ``<script>`` tag.
        data:    The (possibly mutated) data dict to serialize.
        suffix:  Everything from the closing ``</script>`` tag onwards.

    Returns:
        Reassembled HTML string.

    Example:
        html_out = write_data_block(pre, data, suf)
    """
    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    return prefix + serialized + suffix


@contextmanager
def with_data_block(
    html_path: str, block_id: str
) -> Generator[dict, None, None]:
    """Context manager that reads, yields the parsed data dict, then writes back.

    Opens *html_path* with UTF-8 encoding, extracts the JSON block identified
    by *block_id*, yields the parsed dict so the caller can mutate it in place,
    then writes the modified document back to the same file on exit.

    Args:
        html_path:  Filesystem path to the HTML file (CLI-only; not for sandboxes).
        block_id:   The ``id`` attribute value of the target ``<script>`` tag.

    Yields:
        The parsed data dict. Mutations made to it are written back on exit.

    Example:
        with with_data_block("{slug}_wireframes.html", "wireframes-findings-data") as d:
            d["chrome"]["nav"]["cta"]["label"] = "Rezerwuj konsultację"
    """
    path = Path(html_path)
    html_str = path.read_text(encoding="utf-8")
    prefix, data, suffix = extract_data_block(html_str, block_id)
    yield data
    path.write_text(write_data_block(prefix, data, suffix), encoding="utf-8")


def write_project_plan_block(
    html_path: str,
    template_path: str,
    block_id: str,
    data: dict,
    substitutions: dict | None = None,
    *,
    substrate_path: dict | str | None = None,
    skip_gate: bool = False,
) -> None:
    """Idempotent clone-and-splice for a Project Plan data block.

    If *html_path* does not exist, clone *template_path* to it (after applying
    *substitutions* for placeholders like ``{slug}`` and ``{project-language}``).
    Then replace the body of ``<script id="{block_id}">`` with *data* via
    :func:`with_data_block`.

    Calling this function twice in a row with the same *data* is a no-op on the
    second call (idempotent — the second splice just rewrites the same JSON).

    **Pre-save coverage gate.** When *block_id* is wireframe-bearing
    (``audit-findings-data`` or ``wireframes-findings-data``) AND *data*
    contains a ``wireframes[]`` array with at least one reverse-mode entry
    (``extractionMode == 'phantom-browser'``), the gate runs
    ``compute_section_coverage`` per entry before the splice. Failures raise
    ``CoverageGateError``. Forward-mode entries skip the gate naturally.
    Tests and synthetic-fixture writes pass ``skip_gate=True`` to bypass.

    Args:
        html_path:        Target HTML file path. Created if missing.
        template_path:    Source template path used for the initial clone.
        block_id:         The ``id`` attribute value of the target ``<script>`` tag.
        data:             Dict to splice into the block.
        substitutions:    Optional ``{placeholder: value}`` map applied as a
                          plain string replace on the template body. Keys are the
                          placeholder text without braces — ``{"slug": "tylia"}``
                          replaces ``{slug}`` with ``tylia``.
        substrate_path:   For the coverage gate: ``None`` derives substrate paths
                          per slug via the conventional layout
                          (``<html_parent>/current-website/audit-feed/layouts/{slug}-1.json``);
                          ``str`` uses one path for all entries (single-page case);
                          ``dict`` maps slug → path explicitly.
        skip_gate:        Bypass the coverage gate. Default False. Tests and
                          intentional bypass scripts may set this to True.

    Raises:
        FileNotFoundError:   If *template_path* does not exist when cloning is
                             needed, or if the gate cannot locate substrate.
        ValueError:          If *block_id* is not present in the resulting HTML.
        CoverageGateError:   If the gate fails closed on a reverse-mode entry.
    """
    # Pre-save gate — only fires for wireframe-bearing block_ids with a
    # wireframes[] payload. Run BEFORE any disk write so failures don't leave
    # a half-written file behind.
    if block_id in _WIREFRAME_BEARING_BLOCK_IDS:
        wireframes = data.get("wireframes") if isinstance(data, dict) else None
        _maybe_run_coverage_gate(
            html_path,
            wireframes if isinstance(wireframes, list) else [],
            substrate_path=substrate_path,
            skip_gate=skip_gate,
        )

    path = Path(html_path)
    if not path.exists():
        tpl_path = Path(template_path)
        if not tpl_path.exists():
            raise FileNotFoundError(
                f"write_project_plan_block: template not found at {template_path!r}"
            )
        body = tpl_path.read_text(encoding="utf-8")
        if substitutions:
            for key, value in substitutions.items():
                body = body.replace("{" + key + "}", value)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
    with with_data_block(html_path, block_id) as block:
        block.clear()
        block.update(data)


def read_project_plan_block(html_path: str, block_id: str) -> dict:
    """Read-only wrapper around :func:`extract_data_block` for a Project Plan block.

    Args:
        html_path:  Path to the HTML file.
        block_id:   The ``id`` attribute value of the target ``<script>`` tag.

    Returns:
        The parsed JSON dict from the block body.

    Raises:
        ValueError: If *block_id* is not present in the file.
    """
    html_str = Path(html_path).read_text(encoding="utf-8")
    _, data, _ = extract_data_block(html_str, block_id)
    return data


_DELIVERABLE_BLOCK_IDS = ("audit-findings-data", "wireframes-findings-data")


def _resolve_deliverable_block_id(html_str: str, explicit: str | None) -> str:
    """Return the JSON data block id for an audit/wireframing deliverable.

    If *explicit* is given, return it unchanged. Otherwise scan *html_str* for
    the first matching id from :data:`_DELIVERABLE_BLOCK_IDS` and return it.

    Raises:
        ValueError: If no candidate block id is present in the document.
    """
    if explicit is not None:
        return explicit
    for candidate in _DELIVERABLE_BLOCK_IDS:
        if f'id="{candidate}"' in html_str:
            return candidate
    raise ValueError(
        "could not locate a deliverable JSON data block; expected one of "
        f"{list(_DELIVERABLE_BLOCK_IDS)} — pass block_id explicitly"
    )


def append_wireframe_data(
    html_path: str,
    wireframe_entry: dict,
    block_id: str | None = None,
    *,
    substrate_path: str | None = None,
    skip_gate: bool = False,
) -> None:
    """Append a wireframe entry to the deliverable's ``wireframes[]`` JSON array.

    Replaces the static-substrate splice from the v4.x ``append_wireframe_page``
    helper. Both audit (``audit-findings-data``) and wireframing
    (``wireframes-findings-data``) deliverables embed a ``wireframes[]`` array
    of page entries (chrome, sections[], elements[]...). This helper appends a
    new entry; the runtime renderer picks it up on the next page load.

    Idempotent: if a wireframe entry with the same ``slug`` is already present
    in ``wireframes[]``, the helper returns without modifying the file.

    **Pre-save coverage gate.** When the appended entry is reverse-mode
    (``extractionMode == 'phantom-browser'``), the gate runs
    ``compute_section_coverage`` against the substrate before the splice.
    Failures raise ``CoverageGateError``. Forward-mode entries skip the gate
    naturally. Tests and synthetic-fixture appends pass ``skip_gate=True``
    to bypass.

    Args:
        html_path:        Path to the deliverable HTML file.
        wireframe_entry:  Dict matching the wireframes[] entry shape (must
                          include a ``slug`` field).
        block_id:         JSON data block id. Auto-detected from the file
                          (``audit-findings-data`` then
                          ``wireframes-findings-data``) when ``None``.
        substrate_path:   For the coverage gate: ``None`` derives the substrate
                          path from convention
                          (``<html_parent>/current-website/audit-feed/layouts/{slug}-1.json``);
                          ``str`` overrides with an explicit path.
        skip_gate:        Bypass the coverage gate. Default False.

    Raises:
        FileNotFoundError: If *html_path* does not exist, or if the gate
                           cannot locate substrate.
        ValueError:        If *wireframe_entry* lacks a ``slug``, or no
                           recognized data block is present.
        CoverageGateError: If the gate fails closed on a reverse-mode entry.
    """
    path = Path(html_path)
    if not path.exists():
        raise FileNotFoundError(
            f"append_wireframe_data: file not found at {html_path!r}"
        )
    if "slug" not in wireframe_entry:
        raise ValueError(
            "append_wireframe_data: wireframe_entry must include a 'slug' field"
        )

    # Pre-save gate — scope the check to this entry's slug so cross-entry
    # validation doesn't fire when another already-appended entry is unrelated.
    _maybe_run_coverage_gate(
        html_path,
        [wireframe_entry],
        substrate_path=substrate_path,
        skip_gate=skip_gate,
        target_slugs={wireframe_entry["slug"]},
    )

    html_str = path.read_text(encoding="utf-8")
    resolved_block_id = _resolve_deliverable_block_id(html_str, block_id)

    with with_data_block(str(path), resolved_block_id) as data:
        entries = data.setdefault("wireframes", [])
        if any(
            isinstance(e, dict) and e.get("slug") == wireframe_entry["slug"]
            for e in entries
        ):
            return
        entries.append(wireframe_entry)


def save_wireframe_template_json(
    client_path: str,
    template_slug: str,
    entry_json: dict,
) -> Path:
    """Persist one per-template wireframe JSON entry to ``current-website/mapping/``.

    Used by Reverse Wireframing Step 5 (orchestrating agent assembly) on IDE/CLI
    platforms — for each subagent's returned wireframe entry, save the JSON
    object alongside the consolidated ``wireframes.html``. Web-class platforms
    (claude-web, chatgpt-web, gemini-gem) skip this helper because filesystem
    write isn't available there.

    Idempotent: re-running with the same ``template_slug`` overwrites the
    existing file with the new ``entry_json`` payload. The helper does not
    diff against existing content — last write wins.

    Args:
        client_path:    Absolute or project-relative path to the project root
                        (i.e. ``projects/{client}/``). The helper writes to
                        ``{client_path}/current-website/mapping/{slug}.json``.
        template_slug:  Slug for the template (e.g. ``"home"``, ``"product"``).
                        Used as the filename stem.
        entry_json:     The wireframe entry dict returned by the subagent —
                        conforms to ``wireframes[]`` shape per
                        ``references/wireframing/wireframing-schema.md``.

    Returns:
        Path to the written file.

    Raises:
        ValueError: If *template_slug* is empty or *entry_json* is not a dict.
    """
    if not template_slug:
        raise ValueError(
            "save_wireframe_template_json: template_slug must be non-empty"
        )
    if not isinstance(entry_json, dict):
        raise ValueError(
            "save_wireframe_template_json: entry_json must be a dict"
        )

    mapping_dir = Path(client_path) / "current-website" / "mapping"
    mapping_dir.mkdir(parents=True, exist_ok=True)
    target = mapping_dir / f"{template_slug}.json"
    target.write_text(
        json.dumps(entry_json, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return target


_FINDING_CHANNELS = ("strategy", "wireframe", "questions")


def append_finding(
    html_path: str,
    finding: dict,
    channel: str,
    block_id: str | None = None,
) -> None:
    """Append a finding (or question) entry to a deliverable JSON channel.

    Channels:
      - ``strategy``  — site-plan findings (cross-page archetype/IA)
      - ``wireframe`` — anatomy findings (page-scoped, optionally element-scoped)
      - ``questions`` — post-audit strategic intent questions

    Idempotent: if an entry with the same ``id`` is already present in the
    target channel, the helper returns without modifying the file.

    Args:
        html_path:  Path to the deliverable HTML file.
        finding:    Dict matching the channel's entry shape (must include
                    an ``id`` field).
        channel:    One of :data:`_FINDING_CHANNELS`.
        block_id:   JSON data block id. Auto-detected when ``None``.

    Raises:
        FileNotFoundError: If *html_path* does not exist.
        ValueError:        If *channel* is not recognized, *finding* lacks
                           an ``id``, or no recognized data block is present.
    """
    if channel not in _FINDING_CHANNELS:
        raise ValueError(
            f"append_finding: unknown channel {channel!r}; expected one of "
            f"{list(_FINDING_CHANNELS)}"
        )
    path = Path(html_path)
    if not path.exists():
        raise FileNotFoundError(
            f"append_finding: file not found at {html_path!r}"
        )
    if "id" not in finding:
        raise ValueError("append_finding: finding must include an 'id' field")

    html_str = path.read_text(encoding="utf-8")
    resolved_block_id = _resolve_deliverable_block_id(html_str, block_id)

    with with_data_block(str(path), resolved_block_id) as data:
        entries = data.setdefault(channel, [])
        if any(
            isinstance(e, dict) and e.get("id") == finding["id"] for e in entries
        ):
            return
        entries.append(finding)


_KIND_TO_BLOCK_ID = {
    "context": "context-data",
    "strategy": "strategy-data",
    "section-map": "section-map-data",
    "inventory": "inventory-data",
}


def _md_paths_for(client_slug: str, kind: str, projects_root: str) -> list[Path]:
    """Return ordered MD candidate paths for a given (client_slug, kind) pair."""
    base = Path(projects_root) / client_slug
    cw = base / "current-website"
    if kind == "context":
        return [base / f"{client_slug}_project_context.md", cw / "project_context.md"]
    if kind == "strategy":
        return [base / f"{client_slug}_ux_strategy.md", cw / "ux-strategy.md"]
    if kind == "inventory":
        return [base / f"{client_slug}_template_inventory.md"]
    if kind == "section-map":
        # Section-map data lives co-located with strategy in the MD source —
        # ux_strategy.md narrative + the <!-- section_map_data --> JSON block.
        # First-pass parser returns the strategy MD's heading dict; consumers
        # pull section-map data by inspecting the embedded JSON block or the
        # relevant headings. HTML fallback returns the unpacked items[] from
        # #section-map-data which is canonical-shaped.
        return [base / f"{client_slug}_ux_strategy.md", cw / "ux-strategy.md"]
    return []


def _html_paths_for(client_slug: str, projects_root: str) -> list[Path]:
    """Return ordered HTML candidate paths (root project plan, then current-site variant)."""
    base = Path(projects_root) / client_slug
    return [
        base / f"{client_slug}_project_plan.html",
        base / "current-website" / "project_plan.html",
    ]


def _slug_heading(heading: str) -> str:
    """Normalize a heading like 'Project Overview' to 'project_overview'."""
    return re.sub(r"[^a-z0-9]+", "_", heading.lower()).strip("_")


def _parse_md_headings(md_path: Path) -> dict[str, str]:
    """First-pass MD parser: split on H1/H2 headings, return ``{slug_heading: body_text}``.

    Body text is the raw markdown between the heading and the next H1/H2 (deeper
    headings stay inside the parent block). Embedded ``<!-- marker -->`` JSON
    fence blocks are preserved in the body as-is — the consumer can post-parse
    if it needs structured access. Per FIN-004, this is a first-pass parser;
    iteration is expected once real-project MDs surface gaps.
    """
    text = md_path.read_text(encoding="utf-8")
    sections: dict[str, str] = {}
    current_key: str | None = None
    current_lines: list[str] = []
    for line in text.splitlines():
        m = re.match(r"^(#{1,2})\s+(.+?)\s*$", line)
        if m:
            if current_key is not None:
                sections[current_key] = "\n".join(current_lines).strip()
            current_key = _slug_heading(m.group(2))
            current_lines = []
        else:
            if current_key is not None:
                current_lines.append(line)
    if current_key is not None:
        sections[current_key] = "\n".join(current_lines).strip()
    return sections


def _unpack_render_items(data: dict) -> dict[str, Any]:
    """Unpack render-shaped ``items[]`` into a field-keyed dict.

    Maps each item to a field name derived from its ``id``: ``context-id-goal``
    → ``goal``, ``strategy-id-sitemap`` → ``sitemap``. The value is the layout's
    primary content payload (``ranked`` for ranked-list, ``scope_split`` for
    scope-split, ``content`` otherwise). Items with ``group: project-specific``
    are gathered under a top-level ``domain`` key.
    """
    fields: dict[str, Any] = {}
    domain: dict[str, Any] = {}
    for item in data.get("items", []) or []:
        item_id = item.get("id", "")
        field = re.sub(r"^.+?-id-", "", item_id).replace("-", "_")
        layout = item.get("layout")
        if layout == "ranked-list":
            value = item.get("ranked", [])
        elif layout == "scope-split":
            value = item.get("scope_split", {})
        else:
            value = item.get("content", {})
        if item.get("group") == "project-specific":
            domain[field] = value
        else:
            fields[field] = value
    if domain:
        fields["domain"] = domain
    return fields


def read_workflow_artifact(
    client_slug: str,
    kind: str,
    projects_root: str = "projects",
) -> dict:
    """Dual-path read: prefer MD if present, fall back to Project Plan HTML JSON.

    *kind* selects the artifact: ``context`` / ``strategy`` / ``inventory`` /
    ``section-map``. The function checks the MD path first (which is faster for
    the agent to read than nested JSON) and falls back silently to the HTML
    JSON block when MD is absent. Both code paths are first-class; no warning
    is emitted on fallback.

    Returns an envelope: ``{"_source": "md"|"html", "_path": str, "fields": dict}``.
    The *fields* dict is keyed by canonical field names. From MD, keys are
    snake-cased H1/H2 heading names with section bodies as raw text. From HTML,
    keys are item-id suffixes with layout content as the value (see
    :func:`_unpack_render_items`).

    Args:
        client_slug:    Project folder slug under *projects_root*.
        kind:           One of ``context``, ``strategy``, ``inventory``, ``section-map``.
        projects_root:  Root projects directory. Default ``"projects"``.

    Raises:
        ValueError:        If *kind* is not recognized.
        FileNotFoundError: If neither an MD nor an HTML source is found.
    """
    if kind not in _KIND_TO_BLOCK_ID:
        raise ValueError(
            f"read_workflow_artifact: unknown kind {kind!r}; "
            f"expected one of {sorted(_KIND_TO_BLOCK_ID)}"
        )
    for md_path in _md_paths_for(client_slug, kind, projects_root):
        if md_path.exists():
            return {
                "_source": "md",
                "_path": str(md_path),
                "fields": _parse_md_headings(md_path),
            }
    for html_path in _html_paths_for(client_slug, projects_root):
        if html_path.exists():
            data = read_project_plan_block(str(html_path), _KIND_TO_BLOCK_ID[kind])
            return {
                "_source": "html",
                "_path": str(html_path),
                "fields": _unpack_render_items(data),
            }
    raise FileNotFoundError(
        f"read_workflow_artifact: no MD or HTML source found for "
        f"client_slug={client_slug!r}, kind={kind!r} under {projects_root!r}"
    )


# ============================================================
# data_block_mutator — path-navigation and in-place mutation helpers
# ============================================================


def navigate(data: Any, steps: list) -> Any:
    """Traverse a nested dict/list structure and return the target node by reference.

    Each step in *steps* is one of:
      - ``(key,)`` — dict access: returns ``current[key]``
      - ``(key, field, expected_value)`` — list traversal: returns the first
        item in ``current[key]`` where ``item[field] == expected_value``

    Returns the live reference so callers can mutate the target directly.

    Args:
        data:   Root data dict (e.g. the dict from extract_data_block).
        steps:  List of step tuples as described above.

    Returns:
        The target node (dict, list, or scalar) reached by following all steps.

    Raises:
        KeyError:   If a dict key is missing at any step.
        ValueError: If a list traversal step finds no matching item.

    Example:
        cell = navigate(data, [("variants", "slug", "umbrella"), ("cells", "id", "cell-icp")])
    """
    current = data
    for step in steps:
        if len(step) == 1:
            key = step[0]
            if not isinstance(current, dict) or key not in current:
                raise KeyError(
                    f"navigate: key {key!r} not found in current node "
                    f"(node type: {type(current).__name__})"
                )
            current = current[key]
        elif len(step) == 3:
            key, field, expected_value = step
            if not isinstance(current, dict) or key not in current:
                raise KeyError(
                    f"navigate: key {key!r} not found in current node "
                    f"(node type: {type(current).__name__})"
                )
            collection = current[key]
            if not isinstance(collection, list):
                raise ValueError(
                    f"navigate: expected a list at {key!r}, got {type(collection).__name__}"
                )
            match = next(
                (item for item in collection if item.get(field) == expected_value),
                None,
            )
            if match is None:
                raise ValueError(
                    f"navigate: no item with {field}={expected_value!r} in {key!r}"
                )
            current = match
        else:
            raise ValueError(
                f"navigate: each step must be a 1- or 3-tuple; got {step!r}"
            )
    return current


def append_to(data: Any, steps: list, new_item: Any) -> None:
    """Navigate to the list at *steps* and append *new_item*.

    The last step in *steps* must resolve to a list. Mutates the list in place.

    Args:
        data:     Root data dict.
        steps:    Navigation steps (see navigate docstring). Last step must
                  point to a list.
        new_item: Item to append.

    Raises:
        ValueError: If the target node is not a list.

    Example:
        append_to(data, [("wireframes", 0, None), ("sections", 6, None),
                         ("elements", 2, None), ("children",)], new_testimonial)

        # More typical usage with slug/id traversal:
        append_to(data, [("variants", "slug", "umbrella"),
                         ("cells", "id", "cell-problem"), ("alternatives",)], alt_obj)
    """
    target = navigate(data, steps)
    if not isinstance(target, list):
        raise ValueError(
            f"append_to: target resolved to {type(target).__name__}, expected list"
        )
    target.append(new_item)


def patch_fields(data: Any, updates: list[tuple]) -> None:
    """Apply a batch of field patches to a data dict.

    For each entry in *updates* — a (steps, field_name, new_value) triple —
    navigate to the target node using *steps*, then set
    ``target[field_name] = new_value`` in place.

    Args:
        data:    Root data dict.
        updates: List of (steps, field_name, new_value) triples.
                 *steps* follows the navigate convention. *field_name* is the
                 dict key to set on the resolved target node.

    Example:
        patch_fields(data, [
            ([("chrome", "nav", None), ("cta",)], "label", "Rezerwuj konsultację"),
            ([("variants", "slug", "umbrella"), ("cells", "id", "cell-icp"),
              ("rec", "evidence", 2)], "content", "Nowa treść"),
        ])
    """
    for steps, field_name, new_value in updates:
        target = navigate(data, steps)
        target[field_name] = new_value


# ============================================================
# html_inspector — debug / validation helpers
# ============================================================


def summarize(data_dict: dict) -> dict:
    """Return a diagnostic summary of a wireframes or messaging data block.

    Inspects the top-level structure of *data_dict* and returns a flat dict
    of key metrics useful for quick sanity-checks and debug output.

    Args:
        data_dict: Parsed JSON data block (from extract_data_block).

    Returns:
        Dict with keys:
          ``top_level_keys``      (list[str])  — sorted list of top-level keys
          ``sections_count``      (int)        — number of sections in the first
                                                 wireframe (0 if not applicable)
          ``elements_per_section``(dict)       — {section_index: element_count}
                                                 for wireframes shapes
          ``chrome_present``      (bool)       — True if a "chrome" key exists
          ``has_variants``        (bool)       — True if a "variants" key exists
          ``variants_count``      (int)        — number of variants (0 if absent)

    Example:
        info = summarize(data); print(info["sections_count"])
    """
    top_level_keys = sorted(data_dict.keys())
    chrome_present = "chrome" in data_dict
    has_variants = "variants" in data_dict
    variants_count = len(data_dict["variants"]) if has_variants else 0

    sections_count = 0
    elements_per_section: dict[Any, int] = {}

    wireframes = data_dict.get("wireframes")
    if isinstance(wireframes, list) and wireframes:
        sections = wireframes[0].get("sections", [])
        sections_count = len(sections)
        for idx, section in enumerate(sections):
            elements_per_section[idx] = len(section.get("elements", []))

    return {
        "top_level_keys": top_level_keys,
        "sections_count": sections_count,
        "elements_per_section": elements_per_section,
        "chrome_present": chrome_present,
        "has_variants": has_variants,
        "variants_count": variants_count,
    }


def validate_html_deliverable(
    path: Path | str | None = None,
    html_str: str | None = None,
    min_bytes: int = 5000,
) -> dict:
    """Structural sanity-check for a generated HTML deliverable file.

    Catches catastrophic truncation or malformation — e.g. an agent-authored
    regex script that accidentally writes back only the matched capture
    groups, losing DOCTYPE, head, body, and closing tags. Visual review
    can miss this when the surviving content still renders *something*.

    Exactly one of *path* or *html_str* must be provided.

    Args:
        path:      Path to HTML file (str or Path). Read as UTF-8.
        html_str:  Alternative: HTML content as a string.
        min_bytes: Minimum expected UTF-8 byte size. Catches dramatic
                   truncation. Default 5000 — typical deliverable templates
                   render to 50KB+; a 5KB floor flags near-empty outputs
                   without false-positives on legitimate small fragments.

    Returns:
        Dict with:
          ``status``    "ok" | "broken"
          ``issues``    list[str] — hard problems (drive non-zero exit)
          ``warnings``  list[str] — soft problems (informational; do not
                        change exit status). Includes the FIN-011 uniqueness
                        lints (element ``id`` within a wireframe entry tree;
                        ``attached_to`` within ``wireframe[]``).
          ``stats``     dict — bytes, lines, script_open, script_close,
                        json_blocks

    Example:
        r = validate_html_deliverable(path="out.html")
        if r["status"] != "ok": print(r["issues"])
    """
    if html_str is None:
        if path is None:
            raise ValueError("Provide either path or html_str")
        src = Path(path).read_text(encoding="utf-8")
    else:
        src = html_str

    issues: list[str] = []
    warnings: list[str] = []
    stats: dict[str, Any] = {
        "bytes": len(src.encode("utf-8")),
        "lines": src.count("\n") + 1,
    }

    if stats["bytes"] < min_bytes:
        issues.append(
            f"file below size floor: {stats['bytes']} bytes < {min_bytes} minimum"
        )

    lower = src.lower()
    if not lower.lstrip().startswith("<!doctype"):
        issues.append("missing <!DOCTYPE html> declaration at document start")
    if "<html" not in lower:
        issues.append("no <html> opening tag")
    if "</html>" not in lower:
        issues.append("no </html> closing tag")
    if "<head" not in lower:
        issues.append("no <head> tag")
    if "<body" not in lower:
        issues.append("no <body> tag")

    # <script> tag balance — informational, not a hard issue.
    # Naive regex counts inflate when JS/HTML comments contain literal
    # `<script>` substrings (e.g. comments documenting data-block ids).
    # Truncation is already caught by size floor + DOCTYPE + html/head/body
    # + JSON parse — which are the load-bearing checks. Imbalance is reported
    # as a stat for diagnostic context only.
    opens = len(re.findall(r"<script\b", src, re.IGNORECASE))
    closes = len(re.findall(r"</script>", src, re.IGNORECASE))
    stats["script_open"] = opens
    stats["script_close"] = closes

    # Anchor to line start so we don't pick up <script type="application/json">
    # references that appear inside JS or HTML comments documenting the data
    # block id (a real-world false-positive pattern in templates).
    json_blocks = re.findall(
        r'(?:^|\n)\s*<script[^>]*type="application/json"[^>]*>(.*?)</script>',
        src,
        re.DOTALL | re.IGNORECASE,
    )
    stats["json_blocks"] = len(json_blocks)
    for i, body in enumerate(json_blocks):
        try:
            data = json.loads(body)
        except json.JSONDecodeError as e:
            issues.append(
                f"JSON data block #{i}: parse error at line {e.lineno} col {e.colno}: {e.msg}"
            )
            continue
        warnings.extend(_uniqueness_lint(data, block_index=i))

    return {
        "status": "ok" if not issues else "broken",
        "issues": issues,
        "warnings": warnings,
        "stats": stats,
    }


def _walk_element_ids(node: Any) -> Generator[str, None, None]:
    """Yield every ``id`` value found in a wireframe entry's element tree.

    Recurses through ``sections[]`` → ``elements[]`` → ``children[]`` (any
    depth), yielding the ``id`` of each dict that declares one. Lists and
    dicts both descend; scalars are skipped.
    """
    if isinstance(node, dict):
        if isinstance(node.get("id"), str):
            yield node["id"]
        for value in node.values():
            yield from _walk_element_ids(value)
    elif isinstance(node, list):
        for item in node:
            yield from _walk_element_ids(item)


def _uniqueness_lint(data: Any, block_index: int) -> list[str]:
    """FIN-011 warn-only lints over a parsed deliverable JSON block.

    Returns a list of warning strings. Two checks:
      (a) Element ``id`` values are unique within a single ``wireframes[]``
          entry's element tree (``sections[].elements[].children[]...``).
          Duplicates within the same wireframe entry are warned per entry.
      (b) ``wireframe[]`` finding ``attached_to`` values are unique within
          the array (one-finding-per-element discipline).
    """
    out: list[str] = []
    if not isinstance(data, dict):
        return out

    wireframes = data.get("wireframes")
    if isinstance(wireframes, list):
        for entry in wireframes:
            if not isinstance(entry, dict):
                continue
            slug = entry.get("slug", "?")
            seen: dict[str, int] = {}
            # Skip the wireframe entry's own top-level "id" (it's the page-level
            # id, not part of the element tree). Walk only sections[] downward.
            for el_id in _walk_element_ids(entry.get("sections", [])):
                seen[el_id] = seen.get(el_id, 0) + 1
            dupes = sorted(k for k, v in seen.items() if v > 1)
            if dupes:
                out.append(
                    f"JSON block #{block_index} wireframes[slug={slug!r}]: "
                    f"duplicate element ids: {dupes}"
                )

    findings = data.get("wireframe")
    if isinstance(findings, list):
        attached: dict[str, int] = {}
        for f in findings:
            if isinstance(f, dict) and isinstance(f.get("attached_to"), str):
                key = f["attached_to"]
                attached[key] = attached.get(key, 0) + 1
        dupes = sorted(k for k, v in attached.items() if v > 1)
        if dupes:
            out.append(
                f"JSON block #{block_index} wireframe[]: duplicate "
                f"attached_to values (one-finding-per-element): {dupes}"
            )

    return out


def validate_against(data_dict: dict, schema: dict) -> list[str]:
    """Lightweight JSON-Schema-ish validation against a simple schema dict.

    Checks presence and type of required keys. Supports a narrow schema shape
    sufficient for data-block integrity checks without any pip dependencies.

    Supported schema keys:
      ``required``  (list[str]) — keys that must be present at the top level
      ``types``     (dict)      — maps key names to expected type strings:
                                  "str", "dict", "list", "int", "float", "bool"

    Args:
        data_dict: The data dict to validate.
        schema:    Schema dict with optional "required" and "types" entries.

    Returns:
        List of error strings. Empty list means the dict passes all checks.

    Example:
        errors = validate_against(data, {"required": ["wireframes", "chrome"],
                                         "types": {"wireframes": "list"}})
    """
    TYPE_MAP = {
        "str": str,
        "dict": dict,
        "list": list,
        "int": int,
        "float": float,
        "bool": bool,
    }
    errors: list[str] = []

    for key in schema.get("required", []):
        if key not in data_dict:
            errors.append(f"missing required key: {key!r}")

    for key, type_name in schema.get("types", {}).items():
        if key not in data_dict:
            continue  # already caught by required check if applicable
        expected_type = TYPE_MAP.get(type_name)
        if expected_type is None:
            errors.append(f"unknown type specifier {type_name!r} for key {key!r}")
            continue
        if not isinstance(data_dict[key], expected_type):
            actual = type(data_dict[key]).__name__
            errors.append(
                f"key {key!r}: expected {type_name}, got {actual}"
            )

    return errors


_TEXT_FIELD_NAMES = (
    "text",
    "label",
    "title",
    "subtitle",
    "heading",
    "description",
    "body",
    "caption",
    "value",
    "name",
    "role",
    "quote",
    "author",
    "placeholder",
    "eyebrow",
)


def _gather_wireframe_text_fields(node: Any, out: list[str]) -> None:
    """Recursively collect all text-bearing field values from a wireframe entry."""
    if isinstance(node, dict):
        for k, v in node.items():
            if k in _TEXT_FIELD_NAMES and isinstance(v, str) and v.strip():
                out.append(v.strip())
            elif isinstance(v, (dict, list)):
                _gather_wireframe_text_fields(v, out)
    elif isinstance(node, list):
        for item in node:
            _gather_wireframe_text_fields(item, out)


_DEFAULT_COVERAGE_TAGS = ("p", "h1", "h2", "h3", "h4", "h5", "h6", "li")


def coverage_check_substrate(
    substrate: dict,
    wireframe_entry: dict,
    include_tags: tuple[str, ...] = _DEFAULT_COVERAGE_TAGS,
) -> dict:
    """Compare substrate text content against wireframe entry text fields.

    Audit Step 5.1 and RW Step 5 produce a wireframe entry from a Phantom-Browser
    layout-map substrate. A naive coverage check that compares element kinds
    (substrate ``<p>`` vs wireframe ``button``/``link``) produces false
    positives whenever the page renders a paragraph as a button label or link
    label. This helper compares **text content** instead — every substrate text
    must appear (as substring, case-insensitive) somewhere in the wireframe
    entry's text fields, regardless of which element kind carries it.

    Compound texts (substrate paragraph containing newline-separated semantic
    pieces — e.g. ``"Heading\\nLong description on next line"``) are split into
    parts and matched independently.

    Args:
        substrate:        Phantom-Browser ``/api/layout-map`` response dict
                          with a ``nodes`` array. Each node has at minimum
                          ``tag``, ``text`` fields.
        wireframe_entry:  One ``wireframes[]`` entry conforming to
                          ``references/wireframing/wireframing-schema.md``.
        include_tags:     Substrate tags to check (default: text-bearing tags
                          ``p``/``h1``-``h6``/``li``).

    Returns:
        Dict with keys:
        - ``matched`` (int): substrate text fragments fully covered.
        - ``missing`` (list[dict]): unmatched fragments. Each entry:
          ``{"index": substrate_node_index, "tag": tag, "text": "<missing fragment>"}``.
          Compound paragraphs may contribute more than one entry.
        - ``substrate_count`` (int): total substrate text fragments checked
          (post-newline-split).
        - ``compound_paragraphs`` (int): count of substrate nodes whose text
          split into multiple fragments on newlines.

        ``len(missing) == 0`` means full coverage; the wireframe entry's text
        fields contain every substrate text fragment.

    Example:
        >>> import json
        >>> sub = json.load(open("layouts/home-1.json", encoding="utf-8"))
        >>> wf = json.load(open("mapping/home.json", encoding="utf-8"))
        >>> report = coverage_check_substrate(sub, wf)
        >>> if report["missing"]:
        ...     print(f"{len(report['missing'])} substrate texts not in wireframe")
    """
    nodes = substrate.get("nodes", []) if isinstance(substrate, dict) else []
    wf_texts: list[str] = []
    _gather_wireframe_text_fields(wireframe_entry, wf_texts)
    wf_blob = " || ".join(wf_texts).lower()

    matched = 0
    missing: list[dict] = []
    total = 0
    compound = 0

    for node in nodes:
        if not isinstance(node, dict):
            continue
        tag = node.get("tag")
        if tag not in include_tags:
            continue
        raw = node.get("text")
        if not isinstance(raw, str) or not raw.strip():
            continue
        parts = [p.strip() for p in raw.split("\n") if p.strip()]
        if len(parts) > 1:
            compound += 1
        for piece in parts:
            total += 1
            if piece.lower() in wf_blob:
                matched += 1
            else:
                missing.append(
                    {
                        "index": node.get("index"),
                        "tag": tag,
                        "text": piece,
                    }
                )

    return {
        "matched": matched,
        "missing": missing,
        "substrate_count": total,
        "compound_paragraphs": compound,
    }


# ============================================================
# json_inspector — CLI inspector for JSON arrays
# ============================================================
#
# Merged from ~/.claude/scripts/inspect_json.py.
# Supports layout-map responses (top-level `nodes[]` array) and any JSON
# with an array at a configurable JSON-pointer path.
#
# Invoke via the subcommand dispatcher at the bottom of this module:
#   python ux_utils.py inspect-json path/to/file.json [flags]

import argparse


DEFAULT_FIELDS = ["index", "parentIndex", "tag", "role", "text", "bounds"]


def resolve_pointer(data: Any, pointer: str) -> list[dict]:
    """Resolve a JSON-pointer-like slash path to an array.

    Empty pointer or "/" returns the top-level array if data is a list;
    otherwise tries common container keys in priority order.

    Args:
        data:    Parsed JSON value (list or dict).
        pointer: Slash-delimited path string (e.g. "/nodes" or "/sections/0").
                 Pass "" or "/" for auto-detect.

    Returns:
        The resolved list of dicts.

    Raises:
        SystemExit: If the pointer cannot be resolved or target is not a list.
    """
    if pointer in ("", "/"):
        if isinstance(data, list):
            return data
        for key in ("nodes", "sections", "elements", "items", "children"):
            if isinstance(data, dict) and isinstance(data.get(key), list):
                return data[key]
        raise SystemExit("Could not locate a top-level array; pass --pointer /<key>")
    node = data
    for seg in pointer.strip("/").split("/"):
        if isinstance(node, dict) and seg in node:
            node = node[seg]
        elif isinstance(node, list) and seg.isdigit():
            node = node[int(seg)]
        else:
            raise SystemExit(f"Pointer segment '{seg}' not found")
    if not isinstance(node, list):
        raise SystemExit(f"Pointer target at '{pointer}' is not an array")
    return node


def apply_filters(rows: list[dict], args: argparse.Namespace) -> list[dict]:
    """Apply index / range / tag / y-bounds filters to a row list.

    Args:
        rows: List of row dicts to filter.
        args: Parsed argparse namespace from ``parse_inspector_args``.

    Returns:
        Filtered list (may be empty).
    """
    out = rows

    if args.indices:
        wanted = {int(x) for x in args.indices.split(",")}
        out = [r for r in out if r.get("index") in wanted]
    else:
        if args.skip:
            out = out[args.skip:]
        if args.take:
            out = out[: args.take]
        if args.from_ is not None:
            out = [r for r in out if r.get("index", 0) >= args.from_]
        if args.to is not None:
            out = [r for r in out if r.get("index", 0) <= args.to]

    if args.tag:
        tags = {t.strip() for t in args.tag.split(",")}
        out = [r for r in out if (r.get("tag") or "") in tags]

    if args.y_min is not None or args.y_max is not None:
        lo = args.y_min if args.y_min is not None else -(10 ** 9)
        hi = args.y_max if args.y_max is not None else 10 ** 9

        def in_range(r: dict) -> bool:
            y = (r.get("bounds") or {}).get("y", 0)
            try:
                return lo <= int(y) <= hi
            except Exception:
                return False

        out = [r for r in out if in_range(r)]

    return out


def format_cell(value: Any, text_len: int) -> str:
    """Format a single cell value for table or line output.

    Args:
        value:    The field value to format (any JSON-decodable type).
        text_len: Maximum character length for string fields before truncation.

    Returns:
        A printable string representation of the value.
    """
    if value is None:
        return ""
    if isinstance(value, dict):
        if "x" in value and "y" in value:
            return (
                f"[{int(value.get('x', 0))},{int(value.get('y', 0))} "
                f"{int(value.get('width', 0))}x{int(value.get('height', 0))}]"
            )
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, str):
        v = value.replace("\n", " ").replace("\t", " ").strip()
        if len(v) > text_len:
            v = v[: text_len - 1] + "…"
        return v
    return str(value)


def parse_inspector_args(argv: list[str] | None = None) -> argparse.Namespace:
    """Build and parse the argument parser for the inspect-json subcommand.

    Args:
        argv: Argument list (excluding the subcommand token itself).
              Pass ``None`` to read from ``sys.argv[1:]``.

    Returns:
        Parsed ``argparse.Namespace``.
    """
    p = argparse.ArgumentParser(
        prog="ux_utils.py inspect-json",
        description="Flatten + filter + print a JSON array (layout-map / Phantom output).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("path", type=Path, help="JSON file to read")
    p.add_argument(
        "--pointer",
        default="",
        help="JSON pointer to the array (default: auto-detect nodes/sections/etc.)",
    )
    p.add_argument(
        "--fields",
        default=",".join(DEFAULT_FIELDS),
        help="Comma-separated field names to print",
    )
    p.add_argument(
        "--from",
        dest="from_",
        type=int,
        default=None,
        help="Minimum `index` field value",
    )
    p.add_argument("--to", type=int, default=None, help="Maximum `index` field value")
    p.add_argument(
        "--skip",
        type=int,
        default=None,
        help="Skip the first N rows (applied after pointer resolve, before filters)",
    )
    p.add_argument(
        "--take",
        type=int,
        default=None,
        help="Take the first N rows after skip",
    )
    p.add_argument(
        "--indices",
        default="",
        help="Comma-separated list of exact `index` values to match",
    )
    p.add_argument(
        "--tag",
        default="",
        help="Comma-separated HTML tag filter (for layout-map)",
    )
    p.add_argument("--y-min", dest="y_min", type=int, default=None, help="Minimum bounds.y")
    p.add_argument("--y-max", dest="y_max", type=int, default=None, help="Maximum bounds.y")
    p.add_argument(
        "--text-len",
        dest="text_len",
        type=int,
        default=60,
        help="Truncate string fields to N chars (default 60)",
    )
    p.add_argument(
        "--format",
        choices=["line", "table"],
        default="line",
        help="Output format",
    )
    return p.parse_args(argv)


def inspect_json_main(argv: list[str] | None = None) -> int:
    """Entry point for the inspect-json subcommand.

    Parses *argv* (the arguments after "inspect-json"), reads the JSON file,
    applies filters, and prints results to stdout.

    Args:
        argv: Argument list (after the "inspect-json" token). Pass ``None``
              to read from ``sys.argv[1:]``.

    Returns:
        Exit code (0 = success, 2 = file not found).
    """
    args = parse_inspector_args(argv)
    if not args.path.exists():
        print(f"Not found: {args.path}", file=sys.stderr)
        return 2

    data = json.loads(args.path.read_text(encoding="utf-8"))
    rows = resolve_pointer(data, args.pointer)
    filtered = apply_filters([r for r in rows if isinstance(r, dict)], args)
    fields = [f.strip() for f in args.fields.split(",") if f.strip()]

    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    print(f"Matched {len(filtered)} of {len(rows)} rows")

    if args.format == "table":
        cells = [
            [format_cell(r.get(f), args.text_len) for f in fields] for r in filtered
        ]
        widths = [
            max([len(f)] + [len(row[i]) for row in cells])
            for i, f in enumerate(fields)
        ]
        header = "  ".join(f.ljust(widths[i]) for i, f in enumerate(fields))
        print(header)
        print("-" * len(header))
        for row in cells:
            print("  ".join(row[i].ljust(widths[i]) for i in range(len(fields))))
    else:
        for r in filtered:
            parts = [f"{f}={format_cell(r.get(f), args.text_len)}" for f in fields]
            print("  ".join(parts))

    return 0


# ============================================================
# section_coverage — per-section coverage gate for reverse-mode wireframes
# ============================================================


class CoverageGateError(RuntimeError):
    """Raised by the pre-save coverage gate when a wireframe save is blocked.

    Carries a structured ``report`` payload with the failing-section list and
    per-section ratios for debugging. Callers that want to bypass the gate
    intentionally (tests, synthetic fixtures) pass ``skip_gate=True`` to the
    save helper.
    """

    def __init__(self, message: str, report: dict | None = None) -> None:
        super().__init__(message)
        self.report = report or {}


class ElementKindError(CoverageGateError):
    """Raised by the pre-save kind validator when a wireframe entry carries an
    element ``kind`` value that is neither in the closed-kind catalog
    (``_CORE_ELEMENT_KINDS``) nor a valid extension-kind envelope (per
    ``wireframing-schema.md §Extension kinds``).

    Subclass of :class:`CoverageGateError` so callers that already catch the
    coverage gate's exception class also catch kind-validation failures.
    Carries the same structured ``report`` payload shape.
    """


# Block IDs whose payload carries a ``wireframes[]`` array. The pre-save gate
# only fires for these block_ids; other blocks (context-data / strategy-data /
# inventory-data / messaging-data) carry no wireframes and bypass the gate
# trivially.
_WIREFRAME_BEARING_BLOCK_IDS = ("audit-findings-data", "wireframes-findings-data")


# Closed-kind catalog per ``references/wireframing/wireframing-schema.md
# §Element kinds``. The pre-save kind validator rejects any ``kind`` value
# that is neither in this set nor a valid extension-kind envelope.
_CORE_ELEMENT_KINDS = frozenset({
    "heading", "paragraph", "button", "link", "media", "label", "list",
    "field", "micro", "stat", "testimonial", "trust-bar", "banner",
    "grid", "card", "accordion",
})


# Short alias table for "did you mean X?" suggestions in the error message
# when an unknown kind is rejected. Keep small — if it grows past ~5 entries,
# drop the suggestion feature and just list valid kinds in the error.
_KIND_ALIAS_HINTS = {
    "eyebrow": "label",
    "cta": "button",
    "subtitle": "paragraph",
    "tagline": "paragraph",
}


def _derive_substrate_path(html_path: str, slug: str) -> Path:
    """Derive the conventional substrate JSON path from a deliverable
    ``html_path`` and a wireframe entry's ``slug``. Convention:

        <html_parent>/current-website/audit-feed/layouts/{slug}-1.json

    This matches the workflow-reverse-wireframing.md persistence path where
    Phantom-Browser substrate is saved per page.
    """
    return Path(html_path).parent / "current-website" / "audit-feed" / "layouts" / f"{slug}-1.json"


def _resolve_substrate_path_for_entry(
    html_path: str,
    entry: dict,
    substrate_path: dict | str | None,
) -> Path:
    """Pick the right substrate JSON path for a wireframe entry.

    - ``substrate_path`` is a dict mapping slug → path → look up by entry slug
    - ``substrate_path`` is a str → use it for all entries (single-page case)
    - ``substrate_path`` is None → derive from convention per
      ``_derive_substrate_path``
    """
    slug = entry.get("slug") or "?"
    if isinstance(substrate_path, dict):
        chosen = substrate_path.get(slug)
        if chosen is None:
            raise FileNotFoundError(
                f"substrate_path dict has no entry for slug {slug!r}"
            )
        return Path(chosen)
    if isinstance(substrate_path, str):
        return Path(substrate_path)
    return _derive_substrate_path(html_path, slug)


def _is_valid_extension_kind(el: dict) -> bool:
    """Extension-kind envelope check per ``wireframing-schema.md §Extension
    kinds``: kind is a lowercase-hyphen string (not a core kind), className
    starts with ``wf-ext-``, and exactly one of ``fields`` or ``children`` is
    present (XOR).
    """
    kind = el.get("kind")
    if not isinstance(kind, str) or kind in _CORE_ELEMENT_KINDS:
        return False
    class_name = el.get("className", "")
    if not isinstance(class_name, str) or not class_name.startswith("wf-ext-"):
        return False
    has_fields = isinstance(el.get("fields"), dict)
    has_children = isinstance(el.get("children"), list)
    return has_fields != has_children  # XOR — exactly one


def _walk_kinds(elements: list, slug: str, offenders: list) -> None:
    """Recurse through ``elements[].children[]...`` collecting any element
    whose ``kind`` is neither a core kind nor a valid extension envelope."""
    if not isinstance(elements, list):
        return
    for el in elements:
        if not isinstance(el, dict):
            continue
        kind = el.get("kind")
        if kind not in _CORE_ELEMENT_KINDS and not _is_valid_extension_kind(el):
            offenders.append({
                "slug": slug,
                "id": el.get("id"),
                "kind": kind,
                "suggestion": _KIND_ALIAS_HINTS.get(kind) if isinstance(kind, str) else None,
            })
        children = el.get("children")
        if isinstance(children, list):
            _walk_kinds(children, slug, offenders)


def _format_kind_error(offenders: list) -> str:
    """Build the ElementKindError message body from the offender list."""
    lines = ["element kind validator: unknown kind(s) found"]
    for o in offenders:
        suffix = f" (did you mean '{o['suggestion']}'?)" if o.get("suggestion") else ""
        id_part = f" id={o['id']!r}" if o.get("id") else ""
        lines.append(f"  slug={o['slug']!r}{id_part} kind={o['kind']!r}{suffix}")
    lines.append(
        f"valid core kinds: {', '.join(sorted(_CORE_ELEMENT_KINDS))}. "
        f"Extension kinds require className 'wf-ext-*' and exactly one of "
        f"fields/children. Pass skip_gate=True to bypass."
    )
    return "\n".join(lines)


def _validate_element_kinds(
    wireframes: list,
    *,
    skip_gate: bool,
    target_slugs: set | None = None,
) -> None:
    """Walk every element ``kind`` value across all wireframe entries and
    raise :class:`ElementKindError` on any unknown kind. Extension kinds
    with a proper ``wf-ext-*`` className and an ``fields``/``children`` XOR
    pass through legitimately.

    Bypasses cleanly when ``skip_gate`` is True or ``wireframes`` is not a
    list. Independent of reverse-mode — applies to forward-mode entries too,
    since a schema typo renders as ``EXT: <KIND>`` regardless of authoring
    path.

    Args:
        wireframes:   List of wireframe entries to check.
        skip_gate:    When True, the validator is bypassed entirely.
        target_slugs: Optional set restricting the check to specific entry
                      slugs (mirrors the coverage gate's target_slugs).
    """
    if skip_gate:
        return
    if not isinstance(wireframes, list):
        return
    offenders: list = []
    for entry in wireframes:
        if not isinstance(entry, dict):
            continue
        slug = entry.get("slug", "?")
        if target_slugs is not None and slug not in target_slugs:
            continue
        for section in entry.get("sections") or []:
            if not isinstance(section, dict):
                continue
            _walk_kinds(section.get("elements") or [], slug, offenders)
    if offenders:
        raise ElementKindError(
            _format_kind_error(offenders),
            report={"offenders": offenders},
        )


def _maybe_run_coverage_gate(
    html_path: str,
    wireframes: list,
    *,
    substrate_path: dict | str | None,
    skip_gate: bool,
    target_slugs: set | None = None,
) -> None:
    """Run the pre-save coverage gate against reverse-mode wireframe entries.

    Bypasses cleanly when ``skip_gate`` is True or when no entries are
    reverse-mode (``extractionMode == 'phantom-browser'``). Raises
    ``CoverageGateError`` when one or more entries fail sub-check 1
    (text-density). Sub-checks 2 and 3 are warning-only and do not block here.

    The kind validator (:func:`_validate_element_kinds`) runs first and is
    independent of reverse-mode — schema typos must be caught regardless of
    authoring path. The text-density gate then runs against reverse-mode
    entries only.

    Args:
        html_path:        The deliverable's HTML path — used to derive
                          substrate paths via convention.
        wireframes:       List of wireframe entries to check.
        substrate_path:   None → derive per slug from convention.
                          str → use for all entries (single-page case).
                          dict → map slug → path explicitly.
        skip_gate:        When True, both kind validation AND the text-density
                          gate are bypassed entirely.
        target_slugs:     Optional set restricting the check to specific
                          entry slugs (used by ``append_wireframe_data``
                          to scope the check to the appended entry).
    """
    _validate_element_kinds(
        wireframes,
        skip_gate=skip_gate,
        target_slugs=target_slugs,
    )
    if skip_gate:
        return
    if not isinstance(wireframes, list):
        return
    target = []
    for entry in wireframes:
        if not isinstance(entry, dict):
            continue
        if entry.get("extractionMode") != "phantom-browser":
            continue
        if target_slugs is not None and entry.get("slug") not in target_slugs:
            continue
        target.append(entry)
    if not target:
        return  # forward-mode or non-phantom — gate inert

    failing: list = []
    for entry in target:
        sub_path = _resolve_substrate_path_for_entry(html_path, entry, substrate_path)
        if not sub_path.exists():
            raise FileNotFoundError(
                f"coverage gate could not locate substrate for slug "
                f"{entry.get('slug')!r}: tried {sub_path}. Pass an explicit "
                f"substrate_path or skip_gate=True."
            )
        substrate = json.loads(sub_path.read_text(encoding="utf-8"))
        result = compute_section_coverage(substrate, entry)
        if not result["ok"]:
            for section in result["sections"]:
                if not section["ok"]:
                    failing.append({
                        "wireframe_slug": entry.get("slug"),
                        **section,
                    })

    if failing:
        slugs = sorted({f["wireframe_slug"] for f in failing})
        raise CoverageGateError(
            f"coverage gate failed: {len(failing)} section(s) below floor "
            f"across slug(s) {slugs}. Pass skip_gate=True to bypass.",
            report={"failing_sections": failing},
        )


# Absence-claim pattern for sub-check 3 (greppability warning). Captures the
# noun-phrase that follows an absence verb so we can grep it against the
# substrate haystack. Naive — the regex stops at the first sentence boundary
# or connecting conjunction. Scope-pinning (e.g. "no in-hero CTA" vs "no CTA"
# at page scope) is intentionally NOT handled this cycle (see project no-gos).
_ABSENCE_CLAIM_PATTERN = re.compile(
    r"\b(?:no|missing|lacks|doesn'?t\s+have|don'?t\s+have)\s+"
    r"([A-Za-z][A-Za-z0-9\s\-/]{2,40}?)"
    r"(?=[.,;:!?\)]|\s+(?:on|in|at|for|here|currently|yet|but|and|or)\b|$)",
    re.IGNORECASE,
)


def _build_substrate_haystack(substrate: dict) -> str:
    """Concatenate substrate text-bearing fields into a lowercase searchable
    blob for absence-claim greppability. Sources: node ``text``, ``alt``,
    ``href``, ``ariaLabel`` fields, plus normalized image-src filename stems."""
    parts: list[str] = []
    nodes = substrate.get("nodes") if isinstance(substrate, dict) else None
    if not isinstance(nodes, list):
        return ""
    for node in nodes:
        if not isinstance(node, dict):
            continue
        for key in ("text", "alt", "href", "ariaLabel"):
            val = node.get(key)
            if isinstance(val, str) and val.strip():
                parts.append(val)
        src = node.get("src")
        if isinstance(src, str) and src.strip():
            stem = src.rsplit("/", 1)[-1].rsplit(".", 1)[0]
            stem_clean = re.sub(r"[-_]\d+$", "", stem)
            parts.append(stem_clean)
    return " || ".join(parts).lower()


def _scan_for_absence_claims(
    texts: list[str],
    haystack_lower: str,
    source: str,
) -> list[dict]:
    """For each text in ``texts``, find absence-claim patterns and warn when
    the captured noun-phrase is greppable in ``haystack_lower``. Naive
    substring grep — false positives possible (per project no-gos)."""
    warnings: list[dict] = []
    if not haystack_lower:
        return warnings
    for text in texts:
        if not isinstance(text, str) or not text.strip():
            continue
        for match in _ABSENCE_CLAIM_PATTERN.finditer(text):
            noun_phrase = match.group(1).strip().lower()
            if len(noun_phrase) < 3:
                continue
            if noun_phrase in haystack_lower:
                warnings.append({
                    "kind": "absence-greppability",
                    "claim": match.group(0).strip(),
                    "noun_phrase": noun_phrase,
                    "source": source,
                })
    return warnings


def compute_section_coverage(
    substrate: dict,
    wireframe_entry: dict,
    *,
    paragraph_ratio: float = 0.6,
    figure_ratio: float = 0.5,
    h4_floor_threshold: int = 5,
    text_density_floor: float = 0.5,
    audit_findings: list[dict] | None = None,
) -> dict:
    """Compare substrate element counts to wireframe element counts per section.

    Walks the substrate subtree rooted at each section's ``top_level_node_index``,
    counts substrate ``<p>`` / ``<h4>`` / ``<figure>`` / ``<li>`` nodes, then
    counts equivalent kinds in the wireframe section's ``elements[]``
    (``paragraph`` / ``heading.level=4`` / ``media`` / ``list.items[]``).
    Compares against thresholds and returns a structured report.

    The function also runs a broader **text-density** check covering all
    text-bearing kinds (h1-h4, p, li, button-with-text, anchor-with-text on the
    substrate side; heading at any level, paragraph, button, link, label, micro,
    list items, stat, testimonial, banner, accordion item labels, and trust-bar
    items on the wireframe side). Sections below ``text_density_floor`` fail
    closed UNLESS the section's ``deliberations[]`` carries an explicit
    compression-semantic entry — a paraphrase / N-of-M / representative-subset
    choice the agent declared honors the substrate-fidelity §Compressible
    with deliberation discipline.

    Args:
        substrate:           Phantom-Browser ``/api/layout-map`` response dict
                             — must have a ``nodes`` array with each node
                             carrying ``index``, ``parentIndex``, ``tag``.
        wireframe_entry:     One ``wireframes[]`` entry — must have ``sections``,
                             each section optionally carrying
                             ``top_level_node_index`` (sections without it are
                             skipped — forward-mode or non-phantom substrate).
        paragraph_ratio:     Minimum ratio of emitted paragraphs vs substrate
                             ``<p>`` count per section. Default 0.6.
        figure_ratio:        Minimum ratio of emitted media vs substrate
                             ``<figure>`` count per section. Default 0.5.
        h4_floor_threshold:  Substrate ``<h4>`` count above which the section
                             must emit at least one h4-level heading.
                             Default 5.
        text_density_floor:  Minimum ratio of emitted text-bearing wireframe
                             elements vs substrate text-bearing nodes per
                             section. Default 0.5. Sections below this floor
                             fail unless the section emits a structured
                             ``compression`` object (see
                             ``section_has_compression``).

    Returns:
        Dict shape:
            {
                "ok": bool,                       # overall pass/fail
                "sections": [
                    {
                        "name": str,              # section.type or "?"
                        "top_level_node_index": int,
                        "ok": bool,
                        "substrate_counts": {"p": N, "h4": N, "figure": N, "li": N, "text_bearing": N},
                        "wireframe_counts": {"paragraph": N, "h4_heading": N, "media": N, "list_items": N, "text_bearing": N},
                        "text_density": {
                            "ratio": float,                   # wf_text_bearing / sub_text_bearing
                            "floor": float,                   # text_density_floor
                            "bypassed_by_compression": bool, # True if section.compression bypasses the floor
                        },
                        "failures": ["paragraphs 1/16 (need >=0.6x)", ...],
                    },
                    ...
                ],
            }

    Raises:
        ValueError: If substrate has no ``nodes`` array.

    Example:
        >>> sub = {"nodes": [{"index": 0, "parentIndex": None, "tag": "div"},
        ...                  {"index": 1, "parentIndex": 0, "tag": "p"}]}
        >>> wf = {"sections": [{"type": "hero", "top_level_node_index": 0,
        ...                    "elements": [{"kind": "paragraph"}]}]}
        >>> compute_section_coverage(sub, wf)["ok"]
        True
    """
    nodes = substrate.get("nodes")
    if not isinstance(nodes, list):
        raise ValueError("Substrate has no `nodes[]` array")

    children_by_parent: dict = {}
    nodes_by_index: dict = {}
    for n in nodes:
        idx = n.get("index")
        if idx is None:
            continue
        nodes_by_index[idx] = n
        parent = n.get("parentIndex")
        children_by_parent.setdefault(parent, []).append(idx)

    def descendant_tags(root_idx: int) -> list:
        out = []
        stack = list(children_by_parent.get(root_idx, []))
        while stack:
            idx = stack.pop()
            node = nodes_by_index.get(idx)
            if node is None:
                continue
            out.append(node.get("tag"))
            stack.extend(children_by_parent.get(idx, []))
        return out

    # Substrate text-bearing tags counted unconditionally (text presence assumed
    # for these structural tags). ``button`` and ``a`` are counted only when
    # their ``text`` field is non-empty — decorative buttons / image-wrapping
    # anchors with empty text are not text-bearing.
    _ALWAYS_TEXT_BEARING = {"h1", "h2", "h3", "h4", "p", "li"}
    _CONDITIONAL_TEXT_BEARING = {"button", "a"}

    def descendant_text_bearing(root_idx: int) -> int:
        """Count text-bearing descendants of ``root_idx`` for the broadened
        text-density check. Covers headings (h1-h4), paragraphs, list items,
        and buttons / anchors that carry visible text."""
        count = 0
        stack = list(children_by_parent.get(root_idx, []))
        while stack:
            idx = stack.pop()
            node = nodes_by_index.get(idx)
            if node is None:
                continue
            tag = node.get("tag")
            if tag in _ALWAYS_TEXT_BEARING:
                count += 1
            elif tag in _CONDITIONAL_TEXT_BEARING:
                text = node.get("text")
                if isinstance(text, str) and text.strip():
                    count += 1
            stack.extend(children_by_parent.get(idx, []))
        return count

    def count_wireframe_kinds(elements: list, accumulator: dict) -> None:
        for el in elements or []:
            if not isinstance(el, dict):
                continue
            kind = el.get("kind")
            if kind == "paragraph":
                accumulator["paragraph"] += 1
            elif kind == "heading" and el.get("level") == 4:
                accumulator["h4_heading"] += 1
            elif kind == "media":
                accumulator["media"] += 1
            elif kind == "list":
                items = el.get("items")
                if isinstance(items, list):
                    accumulator["list_items"] += len(items)
            for child_key in ("elements", "children", "rows", "columns"):
                val = el.get(child_key)
                if isinstance(val, list) and val and isinstance(val[0], dict):
                    count_wireframe_kinds(val, accumulator)

    # Wireframe element kinds that count toward the text-density numerator —
    # all kinds the renderer treats as carrying user-visible copy. Paired with
    # the substrate-side broadened set in ``descendant_text_bearing``.
    _TEXT_BEARING_KINDS = {
        "paragraph", "heading", "button", "link", "label", "micro",
        "stat", "testimonial", "banner",
    }

    def count_wireframe_text_bearing(elements: list, accumulator: dict) -> None:
        """Recursively count wireframe text-bearing elements for the
        text-density check. Walks containers (grid / card / accordion) into
        their children and counts list items, accordion-item labels, and
        trust-bar items as individual text-bearing entries."""
        for el in elements or []:
            if not isinstance(el, dict):
                continue
            kind = el.get("kind")
            if kind in _TEXT_BEARING_KINDS:
                accumulator["text_bearing"] += 1
            elif kind == "list":
                items = el.get("items")
                if isinstance(items, list):
                    accumulator["text_bearing"] += len(items)
            elif kind == "trust-bar":
                items = el.get("items")
                if isinstance(items, list):
                    accumulator["text_bearing"] += len(items)
            elif kind == "accordion":
                for item in el.get("items") or []:
                    if isinstance(item, dict):
                        if item.get("label"):
                            accumulator["text_bearing"] += 1
                        body = item.get("body")
                        if isinstance(body, list):
                            count_wireframe_text_bearing(body, accumulator)
            for child_key in ("elements", "children", "rows", "columns"):
                val = el.get(child_key)
                if isinstance(val, list) and val and isinstance(val[0], dict):
                    count_wireframe_text_bearing(val, accumulator)

    def section_has_compression(section: dict) -> bool:
        """True if the section emits a structured ``compression`` object that
        legitimately drops below the text-density floor.

        Reads ``section.compression`` exclusively per
        ``wireframing-schema.md §section entry``. Returns True when the field
        is present AND one of:
        - ``kind == "row-density"`` AND ``total > shown`` (N-of-M compression)
        - ``kind in {"prose-paraphrase", "decoration-drop"}`` (the section
          intentionally collapses prose or drops decoration; shown/total may
          be omitted)

        Returns False when the field is absent or malformed — gate then
        enforces the text-density floor normally.
        """
        comp = section.get("compression")
        if not isinstance(comp, dict):
            return False
        kind = comp.get("kind")
        if kind == "row-density":
            shown = comp.get("shown")
            total = comp.get("total")
            return (
                isinstance(shown, int)
                and isinstance(total, int)
                and total > shown
            )
        if kind in ("prose-paraphrase", "decoration-drop"):
            return True
        return False

    def check_heading_size_capture(
        elements: list,
        accumulator: list,
        section_name: str,
    ) -> None:
        """Warn (don't fail) when a wireframe heading element under reverse-mode
        is missing the ``renderedSize`` field. Only the caller decides whether
        the wireframe is reverse-mode — this helper assumes the check is
        appropriate to run."""
        for el in elements or []:
            if not isinstance(el, dict):
                continue
            kind = el.get("kind")
            if kind == "heading":
                rendered = el.get("renderedSize")
                if rendered is None:
                    accumulator.append({
                        "kind": "heading-size-capture",
                        "section": section_name,
                        "heading_text": el.get("text", "<unnamed>"),
                        "level": el.get("level"),
                    })
            for child_key in ("elements", "children", "rows", "columns"):
                val = el.get(child_key)
                if isinstance(val, list) and val and isinstance(val[0], dict):
                    check_heading_size_capture(val, accumulator, section_name)
            if kind == "accordion":
                for item in el.get("items") or []:
                    if isinstance(item, dict):
                        body = item.get("body")
                        if isinstance(body, list):
                            check_heading_size_capture(body, accumulator, section_name)

    # Setup for sub-checks 2 and 3 (warning-only).
    # Sub-check 2 fires only when the wireframe entry is reverse-mode.
    is_reverse_mode = wireframe_entry.get("extractionMode") == "phantom-browser"
    haystack_lower = _build_substrate_haystack(substrate)
    warnings: list[dict] = []

    section_results = []
    overall_ok = True
    for section in wireframe_entry.get("sections") or []:
        if not isinstance(section, dict):
            continue
        top_idx = section.get("top_level_node_index")
        if top_idx is None:
            continue  # forward-mode or non-phantom substrate
        name = section.get("type") or "?"
        if top_idx not in nodes_by_index:
            section_results.append({
                "name": name,
                "top_level_node_index": top_idx,
                "ok": False,
                "substrate_counts": {"p": 0, "h4": 0, "figure": 0, "li": 0, "text_bearing": 0},
                "wireframe_counts": {"paragraph": 0, "h4_heading": 0, "media": 0, "list_items": 0, "text_bearing": 0},
                "text_density": {
                    "ratio": 0.0,
                    "floor": text_density_floor,
                    "bypassed_by_compression": False,
                },
                "failures": [f"top_level_node_index {top_idx} not found in substrate"],
            })
            overall_ok = False
            continue

        tags = descendant_tags(top_idx)
        sub_counts = {
            "p": tags.count("p"),
            "h4": tags.count("h4"),
            "figure": tags.count("figure"),
            "li": tags.count("li"),
            "text_bearing": descendant_text_bearing(top_idx),
        }
        wf_counts = {"paragraph": 0, "h4_heading": 0, "media": 0, "list_items": 0, "text_bearing": 0}
        count_wireframe_kinds(section.get("elements") or [], wf_counts)
        count_wireframe_text_bearing(section.get("elements") or [], wf_counts)

        failures = []
        if sub_counts["p"] > 0:
            min_emitted = paragraph_ratio * sub_counts["p"]
            if wf_counts["paragraph"] < min_emitted:
                failures.append(
                    f"paragraphs {wf_counts['paragraph']}/{sub_counts['p']} "
                    f"(need >={paragraph_ratio:.1f}x)"
                )
        if sub_counts["h4"] >= h4_floor_threshold and wf_counts["h4_heading"] == 0:
            failures.append(
                f"h4 {wf_counts['h4_heading']}/{sub_counts['h4']} "
                f"(substrate has >={h4_floor_threshold}, need >=1)"
            )
        if sub_counts["figure"] > 0:
            min_media = figure_ratio * sub_counts["figure"]
            if wf_counts["media"] < min_media:
                failures.append(
                    f"figures {wf_counts['media']}/{sub_counts['figure']} "
                    f"(need >={figure_ratio:.1f}x)"
                )

        # Text-density check (broader text-bearing set, compression-aware).
        # A section below the floor passes when the section emits a structured
        # ``compression`` object per substrate-fidelity.md §Compression
        # discipline.
        bypassed = False
        text_density_ratio = 0.0
        if sub_counts["text_bearing"] > 0:
            text_density_ratio = wf_counts["text_bearing"] / sub_counts["text_bearing"]
            if text_density_ratio < text_density_floor:
                bypassed = section_has_compression(section)
                if not bypassed:
                    failures.append(
                        f"text-density {wf_counts['text_bearing']}/{sub_counts['text_bearing']} "
                        f"({text_density_ratio:.2f} < floor {text_density_floor:.2f}, "
                        f"no compression field emitted)"
                    )

        ok = not failures
        if not ok:
            overall_ok = False
        section_results.append({
            "name": name,
            "top_level_node_index": top_idx,
            "ok": ok,
            "substrate_counts": sub_counts,
            "wireframe_counts": wf_counts,
            "text_density": {
                "ratio": text_density_ratio,
                "floor": text_density_floor,
                "bypassed_by_compression": bypassed,
            },
            "failures": failures,
        })

        # Sub-check 2 — heading-size capture warning (reverse-mode only).
        if is_reverse_mode:
            check_heading_size_capture(section.get("elements") or [], warnings, name)

        # Sub-check 3 — absence-claim greppability warning. Scan this section's
        # text fields (paragraphs, headings, button/link labels, list items,
        # etc.) and warn when a "no X" / "missing X" claim's noun-phrase is
        # actually greppable in the substrate.
        section_texts: list[str] = []
        _gather_wireframe_text_fields(section, section_texts)
        warnings.extend(_scan_for_absence_claims(
            section_texts,
            haystack_lower,
            f"section[{name}]",
        ))

    # Post-loop sub-check 3 — scan audit findings (when provided) for absence
    # claims. Audit findings follow audit-schema.md §Finding entry shape; the
    # scan covers ``title``, ``observation``, ``effect`` text fields.
    if isinstance(audit_findings, list):
        for finding in audit_findings:
            if not isinstance(finding, dict):
                continue
            finding_id = finding.get("id") or finding.get("n") or "<unidentified>"
            finding_texts: list[str] = []
            for field in ("title", "observation", "effect"):
                val = finding.get(field)
                if isinstance(val, str) and val.strip():
                    finding_texts.append(val)
            warnings.extend(_scan_for_absence_claims(
                finding_texts,
                haystack_lower,
                f"finding[{finding_id}]",
            ))

    return {"ok": overall_ok, "sections": section_results, "warnings": warnings}


def compute_post_save_coverage_batch(
    audit_html_path: Path,
    substrate_dir: Path,
    *,
    paragraph_ratio: float = 0.6,
    figure_ratio: float = 0.5,
    h4_floor_threshold: int = 5,
    text_density_floor: float = 0.5,
) -> dict:
    """Run post-save coverage checks across all wireframes[] entries in a deliverable.

    Reads the deliverable HTML from disk, extracts the wireframes[] JSON array,
    then for each entry locates the substrate JSON at
    ``substrate_dir/{slug}-1.json`` and calls :func:`compute_section_coverage`.

    This check is independent of the write-time gate in :func:`append_wireframe_data`
    — it reads both the deliverable and the substrate from disk, so it catches
    authorship-style bypasses (``skip_gate=True``, forward-mode shape-shifting,
    custom build scripts) that evade the pre-save gate.

    Args:
        audit_html_path:    Path to the audit or RW HTML deliverable.
        substrate_dir:      Directory holding per-slug substrate JSON files
                            (``{slug}-1.json`` naming convention). Pass a
                            non-existent path to trigger the web-platform skip.
        paragraph_ratio:    Forwarded to :func:`compute_section_coverage`. Default 0.6.
        figure_ratio:       Forwarded to :func:`compute_section_coverage`. Default 0.5.
        h4_floor_threshold: Forwarded to :func:`compute_section_coverage`. Default 5.
        text_density_floor: Forwarded to :func:`compute_section_coverage`. Default 0.5.

    Returns:
        Dict with keys:
        - ``ok`` (bool): True if all checked entries pass, or if skipped at top level.
        - ``entries`` (list): Per-entry result dicts. Each entry has ``slug`` plus
          either ``coverage`` (full result from :func:`compute_section_coverage`)
          and ``ok``, or ``skipped`` (reason string).
        - ``skipped`` (str, optional): Present only when the entire batch is skipped
          (substrate dir missing or wireframes[] is empty). When present, ``ok``
          is always True and ``entries`` is empty or absent.
    """
    if not substrate_dir.exists():
        return {
            "ok": True,
            "skipped": "substrate-dir-missing",
            "substrate_dir": str(substrate_dir),
        }

    html_str = audit_html_path.read_text(encoding="utf-8")
    # Try both known block ids; prefer audit then wireframes
    data: dict | None = None
    for candidate in _DELIVERABLE_BLOCK_IDS:
        if f'id="{candidate}"' in html_str:
            _, data, _ = extract_data_block(html_str, candidate)
            break
    if data is None:
        return {"ok": True, "skipped": "no-deliverable-block", "entries": []}

    wireframes = data.get("wireframes", [])
    if not wireframes:
        return {"ok": True, "skipped": "empty wireframes[]", "entries": []}

    entries: list[dict] = []
    for wf_entry in wireframes:
        slug = wf_entry.get("slug", "")
        substrate_path = substrate_dir / f"{slug}-1.json"
        if not substrate_path.exists():
            entries.append({
                "slug": slug,
                "skipped": "no substrate file",
                "substrate_path": str(substrate_path),
            })
            continue
        substrate = json.loads(substrate_path.read_text(encoding="utf-8"))
        coverage = compute_section_coverage(
            substrate,
            wf_entry,
            paragraph_ratio=paragraph_ratio,
            figure_ratio=figure_ratio,
            h4_floor_threshold=h4_floor_threshold,
            text_density_floor=text_density_floor,
        )
        entries.append({"slug": slug, "coverage": coverage, "ok": coverage["ok"]})

    overall_ok = all(e.get("ok", True) for e in entries if "coverage" in e)
    return {"ok": overall_ok, "entries": entries}


def coverage_check_post_save_main(argv: list[str] | None = None) -> int:
    """Entry point for the coverage-check-post-save subcommand.

    Reads an audit/RW HTML deliverable from disk and validates its wireframes[]
    against substrate JSON files in a sibling layouts directory. Exits non-zero
    on any failing entry — suitable as a post-save fidelity gate per the
    bypass-routes analysis in projects/2026-05-12-coverage-gate-bypass-paths.

    Args:
        argv: Arguments after the "coverage-check-post-save" token.

    Returns:
        Exit code — 0 all entries pass (or skipped), 1 one or more entries
        failed, 2 missing input file or invalid argument.
    """
    parser = argparse.ArgumentParser(
        prog="ux_utils coverage-check-post-save",
        description="Post-save fidelity gate for audit/RW HTML deliverables",
    )
    parser.add_argument("html_path", type=Path, help="Audit or RW HTML deliverable")
    parser.add_argument(
        "--substrate-dir",
        type=Path,
        default=None,
        help=(
            "Directory holding {slug}-1.json substrate files. "
            "Defaults to <html_parent>/current-website/audit-feed/layouts/"
        ),
    )
    parser.add_argument("--report", type=Path, default=None,
                        help="Write per-entry JSON report to this path")
    parser.add_argument("--paragraph-ratio", type=float, default=0.6)
    parser.add_argument("--figure-ratio", type=float, default=0.5)
    parser.add_argument("--h4-floor", type=int, default=5)
    args = parser.parse_args(argv)

    if not args.html_path.exists():
        print(f"HTML deliverable not found: {args.html_path}", file=sys.stderr)
        return 2

    substrate_dir: Path = (
        args.substrate_dir
        if args.substrate_dir is not None
        else args.html_path.parent / "current-website" / "audit-feed" / "layouts"
    )

    result = compute_post_save_coverage_batch(
        args.html_path,
        substrate_dir,
        paragraph_ratio=args.paragraph_ratio,
        figure_ratio=args.figure_ratio,
        h4_floor_threshold=args.h4_floor,
    )

    if "skipped" in result:
        reason = result["skipped"]
        print(f"Post-save coverage check skipped: {reason}", file=sys.stderr)
        return 0

    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(result, indent=2), encoding="utf-8")

    entries = result.get("entries", [])
    failing = [e for e in entries if "coverage" in e and not e.get("ok", True)]

    if result["ok"]:
        passed = sum(1 for e in entries if "coverage" in e)
        skipped = sum(1 for e in entries if "skipped" in e)
        summary = f"OK: {passed} entries pass"
        if skipped:
            summary += f", {skipped} skipped (no substrate file)"
        print(summary)
        return 0

    for e in failing:
        slug = e["slug"]
        cov = e["coverage"]
        bad_sections = [s for s in cov.get("sections", []) if not s.get("ok", True)]
        print(f"Failed: {slug} — {len(bad_sections)} sections below floor")
        for s in bad_sections:
            failures = "; ".join(s.get("failures", []))
            print(f"  section top_level_node_index={s.get('top_level_node_index')}: {failures}")
    return 1


def coverage_check_main(argv: list[str] | None = None) -> int:
    """Entry point for the coverage-check subcommand.

    Compares a Phantom-Browser substrate against a wireframe entry per-section
    and writes a structured delta report. Exits non-zero on any failing
    section — suitable as a post-authoring gate per FIN-044 §Gate Rules.

    Args:
        argv: Arguments after the "coverage-check" token.

    Returns:
        Exit code — 0 all sections pass, 1 one or more sections failed,
        2 missing input file or invalid argument.
    """
    parser = argparse.ArgumentParser(
        prog="ux_utils coverage-check",
        description="Per-section coverage gate for reverse-mode wireframes",
    )
    parser.add_argument("substrate", type=Path, help="Phantom-Browser layout-map JSON")
    parser.add_argument("wireframe", type=Path, help="Wireframe entry JSON")
    parser.add_argument("--report", type=Path, default=None,
                        help="Write per-section delta JSON to this path")
    parser.add_argument("--paragraph-ratio", type=float, default=0.6)
    parser.add_argument("--figure-ratio", type=float, default=0.5)
    parser.add_argument("--h4-floor", type=int, default=5)
    args = parser.parse_args(argv)

    if not args.substrate.exists():
        print(f"Substrate not found: {args.substrate}", file=sys.stderr)
        return 2
    if not args.wireframe.exists():
        print(f"Wireframe not found: {args.wireframe}", file=sys.stderr)
        return 2

    try:
        substrate = json.loads(args.substrate.read_text(encoding="utf-8"))
        wireframe = json.loads(args.wireframe.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}", file=sys.stderr)
        return 2

    try:
        result = compute_section_coverage(
            substrate,
            wireframe,
            paragraph_ratio=args.paragraph_ratio,
            figure_ratio=args.figure_ratio,
            h4_floor_threshold=args.h4_floor,
        )
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 2

    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(result, indent=2), encoding="utf-8")

    if result["ok"]:
        return 0

    failing = [s for s in result["sections"] if not s["ok"]]
    summary = ", ".join(f"{s['name']}@{s['top_level_node_index']}" for s in failing)
    print(f"Coverage failed: {len(failing)} section(s) - {summary}", file=sys.stderr)
    if args.report:
        print(f"Per-section delta: {args.report}", file=sys.stderr)
    return 1


# ============================================================
# __main__ — subcommand dispatcher
# ============================================================

def check_html_main(argv: list[str] | None = None) -> int:
    """Entry point for the check-html subcommand.

    Validates an HTML deliverable for structural integrity. Prints a compact
    report to stdout and exits non-zero if issues are found — suitable as a
    pre-presentation gate.

    Args:
        argv: Arguments after the "check-html" token.

    Returns:
        Exit code — 0 clean, 1 structurally broken, 2 file missing.
    """
    parser = argparse.ArgumentParser(
        prog="ux_utils check-html",
        description="Structural validation gate for HTML deliverables",
    )
    parser.add_argument("path", type=Path, help="Path to HTML deliverable")
    parser.add_argument(
        "--min-bytes",
        type=int,
        default=5000,
        help="Minimum expected file size in bytes (default: 5000)",
    )
    args = parser.parse_args(argv)

    if not args.path.exists():
        print(f"Not found: {args.path}", file=sys.stderr)
        return 2

    result = validate_html_deliverable(path=args.path, min_bytes=args.min_bytes)
    stats = result["stats"]
    print(f"File: {args.path}")
    print(f"  Size: {stats['bytes']} bytes, {stats['lines']} lines")
    print(f"  <script>: {stats.get('script_open', 0)} open / {stats.get('script_close', 0)} close")
    print(f"  JSON data blocks: {stats.get('json_blocks', 0)}")
    for warning in result.get("warnings", []):
        print(f"  warn: {warning}")
    if result["status"] == "ok":
        print("Status: OK")
        return 0
    print("Status: BROKEN")
    for issue in result["issues"]:
        print(f"  - {issue}")
    return 1


if __name__ == "__main__":
    _argv = sys.argv[1:]
    if _argv and _argv[0] == "inspect-json":
        sys.exit(inspect_json_main(_argv[1:]))
    elif _argv and _argv[0] == "check-html":
        sys.exit(check_html_main(_argv[1:]))
    elif _argv and _argv[0] == "coverage-check":
        sys.exit(coverage_check_main(_argv[1:]))
    elif _argv and _argv[0] == "coverage-check-post-save":
        sys.exit(coverage_check_post_save_main(_argv[1:]))
    else:
        print("usage: python ux_utils.py <subcommand> [args]")
        print("  subcommands:")
        print("    inspect-json   <path> [--pointer] [--fields] [--from] [--to]")
        print("                         [--skip] [--take] [--indices] [--tag]")
        print("                         [--y-min] [--y-max] [--text-len] [--format]")
        print("    check-html     <path> [--min-bytes N]")
        print("    coverage-check <substrate> <wireframe> [--report PATH]")
        print("                         [--paragraph-ratio F] [--figure-ratio F] [--h4-floor N]")
        print("    coverage-check-post-save <html> [--substrate-dir DIR] [--report PATH]")
        print("                            [--paragraph-ratio F] [--figure-ratio F] [--h4-floor N]")
        sys.exit(1)
