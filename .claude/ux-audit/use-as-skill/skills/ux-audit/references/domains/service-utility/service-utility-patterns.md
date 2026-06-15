---
type: knowledge
purpose: "Design patterns and layout strategies for service utility websites"
---
Follow §Communication Rules from agent.md
# Service-Utility: Patterns

Domain knowledge for service-utility page layout patterns and content sequencing.
Part of: references/domains/service-utility/

---

## Pattern A: Tool Landing Page

**Core narrative:** "Use this tool now — no signup needed."

**When to use:** any single-purpose tool page (calculator, converter, generator, checker).

**Content sequence:**

1. **Tool interface hero** — the tool itself, immediately usable above the fold. Input fields, action button, output area. No marketing copy above this.
2. **Result/output section** — appears inline or replaces input area after submission. Large, prominent result with copy/download/share actions.
3. **How it works** — brief (3-5 bullet points), below the tool. Explains methodology for trust, not for instruction (the tool should be self-explanatory).
4. **Related tools** — 3-6 cards linking to similar or complementary tools. Drives session depth.
5. **FAQ / methodology explanation** — detailed accuracy/methodology info for SEO and trust. Collapsible or further down the page.
6. **Premium upsell** — subtle, appears AFTER value is delivered. "Need batch processing? Upgrade for $X/mo." Never before the tool delivers its result.

**Conversion logic:** tool usage → demonstrated value → optional upsell or retention hook (bookmark prompt, email results).

**SEO consideration:** the page title IS the tool name ("Mortgage Calculator," "PDF to Word Converter"). Long-tail keyword targeting is primary acquisition strategy.
<!-- TODO: needs deeper research — optimal text-to-tool ratio for SEO ranking on tool pages -->

---

## Pattern B: Comparison Results Page

**Core narrative:** "Here are your best options based on your criteria."

**When to use:** comparison engines, aggregator services, "best X for Y" tools.

**Content sequence:**

1. **Input summary** — restates user's criteria at the top. Editable for quick refinement without starting over.
2. **Ranked results with key metrics** — list or card format. Each result shows: name, primary metric (price, score, rating), 2-3 secondary metrics, CTA button.
3. **Comparison table** — side-by-side feature/price comparison for top results. Sortable columns.
4. **Filter/sort controls** — persistent sidebar or top bar. Price range, features, ratings, provider type.
5. **Individual result detail** — expandable accordion or modal. Full details without leaving the results page.
6. **"Get quote" or affiliate CTA per result** — clear, per-result action. Distinguish between "visit site" (affiliate) and "get personalized quote" (lead gen).

**Conversion logic:** criteria input → results review → comparison refinement → click-through to provider.

**Trust requirements:** disclosure of ranking methodology, sponsored result labeling, data freshness timestamps. Users must believe results are ranked by relevance, not by commission.

---

## Pattern C: Multi-Tool Hub

**Core narrative:** "All the tools you need in one place."

**When to use:** platforms offering multiple related tools (e.g., a suite of SEO tools, a collection of text utilities, a set of financial calculators).

**Content sequence:**

1. **Search/browse tools** — search bar with autocomplete. Users who know what they want should find it in one action.
2. **Popular tools** — 4-8 most-used tools with usage indicators. Social proof drives discovery.
3. **Tool categories** — grouped by function (e.g., "Text Tools," "Image Tools," "Developer Tools"). Each category shows 3-5 tools with expand option.
4. **Recently used** — for returning users. Personalized section showing their tool history. Requires cookie/account.

**Conversion logic:** hub discovery → tool usage → repeat visits → premium upgrade (for power users who use multiple tools regularly).

**Navigation model:** flat hierarchy preferred. Every tool should be reachable in 2 clicks maximum from the hub. Avoid deep category nesting — users think in tasks, not in taxonomies.
<!-- TODO: needs deeper research — optimal number of tools per category before cognitive overload -->

---

## Pattern Selection Guide

| Signal | Pattern |
|--------|---------|
| Single tool, SEO landing | A: Tool Landing Page |
| User inputs criteria, gets ranked options | B: Comparison Results Page |
| Platform with 5+ tools | C: Multi-Tool Hub |
| Single tool but part of larger suite | A for tool page, C for hub |
| Comparison with single "best result" | B simplified (skip comparison table) |


---

## See Also

- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
