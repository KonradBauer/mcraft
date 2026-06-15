---
type: knowledge
purpose: "Audience profiles and user needs for data content websites"
domain: data-content
topic: audience
description: Data Content domain audience — reader personas and consumption models for data-heavy reports, dashboards, and data stories.
---
# Data Content: Audience Personas & Consumption Models

Domain knowledge for data-heavy report sites, published dashboards, and data stories.
Part of: references/domains/data-content/

---

## Consumption Model: Scan-Evaluate-Dive-Act-Return

Data content visitors do not follow a linear reading path. They operate on a non-linear consumption arc driven by information need and time pressure:

| Stage | Reader State | Primary Need | Design Response |
|---|---|---|---|
| **Scan** | "Is this relevant to me?" | Fast signal: title, KPI tiles, executive summary | Front-load key findings; big-number tiles above fold; clear topic framing |
| **Evaluate** | "Is this credible and current?" | Source, methodology, date, authorship | Visible provenance block; update timestamps; institutional branding |
| **Deep-Dive** | "Show me the evidence" | Tables, charts, filters, raw data | Interactive charts with filter/drill; expandable methodology; downloadable datasets |
| **Act** | "I need to use this" | Export, cite, embed, share, decide | CSV/PNG download; embed codes; deep-link anchors; citation-ready metadata |
| **Return** | "Has anything changed?" | Deltas, updates, new data releases | "What's new" indicators; changelog; live vs archived embed options; email alerts |

Unlike e-commerce funnels, most data content readers enter at Scan and exit at Evaluate or Deep-Dive. Only a minority reach Act. Design for the majority (scanners) without penalizing the minority (power users who need full data access).

---

## Executive

**Need:** Decisions, not data. The executive wants the "so what" — conclusions, implications, recommended actions. Time budget: 60-90 seconds for an entire report.

**Behavior:** Reads the headline and executive summary. Scans KPI tiles for directional signals (up/down arrows, red/green deltas). Jumps to conclusions or recommendations section. Skips methodology, raw tables, and most body text entirely. May forward the report URL to a team member for deeper analysis.

**Design implications:**
- Place a self-contained executive summary within the first viewport — headline, 3-5 key findings as bullets or KPI cards, and a one-sentence conclusion
- Use YoY delta indicators (arrows, color-coded percentage changes) on every metric tile so direction is visible without reading context
- Provide a "Jump to Conclusions" anchor in the sticky navigation
- Keep the summary comprehensible without scrolling past the fold on desktop
- Deep-link sharing: executives forward specific sections, so every heading needs a stable URL fragment

---

## Analyst / Researcher

**Need:** Raw data access, methodological transparency, and the ability to reproduce or extend findings. The analyst treats the report as a data source, not a narrative.

**Behavior:** Skips the summary. Goes directly to methodology and data tables. Filters, sorts, and cross-references metrics. Downloads CSV/Excel files. Checks sample sizes, confidence intervals, date ranges, and variable definitions. Compares current data against prior releases. May spend 20-40 minutes on a single chart if filters are available.

**Design implications:**
- Every chart must offer a Table view toggle (chart/map/table, following the OWID Grapher pattern) so analysts can inspect exact values
- Provide CSV and Excel download for every dataset, not just the full report — per-chart granularity matters
- Methodology must be accessible but not obstructive: expandable "How we measured this" panels adjacent to each chart, plus a consolidated methodology page
- Include data dictionaries: variable names, units, collection method, date range, known limitations
- Show confidence intervals or margins of error where applicable — omitting them signals low rigor to this audience
- Support filtered deep-links so analysts can share a specific data view (country + metric + time range encoded in URL)

---

## Journalist / Content Creator

**Need:** Quotable facts, embeddable visuals, and citation infrastructure. The journalist is writing their own story and needs the report to supply evidence — fast, attributable, and visually ready.

**Behavior:** Scans for a single compelling statistic or trend to anchor their story. Looks for pre-made shareable charts (PNG, SVG, or embed code). Checks whether data can be downloaded as CSV for independent verification or custom visualization. Needs deep-links to cite specific claims. Seeks a press contact or media kit. Rarely reads the full report — enters via search or social link to a specific section.

**Design implications:**
- Provide an embed system with two modes: live embeds (auto-updating, for ongoing coverage) and archived embeds (frozen snapshot, for published articles that must not change post-publication)
- Offer one-click chart image download (PNG with attribution watermark) and CSV data download per chart
- Include a "Key findings" section written in quotable, plain-language sentences — not jargon-heavy academic prose
- Every data claim must be deep-linkable: stable URL fragments for sections, and ideally for individual chart states (filters applied)
- Add a press/media section or at minimum a contact email for data inquiries
- Provide citation metadata: suggested citation format, DOI or permanent URL, publication date, authors
- Consider Open Graph and Twitter Card meta tags with chart preview images for social sharing

---

## General Public

**Need:** Understanding without expertise. The general public reader arrives via social media, search, or a news link. They lack domain vocabulary and statistical literacy. They need the report to explain itself.

**Behavior:** Reads headlines and looks at visuals. Stops reading if confronted with unexplained jargon, dense tables, or acronyms. Engages most with visual explanations — annotated charts, illustrated comparisons, physical metaphors ("the size of X football fields"). Spends 30-90 seconds before deciding whether the content is "for them." Will not download data or read methodology.

