---
type: knowledge
purpose: "Design patterns and layout strategies for data content websites"
domain: data-content
topic: patterns
description: Data Content domain patterns — page layouts per archetype, report landing page, format adaptation rules, interactivity fallbacks, PDF production rules, and domain boundary.
---
Follow §Communication Rules from agent.md
# Data Content: Page Layout Patterns

Domain knowledge for data-driven content sites (reports, whitepapers, data stories, published research).
Part of: references/domains/data-content/

---

Select a pattern based on report archetype, audience sophistication, and primary distribution format.

**Narrative arc: Orient → Evidence → Insight → Action** — Data content pages follow this sequence:
- **Orient**: Establish context, scope, and why the reader should care (Hero, Executive Summary)
- **Evidence**: Present data with progressive complexity (Metrics, Charts, Tables)
- **Insight**: Synthesize findings into actionable conclusions (Key Findings, Recommendations)
- **Action**: Channel understanding into next steps (Download, Share, Contact, Subscribe)

---

## A. Executive Summary Page

**Use when:** C-suite or time-constrained audience needs the full picture in under 3 minutes. Annual reports, consulting deliverables, policy briefs.
**Core Narrative:** "Here is what matters most → here is the evidence → here is what it means for you → here is the full detail if you want it."
**Focus:** Rapid comprehension with optional depth.
**Structure:**
1. **Summary hero** — Outcome-focused headline (what the data means, not the report title) + 1-sentence framing + "Read Full Report" CTA + "Download PDF" secondary
2. **Key metrics bar** — 3-5 headline numbers with delta context: "Revenue +12% YoY" · "NPS 72 (+8)" · "Market share 23.4%". Each metric links to its deep-dive section
3. **Key findings cards** — 3-7 finding cards, each with one-sentence insight + supporting mini-chart or icon. Cards are scannable and self-contained
4. **Section deep dives** — Accordion or anchor-linked sections, each opening with a section-level summary before presenting charts and tables. Sections follow the report's logical order
5. **Methodology note** — Collapsible panel: data sources, sample size, timeframe, limitations. Builds credibility without consuming space
6. **Appendix links** — Data downloads (CSV/Excel), full methodology PDF, related reports, contact for questions
7. **Footer** — Publication date, update frequency, citation format, legal disclaimers

---

## B. Scrollytelling Page

**Use when:** Data story requires guided narrative — the reader needs to understand *why* the data matters in a specific sequence. Investigative data journalism, impact reports, trend explainers.
**Core Narrative:** "Watch this unfold → each scroll reveals a new layer → now you see the full picture."
**Focus:** Author-controlled revelation with visual continuity.
**Structure:**
1. **Immersive hero** — Full-bleed visual (map, chart, or photograph) + bold claim headline + "Scroll to explore" affordance
2. **Sticky chart + scrolling text steps** — Visualization region fixed in viewport; narrative text scrolls alongside. Each text step triggers a state change in the chart (highlight, filter, annotate, zoom, transition)
3. **State triggers** — Each step boundary fires a discrete state update. Chart changes must be clearly caused by the adjacent text — ambiguous causality is the primary scrollytelling failure mode
4. **Breathing moments** — After 3-4 dense data steps, insert a pull quote, photograph, or summary callout to prevent cognitive fatigue
5. **Exploration breakout** — Optional mid-narrative sandbox where the reader can interact with the data directly (filter, hover, compare) before the narrative resumes
6. **Summary + CTA** — Post-scrollytelling wrap-up: key takeaway restated, methodology link, share buttons, related content

**Variants:**
- **Side-by-side sticky (classic)** — Text column (40%) triggers; chart column (60%) stays fixed. Desktop default. Mobile: chart 100% width sticky at top, text scrolls below
- **Full-bleed sticky with overlay text** — Chart fills viewport; text appears in translucent floating cards. Best for maps, 3D, video. Requires contrast-safe scrims under all text
- **Stepper + scroll hybrid** — Explicit Next/Back buttons alongside scroll triggers. Superior for policy reports, education, accessibility — supports deterministic "jump to step N" via URL fragments

**Performance rules:**
- IntersectionObserver-based triggers (not scroll-event loops)
- CSS `position: sticky` for layout (not JS calculations)
- Lazy-load below-fold heavy assets
- Total asset weight budget: <2 MB for the scrollytelling section
- `prefers-reduced-motion`: disable animations, show all content statically

---

## C. Dashboard Page

