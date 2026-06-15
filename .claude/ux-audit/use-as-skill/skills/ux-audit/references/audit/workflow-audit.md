---
type: agent-ops
purpose: "Domain Audit workflow steps, gates, and checkpoint definitions"
---
Follow §Communication Rules from agent.md
Follow §Internal identifiers from agent.md
Use: `references/shared/interactive-deliverable-shell.md` — shell architecture (per-workflow variants, self-bootstrap from embedded JSON data block, labels dict override, LocalStorage namespace, JS scope, delivery paths)
Read: `references/wireframing/substrate-fidelity.md` — substrate-fidelity rules apply on every wireframe-authoring path invoked by this workflow, inline or via subagent dispatch. Loaded into authoring context at workflow entry so the rules bind regardless of which path Step 5.1 / Step 5.3 take.

## Domain Audit

### Purpose
Evaluate an existing website against the agent's own domain knowledge (17 site types × 5 reference files) and produce two annotated deliverables — site plan with suggestions and wireframes with suggestions. Domain-grounded, not heuristic. The audit's value is that it runs the same criteria the agent would use to **design** a site of this type, in evaluation mode, against the existing one. User's own framing: "reverse workflow" — same knowledge used to create is now used to evaluate.

Not a redesign proposal. Not a generic UX review. Not a performance, SEO, brand, or WCAG audit. If a redesign follows, it's a separate workflow (WF1 Discovery+) that can consume audit output as input.

### When to Use
- User has an existing website and wants it evaluated against domain-specific patterns (e.g., "does this B2B Industrial Configurator-Led site have the approval workflow anatomy it should?")
- User wants concrete, domain-grounded suggestions on structure, IA, and page anatomy — not opinion or heuristics
- Audit is the standalone deliverable (billable on its own) or Phase 0 of a separate redesign engagement

### Prerequisites
- **URL is the only required input.** No upfront stakeholder brief, no analytics, no persona docs required. The audit is intentionally low-friction. If the user volunteers a brief or analytics, they are accepted as optional extra context but the workflow never blocks on them.
- Reverse Wireframing (v3.5+) substrate-acquisition primitives must be runnable — Audit and RW share Steps 1-3 (substrate acquisition → site-type inference → present-site). If the substrate cannot be acquired (Phantom-Browser/WebFetch all unreachable per `phantom-browser.md §Per-Platform Retrieval`), the audit does not run.
- `projects/{client}/` folder — assumed to exist (orchestrator pre-routing check).

### Tool

The audit shares **Steps 1-3** with `references/workflow-reverse-wireframing.md` (substrate acquisition → site-type inference → present-site), then diverges at **Step 4 — user-facing scope STOP** (homepage / full-site / custom). Substrate-source is operational dispatch internalized inside Step 1 — invisible to the user. Strategy-grounding (`current-website/project_plan.html#strategy-data` presence) is annotation metadata only — it shapes the confidence default on findings, not the flow.

All Phantom-Browser / WebFetch tooling per `references/phantom-browser.md §Per-Platform Retrieval` (cli/claude-api → Phantom + retry-gate; claude-web/chatgpt-web/gemini-gem → WebFetch + V_min subagent + mobile-style wireframe). Orchestrator §Dual-state artifact convention documents `current-website/` path conventions; standalone audit always treats target as existing-site context regardless of routing mode.

### Process Flow

