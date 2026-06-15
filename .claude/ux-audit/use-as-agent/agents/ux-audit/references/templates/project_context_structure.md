---
type: agent-ops
purpose: "Template structure for project context deliverable"
---
# Standard Project Data Structure

## Core Aspects for Discovery

The agent ALWAYS analyzes these minimum aspects when forming assumptions in Workflow 1, Step 2:

* **Industry** — sector, market type, business model (maps to: # Project Overview)
* **Goal** — primary business goal for the project (maps to: # Strategic Pillars)
* **Audience** — target users, persona, awareness level (maps to: # Target Audience)
* **Alternatives** — behavior clusters of what the client does instead of buying; each cluster names a behavior (status quo, internal DIY, general-purpose tools, category competitors, manual workarounds, etc.) — not a specific provider. Cluster by client behavior, not by provider service lines (maps to: # Alternatives)

Additional aspects the agent MAY analyze depending on input richness:

* **Business model** — subscription, freemium, one-time, marketplace (maps to: # Project Overview)
* **KPI / success metric** — measurable outcome that defines success (maps to: # Strategic Pillars)
* **Awareness level** — how aware the audience is of the problem/solution (maps to: # Target Audience)
* **Voice / tone** — communication style, brand personality (maps to: # Brand Voice)
* **Functional scope** — what the product/site includes and excludes (maps to: # Functional Scope)

The agent uses these aspect categories during Discovery (Workflow 1, Step 2) to form assumptions. Not all sections need to be filled — the agent fills what it can infer and asks about the rest.

---

## Schema Sections

The `project_context.md` file should ideally contain:

*   **# Global Settings**: Slug (project-slug, kebab-case), Language (PL/EN), Site Type (one of 15 types: b2b-saas, ecommerce, portfolio, local-business, nonprofit, media, event, marketplace, community, course, enterprise-tools, service-utility, government-institutional, documentation-kb, web-application). **Site Type is internal — load-key for `references/domains/{slug}/` knowledge files; never rendered in user-facing deliverables and never spoken in chat. See `agent.md` §Internal identifiers rule #7.**
*   **# Project Overview**: Name, Description, Business Model.
*   **# Strategic Pillars**: Primary Goal, Success Metric.
*   **# Target Audience**: Primary Persona, Anti-Persona, Awareness Level.
*   **# Brand Voice**: Tone of Voice (voice summary + defining traits). *(Discovery Step 1 bonus prompt: "existing brand guidelines or tone of voice" — surfaces voice only; deeper brand-identity concerns — visual system, logos, full values — are out of scope for Discovery.)*
*   **# Alternatives**: behavior clusters of what the client does instead of buying — each entry is a cluster name (e.g. Status quo, Internal DIY, General-purpose tools, Category competitors) plus a short description of that behavior. Cluster names must describe client behaviors, not provider service lines (inside-out rule per `references/messaging/messaging-canvas.md` §Per-cell scope).  *(Differentiator + Positioning Strategy — Enemy / Anchor / Wedge — moved to Strategy schema in v4.0. Those fields are produced as Strategy output now; Discovery-level extraction is a Phase 2 TODO.)*
*   **# Top Tasks**: Actions that a website visitor performs on the site — expressed as user verbs. Priority level (Recommended / Consider), Rationale.
    - User = website visitor, NOT the designer, client, or project team.
    - Bad (project tasks): "Wireframe the one-pager", "Section architecture", "Messaging: value proposition"
    - Good (visitor tasks): "Compare plans", "Schedule demo", "Check integrations", "Read case study"
*   **# Functional Scope**: Included features/pages, Excluded features/pages, Rationale for exclusions.

## Project-specific fields (domain tier)

In addition to the universal sections above, Discovery Step 5 asks domain-specific questions drawn from `references/domains/{site_type}/{site_type}-discovery.md`. Those answers persist into the `context_meta` JSON block under a `domain` object — not into the narrative sections. The downstream Project Plan Context sub-page renders these as the "Project specific" tier of cards (one row per populated domain).

**Schema shape:** `context_meta` gains a top-level `domain` object whose keys are domain-field slugs — e.g. `context-data.domain.sales_motion`, `context-data.domain.pricing_tier`, `context-data.domain.catalog_size`. Each value is either a plain string (simple answer) or an object matching the per-field metadata shape (for 🟡 / 🔴 items that carry rationale + alternatives).

**Per site type:** the `domain` key set varies by site type. The canonical per-domain field list lives alongside each domain discovery file (`domains/{slug}/{slug}-discovery.md`), so the mapping is authored once per domain, not hard-coded here. (No specific site type is named in this schema doc as illustration — see `agent.md` §Internal identifiers rule #7.)

**Universal tier vs. domain tier:**
- **Universal tier** — required for every project; always written to narrative + metadata.
- **Domain tier** — optional at the field level; empty fields produce no card on the Context sub-page.

## Render artifact — `<!-- context_data -->` JSON block

Alongside the `<!-- project_context_meta -->` block, Discovery Step 10.9 appends a second fenced JSON block under the marker `<!-- context_data -->` carrying the shape the Project Plan template's `#context-data` block consumes. It is a **render artifact** derived from the narrative + meta — do not duplicate authoritative field values there.

**Top-level fields:** `namespace` (shape: `ux-designer-project-plan-{slug}-{YYYY-MM-DD}`), `labels` (`{}` unless localization override), `canvas.rows[]`, `items[]`.

**Canvas rows:** two `cards` rows — Universal (7 cards, `variant: three`) and Project-specific (N cards from populated `domain.*`, `variant: three`).

**Items (Universal — 7 fixed ids, fixed layouts):**

| id                        | layout       | Source                                                                                                 |
|---------------------------|--------------|--------------------------------------------------------------------------------------------------------|
| `context-id-overview`     | `simple-meta`| `# Project Overview` — Name / Description / Business Model                                             |
| `context-id-goal`         | `simple-meta`| `# Strategic Pillars` — Primary Goal / Success Metric                                                  |
| `context-id-audience`     | `simple-meta`| `# Target Audience` — Primary Persona / Anti-Persona / Awareness Level                                 |
| `context-id-alternative`  | `simple-meta`| `# Alternatives` — 4 cluster bullets                                                                   |
| `context-id-top-tasks`    | `ranked-list`| `# Top Tasks` — `ranked: [{text, priority}]`                                                           |
| `context-id-scope`        | `scope-split`| `# Functional Scope` — `scope_split.included[] / excluded[]`                                           |
| `context-id-voice`        | `simple-meta`| `# Brand Voice` — Tone of Voice                                                                        |

**Items (Project-specific — one per populated `domain.<slug>`):** `id: context-id-<domain-slug>`, `group: project-specific`, `layout: simple-meta` by default.

**Every item carries:** `id`, `group ∈ {universal, project-specific}`, `confidence ∈ {high, medium, low}` (mapped from 🟢/🟡/🔴), `title`, `layout`, layout-specific content fields, `rationale` (string), `alternatives` (string synthesized from meta's `alternatives[]` reject-reason pairs joined with `; `, or empty for 🟢 items).

Do NOT duplicate authoritative field values — `context_data` fields read from the same sources the narrative + meta already capture.

---

## Per-Field Metadata (Structured JSON Block)

Appended at the bottom of every `project_context.md` file, after all narrative sections. Contains one entry per 🟡 or 🔴 assumption. 🟢 items are excluded (no ambiguity to record).

Marker line immediately before the opening fence: `<!-- project_context_meta -->`

### Field schema

| Field | Type | Description |
|-------|------|-------------|
| `field_name` | string (snake_case) | Matches the section schema field name (e.g. `goal`, `competitive_alternative`) |
| `value` | string | The value chosen as the primary inference or user-confirmed value |
| `confidence` | `"🟡"` \| `"🔴"` | Confidence tier at time of capture (before user correction) |
| `rationale` | string | Why this value was chosen; what signal supported it |
| `alternatives` | array of `{name, reason_rejected}` | Other plausible values considered and why each was not chosen |
| `source` | `"user_input"` \| `"agent_inference"` \| `"user_corrected"` | Origin of the final value |

### Example

```json
[
  {
    "field_name": "goal",
    "value": "customer acquisition",
    "confidence": "🟡",
    "rationale": "User said 'grow our user base' — acquisition is the most direct reading.",
    "alternatives": [
      { "name": "activation", "reason_rejected": "No mention of onboarding or in-product metrics" },
      { "name": "retention", "reason_rejected": "No indication of an existing user base to retain" }
    ],
    "source": "user_input"
  },
  {
    "field_name": "competitive_alternative",
    "value": "Asana",
    "confidence": "🟡",
    "rationale": "Dominant player in the agency PM space; user did not name a competitor.",
    "alternatives": [
      { "name": "Monday.com", "reason_rejected": "Less common in agency-specific contexts" },
      { "name": "Notion", "reason_rejected": "Often used for docs, not primary PM tool" }
    ],
    "source": "agent_inference"
  }
]
```