**Use when:** Content is exploration-oriented — the reader wants to answer their own questions using published data. Topic explainers, open data portals, benchmarking tools, survey results.
**Core Narrative:** "Here is what the data shows at a glance → filter to find what matters to you → drill into the details → take the data with you."
**Focus:** Reader agency with editorial guardrails.
**Structure:**
1. **Context header** — "What you will learn" introduction (2-3 sentences), data freshness indicator ("Updated March 2026"), scope statement
2. **KPI grid** — 3-5 headline metrics as large-number tiles with unit, delta, and sparkline. Tappable to jump to the relevant section
3. **View toggle** — Chart | Map | Table for same dataset (Our World in Data pattern). Persistent across sections
4. **Filter rail** — Sticky sidebar (desktop) or sticky bottom sheet (mobile). Entity selection (countries, categories), time range, metric chooser. Filters apply globally to all sections below
5. **Filterable chart sections** — 2-4 chart modules, each with: chart + title + one-sentence takeaway + annotation layer + source line. Charts update when filters change
6. **Detail drill-down** — Click a data point or row to expand: definition, methodology, related metrics, time series, download options
7. **Export and embed** — Download data (CSV, image, PDF), copy embed code (live or archived), share link with current filter state encoded in URL
8. **Methodology and sources** — Expandable panel: definitions, data provenance, update schedule, known limitations

---

## D. Chapter-Based Page

**Use when:** Long-form report (5,000+ words) with distinct thematic sections. Annual reports, research papers, policy documents, sustainability reports.
**Core Narrative:** "Here is the full picture → navigate to what interests you → each chapter tells a complete story → the executive summary ties it together."
**Focus:** Non-linear access to structured depth.
**Structure:**
1. **Report cover / landing** — Title, authors, publication date, executive summary (3-5 bullet points), "Jump to chapter" navigation
2. **Sticky Table of Contents** — Persistent ToC button opening a drawer with chapter list + "you are here" highlight. On desktop, optionally visible as a left sidebar. Shows reading progress per chapter
3. **Chapter pages** — Each chapter follows a consistent template:
   - Chapter title + one-paragraph summary
   - Content sections with in-page anchors
   - Mixed media: charts, tables, pull quotes, photographs
   - Chapter-level executive summary at the end (for readers who scrolled through)
   - "Next chapter" / "Previous chapter" navigation
4. **Cross-chapter navigation** — Progress bar (top or side) showing position across all chapters. Section markers ("Part 2: Evidence"). Deep links to every section via URL fragments
5. **Recovery and re-entry** — "Continue where you left off" (local storage). "Skip to content" accessibility link. Bookmarkable section URLs
6. **Download center** — Full report PDF, individual chapter PDFs, data appendix, GRI/SASB index (for sustainability reports), presentation deck

---

## E. Report Landing Page

**Use when:** B2B whitepapers, consulting research, gated reports, think-tank publications. The page sells the report before delivering it — conversion and credibility are co-primary goals.
**Core Narrative:** "This research answers your question → here is proof it is worth your time → get the full report now."
**Focus:** Demonstrate value before asking for commitment (download, email, or read).
**Structure:**
1. **Outcome-focused hero** — Headline frames the decision the report helps make, not the report title. "How leading retailers cut returns by 34%" not "2026 Retail Returns Report". Subheadline adds scope and audience. Primary CTA above fold: "Read Online" or "Download PDF"
2. **Key findings teasers** — 3-7 finding cards or bullets proving the report contains real insight. Each finding is a standalone claim with a supporting data point: "67% of CFOs plan to increase AI budgets in 2027." Cards are scannable — no paragraphs
3. **Data visualization preview** — 1-3 standout interactive charts from the report, embedded as teasers. The reader can interact (hover, filter) to experience the report quality before committing. Static fallback for PDF/email contexts
4. **Credibility block** — Methodology summary (sample size, geography, timeframe), author bios or firm credentials, client/partner logos in a horizontal bar
5. **CTA section** — Two paths: "Read Online" (full web version) and "Download PDF" (gated or ungated). If gated: minimalist lead capture form (1-3 fields: Email, Name, Company). Every extra field beyond email reduces conversion. Form placed adjacent to social proof (logos, testimonials)
6. **Optional lead capture form** — Progressive disclosure: capture email first, then optionally ask for company/role in a follow-up step. Never front-load 5+ fields. Trust signals directly adjacent to form: compliance badges, "No spam" assurance, testimonial quote
7. **Landing page isolation** — Remove main site navigation to prevent exit before conversion. Single "Return to main site" text link. All focus on the report CTA
8. **Secondary content** — Related reports, newsletter signup, "Contact our analysts" — below fold, after primary conversion opportunity

---

## Format Adaptation Rules

Rules for adapting data content across delivery formats while preserving data truth and narrative integrity.

### Web (Vertical Scroll)

