---
type: agent-ops
purpose: "Reverse Wireframing workflow steps, gates, and checkpoint definitions"
---
Follow §Communication Rules from agent.md
Follow §How I Operate from agent.md

## Reverse Wireframing

### Purpose
Turn an existing website into lo-fi HTML wireframes — one per unique page template. Produces a structural snapshot of the current site as a starting point for redesign or iterative improvement.

### When to Use
- User has an existing website and wants to map its current structure before redesign
- User needs lo-fi wireframes of the current site as input to Discovery or Strategy
- User wants to know what page templates exist on a live site

### Prerequisites
- URL of the target site **or** user-supplied file (HTML, sitemap, screenshots, any format)
- `projects/{client}/` folder — assumed to exist (created by orchestrator pre-routing check)

### Architecture (RW + Audit shared front-end)

Reverse Wireframing and Domain Audit share **Steps 1-3** (substrate acquisition → site-type inference → present-site) and **Step 4 — user-facing scope STOP** via `references/shared/scope-selection.md` (URL discovery, grouping, priority, inventory, scope STOP, recommendation logic). The two workflows diverge only on what they do with the chosen scope: RW carries it into a build queue (Step 4b screenshots if Mode A; Step 5 wireframe build; Step 6 review; Step 7 save); Audit carries it into a per-page substrate fetch list (Step 5.1) followed by site-plan + anatomy passes. Substrate-source is operational dispatch internalized inside Step 1 — invisible to the user.

### Tool

**Phantom-Browser API (primary — cli / claude-api):**

Remote serverless headless browser. The `/api/layout-map` endpoint returns a flat JSON array of DOM nodes with bounding boxes, verbatim text, and display metadata. The Mode C subagent consumes this output and performs all kind mapping and section composition. No setup required.

Read: references/phantom-browser.md — response schema, per-platform retrieval, responsibility split.

Endpoint: `GET https://phantom-browser-virid.vercel.app/api/layout-map?url={URL}&viewport={desktop|mobile}`

**WebFetch + V_min subagent (primary — claude-web / chatgpt-web / gemini-gem):**

Web-class platforms cannot autonomously call Phantom-Browser (URL-provenance gates on Claude.ai, cybersecurity classifier on ChatGPT, Gemini hallucinated-fetch). On those platforms, the substrate path is WebFetch + a minimal subagent prompt (V_min) producing a mobile-style wireframe at 400px max-width via `<body class="wf-mobile">`. See `references/phantom-browser.md` web-class row body for empirical rationale; see Step 5 Mode C web-platform branch below for the V_min prompt.

**Firecrawl self-hosted (`localhost:3002`)** — CLI fallback when Phantom-Browser is unreachable on cli platform. Setup walked through in Step 1.2 dispatch when Phantom fails.

Endpoints used:
- `POST /v1/map` — URL discovery (returns URL list only, compact)
- `POST /v1/scrape` with `only_main_content=true` + `formats=["markdown"]` — clean page content, boilerplate stripped, LLM-friendly

**Setup (one-time, Mode A only):**
```bash
# Verify running
curl -s http://localhost:3002/health

# If not running — start Docker container
docker compose up -d   # in your Firecrawl folder
```

**File mode:** No tool required — agent parses whatever the user provides.

### Page fetching priority

When fetching any page (URL → wireframe substrate, content, layout), follow this order on every URL:

1. **Phantom-Browser via the platform's documented retrieval mechanic** (cli/claude-api) OR **WebFetch + V_min** (claude-web/chatgpt-web/gemini-gem) — required first attempt for every page. Layout-aware DOM via `/api/layout-map` (cli/claude-api); text-only WebFetch substrate dispatched through V_min subagent (web-class). Re-attempt on every new URL; do not assume a previous URL's outcome.
2. **Retry on sparse result** — if the first attempt returns sparse data (`nodeCount` below threshold, blank markdown, hydration-blocked page), retry once with `waitFor=<selector>` per `phantom-browser.md §Sparse-result retry`. STOP for explicit user approval before any further fallback fires.
3. **Fallback (last resort, cli only)** — Firecrawl on CLI when Phantom-Browser is documented unreachable AND the user has approved the fallback. Never silent. Never the default substrate for wireframe work.

The agent must NOT declare Phantom-Browser unavailable in chat, reasoning, or proposed plans without documenting a probe attempt against `phantom-browser.md` in the same response. Verbal-denial-without-probe is a workflow-fidelity violation.

Each new URL is a fresh decision. Do not cache a previous URL's fallback path.

### Process Flow

```
┌──────────────────────────────────┐
│ URL or file input                │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 1: Substrate acquisition    │
│ • 1.1 Read upstream substrate    │
│ • 1.2 Else fetch (platform fork) │
│ • 1.3 Validate-and-decide        │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 2: Site-type inference      │
│ • Classify against 17 domains    │
│ • Load archetype knowledge       │
│ • Form internal context model    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 3: Present site             │
│ • Plain-language summary         │
│   (informational only)           │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 4: Scope STOP               │
│ • Recommended (default, editable;│
│   context-aware 3–5 templates    │
│   with per-template reasoning,   │
│   sized to the build's purpose)  │
│ • Full                           │
│ • Extraction mode (batch / 1×1)  │
│ *(STOP checkpoint)*              │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐  (Mode A only)
│ Step 4b: Batch screenshots       │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 5: Build wireframes         │
│ • Parallel subagents → JSON      │
│   entries (saved to mapping/     │
│   on IDE/CLI; merged into        │
│   wireframes.html)               │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 6: Wireframe review         │  *(STOP checkpoint)*
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Step 7: Save + confirm           │
└──────────────────────────────────┘
```

### Detailed Steps

#### Step 1: Substrate acquisition

Shared with `references/audit/workflow-audit.md` Step 1. Substrate-source is operational dispatch internalized here — invisible to the user.

##### Step 1.1: Look for upstream substrate

Read `projects/{client}/current-website/`:
- If `current-website/wireframes.html` exists → read it; substrate is on disk. Skip to Step 1.3 with on-disk substrate.
- If `current-website/audit-feed/layouts/{slug}-1.json` exists for the homepage → read it; substrate is on disk. Skip to Step 1.3.
- File-input mode (Mode B) — user provided HTML/sitemap/screenshots directly: substrate is in those files. Skip to Step 1.3 with in-memory substrate from the user-supplied content.
- Otherwise → proceed to Step 1.2 fetch.

##### Step 1.2: Fetch substrate

**Gate:**
- User has provided a URL (or files for Mode B)
- `projects/{client}/` folder exists
- No upstream substrate found at Step 1.1
- First network call against the target URL is Phantom-Browser via `/api/layout-map` (cli/claude-api) OR WebFetch (web-class platforms per `phantom-browser.md §Per-Platform Retrieval`). Retry-on-sparse per `phantom-browser.md §Sparse-result retry`. Fallback only after documented Phantom failure + user approval.
- If any unmet → ask the user for the missing input or retry the documented protocol; do not proceed with an alternate fetcher.

Follow §Gate Rules from agent.md

Read: `references/phantom-browser.md` — Per-Platform Retrieval row body for the active platform. V_min subagent prompt body in Step 5 Mode C web-platform branch (this file) for web-class platforms.

**Web-class platform notice (FIN-013).** When `platform ∈ {claude-web, chatgpt-web, gemini-gem}`, BEFORE acquiring the substrate, surface a short notice to the user covering:

- they are on a web platform that has limited capability for this workflow
- the wireframe can only be built as a mobile-style preview (single column, around 400px wide)
- desktop fidelity is available by switching to the IDE version (Claude Code, Codex, Antigravity)
- ask whether to proceed with the mobile wireframe or stop

Follow §Communication Rules and §Plain language is the default from agent.md. Do not name internal tools or implementation details (no Phantom-Browser, WebFetch, layout-map, sandbox, fetch, etc.).

Wait for user confirmation. On approval → proceed with the platform-fork below. On decline → STOP and recommend the IDE version. On `cli` / `claude-api`, skip this notice — desktop rendering is the default path with no platform limitation to disclose.

**Platform fork (per FIN-013):**

