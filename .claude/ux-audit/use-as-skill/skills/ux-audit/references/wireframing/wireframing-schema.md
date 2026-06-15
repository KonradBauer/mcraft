---
type: reference
purpose: "Data block schema for the Wireframing Interactive Deliverable. Canonical contract consumed by references/wireframing/wireframing-template.html at render time, and by both MD renderers (IIFE client-side + agent on-request) for `{slug}_wireframes.md` output."
---
Follow §Communication Rules from agent.md
# Wireframing — Data Block Schema

The data block is the single source of truth for the wireframing deliverable. Both HTML (interactive) and MD (static peer) outputs derive from the same JSON. The agent never hand-edits the generated MD.

Used by: `references/wireframing/wireframing-template.html`, `references/workflow-wireframing.md` (Phase 2).
Companion: `references/shared/interactive-deliverable-shell.md` (shell architecture contract).

---

## Top-level shape

```json
{
  "namespace": "wireframes-{client}",
  "labels": { /* optional — overrides DEFAULT_LABELS for this deliverable */ },
  "customStyles": "/* optional — scoped CSS for extension kinds (see §Extension kinds) */",
  "chrome": { "nav": { /* shared nav structure */ }, "footer": { /* shared footer structure */ } },
  "wireframes": [ /* one entry per wireframed page */ ]
}
```

| Field | Required | Type | Purpose |
|---|---|---|---|
| `namespace` | yes | string | LocalStorage namespace — scopes decision-toggle persistence per project |
| `labels` | no | object | Optional per-project label overrides; keys match `DEFAULT_LABELS` in the shell IIFE |
| `customStyles` | no | string | Scoped CSS for extension kinds; selector prefix `.wf-ext-*` enforced by namespace guard (see §Extension kinds) |
| `chrome` | yes | object | Shared nav + footer used by every wireframe page unless overridden per-page |
| `wireframes` | yes | array | Page entries in render order (order drives page switcher ordering) |

---

## `chrome`

Top-level `chrome.nav` and `chrome.footer` are the single source of truth for the wireframed site's own nav and footer. Every wireframe page inherits them at render time unless the page carries its own override.

```json
"chrome": {
  "nav": {
    "brand": { "kind": "label", "text": "[Logo]" },
    "links": [
      { "text": "Product", "href": "#product" },
      { "text": "Pricing", "href": "#pricing" },
      { "text": "Docs", "href": "#docs" }
    ],
    "cta": { "kind": "button", "label": "Start free trial", "variant": "primary" }
  },
  "footer": {
    "columns": [
      { "title": "Product", "links": [{ "text": "Features", "href": "#features" }] },
      { "title": "Company", "links": [{ "text": "About", "href": "#about" }] }
    ],
    "legal": "© 2026 Example Inc."
  }
}
```

The exact internal shape of `nav` and `footer` is intentionally open — they carry whatever structure the wireframed site's nav + footer need. The renderer walks these as element trees (see §Element kinds) so any valid element kind may appear.

---

## Override resolution

Per-page overrides replace — they do NOT merge. Render resolution (pseudo-code):

```
resolvedNav    = page.navOverride    ?? chrome.nav
resolvedFooter = page.footerOverride ?? chrome.footer
```

Render each wireframe's nav/footer from the resolved value. Authoring contract: if you want a reduced nav on checkout, set `page.navOverride` to the full reduced-nav object — not a partial patch.

---

## `wireframes[]` entry

Each entry is one wireframed page.

| Field | Required | Type | Purpose |
|---|---|---|---|
| `slug` | yes | string | Stable identifier for page switcher + deep links; must be unique in the array |
| `title` | yes | string | Human-readable label shown in the page switcher |
| `purpose` | yes | string | One-line statement of why the page exists |
| `navOverride` | no | object \| null | Full replacement nav for this page; omit or set `null` to inherit `chrome.nav` |
| `footerOverride` | no | object \| null | Full replacement footer for this page; same semantics |
| `pageDeliberations` | no | array | Page-scope deliberations (flow, template choice, page purpose, open questions) |
| `sections` | yes | array | Section entries in render order |
| `sourceUrl` | no | string | Reverse-mode only: URL of the scraped page this wireframe represents. When populated, signals that the output is a snapshot of an existing site rather than a designed proposal. Omitted for forward-mode wireframes. |
| `extractionMode` | no | string | Reverse-mode only: `firecrawl` \| `phantom-browser` \| `file`. Indicates which capture path produced the wireframe. Omitted for forward-mode wireframes. |
| `capturedAt` | no | string | Reverse-mode only: ISO 8601 timestamp when the source was captured. Omitted for forward-mode wireframes. |

The page-level identity is locked to exactly `slug`, `title`, `purpose`. No `url`, `templateRef`, status badges, tags, or assignees at this time.

**Mode detection:** A wireframes entry is *forward-mode* when `sourceUrl` is absent and `pageDeliberations[]`/`section.deliberations[]` may be populated. A wireframes entry is *reverse-mode* when `sourceUrl` is present — the template's IIFE renders a snapshot-info panel (source URL + extraction mode + capture timestamp) and suppresses the deliberations panel when deliberations arrays are empty. No explicit `mode` discriminator field — data presence drives the UI. Compression rationale for reverse-mode sections lives in the structured `section.compression` field (see §section entry), NOT in `deliberations[]`, which stays empty in reverse-mode.