- **Progressive disclosure** — Lead with insight, hide supporting detail behind expand/collapse. Never show all data at once
- **Interactive enhancements** — Tooltips, filters, zoom, animated transitions as optional layers. The static base view must communicate the message without any interaction
- **Deep linking** — Every section, chart, and table addressable via URL fragment. Filter states encoded in URL parameters for shareability
- **Lazy-load** — Charts and tables below the fold load on scroll-enter. Skeleton placeholders maintain layout during load
- **Sticky ToC** — For content exceeding 3 screen heights, provide persistent navigation with active-section highlighting
- **Responsive charts** — Never simply scale down; use breakpoint-specific designs. Mobile may show fewer series, larger labels, tap instead of hover

### PDF (Paginated)

- **Page breaks** — Never orphan a figure title at page bottom. Keep chart + title + 2-4 lines of caption together. Tables split only on row boundaries
- **Static charts with legends** — Replace tooltips with direct labels and callout annotations baked into the chart. Legends must be self-sufficient without interaction
- **Headers and footers** — Running headers (report title + chapter), page numbers, confidentiality notice if required. Table headers repeat on every continuation page
- **Print-friendly colors** — Dark backgrounds flip to light for print (ink savings, readability). Verify all data-encoding colors remain distinguishable in CMYK and grayscale
- **Typography** — Print-optimized fonts (serif regains advantage in PDF renderers that bypass OS hinting). Tabular numerals in all tables for vertical alignment

### Presentation (Horizontal Slides)

- **One key insight per slide** — Chart is a prop for the spoken argument, not standalone exploration. Apply reduction: restrain → reduce → emphasize
- **Simplified data** — Fewer series, larger labels, single emphasis color. Fade non-essential data to gray. Maximum visual complexity must be interpretable in 5 seconds
- **Speaker notes as detail layer** — Exact values, methodology, caveats, supporting data pushed to speaker notes. The slide is the headline; notes are the article
- **Build sequences** — Reveal data step-by-step across animation builds rather than showing everything at once. Each build corresponds to one point in the spoken narrative
- **Consistent spatial frameworks** — For recurring metrics across slides, place numbers in the same position every time. Reduces cognitive decoding effort

### Interactivity Fallback Mapping

When interactive features cannot be rendered in static formats, apply these conversions:

| Interactive Feature | PDF Fallback | Slide Fallback |
|---|---|---|
| **Tooltip** | Callout box on chart + "selected values" table below + footnotes for edge cases | Values in on-chart callouts or speaker notes |
| **Filter** | 2-6 pre-filtered small multiples (one panel per filter value), OR "top 5 + other" summary | One segment per slide in sequence; appendix grid for completeness |
| **Zoom** | Inset zoom panel showing detail area, OR second figure on next page | Two slides: overview then zoomed detail |
| **Animated transition** | Static final state with annotation arrows or numbered sequence showing key frames | Final state with annotation; build sequence if multiple states matter |
| **Interactive legend toggle** | Static legend with clear contrast for all series; direct labeling preferred | Grayscale all series + single action color highlighting the discussed one |
| **Tabs / tabsets** | Render all tabs as sequential sections (only first tab visible in some PDF renderers) | Convert to separate slides or agenda sections |

---

## PDF-Specific Production Rules

Detailed rules for producing data-heavy PDF content that survives pagination, printing, and machine extraction.

### Table Continuation

- Repeat header row (`<thead>`) on every page where the table continues
- Add "Table X (continued)" label on every continuation page — readers landing mid-table must know what they are looking at
- Keep identifier columns (name, category, ID) on every page; split wide tables into Table 3a / 3b or move less essential columns to appendix
- Never orphan the table title — keep title + header + first 2-3 data rows together on the same page

### Color Adaptation for Print

- Dark backgrounds used on screen must flip to light backgrounds for print — dark backgrounds waste ink, reduce text contrast on paper, and cause bleed-through on thin stock
- Verify all data-encoding colors remain distinguishable when converted to CMYK (vibrant RGB can turn muddy) and when printed in grayscale (B&W printers are common)
- Pre-define CMYK equivalents for all brand and data colors in the design system — do not rely on automatic conversion

### Reduced-Motion and Accessibility Fallbacks

- Animated elements (counting numbers, chart transitions, scroll-triggered reveals) must show their final state only in PDF — there is no animation in a paginated document
- Every chart must have a text description or structured caption sufficient for screen-reader users
- Use structural gridlines in tables — aids both human readability and machine extraction (tools like Tabula struggle with borderless tables)

### Page Break Decision Logic

```
If block is Chart:
  If (chart + title + 2-line caption) fits remaining page → place here
  Else → move entire block to next page (never split a chart)

If block is Table:
  If fits entirely → place here
  Else:
    Place title + header + as many full rows as fit
    Repeat header on next page(s)
    Add "(continued)" label on each continuation page

If block is Section heading:
  Require heading + at least 2 lines of following text together
  Never leave a heading stranded at page bottom
```

### Print CSS Essentials