- **cli / claude-api:** call Phantom-Browser via `/api/layout-map` against the target URL. Retry-gate per `phantom-browser.md §Sparse-result retry` (1 retry with `waitFor=<selector>` on sparse result). Persist response JSON to `projects/{client}/current-website/audit-feed/layouts/{slug}-1.json`. Folder init: `mkdir -p projects/{client}/current-website/audit-feed/{layouts,mapping}`.
- **claude-web / chatgpt-web / gemini-gem:** dispatch the V_min subagent prompt (canonical body in Step 5 Mode C web-platform branch below) over a WebFetch substrate. Substrate lives in agent memory; no filesystem write (web platforms have no persistent disk).

**Mode A (Firecrawl) fallback** — only fires on cli platform when Phantom-Browser is documented unreachable AND user has approved the fallback. Setup sequence:

1. **Health check** — is Firecrawl already running?
   ```bash
   curl -s http://localhost:3002/health
   ```
   - Returns 200 / `{"status":"ok"}` → proceed with Mode A scrape.
   - Connection refused / timeout → continue to step 2.

2. **Is Firecrawl installed?** Check for `~/firecrawl`:
   ```bash
   ls ~/firecrawl/docker-compose.yml 2>/dev/null && echo "EXISTS" || echo "MISSING"
   ```
   - `EXISTS` → installed but not running → jump to step 4 (start container).
   - `MISSING` → Firecrawl not installed → continue to step 3.

3. **Is Docker installed?**
   ```bash
   docker --version 2>/dev/null && echo "OK" || echo "MISSING"
   ```
   - `OK` → clone and configure Firecrawl:
     ```bash
     git clone https://github.com/mendableai/firecrawl ~/firecrawl
     cd ~/firecrawl
     cp .env.example .env
     sed -i 's/USE_DB_AUTHENTICATION=.*/USE_DB_AUTHENTICATION=false/' ~/firecrawl/.env
     ```
     Verify: `grep USE_DB_AUTHENTICATION ~/firecrawl/.env`
   - `MISSING` → guide user through Docker install per platform (Windows: Docker Desktop; macOS: `brew install --cask docker`; Linux: `sudo apt-get install docker.io docker-compose`). After install, re-run `docker --version`, then continue to clone+configure above.

4. **Start container:**
   ```bash
   cd ~/firecrawl && docker compose up -d
   ```
   Health check loop (max 20 attempts, 15s apart = ~5 min):
   ```bash
   for i in $(seq 1 20); do
     STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
     if [ "$STATUS" = "200" ]; then echo "Firecrawl ready."; break; fi
     echo "Waiting... ($i/20)"
     sleep 15
   done
   ```
   Loop exhausts → "The page-scraping service isn't responding after 5 minutes. Check the container logs (`docker compose logs` in `~/firecrawl`) and come back when the service is running."

5. **Playwright check** (CLI Mode A only — for screenshot-based mode):

   Read `projects/{client}/config.md` for `playwright_path:` entry.

   - Found → use that path.
   - Not found → ask user:
     ```
     A screenshot tool isn't set up yet — screenshots are needed for full visual analysis.
     Where do you want to install it?
     A) Globally (~/playwright-tools/) — available for all projects
     B) In the agent folder (references/scripts/) — versioned with the agent
     ```
     - **A** → verify/create `~/playwright-tools/` with `npm install playwright` + `npx playwright install chromium`. Save `playwright_path: ~/playwright-tools` to `projects/{client}/config.md`.
     - **B** → verify `references/scripts/node_modules/playwright` exists; if not, `cd references/scripts && npm init -y && npm install playwright && npx playwright install chromium`. Save `playwright_path: references/scripts` to `projects/{client}/config.md`.

   Folder init for Mode A with screenshots:
   ```bash
   mkdir -p projects/{client}/current-website/audit-feed/{screenshots,scrapes,mapping}
   ```

**Substrate-first invariant.** The fetch happens BEFORE the deliverable shell is cloned (Step 5 clones `wireframes.html`). Step 1.3 validates the response before any file is materialized. **No wireframe artifact may be emitted until Step 1.3 validation passes and Step 5 dispatch runs.**

##### Step 1.3: Validate-and-decide

**Gate:**
- A substrate response exists (in memory or on disk)
- If absent → return to Step 1.2 and re-fetch via the documented protocol

Follow §Gate Rules from agent.md

Read the response BEFORE any deliverable shell is committed. Validate four signals:
1. **Final URL after redirects** matches user-stated target (no silent redirect to login wall, paywall, unrelated page).
2. **`nodeCount > threshold`** (substantive content; not 404 / blank shell / JS-only render that blocked Phantom).
3. **Inferred language** from copy sample — if differs from user-stated `project_language`, surface ONE clarification before proceeding.
4. **`<h1>` text** plausibly matches the workflow scope.

On any mismatch → surface ONE clarification; wait for the answer; re-validate. On all-pass → proceed silently to Step 2.

**Output:** validated substrate (in memory + persisted JSON on cli/claude-api). Step 2 receives the substrate.

---

#### Step 2: Site-type inference

**Gate:**
- Step 1.3 validation passed
- Substrate available (in memory or on disk per Step 1.2 platform fork)
- If unmet → return to Step 1

Follow §Gate Rules from agent.md

Form an internal context model. This step writes nothing to chat and produces no file output — the model lives in agent memory and feeds Steps 3, 4, 5.

##### Step 2.1: Sample + classify

For multi-page builds (Step 4 will produce a Recommended subset of multiple templates, or Full), sample homepage + nav + 1-2 representative pages from substrate. For single-URL builds (the Recommended subset will collapse to `[home]` for genuinely thin sites), classify off the homepage substrate alone.

Classify the site into one of 17 domains (or `generalist` fallback):
- `b2b`, `b2b-industrial`, `b2b-saas`, `b2b-services`
- `community`, `course`, `data-content`, `documentation-kb`
- `ecommerce`, `enterprise-tools`, `event`, `government-institutional`
- `local-business`, `marketplace`, `media`, `nonprofit`, `portfolio`, `service-utility`
- `generalist` — fallback only when no domain matches with confidence

Classification signals: industry vocabulary in copy, conversion path patterns in nav and CTAs, content type (catalog, case studies, articles, course modules, product specs), audience signals in tone, business-model markers (RFQ vs add-to-cart vs subscribe vs apply vs join). Confidence tier: 🟢 high / 🟡 medium / 🔴 low. If 🔴 or no clear match, fall back to `generalist`.

##### Step 2.1a: Scope check (UX Audit Skill — runs after classification, before load)

- **In-scope domains** — all 17 specialized domains (the full taxonomy enumerated in Step 2.1). Any of `b2b`, `b2b-industrial`, `b2b-saas`, `b2b-services`, `community`, `course`, `data-content`, `documentation-kb`, `ecommerce`, `enterprise-tools`, `event`, `government-institutional`, `local-business`, `marketplace`, `media`, `nonprofit`, `portfolio`, `service-utility` at any confidence tier 🟢 / 🟡 / 🔴 proceeds to Step 2.2. Hybrid loading (e.g., `portfolio` + `b2b-services` for designer-agency sites, `course` + `ecommerce` for creator-product sites) follows the main agent's multi-domain hybrid convention at Step 2.2 — no per-pair declaration needed here.
- **Out-of-scope — generalist fallback only.** If classification produces `generalist` (no confident match in the 17-domain taxonomy), emit a refusal message per `agent.md §Override: Final Instructions` item 7 (Generalist refusal) and abort Reverse Wireframing with a non-zero failure signal. Do not proceed to Step 2.2. This is the only domain-level abort condition — every confident classification in the 17-domain set passes the scope check.

**Abort propagation.**
- When Reverse Wireframing was invoked as a sub-step of the audit workflow (audit Step 1), the abort propagates upward as a hard failure. The audit hard-fails with no fallback path; the user-visible result is the refusal message, nothing further.
- When Reverse Wireframing was invoked standalone (deprecated entry path — no longer surfaced in `ux-audit-skill`; retained here for upstream compatibility), the abort terminates the workflow with the refusal message visible to the user. No further work, no template inventory, no wireframes.
- Both paths produce identical user-facing behavior: refusal message + no further work.

