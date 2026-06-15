---
type: knowledge
purpose: "UI component library and patterns for data content websites"
domain: data-content
topic: components
description: Data Content domain components — visualization catalog, data tables, metric displays, narrative elements, interactive components, and ESG-specific patterns.
---
Follow §Communication Rules from agent.md
# Data Content: Component Library

Domain knowledge for data-heavy content sites (reports, dashboards, infographics, data stories).
Part of: references/domains/data-content/

**Source of Truth** for visualization selection, table design, metric display, narrative structure, and interactive data patterns.

---

## 1. Data Visualization Catalog

**Goal:** Provide a task-first chart selection reference. Every chart type maps to a specific communication task — never choose by aesthetics alone.

### Chart Type Reference

| Type | Best For | Key Rules |
|------|----------|-----------|
| **Bar (vertical)** | Compare values across few categories (≤12) | Y-axis starts at zero; direct-label when ≤6 bars; sort by value unless natural order exists (time, rank) |
| **Bar (horizontal)** | Compare values when category labels are long | Left-align labels; sort descending from top; preferred when labels exceed 3 words |
| **Line** | Show trends over continuous time series | ≤5 series per chart; direct-label at line ends; use consistent time intervals on x-axis |
| **Pie / Donut** | Part-to-whole with 2-5 segments | Always label slices directly with percentage + value; order largest first clockwise from 12 o'clock; donut preferred (center for total/label) |
| **Stacked bar** | Part-to-whole composition across categories | Limit to 3-5 segments; order by size (largest at base); only baseline segment allows precise reading |
| **Area (stacked)** | Show volume composition change over time | Use for broad trends, not precise comparison; avoid overlapping (non-stacked) area charts — occlusion misleads |
| **Scatter** | Show relationship between two continuous variables | Label outliers directly; add trend line only when statistically meaningful; ≤200 points before overplotting |
| **Heat map** | Pattern detection across a two-dimensional matrix | Use sequential palette (light-to-dark); switch text color at darkness threshold for contrast; reserve for dense matrices (≥5×5) |
| **Treemap** | Hierarchical part-to-whole with many categories | Label top-level rectangles; use color for secondary dimension only; not for precise comparison — area perception is weak |
| **Waterfall** | Explain net change as sequential positive/negative steps | Color-code increases (green/blue) vs decreases (red/orange); label each step; show running total at top of each bar |
| **Gauge / Meter** | Single KPI against a target or range | Show actual value as number (never rely on needle position alone); define green/yellow/red zones explicitly; limit to 1-3 per view |
| **Sparkline** | Inline trend within a table row or KPI card | No axes, no labels — context comes from surrounding content; all sparklines in a column must share y-scale |
| **Sankey / Flow** | Show flow volumes between stages or categories | Limit to 3-5 stages and ≤15 flows; use proportional width; label flows with values at start/end |
| **Map (choropleth)** | Geographic distribution of a single variable | Use sequential or diverging palette; include legend with clear breakpoints; normalize by population/area when comparing regions |
| **Bullet** | Compare actual value to target within compact space | Replaces gauges in dense dashboards; show qualitative ranges (poor/satisfactory/good) as background bands |
| **Small multiples** | Compare patterns across many groups (>4 series) | Identical chart type, scale, and axes in every panel; sort panels by meaningful metric; suppress redundant axis labels |
| **Slope chart** | Two-point comparison (before/after, start/end) | Connect paired values with angled lines; highlight rank changes or magnitude shifts; ideal for showing change direction across many items simultaneously |
| **Lollipop chart** | High-precision comparison across many categories | Dot-on-stick replaces bar — reduces visual weight while preserving position-based accuracy; preferred when >10 categories would create heavy bar fill |

### Visual Anti-Patterns

* ❌ **3D charts** — distort area/angle perception; never use in any context
* ❌ **Dual Y-axes** — force artificial visual correlation; use indexed series or small multiples instead. Allow only with explicit documented justification, clear labeling, and after rejecting alternatives
* ❌ **Truncated axes** — bars or area charts with non-zero baselines exaggerate differences; line charts may start above zero only when the baseline is clearly labeled and context is preserved
* ❌ **Rainbow/spectral color scales** — lack perceptual uniformity (yellow appears brighter than blue, creating false emphasis); use Viridis, Cividis, or Magma instead
* ❌ **Chart junk** — shadows, textures, decorative elements, thick gridlines, background fills; remove everything that does not encode data
* ❌ **Color-only differentiation** — never use color as the sole distinction between categories; always pair with position, shape, pattern, or direct text labels

