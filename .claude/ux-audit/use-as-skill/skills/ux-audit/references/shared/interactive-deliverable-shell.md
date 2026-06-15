---
type: knowledge
purpose: "Architecture doc for the Interactive Deliverable Shell — the shared interactive HTML frame used by every KEY client-facing workflow. Describes per-workflow variants, self-bootstrap from embedded JSON, shared conventions, data block contract, LocalStorage namespacing, JS scope, and delivery paths."
---
Follow §Communication Rules from agent.md
# Interactive Deliverable Shell — Architecture

Shared interactive HTML frame used by every KEY client-facing workflow (Domain Audit, Messaging Canvas, Wireframing, Reverse Wireframing). Visual markup + CSS + JS live inline inside each per-workflow template file (`audit-template.html`, `wireframing-template.html`, `messaging-canvas-template.html`, `project-plan-template.html`) — every template self-contains its own shell. This file is the architecture contract, not the markup; per-template CSS/JS drift on shared shell conventions is a manual-sync concern currently.

Used by: workflow-audit.md, workflow-messaging.md, workflow-wireframing.md, workflow-reverse-wireframing.md

---

## Per-workflow variants

Each KEY workflow gets its own shell template file (e.g. `references/audit/audit-template.html`, `references/wireframing/wireframing-template.html`). Variants are full clonable files — no runtime base/inheritance mechanism. They share conventions via **shared shell class names** (the `.shell-*` prefix) and patterns; per-workflow additions layer on top.

**Wireframing + audit are two configurations of one shared rendering engine** (v5.0+). Same `renderWireframePage()` walker, same annotation widget, same `renderDetail(id)` dispatch — they differ only in data shape (`pageDeliberations[]` + nested `sections[].deliberations[]` vs `strategy[]` + `wireframe[]` + `questions[]`), pin color (`--shell-pin-color: #000` vs `#c0392b`), DEFAULT_LABELS vocabulary, and the `renderDetail` override that dispatches on entry `kind`. The shared engine block lives between the sentinel markers in both files (see §Unified engine convention below). Messaging and project-plan templates remain independent variants — they're not substrate-rendered, so they're outside this unification.

**Shared class prefix (new convention — 2026-04-18):**
- `.shell-*` — shell chrome (left panel, bottom bar, badge, filter chips, decision pills, detail view, list items). **Same class names across every workflow template.** Edits synced manually per the 3-section CSS partition.

**Per-workflow additions:**
- Only when a workflow genuinely needs UI the shell doesn't have (e.g. an audit-specific layer toggle, a wireframing-specific copy-overlay control). Add new classes with the workflow's semantic prefix (e.g. `.audit-*` / `.wfd-*` / `.mc-*`) — kept to a minimum.

**State modifiers:**
- `is-*` modifier classes on `.shell-*` elements for variant behavior (e.g. `.shell-leftpanel.is-wireframing` if wireframing needs a style override). Preferred over renaming the base.

**Data block ID stays per-workflow:**
- `audit-findings-data`, `wireframing-data`, `mc-data`, etc. Data schemas differ by workflow; IDs reflect that.

**Currently implemented:** Shell — Audit (file: `references/audit/audit-template.html`), Shell — Wireframing (file: `references/wireframing/wireframing-template.html`), Shell — Messaging (file: `references/messaging/messaging-canvas-template.html`), Shell — Project Plan (file: `references/project-plan/project-plan-template.html` — canvas substrate JSON-driven per §Canvas/substrate content)
**Planned:** Shell — Reverse Wireframing

**Migration note:** The audit template was originally built with `.audit-*` classes. As of 2026-04-18 these were renamed to `.shell-*` to establish the shared convention. Workflows ported after this date inherit `.shell-*` by copying verbatim — no rename needed.

---

## Shared conventions across variants

Every variant must honor these commitments:

- **Layout:** left panel + bottom bar as sibling elements under `<body>` (not nested). No top nav. No modals for core flow.
- **Filter-chip multi-axis pattern (R1):** within-axis OR, across-axes AND. Filter area is outside the scroll region of the list (R5).
- **Decision-toggle 3-state:** pending → accepted → rejected; cycles on click; persists to LocalStorage.
- **Panel header:** hidden in list mode, visible in detail mode (R4).
- **Self-bootstrap:** the shell IIFE reads the embedded data block on `DOMContentLoaded`. No `initShell(adapter)` call — the contract is data-shaped, not function-shaped.
- **Labels:** English source in `DEFAULT_LABELS`; optional `labels` dict in the data block overrides keys at runtime for project-language rendering.

