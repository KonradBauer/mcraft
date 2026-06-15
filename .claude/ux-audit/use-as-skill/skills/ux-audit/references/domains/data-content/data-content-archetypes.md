---
type: knowledge
purpose: "Site archetypes and reference examples for data content websites"
domain: data-content
topic: archetypes
description: Data Content domain archetypes — narrative styles and layout modifiers for data-heavy reports, dashboards, and data stories.
---
# Data Content: Narrative Archetypes

Domain knowledge for data-heavy content sites (reports, dashboards, data stories).
Part of: references/domains/data-content/

---

Archetypes define the dominant narrative strategy at the content-piece level — how data, text, and visuals relate to each other, what the reader's journey looks like, and which interaction contract governs the experience.

**These are CONTENT-LEVEL archetypes** (how a single report or data product is structured). They combine with a Layout Modifier axis (Story-First / Tool-First / Hybrid) that determines the balance of narrative control vs reader agency.

---

## Executive Summary

**Optimizes for:** Fast decision-making — busy stakeholders who need the conclusion first and evidence on demand.
**Best fit:** Annual reports, financial/IR reports, ESG/sustainability reports, benchmark reports — any content where the audience is time-constrained executives or board members.
**Sacrifices:** Narrative immersion. The reader gets outcomes before context, which weakens storytelling impact but maximizes utility.

**Site structure signal:**
- Opens with 3-5 KPI tiles (big number + YoY delta + sparkline) above the fold
- Executive narrative block: CEO letter or board reflection (text or embedded video)
- Chapter-based deep sections below, each with its own summary card on the landing page
- Persistent "Download full report (PDF)" CTA in header or sticky bar
- Dual publishing: web version for engagement, PDF for auditability and regulatory compliance
- Navigation: sticky ToC with progress bar, chapter jump links, "return to overview" affordance

**Default components:** KPI tiles with delta context, trend mini-charts, value creation model diagram, download center (PDF, financials, GRI/SASB index), chapter landing cards.

**Interaction contract:** Primarily static with progressive disclosure. Expand/collapse for methodology and definitions. Animated counters on scroll-enter for KPI tiles (with `prefers-reduced-motion` fallback showing final number immediately). Deep links per chapter and section for shareability.

---

## Scrollytelling

**Optimizes for:** Narrative comprehension of complex data — guiding the reader through a data-driven argument one step at a time.
**Best fit:** Data stories, infographics, survey results with narrative framing, ESG impact stories, campaign-style annual report sections.
**Sacrifices:** Reader agency. The author controls the sequence; exploration is deferred until after the narrative completes (unless using Hybrid modifier).

**Site structure signal:**
- Headline + dek hook, then immediately into scroll-driven sequence
- Post-scrollytelling summary block with methodology, data sources, downloads
- Optional "Explore the data yourself" breakout after narrative conclusion
- Progress indicator (step count or visual bar) to reduce abandonment

**Default components:** Sticky graphic canvas, step text blocks, progress/step indicator, post-narrative summary, methodology disclosure, share/embed controls.

**Interaction contract — sticky graphic + step text + state triggers:**
- Text column scrolls; opposite column holds a sticky graphic (chart, map, or video canvas) via CSS `position: sticky`
- Each text step maps to exactly one state transition in the graphic (highlight, filter, annotate, pan/zoom, swap view)
- State triggers fire on step enter via IntersectionObserver (Scrollama pattern); optional progress callbacks for smooth interpolation within a step
- Deep links map each step to a URL fragment for shareability
- "Skip to summary" link for returning readers

**Mobile fallback:** Graphic goes full-width sticky at viewport top; text steps scroll below. Touch targets minimum 44px. Heavy WebGL/video replaced with optimized image sequences. One screen = one thought.

**Variants:**
- **Side-by-side sticky (classic)** — graphic occupies 50-60% width on desktop; text in adjacent column. Best when chart changes incrementally.
- **Full-bleed overlay** — graphic fills viewport; text appears in translucent floating cards with contrast-safe scrims. Best for maps, 3D, simulations where the visual needs maximum canvas.
- **Stepper navigation** — explicit Next/Back buttons and step dots alongside scroll triggers. Superior for policy reports, education content, or when deterministic "jump to state N" navigation matters. Adds keyboard accessibility.

---

## Dashboard

**Optimizes for:** Reader-driven exploration — letting users filter, compare, and export data to answer their own questions.
**Best fit:** Data dashboards, benchmark reports, survey results (exploration mode), financial/IR data, living datasets that update over time.
**Sacrifices:** Narrative guidance. The reader must form their own questions; without scaffolding, this leads to "blank canvas paralysis."

**Site structure signal:**
- Filter rail (sidebar on desktop, bottom sheet on mobile) with multi-select controls
- Chart area with view toggle (Chart | Map | Table) for the same dataset
- Entity/region selector, time slider or date range picker
- Source attribution on chart, "Learn more about this data" methodology overlay
- Export controls: download CSV/PNG, embed code (live or archived), full-screen mode
- Definitions and caveats panel adjacent to or within the chart interface

**Default components:** Multi-view toggle, entity selector, filter rail, interactive chart canvas, source/methodology overlay, export/share bar (CSV, PNG, embed code), related topics links.