### Analytical Integrity

Structural correctness (axis from zero, no 3D) is necessary but insufficient. A study of 10,000 visualizations found 84% of misleading posts used correctly plotted charts to support flawed reasoning. The agent must enforce analytical honesty alongside visual honesty.

1. **Do not cherry-pick timeframes.** Show the full available time range; if zooming in, display the zoomed segment in context (inset or note stating full-range trend). Selectively adjusting start/end dates to support a narrative is deceptive even with correct chart mechanics.
2. **Show full context for comparisons.** When comparing two groups, include the relevant baseline, population size, or denominator. A 50% increase from 2 to 3 tells a different story than 50% increase from 200,000 to 300,000.
3. **Correlation does not imply causation.** When displaying scatter plots or overlaid time series, explicitly state whether the relationship is correlational. Never use visual proximity of two trend lines to imply a causal link without supporting evidence.
4. **Justify reference lines and thresholds.** Every horizontal or vertical reference line (target, benchmark, threshold) must have a stated source. Arbitrary lines create false standards — "above the line = good" is meaningless without context for where the line was drawn and why.
5. **Label uncertainty and confidence.** Use shaded confidence bands, dashed projections, or explicit margin-of-error labels. When data is estimated, modeled, or preliminary, state this adjacent to the visualization — not buried in footnotes.
6. **Do not hide unfavorable data.** All relevant data points must appear. Omitting data that contradicts the narrative (filtering out months, excluding categories) is the most common form of visual deception.
7. **Distinguish cumulative from periodic.** Always label whether a metric shows the period value or running total. Cumulative charts always rise — which makes any metric look like growth even when period-over-period values are declining.

---

## 2. Data Tables

**Goal:** Enable lookup, comparison, exploration, and structural understanding of tabular data. Tables are the most information-dense component — every design choice must reduce scanning effort.

### Anatomy

* **Sortable column headers** — clicking a header sorts ascending/descending; active sort column shows a directional indicator (arrow); default sort reflects the most common lookup task (e.g., alphabetical for names, descending for values)
* **Sticky headers** — column headers remain visible during vertical scroll; critical when table exceeds viewport height; header row uses slightly heavier background (not bold text alone) to remain distinguishable
* **Frozen identifier column** — first column (entity name/ID) stays pinned during horizontal scroll; applies when table has more columns than viewport width accommodates
* **Row grouping** — group rows by a natural categorical dimension when table exceeds ~20 flat rows; provide group headers with distinct typographic weight (semibold) and optional subtotals; collapsible groups reduce visual overwhelm for large datasets
* **Zebra striping** — use subtle alternating row backgrounds only for wide tables (>6 columns) where horizontal eye-tracking across many columns is needed; for narrow tables, sufficient whitespace between rows is clearer
* **Heat-map cell coloring** — apply sequential color fill to numeric columns where the primary task is pattern detection (spot highs/lows across a matrix); switch text from dark to light when background crosses a darkness threshold; limit to 1-3 columns per table — coloring every column creates visual noise
* **Sparklines in cells** — embed inline sparklines in a dedicated column to show each row's trend over time; all sparklines must share a common y-scale; pair with the current value in an adjacent column for exact reading
* **In-cell bar charts** — horizontal proportional bars within cells for instant max/min scanning; use a single muted color; keep bar width proportional to cell width
* **Summary row** — pin a totals/averages row at the bottom (or top for dashboards) with distinct styling (heavier font weight, top border); include only aggregations that are mathematically meaningful (summing percentages is not)
* **Column pinning** — allow users to pin comparison columns next to the identifier column; reduces horizontal scrolling for wide datasets with many attributes
* **Density toggle** — provide "Comfortable" (16-20px row padding) and "Compact" (8-12px) modes; default to Comfortable for report tables, Compact for analytical dashboards