---

## `section` entry

Each section represents one `<section class="wf-section">` inside a wireframe page.

| Field | Required | Type | Purpose |
|---|---|---|---|
| `type` | yes | string | Section-type taxonomy (`hero`, `features`, `pricing`, `testimonials`, `gallery`, `form`, `cta`, `timeline`, `stats`, `accordion`, `comparison-table`, etc.) |
| `purpose` | yes | string | What this section does for the page — **just the essence**: one short sentence, fragment-like, ~6–12 words. Not a full explanation, not a justification. The section title + `userQuestion` + elements carry the detail; `purpose` is the meta-strip skim line. Bad: "Showcase three core capabilities to help visitors quickly understand what the product does and why it matters." Good: "Frame the three core capabilities." |
| `userQuestion` | yes | string | What the visitor is thinking when they reach this section (first-person) |
| `narrative` | yes | enum | One of `opening \| tension \| evidence \| resolution` |
| `layout` | yes | string | Spatial grid description in plain English (e.g. `"2-col 50/50 image left, copy right"`) |
| `elements` | yes | array | Structured element list in render order |
| `deliberations` | no | array | Section-scope deliberations. **Reverse-mode entries leave this empty** — compression rationale lives in the structured `compression` object below; deliberations[] is reserved for forward-mode authoring rationale (layout choice, copy intent, edge cases). |
| `compression` | reverse-mode only | object | Structured compression signal: `{ kind: "row-density" \| "prose-paraphrase" \| "decoration-drop", shown: number, total: number, reason: string }`. Emitted when the section compresses substrate content (representative subset of N items / M, paraphrased long prose, intentional decoration drop). Replaces the free-text compression entries that lived in `deliberations[]` in pre-v4.1 reverse-mode wireframes. `shown` / `total` are required when `kind === "row-density"`; omit them for `prose-paraphrase` and `decoration-drop` (use sentinel handling at the gate). The coverage gate reads this field exclusively for compression-bypass decisions — no regex over deliberation prose. Forward-mode wireframes ignore the field. |
| `top_level_node_index` | reverse-mode only | int | Substrate provenance — integer `index` of the substrate node whose subtree contains the entire section. Required when emitting a section from a Phantom-Browser layout map; the parent workflow's coverage check walks this subtree. Omitted in forward-mode and in V_min web-class branch (text-only substrate has no node tree). |
| `y_start` | reverse-mode only | int | Substrate provenance — `bounds.y` of the section root node (from Phantom layout map). Pair with `top_level_node_index`. |
| `y_end` | reverse-mode only | int | Substrate provenance — `y_start + bounds.height` of the section root node. Pair with `top_level_node_index`. |
| `child_kind` | reverse-mode only | enum | Coarse shape signal — one of `hero_block` \| `paragraphs` \| `cards` \| `card_grid` \| `form` \| `nav` \| `cta_block` \| `mixed_content` \| `media_grid`. Used by the post-authoring coverage check to set per-element-type expectations. |
| `boundary_reason` | reverse-mode only | enum | Why this is a section break — one of `repeated_sibling_cluster` \| `wrapper_change` \| `density_shift` \| `semantic_tag_boundary` \| `direct_child_of_main`. Forces the agent to commit to a structural reason rather than a heading-position inference. |

**Reverse-mode provenance fields.** The five fields below `deliberations` (`top_level_node_index`, `y_start`, `y_end`, `child_kind`, `boundary_reason`) are required when the page entry has `extractionMode: "phantom-browser"`. They are omitted in forward-mode and in V_min web-class branch (which carries `extractionMode: "webfetch"` — text-only substrate, no node tree). The workflow's post-authoring coverage check reads these fields to walk the substrate subtree per section and compare element counts against the wireframe's `elements[]`. Filling `top_level_node_index` honestly requires walking the parent-child tree from `<main>` / `<article>`; flat heading-Y inference cannot fake it without producing indices that fail the substrate cross-check.

**No `states[]` field.** Alternate states (error / empty / loading / success) are intentionally out of scope for the wireframing schema. If state coverage becomes needed, it belongs to a separate mid-fi stage, not here.

The four required string-and-enum fields (`type`, `purpose`, `userQuestion`, `narrative`) drive the meta strip rendered at the bottom of every section. Label prefixes are localized at render time (English / Polish):

| Field | English | Polish |
|---|---|---|
| `type` (shown as "Section") | `Section:` | `Sekcja:` |
| `narrative` | `Narrative:` | `Narracja:` |
| `userQuestion` | `Question:` | `Pytanie:` |
| `purpose` (shown as "Goal") | `Goal:` | `Cel:` |

---

## Element kinds

`elements[]` items each have a required `kind` discriminator plus per-kind fields. The renderer walks elements in order. Each kind has a defined HTML rendering AND a defined MD extraction (both paths in this file).