```
┌─────────────────────────────┐
│ URL (the only required      │
│ input)                      │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Step 1: Substrate acquisition        │
│ • 1.1 Read upstream substrate if     │
│   present (`current-website/*.json`) │
│ • 1.2 Else fetch via platform fork   │
│   (Phantom retry-gate on cli/api;    │
│   WebFetch + V_min on web-class)     │
│ • 1.3 Validate-and-decide before     │
│   any deliverable shell is committed │
└──────────────┬───────────────────────┘
               │ substrate validated
               ▼
┌──────────────────────────────────────┐
│ Step 2: Site-type inference          │
│ • Classify against 17 domains        │
│ • Load archetype's domain knowledge  │
│ • Form internal context model        │
│   (silent, no chat output)           │
└──────────────┬───────────────────────┘
               │ internal model formed
               ▼
┌──────────────────────────────────────┐
│ Step 3: Present site                 │
│ • Plain-language site summary        │
│   (informational only, no STOP)      │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Step 4: Scope STOP                   │
│ • Recommended (default, editable;    │
│   context-aware 3–5 templates with   │
│   per-template reasoning, sized to   │
│   the audit's purpose)               │
│ • Full                               │
│ *(STOP checkpoint — user picks)*     │
└──────────────┬───────────────────────┘
               │ scope chosen
               ▼
┌──────────────────────────────────────┐
│ Step 5: Annotate audit               │
│ • 5.0 Clone {slug}_audit.html with   │
│   validated state                    │
│ • 5.1 Per-page substrate (full-site/ │
│   custom: fetch additional pages)    │
│ • 5.2 Site plan pass — strategy[]    │
│ • 5.3 Anatomy pass — wireframe[]     │
│ *(STOP checkpoint)*                  │
└──────────────┬───────────────────────┘
               │ findings ready
               ▼
┌──────────────────────────────────────┐
│ Step 6: Package + intent questions   │
│ • Post-audit strategic intent Qs     │
│ • Final consistency pass             │
│ • Chain-aware delivery (standalone   │
│   → 3 terminal options; in-redesign  │
│   → handoff to Strategy)             │
└──────────────────────────────────────┘
```

### Detailed Steps

#### Step 1: Substrate acquisition

Shared with `references/workflow-reverse-wireframing.md` Step 1. Substrate-source is operational dispatch internalized here — invisible to the user.

##### Step 1.1: Look for upstream substrate

Read `projects/{client}/current-website/`:
- If `current-website/wireframes.html` exists with full-site coverage → read it; substrate is on disk. Skip to Step 1.3 with on-disk substrate.
- If `current-website/audit-feed/layouts/{slug}-1.json` exists for the homepage → read it; substrate is on disk. Skip to Step 1.3 with on-disk substrate.
- Otherwise → proceed to Step 1.2 fetch.

##### Step 1.2: Fetch substrate

**Gate:**
- User has provided a URL
- `projects/{client}/` folder exists
- No upstream substrate found at Step 1.1
- First network call against the target URL is Phantom-Browser via `/api/layout-map` (cli/claude-api) OR WebFetch (web-class platforms per `phantom-browser.md §Per-Platform Retrieval`). Retry-on-sparse per `phantom-browser.md §Sparse-result retry`. Fallback only after documented Phantom failure + user approval.
- If any unmet → ask the user for the missing input or retry the documented protocol; do not proceed with an alternate fetcher.

Follow §Gate Rules from agent.md
Follow §Workflow Fidelity Rules from agent.md

Read: `references/phantom-browser.md` — Per-Platform Retrieval row body for the active platform. `references/workflow-reverse-wireframing.md` — V_min subagent prompt body (Step 5 Mode C web-platform branch) for web-class platforms.

**Web-class platform notice (FIN-013).** When `platform ∈ {claude-web, chatgpt-web, gemini-gem}`, BEFORE acquiring the substrate, surface a short notice to the user covering:

- they are on a web platform that has limited capability for this workflow
- the audit can only be built as a mobile-style preview (single column, around 400px wide)
- desktop fidelity is available by switching to the IDE version (Claude Code, Codex, Antigravity)
- ask whether to proceed with the mobile audit or stop

Follow §Communication Rules and §Plain language is the default from agent.md. Do not name internal tools or implementation details (no Phantom-Browser, WebFetch, layout-map, sandbox, fetch, etc.).

Wait for user confirmation. On approval → proceed with the platform-fork below. On decline → STOP and recommend the IDE version. On `cli` / `claude-api`, skip this notice — desktop rendering is the default path with no platform limitation to disclose.

**Platform fork (per FIN-013):**

- **cli / claude-api:** call Phantom-Browser via `/api/layout-map` against the target URL. Retry-gate per `phantom-browser.md §Sparse-result retry` (1 retry with `waitFor=<selector>` on sparse result). Persist response JSON to `projects/{client}/current-website/audit-feed/layouts/{slug}-1.json` (per FIN-009 sub-decision b workflow amendment — substrate persistence applies in all audit scopes). Desktop rendering at Step 5.0 clone — no `wf-mobile` body class.
- **claude-web / chatgpt-web / gemini-gem:** dispatch the V_min subagent prompt (canonical body in `references/workflow-reverse-wireframing.md` Step 5 Mode C web-platform branch) over a WebFetch substrate. Substrate lives in agent memory; no filesystem write (web platforms have no persistent disk). Mobile rendering at Step 5.0 clone — agent emits the deliverable with `<body class="wf-mobile">` so the audit-template renders single-column at 400px max-width (mobile CSS already in `references/audit/audit-template.html` `body.wf-mobile` block).

**Substrate-first invariant.** The fetch happens BEFORE the deliverable shell is cloned. Step 1.3 validates the response before any file is materialized. **No audit findings, recommendations, critique, or HTML artifact may be emitted until Step 1.3 validation passes and Step 5.0 clone runs.**

##### Step 1.3: Validate-and-decide

**Gate:**
- A substrate response exists (in memory or on disk).
- If absent → return to Step 1.2 and re-fetch via the documented protocol.

Follow §Gate Rules from agent.md

Read the response BEFORE any deliverable shell is committed. Validate four signals:
1. **Final URL after redirects** matches the user-stated target (no silent redirect to login wall, paywall, or unrelated page).
2. **`nodeCount > threshold`** (substantive content; not 404, blank shell, or JS-only render that blocked Phantom).
3. **Inferred language** from copy sample (read `nodes[]` text for cli/claude-api; read WebFetch markdown body for web-class) — if inferred language differs from user-stated `project_language`, surface ONE clarification before proceeding.
4. **`<h1>` text** plausibly matches the audit scope — if user said "audit my B2B SaaS" and `<h1>` is the agent's own login screen, surface clarification.

On any mismatch → surface ONE clarification to the user; wait for the answer; re-validate. On all-pass → proceed silently to Step 2.

**Recovery from drift.** If the agent realizes it has emitted audit-shaped output before Step 1.3 validation passed (chat audit, improvised HTML, "Audyt — pass 1" framing), the recovery rule is: return to Step 1.1; do not improvise non-canonical HTML to "fix" the skipped step. The only audit deliverable shape is `audit-template.html`-derived; no other HTML may be emitted as "the audit."

**Output:** validated substrate (in memory + persisted JSON on cli/claude-api). Step 2 receives the substrate.

---

#### Step 2: Site-type inference

**Gate:**
- Step 1.3 validation passed
- Substrate available (in memory or on disk per Step 1.2 platform fork)
- If unmet → return to Step 1.

Follow §Gate Rules from agent.md

Form an audit-oriented internal model. This step writes nothing to chat and produces no file output — the model lives in agent memory and feeds Steps 3, 4, 5.

##### Step 2.1: Classify against 17 domains

From the homepage substrate, classify the site against the agent's 17 domain knowledge files. Same classification logic RW uses in its shared Step 2 — applied uniformly here, not gated on full-site scope.

##### Step 2.2: Load matched archetype's domain knowledge

Load shared + archetype-specific reference slots:
- **Shared slot:** `references/shared/conversion.md`, `references/shared/ia-principles.md`, `references/shared/content-architecture.md`, `references/shared/composition.md` — cross-archetype baselines
- **Archetype-specific slot:** the domain files for the archetype(s) resolved at Step 2.1 — e.g. `references/domains/b2b-industrial/b2b-industrial-archetypes.md`, `b2b-industrial-patterns.md`, `b2b-industrial-audience.md`, `{archetype}-components.md`

If the site is a hybrid of two known archetypes, load both sets.

##### Step 2.3: Form internal context model

Note ambiguities, intentional-vs-default signals, declared gaps, and archetype confidence (🟢 high / 🟡 medium / 🔴 low). The matched archetype's slug + path persist later in the audit JSON `domain_ref` field — storage only, never rendered to user.

**Output:** Internal model (matched archetype + confidence + declared gaps). No chat output.

---

#### Step 3: Present site

**Gate:** Step 2 internal model formed.

Follow §Gate Rules from agent.md

Follow §Communication Rules from agent.md
Follow §Internal identifiers from agent.md
Follow §Challenge user hypotheses from agent.md

Compose plain-language site summary from the internal model — what the site is, audience signal, archetype match + confidence tier (🟢/🟡/🔴), declared gaps. Render in chat. Purely informational; frames the next decision (Step 4 scope STOP).

**No descriptive coverage statement, no 3-option agree/general/stop choice** (the previous descriptive-coverage STOP shape is eliminated — its job is split between this Step 3 informational summary and Step 4's user-facing scope STOP).

**Output:** Plain-language site summary rendered in chat. Mode flag NOT set — flow proceeds without mode dispatch.

---

#### Step 4: Scope STOP  *(STOP checkpoint)*

**Gate:** Steps 1–3 complete; full audit annotation pass produced and the deliverable artifact is being packaged.

The Step 4 body — post-audit strategic intent questions written to the `questions` data block (homepage-first mode), final consistency pass across findings, confirmation that the bottom bar carries Download HTML / Download MD affordances, and saved-file path announcement — remains unchanged from the original `references/audit/workflow-audit.md` Step 4 sub-steps 1, 2, 3, and 6.

**Closing — replaces the standalone-chain delivery message.**

The original Step 4 sub-step 4 (chain-aware delivery message) closes the standalone audit chain by offering three follow-up paths (Clarify intent / Iterate to next pages / Done — where Done itself surfaces legacy options of starting a redesign that takes findings as the brief or applying fixes and re-running). That standalone-chain three-option offer is replaced.

Instead, emit a closing message at runtime that conveys:

1. The audit is complete and the deliverable is saved (announce the file path).
2. The agent name in plain language ("UX Audit Skill").
3. A soft pointer to the paid product per the standard pattern in `agent.md §Override: Final Instructions` item 6 body element 3 — "for the full UX process, see UX Designer by Creative Sparks." Single sentence, no ceremony.

Compose the message at runtime in the project language per `agent.md §Override: Communication Rules`. No canned copy in this file. The within-redesign chain branch is moot — `ux-audit-skill` ships only Domain Audit, so the standalone branch is the only path that fires.

**Output:** Saved deliverable (`{slug}_audit.html`), final paths announced to the user, and the closing message above emitted in place of the standalone-chain three-option offer.

#### Step 5: Annotate audit  *(STOP checkpoint)*

**Gate:**
- Step 4 scope chosen
- Substrate validated (Step 1.3 passed)
- Internal model formed (Step 2 complete)
- If any unmet → return to the step that produces the missing piece.

Follow §Gate Rules from agent.md

Follow [#Data Block Mutation Rules](references/shared/data-block-mutation-rules.md#data-block-mutation-rules) from references/shared/data-block-mutation-rules.md

##### Step 5.0: Clone audit deliverable shell

Clone happens AFTER Step 4 scope choice — clone with validated state once user has picked scope.

**Clone.** Copy `references/audit/audit-template.html` to `projects/{client}/{slug}_audit.html` if not already present (idempotent — re-runs of Step 5 are safe). Clone-time substitutions:
- `{slug}` in `<title>` → project slug
- `{project-language}` in `<html lang>` → project language value (validated against Step 1.3's inferred language; user clarified at Step 1.3 if mismatch)
- **Mobile rendering on web-class platforms (FIN-013):** read the `platform` value from Step 1.2. If `platform ∈ {claude-web, chatgpt-web, gemini-gem}`, also set `<body>` to `<body class="wf-mobile">` so the audit-template renders single-column at 400px max-width. Mobile CSS already lives in `references/audit/audit-template.html` `body.wf-mobile` block. Cli/claude-api default to no mobile class (desktop rendering).

**Substitute every remaining user-facing placeholder at clone time.** After cloning, grep `{slug}_audit.html` for the pattern `\{[^}]*\}` and, for each match, either substitute it (user-facing label — translate to project language per `agent.md §Communication Rules`) or preserve it (runtime-variable token). Translation is generated at clone time; this spec stores no localized table.

**Preserve these runtime-variable tokens verbatim (do not substitute):**
- `{slug}` — already handled above
- `{project-*}` — any token starting with `project-` (e.g. `{project-language}`); already handled above
- `{n}`, `{i}`, `{total}` — shell runtime variables interpolated at render time

When a composite placeholder contains a runtime variable, substitute the prose around the variable and keep the inner runtime token verbatim. Field shapes inside the JSON data block (`impact`, `confidence`, `decision_status`, `status`, `tag` enum values) are NOT placeholder strings; leave them untouched.

**MANDATORY pre-assembly — translate bracketed UI labels into the `labels` object.**

Follow [#Translate canonical terms 1:1](agent.md#translate-canonical-terms-11) from agent.md
Follow [#Plain language is the default](agent.md#plain-language-is-the-default) from agent.md (project language source — `current-website/project_context.md` if present; otherwise the validated language from Step 1.3)

Walk every key in the template's `DEFAULT_LABELS` block in `references/audit/audit-template.html`. Each value wrapped in `{...}` braces is a placeholder semantic description — produce the project-language equivalent for each key and write it unbracketed into the data block's `labels` object. Missed keys fall back to the English bracketed default at render time, which is the visible failure signal.

Preserve runtime-variable tokens inside label values verbatim — e.g. `nav_counter` keeps the `{i}`/`{total}` interpolation tokens (Polish equivalent: `'{i} z {total}'`), `filter_label_active` keeps `{n}`. Strip only the OUTER braces.

`labels` is never `{}`. Empty labels = broken deliverable.

**MANDATORY pre-assembly — extract `chrome.nav` and `chrome.footer` from substrate.**

Walk the validated homepage substrate from Step 1 (cli/claude-api: `current-website/audit-feed/layouts/{slug}-1.json`; web-class: in-memory WebFetch substrate). Follow `references/wireframing/substrate-fidelity.md` §Chrome walk for substrate-walk discipline and `references/workflow-reverse-wireframing.md` §Orchestrating-agent-assembly step 2 for field-mapping heuristics — the rule is shared with Reverse Wireframing. Every nav link (including Login, Signup, language switcher, utility CTAs) and every footer column come from the actual `<nav>` and `<footer>` subtrees in the substrate, never from a flat anchor scan or memory. The rendered chrome IS the user's site frame around the wireframes — drift here breaks fidelity-to-original and obscures meaningful audit signals (parent-company affiliations, secondary nav items, footer-only resource links).

**Post-clone validation** — after writing `{slug}_audit.html`:
1. `grep` for `\{[^}]*\}`. Every remaining match must be a preserved runtime-variable token (`{n}`, `{i}`, `{total}`, `{slug}`, or `{project-*}`) or a schema-defined enum value inside the JSON data block.
2. `grep -o '"labels":\s*{[^}]*}' {slug}_audit.html` must show a populated object, not `"labels": {}`.
3. `python references/scripts/ux_utils.py check-html projects/{client}/{slug}_audit.html` exits 0.
4. `chrome.nav.cta.label` matches the rightmost button-styled link inside the substrate's `<nav>` subtree.
5. `chrome.nav.links` includes every link from the actual `<nav>` subtree (utility links not stripped).
6. `chrome.footer.legal` carries the page's actual copyright line, including parent-company name when present.

##### Step 5.1: Per-page substrate fetch (scope-dependent)

Append the validated homepage substrate from Step 1 to `{slug}_audit.html`'s `wireframes[]` JSON array via `append_wireframe_data(audit_html_path, wireframe_entry)`. The helper is idempotent on duplicate `slug`.

**Saver discipline.** Every wireframe write goes through `append_wireframe_data` (or `write_project_plan_block` for full data-block emits). The helper carries a pre-save coverage gate; bypassing it via direct file writes / hand-rolled HTML emission / custom save scripts bypasses the gate. See `agent.md §Workflow Fidelity Rules`.

**Substrate-fidelity gate.** Before appending any wireframe entry via `append_wireframe_data`, confirm `references/wireframing/substrate-fidelity.md` is loaded into authoring context (the top-of-file `Read:` directive ensures this on entry; verify before composing each section). The §Pre-save checklist (12 questions covering anti-invention, anti-pattern-skip, compression discipline, chrome walk, typography capture, empty visual slots, and leaf-occurrence count) is the gate — fail any one, re-walk the failing dimension before saving. Applies on every wireframe-authoring path: the subagent dispatch declared by the `<invoke-workflow>` blocks below AND any inline shortcut taken for token reasons. The fidelity rules bind on both paths.

**For scope = `homepage`:** stop here. Step 5.2 site-plan pass uses the homepage entry only. (No per-page Gate fires — substrate already validated at Step 1.3.)

**For scope = `full-site` or `custom` (per-page iteration entry):**

**Gate:**
- Step 4 scope choice landed at `full-site` or `custom`.
- For each page about to be fetched: first network call against the page URL is Phantom-Browser via `/api/layout-map` (cli/claude-api) OR WebFetch (web-class platforms per `phantom-browser.md §Per-Platform Retrieval`). Retry-on-sparse per `phantom-browser.md §Sparse-result retry`. Fallback only after documented Phantom failure + user approval.
- Each new URL is a fresh decision — do not cache a previous URL's fallback path.
- If any unmet → STOP for explicit user approval before any fallback fires; never silent fallback.

Follow §Gate Rules from agent.md
Follow §Workflow Fidelity Rules from agent.md

**For scope = `full-site`:** fetch `{base_url}/sitemap.xml` to ground IA evidence + drive template inventory. For each unique template found in the sitemap:

<invoke-workflow source="references/workflow-reverse-wireframing.md" required-sections="§Page fetching priority, §Section identification, §Coverage validation">
Execute the source workflow's documented procedure literally — dispatch its Mode C subagent, walk the parent-child section tree, run the deterministic coverage-validation helper, and emit a wireframe entry that carries the schema-required reverse-mode provenance fields. Do not improvise a parallel pipeline or inline-author the wireframe in this turn.
</invoke-workflow>

Append each returned wireframe entry to `{slug}_audit.html` via `append_wireframe_data`. Persist substrate JSON per Step 1.2 platform-fork rules (cli/claude-api → `current-website/audit-feed/layouts/{template-slug}-N.json`; web-class → in-memory only).

**For scope = `custom`:** for each user-accepted page from Step 4's priority list:

<invoke-workflow source="references/workflow-reverse-wireframing.md" required-sections="§Page fetching priority, §Section identification, §Coverage validation">
Execute the source workflow's documented procedure literally — dispatch its Mode C subagent, walk the parent-child section tree, run the deterministic coverage-validation helper, and emit a wireframe entry that carries the schema-required reverse-mode provenance fields. Do not improvise a parallel pipeline or inline-author the wireframe in this turn.
</invoke-workflow>

Append each returned wireframe entry to `{slug}_audit.html` via `append_wireframe_data`. Existing entries + finding decision-pill states are preserved (idempotent on duplicate `slug`).

##### Step 5.2: Site plan pass

Follow §Plain language is the default from agent.md

Read: the strategy grounding (sitemap.xml + matched archetype's domain knowledge in standalone audit; `current-website/project_plan.html#strategy-data` when populated upstream by Discovery in a redesign chain), the internal model from Step 2, the `wireframes[]` entries appended at Step 5.1, and the loaded reference slots.

`{slug}_audit.html` is the single deliverable: wireframe substrate (`wireframes[]`), site-plan findings (`strategy[]`), anatomy findings (`wireframe[]`), and post-audit intent questions (`questions[]`) all live in the one embedded JSON data block. No parallel artifact is written.

**Strategy-grounding annotation (parallel to flow, not gating).** At finding-generation time, check if `current-website/project_plan.html#strategy-data` exists and is populated:
- If yes (Discovery ran upstream and confirmed strategy) → confidence default 🟢 for site-plan strategy findings (anatomy findings unaffected — they tag confidence per element evidence, not strategy presence).
- If no (standalone audit, no upstream Discovery) → confidence default 🟡 (the inferred-strategy mode rule from `references/audit/audit-assessment.md`, generalized — fires on `project_plan.html#strategy-data` presence, no longer audit-mode-gated).

Strategy disagreement (audit's evaluative read diverges from Discovery's strategic read) becomes an audit finding tagged `archetype` — not a pre-finding pause.

**Steps:**
1. Read the site plan and the loaded reference slots. Run the archetype/IA criteria from the domain knowledge in evaluation mode against the site.
2. Generate site-plan findings. Each finding is tagged `archetype` or `ia` (both tags live on the same site plan deliverable; the tag appears in the legend entry, not as a separate pass). Score each finding on both axes per `@references/audit/audit-assessment.md` — §Confidence Axis + §Impact Axis (axes are independent per §Axis independence).
3. (Reserved — `status: flag` entries in the post-audit `questions` block, when introduced by the user during delivery review (Step 6), are converted to findings on the next agent re-render. The flag-to-finding conversion still uses confidence 🟡 (user-flagged, not agent-inferred) with an impact tier derived from the gap's centrality. This sub-step does not pre-generate any flag entries — the questions block is empty until Step 6.)
4. Splice each site-plan finding into `{slug}_audit.html`'s `strategy[]` array via `append_finding(audit_html_path, finding, 'strategy')`. The helper is idempotent on duplicate `id`. Each entry conforms to the `audit-schema.md §JSON Data Block Shape` finding shape (required fields: `id`, `n`, `tag`, `title`, `observation`, `standard`, `effect`, `confidence`, `impact`, `decision_status`).

##### Step 5.3: Anatomy pass

Follow §Plain language is the default from agent.md

5. **Run page-anatomy evaluation per wireframe entry.** For each entry in `{slug}_audit.html`'s `wireframes[]` array, walk its `sections[].elements[].children[]...` tree and run the page-anatomy criteria from the loaded domain knowledge. Element identification uses `id` when present; the wireframing schema treats `id` as optional per element (every element could in principle be subject to audit, so RW does not preemptively add `id` to all elements — that would bloat the JSON unnecessarily). When the audit needs to anchor a finding to a specific element or section, the `id` is added at audit time per §Lazy id assignment below. Nesting: when generating an anatomy finding, consult the `strategy[]` findings persisted earlier in this step — a wireframe finding may reference a site-plan conclusion explicitly (e.g. "given the archetype mismatch flagged in site-plan finding #3, this hero's single-CTA pattern misses the dual-path expectation for the proposed pattern").

6. **Generate anatomy findings.** Each finding is tagged `anatomy`. Each carries confidence + impact per `@references/audit/audit-assessment.md` (same independence rule as the site-plan pass). Findings are numbered with a single counter across the **whole file** (not per page).

   **One-finding-per-element discipline.** The rule is one finding per element — each rendered element carries at most one entry in `wireframe[]`. **When multiple concerns apply to the same element, bundle them in the single finding's body — never produce parallel `wireframe[]` entries on the same `attached_to`.** The `observation`, `standard`, and `effect` fields each may cover multiple concerns about that element; the finding stays one row in the left-panel list with one badge on the rendered element. (Source: `audit-schema.md §One-finding-per-element discipline`. Lint enforcement: `check-html` warns on duplicate `attached_to` within `wireframe[]`.)

   **Scope routing** — set `attached_to` per `audit-schema.md §Finding entry shape`:
   - **Element-scope:** `attached_to` set to the element's `id` (anchors the badge to the rendered element).
   - **Page-scope:** `attached_to` omitted; entry's `page` field carries the page slug (anchors the badge at page level).

   **Lazy id assignment (audit-time augmentation).** Wireframe entries from RW typically have no `id` fields per the rationale in sub-step 5 above. When authoring an anatomy finding with element-scope or section-scope routing, augment the wireframe entry first:

   1. Locate the target element in the wireframe entry's `sections[].elements[].children[]...` tree.
   2. If the element has no `id`, write one in the slug pattern `{section-type}-{element-kind}-{n}` (e.g. `hero-cta-1`, `pricing-card-2`, `faq-accordion-1`). Uniqueness scope: page (`wireframes[].slug`).
   3. Set the finding's `attached_to` to the assigned `id`.

   For section-scope findings, anchor the `id` on a representative leaf in the section (typically the section's first heading, eyebrow-label, or primary CTA). For element-scope findings, anchor the `id` on the specific element the finding addresses. Page-scope findings (those that cannot be tied to a single section or element — e.g. cross-page narrative-arc observations) skip this rule and leave `attached_to` omitted.

   The augmented wireframe entry is written back to `{slug}_audit.html`'s `wireframes[]` via `append_wireframe_data` (idempotent on duplicate `slug` — re-runs do not duplicate `id` additions; an element that already has an `id` keeps the existing value). Saver discipline applies — the lazy-id rewrite goes through the canonical helper, never via direct file edits. See `agent.md §Workflow Fidelity Rules`. Substrate-fidelity binding from Step 5.1 carries over: anatomy findings cite wireframe elements, and any augmented entry written back through `append_wireframe_data` must still pass the §Pre-save checklist in `references/wireframing/substrate-fidelity.md` — including leaf-occurrence count when the augmentation adds or relocates entity references.

7. **Append each anatomy finding to `{slug}_audit.html`'s `wireframe[]` array** via `append_finding(audit_html_path, finding, 'wireframe')`. The helper is idempotent on duplicate `id`. Each entry conforms to `audit-schema.md §JSON Data Block Shape` (required fields: `id`, `n`, `tag`, `title`, `page`, `observation`, `standard`, `effect`, `confidence`, `impact`, `decision_status`; `attached_to` optional per scope routing above).

##### Step 5.4: Post-save fidelity verification

**Gate:**
- `{slug}_audit.html` exists with `wireframes[]` and findings populated (per Step 5.1 + 5.2 + 5.3)
- Substrate directory `projects/{client}/current-website/audit-feed/layouts/` exists on disk (cli/claude-api platforms). On web-class platforms (claude-web / chatgpt-web / gemini-gem) substrate is held in memory only — the check is skipped with a visible note.

Follow §Gate Rules from agent.md
Follow §Workflow Fidelity Rules from agent.md

**Action:**

<require load-and-follow="references/scripts/ux_utils.py">
Run `python references/scripts/ux_utils.py coverage-check-post-save projects/{client}/{slug}_audit.html` against the just-written deliverable. The script reads the wireframes[] block, locates each entry's substrate at `current-website/audit-feed/layouts/{slug}-1.json`, runs per-section coverage analysis with default thresholds (paragraph_ratio=0.6, figure_ratio=0.5, h4_floor=5, text_density_floor=0.5), and prints a structured report.

If the report shows any failing entry: surface the per-entry summary in the Step 5 STOP, name the failing slugs and their failing sections, recommend re-running the affected Step 5.1 entries before proceeding. Do not silently proceed.

If the report shows all pass: surface one line in the Step 5 STOP — "Substrate coverage verified clean."

If the gate skips (no on-disk substrate, web platform): surface one line in the Step 5 STOP — "Post-save coverage check skipped — substrate not on disk."

The post-save check is independent of how the wireframes were authored — it reads the deliverable from disk and compares to substrate from disk, catching authorship-style bypasses (custom build scripts, heredoc inspection, forward-mode shape-shifting, `skip_gate=True`) that evade the write-time coverage gate.
</require>

##### Single STOP — full audit ready

8. *(STOP checkpoint — Saved-file announcement + Verify.)* Announce the deliverable path (`projects/{client}/{slug}_audit.html`) per `agent.md §Saved-file reporting` and forward the user to the file: site-plan findings + anatomy findings (homepage + iterated pages if any) all render in the left panel, accept/revise via decision pills inside the deliverable. **No chat-side findings list and no chat-side accept/revise menu** — the file is the workspace. After the saved-file announcement, add a one-line caveat: *"Note: mapping the current website is still an experimental feature — review the wireframes inside the deliverable for fidelity before working with the findings."* Wait for the user to respond before advancing to Step 6 (post-audit intent questions).

**Finding schema:** Each finding — site-plan or anatomy — follows `@references/audit/audit-schema.md §Finding Schema Contract`.

**Read before authoring findings:** `@references/audit/audit-schema.md` §Finding Schema Contract — canonical four-field shape (`observation` / `standard` / `effect` / `exception`). Optional substrate-citation forms in §"Substrate-backed evidence" when running with `current-website/audit-feed/`.

**Self-check before STOP** — for each finding (site-plan + anatomy), validate against schema canon: (1) `observation`, `standard`, `effect` all populated (required); (2) `exception` populated where applicable (optional); (3) no schema deviations — extra fields present in the JSON payload (`id`, `title`, `category`, `confidence`, `impact`, `decision_status`, `attached_to`, `domain_ref`) are metadata per the example, not a substitute for any of the four required fields. If any required field is empty or vague, fix before presenting STOP.

**Language:** Finding titles and body copy follow `agent.md §Communication Rules` and §Internal identifiers — plain language is binding on every field; never name archetype/pattern names or domain classifications in any rendered field.

**Output:** `projects/{client}/{slug}_audit.html` with `strategy[]` (site-plan findings) + `wireframe[]` (anatomy findings, all pages covered) populated. `wireframes[]` entries may be augmented with `id` fields per the §Lazy id assignment rule above (idempotent — re-runs preserve existing ids). Follow §Saved-file reporting from agent.md.

**User interaction:** Follow §Challenge user hypotheses from agent.md.

**Error paths:**
- A `wireframes[]` entry has changed structure since the previous audit run → re-run the entire annotation pass; partial reuse of finding numbering is not supported (each run is self-contained).
- `wireframes[]` is empty (Step 5.1 didn't run or substrate fetch failed) → re-run from Step 1; do not author findings against an empty substrate.

---

#### Step 6: Package deliverable + post-audit intent questions

**Gate:**
- Annotation passes complete (per scope: homepage findings only / full-site / custom-scope per Step 4 user choice)
- All findings confirmed at Step 5 STOP
- `{slug}_audit.html` exists and ready (populated `wireframes[]` + `strategy[]` + `wireframe[]`)
- If any unmet → return to Step 5; do not write post-audit intent questions or package the deliverable.

Follow §Gate Rules from agent.md

**Steps:**

Follow §Plain language is the default from agent.md

1. **Write post-audit strategic intent questions into the `questions` data block** when standalone audit (no upstream Discovery strategy data). Generate 2–6 strategic intent questions covering the assumptions the agent made when grounding site-plan findings:
   - **Strategic intent** — was the observed pattern intentional or did the site drift? (e.g., "Is the catalog-grid product structure intentional or legacy?")
   - **Audience tier alignment** — does pricing / messaging / proof points match the actual ICP? (e.g., "Are these case studies representative of your highest-intent buyers?")
   - **Business / legacy constraints** — what shaped the observed decisions? (e.g., "Are there legacy CMS or technical constraints behind the current navigation depth?")

   Each question maps to one or more 🟡 findings whose confidence upgrade depends on the answer. Write entries into the existing `questions` array (schema unchanged — `n`, `title`, `why_critical`, `status`, `response`, `flagged_at`):

   ```json
   { "n": 1, "title": "Is the catalog-grid product structure intentional or legacy?", "why_critical": "Determines whether finding #1 is a critique or an alignment", "status": "pending", "response": null }
   ```

   Append each entry to `{slug}_audit.html`'s `questions[]` array via `append_finding(audit_html_path, question, 'questions')`. The helper is idempotent on duplicate `id`.

   When upstream Discovery already populated `current-website/project_plan.html#strategy-data` (in-redesign chain), the `questions` block stays empty — strategic intent is grounded; no post-audit questions are written.

2. **Final consistency pass across all audit artifacts:**
   - Numbering is continuous within each category (site-plan findings start at 1 and increment; wireframe findings have their own independent counter starting at 1)
   - Every finding in the HTML data block has both `confidence` and `impact` fields populated
   - All site-plan and wireframe findings are present in the embedded JSON data block inside `{slug}_audit.html` — the data block is the single source of truth

3. **Confirm the bottom bar carries two export affordances inside `{slug}_audit.html`:**
   - **Download HTML** — full interactive deliverable with current decision-pill states baked in
   - **Download MD** — brief of decided findings only (accepted + rejected findings, formatted as a decision table); generated client-side by the shell IIFE from the embedded JSON data block; no server call. This is the default MD delivery path per `references/shared/interactive-deliverable-shell.md § Delivery paths`.

4. **Chain-aware delivery message.** Behavior branches on chain context:

   **Standalone audit chain (no upstream Discovery, no downstream redesign workflow in the Planned Route):**

   The chat message names three things the audit contains: findings, assumption disclosure, and intent questions. Then offer three terminal options to the user in plain language:
   - **Clarify intent** — answer the strategic intent questions; agent re-renders affected findings on the next interaction (🟡 → 🟢 upgrade where the answer grounds the inference; revise / remove if the answer contradicts).
   - **Iterate to next pages** — pick more pages to add to the audit (re-enters Step 4 with a refreshed inventory and recommended subset per `references/shared/scope-selection.md`).
   - **Done** — keep the audit as-is; offer the same downstream paths the legacy workflow surfaced (start a redesign that takes these findings as the brief, or apply fixes and re-run the audit).

   **Within-redesign chain (upstream Discovery ran, downstream Strategy + Wireframing in the Planned Route):**

   No terminal options, no iteration prompt. The audit hands off to Strategy via the orchestrator's standard chain handoff — saved-file announcement only.

5. **Re-render rule (standalone audit only).** When the user answers an intent question (status: `answered` or `guessed`) on a subsequent turn, the agent re-renders findings tagged with that intent area on the next interaction — upgrading 🟡 → 🟢 if the answer grounds the inference, or revising / removing the finding if the answer contradicts. `status: flag` entries on intent questions are converted to standalone findings per the Step 5.2 reserve clause.

6. **Announce paths.** List the deliverable:

```
Saved files:
audit/
  {slug}_audit.html      (interactive shell deliverable — primary output; all findings and intent questions embedded)
```

**Output:** Confirmed saved path + chain-aware delivery message + (standalone audit only) post-audit intent questions block populated.

---

### Error Handling

| Error Condition | Normal | Fast | Teacher |
|:----------------|:-------|:-----|:--------|
| Substrate fetch fails on Step 1.2 (Phantom-Browser unreachable on cli/claude-api after retry-gate, or WebFetch unavailable on web-class) | **Hard fail** — agent reports the blocker and does not downgrade into chat audit. Per the substrate-first invariant, no audit-shaped output may be emitted before substrate is verified or generated. | Same | Same |
| Step 1.3 validation surfaces a mismatch (wrong language, redirect to login, blank shell, scope mismatch) | Surface ONE clarification to the user; wait for the answer; re-validate. Do not silently proceed with mismatched assumptions. | Same | Same |
| Sitemap.xml absent or returns <5 URLs (full-site, recommended, or custom scope) | At Step 4 inventory build, derive candidates from `nodes[]` internal anchor scan per `references/shared/scope-selection.md` § URL discovery. If still <3, ask the user once for a URL list; if they decline, downgrade to homepage-only. | Same | Same |
| No archetype matches the site within the 17 domains | Step 3 site summary names declared gaps; user picks scope at Step 4 anyway; findings carry 🟡 default + general-knowledge framing | Skip to general-knowledge if no 🟢 match | Same as Normal |
| User declines to answer post-audit intent questions | Findings remain at 🟡 medium confidence; audit ships as-is. The user can return later to answer intent questions and trigger the re-render | Default every unanswered question to `guess` silently | Same as Normal |
| Step 5 finds no findings at all for a given tag | Record the absence in the audit deliverable header ("archetype findings: none — site aligns with expected archetype anatomy") and proceed | Same as Normal | Same as Normal |
| In-redesign chain: substrate present but partial (`current-website/wireframes.html` exists but `current-website/project_plan.html` is missing populated `#context-data` / `#strategy-data` blocks) | Re-invoke the missing upstream workflow (Discovery in Post-RW Mode) before proceeding. Do not silently downgrade scope unless the user explicitly approves. | Same | Same |
| `current-website/audit-feed/` substrate (layouts JSON / scrapes MD) missing but wireframes present | Proceed; note substrate unavailable in the audit deliverable (confidence may shift down for spatial / content-exact claims) | Same | Same |

### Success Criteria

- URL is the only required input; no upfront brief or analytics are gated on
- Step 1 acquires substrate via the platform fork (cli/claude-api → Phantom + retry-gate; web-class → WebFetch + V_min) and validates BEFORE the deliverable shell is committed (substrate-first invariant per FIN-008)
- Substrate persistence on cli/claude-api: Phantom JSON written to `current-website/audit-feed/layouts/{slug}-{N}.json` for ALL audit scopes (homepage / full-site / custom). Web-class platforms hold substrate in agent memory only.
- Steps 1-3 are shared with `references/workflow-reverse-wireframing.md` (same architecture, same code paths) — RW + Audit diverge at Step 4 user-facing scope STOP
- Step 4 scope STOP is the user's first explicit decision point in the audit flow — two user-facing options (Recommended *(editable)* / Full) backed by three internal scope values (`homepage` / `full-site` / `custom`). The recommended subset is always context-aware best-fit per `references/shared/scope-selection.md` (implicit audit purpose = "find improvement opportunities" — no plain core-dump fallback). Aim for 3–5 templates with per-template reasoning, rendered inline at the STOP. Editing the Recommended subset is how custom scopes are expressed; if the user edits down to `[home]`, scope collapses to internal `homepage` for Step 5.1 dispatch.
- Substrate-first invariant: no audit findings, recommendations, critique, or HTML artifact may be emitted before substrate is verified at Step 1.3 and Step 5.0 clone runs after Step 4 scope choice. Tooling failure is fail-closed; agent reports a blocker and does not downgrade to chat audit.
- Step 3 presents the site informationally — no descriptive coverage statement, no 3-option STOP. The previous descriptive-coverage STOP shape is eliminated; its job is split between Step 3 (informational summary) and Step 4 (user-facing scope STOP).
- Strategic intent questions are post-audit (Step 6) — surfaced in the `questions` data block at delivery (standalone audit only; in-redesign chain skips this because Discovery already grounded strategy upstream)
- Every post-audit intent question supports tri-state response mode (answered / guessed / flagged); user-answered or user-guessed responses drive 🟡 → 🟢 confidence upgrades on subsequent re-render; `status: flag` entries on intent questions become standalone findings.
- Exactly two annotation passes run — one over the site plan (Step 5.2), one over the wireframes (Step 5.3). No separate passes per L0/L1/L3; those are legend tags, not workflow steps.
- Each annotation pass uses the shared + archetype-specific reference slots loaded at Step 2.2
- Confidence and impact remain independent axes per `@references/audit/audit-assessment.md §Axis independence`. Strategy-grounding annotation (`current-website/project_plan.html#strategy-data` presence) determines the strategy-finding confidence default — annotation only, not flow gating.
- Interactive HTML deliverable uses the Shell — Audit variant (see `references/shared/interactive-deliverable-shell.md`); shell self-bootstraps from the embedded `audit-findings-data` block; client-facing JS is permitted inside the shell (panel toggling, filter chips, MD export, decision pills)
- Every finding uses the four-field English schema (`observation` / `standard` / `effect` / `exception`) — no Polish field names in the source; UI labels are rendered at output time
- The interactive HTML (`{slug}_audit.html`) is the primary user-facing deliverable; MD download is available from the bottom bar (brief of decided findings, generated client-side)
- Wireframe entries are appended to `{slug}_audit.html`'s `wireframes[]` JSON array via `references/scripts/ux_utils.py::append_wireframe_data` — no separate `audit/wireframes.html` is written.
- The workflow has 6 process steps and 2 STOP checkpoints (Step 4 scope STOP, Step 5 single STOP).
- Each audit run is incremental — re-runs preserve existing decision-pill states; only new content is added.

### Example

**Input:**
```
Audit example-industrial.com — I want to know if the site actually fits the product line.
```

**Process (Normal mode — standalone audit, custom scope):**
- **Step 1** → Step 1.1 finds no upstream substrate. Step 1.2 fetches via Phantom-Browser (cli platform); response carries 234 nodes. Substrate JSON persisted to `current-website/audit-feed/layouts/example-industrial-1.json`. Step 1.3 validates: final URL matches target ✓; nodeCount > threshold ✓; inferred language = en (matches user-stated) ✓; `<h1>` text "Industrial valve solutions" matches scope ✓. Validation passes.
- **Step 2** → Classify: B2B Industrial archetype, Catalog-First pattern, 🟡 medium confidence (homepage shows product grid but no configurator entry). Load shared + b2b-industrial reference slots. Internal model formed.
- **Step 3** → Plain-language summary rendered: "B2B industrial site selling configurable products. Catalog-first homepage layout with grid of variants. No configurator entry from the homepage. 🟡 confidence — could be a hybrid Catalog/Configurator-Led; intent unclear."
- **Step 4** *(STOP)* → Agent builds inventory + recommended subset per `references/shared/scope-selection.md`. User stated purpose ("does the site fit the product line?") so context-aware best-fit applies. Renders inline: "**Recommended** *(default)* — home (conversion entry, already covered), product detail (product/valve-300, archetype mismatch likely surfaces here), category (products/, IA evidence), contact (RFQ form expected for Configurator-Led)." Trade-off line surfaced. User picks "Recommended" — accepts the four-page list as-is.
- **Step 5** *(STOP)* → 5.0 clone audit shell. 5.1 fetch the 4 pages via RW per Page fetching priority; append each wireframe entry. 5.2 site-plan pass (🟡 default — no upstream strategy data):
  - #1 `archetype` 🟡 high — "Catalog-First archetype but homepage hero implies configurable products — possible archetype mismatch."
  - #2 `ia` 🟡 high — "No visible RFQ conversion path in sitemap; expected for Configurator-Led B2B Industrial."
  5.3 anatomy pass:
  - #1 `anatomy` 🟢 medium — "Home hero missing dual-CTA — expected for Configurator-Led."
  - #2 `anatomy` 🟡 high — "Product page has spec table but no configurator entry point."
  Agent produces `{slug}_audit.html` with all findings embedded. User accepts.
- **Step 6** → Final consistency check. Post-audit intent questions written (standalone audit). Announce paths. Offer: "Take this as the final read of the site, kick off a redesign that uses these findings as the brief, or apply fixes to the current site and have me re-check it."

**Final Output:**
```
audit/
  {slug}_audit.html      (shell-based interactive deliverable — primary output; all findings and flagged questions embedded)
current-website/audit-feed/layouts/
  example-industrial-1.json   (homepage substrate)
  product-valve-300-1.json    (product detail substrate)
  products-1.json             (category substrate)
  contact-1.json              (contact substrate)
```
_(2 site-plan findings — 1 archetype, 1 ia; 2 wireframe findings — both anatomy; all embedded in `{slug}_audit.html` data block)_