### Pagination vs. Virtual Scroll

| Pattern | Use When |
|---------|----------|
| **Pagination** | Published report tables — supports stable page references, citation, predictable scanning; default for print/PDF and content sites |
| **Bounded scroll region** | Table is secondary and narrative context must not be broken by page changes |
| **Virtual rendering** | Very large datasets (>500 rows) in web-first products; must show row count indicator and "where am I?" position cue; never for print |

### Typography Rules

| Element | Alignment | Notes |
|---------|-----------|-------|
| Numeric values | Right-aligned | Aligns decimal places for vertical comparison |
| Text / categorical | Left-aligned | Matches reading direction |
| Column headers | Match their data's alignment | Maintains visual association |
| Currency | Right-aligned, consistent decimal places | Align on decimal point across all rows |

Use **tabular lining figures** (monospaced numbers) — never proportional figures. Round to meaningful precision; excessive decimals add noise without value.

### Anti-Patterns

* ❌ Heavy gridlines on all sides (Tufte: remove borders, use whitespace)
* ❌ Center-aligning numeric columns (breaks vertical scanning)
* ❌ Heat-map coloring on every column (visual overload)
* ❌ Sparklines with inconsistent y-scales across rows (misleading comparison)
* ❌ Zebra striping on 3-4 column tables (unnecessary visual complexity)
* ❌ Pagination with no sort/filter controls (forces sequential scanning for lookup tasks)
* ❌ Summary rows that sum percentages or averages (mathematically meaningless)

---

## 3. Key Metric Components

**Goal:** Make critical numbers instantly readable. Metrics are the first thing stakeholders scan — they must answer "how are we doing?" in under 3 seconds.

### 3.1 KPI Card

**Goal:** Display a single key performance indicator with context for direction and magnitude of change.

#### Anatomy

* **Primary number** — large-format (32-48px web, 18-24pt print), bold weight, positioned as the dominant visual element
* **Metric label** — short descriptor below or above the number ("Revenue", "Active Users", "Conversion Rate"); plain language, not database field names
* **Trend indicator** — directional arrow (up/down/flat) with percentage or absolute change and comparison period ("vs. last quarter"); color-code only when polarity is unambiguous (green = good for revenue; but green = bad for churn increase — map color to business meaning, not direction)
* **Sparkline** (optional) — inline trend below the number for temporal context; same y-scale across all KPI cards in a row
* **Comparison baseline** — state what the number is compared against: prior period, target, forecast, or peer benchmark; without a baseline, a number has no meaning
* **Status indicator** (optional) — dot or badge: on-track / at-risk / off-track; based on defined thresholds, not arbitrary coloring

#### Anti-Patterns

* ❌ Numbers without context (a standalone "4,328" means nothing without label, period, and direction)
* ❌ Color-coding direction without considering polarity (green "up" arrow on cost increases)
* ❌ More than 5 KPI cards in a single row (dilutes scanning; group into primary and secondary tiers)
* ❌ Using KPI cards for non-metric content (paragraphs in card containers)

### 3.2 Metric Hero

**Goal:** Provide a scannable headline-metrics bar across the top of a report or dashboard page.

#### Anatomy

* **3-5 headline metrics** in a horizontal row spanning full content width
* Each metric follows the KPI Card anatomy (number + label + trend + comparison)
* **Visual hierarchy**: leftmost metric is the primary KPI; remaining metrics provide supporting context
* **Responsive behavior**: stack vertically on mobile (single column); never shrink to illegible sizes
* **Section anchor**: the metric hero establishes the "thesis statement" of the page — every subsequent visualization should explain or decompose these numbers

#### Anti-Patterns

* ❌ More than 5 metrics (forces user to parse rather than scan)
* ❌ All metrics at equal visual weight (no hierarchy signals which is primary)
* ❌ Metrics that don't connect to the content below (orphaned numbers)

### 3.3 Data Callout

**Goal:** Pull a single striking number out of surrounding text to create emphasis — the data equivalent of a pull quote.

#### Anatomy

