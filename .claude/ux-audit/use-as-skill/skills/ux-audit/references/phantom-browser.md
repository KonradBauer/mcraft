---
type: knowledge
purpose: "Phantom-Browser API reference — layout geometry + content extraction for reverse wireframing"
---

## What is Phantom-Browser

Phantom-Browser is a serverless headless browser deployed on Vercel. Given a URL, it opens the page in a real browser context, runs `getBoundingClientRect()` on page elements, and returns a flat JSON array with bounding boxes and verbatim text content for every meaningful element. It replaces Firecrawl (content scraping) and Playwright (screenshots) with a single API call that returns 100% accurate layout coordinates — no estimation, no visual interpretation.

## Responsibility split

Phantom returns raw layout data — a flat `nodes[]` array with bounds, tags, text, and display values. The reverse-wireframing Mode C subagent (see `references/workflow-reverse-wireframing.md`) consumes this output, performs kind mapping against `references/wireframing/wireframing-schema.md`, composes sections, and emits a `wireframes[]` entry. There is no intermediate finishing pass — the subagent owns all semantic work.

## API Endpoint

Base URL: `https://phantom-browser-virid.vercel.app/api/layout-map`

| Parameter | Required | Default | Description |
|---|---|---|---|
| url | yes | — | HTTPS URL to extract |
| viewport | no | "desktop" | "desktop" (1280x800) or "mobile" (390x844) |
| waitFor | no | — | CSS selector to wait for before extraction (10s timeout, for SPAs) |

Page-load timeout: 20s (`waitUntil: domcontentloaded`). After DCL Phantom waits a fixed 2-second settle window (`POST_DCL_SETTLE_MS = 2000`, v0.6.0+) before invoking extraction, so framework-injected visuals that mount post-DCL (Webflow Lottie SVG renders, Wistia player hydration, similar custom-element / SVG / canvas content mounted by JS shortly after DCL) appear in `nodes[]`. Vercel function ceiling is 30s; total budget stays under that for typical requests. Very late-mounting content (more than ~2s past DCL — SPA shells with multi-stage hydration, dashboard-style apps populating regions on scroll) may still not be captured — use `waitFor=<selector>` to wait until critical content mounts.

## Response Schema

```json
{
  "url": "string",
  "viewport": { "width": number, "height": number },
  "extractedAt": "ISO 8601",
  "nodeCount": number,
  "nodes": [{
    "index": number,
    "parentIndex": number | null,
    "tag": "string",
    "classes": ["string"],
    "role": "string | null",
    "text": "string | null (max 1000 chars)",
    "href": "string | null",
    "alt": "string | null",
    "display": "string (block|flex|grid|inline|...)",
    "bounds": { "x": number, "y": number, "width": number, "height": number }
  }],
  "diagnostics": {
    "extractedTextLength": number,
    "concerns": ["string", ...]
  }
}
```

`diagnostics` is always present (added in Phantom v0.3.0). `extractedTextLength` is the sum of `node.text` lengths across all extracted nodes. `concerns` is an open-ended string array; currently emitted: `low-extraction-yield` when extraction yields very little text — typical for SPA shells / app dashboards that aren't Phantom's target audience. Informational only — Phantom never blocks or short-circuits the response based on `concerns`.

## Which Elements Are Extracted

Phantom walks the live DOM via a small set of inclusion paths. An element surfaces in `nodes[]` if any path matches; otherwise it's filtered.

**Included tags (always when present):**
- Semantic HTML5: `nav`, `main`, `section`, `article`, `aside`, `header`, `footer`
- Interactive: `a`, `button`, `input`, `select`, `textarea`, `form`
- Content: `h1`–`h6`, `p`, `img`, `ul`, `ol`, `li`, `table`, `figure`, `video`

**Block-level wrappers (`div` / `span`):** included when any of these holds:
- `display: flex` or `display: grid`
- Contains at least one direct non-whitespace text-node child (v0.5.0+) — catches Webflow eyebrow tags, Framer chips, Tailwind utility text, etc.
- Direct parent of any element already on this list — Pass 2 single-level parent-walk

**Atomic-leaf inclusion (v0.4.0 + v0.6.0):** `svg`, `canvas`, `iframe`, and any custom element (tag containing `-` — `dotlottie-player`, `wistia-player`, `model-viewer`, `spline-viewer`, etc.) are emitted as atomic-leaf nodes when bounds satisfy the selectivity rule:
- `svg` — `width ≥ 80 AND height ≥ 80`, **OR** the SVG subtree contains an `<image>` descendant (catches embedded-raster illustrations regardless of bounds)
- `canvas`, `iframe`, custom elements — `width ≥ 80 AND height ≥ 80`
- The shared threshold lives as `MIN_ATOMIC_LEAF_DIMENSION = 80` in `lib/extractor.ts`.