---

## Unified engine convention (wireframing + audit)

Both `wireframing-template.html` and `audit-template.html` carry one engine block — bracketed by:

```
/* ===== UNIFIED-ENGINE-START — character-identical between wireframing and audit templates ===== */
... shared engine code ...
/* ===== UNIFIED-ENGINE-END ===== */
```

**The bytes between (and including) these sentinels are identical between the two files.** Drift is enforced by `__tests__/test_engine_sync.py`, which fails the build if the two engine blocks diverge by even one byte. Variant differences live strictly outside the sentinels:

- `:root --shell-pin-color` (CSS variable — black for wireframing, red for audit)
- `DEFAULT_LABELS` vocabulary (different toggle label, audit-specific finding labels)
- `renderDetail(id)` override defined after the engine — JS function-declaration hoisting means the later declaration wins at runtime, so audit can dispatch on entry `kind` (`'finding'` vs `'deliberation'`) without modifying the engine
- Embedded data block — schema differs per `audit-schema.md` vs `wireframing-schema.md`

When editing the engine, edit one file and copy verbatim to the other; the sync test runs on every build to catch drift.

---

## Data block contract

Every variant consumes a `<script type="application/json" id="<variant>-findings-data">` block embedded in the deliverable HTML. The IIFE reads it via `document.getElementById('<variant>-findings-data')` on init.

```html
<script type="application/json" id="<variant>-findings-data">
  { "<array1>": [...], "<array2>": [...], "templates": [...], "labels": {...}, "namespace": "..." }
</script>
```

Variant-specific array names and item schemas are defined by each variant's template in `templates.html`. Three keys are universal across all variants:

| Key | Required | Description |
|-----|----------|-------------|
| `labels` | no | Object of `{ key: "localized string" }` pairs. Overrides variant's `DEFAULT_LABELS` dict. Missing keys fall back to English. |
| `templates` | no | `[["slug", "Page label"], ...]` — populates the page-selector dropdown in the bar. |
| `namespace` | no | String; LocalStorage key prefix. Defaults to variant's built-in default (e.g., `fuse-audit` for Shell — Audit). |

**Shell — Audit data block arrays:** `wireframe` (anatomy findings), `strategy` (site-plan findings), `questions` (clarifying questions). See `references/audit/audit-template.html` for item schemas.

---

## LocalStorage namespace

Key format: `<namespace>-<key>` where `<namespace>` comes from the data block `namespace` field (or variant default).

- Decision keys: `<namespace>-decision-<kind>-<n>` (e.g., `ux-designer-audit-fuse-2026-04-16-decision-anatomy-3`)
- Panel state: `<namespace>-panel-open`
- Visibility: `<namespace>-visible`

The `namespace` field in the data block should be set per-deliverable: `ux-designer-audit-<project>-<date>`.

---

## JavaScript rule

Client-facing JS is **permitted** inside the shell: panel toggling, filter chips, MD export, decision pills, keyboard shortcuts. **Prohibited:** external deps, CDN imports, server calls, build steps. All JS lives as an inline IIFE inside the single `.html` file.

---

## Delivery paths

- **Download MD** button in the bar: generates a brief-of-decisions MD client-side from the embedded JSON data block (accepted + rejected findings, formatted as a decision table). User clicks → browser downloads. This is the default delivery path.
- **Download HTML** button in the bar: re-serializes the current document with baked-in decision-pill states, downloads a snapshot.
- Agent-direct MD attachment in chat is the **fallback** when the browser path is unavailable.

---

## How to add a new variant

1. Add `<h1 class="tpl-section-title">Shell — <Workflow></h1>` + subtitle `<p>` in `templates.html`
2. Add `<!-- TEMPLATE: shell-<workflow> START --> ... END -->` block with: CSS, markup (left panel + bottom bar), IIFE reading `<workflow>-findings-data`, `DEFAULT_LABELS` const, `Object.assign({}, DEFAULT_LABELS, _data.labels || {})` merge
3. If the workflow has a bar fragment, add a peer `<!-- TEMPLATE: <workflow>-bar START/END -->` section
4. Document the variant in this file under §Implemented variants

---

## Implemented variants

### Shell — Audit
Reference: `references/audit/audit-template.html` (uses shared `.shell-*` chrome since 2026-04-18; JSON-rendered via the unified engine since v5.0)