* **Large-format number** — 2-4x the body text size, bold or colored
* **One-sentence context** — immediately adjacent, explains what the number means and why it matters
* **Source reference** — inline citation or footnote linking to the underlying data
* **Placement** — float alongside body text (margin callout) or centered between text blocks as a visual pause

#### Anti-Patterns

* ❌ Callout without explanatory sentence (number without meaning)
* ❌ More than 2 data callouts per page section (dilutes emphasis)
* ❌ Callout numbers that contradict or don't appear in nearby text (dissonance)

### 3.4 Comparison Pair

**Goal:** Show before/after or A-vs-B side-by-side to make change magnitude immediately apparent.

#### Anatomy

* **Two values** displayed side-by-side with a connecting visual element (arrow, line, delta badge)
* **Labels** — clear "Before" / "After" or "2024" / "2025" or entity names
* **Delta display** — show the difference (absolute and/or percentage) between the two values, positioned between them or below
* **Directional color** — use polarity-aware color (green/red mapped to business meaning, not raw direction)
* **Scale consistency** — if using visual bars or proportional sizes, both values must share the same scale

#### Anti-Patterns

* ❌ Comparison pairs with different units or timeframe lengths (misleading delta)
* ❌ Showing only the delta without the actual values (loss of magnitude context)
* ❌ More than 3 comparison pairs in sequence (use a table or slope chart instead)

### 3.5 Progress Indicator

**Goal:** Show current value against a defined target or goal.

#### Anatomy

* **Progress bar or arc** — filled portion represents current value as proportion of target; label with both actual value and percentage
* **Target marker** — clearly positioned endpoint or reference line
* **Threshold zones** (optional) — color bands for on-track / at-risk / critical ranges; define thresholds explicitly
* **Time context** — state the period and how much time remains ("Q3 target: 72% reached, 6 weeks remaining")
* **Overshoot handling** — when value exceeds target, show the excess visually (extended bar past the 100% mark or separate "above target" label)

#### Anti-Patterns

* ❌ Progress indicator without stating the target value (bar at 60% of what?)
* ❌ Circular gauges for non-percentage metrics (angle perception is weak)
* ❌ Multiple competing progress indicators without clear grouping

---

## 4. Narrative Components

**Goal:** Bridge the gap between raw data and reader understanding. Data without narrative is a reference table; narrative without data is opinion. These components fuse both.

### 4.1 Insight Annotation

**Goal:** Attach explanatory context directly to a data point within a visualization.

#### Anatomy

* **Anchor point** — the specific data element (bar, point, segment) being annotated
* **Connector** — subtle line or arrow from the annotation to the anchor; no heavy graphical treatment
* **Annotation text** — 1-2 sentences explaining what happened and why it matters; uses takeaway language, not axis descriptions ("Sales dropped 18% when the supplier contract expired" not "Q3 value is 820")
* **Visual treatment** — muted background card or open text; must not obscure adjacent data
* **Placement priority** — (1) right of anchor, (2) above, (3) left, (4) below; avoid overlapping other data marks

#### Anti-Patterns

* ❌ Annotations hidden behind hover/tooltip only (invisible on print, mobile, screen readers)
* ❌ More than 3 annotations per chart (visual clutter; curate to the most important insights)
* ❌ Generic annotations ("note the increase here") that add no explanatory value
* ❌ Annotation text that competes with the chart title for the main takeaway

### 4.2 Data Story Section

**Goal:** Pair narrative text with a visualization so each explains the other — the fundamental unit of data storytelling.

#### Anatomy

* **Takeaway title** — a complete sentence stating the insight the visualization supports ("Customer acquisition cost doubled after the algorithm change")
* **Visualization** — single chart or small multiple directly below or beside the title
* **Narrative paragraph** — 2-4 sentences interpreting the visualization: what the reader should notice, what caused the pattern, what it implies
* **Source note** — data provenance, date range, methodology reference
* **Sequencing** — sections follow the storytelling arc: overview first, then drivers/decomposition, then segmentation

#### Anti-Patterns

* ❌ Chart placed without adjacent explanatory text (reader must interpret alone)
* ❌ Narrative text that restates data already visible in the chart ("the bar shows 42%") instead of interpreting it
* ❌ Disconnected title — descriptive label ("Revenue by Quarter") instead of takeaway sentence

