---
type: agent-ops
purpose: "Shared Step 4 scope-selection logic for Reverse Wireframing + Domain Audit — URL discovery, inventory build, scope STOP shape"
---

# Scope Selection (RW + Audit shared)

## Purpose

Both Reverse Wireframing and Domain Audit map the same current website and need to pick which pages to work with at Step 4. This file is the single source of truth for that selection — URL discovery, grouping, inventory rendering, and the scope STOP shape. RW and Audit call the same logic and differ only in (a) their recommended default and (b) what they do with the chosen pages downstream.

Both workflows share Steps 1-3 (substrate acquisition → site-type inference → present site). At Step 4, both call the procedure below.

## URL discovery

Deterministic ladder:

1. **Sitemap fetch** — `GET {base_url}/sitemap.xml`. If a sitemap index is returned, fetch each sub-sitemap.
2. **Substrate fallback** — if no sitemap or fewer than 5 URLs returned, scan the Step 1 substrate `nodes[]` for internal anchor hrefs (same domain or root-relative). Exclude `mailto:` / `tel:` / `#` fragments and asset URLs. Deduplicate.
3. **User fallback** — if still under 3 candidate URLs, ask the user once for a URL list.

Login-gated pages, error pages, redirects, and duplicates land in `excluded` — never in the working inventory.

## Template grouping (URL → template)

Group URLs by path-pattern + repetition:

- N URLs sharing the same path stem (`/product/...`, `/blog/...`, `/case-studies/...`) collapse into one template entry; each URL is appended to that entry's `urls` array.
- Single-occurrence top-level pages (`/about`, `/pricing`, `/contact`) each get their own template entry.

## Priority assignment

Priority comes from the matched archetype's **core template union** computed at Step 2.3 (each domain declares which templates are core for that archetype — e.g. `b2b-industrial` Catalog-First → home, category, product, RFQ/contact).

- `core` — appears in the matched archetype's core template union; load-bearing for the domain.
- `extended` — exists on the site and is recognizable but not in the core union (e.g. careers, generic blog index, generic about).
- `excluded` — error pages, login-gated, duplicates, redirects.

## Inventory shape (in-memory dict)

```json
{
  "client": "{Client}",
  "templates": [
    { "slug": "home",    "priority": "core",     "description": "{one-sentence description}", "urls": ["..."],         "wireframe": "home" },
    { "slug": "product", "priority": "core",     "description": "{one-sentence description}", "urls": ["...", "..."], "wireframe": "product" },
    { "slug": "careers", "priority": "extended", "description": "{one-sentence description}", "urls": ["..."],         "wireframe": "careers" }
  ],
  "excluded": [
    { "url": "{URL}", "reason": "{reason}" }
  ]
}
```

## Render shape (chat presentation at Step 4 STOP)

Render the inventory as a numbered list — one entry per template with bold slug, italic priority tag in parentheses, em-dash separator, one-line plain-language description, then URLs as nested sub-bullets. Excluded entries follow as a separate small "Excluded" list.

Example:

```
1. **home** *(core)* — Homepage of the site.
   - https://example.com
2. **product** *(core)* — Product detail pages.
   - https://example.com/product/saas-platform
   - https://example.com/product/api-tools

Excluded:
- https://example.com/login — gated authentication page
```

## Scope STOP base (Recommended / Full)

Both workflows present the same two options against the rendered inventory:

- **Recommended** *(default, editable)* — the agent's context-aware best-fit subset; named explicitly with one-line reasoning per included template. See "Recommendation logic" below. The user can accept as-is, or edit inline (add templates, remove templates, swap URLs). Editing is how "custom" scope is expressed — there is no separate "Custom" option.
- **Full** — every template in the inventory (the `excluded` list is never built). List the templates that will be added vs. Recommended so the user can see the delta.

User picks one. Edits to the Recommended subset (additions, removals, URL replacements, priority reclassifications) flow back into the in-memory inventory dict.

*(STOP checkpoint — Verify.)* User has explicitly picked Recommended (with or without edits) or Full before the workflow advances.

**Output:** User-approved in-memory inventory dict + final page list. Each calling workflow consumes this differently — RW carries it into Step 4b/Step 5 as the build queue; Audit carries it into Step 5.1 as the per-page substrate fetch list.