Atomic-leaf nodes never enumerate descendants — shadow DOM, light-DOM children, iframe document content, canvas pixel data, and SVG path/g/image descendants are all excluded from `nodes[]`. The element itself surfaces with the standard fields (`tag`, `classes`, `role`, `ariaLabel`, `display`, `bounds`); consumers infer kind (Lottie, video, 3D viewer, tracking iframe, etc.) from `tag` + `classes` + `bounds` + `aria` signals. Phantom does not classify atomic leaves by kind.

**Excluded:** zero-area elements, `script`, `style`, `noscript`, `meta`, `link`, `template`.

## Known limitations

- **Very late-mounting content (>2s past DCL).** The 2-second post-DCL settle catches typical framework-injected visuals; content that mounts further out (multi-stage SPA hydration, scroll-triggered region population, deferred carousels) still misses the snapshot. Use `waitFor=<selector>` for targeted waits, or rely on the agent-side placeholder pattern (see `references/wireframing/substrate-fidelity.md` §Empty visual containers + `media.runtimeInjected`) when no stable selector exists.
- **Sub-80×80 visual content.** Atomic-leaf inclusion is size-gated. Content-bearing `<svg>` / `<canvas>` / custom elements smaller than 80×80 are filtered along with decorative icons and tracking pixels. The trade-off is intentional; tuning per-site is out of scope.
- **Inside of atomic leaves.** Phantom does not enumerate canvas pixels, iframe document content, shadow-DOM children of custom elements, or SVG descendant paths. Atomic leaves report existence + bounds + standard fields — consumers reason about kind from there.
- **Embedded raster bytes.** When an SVG qualifies via the `<image>`-descendant clause, the base64 / data-URI raster is used as a selectivity signal only — never surfaced on the node (per v0.4.0 FIN-003, payload-size discipline).

## Per-Platform Retrieval

Reference: Platform Detection in `workflows.md`

Substrate-acquisition strategy splits along an autonomous-fetch axis: platforms where the agent can reliably call Phantom-Browser autonomously use the Phantom API directly; platforms where autonomous Phantom calls are structurally blocked use WebFetch + a minimal subagent prompt (V_min) to produce a mobile-style wireframe.

### Platform: cli

```bash
curl -s "https://phantom-browser-virid.vercel.app/api/layout-map?url={URL}&viewport=desktop"
```

Agent calls directly via curl. Parse JSON response. On sparse result, retry once with `waitFor=<selector>` per §Sparse-result retry. After documented Phantom failure + user approval, fallback to Firecrawl (`localhost:3002`) per `references/workflow-reverse-wireframing.md` Step 1.2 Mode A setup. Never silent fallback.

### Platform: claude-api

Autonomous fetch via Workbench / registered tools. The Anthropic API runtime (Workbench, registered HTTP tools, custom Skills with WebFetch permission) can call the `/api/layout-map` endpoint directly without the URL-provenance gates that block claude.ai chat. Agent receives the full JSON response in the same turn.

```
GET https://phantom-browser-virid.vercel.app/api/layout-map?url={URL}&viewport=desktop
```

Same retry-gate behavior as cli on sparse result. No Firecrawl fallback (the Anthropic API runtime has no Docker access); falls back to WebFetch only after documented Phantom failure + user approval.

### Platform: claude-web, chatgpt-web, gemini-gem (uniform web-class behavior)

**Substrate path: WebFetch + V_min subagent + mobile-style wireframe.** The Phantom-via-paste-URL pattern (originally documented as primary path on web-chat platforms) and the `/api/view` Gemini paste-back pattern are both retired — not retained as opt-in. Users needing full desktop fidelity switch to IDE/CLI for the cli platform path.

**Empirical rationale (2026-04-28 validation across 3 sites):**
- **claude-web** — claude.ai's URL-provenance gate blocks autonomous fetches against `phantom-browser-virid.vercel.app`. The user-paste-URL workaround (agent emits the API URL → user pastes the JSON back) adds significant ceremony for marginal benefit when WebFetch + V_min produces usable wireframes from the same source.
- **chatgpt-web** — ChatGPT's cybersecurity classifier flags Phantom calls as suspicious; the agent receives a refusal rather than the JSON.
- **gemini-gem** — Gemini hallucinates fetch results when given an API URL it cannot reach (returns plausible-shaped JSON unrelated to the actual page). The previous paste-back workaround was reliable but added the same ceremony cost as paste-URL on Claude/ChatGPT.