**Design implications:**
- Write all headlines and key findings in plain language (Flesch-Kincaid grade 8 or lower for summary content)
- Annotate every chart: title that states the takeaway (not just the topic), axis labels in plain units, highlighted data points with callout text
- Replace jargon with inline definitions or glossary tooltips on first use — do not assume familiarity with terms like "YoY," "CAGR," "median," or domain-specific acronyms
- Use visual explanations: annotated chart walkthroughs, comparison metaphors, color-coded scales with legend text
- Provide a "What this means" plain-language paragraph after every data section
- Limit initial data density: show a simple trend line by default, with "Show more detail" progressive disclosure for those who want it
- Mobile-first layout for this audience — they arrive via social links on phones

---

## Stakeholder / Investor

**Need:** Financial performance metrics, benchmarks against peers or targets, and trend direction. The investor reads data content to inform capital allocation decisions or monitor portfolio positions.

**Behavior:** Goes straight to financial metrics: revenue, margins, EPS, EBITDA, growth rates. Looks for YoY and QoQ comparisons. Seeks peer benchmarking or industry-average context. Downloads financial statements and presentations. Checks for forward-looking guidance or forecasts. Scans ESG/sustainability metrics if relevant to investment thesis. Expects a download center with structured documents (PDF, Excel, XBRL).

**Design implications:**
- KPI tiles must include: absolute value, period (Q/Y), delta vs prior period, delta vs target or benchmark — all visible without interaction
- Provide segment breakdowns (by business unit, geography, product line) with drill-down capability
- Include a quarterly trend view (8-quarter rolling minimum) for every key metric, using sparklines or mini area charts
- Offer a dedicated download center: financial statements, earnings presentations, transcripts, SEC/regulatory filings, Excel data packs
- Support tabbed views switching between annual and quarterly perspectives
- If the report covers ESG: link ESG metrics to financial materiality (double materiality framing) so investors can assess impact on valuation
- Calendar module: upcoming earnings dates, investor days, report release schedule

---

## Knowledge Worker

**Need:** Context and mental models. The knowledge worker reads to understand a domain — to build a working mental model they can apply in their own work (consulting, policy, education, internal strategy). They value explanation over raw data.

**Behavior:** Reads the full narrative, not just the summary. Pays attention to causal explanations, frameworks, and "why" sections. Bookmarks sections for later reference. Follows internal cross-references and related content links. May read the methodology to understand analytical approach, not to verify it. Returns to the same report multiple times over weeks. Spends 5-15 minutes per visit.

**Design implications:**
- Invest in explanatory narrative between charts: "why this matters," "what drives this trend," "how to interpret this pattern"
- Provide context around every metric: historical baseline, comparison benchmark, or "typical range" framing so the reader can calibrate meaning
- Use chapter-based navigation with a persistent ToC and "you are here" indicator — this reader navigates non-linearly across visits
- Support "Continue where you left off" via local storage bookmark or explicit section-level bookmarking
- Cross-link related topics and reports — the knowledge worker's consumption is not bounded by a single report
- Include "Key takeaways" boxes at the end of each section for scannable re-entry on return visits
- Deep-link anchors on every heading for personal note-taking and sharing specific sections

---

## Auditor / Compliance Reviewer

**Need:** Verification of claims against standards frameworks (GRI, SASB, TCFD, ESRS, SDGs). The auditor reads to confirm that disclosures are complete, consistent, and traceable to source data. This is a professional obligation, not casual reading.

**Behavior:** Navigates via the GRI/SASB content index, not the report's narrative structure. Checks each disclosure against standard requirements: is the metric present, is the methodology documented, is the boundary defined, is the data assured. Follows deep-links from the index to specific disclosure sections. Verifies consistency between data in different report sections (e.g., emissions figure in the summary vs the detailed environmental section). Downloads the full report PDF for archival and annotation. Checks for third-party assurance statements.

**Design implications:**
- Provide an interactive standards index (GRI, SASB, ESRS) where each row links directly to the disclosure section in the report — never a static table with page numbers
- Every disclosure section must include: metric value, reporting boundary, methodology description, data period, assurance status, and link to assurance statement if applicable
- Support deep-linking to individual disclosures so auditors can reference specific items in their working papers
- Include a methodology transparency page with: data collection process, calculation methods, restatements from prior periods, known limitations
- Offer a "Data assurance" section listing: scope of assurance, assurance provider, level of assurance (limited vs reasonable), and link to the assurance letter
- Dual publishing (web + PDF) is mandatory for this audience — auditors need a fixed, non-changing document for their records alongside the navigable web version
- Maintain version history: if data is restated or corrected, show the change log with timestamps and rationale

---

## Cross-Persona Navigation Priorities

Different personas enter and navigate the same report through fundamentally different paths. The navigation system must serve all of them without forcing any persona through another's preferred flow.

| Persona | Entry Point | Primary Navigation | Exit Action |
|---|---|---|---|
| Executive | Homepage / email link | Summary > Conclusions | Forward URL to team |
| Analyst | Search / direct link to data | Methodology > Tables > Filters | Download CSV |
| Journalist | Social / search to specific finding | Key findings > Charts > Embed | Copy embed code / download PNG |
| General Public | Social media link | Headline > Visual > "What this means" | Share on social |
| Stakeholder | IR page / email alert | KPIs > Segment data > Downloads | Download Excel / PDF |
| Knowledge Worker | Bookmark / related content link | ToC > Chapters > Cross-references | Bookmark for return |
| Auditor | Standards index link | GRI/SASB index > Disclosure sections | Download PDF + assurance letter |

**Design rule:** Never assume a single entry point. Every section must be comprehensible when accessed directly via deep-link, without requiring the reader to have consumed preceding sections.