Data block id: `audit-findings-data`
Default namespace: `fuse-audit`
Filter axes (hardcoded in variant): category / decision_status / impact / confidence
Arrays: `wireframes` (substrate entries — same shape as wireframing's), `strategy` (site-plan findings), `wireframe` (anatomy findings, optionally element-scoped via `attached_to`), `questions` (post-audit intent)
Variant overrides outside the unified engine: `--shell-pin-color: #c0392b`; DEFAULT_LABELS `bar_pin_toggle: '{Show audit findings}'` + audit-specific detail labels; `renderDetail(id)` post-engine override that dispatches on entry `kind` (`'finding'` vs `'deliberation'`).
Full `DEFAULT_LABELS` key list: see `references/audit/audit-template.html`

### Shell — Wireframing
Reference: `references/wireframing/wireframing-template.html`
Schema: `references/wireframing/wireframing-schema.md` (canonical data contract)

Data block id: `wireframes-findings-data`
Default namespace: `ux-designer-wireframes-{client}-{date}`
Filter axes (hardcoded in variant): page / type / confidence / status
Data shape: single top-level `wireframes[]` array — each entry holds `pageDeliberations[]` + nested `sections[].deliberations[]`; also shared `chrome: { nav, footer }` resolved at render time with per-page `navOverride` / `footerOverride`.
Per-workflow additions: JSON-driven wireframe-page rendering (IIFE walks `sections[].elements[]` and emits HTML per element-kind map — see schema doc). Numbered pointer layer uses the shared `.shell-badge` class keyed to deliberation `id`; annotations toggle (`#wfNotesToggle`) controls pointer + meta-strip visibility.
Classes convention: shell chrome uses the shared `.shell-*` prefix throughout. No wireframing-specific prefix — wireframing-unique UI is added only if genuinely required.
Full `DEFAULT_LABELS` key list: see `references/wireframing/wireframing-template.html`

### Shell — Messaging
Reference: `references/messaging/messaging-canvas-template.html`

Data block id: `messaging-data`
Default namespace: `ux-designer-messaging-{CLIENT-SLUG}-{YYYY-MM-DD}`

Canvas structure: 5-row grid (Context / Problem & Fit / Pillars / Messaging / Narrative-conditional) with 13 cells.

Canvas ↔ panel link: No numbered badges on canvas. Each `.mc-cell` and `.mc-pillar` is a click target; click opens the panel, scrolls matching item into view, applies drop-shadow selection highlight (dark box-shadow treatment, reusing audit's drop-shadow visual — not red). Reverse direction: clicking a panel item applies drop-shadow to the matching canvas cell.

Panel grouping: 5 groups mirroring canvas rows. Narrative group renders only when Row 5 is populated.

Panel filter axes: Row / Confidence / Flag (three chip rows). Row = 5 chips per row group. Confidence = 3 chips (confident / likely / speculative). Flag = 2 chips (missing evidence / no flags) — pillar-specific.

Panel item layout: Decision cells show REC inline + collapsed `<details>` accordion "Alternatives considered (N)" below. Curated and pillar cells show REC inline + reasoning without alternatives section.

Bottom bar: Only shell built-ins — `#shellPanelToggle` + `#shellDownload`. No workflow-specific toggles (messaging has no wireframe substrate / layered annotations).

Download output: Full brief (cells + alternatives + reasoning) generated client-side from the embedded data block. Replaces the workflow's former Step 11 `{slug}_messaging.md` generation — v4.1 workflow produces only HTML.

Portfolio-variant handling: Multi-product / umbrella+line clients use the shell page switcher (each variant = one page). Single-product projects hide the page switcher. Replaces the v3.13 `.mc-variant-chips--canvas` chip row.

JS pattern: Block 1 / Block 2 split (see §Shell chrome JS — inline split pattern (v4.1)). First template to adopt the split; Block 1 is the source of truth for the universal shell chrome.

---

## Two-level CSS scoping convention — `.wf-*` core + `.wf-ext-*` extensions

Canonical scoping pattern for any interactive deliverable that lets authors inject custom CSS alongside a closed core element vocabulary. First implemented for the wireframing shell (see `references/wireframing/wireframing-schema.md` §Extension kinds + §`customStyles`); documented here as the cross-workflow convention so future shells (messaging, audit, project-plan, reverse-wireframing) adopt the same shape when they grow extension envelopes.

### The two prefixes

- **`.wf-*` — core class prefix.** Owned by the workflow template. Carries every closed-vocabulary element kind (`.wf-card`, `.wf-grid`, `.wf-button`, `.wf-media`, `.wf-section`, etc.). Edited only when the schema's closed core changes. Authors of project data blocks NEVER define rules that target these classes.
- **`.wf-ext-*` — extension class prefix.** Authoring-side escape hatch for kinds outside the closed core. Each extension element carries a `className` field whose value MUST start with `wf-ext-`; the renderer's generic fallback wraps the element in `<div class="wf-ext wf-ext--{kind} {className}">`. Authors of project data blocks define rules in a top-level `customStyles` string targeting `.wf-ext-*` selectors only.

The split is enforced at runtime, not by convention alone. The shell's `injectCustomStyles()` function in the IIFE parses the `customStyles` string at `DOMContentLoaded`, splits it into rule blocks, and **scrubs any rule whose selector list contains a non-`.wf-ext-*` selector**. That means a project data block cannot accidentally (or deliberately) override `.wf-card` or `.wf-button` — the namespace guard drops the rule before the `<style>` tag is appended to `<head>`.

### Authoring contract

When a workflow's closed vocabulary cannot express a pattern:

1. Use the extension envelope (see schema for the `kind` / `className` / `fields|children` / `fallbackMd` shape). Pick a stable extension `kind` name (lowercase, hyphen-separated) so cross-project comparability holds.
2. Set `className` to `wf-ext-{kind}` (matching the kind name).
3. Author CSS in the data block's top-level `customStyles` string. Every selector must start with `.wf-ext-` — descendant combinators inside the selector (e.g. `.wf-ext-process-step .label`) are fine, the guard only checks the outermost selector token.
4. Never redefine a core `.wf-*` rule from `customStyles`. The guard will scrub the rule, but more importantly the intent is wrong — if you need to change `.wf-card`, the change belongs in the template's core CSS via a schema cycle, not in a project data block.

### Worked example

```json
{
  "namespace": "wireframes-acme",
  "customStyles": ".wf-ext-process-step { display: flex; flex-direction: column; gap: 8px; padding: 16px; border-left: 3px solid var(--wf-accent); } .wf-ext-process-step .wf-ext__field-key { display: none; }",
  "wireframes": [
    {
      "slug": "onboarding",
      "sections": [{
        "elements": [{
          "kind": "process-step",
          "className": "wf-ext-process-step",
          "fields": { "stepNumber": "1. Day 0", "label": "Connect your CRM", "description": "OAuth into HubSpot or Salesforce." },
          "fallbackMd": "**1. Day 0 — Connect your CRM** · OAuth into HubSpot or Salesforce."
        }]
      }]
    }
  ]
}
```

What the namespace guard accepts and rejects:

| Selector in `customStyles` | Result | Why |
|---|---|---|
| `.wf-ext-process-step { ... }` | accepted | Outermost selector matches `.wf-ext-` |
| `.wf-ext-process-step .wf-ext__field-key { ... }` | accepted | Outermost selector matches; descendant scoping is allowed |
| `.wf-ext-card-header, .wf-ext-card-body { ... }` | accepted | Every selector in the list starts with `.wf-ext-` |
| `.wf-card { padding: 32px; }` | scrubbed | Targets a core class — would override the template's owned vocabulary |
| `.wf-ext-process-step, .wf-card { ... }` | scrubbed | Comma list contains a non-`.wf-ext-` selector — the guard rejects the whole rule |
| `body { background: black; }` | scrubbed | Not prefixed `.wf-ext-` |

The split keeps the deliverable's appearance predictable across projects (every cloned template renders core kinds the same way) while giving the agent a structured way to invent new visual patterns without forking the template.

### Adoption by other workflows

When messaging, audit, project-plan, or any future shell adds an extension envelope, it should:

- Reuse the `.wf-ext-*` prefix. The convention is shell-wide, not wireframing-specific — there is no `.mc-ext-*` / `.audit-ext-*` / `.pp-ext-*` family. One prefix means cross-workflow data blocks remain portable if patterns migrate between deliverables.
- Replicate the `injectCustomStyles()` namespace-guard pattern verbatim from the wireframing template's IIFE (Block 2 — workflow-specific adapter). The guard is generic — only the `customStyles` field name and the `_data` access path are workflow-specific.
- Document the extension envelope in the workflow's own schema file, cross-referencing this section as the canonical scoping rule.

---

## Shell chrome JS — inline split pattern (v4.1)

### Pattern

Each template carries TWO inline `<script>` blocks, delimited by banner comments:

- **Block 1 — UNIVERSAL SHELL CHROME.** Generic shell chrome — panel toggle, filter mechanic, decision pill cycle, LocalStorage persistence, keyboard shortcuts, label replacement, MD download plumbing. Exposes `window.__shell` API. Same code across all workflow templates.
- **Block 2 — WORKFLOW-SPECIFIC ADAPTER.** Data-specific renderers, filter axis registrations, cell-click handlers, MD formatter. Calls `__shell` API. Unique per workflow.

Blocks are clearly delimited: `<!-- UNIVERSAL SHELL CHROME -->` and `<!-- {WORKFLOW}-SPECIFIC ADAPTER -->` HTML comments, plus `/* UNIVERSAL SHELL CHROME ... */` and `/* {WORKFLOW}-SPECIFIC ADAPTER ... */` CSS/JS comments inside each `<script>` block.

No external `.js` file — single-file portability preserved. Clients open the HTML offline without external dependencies.

### `__shell` API contract

Each method listed with one-sentence purpose:

- `__shell.openPanel()` — opens the shell left panel; persists open state to LocalStorage
- `__shell.closePanel()` — closes the panel
- `__shell.togglePanel()` — toggles panel state
- `__shell.registerFilter(axis, chipValues, options)` — registers a filter axis with its chip values; wires click handlers and re-renders chips in the filter area
- `__shell.onFilterChange(callback)` — registers a callback invoked whenever active filters change; callback receives current filter state
- `__shell.setDecision(id, state)` — sets decision state for a cell (pending / accepted / rejected); persists to LocalStorage
- `__shell.getDecision(id)` — returns current decision state for a cell
- `__shell.scrollItemIntoView(cellId)` — scrolls the matching panel item into view (smooth)
- `__shell.applyDropShadow(cellEl)` — applies selection drop-shadow to a canvas cell; removes from previous selection
- `__shell.clearDropShadow()` — removes selection drop-shadow from all cells
- `__shell.getNamespace()` — returns the LocalStorage namespace from the data block
- `__shell.getData()` — returns the parsed `_data` object (raw access for the adapter)

Source of truth for the API is currently `references/messaging/messaging-canvas-template.html` Block 1 (the first template to adopt the split). When audit + wireframing retrofit, they should copy Block 1 verbatim.

## MD export convention

Every interactive template that ships a "Download MD" button follows the same shape so future bug-fix grep can find every site uniformly. Don't invent template-local naming.

### Contract

Each downloadable document type exposes a formatter:

```js
function format{Doc}Md(data) {
  // ...
  return { md: '<markdown string>', filename: '<filename.md>' };
}
```

- **Function name**: `format{Doc}Md` where `{Doc}` is the document name in PascalCase. Examples: `formatWireframesMd`, `formatBriefMd`, `formatCanvasMd`, `formatCopyMd`.
- **Argument**: `data` — typically `_data` from the JSON data block. Some formatters (e.g. audit's brief, which is built from runtime LocalStorage decisions) ignore the argument; keep it in the signature anyway for grep uniformity.
- **Return shape**: object with `md` (string) and `filename` (string). Filename derivation lives **inside the formatter** so there's one place to change it.

### Wiring

Each Download MD button binds a click handler that calls the formatter and passes the result to a universal `triggerDownload` helper:

```js
function triggerDownload(filename, content, mime) {
  var blob = new Blob([content], { type: (mime || 'text/plain') + ';charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

dlBtn.addEventListener('click', function() {
  var r = formatXxxMd(_data);
  triggerDownload(r.filename, r.md, 'text/markdown');
});
```

Same `triggerDownload` signature in every template (matches audit + wireframing). Messaging-style `downloadMd(formatterFn)` shared API was retired — it added an indirection without earning its complexity, and only obscured the formatter contract.

### Multi-document templates

Templates with multiple downloadable documents (e.g. messaging has both canvas + copy) expose one formatter per document, all matching the contract:

```js
function formatCanvasMd(data) { return { md: ..., filename: ... }; }
function formatCopyMd(data)   { return { md: ..., filename: ... }; }
```

### Multi-variant templates

Templates that render multiple variants per document (currently only messaging) layer variant-level helpers under the document-level formatter — these are PRIVATE (underscore-prefixed) and don't need to follow the contract:

```js
function formatCanvasVariantMd(variant) { /* returns string for one variant */ }
function _formatCanvasAllMd(data) {
  return (data.variants || []).map(formatCanvasVariantMd).join('\n---\n\n');
}
function formatCanvasMd(data) {
  return { md: _formatCanvasAllMd(data), filename: ns + '-canvas.md' };
}
```

The public formatter is `formatCanvasMd`. Helpers are implementation detail.

### Translation

All section headings, field labels, and inline markers in MD output route through `LABELS.md_*` keys — never hardcoded inside formatter functions. Hardcoded English in MD formatters is the exact bug class to avoid: every literal string in the output should be a `LABELS` lookup.

Translation itself happens at **clone time**, not at runtime: the agent substitutes Polish/target-language strings directly into the `DEFAULT_LABELS` object in the cloned project file. The `_data.labels` runtime override is a fallback path the merge supports — useful for retrofitting a generated file without re-running the workflow — but the workflow's primary path is clone-time substitution into `DEFAULT_LABELS` itself. See each variant's per-workflow doc (`messaging-canvas.md §Language rule`, equivalent rules in `wireframing-craft.md` / audit docs) for the canonical statement.

## Download button convention

Every interactive template that ships download buttons in the bottombar follows the same shape so users see a consistent control across deliverables and bug-fix grep finds every site uniformly.

### Bottombar group layout

A single download group lives at the right edge of the bottombar. The group has a `Download:` label, then HTML first, then MD variant(s):

```html
<div class="shell-bottombar__group" id="{prefix}DownloadGroup">
  <label style="color:#666;" data-label-key="bar_download">{Download:}</label>
  <button class="shell-bottombar__btn is-active" id="{prefix}DownloadHtml" ...>
    <span data-label-key="bar_download_html">{Document HTML}</span>
  </button>
  <button class="shell-bottombar__btn is-active" id="{prefix}DownloadMd" ...>
    <span data-label-key="bar_download_md">{Document MD}</span>
  </button>
</div>
```

- **Group label** key is `bar_download`, value `{Download:}`.
- **DOM order** is HTML first, then MD variant(s) — left to right.
- **Button class** is always `shell-bottombar__btn is-active` (renders dark fill + white text). Plain `shell-bottombar__btn` (border-only) is reserved for non-download chrome.
- **Group id** ends with `DownloadGroup` so the visibility wiring can hide/show the whole row.

### Button labels

`{Document} {Format}` — title-case document name + ALL CAPS format. No verb on the per-button label (the group's `Download:` label carries the verb).

| Template | Buttons (in DOM order) |
|---|---|
| Audit | `Audit HTML` / `Audit MD` |
| Wireframing | `Wireframe HTML` / `Wireframe MD` |
| Messaging | `Messaging HTML` / `Canvas MD` / `Copy MD` |
| Project plan | `Project Plan HTML` / `Project Context MD` / `Project Strategy MD` / `Section Map MD` / `Design Plan MD` |

Multi-document templates use the document name as the disambiguator (e.g. `Canvas MD` vs `Copy MD`); the format suffix (`HTML` / `MD`) is still required.

### DOM ID pattern

`{templatePrefix}Download{Document?}{Format}[Btn]` — template prefix is template-scoped (not universally `shell`); the trailing `Btn` is optional but consistent within a single template.

- Audit + wireframing + project-plan use `shell` prefix, no trailing `Btn` (e.g. `shellDownloadHtml`, `shellDownloadContextMd`).
- Messaging uses `mc` prefix with trailing `Btn` (e.g. `mcDownloadHtmlBtn`) for grep-disambiguation against shared shell chrome IDs — see `messaging-canvas.md §Block 1 / Block 2 split`.

Both shapes are compliant. Don't normalize them.

### Conditional visibility

Every download button hides when its target content isn't populated. Hide the entire group when no buttons remain visible.

- **HTML button:** visible whenever the canvas itself is rendered. For single-doc templates (audit, wireframing) that's "any data block content present"; for messaging it's `VARIANTS.length > 0`; for project-plan it's "at least one sub-page populated".
- **MD button(s):** visible only when the targeted MD content is populated. Per-document MD buttons (project-plan's 4 sub-page buttons, messaging's `Copy MD`) hide individually when their data block is template-stock.
- **DEMO_MODE:** when the template is rendered with raw stock (no agent write), all download buttons stay visible so designers can preview the bottombar chrome. Detected per template by its existing demo signal (namespace `{` placeholder, `_template_stock` sentinel, or equivalent).

The two detection mechanisms — sentinel-based (audit / wireframing / project-plan, where `write_*` helpers replace the whole data block) and field-walk (messaging, where the clone procedure mutates fields in place) — are both valid. Each template uses whichever matches its write semantics; don't unify.

### HTML formatter contract (additive)

New HTML downloaders mirror the MD formatter shape from §MD export convention above:

```js
function format{Doc}Html(data) {
  // ...
  return { html: '<full HTML string>', filename: '<filename.html>' };
}
```

Wired identically: `triggerDownload(r.filename, r.html, 'text/html')`. Existing helpers in audit (`downloadAuditHtml`), wireframing (`downloadWfdHtml`), messaging (`_downloadHtml`) predate this contract and are grandfathered — only NEW HTML downloaders need to follow the new shape.

### Migration procedure for existing templates

Audit, wireframing, and future RW/project-plan templates currently use a monolithic IIFE. To migrate to the split:

1. Read the template's current IIFE; identify generic pieces (shell chrome) vs workflow-specific (renderers, filter axes, formatters).
2. Copy Block 1 (universal shell chrome + `__shell` API) from `messaging-canvas-template.html` verbatim into your template, replacing the corresponding generic portions.
3. Move the workflow-specific pieces into a SECOND `<script>` block (Block 2), rewriting any direct DOM manipulation that duplicates Block 1's behavior to use `__shell` API methods instead.
4. Verify behavioral parity in a browser (panel open/close, filter chips, decision toggles, MD download).
5. Commit the split; update §Implemented variants entry for that workflow to note the split pattern is adopted.

### Why inline, not external `.js`

Templates are self-contained, single-file HTML deliverables. Clients receive one `.html` file (`messaging-canvas.html`, `{slug}_wireframes.html`, etc.) and open it offline — no external dependencies. The split is STRUCTURAL (two `<script>` blocks inside one HTML file), not PHYSICAL (two files). Duplication across templates is accepted in exchange for portability; `/wm:change` or retrofit-time updates to Block 1 must propagate verbatim across all templates.

---

## Canvas/substrate content — render from JSON (canonical pattern)

### Pattern

**Canonical pattern: render from JSON.** All workflow templates render canvas/substrate content from the embedded `<script type="application/json">` data block at runtime, not from static HTML in the body. The body contains empty container elements (`<div id="shellPages">` for wireframing, `<div id="canvasRoot">` for messaging, etc.); the IIFE reads the data block and inserts HTML at init. The agent producing the deliverable authors ONLY the JSON — no HTML editing in the body.

### Why JSON-driven

- **Single source of truth.** Content lives in one place; the IIFE is the renderer.
- **Schema-validatable.** JSON blocks can be validated against a schema before delivery.
- **No content-duplication.** No risk of HTML body and JSON data diverging.
- **Simpler agent authoring.** One artifact to produce; the renderer handles structure.
- **Download-to-MD works naturally.** The MD export reads the same data block that drives the visual — no separate extraction step.
- **Visual redesigns are safe.** Changing the renderer (IIFE) does not require rewriting content across delivered files.

### Trade-off accepted

Requires JavaScript to render content. This is a non-issue — every interactive deliverable already requires JS for panel/filter/decision behavior. There is no static-HTML fallback mode, and none is planned.

### Template shape

Body has empty containers + chrome markup only. The IIFE contains a `render{Substrate}()` function called at init and on variant switch:

- `renderWireframePage()` — wireframing template, walks `sections[].elements[]` per page
- `renderCanvas()` — messaging canvas template, builds the 5-row grid from cell data
- `renderContextSubPage()` / `renderStrategySubPage()` / `renderInventorySubPage()` — project plan template; each walks `data.canvas.rows[]` and dispatches per `row.type` (cards / heading / sitemap / page-map / summary / template-arch). Called once at init (static data per deliverable).

### Event binding

Canvas elements are dynamic (inserted by the renderer at runtime). Event handlers must use **delegation** — a single listener on the container that resolves the target via `event.target.closest('.cell-class')`. Never bind handlers directly to specific canvas elements at init; they do not exist yet at that point. Re-binding after each `render*()` call is the alternative for complex cases, but delegation is preferred.