**V_min subagent.** The agent dispatches a minimal-prescription subagent prompt (canonical body in `references/workflow-reverse-wireframing.md` Step 5 Mode C web-platform branch) over a WebFetch substrate. V_min mirrors Phantom Mode C's "schema + substrate + recognize patterns yourself" approach without prescriptive grid-detection / H2-H3 hierarchy / count-cap rules. Validated empirically across 3 test sites (`scratch/webfetch-test/`):
- fusecollective.com → 10 sections (clean grouping; no over-segmentation).
- tonik.com → 9 sections (V_min recognized 10 case studies + 3 testimonials + 5 services as repeating clusters; baseline V1 over-segmented to 35).
- symbolstudio.pl → 12 sections.

**Mobile-style wireframe.** The deliverable carries `<body class="wf-mobile">` so `references/wireframing/wireframing-template.html` renders single-column at 400px max-width. Mobile CSS already in both wireframing-template.html and audit-template.html (`body.wf-mobile` block — 400px max-width override, mobile heading sizes, 16px section/nav/footer horizontal padding, meta-strip margin/padding fix, nav wrap behavior).

**Test artifacts** at `scratch/webfetch-test/` (3 sites: substrate + V_min prompt + result JSON for each) — kept as regression harness for V_min prompt tuning.

**Desktop fidelity routing.** When the user needs full desktop layout-coordinate accuracy, route to IDE/CLI: re-run the workflow on cli platform where Phantom-Browser autonomous fetch + bounding-box geometry is available. Web-class platforms always produce mobile-style wireframes; this is the explicit trade-off — one consistent web flow with no paste-URL ceremony in exchange for desktop-fidelity loss recoverable by switching runtime.

## Error Handling

| Code | Meaning | Agent action |
|---|---|---|
| 401 | Unauthorized (legacy — should not occur, auth removed) | Report error, fall back to WebFetch |
| 403 | URL resolves to private IP (SSRF protection) | Inform user URL is blocked |
| 422 | Invalid URL or non-HTTPS | Ask user for correct URL |
| 429 | Rate limit exceeded (30 req/60s) | Wait 60s and retry, or inform user |
| 504 | Page load timeout | Try with `waitFor` param, or ask user if site is accessible |

### Sparse-result retry (200 OK, thin nodes[])

A successful response may still under-capture an SPA-heavy or lazy-hydrated site — `waitUntil: domcontentloaded` snapshots before late-mounted JS content paints.

**Primary signal (Phantom v0.3.0+):** check `diagnostics.concerns`. If it includes `"low-extraction-yield"`, Phantom itself flagged that the page yielded very little text — typical for SPA shells, app dashboards, or pages that hydrate content client-side. This is the authoritative sparsity signal; it fires when the sum of all `node.text` lengths falls below 500 chars.

**Fallback heuristic (when `diagnostics` is absent or you want a per-region check):** `nodeCount` looks unusually low for the site's apparent complexity, the homepage's main nav or hero region is absent from `nodes[]`, or whole sections you'd expect to see are missing.

When the result looks sparse, retry the same URL with `waitFor=<selector>` pinned to a critical mounted element (e.g. `waitFor=.hero`, `waitFor=main`, `waitFor=[role="main"]`). Pick a selector likely to mount only after the SPA finishes hydrating its primary content. The 10s `waitFor` timeout runs after the 20s page-load — total budget stays under the 30s function ceiling.

If the retry also yields `low-extraction-yield` (or sparse heuristics fire again), the site genuinely renders little server-side and is outside Phantom's target audience (Phantom is for marketing-style content, not SPAs / app shells). Fall back to WebFetch.

## Fallback: WebFetch (cli / claude-api last resort)

On `cli` and `claude-api` platforms, when Phantom-Browser is documented unreachable (timeout, DNS error, 5xx) AND the user has explicitly approved the fallback, the agent may use WebFetch + V_min subagent (same prompt body as the web-class primary path). This is a real last resort — not silent fallback. Per `references/workflow-reverse-wireframing.md §Page fetching priority`, the agent must STOP for explicit user approval before any fallback fires; verbal-denial-without-probe is forbidden.

On web-class platforms (`claude-web`, `chatgpt-web`, `gemini-gem`), WebFetch + V_min is the **primary** substrate path, not a fallback — see §Per-Platform Retrieval web-class row above.

## Rate Limiting

IP-based, 30 requests per 60-second window. No authentication required. CORS enabled for browser-based access.