**Confidence tier handling.** In-scope domains pass at 🟢, 🟡, AND 🔴. A low-confidence classification is information for the user (surfaced later in the audit's own coverage statement) — it is never a refusal trigger on its own. The `generalist` fallback is the only confidence-related abort condition in this scope check.

##### Step 2.2: Load matched archetype's domain knowledge

```
Read: references/domains/{domain}/{domain}-archetypes.md
Read: references/domains/{domain}/{domain}-audience.md
Read: references/domains/{domain}/{domain}-patterns.md
Read: references/domains/{domain}/{domain}-components.md
Read: references/domains/{domain}/{domain}-discovery.md
```

For B2B sub-domains (`b2b-saas`, `b2b-services`, `b2b-industrial`), also load the shared `references/domains/b2b/` base if available in the bundle. For sites that match more than one in-scope domain (hybrid behaviour per the main agent's convention), load all matched knowledge sets.

##### Step 2.3: Form internal context model

From the loaded knowledge plus the sampled pages:
- What the company does (industry, sub-vertical, scale signals)
- Who the audience is (role, seniority, decision-context, buying mode)
- Likely archetype hints (which patterns from the loaded archetypes match the observed pages)
- **Core template union** — across the matched archetype(s), which templates are considered core vs extended for this domain. The core union becomes input to Step 4 STOP scope decision.

**Output:** Either (a) a confirmed in-scope domain with loaded domain knowledge + internal context model (matched archetype + confidence + declared gaps + core template union) — Step 2 continues to Step 3 — or (b) a refusal message emitted to the user per `agent.md §Override: Final Instructions` item 7 (Generalist refusal) and a non-zero abort signal returned to the caller.

#### Step 3: Present site

**Gate:** Step 2 internal model formed.

Follow §Gate Rules from agent.md

Follow §Communication Rules from agent.md
Follow §Internal identifiers from agent.md
Follow §Challenge user hypotheses from agent.md

Compose plain-language site summary from the internal model — what the site is, audience signal, archetype match + confidence tier (🟢/🟡/🔴), declared gaps. Render in chat. Purely informational; frames the next decision (Step 4 scope STOP).

**No descriptive coverage statement, no 3-option agree/general/stop choice** — the previous Step 2b STOP shape (descriptive understanding gate) is eliminated. Its job is split between this Step 3 informational summary and Step 4's user-facing scope STOP.

**Output:** Plain-language site summary rendered in chat.

---

#### Step 4: Scope STOP  *(STOP checkpoint)*

**Gate:**
- Step 3 site summary rendered.
- User has read the summary and is ready to pick a scope.

Follow §Gate Rules from agent.md

Follow §Communication Rules from agent.md
Follow §Workflow Fidelity Rules from agent.md

Read: `references/shared/scope-selection.md` — URL discovery, template grouping, priority assignment, inventory shape, render shape, scope STOP base, and the unified recommendation logic (always context-aware best-fit; implicit RW purpose = "produce baseline coverage of the site's templates for downstream redesign or strategy").

For URL input mode, the agent runs the shared procedure: URL discovery → template grouping → priority assignment → build the in-memory inventory dict → build the recommended subset per the shared recommendation logic (3–5 templates by default, sized to RW's purpose plus any explicit user goals or upstream context) → render the inventory + two-option scope STOP (Recommended *(default, editable)* / Full).

For File input mode (user-supplied HTML/screenshots), template inventory is what the user supplied. URL discovery is skipped; the shared inventory shape, recommendation logic, and STOP shape still apply.

##### Extraction-mode choice (RW-specific addition to the STOP)

Alongside the scope option, RW asks for an extraction-mode choice (audit does not — audit has no extraction mode):

- **batch** (default on cli) — parallel subagents, one per template. Auto-parallel is an execution detail.
- **one-by-one** (default on web platforms — claude-web/chatgpt-web/gemini-gem) — sequential processing in the main thread. Web platforms cannot reliably dispatch parallel subagents.

User can override the platform default if they prefer the other extraction mode.

Apply user changes (additions, removals, URL replacements, priority reclassifications) to the in-memory inventory dict per the shared file's STOP semantics.

*(STOP checkpoint — Verify.)* User has explicitly picked a scope option AND extraction mode before the workflow advances.

**Output:** User-approved in-memory inventory dict + scope decision (`recommended` (with or without edits) | `full`) + extraction mode (`batch` | `one-by-one`) carried into Step 4b and Step 5 as the build queue. The dict is persisted into `current-website/wireframes.html` `<script id="rw-inventory-data">` at the first wireframe-write iteration.

**User interaction:** Follow §Challenge user hypotheses from agent.md.

---

#### Step 4b: Batch screenshots  *(Mode A only — skip for Mode C and web-class)*

**Mode C / web-class:** Skip this step entirely — Phantom-Browser provides layout geometry directly via bounding boxes; web-class WebFetch + V_min produces text-only mobile substrate (no screenshots needed).

**Gate (Mode A only):** in-memory inventory approved at Step 4 STOP.

**Steps:**
1. Read `projects/{client}/config.md` for `playwright_path:`.
2. For each template in the in-memory inventory, screenshot **each URL** in the `urls` array:
   ```bash
   node {playwright_path}/playwright-capture.js {url} \
     projects/{client}/current-website/audit-feed/screenshots/{template-slug}-{N}.png
   ```
   Where `{N}` is the index (1, 2, 3…). Single-URL templates produce `{slug}-1.png`; multi-URL templates produce `{slug}-1.png`, `{slug}-2.png`, etc.
3. Log each screenshot: `✓ {template-slug}-{N}.png` or `✗ {template-slug}-{N} — {error}`.
   - On error: **do not continue silently** — ask the user:
     ```
     ✗ {template-slug} — screenshot failed ({error}).
     A) Retry screenshot
     B) Skip this template (it will be removed from inventory)
     ```
     If B: remove the template entry from the in-memory inventory and continue with the rest.

**Output:** `audit-feed/screenshots/{template-slug}.png` per template (if Playwright configured). Follow §Saved-file reporting from agent.md.

---

#### Step 5: Build wireframes

**Gate:** Inventory approved (Mode A: screenshots done; Mode C: Phantom-Browser data available; web-class: WebFetch substrate ready).

Follow §Gate Rules from agent.md

Follow: §Workflow Fidelity Rules from agent.md

This step produces `current-website/wireframes.html` by cloning the forward wireframing template (`references/wireframing/wireframing-template.html`) and embedding a single data block that conforms to `references/wireframing/wireframing-schema.md`. Forward and reverse wireframing share one template; data presence in the data block drives the UI (see schema §Mode detection). Reverse wireframing populates the optional `sourceUrl` / `extractionMode` / `capturedAt` fields per page and leaves all `deliberations` arrays empty — the template renders a snapshot-info banner and suppresses the deliberations panel.

**Data contract:**

Read: `references/wireframing/wireframing-schema.md` — the canonical data-block contract for both forward and reverse wireframing. Particularly §Top-level shape, §wireframes[] entry, §section entry, §Element kinds (including the `grid` and `card` container kinds used for card-heavy scraped layouts), and §Reverse-mode example.

Follow [#Data Block Mutation Rules](references/shared/data-block-mutation-rules.md#data-block-mutation-rules) from references/shared/data-block-mutation-rules.md

**Template:**

Read: `references/wireframing/wireframing-template.html` — self-contained template (base CSS + `.wf-*` utilities + shell chrome + IIFE renderer). Clone this file to `projects/{client}/current-website/wireframes.html`, then replace the contents of its `<script type="application/json" id="wireframes-findings-data">` block with the assembled data block (Orchestrating agent assembly below). The template's IIFE renders at load time.

**Pre-check — Canvas enable prompt (Gemini only):** before any subagent dispatch, read the `platform` value from Step 1's Platform Detection. If `platform: gemini-gem`, tell the user: "I'm about to build the wireframes HTML. Please enable the **Canvas** tool — I'll use it to render the file so you can preview it inline." Wait for confirmation, then continue. On any other platform, skip this prompt — disk write is the deliverable surface and no Canvas is involved.

**Mobile rendering on web-class platforms (FIN-013):** when `platform ∈ {claude-web, chatgpt-web, gemini-gem}`, the agent emits the deliverable with `<body class="wf-mobile">` so the wireframing-template renders single-column at 400px max-width. Mobile CSS already lives in `references/wireframing/wireframing-template.html` `body.wf-mobile` block. Cli/claude-api default to no mobile class (desktop rendering).

**Dispatch is platform + extraction-mode gated:**

- **`platform: cli` + extraction mode `batch`** → dispatch parallel subagents, one per template. Emit one progress line: `Mapping {N} templates`.
- **`platform: cli` + extraction mode `one-by-one`** OR **web-class platforms (claude-web / chatgpt-web / gemini-gem)** → sequential processing (one template at a time in the main thread). Emit one informational notice: `Mapping {N} templates one at a time.`

Each subagent (parallel branch) or sequential pass (web/sequential branch) receives:
- Template name + all URLs from `urls` field
- Mode indicator (A / C / web-class)
- Mode A: screenshot paths + scrape paths
- Mode C: Phantom-Browser JSON path (substrate persisted at Step 1.2)
- Web-class: WebFetch markdown substrate (in memory)
- Instruction below (mode-specific)

**Mode C subagent instruction (Phantom-Browser — cli / claude-api):**

```
You are a reverse-wireframing subagent. You receive a flat DOM tree for a single web page at the path given to you — Phantom-Browser's `/api/layout-map` response. You produce one `wireframes[]` entry describing the page in the schema defined at `references/wireframing/wireframing-schema.md` **with the v4.3-proposed changes below applied** (see §v4.3 schema rules). Read the schema in full before starting.

<require load-and-follow="references/wireframing/substrate-fidelity.md">
This file is the operating procedure for this turn — substrate-fidelity protocol (anti-invention, anti-omission of distinctive content, explicit compression). Load it now. Run its pre-save checklist before emitting JSON. Do not emit JSON if any check fails — re-walk the failing dimension first. **Saver discipline: write your wireframe entry via `ux_utils.append_wireframe_data` only — direct file writes / hand-rolled HTML emission / custom save scripts bypass the pre-save coverage gate that fires inside that helper.**
</require>

## Input

A JSON object with `url`, `viewport`, `extractedAt`, `nodeCount`, and `nodes` — a flat array of DOM nodes. Each node has `index`, `parentIndex`, `tag`, `classes`, `role`, `text`, `href`, `src`, `alt`, `ariaLabel`, `display`, and `bounds: {x, y, width, height}`.

## Output

One `wireframes[]` entry object conforming to the schema. Include `slug`, `title`, `purpose`, `sourceUrl` (from input `url`), `extractionMode: "phantom-browser"`, `capturedAt` (from input `extractedAt`), and `sections[]`. Leave `pageDeliberations` and section `deliberations` empty — compression rationale lives in `section.compression` (structured object) per §5 of the schema rules below.

If the input has chrome (nav, header, footer), also emit a top-level `chrome` object.

## Inspection tool

When surveying the DOM, use this standard inspector — do NOT roll your own `python -c` or `PowerShell` one-liners:

```
py -3 references/scripts/ux_utils.py inspect-json <path> [flags]
```

Flags:
- `--from N` / `--to N` — filter by `index` field (range)
- `--skip N` / `--take N` — offset + limit after pointer resolve
- `--indices 45,46,54` — exact list of index values
- `--tag h1,h2` — filter by HTML tag
- `--y-min N` / `--y-max N` — filter by `bounds.y` range
- `--fields tag,text,bounds,href` — choose output columns (default: index,parentIndex,tag,role,text,bounds)
- `--text-len N` — truncate string fields (default 60)
- `--format line|table` — output format

The inspector auto-detects the top-level array (prefers `nodes`/`sections`/`elements`/`items`/`children`). Use it to survey the page structure before synthesizing the wireframe.

## Section identification — walk the tree first

Before applying the schema rules below, identify the page's section boundaries from the DOM tree. Do not infer them from a flat list of headings.

**The schema is the forcing function.** Each section emitted in `wireframes[].sections[]` MUST carry `top_level_node_index`, `y_start`, `y_end`, `child_kind`, and `boundary_reason` (per the schema's reverse-mode provenance fields). `top_level_node_index` is the integer `index` of the substrate node whose subtree contains the entire section — fillable only by walking the parent-child tree, not by sorting headings. The post-authoring coverage check (§Coverage validation below) reads these fields to verify the wireframe didn't drop substrate content.

**Walk the parent-child tree.** Start from the `<main>` node (or `<article>` if `<main>` wraps a single article). Top-level children of that root are the candidate sections. Use `parentIndex` to traverse — `inspect-json --from N` filters direct children of node `N`.

**Container signals beat heading position.** Container tags (`<section>`, `<article>`) and class-name patterns are stronger signals than where a heading sits on the page:
- WordPress: `wp-block-columns`, `*__content` (e.g. `homepage-header__content`, `page-section__content`)
- Common framework patterns: classes ending in `section`, `block`, `module`, `wrapper`
- Semantic tags: `<section>`, `<article>`, `<aside>` direct children of `<main>`

**Grids and cards are atomic.** Once a top-level section is identified, grids and cards inside it stay grouped — a break signal that would land inside a grid keeps the whole grid in its surrounding section. Section breaks land at top-level sibling boundaries only.

**Do NOT build sections from a flat list of headings sorted by `bounds.y`.** This heuristic over-segments composite hero patterns (multiple headings inside a 2-col layout), splits section-header + content-grid bundles into separate sections, and misses sub-blocks nested inside cards.

**Worked example (fusecollective.com homepage, 2026-04-27):** `<main>` → single `<article>` → 8 direct children with classes `homepage-header__content` / `page-section__content` / `section-header__content` — these are the 8 actual sections. A flat heading-Y inference returned 12 sections instead: the composite `homepage-header__content` (2-col: featured case study left, H1 + value-prop + CTA right) was mis-split into Hero / Social-Proof / Problem-framing; service items nested inside Doradztwo / Transformacje cards were treated as siblings of their parent sections.

## Coverage validation

After the wireframe entry is authored, the parent workflow runs a deterministic post-authoring coverage check that compares substrate element counts to wireframe element counts per section. The subagent does not perform this check itself — it only commits to honest `top_level_node_index` / `y_start` / `y_end` values per section so the parent workflow's helper can walk the substrate subtree and tally.

**What the helper counts (per section).** Substrate nodes inside the subtree rooted at `top_level_node_index`: `<p>`, `<h4>`, `<figure>`, `<li>`. Wireframe `elements[]` of equivalent kinds: `paragraph`, `heading.level=4`, `media`, `list.items[]`.

**Thresholds.** A section fails when any of:
- emitted paragraphs < 0.6 × substrate `<p>` count, OR
- substrate has ≥5 `<h4>` and emitted h4-level headings = 0, OR
- emitted media < 0.5 × substrate `<figure>` count.

**Failure surface.** Helper writes a per-section delta to `scratch/coverage-report-{slug}.json`; chat sees a one-line blocker per FIN-044 §Gate Rules discipline. The parent workflow either re-authors the failing section OR emits a structured `section.compression` object on the failing section (e.g., `{ kind: "row-density", shown: 3, total: 8, reason: "representative subset of testimonial cards" }` — explicit, justifiable; see §5 of the schema rules below). Silent omissions are not allowed.

**Out of scope.** Mode A (Firecrawl + screenshots — different substrate; no `parentIndex` tree). V_min web-class branch (WebFetch markdown — text-only, no node tree to count against). These branches emit `extractionMode` other than `phantom-browser` and skip the provenance fields per schema.

## Schema callouts (highlight additions used by this workflow)

Six callouts highlighting the schema additions Mode C relies on. The schema file (`references/wireframing/wireframing-schema.md`) is the source of truth; this list is a quick-reference for emission decisions inside this workflow.

### 1. Card variants

`card.variant` takes one of `default` (omit the field), `tile`, or `highlight`.

- **Default (no `variant`)** — transparent, no padding. Use when the card groups multiple leaves for grid layout but the live page shows no visible bordered tile in that position.
- **`tile`** — warm fill + rounded + padding. Use when the live page has a visible bordered card (distinct background fill, rounded corners, padding, sometimes border).
- **`highlight`** — accent border. Use when the live page has an accented card (outline in brand color, usually a featured/CTA card).

Rule: check the DOM for visible card markers — class names like `card`, `tile`, `box`, `panel`; inline or CSS background fills; rounded borders visible in bounds behavior. When in doubt, use default (no variant).

### 2. Grid column ratios

`grid.columns` takes one of:

- **Integer `2 | 3 | 4`** — equal fractional columns. Use when all columns are within roughly 15% of each other's width on the live page.
- **Array of positive numbers** `[N, M, ...]` — explicit fractional units. Use when the live page shows visibly different column widths (≥20% ratio gap).
- **String `"auto"`** *(v4.4)* — intrinsic-width packing. Children take their natural content widths and pack horizontally instead of stretching to fill 1fr tracks. Use when the live page shows a tight horizontal cluster whose total visual width is materially less than the section width (CTA pairs sitting close together rather than spread to the section edges, a social-proof strip with an avatars cluster directly beside a Trustpilot stack, an inline icon+label pair). Pair with `align: "center"` for the common centered-block layout (CTAs centered as a group, not spread to opposite ends of two 50/50 columns).

Decision rule:
1. Read each column's `bounds.width` from the layout-map (look at the first leaf in each column's subtree, or the column container itself).
2. **Total cluster width vs section width:** measure the sum of column widths + gaps. If that total is materially less than the parent section width AND the cluster sits centered on the live page → `"auto"` + `align: "center"`.
3. Otherwise: if all widths are within 15% of each other → integer form.
4. Otherwise → array. Use a simple ratio like `[1, 2]` or `[1, 3]` when the intent is obvious; use the actual pixel widths `[475, 665]` when the layout calls for precision.

Examples:
- Hero with near-equal image/copy columns → `"columns": 2`
- Parallel service cards (Doradztwo + Transformacje, both same width) → `"columns": 2`
- Narrow intro text + wide content grid (problems section: headline-left + 3×2 icon grid right) → `"columns": [1, 2]`
- Narrow eyebrow label + dominant content column → `"columns": [1, 3]`
- Two CTA buttons sitting tight together, centered in the section → `"columns": "auto", "align": "center"`
- Social-proof strip: avatars cluster (160px) + 16px gap + Trustpilot stack (260px), total ~436px centered in a 768px hero band → `"columns": "auto", "align": "center"`

### 3. Section / grid / card alignment *(v4.4)*

`align` is an optional field on `section`, `grid`, and `card`. Values: `"left"` (default), `"center"`, `"right"`.

- **`section.align: "center"`** — adds `text-align: center` on the section root. Inline + inline-block descendants (headings, paragraphs, button groups when emitted as inline-block) center horizontally. Use on hero sections where the live page centers the entire content band (H1, lead, CTA row, microcopy all centered). Omit when the section content is left-aligned (the prevailing default for content sections, comparison tables, and feature lists).
- **`grid.align: "center"`** — adds `justify-content: center` on the grid. Centers the grid tracks-as-a-block. Has visible effect ONLY when columns are intrinsic (`columns: "auto"`); when columns are `1fr`-based the tracks already span 100% of the grid and `justify-content` is a no-op.
- **`card.align: "center"`** — adds `text-align: center` and `align-items: center` to the card. Centers text descendants AND centers flex children (the card is `display: flex; flex-direction: column`). Use when the card itself groups copy that should center as a block.

Decision rule:
1. Look at the live page's text-align inside the section/card. If centered → `align: "center"` on the section (or card).
2. For grid wrappers: if the cluster is `columns: "auto"` AND visually centered → `align: "center"` on the grid.
3. Omit when content is left-aligned (the default).

Examples:
- Hero with centered H1, lead, CTAs, and microcopy → set `section.align: "center"` on the hero; combine with `grid.columns: "auto", align: "center"` on the CTA row.
- Centered social-proof strip → grid with `columns: "auto", align: "center"`.
- Left-aligned product feature card → omit `align` (default left).

### 4. Substrate fidelity — see `references/wireframing/substrate-fidelity.md`

The substrate-fidelity protocol (anti-invention, anti-omission of distinctive content, explicit compression) governs both element-kind fabrication and media sizing. Closed-kind generic-fallback rules (`testimonial` / `stat` / `trust-bar` / `banner`), the "wireframe never contains text not in the substrate" rule, the universal §Section walk discipline, the §Typographic hierarchy rendered-rank emission mapping, and the media height/width sizing rules all live there.

### 5. Section compression (structured object)

When a section compresses substrate content (representative subset of N items / M, paraphrased long prose, intentional decoration drop), emit `section.compression` per the schema's §section entry table:

```json
"compression": {
  "kind": "row-density" | "prose-paraphrase" | "decoration-drop",
  "shown": <integer>,
  "total": <integer>,
  "reason": "<one-sentence substrate-grounded rationale>"
}
```

- **`row-density`** — cluster compression. Required `shown` (emitted item count in the wireframe) AND `total` (substrate item count, e.g. count of `<li>` / cards / testimonials within the section subtree). Example: a section with 8 testimonial cards in the substrate but 3 representative cards in the wireframe → `{ kind: "row-density", shown: 3, total: 8, reason: "3 representative testimonials of 8 in the substrate" }`.
- **`prose-paraphrase`** — long marketing prose paraphrased to gist. Omit `shown`/`total`. Example: a 4-paragraph value-prop block represented as one paragraph element → `{ kind: "prose-paraphrase", reason: "paraphrased 4-paragraph value-prop block to single representative paragraph" }`.
- **`decoration-drop`** — purely decorative content excluded with rationale. Omit `shown`/`total`. Example: a chrome footer with redundant copyright variations dropped → `{ kind: "decoration-drop", reason: "dropped redundant fine-print copyright variations from footer" }`.

**Do NOT** write compression-semantic entries into `section.deliberations[]` — reverse-mode entries leave `deliberations[]` empty by schema convention. The coverage gate reads `section.compression` exclusively. The audit MD-export renders one human-readable line per compressed section from this field.

### 6. Media decorative flag + `xs` size (label suppression)

`media` elements emit `decorative: true` (boolean, reverse-mode only, default false) when the icon is judged purely decorative by a **3-signal rule** — emit `decorative: true` when at least two of the three signals support the judgment:

- **Filename stem from `src`** — terms like `chevron`, `divider`, `bullet`, `sparkle`, `arrow`, `dot` → decorative. Terms like `mail-send`, `chart-bar`, `cart`, `users` → meaningful (content-bearing).
- **Bounds on the live page** — ≤48px in either dimension is almost always decorative.
- **Position in the section** — small icon above a heading in a repeating card grid is typically decorative; a single prominent icon as a primary visual is content-bearing.

When `decorative: true`, omit the `label` field entirely — the placeholder box still renders visible (the visual slot stays observable) but carries no label text.

`media.height: "xs"` is the second label-suppression trigger. Use for sub-icon visuals (≤80px on the live page — category bullets, inline glyphs, navigation chevrons). The renderer caps `.wf-media--xs` at 64×64 by default, so omitting `width` still produces a square icon tile; pairing with `width: "xs"` remains the canonical form per `substrate-fidelity.md §Media sizing`. The `label` is omitted by convention; sub-icon visuals are rarely content-bearing. If a rare `xs` element IS content-bearing, emit `decorative: false` explicitly AND include the label.

`media.width: "xs"` mirrors `height: "xs"` at 64px max-width — pair with `height: "xs"` for square icon tiles.

**Saver discipline.** Every wireframe write goes through `ux_utils.append_wireframe_data` (or `ux_utils.write_project_plan_block` when emitting a full data block). The helpers carry a pre-save coverage gate; bypassing them with direct file writes or hand-rolled HTML emission bypasses the gate. See `agent.md §Workflow Fidelity Rules`.

## Goal

Your wireframe should resemble the live page enough for a reader who hasn't seen the page to reconstruct its layout and topic. Structure, sectioning, sequence, column proportions, and card decoration should match what a visitor would experience on the live page.

Return a single JSON object in a code block. Do not write files.
```

**Mode C web-platform branch — V_min subagent (claude-web / chatgpt-web / gemini-gem):**

When platform ∈ {claude-web, chatgpt-web, gemini-gem}, dispatch the V_min prompt below over a WebFetch substrate of the target URL. Do NOT dispatch the full Phantom Mode C instruction above — web-class platforms get text-only WebFetch substrate (no DOM tree, no `bounds` coordinates, no `nodes[]` array), and V_min is purpose-built for that input shape.

```
You are a reverse-wireframing subagent producing mobile-viewport wireframes.

Read the schema at `references/wireframing/wireframing-schema.md` — it defines `wireframes[]` entry shape, section taxonomy, element kinds (leaf + container), and authoring guidance.

<require load-and-follow="references/wireframing/substrate-fidelity.md">
This file is the operating procedure for this turn — substrate-fidelity protocol (anti-invention, anti-omission of distinctive content, explicit compression). Load it now. Run its pre-save checklist before emitting JSON. Do not emit JSON if any check fails — re-walk the failing dimension first. **Saver discipline: write your wireframe entry via `ux_utils.append_wireframe_data` only — direct file writes / hand-rolled HTML emission / custom save scripts bypass the pre-save coverage gate that fires inside that helper.**
</require>

Substrate input: a markdown extract of the page below, in document order top-to-bottom. The substrate is text-only — no DOM tree, no coordinates. Use textual cues (heading hierarchy, list patterns, repeated structural shapes, copy density) to infer the page's section boundaries and elements.

Mobile-viewport rules:
- Every section is single-column stacked. Never use multi-column grids (`grid.columns > 1`) — the rendered output is at 400px max-width.
- Use `card` containers (variant `tile` or `default`) when the live page would have visible cards (testimonial cards, case-study cards, pain-point cards). Cards stack vertically on mobile.
- `list` elements are appropriate for plain bullet/numbered lists; `card` is for grouped element clusters (heading + copy + CTA per card).

Section identification: do NOT promote every H2 or H3 to its own section. Use the substrate's structural shape to recognize composites:
- Repeating clusters (≥3 items with the same shape — heading + meta + brief copy) belong inside one section as cards.
- Sub-headings under a section heading are sub-elements of that section, not separate sections.
- Multi-column composites that read as one logical section (hero + featured project, dual CTAs side-by-side) collapse into one section even though headings split them.

Compression rationale: when a section compresses substrate content (representative subset of clusters, paraphrased prose, dropped decoration), emit `section.compression` per the schema's §section entry (`{ kind: "row-density" | "prose-paraphrase" | "decoration-drop", shown, total, reason }`). Leave `section.deliberations[]` empty — compression rationale lives in the structured field. The coverage gate reads it directly.

Decorative-media judgment: V_min DOES NOT emit `media.decorative: true`. The 3-signal decorative rule (see Mode C §6 below) requires bounds as one of three signals; V_min substrate is text-only and lacks bounds, leaving only two signals (filename stem + position). The 3-signal rule degrades and the false-positive risk is asymmetric — mis-judging a meaningful icon as decorative loses its label. Conservative default: emit `decorative: false` (or omit the field entirely) and always include the `label` field for `media` elements.

`media.height: "xs"` IS available to V_min. When the substrate's text-only signals strongly suggest an inline icon / bullet glyph context (e.g., a list of features each prefixed with a small icon described in the markdown), emit `height: "xs"` and omit `label` per the schema convention.

Output: one `wireframes[]` entry conforming to the schema, with `sourceUrl`, `extractionMode: "webfetch"`, `capturedAt` populated. JSON only, no commentary.
```

V_min was validated empirically across 3 sites — fusecollective.com (10 sections), tonik.com (9 sections — recognized 10 case studies + 3 testimonials + 5 services as repeating clusters), symbolstudio.pl (12 sections). Test artifacts at `scratch/webfetch-test/`.

**Mode A subagent instruction (Firecrawl + screenshots — cli fallback only):**

```
You are building one page template's wireframe for a reverse wireframing baseline using Firecrawl scrape + screenshot pairs.
This template may have multiple pages — analyze all of them to build a complete section palette in memory, then emit a single JSON data-block fragment per wireframing-schema.md §wireframes[] entry.

<require load-and-follow="references/wireframing/substrate-fidelity.md">
This file is the operating procedure for this turn — substrate-fidelity protocol (anti-invention, anti-omission of distinctive content, explicit compression). Load it now. Run its pre-save checklist before emitting JSON. Do not emit JSON if any check fails — re-walk the failing dimension first. **Saver discipline: write your wireframe entry via `ux_utils.append_wireframe_data` only — direct file writes / hand-rolled HTML emission / custom save scripts bypass the pre-save coverage gate that fires inside that helper.**
</require>

1. For each URL in the list, fetch content via Firecrawl:
   curl -s -X POST http://localhost:3002/v1/scrape \
     -H 'Content-Type: application/json' \
     -d '{"url": "{url}", "formats": ["markdown"], "onlyMainContent": true}'

   Save each result to:
   projects/{client}/current-website/audit-feed/scrapes/{template-slug}-{N}.md

2. For each screenshot in the list, read it from disk using the Read tool (do NOT display or embed images in the conversation — read silently for internal analysis only):
   Read: {screenshot_path}
   Analyze the image to extract layout and section structure.
   If a screenshot file is missing or unreadable — stop and report:
   "Screenshot missing for {template-slug}-{N} — cannot build the wireframe. Check Step 4b."

3. Map extracted structure to wireframing-schema.md element kinds (same mapping as Mode C step 3 above — leaf kinds for individual elements; `grid`+`card` for N-up card rows; `card` for single visually-framed blocks).

4. Synthesize across all pages into one section list:
   - Identify all sections from all screenshots + scrapes
   - Group by section type + layout structure (not by copy — copy varies, structure is what matters for deduplication)
   - Each unique structure appears ONCE in the output list
   - Populate every field per wireframing-schema.md §section entry. Sources: screenshot → section `type` + `layout` + `elements` structure; scrape → element `text`/`label` copy; agent knowledge + domain refs → `purpose` + `userQuestion`; page position → `narrative`.
   - Leave `deliberations: []` empty — reverse mode does not produce designer rationale.
   - When a section compresses substrate content (representative subset of clusters, paraphrased prose, dropped decoration), emit `section.compression` per the schema's §section entry (`{ kind: "row-density" | "prose-paraphrase" | "decoration-drop", shown, total, reason }`). For Mode A: `shown`/`total` for row-density come from counting items in the screenshot — visible item count in the live page rendering. Compression rationale lives ONLY in this structured field, never in `deliberations[]`.
   - For `media` elements, use the 3-signal decorative rule (filename stem from scrape `src` if available + bounds from screenshot pixel inspection + position in section) — emit `decorative: true` when at least two signals agree; omit `label` for decoratives. Use `height: "xs"` for sub-icon visuals (≤80px on the live page per screenshot inspection); `label` is omitted by convention for xs.

5. Build the wireframe entry object per wireframing-schema.md §wireframes[] entry:
   {
     "slug": "{visitor-mental-model-slug}",
     "title": "{human-readable label}",
     "purpose": "{one-line purpose}",
     "sourceUrl": "{first representative URL}",
     "extractionMode": "firecrawl",
     "capturedAt": "{ISO 8601 timestamp of scrape}",
     "pageDeliberations": [],
     "sections": [...]
   }

6. Return the wireframe entry object (JSON) to the orchestrating agent.
```

Wait for all subagents to complete before proceeding.

**Orchestrating agent assembly steps:**

After all template subagents return their wireframe entry objects:

Follow [#Data Block Mutation Rules](references/shared/data-block-mutation-rules.md#data-block-mutation-rules) from references/shared/data-block-mutation-rules.md

**Post-authoring coverage check (Mode C only — phantom-browser substrate).** For each returned wireframe entry whose page substrate has a Phantom-Browser layout map (i.e. `extractionMode: "phantom-browser"`), run the deterministic coverage helper before any persistence step:

```
py -3 references/scripts/ux_utils.py coverage-check <substrate-json> <wireframe-entry-json> [--report scratch/coverage-report-{slug}.json]
```

Helper walks the substrate subtree rooted at each section's `top_level_node_index`, counts substrate `<p>` / `<h4>` / `<figure>` / `<li>`, compares against the wireframe section's `paragraph` / `heading.level=4` / `media` / `list.items[]` element counts, applies thresholds (paragraphs ≥0.6×, h4 ≥1 if substrate has ≥5, figures ≥0.5×), writes a per-section delta report to `scratch/coverage-report-{slug}.json`, and exits non-zero on any failing section. Per FIN-044 §Gate Rules: silent on success; one-line blocker on failure naming the failing section(s) and pointing to the report file.

On failure, the parent workflow re-dispatches the failing section(s) to the Mode C subagent OR records a deliberate omission in the wireframe entry's `pageDeliberations[]` with rationale (e.g. "showed 3 of 8 testimonials as representative cards" — explicit, justifiable). Silent omissions are not allowed. Mode A and V_min web-class entries skip this check (different substrate shape; covered by separate quality cycles).

Follow §Gate Rules from agent.md

**Per-template JSON persistence (IDE/CLI only — FIN-012).** Read `platform` from Step 1's Platform Detection. If `platform ∈ {cli, ide}`: for each subagent's returned wireframe entry, save the JSON object to `projects/{client}/current-website/mapping/{template-slug}.json` via `save_wireframe_template_json` helper from `references/scripts/ux_utils.py`. If `platform ∈ {claude-web, chatgpt-web, gemini-gem}`: skip — entries live in the consolidated `wireframes.html` data block only.

**MANDATORY pre-assembly step — translate bracketed UI labels.**

Follow [#Translate canonical terms 1:1](agent.md#translate-canonical-terms-11) from agent.md
Follow [#Plain language is the default](agent.md#plain-language-is-the-default) from agent.md (project language source — `project_context.md`)

Walk every key in the template's `DEFAULT_LABELS` block (around [wireframing-template.html:1579](wireframing/wireframing-template.html#L1579)). Each value wrapped in `{...}` braces is a placeholder semantic description — produce the project-language equivalent for each key and write it unbracketed into the data block's `labels` object. Missed keys fall back to the English bracketed default at render time, which is the visible failure signal.

1. Assemble the top-level data block per wireframing-schema.md §Top-level shape. `labels` must be the populated object from the mandatory pre-assembly step — never `{}`:
   ```json
   {
     "namespace": "wireframes-{client}",
     "labels": { /* every DEFAULT_LABELS key, translated per pre-assembly step */ },
     "chrome": {
       "nav": { /* extracted from homepage scrape */ },
       "footer": { /* extracted from homepage scrape */ }
     },
     "wireframes": [ /* entries from subagents, in inventory order */ ]
   }
   ```
2. Extract `chrome.nav` and `chrome.footer` from the homepage subagent's substrate per `references/wireframing/substrate-fidelity.md` §Chrome walk — walk every nav link, every nav action (login, language switcher, utility CTAs), every footer column. Map to the schema's `chrome.nav.{brand, links, cta}` + `chrome.footer.{columns, legal}` shape. Role-bearing-field heuristics: brand = leftmost element with `img` or `.logo` class; cta = rightmost button-styled link inside the `<nav>` subtree; footer columns = groups of links under `<h*>` headings in the footer markup. All other nav links go into `nav.links` — utility links (Login, Signup, account menu) included. The wireframe is a snapshot of the existing site; preserving the actual menu state is part of the baseline.
3. Clone `references/wireframing/wireframing-template.html` to `projects/{client}/current-website/wireframes.html` using a byte-for-byte file copy. Substitute `{project-language}` in `<html lang>` with the project language from current-website context (or Polish if absent), and substitute `{slug}` in the `<title>` with the project slug. **On web-class platforms, also set `<body>` to `<body class="wf-mobile">` so the template renders mobile-style at 400px max-width.**
4. Splice the assembled top-level data block from step 1 into `<script id="wireframes-findings-data">` via `write_project_plan_block(html_path, template_path, "wireframes-findings-data", payload, substitutions)`. **Before saving, validate: `grep -o '"labels":\s*{[^}]*}' wireframes.html` must show a populated object, not `"labels": {}` — if empty, restart from the mandatory pre-assembly step.**
5. **First-iteration inventory persistence:** on the first call to this step (i.e. when `wireframes.html` did not previously exist), also splice the in-memory inventory dict from Step 4 into `<script id="rw-inventory-data">` via `write_project_plan_block(html_path, template_path, "rw-inventory-data", inventory_dict)`. This co-locates the inventory with the first wireframe so the user never sees a half-populated file. On subsequent iterations (additional wireframes appended later in the session), skip this splice — the block is already populated.
6. **Clear the demo `wireframes-findings-data` placeholder content** is implicit: the `write_project_plan_block` call in step 4 replaces the entire block body, so the template's stock "Pulsegrid" demo content does not survive into the user-facing file.
7. **Do not write per-template HTML files.** The consolidated `wireframes.html` is the only deliverable from this step.
8. **Render in Canvas (Gemini only):** if `platform: gemini-gem`, also output the populated `wireframes.html` contents inside a Canvas-rendered HTML artifact so the user can preview the file inline. Disk-write semantics are virtual on Gemini — Canvas is the actual presentation surface. On every other platform, skip this — the disk write IS the deliverable surface.

**Hard rules:**

- **One-to-one rule:** every element in each wireframe entry's `sections[].elements[]` traces back to the template's source pages. No element may be added, inferred beyond the plain meaning of the source, or borrowed from other templates. If a section's source is empty, emit the section with `elements: []` — the template's IIFE renders an empty section card and the reviewer can see the gap.
- **Never re-order the wireframes[] array after assembly.** Entries appear in inventory order from Step 4; the template's page switcher presents them in this order.
- **`labels` is never `{}`.** Empty labels = broken deliverable.

**Output:** `projects/{client}/current-website/wireframes.html` — single consolidated file produced by cloning `wireframing-template.html` and embedding the assembled data block. Per-template `{slug}.json` files persist to `current-website/mapping/` on IDE/CLI platforms (FIN-012). Follow §Saved-file reporting from agent.md.

##### Step 5.5: Post-save fidelity verification

**Gate:**
- `projects/{client}/current-website/wireframes.html` exists with `wireframes[]` populated (per Step 5 build)
- Substrate directory `projects/{client}/current-website/audit-feed/layouts/` exists on disk (cli/claude-api platforms). On web-class platforms (claude-web / chatgpt-web / gemini-gem) substrate is held in memory only — the check is skipped with a visible note.

Follow §Gate Rules from agent.md
Follow §Workflow Fidelity Rules from agent.md

**Action:**

<require load-and-follow="references/scripts/ux_utils.py">
Run `python references/scripts/ux_utils.py coverage-check-post-save projects/{client}/current-website/wireframes.html --substrate-dir projects/{client}/current-website/audit-feed/layouts` against the just-written deliverable. The script reads the wireframes[] block, locates each entry's substrate at `current-website/audit-feed/layouts/{slug}-1.json`, runs per-section coverage analysis with default thresholds (paragraph_ratio=0.6, figure_ratio=0.5, h4_floor=5, text_density_floor=0.5), and prints a structured report.

If the report shows any failing entry: surface the per-entry summary in the Step 6 review STOP, name the failing slugs and their failing sections, recommend re-running the affected Step 5 build entries before proceeding. Do not silently proceed.

If the report shows all pass: surface one line in the Step 6 review STOP — "Substrate coverage verified clean."

If the gate skips (no on-disk substrate, web platform): surface one line in the Step 6 review STOP — "Post-save coverage check skipped — substrate not on disk."

The post-save check is independent of how the wireframes were authored — it reads the deliverable from disk and compares to substrate from disk, catching authorship-style bypasses (custom build scripts, heredoc inspection, forward-mode shape-shifting, `skip_gate=True`) that evade the write-time coverage gate.
</require>

---

#### Step 6: Wireframe review  *(STOP checkpoint)*

**Gate:** `current-website/wireframes.html` written by Step 5.

Follow §Gate Rules from agent.md

The merged Step 5 has already built the wireframes (one consolidated `wireframes.html`, every template as a routable page). Step 6 is the user-facing review checkpoint — announce the saved file and invite a fidelity scan before accepting.

Read: references/wireframe-craft.md (annotation pattern, schema); references/shared/html-craft.md (semantic markup, text hierarchy, project language, color restraint)

Apply §Saved-file reporting from agent.md. Step-specific note: never enumerate per-template sub-lines — the single file is the deliverable. The file's built-in template switcher and annotation toggle are visible when the user opens it; the agent does not need to narrate the UI controls.

**Review prompt (all platforms).** After announcing the saved file, invite the user to scan it:

> *"Mapping the current website is still an experimental feature — some sites are tricky to analyze automatically. Check if anything feels off."*

Wait for the user's reply. If they accept, proceed. If they want changes, dispatch a fix on the affected template(s) via the Step 5 subagent.

**Output:** User-approved `current-website/wireframes.html`.

**User interaction:** Follow §Challenge user hypotheses from agent.md.

---

#### Step 7: Save + confirm

**Gate:** Wireframes built; `current-website/wireframes.html` exists.

Follow §Gate Rules from agent.md

The agent persists `current-website/wireframes.html` and announces saved paths per §Saved-file reporting convention. This is the canonical durable-substrate path — full-site reverse wireframing produces a single consolidated file consumed downstream by Discovery (Post-RW) + Strategy + Wireframing (when running the redesign chain) or by Audit (when audit shares the substrate via Step 1.1 upstream-substrate read).

**Steps:**
1. Print saved paths per §Saved-file reporting convention in agent.md (mode-aware — show Mode A or Mode C structure). The wireframe deliverable is a **single consolidated file** (`wireframes.html`) containing every template as a routable page. Per-template `{slug}.json` files persist to `mapping/` on IDE/CLI platforms; consolidated `wireframes.html` is the single rendered deliverable on every platform.

   **Mode A (Firecrawl + Playwright):**
   ```
   Saved files:
   current-website/
     audit-feed/scrapes/
       {template-1}-1.md
       {template-2}-1.md
     audit-feed/screenshots/
       {template-1}-1.png
       {template-2}-1.png
     mapping/
       {template-1}.json
       {template-2}.json
     wireframes.html
   ```

   **Mode C (Phantom-Browser):**
   ```
   Saved files:
   current-website/
     audit-feed/layouts/
       {template-1}-1.json
       {template-2}-1.json
     mapping/
       {template-1}.json
       {template-2}.json
     wireframes.html
   ```

   **Web-class (claude-web / chatgpt-web / gemini-gem):**
   ```
   Saved files:
   current-website/
     wireframes.html      (mobile-style, 400px max-width)
   ```
   No filesystem-write for `audit-feed/` or `mapping/` on web-class — substrate lives in the consolidated `wireframes.html` data block only.

2. Exit without announcing the next workflow or running any routing logic.

**Output:** Confirmed saved paths.

Hand back to orchestrator — it will read the Planned Route and propose the next step per §Planned Route Mechanism in references/orchestrator.md.

---

### Error Handling

| Error Condition | Response |
|:----------------|:---------|
| Phantom-Browser unreachable on cli/claude-api after retry-gate | STOP for explicit user approval before any fallback fires. On cli, fallback to Firecrawl per Step 1.2 Mode A setup. On claude-api, no fallback — agent reports the blocker and does not downgrade to chat output. |
| WebFetch unavailable / blocked on web-class platform | Hard fail — agent reports the blocker. Web-class platforms route to IDE/CLI for full Phantom flow if desktop fidelity is required. |
| Firecrawl service not reachable on `localhost:3002` | Agent restarts the service container (`docker compose up -d` in `~/firecrawl`). User-facing: "The page-scraping service isn't running — restarting it now. If it doesn't come back I'll switch to a file fallback." |
| URL discovery returns fewer than 5 URLs at Step 4 | Fall back to a deeper crawl (Firecrawl `/v1/crawl` on cli); if crawl also fails, ask user for a URL list |
| A page returns 4xx/5xx during retrieval | Internal: log as "Skipped" with reason. User-facing: "Skipping {URL} — server returned an error. Continuing with the rest." |
| Site needs JavaScript to render (blank markdown returned) | Internal: the local scraper needs a JS-rendering helper that isn't bundled. User-facing: "This site loads its content with JavaScript and the scraper can't see it. Send me a URL list of the key pages instead." |
| No templates identified | Ask user to supply representative URLs manually |
| `projects/{client}/` folder missing | Stop — orchestrator pre-routing should have created it; ask user to confirm project name |

### Success Criteria
- Step 1 acquires substrate via the platform fork (cli/claude-api → Phantom + retry-gate; web-class → WebFetch + V_min) and validates BEFORE the deliverable shell is committed (substrate-first invariant per FIN-008)
- Substrate persistence on cli/claude-api: Phantom JSON written to `current-website/audit-feed/layouts/{slug}-{N}.json`. Web-class platforms hold substrate in agent memory only.
- Steps 1-3 are shared with `references/audit/workflow-audit.md` (same architecture, same code paths) — RW + Audit diverge at Step 4 user-facing scope STOP
- Step 4 scope STOP is the user's first explicit decision point in the RW flow — two template-build options (Recommended *(editable)* / Full) per `references/shared/scope-selection.md` plus extraction-mode (batch / one-by-one). Recommendation logic is unified across RW + Audit: always context-aware best-fit, sized to 3–5 templates by default, with implicit workflow purpose driving the pick (RW = "produce baseline coverage"; Audit = "find improvement opportunities"). Editing the Recommended subset is how custom scopes are expressed.
- Step 3 presents the site informationally — no descriptive coverage statement, no 3-option STOP. The previous Step 2b STOP shape is eliminated; its job is split between Step 3 (informational summary) and Step 4 (user-facing scope STOP).
- Folder structure created (mode-aware):
  - **Mode A:** `current-website/audit-feed/{screenshots,scrapes,mapping}/`
  - **Mode C:** `current-website/audit-feed/{layouts,mapping}/`
  - **Mode B:** current-website/ root only
  - **Web-class:** none — substrate in memory only
- Wireframe entry objects conform to `references/wireframing/wireframing-schema.md` §wireframes[] entry — required fields present; optional reverse-mode fields (`sourceUrl`, `extractionMode`, `capturedAt`) populated per page; `pageDeliberations: []` and each section's `deliberations: []` left empty per reverse-mode conventions
- Per-template substrate retained:
  - **Mode A:** `current-website/audit-feed/scrapes/{template-slug}-{N}.md` with Firecrawl output
  - **Mode C:** `current-website/audit-feed/layouts/{template-slug}-{N}.json` with Phantom-Browser layout data
- Per-template wireframe JSON persisted to `current-website/mapping/{template-slug}.json` on IDE/CLI platforms (FIN-012); web-class skips this persistence
- Section typing uses defined vocabulary (`nav | hero | features | ...`)
- Element kinds conform to `wireframing-schema.md` §Element kinds — 8 leaf kinds for individual elements, `grid` + `card` container kinds for card-heavy layouts (one level of nesting)
- Every wireframe element traces back to its source page — one-to-one, no additions, no inference across templates
- Self-verification passed per template before Step 5 returns
Follow [#Data Block Mutation Rules](references/shared/data-block-mutation-rules.md#data-block-mutation-rules) from references/shared/data-block-mutation-rules.md
- Single consolidated deliverable saved at `current-website/wireframes.html` — produced by cloning `references/wireframing/wireframing-template.html` and embedding the assembled data block in the template's `<script type="application/json" id="wireframes-findings-data">` tag; the template's IIFE renders at load time (snapshot-info banner + hidden deliberations panel per data-presence-driven UI)
- Web-class deliverable carries `<body class="wf-mobile">` for 400px mobile-style rendering; cli/claude-api default to desktop rendering
- 2 STOP checkpoints: Step 4 (scope + extraction mode), Step 6 (wireframe file review)

### Example

**Input:** "Audit example-shop.com — I want to know what templates they have before the redesign."

**Steps:**
- Step 1 → URL mode confirmed; Phantom-Browser via curl on cli platform; substrate persisted at `current-website/audit-feed/layouts/example-shop-1.json`. Step 1.3 validates: final URL matches, nodeCount good, language en (matches), `<h1>` "Premium tools" matches scope.
- Step 2 → Classify as `ecommerce` 🟢 high; loads `references/domains/ecommerce/` knowledge set; core template union: home, category, product, cart.
- Step 3 → Plain-language summary rendered: "B2C ecommerce store selling tools. Catalog-led homepage with product grid. Standard ecommerce conversion path."
- Step 4 *(STOP)* → URL discovery via sitemap returns 340 URLs; agent groups into 5 template candidates: home, product, category, cart (Priority: core), about/contact (Priority: extended, Uncertain — 2 similar single-column pages). Implicit RW purpose (baseline coverage for downstream redesign) drives best-fit pick: home (entry), category (browse stage), product (decision stage), cart (checkout stage) — covers the conversion arc; about/contact left out of the recommendation as boilerplate. Inventory rendered + Recommended (4 templates with per-template reasoning) shown inline. User picks "Recommended" + "batch" (default cli). User resolves the doubt about about/contact ("about and contact are separate templates" — noted in inventory but not added to the build).
- Step 5 → Dispatch parallel subagents per template (cli + batch). Mode C subagent receives Phantom JSON path; produces wireframe entry. Per-template JSON saved to `mapping/{slug}.json`.
- Step 6 *(STOP)* → Review checkpoint for the consolidated wireframes.html. Apply §Saved-file reporting → User accepts.
- Step 7 → Print paths. Hand back to orchestrator.