## Recommendation logic

**Always run context-aware best-fit.** Both workflows always have a purpose — either explicit in the user's request, signalled by upstream context, or implicit in the workflow's job. The agent never produces a generic core dump; the recommendation is always reasoned from purpose.

### Step 1 — Identify the purpose

Purpose comes from three sources, applied as overrides not as a ladder (more-specific overrides less-specific):

1. **Explicit user input** — goals named in the user's request ("audit my conversion path", "redesign focused on the homepage funnel", "map only the customer-facing surface"). Strongest signal.
2. **Upstream context (when chained)** — `current-website/project_plan.html#context-data` and `#strategy-data` populated by an upstream Discovery step name redesign goals, ICP focus, business priorities, or specific gaps to investigate.
3. **Implicit workflow purpose** — every workflow has a default job:
   - **Audit** — find improvement opportunities (UX gaps, conversion friction, IA misalignment, missing or weak proof). Always present even when the user says only "audit my site."
   - **Reverse Wireframing** — produce baseline coverage of the site's templates so a downstream redesign or strategy step has a complete current-state map.

The implicit purpose always applies. Explicit and upstream signals refine it; they do not replace it. A user who says nothing more than "audit my site" still triggers an audit-shaped best-fit pick, not a generic core dump.

### Step 2 — Build the best-fit subset

Pick templates that maximize value for the purpose, drawing on three signals already in substrate + the Step 2 internal model:

1. **Funnel-stage coverage** — pick at least one representative per stage of the matched archetype's declared conversion path (e.g. b2b-industrial Catalog-First: home → category → product → RFQ; b2b-saas Self-Service: home → pricing → signup). Covers the conversion arc, not just the top.
2. **Nav prominence** — boost templates linked from primary nav, hero CTAs, repeated footer links. The site is telling us what is load-bearing for buyers.
3. **Anomaly / leverage hints** — templates whose substrate suggests high finding-yield (audit) or high snapshot value (RW): unusually thin, unusually long, missing expected CTAs, off-pattern from the archetype, or load-bearing single-purpose pages (a dedicated SEO content page, a comparison page, a methodology page).

**Sizing target.** Aim for **3–5 templates** by default. This is large enough to cover the conversion arc and surface cross-page pattern issues, small enough to stay scannable. Contract below 3 only when the site is genuinely thin (single-page marketing landing, or a 2-template site where adding a third template would mean auditing a boilerplate page like privacy / terms — never pad with low-value templates just to hit the size target). Expand above 5 only when a stated purpose explicitly demands broader coverage.

**Reasoning per template.** Each pick carries one-line plain-language reasoning grounded in the purpose — what gap this page is expected to surface, what conversion stage it covers, why it is load-bearing. No "core template" reasoning by itself ("home is core") — that is core-dump framing, not purpose framing.

### Step 3 — Empty-set guard

If signals 1–3 above produce zero templates beyond the homepage (the site is genuinely too thin to support a multi-page subset), the recommendation collapses to `[home]` — explicit reasoning: "no internal pages worth auditing separately on this site." Do not invent filler templates to hit the 3–5 target.

### Trade-off framing at the STOP

Surface trade-offs against the alternative so the user can step down to faster or up to broader:

- "**Recommended** covers [X templates] — [one-line summary of the conversion arc / gap focus]. **Full** adds [Y, Z templates] and takes roughly [N×] longer. To go faster, edit Recommended down (e.g. 'just home' for a quick read)."
- When the Recommended subset already includes most of the inventory, drop the "Full" trade-off line — they are nearly the same option.
- When the Recommended subset is `[home]` (thin site), say so plainly: "No internal pages on this site add value beyond the homepage; the audit is one page."

## Cross-workflow consistency

The mechanism is identical across both workflows — same URL discovery, same grouping, same priority assignment, same inventory shape, same render shape, same scope STOP, same recommendation logic, same implicit-purpose model. The only divergence is downstream of Step 4:

- RW carries the chosen scope into a build queue (Step 4b screenshots if Mode A; Step 5 wireframe build).
- Audit carries the chosen scope into a per-page substrate fetch list (Step 5.1) followed by site-plan + anatomy passes.

Both workflows map sites identically; they diverge only on what they do with the mapped pages.