### 4.3 Chapter Navigation

**Goal:** Help readers orient within long data reports (20+ pages or scroll-equivalent) and move between sections efficiently.

#### Anatomy

* **Table of contents** — persistent or accessible sidebar/header listing all chapters with current-chapter highlighting
* **Progress indicator** — visual cue showing position within the full report (progress bar, "Section 3 of 8", or scroll-progress indicator)
* **Section selector** — direct navigation to any chapter without sequential scrolling; dropdown or sidebar links
* **Chapter headers** — consistent typographic treatment (H2 level) with section numbers; each chapter starts with a 1-2 sentence summary of findings
* **Breadcrumb trail** (optional for web) — show position in hierarchy for nested report structures

#### Anti-Patterns

* ❌ No navigation for reports exceeding 5 sections (readers lose context and abandon)
* ❌ Progress indicator that counts pages instead of sections (pages are irrelevant to the reader's mental model)
* ❌ Navigation that disappears on scroll (defeats the purpose)

### 4.4 Executive Summary Block

**Goal:** Deliver the report's key findings in a scannable format for readers who will not read the full document (which is most readers).

#### Anatomy

* **3-5 key findings** — each as a single sentence with the most important number bolded; ordered by importance, not report sequence
* **Recommendation line** (optional) — one sentence per finding stating the implied action
* **Visual accent** — numbered list or icon markers for scannability; avoid dense paragraphs
* **Link to detail** — each finding links to its corresponding chapter/section for readers who want to go deeper
* **Position** — always first content after title page / header; before the table of contents

#### Anti-Patterns

* ❌ Executive summary that exceeds one page/viewport (it becomes a report, not a summary)
* ❌ Findings stated as neutral descriptions ("Revenue was X") instead of directional insight ("Revenue declined 12% due to X, requiring action on Y")
* ❌ No link between summary findings and detailed sections (summary as dead end)

### 4.5 Methodology Note

**Goal:** Provide transparency about data collection, processing, and limitations — essential for credibility in any published report.

#### Anatomy

* **Collapsible section** — expanded on demand, collapsed by default; must be accessible from every page/section that references data
* **Contents** — data sources and collection dates, sample size and selection method, calculation methodology for derived metrics, known limitations and caveats, confidence levels where applicable
* **Plain language** — write for the non-specialist reader; link to technical appendix for methodological details
* **Persistent access** — footer link, sidebar link, or icon that appears alongside every visualization; never buried only in an appendix

#### Anti-Patterns

* ❌ No methodology section at all (undermines credibility)
* ❌ Methodology visible only in a final appendix (readers who need it cannot find it when encountering a specific chart)
* ❌ Overly technical language without a plain-language summary

### 4.6 Appendix Section

**Goal:** Provide the detailed data, extended tables, and supplementary analysis behind the main report's curated narrative.

#### Anatomy

* **Detailed data tables** — full datasets that were summarized or visualized in the body; sortable and downloadable
* **Extended methodology** — technical details, statistical tests, formulas, model parameters
* **Supplementary visualizations** — charts that provide additional angles but were not essential to the main narrative
* **Glossary** — definitions for domain-specific terms used in the report
* **Clear cross-references** — every appendix item states which body section it supports ("See Section 3.2 — Customer Segmentation")

#### Anti-Patterns

* ❌ Appendix that duplicates body content exactly (wastes reader time)
* ❌ No cross-referencing between body and appendix (appendix becomes an orphan)
* ❌ Critical findings appearing only in the appendix (essential insights belong in the body)

---

## 5. Interactive Components

**Goal:** Layer interactivity onto the static-first foundation to reduce clutter, support exploration, and enable personalization — but only when it adds clear value over static presentation.

Every interactive component below includes a static fallback. The static version must be fully functional and understandable without JavaScript.

### 5.1 Filter Rail

**Goal:** Let users narrow large datasets by entity, time period, demographic, or other dimensions without creating separate views for each combination.

#### Anatomy

* **Filter bar position** — horizontal above the content area or vertical sidebar; always visible (not hidden behind a "Filters" button)
* **Multi-select controls** — dropdowns, chip selectors, or checkbox groups for categorical dimensions; date range picker for temporal filtering
* **Active filter display** — show applied filters as removable chips/tags so the user always knows the current view state
* **Result count** — update a visible count ("Showing 342 of 1,247 records") whenever filters change
* **Reset control** — prominent "Clear all filters" action accessible at all times
* **URL state sync** — filter selections encoded in URL parameters for sharing and bookmarking specific views

**Web-only enhancement.** Static fallback: pre-filtered small multiples showing the 3-5 most important segment views, with a note that the interactive version supports custom filtering.

#### Anti-Patterns

* ❌ Filters hidden behind a toggle button (users don't know filtering is available)
* ❌ No indication of active filters (users forget they've narrowed the view and misinterpret "missing" data)
* ❌ Filter changes that trigger full page reload instead of updating in place

### 5.2 Multi-View Toggle

**Goal:** Allow the same dataset to be viewed through different lenses (chart, map, table) without navigating away.

#### Anatomy

* **Toggle bar** — segmented control or tab group: Chart | Map | Table (or relevant subset)
* **Shared data state** — all views reflect the same filters, sort order, and selections; switching views does not reset user state
* **Transition behavior** — instant swap (no loading spinner for pre-rendered views); if rendering is heavy, show skeleton state
* **Default view** — the most informative view for the primary task is shown first; toggle exists for alternative perspectives
* **Accessibility** — toggle implemented as `role="tablist"` with keyboard arrow-key navigation between options

**Web-only enhancement.** Static fallback: display the primary view (usually chart or table) in the body; note alternative views in a sidebar or appendix ("See Table A3 for the full dataset" or "See Map view in the interactive version").

#### Anti-Patterns

* ❌ Forcing users to switch views to access essential information (each view must be self-sufficient for its task)
* ❌ Toggle that resets filters or scroll position on switch
* ❌ More than 4 view options (decision paralysis; curate the useful perspectives)

### 5.3 Animated Counter

**Goal:** Draw attention to key metrics through motion when the number first enters the viewport — a micro-delight that signals "this number matters."

#### Anatomy

* **Trigger** — scroll-triggered: animation starts when the counter element enters the viewport (IntersectionObserver)
* **Animation** — count-up from zero (or a contextual base) to the final value over 1-2 seconds; use easing (ease-out) so the count decelerates as it approaches the target
* **Final state** — after animation completes, the number remains static and fully readable; no looping
* **Reduced motion** — respect `prefers-reduced-motion: reduce`: show the final number immediately without animation
* **Screen reader** — `aria-live="polite"` announces the final value; animation is purely visual

**Web-only enhancement.** Static fallback: display the final number directly with no animation. The number's visual treatment (size, weight, color) must be sufficient emphasis without motion.

#### Anti-Patterns

* ❌ Counters that animate on every scroll past (re-triggering is distracting)
* ❌ Count-up duration exceeding 2 seconds (impatience)
* ❌ Counters on more than 5 numbers per page (if everything animates, nothing stands out)
* ❌ Animation without `prefers-reduced-motion` fallback (accessibility violation)

### 5.4 Deep-Link / Share

**Goal:** Allow users to share a specific state of the report (section, filter combination, view mode) via URL.

#### Anatomy

* **URL-fragment state mapping** — each section, active filter set, and view toggle encoded as URL hash parameters (e.g., `#section=revenue&period=2025-Q3&view=chart`)
* **Share button** — copies the current-state URL to clipboard with a confirmation toast ("Link copied")
* **Restore behavior** — opening a shared URL restores the exact state: section scroll position, active filters, selected view
* **Social/embed meta** — Open Graph tags updated dynamically to reflect the shared state's title and summary (for link previews)

**Web-only enhancement.** Static fallback: section anchors with clear section numbers; PDF version includes page numbers in the table of contents and cross-references.

#### Anti-Patterns

* ❌ Share button that copies the base URL without state (recipient sees default view, not the shared insight)
* ❌ State encoded in session storage instead of URL (not shareable or bookmarkable)
* ❌ Hash parameters that break on page reload

---

## 6. ESG-Specific Conditional Components

> **Conditional loading trigger:** Load when the report involves ESG, sustainability, CSR, or impact reporting. These components address the unique requirements of Environmental, Social, and Governance disclosures.

### 6.1 Interactive Materiality Matrix

**Goal:** Display the organization's material ESG topics positioned by stakeholder importance and business impact — the central decision artifact in any sustainability report.

#### Anatomy

* **Scatter/bubble plot** — topics plotted on two axes: X = business impact (financial materiality), Y = stakeholder importance (impact materiality); bubble size optionally encodes a third dimension (e.g., current performance or investment level)
* **Quadrant labels** — clearly label the four quadrants: High Impact + High Importance (priority topics), Low Impact + High Importance (stakeholder focus), High Impact + Low Importance (business focus), Low Impact + Low Importance (monitor)
* **Topic labels** — every bubble is directly labeled with the topic name (no legend-only approach); for dense matrices, use interactive hover expansion for full topic names but show abbreviations statically
* **Filter rail integration** — allow filtering by ESG pillar (Environmental / Social / Governance), by stakeholder group, or by reporting standard (GRI, SASB)
* **Detail panel** — clicking/tapping a topic bubble opens a side panel or modal with: topic description, related GRI/SASB indicators, current performance data, targets, and link to the relevant report section
* **Deep-linking** — each topic has a unique URL fragment for direct sharing ("See our position on Water Stewardship")
* **Axis methodology note** — collapsible note explaining how impact and importance scores were derived (survey methodology, weighting, sample)
* **Year-over-year comparison** (optional) — toggle to show prior-year positions as ghost dots with movement arrows

**Web-only enhancement.** Static fallback: labeled scatter plot image with quadrant annotations; detail information presented in an adjacent reference table listing all topics with their impact/importance scores and page references.

#### Anti-Patterns

* ❌ Materiality matrix without axis methodology (scores appear arbitrary)
* ❌ Unlabeled or legend-only bubbles (readers cannot identify topics without hovering)
* ❌ Using bubble size for a critical variable (area perception is imprecise — encode critical dimensions on position axes)
* ❌ No connection between matrix topics and report sections (the matrix becomes decorative)

### 6.2 GRI/SASB Interactive Index

**Goal:** Map reporting standard indicators to report sections, enabling auditors, analysts, and stakeholders to verify compliance and locate specific disclosures quickly.

#### Anatomy

* **Standard-to-section mapping table** — rows: standard indicators (GRI 302-1, SASB IF-EU-110a.1, etc.); columns: indicator description, report section reference, page/link, compliance status
* **Color-coded status** — fully reported (green), partially reported (yellow/amber), not applicable with explanation (gray), omitted with justification (red); always pair color with text label or icon for accessibility
* **Search and filter** — text search across indicator codes and descriptions; filter by standard (GRI / SASB / TCFD / CSRD), by ESG pillar, by compliance status
* **Clickable section links** — each row links directly to the report section where the disclosure appears; for web, smooth-scroll to section; for PDF, page number reference
* **Standard version indicator** — clearly state which version of each standard is being referenced (e.g., "GRI Standards 2021", "SASB — Utilities & Power Generators")
* **Export** — downloadable CSV/Excel of the full index for auditor workflows

**Web-only enhancement.** Static fallback: formatted table with standard code, description, section reference, page number, and status text — fully functional without interactivity. Color-coding replaced by text status labels in print.

#### Anti-Patterns

* ❌ Index that lists indicators without section links (defeats the navigation purpose)
* ❌ Color-only status coding without text labels (inaccessible and ambiguous in print)
* ❌ Missing version references for standards (different versions have different indicator sets)
* ❌ Index buried in the appendix with no link from the main navigation (compliance reviewers need fast access)

---

## See Also

- `shared/composition.md` — layout grids, eye-tracking patterns, dashboard composition limits
- `shared/conversion.md` — CTA placement, engagement patterns for content sites
- `shared/forms.md` — filter controls, search patterns, progressive disclosure
- `shared/accessibility.md` — WCAG chart requirements, alt text structure, contrast ratios, keyboard navigation
- `shared/mobile.md` — responsive table patterns, touch targets, sparkline legibility at small sizes
