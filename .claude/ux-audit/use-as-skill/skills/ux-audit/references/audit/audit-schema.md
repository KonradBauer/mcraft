---
type: knowledge
purpose: "Canonical contract for Domain Audit finding shape — schema for the JSON data block in audit-template.html (<script id=\"audit-findings-data\">). Field shape (observation/standard/effect/exception) authoritative for finding authoring; all procedural steps live in workflow-audit.md."
---
Follow §Communication Rules from agent.md
# Domain Audit — Findings

**Canon:** this file is the canonical source for finding shape. Renamed from `audit-findings.md` 2026-04-26 (FIN-006) for naming parity with messaging-canvas-schema.md / project-plan-schema.md / wireframing-schema.md. Edits to finding shape land here first; templates and workflow files defer.

Audit findings — site-plan (Step 3) and wireframe (Step 4) — share the same four-field schema. This file defines the schema contract; all procedural steps live in `workflow-audit.md`.

Used by: workflow-audit.md

---

## Finding Schema Contract

Each finding carries these four fields. Field names are English; rendered UI labels (Current state / Standard / Effect / When this may be fine) follow `html-craft.md §Project Language`.

| Field | Required | Description |
|-------|----------|-------------|
| `observation` | yes | What was found — current state of the site in this area |
| `standard` | yes | What the relevant archetype expects in this area, phrased as a plain-language design expectation. Phrase the design expectation directly. Follow `agent.md` §Internal identifiers rule #7 — slug-shaped classification names and archetype/pattern names belong only in JSON metadata fields like `domain_ref` (storage-only). Rendered text fields (`title`, `standard`, `observation`, `effect`, `exception`) describe the expectation directly. |
| `effect` | yes | What goes wrong when this pattern is violated (user or business impact) |
| `exception` | no | When this may be acceptable — conditions where the violation is intentional and defensible |

### Substrate-backed evidence in `observation` (optional, post-RW input mode)

When Audit runs post-RW with `current-website/audit-feed/` substrate available (see `workflow-audit.md` §Optional input — RW-captured substrate), the `observation` field can cite substrate directly — no schema extension needed. Example phrasings:

- **Spatial claims backed by layout JSON:** `"observation": "The primary CTA 'Request demo' sits 612px below the fold on desktop (source: current-website/audit-feed/layouts/product-1.json)."`
- **Content-exact claims backed by scrape MD:** `"observation": "The hero heading reads verbatim: 'Enterprise AI for teams.' (source: current-website/audit-feed/scrapes/home-1.md)."`
- **Cross-template claims:** observation cites the substrate files covering multiple templates (array of paths in the free-text).

The free-text `observation` field is sufficient — substrate provenance is part of the observation narrative, not a separate schema field. Consumers of the finding (reviewers, clients) see the substrate citation inline.

### Example (single finding entry)

```json
{
  "id": "sp-1",
  "title": "Product appears configurable but the layout is a flat catalog grid",
  "tag": "archetype",
  "confidence": "medium",
  "impact": "high",
  "decision_status": "pending",
  "attached_to": "hero-cta-primary",
  "domain_ref": "b2b-industrial/b2b-industrial-archetypes.md",
  "observation": "Product pages show 300+ SKU variants but no configurator entry point; layout follows a flat catalog grid.",
  "standard": "When the product configuration space is large and variant-driven, the primary product interaction is a guided configurator on the product page; a flat catalog grid is appropriate only when variants are pre-packaged with fixed pricing.",
  "effect": "Buyers with configurable needs cannot self-serve; they default to phone calls, increasing sales cost and losing digital leads.",
  "exception": "Acceptable if all configuration is handled offline by a sales rep and the site's only goal is lead capture — not the case here."
}
```

---

## JSON Data Block Shape

The audit deliverable (`{slug}_audit.html`) carries the full data shape inside a single `<script type="application/json" id="audit-findings-data">` block. The IIFE at load time renders the wireframe substrate from `wireframes[]` and attaches finding badges per `attached_to`.