**Optional `id` field — element-scope pin anchor.** Every element entry MAY carry an optional `id` string (slug-style, unique within the page). When present, the renderer emits `data-shell-element-id="${el.id}"` on the outermost rendered tag, which lets a deliberation (or audit finding) anchor a pin to that specific element via the `attached_to` field. Absent `id` = no anchor attribute emitted, no element-scope pinning available for that element. Backward compatible — existing data blocks without `id` render unchanged. Uniqueness is author-responsibility; the `check-html` lint warns on duplicates within a page.

**Leaf kinds** (thirteen — terminal; no nested children):

| Kind | Required fields | Optional fields | HTML rendering | MD rendering |
|---|---|---|---|---|
| `heading` | `level` (1–4), `text` | `renderedSize` (number, reverse-mode only — see §Reverse-mode-only heading metadata below) | `<h1>` … `<h4>` with `text` | `# text` (level = # count) |
| `paragraph` | `text` | — | `<p>text</p>` | plain paragraph |
| `button` | `label`, `variant` (`primary` \| `secondary`) | `href` | `<button class="wf-button wf-button--{variant}">label</button>` (or `<a>` if `href`) | `[Button: label]` (+ suffix ` (secondary)` for secondary) |
| `link` | `label`, `variant` (`plain` \| `arrow`) | `href` | `<a class="wf-link wf-link--{variant}">label</a>` — arrow variant appends `→` glyph | `[Link: label]` (+ suffix ` →` for arrow) |
| `media` | `label` (conditional — see below) | `src`, `description`, `height` (`xs` \| `sm` \| `md` \| `lg` \| `cover`, default `md`), `width` (`xs` \| `sm` \| `md` \| `lg`, optional — default container-driven), `decorative` (boolean, default `false`, reverse-mode only — when `true`, label is omitted and the placeholder box renders without text), `runtimeInjected` (boolean, default `false`, reverse-mode only — see §Reverse-mode-only `media.runtimeInjected` below) | Gray placeholder box with centered `label`. Outer class `wf-media wf-media--{height}` controls vertical space (`xs` 64px, `sm` 120px, `md` 240px, `lg` 400px, `cover` fills parent card height). Optional `wf-media--w-{width}` class caps horizontal size (`xs` 64px, `sm` 120px, `md` 240px, `lg` 400px) with `margin-inline: auto` centering — use for icons/logos that should not fill their column. When `decorative === true` OR `height === "xs"`, the placeholder renders with no label text (sub-icon visuals and decoratives are rarely content-bearing; the empty box still shows the visual slot). | `[Media: label]` — OR `[Media]` (no label) when `decorative === true` OR `height === "xs"`. Height/width are render-only hints; no MD representation otherwise. |

**Conditional `label` rule.** The `label` field is required on `media` UNLESS `decorative === true` OR `height === "xs"`. The exception covers two cases that the Mode C / Mode A reverse-wireframing subagents judge on the live page: (a) purely decorative icons (chevrons, dividers, bullet glyphs, ornamental sparkles — judged via filename stem + bounds + position, see `substrate-fidelity.md §Label derivation`); (b) sub-icon visuals at the `xs` size (≤80px on the live page — rarely content-bearing by convention). Forward-mode wireframes always provide a label (`decorative` and `xs` are reverse-mode authoring conventions; greenfield designs name their slots).
| `label` | `text` | — | Uppercase `.wf-label` eyebrow above headings | `**text**` (bold) |
| `list` | `items[]` (array of strings), `ordered` (bool) | — | `<ul>` / `<ol>` with `<li>` | `- item` / `1. item` |
| `field` | `name`, `fieldType` (`text` \| `email` \| `select` \| `textarea`), `placeholder` | — | Native HTML `<input>` / `<select>` / `<textarea>` | `[Field: name ({fieldType})]` |
| `micro` | `text` | — | Italic `.wf-micro` risk-reducer or reassurance copy | `_text_` |
| `stat` | `value` (string), `label` (string) | `detail` (string), `icon` (media-shape or label string) | `<div class="wf-stat">` with prominent `value`, `label` underneath, optional `detail` line and `icon` slot above | `**value** — label` (+ detail on next line if present) |
| `testimonial` | `quote` (string), `author` (string) | `role` (string), `company` (string), `photo` (media-shape), `rating` (number 1–5) | `<div class="wf-testimonial">` with `<blockquote>` + author block (name, role @ company), optional photo, optional star row | `> quote`<br>`> — author, role @ company` |
| `trust-bar` | `items[]` (array of media-shape or string) | — | `<div class="wf-trust-bar">` horizontal strip of logos / badges | `Trusted by: item · item · item` |
| `banner` | `text` (string) | `dismissible` (bool, default false) | `<div class="wf-banner">` single-line strip; if `dismissible` shows close icon | `> banner: text` |

**Container kinds** (three — wrap child elements for card-based and accordion layouts):

| Kind | Required fields | Optional fields | HTML rendering | MD rendering |
|---|---|---|---|---|
| `grid` | `columns` (`integer` \| `number[]` \| `"auto"`), `children[]` (array of leaf kinds or `card` elements) | `align` (`"left"` \| `"center"` \| `"right"`, default `"left"`) | Integer form renders as `<div class="wf-grid wf-grid-{columns}">` (back-compat with equal-column layout); array form emits inline style `grid-template-columns: Nfr Mfr` for asymmetric column ratios; `"auto"` form emits `grid-template-columns: repeat(N, auto)` where N = `children.length` — children take their intrinsic content widths and pack horizontally instead of stretching 50/50. The `align` field controls horizontal placement of the children inside the grid (`center` adds `justify-content: center` so the children-as-a-block centers within the section). | Children rendered in order, flat — MD has no multi-column concept |
| `card` | `children[]` (array of leaf kinds) | `variant` (`default` \| `tile` \| `highlight`), `align` (`"left"` \| `"center"` \| `"right"`, default `"left"`) | `default` renders flush (transparent, no padding — used when the card groups children for grid layout but the live page shows no visible bordered tile); `tile` renders as warm-fill (rounded, padded — used when the live page has a visible bordered card); `highlight` renders with accent border (used when the live page has an accented/featured card); cards are `display: flex; flex-direction: column` with `align-self: stretch` when grid children, so `media` with `height: cover` fills the card. The `align` field controls text alignment inside the card (`center` adds `text-align: center` on the card root). | `--- card ---` separator (if not the last card in a grid) then children flat |
| `accordion` | `items[]` (array of `{label: string, body: array of leaf kinds}`) | `defaultOpen` (item label string) | `<div class="wf-accordion">` with `<details>` / `<summary>` per item; toggle state baked in; `defaultOpen` item starts open | Per item: `### label`<br>body items rendered in order |

**Recursion cap (binding):**
- `grid` may contain `card` children OR leaf kinds directly — mixing is allowed for asymmetric patterns (e.g. a grid whose first cell is a `card` and whose second is a `media`). `grid` may also contain `testimonial` / `stat` leaf kinds directly (the most common use of these kinds is inside a grid).
- `card` may contain **only leaf kinds**. No grid-in-grid. No card-in-card. Exactly one level of nesting.
- `accordion` items' `body` arrays contain **only leaf kinds**. No nested accordions or grids inside an accordion item.

**Deprecated (one-release back-compat):**

| Kind | Status | Replacement |
|---|---|---|
| `cta` | deprecated; renders via `button` alias | Use `button` (variants `primary` \| `secondary`) for actions; use `link` (variants `plain` \| `arrow`) for inline navigation |

The renderer routes `cta` to the `button` path with matching variant. MD output for `cta` continues as `[CTA: label]` for one release to keep generated MD diffs stable; new content should use `button` directly. To be removed next major cycle.

**Backward compatibility:** existing data blocks with only leaf `elements[]` render identically after these additions — new container-kind cases never fire when no container elements are present.

Element fields may include a `label` for semantic alt-text (media), but there are no free-form element kinds — every element uses one of the kinds above OR an extension kind (see §Extension kinds). Adding a kind to the closed core requires a schema update and a matching renderer update in both HTML and MD paths.

**Authoring guidance — v4.0 card/grid semantics:**

1. `card.variant`: omit or use `default` for flush layout grouping (the live page shows no visible tile border); use `tile` when the live page shows a visibly bordered card (rounded + filled); use `highlight` for accent-bordered or featured cards. Do not use `default` where the live page has a visual tile — that erases a meaningful distinction.
2. `grid.columns`: use an integer (2, 3, 4) for equal-column layouts; use an array for asymmetric layouts — pick the ratio from observed `bounds.width` of each column on the live page. If column widths are within ~15% of equal, use the integer form; otherwise use an array like `[1, 2]` for a 1:2 ratio or explicit pixel widths like `[475, 665]`. Use `"auto"` when the live page packs children at their **intrinsic content widths** (e.g. two CTA buttons sitting tight together at their natural label widths, a social-proof strip with an avatars cluster next to a Trustpilot stack, an inline icon+label pair). Pair `"auto"` with `align: "center"` for the common centered-block layout (CTAs centered as a group rather than spread to the edges of two 50/50 columns).
3. `align` (on `section`, `grid`, `card`): controls horizontal placement. `left` (default — matches existing renders, no migration needed); `center` adds `justify-content: center` to grids and `text-align: center` to sections/cards so descendants center as a block; `right` mirrors center to the right edge. Use on heroes and CTA rows where the live page centers content within the section. Omit when the live page is left-aligned (the prevailing default for content sections, comparison tables, and feature lists).

**Reverse-mode-only heading metadata:**

When a wireframes entry is reverse-mode (`extractionMode: phantom-browser`), each `heading` element MAY carry a `renderedSize` numeric proxy = `bounds.height ÷ visible-line count` from the substrate's layout-map JSON. The proxy approximates per-line font-size in pixels: a value of 24 means ~24px line-height (single-line eyebrow / small heading), 112 means ~112px (display-scale section header). Reverse-mode wireframe authoring populates this field; the pre-save coverage gate consumes it (see `references/wireframing/substrate-fidelity.md` §Typographic hierarchy). Forward-mode wireframes (greenfield designed proposals, no substrate) and V_min web-class entries (text-only substrate, no node tree) omit the field — the absence is legitimate and expected. Mirrors the existing reverse-mode-only provenance fields on the `section` entry (`top_level_node_index` / `y_start` / `y_end` / `child_kind` / `boundary_reason`) — same conditional shape, same backward-compat guarantees (additive optional field; existing data blocks without it remain valid).

**Reverse-mode-only `media.runtimeInjected`:**

When a wireframes entry is reverse-mode (`extractionMode: phantom-browser`), each `media` element MAY carry `runtimeInjected: true` — a boolean flag marking the element as a placeholder emitted by the Mode C subagent's empty-visual-container trigger, not as a real media descendant from the substrate. Absence and `false` both mean "real media derived from a substrate `<img>` / `<video>` / `<picture>` / `<figure>` node". Reverse-mode wireframe authoring populates the flag only when the trigger fires (see `references/wireframing/substrate-fidelity.md` §Empty visual containers — three-condition rule: no content descendants AND non-trivial bounds AND ≥1 visual-intent signal). Forward-mode wireframes (greenfield designed proposals) and V_min web-class entries (text-only substrate, no node tree) and Mode A entries (Firecrawl + screenshots) omit the field — the absence is legitimate and expected. Additive optional field; existing data blocks without it remain valid. Downstream consumers (audit pass, copy pass, reviewers) can fast-spot placeholders via this flag without parsing deliberation prose.

---

## Extension kinds

The closed core (13 leaf + 3 container kinds) covers patterns that recur across ≥5 domains. Less-common patterns get a structured extension envelope rather than an ever-growing closed schema (closed-schema-plus-add-kinds is a losing chase; fully open schemas produce inconsistency). Extensions preserve core predictability (MD export, audit state, cross-project comparability) while restoring the agent inventiveness needed for novel layouts.

### Envelope

```json
{
  "kind": "process-step",
  "className": "wf-ext-process-step",
  "fields": { "stepNumber": 1, "label": "Discovery", "description": "Map current state" },
  "fallbackMd": "**1. Discovery** — Map current state"
}
```

Or with a `children` array instead of `fields`:

```json
{
  "kind": "comparison-row",
  "className": "wf-ext-comparison-row",
  "children": [
    { "kind": "label", "text": "Feature X" },
    { "kind": "paragraph", "text": "Available in both plans" }
  ],
  "fallbackMd": "- **Feature X** — Available in both plans"
}
```

| Field | Required | Type | Purpose |
|---|---|---|---|
| `kind` | yes | string | Extension kind name; convention: lowercase, hyphen-separated (e.g. `process-step`, `comparison-row`). Stable across cycles for cross-project comparability |
| `className` | yes | string | CSS class for the rendered element. **Must be prefixed `wf-ext-*`** (the namespace guard scrubs any custom rules that don't match this prefix) |
| `fields` OR `children` | yes (one of) | object \| array | Either structured `fields` (custom shape per extension kind) OR a `children` array of leaf core kinds. May not have both |
| `fallbackMd` | yes | string | Markdown emitted for this element when MD is rendered. If missing or empty, both renderers emit `[{kind}]` placeholder |

### Generic fallback rendering

Unknown kinds (anything not in the closed core) render via:

```html
<div class="wf-ext wf-ext--{kind} {className}">
  <!-- if `children`: each child rendered recursively as a leaf element -->
  <!-- if `fields`: rendered as a definition list (key: value), or by `customStyles` if styled -->
</div>
```

The generic fallback keeps an unknown extension visible (boxed and labeled) rather than silently dropped.

### `customStyles`

The data block may include a top-level `customStyles` field carrying scoped CSS rules. The IIFE renderer injects them in a `<style>` tag at `DOMContentLoaded`. Two binding rules:

1. **Selector prefix:** every rule must target `.wf-ext-*` (or descendants thereof). Rules whose outermost selector does not match are scrubbed by the namespace guard.
2. **No core override:** `customStyles` may not redefine `.wf-card` / `.wf-grid` / `.wf-button` / etc. Scoping to `.wf-ext-*` enforces this naturally.

```json
{
  "namespace": "wireframes-acme",
  "customStyles": ".wf-ext-process-step { display: flex; align-items: center; gap: 16px; }",
  "wireframes": [ /* ... */ ]
}
```

### MD emission for extensions

- If `fallbackMd` is non-empty: emit it verbatim.
- If `fallbackMd` is missing/empty AND extension has `children`: render children flat using their per-kind MD mapping, prefixed `[{kind}]\n`.
- If `fallbackMd` is missing/empty AND extension has only `fields`: emit `[{kind}]` placeholder.

### Authoring guidance

Use extensions sparingly — when the closed core (including the 5 promoted kinds: `stat` / `testimonial` / `trust-bar` / `banner` / `accordion`) cannot express intent. Common suggested extension names so cross-project drift stays bounded: `process-step`, `comparison-row`, `pricing-tier-meta`, `team-member`. Reverse-mode wireframing does not author extensions — Phantom doesn't emit them, and the finishing pass is bounded to the closed core.

---

## Deliberations

Deliberations are the structured decisions the agent made during wireframing, surfaced in the left panel of the interactive shell so reviewers can evaluate reasoning — not just output.

Two places carry deliberations, with three scopes routed by the `attached_to` field:

- `wireframe.pageDeliberations[]` — by default page-scope (flow, template choice, page purpose, open questions). When the entry carries `attached_to: "<element-slug>"`, scope routes to **element** instead — the pin attaches to the specific rendered element and the panel groups it under "Element design choices."
- `section.deliberations[]` — by default section-scope (narrative-arc reasoning, layout choice, copy intent, structural decisions). When the entry carries `attached_to: "<element-slug>"`, scope routes to **element** for the same reason.

### Deliberation shape

| Field | Required | Type | Purpose |
|---|---|---|---|
| `id` | yes | string | Unique within the deliverable |
| `summary` | yes | string | One-line "what was decided" |
| `reasoning` | yes | string | Why this choice was made |
| `alternatives` | no | array | `[{ desc, rejected }]` — alternatives considered and rejected with reasons |
| `confidence` | yes | enum | `high \| medium \| low` |
| `attached_to` | no | string | Element-slug pointer — when present, deliberation routes to **element scope**, anchoring the pin to the specific element entry whose `id` matches. Absent → page-scope (under `pageDeliberations[]`) or section-scope (under `section.deliberations[]`) per the array the entry lives in. |
| `inputSource` | no | object \| null | Optional trace: `{ kind: "inventory" \| "strategy" \| ..., ref: "id-or-slug" }` (stored for traceability; not rendered in the detail panel) |

Design choices are pure rationale — they explain WHY the agent made a choice. There is no accept/reject state because rejecting a rationale doesn't unbuild the wireframe. Reviewer reads, responds with feedback externally.

### Scope-routing — prefer the tightest legitimate anchor

Three scopes available for any given deliberation: **element > section > page**. Pick the tightest one that legitimately anchors the decision:

- A copy-tone choice that affects the whole hero section → section-scope.
- A specific button-label refinement (e.g. "Start a 14-day trial" vs "Get started") that lives on one element → element-scope (via `attached_to: "<button-slug>"` + a matching `el.id` on the button).
- A page-flow choice (e.g. "single CTA path vs dual CTAs") that doesn't anchor to any one element → page-scope.

Tighter anchors give the reviewer a more navigable left panel and let pin clicks land on the precise element under discussion. Backward compatible — entries without `attached_to` route to page or section scope as today.

Grouping in the left panel renders three groups: **Element design choices** (scope=element, pinned to specific elements), **Section design choices** (scope=section), and **Page-level design choices** (scope=page). The renderer derives scope from `attached_to` presence first, then falls back to which array the entry lives in.

### Granularity rule

Surface a deliberation **only when there was a meaningful choice**:
- Alternatives were considered, OR
- Confidence is below `high`

Mechanical choices (paragraph vs heading, list marker style, etc.) stay implicit — not every choice is a deliberation. Over-surfacing drowns the review; under-surfacing hides the thinking. Use the rule as a filter.

---

## Complete example

```json
{
  "namespace": "wireframes-acme",
  "labels": {},
  "chrome": {
    "nav": {
      "brand": { "kind": "label", "text": "[Acme logo]" },
      "links": [
        { "text": "Product", "href": "#product" },
        { "text": "Pricing", "href": "#pricing" }
      ],
      "cta": { "kind": "button", "label": "Start free trial", "variant": "primary" }
    },
    "footer": {
      "columns": [
        { "title": "Product", "links": [{ "text": "Features", "href": "#features" }] }
      ],
      "legal": "© 2026 Acme Inc."
    }
  },
  "wireframes": [
    {
      "slug": "home",
      "title": "Homepage",
      "purpose": "Convert first-time visitors to trial signups",
      "navOverride": null,
      "footerOverride": null,
      "pageDeliberations": [
        {
          "id": "page-home-flow",
          "summary": "Opening → tension → evidence → resolution across 5 sections",
          "reasoning": "Standard narrative arc for conversion-oriented homepages.",
          "alternatives": [],
          "confidence": "high",
          "inputSource": null
        }
      ],
      "sections": [
        {
          "type": "hero",
          "purpose": "Hook attention with the product promise",
          "userQuestion": "What does this product do for me?",
          "narrative": "opening",
          "layout": "2-col 50/50, image right, copy + button left",
          "elements": [
            { "kind": "label",     "text": "FOR SALES TEAMS" },
            { "kind": "heading",   "level": 1, "text": "Close deals 30% faster" },
            { "kind": "paragraph", "text": "Workflow automation that adapts to how your team already sells." },
            { "kind": "button",    "label": "Start free trial", "variant": "primary" },
            { "kind": "link",      "label": "See how it works", "variant": "arrow" },
            { "kind": "media",     "label": "[Hero image — product in use]", "height": "cover" }
          ],
          "deliberations": [
            {
              "id": "hero-layout-01",
              "summary": "Two-column hero with image right, copy left",
              "reasoning": "Visual weight balances copy density; image supports product-in-use narrative.",
              "alternatives": [
                { "desc": "Full-width centered", "rejected": "Risks losing CTA below fold on mobile." }
              ],
              "confidence": "medium",
              "inputSource": null
            }
          ]
        }
      ]
    },
    {
      "slug": "checkout",
      "title": "Checkout",
      "purpose": "Complete the purchase without distractions",
      "navOverride": {
        "brand": { "kind": "label", "text": "[Acme logo]" },
        "links": [],
        "cta": { "kind": "button", "label": "Need help?", "variant": "secondary" }
      },
      "footerOverride": null,
      "pageDeliberations": [],
      "sections": [
        {
          "type": "stats",
          "purpose": "Reinforce confidence at the moment of payment",
          "userQuestion": "Are other teams really seeing results?",
          "narrative": "evidence",
          "layout": "3-col stat row above payment form",
          "elements": [
            {
              "kind": "grid",
              "columns": 3,
              "children": [
                { "kind": "stat", "value": "30%", "label": "Faster deal cycles", "detail": "On average across 200+ teams" },
                { "kind": "stat", "value": "12k", "label": "Sales reps shipping daily" },
                { "kind": "stat", "value": "SOC 2", "label": "Type II — audited annually" }
              ]
            }
          ],
          "deliberations": []
        }
      ]
    }
  ]
}
```

The `checkout` entry demonstrates two patterns: a `navOverride` (reduced nav for focused flows — the full `chrome.nav` is replaced, no merge) and a `stats` section using the new `stat` kind inside a `grid`.

---

## Reverse-mode example (snapshot of an existing site)

A reverse-wireframing data block omits `pageDeliberations[]`/`section.deliberations[]` and populates `sourceUrl` / `extractionMode` / `capturedAt` per page. The template renders the deliberations panel only when data exists and surfaces a snapshot-info banner when `sourceUrl` is populated. Example abbreviated to one page with a `grid` + `card` section:

```json
{
  "namespace": "wireframes-existing-example-shop",
  "labels": {},
  "chrome": {
    "nav": {
      "brand": { "kind": "label", "text": "Example Shop" },
      "links": [
        { "text": "Products", "href": "#" },
        { "text": "About", "href": "#" }
      ],
      "cta": { "kind": "button", "label": "Contact", "variant": "primary" }
    },
    "footer": {
      "columns": [{ "title": "Company", "links": [{ "text": "Careers", "href": "#" }] }],
      "legal": "© 2026 Example Shop"
    }
  },
  "wireframes": [
    {
      "slug": "home",
      "title": "Homepage",
      "purpose": "Map the existing homepage structure",
      "sourceUrl": "https://example-shop.com/",
      "extractionMode": "phantom-browser",
      "capturedAt": "2026-04-21T14:23:00Z",
      "pageDeliberations": [],
      "sections": [
        {
          "type": "hero",
          "purpose": "Map the homepage hero — copy left, runtime-injected visual right",
          "userQuestion": "What does this shop sell, at a glance?",
          "narrative": "promise",
          "layout": "2-col, copy left + visual right",
          "elements": [
            {
              "kind": "grid",
              "columns": [1, 1],
              "children": [
                { "kind": "card", "children": [
                  { "kind": "heading", "level": 1, "text": "Goods you actually want." },
                  { "kind": "paragraph", "text": "Apparel, accessories, and home goods, curated weekly." },
                  { "kind": "button", "label": "Shop now", "variant": "primary" }
                ]},
                { "kind": "media", "label": "[Hero animation — runtime-injected]", "height": "cover", "runtimeInjected": true }
              ]
            }
          ],
          "deliberations": []
        },
        {
          "type": "trust-strip",
          "purpose": "Surface the press / partner logos under the hero",
          "userQuestion": "Who else trusts this shop?",
          "narrative": "evidence",
          "layout": "single-row trust bar",
          "elements": [
            { "kind": "trust-bar", "items": [
              { "label": "[Vogue]" },
              { "label": "[NYT]" },
              { "label": "[Wirecutter]" },
              { "label": "[GQ]" }
            ]}
          ],
          "deliberations": []
        },
        {
          "type": "features",
          "purpose": "Summarize product categories",
          "userQuestion": "What does this shop sell?",
          "narrative": "evidence",
          "layout": "3-col card grid",
          "elements": [
            { "kind": "label", "text": "CATEGORIES" },
            {
              "kind": "grid",
              "columns": 3,
              "children": [
                { "kind": "card", "children": [
                  { "kind": "media", "height": "xs", "decorative": true },
                  { "kind": "heading", "level": 3, "text": "Apparel" },
                  { "kind": "paragraph", "text": "T-shirts, hoodies, jackets." },
                  { "kind": "link", "label": "Browse apparel", "variant": "arrow" }
                ]},
                { "kind": "card", "children": [
                  { "kind": "media", "height": "xs", "decorative": true },
                  { "kind": "heading", "level": 3, "text": "Accessories" },
                  { "kind": "paragraph", "text": "Bags, hats, belts." },
                  { "kind": "link", "label": "Browse accessories", "variant": "arrow" }
                ]},
                { "kind": "card", "children": [
                  { "kind": "media", "height": "xs", "decorative": true },
                  { "kind": "heading", "level": 3, "text": "Home goods" },
                  { "kind": "paragraph", "text": "Mugs, prints, small decor." },
                  { "kind": "link", "label": "Browse home goods", "variant": "arrow" }
                ]}
              ]
            }
          ],
          "compression": {
            "kind": "row-density",
            "shown": 3,
            "total": 8,
            "reason": "8 product categories on the live page; 3 representative cards shown."
          },
          "deliberations": []
        },
        {
          "type": "faq",
          "purpose": "Answer common pre-purchase questions",
          "userQuestion": "Will this fit / ship to me / be returnable?",
          "narrative": "tension",
          "layout": "vertical accordion",
          "elements": [
            { "kind": "accordion", "items": [
              { "label": "Do you ship internationally?", "body": [
                { "kind": "paragraph", "text": "Yes — to 38 countries via DHL, with duties calculated at checkout." }
              ]},
              { "label": "What's your return policy?", "body": [
                { "kind": "paragraph", "text": "Free returns within 30 days, no questions asked." }
              ]}
            ]}
          ],
          "deliberations": []
        }
      ]
    }
  ]
}
```

The snapshot-info banner renders at the top of the page showing the source URL, extraction mode, and capture timestamp. Deliberations panel (and its bottom-bar toggle) is hidden because all deliberation arrays are empty. The example also demonstrates the current closed-core vocabulary in reverse-mode context: `trust-bar` for the press strip (rewrapped from a Phantom-emitted generic `card`/`grid`), `link` with `arrow` variant inside cards (replaces the v3 pattern of using `cta` for arrow links), and `accordion` for the FAQ section (Phantom emits this directly when `<details>` / `<summary>` markup is present).

---

## MD output

### Two-path MD renderer contract

Two renderers consume the element → MD mapping defined in §Element kinds. Both MUST emit identical output on identical data blocks. This schema is the single source of truth. Any change to the element → MD mapping requires updating both renderers in the same commit. Schema-drift is prevented by schema discipline, not shared code.

**Path A — IIFE client-side `renderMarkdown()` (primary):** The shell template includes a "Download Markdown" control. Clicking it triggers a client-side traversal of the data block and a browser download of the rendered MD. No agent involvement, no server round-trip.

**Path B — Agent on-request MD writer (secondary):** When the user explicitly asks the agent to write the MD file (e.g. "save wireframes.md", "give me the markdown"), the agent reads the data block, renders MD using the same mapping, and writes `projects/{client}/{slug}_wireframes.md`. This is a one-shot, explicit-request action only.

**No auto-save path.** MD is NEVER written automatically on save. It is produced only via (A) the IIFE download button or (B) an explicit user request to the agent. The workflow spec's Step 7 save action writes only `{slug}_wireframes.html`; `{slug}_wireframes.md` is not touched unless the user separately requests it.

---

One peer MD at `projects/{client}/{slug}_wireframes.md` — single file, all pages.

Structure:

```
---
project: Acme
generated: 2026-04-18
---

# Wireframes — Acme

# Page: Homepage
Purpose: Convert first-time visitors to trial signups

## Section — hero
Section: hero
Narrative: opening
Question: What does this product do for me?
Goal: Hook attention with the product promise
Layout: 2-col 50/50, image right, copy + CTA left

**FOR SALES TEAMS**

# Close deals 30% faster

Workflow automation that adapts to how your team already sells.

[Button: Start free trial]

[Link: See how it works →]

[Media: Hero image — product in use]

### Design choices
- Two-column hero with image right, copy left (confidence: medium)
  - Reasoning: Visual weight balances copy density; image supports product-in-use narrative.
  - Alternatives: Full-width centered — rejected: Risks losing CTA below fold on mobile.

# Page: Checkout
…
```

Both renderers (IIFE and agent on-request) conform to this mapping. The agent never hand-edits MD after it is written. MD is not auto-saved — see §Two-path MD renderer contract above.

---

## Design rationale (summary)

This schema reflects several structural choices worth flagging when reading it cold:

- **Scope is wireframes-only HTML.** No Context/Strategy/IA/Inventory fields live here; upstream workflows own those artifacts.
- **Output path is a single interactive deliverable.** `projects/{client}/{slug}_wireframes.html` with one sub-page per wireframed page; each sub-page carries a full wireframe (nav + sections + footer).
- **Chrome + per-page overrides.** See §Override resolution above.
- **Structured `elements[]` with JSON canonical, MD generated.** See §Element kinds + §MD output.
- **Two-path MD renderer, no auto-save.** See §Two-path MD renderer contract.
- **Deliberation-surfacing panel with a granularity rule.** See §Deliberations + §Granularity rule.
- **No `states[]`.** Alternate states are out of scope for this schema.
- **Annotation model** (meta strip always on, numbered-pointer layer toggleable) is implemented in the template, not this schema.
- **Page metadata is exactly `slug`, `title`, `purpose`.** See §`wireframes[]` entry.
- **Vocabulary updates:** `media.height` restores hero visual weight without per-instance inline styles; the extension envelope (§Extension kinds) with `wf-ext-*` scoping and `fallbackMd` preserves core predictability while allowing authoring inventiveness; `cta` split into `button` + `link` with variants; `stat` / `testimonial` / `trust-bar` / `banner` / `accordion` promoted to closed kinds (one-release `cta` back-compat alias in §Element kinds).