- Define `@page` size and margins explicitly
- `break-inside: avoid` on figure containers, callout boxes, heading + first-paragraph groups
- Set `orphans: 2` and `widows: 2` minimum for paragraphs
- Test table pagination aggressively — browser support for `page-break-inside: avoid` on table rows is inconsistent

---

## Domain Anti-Patterns

Mistakes specific to data content sites that undermine credibility, comprehension, or conversion.

### A. Chart Without Takeaway

Presenting a chart without a one-sentence interpretation. The reader sees data but does not know what conclusion to draw. Every chart must have an adjacent takeaway sentence: "Revenue grew 12% year-over-year, driven primarily by the APAC region."

### B. Wall of Metrics

Showing 10+ KPIs simultaneously without hierarchy. The reader cannot distinguish signal from noise. Limit above-fold metrics to 3-5 headline numbers; group supporting metrics into expandable sections below.

### C. Decoration-First Visualization

Choosing chart types for visual novelty (3D pie charts, radial bar charts, bubble clouds) rather than data communication. Chart type must match the data relationship: trend → line, comparison → bar, composition → stacked bar, distribution → histogram.

### D. Orphaned Methodology

Burying methodology in a footnote or omitting it entirely. Data content credibility depends on the reader being able to assess data quality. Methodology should be accessible in one click/tap from any chart.

### E. PDF-as-Screenshot

Publishing a PDF that is a pixel-perfect screenshot of the web version. PDF requires its own layout: paginated tables, static charts with direct labels, print-friendly colors, repeated headers. A screenshot PDF has tiny text, broken tables, and wasted margins.

### F. Gating Before Value

Requiring email/registration before the reader has seen any evidence that the report is worth their data. Show 3-7 key findings and 1-3 preview charts before the gate. The gate converts interest, not curiosity.

### G. Ambiguous Scroll Causality

In scrollytelling, the chart changes but the adjacent text does not clearly explain what changed or why. Every state transition must have a text step that names the change: "Now filtering to only European markets, the trend reverses."

### H. Interactive-Only Insight

A critical finding that requires hover, filter, or animation to discover. If the insight is essential, it must be visible in the static default state. Interactivity enhances — it must never gate comprehension.

---

## Domain Boundary

**What this domain is:** Published content where data is the substance — reports, whitepapers, data stories, research publications, annual reports, survey results, and data journalism meant to be *read*, *understood*, and *shared*.

**What this domain is NOT:**

- **BI / analytics tool design** — Operational dashboards used for daily monitoring, ad-hoc queries, and real-time alerting are Enterprise Tools domain, not Data Content. The distinction: Data Content is *authored and published*; BI tools are *operated and queried*
- **Data entry interfaces** — Forms, input screens, and data collection UIs are interaction design problems, not content design problems. See Forms patterns
- **Real-time monitoring dashboards** — Dashboards that show live operational status (server health, production line metrics, trading screens) are operational tools, not published content. They are designed for continuous attention; data content is designed for episodic reading
- **Data visualization libraries or tools** — This domain covers the *design patterns* for presenting data content, not the implementation of chart rendering engines or BI platforms

**The litmus test:** If the primary user action is *reading and understanding*, it is Data Content. If the primary user action is *querying, filtering, and monitoring in real time*, it is an operational tool.

---

## Audit Checklists

### Data Content Credibility Check

1. **Takeaway present**: Does every chart have an adjacent one-sentence interpretation?
2. **Methodology accessible**: Can the reader find data sources and methodology in one click from any chart?
3. **Metric hierarchy**: Are above-fold metrics limited to 3-5 headline numbers with supporting detail below?
4. **Source attribution**: Does every data visualization cite its source?
5. **Update indicator**: Does the page show when data was last updated?

### Format Adaptation Check

1. **PDF tables**: Do table headers repeat on every continuation page?
2. **PDF colors**: Have dark backgrounds been flipped to light for print?
3. **PDF charts**: Are all tooltips replaced with static callouts or labels?
4. **Slide density**: Does each slide communicate one key insight?
5. **Slide fallbacks**: Are interactive features converted to static equivalents?
6. **Web deep links**: Can every section and chart state be shared via URL?

### Landing Page Conversion Check

1. **Headline focus**: Does the hero headline frame the decision, not the report title?
2. **Value before gate**: Are 3+ key findings visible before any lead capture form?
3. **Form friction**: Is the lead capture form 3 fields or fewer?
4. **Navigation isolation**: Is main site navigation removed to prevent conversion leaks?
5. **Trust signals**: Are credibility indicators (logos, methodology, ratings) adjacent to the CTA?

---

## See Also

- `shared/composition.md` — narrative arc frameworks, progressive disclosure patterns
- `shared/conversion.md` — CTA placement, social proof, gating strategies
- `shared/accessibility.md` — WCAG chart requirements, screen reader descriptions, reduced motion
- `shared/mobile.md` — responsive chart adaptation, touch targets, bottom sheets