| Top-level key | Type | Purpose |
|---|---|---|
| `namespace` | string | LocalStorage scope key (e.g., `audit-{client}-{date}`) |
| `labels` | object | UI label dictionary — overrides DEFAULT_LABELS in the template at clone time per the project language |
| `wireframes` | array | Wireframe substrate entries — same shape as wireframing's `wireframes[]` (chrome, sections[], elements[], etc.). Rendered by the shared engine. |
| `strategy` | array | Site-plan findings — cross-page archetype/IA findings (Step 3) |
| `wireframe` | array | Anatomy findings — page-scoped, optionally element-scoped via `attached_to` (Step 4) |
| `questions` | array | Post-audit strategic intent questions (Step 4) — carried into Discovery (Post-RW) on the redesign chain |

### Finding entry shape (applies to both `strategy[]` and `wireframe[]` arrays)

| Field | Required | Type | Purpose |
|---|---|---|---|
| `id` | yes | string | Unique within the deliverable (slug-style) |
| `n` | yes | int | Sequential number for badge display (assigned at authoring time) |
| `tag` | yes | enum | `archetype \| ia \| anatomy` — the audit dimension this finding addresses |
| `title` | yes | string | One-line "what was found" (skim-readable in the left panel list) |
| `observation` | yes | string | Current state — see §Finding Schema Contract above |
| `standard` | yes | string | Domain expectation — see §Finding Schema Contract above |
| `effect` | yes | string | What goes wrong — see §Finding Schema Contract above |
| `exception` | no | string | When this may be acceptable — see §Finding Schema Contract above |
| `confidence` | yes | enum | `high \| medium \| low` |
| `impact` | yes | enum | `high \| medium \| low` |
| `decision_status` | yes | enum | `pending \| accepted \| rejected` — review state, drives downstream decision-status routing in Strategy + Wireframing redesign chains |
| `attached_to` | no | string | Element-slug pointer — when present, finding routes to **element scope**, anchoring the badge to the rendered element whose `data-shell-element-id` matches. When absent, scope falls back per array: `strategy[]` entries are page-scope (cross-page); `wireframe[]` entries with no `attached_to` are page-scope (anchored at page level by `page` field). |
| `page` | conditional | string | Required for `wireframe[]` entries (page slug — e.g. `home`, `pricing`); not used by `strategy[]` |
| `domain_ref` | no | string | Path to the domain reference file the standard cites (traceability) |

`strategy[]` is cross-page (site-level findings). `wireframe[]` is per-page (anatomy findings, optionally element-scoped). Both share the four-field `observation/standard/effect/exception` core contract above.

### One-finding-per-element discipline

Each rendered element carries at most one finding. **When multiple concerns apply to the same element, they bundle into the single finding's body — never produce parallel entries on the same `attached_to`.** The `observation`, `standard`, and `effect` fields each may cover multiple concerns about that element; the finding stays one row in the left-panel list with one badge on the rendered element.

Why: parallel entries on the same element would force the engine to render multiple overlapping badges and complicate click-to-detail routing. Bundling preserves a clean one-badge-per-element UX and makes the reviewer's reading flow linear.

The `check-html` lint enforces this — duplicate `attached_to` values within the `wireframe[]` array trigger a warning (FIN-011, warn-only on first ship; promotes to hard-fail after one validation cycle without false positives).

---

## Questions block (post-audit strategic intent)

The `questions[]` array carries post-audit strategic intent questions written at Step 5 (or earlier in homepage-first audit). Read by Discovery (Post-RW Mode) on the redesign chain to pre-populate clarifying-question context — entries with `status: answered` or `status: guessed` carry the user's response forward; entries with `status: flagged` are skipped (they convert to findings, not Discovery questions).

| Field | Required | Type | Purpose |
|---|---|---|---|
| `id` | yes | string | Unique within the deliverable |
| `n` | yes | int | Sequential number |
| `title` | yes | string | The question itself (one sentence) |
| `why` | yes | string | Why answering this matters for the redesign |
| `status` | yes | enum | `pending \| answered \| guessed \| flagged` |
| `response` | no | string | The user's answer (when status is answered/guessed) |
| `flagged_at` | no | string | Step where the question was flagged for conversion to a finding (used when status is flagged) |