**Interaction contract:** Filter > View > Explain > Export loop (OWID Grapher model). All chart updates are asynchronous with smooth transitions. Zero-state avoidance: never show "No results" — offer broader suggestions. Deep-linking preserves filter state in URL for sharing specific views. Archived embeds for official reports; live embeds for living explainers.

---

## Chapter-Based Report

**Optimizes for:** Comprehensive coverage with orientation — long-form content (5,000+ words) that must be navigable, scannable, and deep-linkable.
**Best fit:** Whitepapers, benchmark reports, annual reports (web-native version), ESG/sustainability reports, any multi-section research document.
**Sacrifices:** Visual immersion. The structure prioritizes wayfinding and scanability over cinematic data presentation.

**Site structure signal:**
- Global navigation: sticky ToC button opening a drawer with chapter list and "you are here" highlight
- Chapter landing pages with short summary + subsection anchors
- Local navigation: mini-ToC at top of long sections, in-page jump links
- Progress bar anchored to top or side of screen
- Mixed media within chapters: charts, photos, pull quotes, video breathers between dense KPI blocks
- Recovery affordances: deep links per section, "continue where you left off" (local storage)

**Default components:** Sticky ToC with active state, chapter summary cards, progress bar, in-page anchor links, mixed-media content blocks (chart + annotation + takeaway), download center (section PDF, full report PDF).

**Interaction contract:** Primarily reading-oriented with orientation chrome. Shrinking header on scroll to preserve vertical space (especially mobile). Chapter transitions are page navigations or smooth scroll jumps. Each section is deep-linkable via URL fragment. Optional: micro-animations on KPI numbers (count-up on scroll-enter).

---

## Layout Modifier Axis: Story-First / Tool-First / Hybrid

Layout modifiers are orthogonal to archetypes — they describe the balance of author control vs reader agency within any archetype structure.

### Story-First

**Description:** The author controls the narrative sequence. Visuals are integrated as evidence supporting a written argument — "chart paragraphs" (chart + single takeaway + annotation) or scrollytelling sequences embedded in prose. Methodology and data sources appear near the end or in expandable "How we did this" panels.

**When to use:** The data supports a specific argument or finding. The audience needs guided interpretation. The goal is persuasion, education, or impact communication. Examples: data journalism features, ESG impact narratives, thought leadership whitepapers.

### Tool-First

**Description:** The reader drives exploration. The interface is organized around filters, selectors, and views rather than narrative prose. Content is modular (cards or panels), each self-contained with local interactions (hover, tabs, toggles). Explanation is contextual (tooltips, definition overlays) rather than linear.

**When to use:** The audience has specific questions to answer against the data. The dataset updates frequently. Multiple valid interpretations exist. Examples: election portals, forecast trackers, published dashboards, benchmark comparison tools, survey data explorers.

### Hybrid

**Description:** A narrative scrollytelling or chapter sequence punctuated by "sandbox" moments where readers interact with the underlying data before the narrative resumes. The story guides interpretation but the reader can verify claims against the data directly.

**When to use:** Trust and transparency matter (the audience may be skeptical). The data is rich enough to reward exploration but complex enough to need guided entry. Examples: investigative data journalism, ESG reports with interactive materiality matrices, annual reports with explorable KPI dashboards within chapter sections.

---

## Report Type Mapping

Which report types naturally align with which archetype and modifier combinations.

| Report type | Primary archetype | Typical modifier | Notes |
|---|---|---|---|
| Annual report | Executive Summary | Story-First | KPI-led, chapter structure; web + PDF dual publish |
| Whitepaper | Chapter-Based Report | Story-First | Argument-driven; deep sections with methodology |
| Data dashboard | Dashboard | Tool-First | Filter-explore-export loop; living data |
| Infographic | Scrollytelling | Story-First | Visual-dominant; vertical mobile-first layouts |
| Scrollytelling / Data story | Scrollytelling | Story-First or Hybrid | Sticky graphic + step text; sandbox breakouts if Hybrid |
| Survey results | Dashboard or Scrollytelling | Tool-First or Hybrid | Tool-First for exploration; Hybrid when narrative wraps findings |
| Benchmark report | Chapter-Based Report | Hybrid | Chapters with embedded comparison dashboards |
| ESG / sustainability report | Executive Summary | Hybrid | KPI summary + interactive materiality matrix exploration |
| Financial / IR report | Executive Summary | Tool-First | KPI tiles + interactive stock/segment charts; download-heavy |

---

## Archetype Selection

When choosing an archetype for a data content project:

1. **Primary reader goal** — Decide quickly? Understand a story? Explore data? Navigate a long document?
2. **Author control vs reader agency** — Does the data support one argument (Story-First) or many questions (Tool-First)?
3. **Content lifespan** — One-time publication (Story-First archetypes) or living/updating dataset (Dashboard)?
4. **Audience data literacy** — Low literacy needs more narrative scaffolding (Scrollytelling, Story-First); high literacy tolerates Tool-First exploration.
5. **Mobile constraint** — Scrollytelling and Chapter-Based degrade most gracefully to mobile; Dashboard exploration is hardest to adapt.
