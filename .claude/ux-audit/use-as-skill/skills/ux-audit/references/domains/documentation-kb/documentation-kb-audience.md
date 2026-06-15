---
type: knowledge
purpose: "Audience profiles and user needs for documentation kb websites"
---
# Documentation & KB: Audience Psychology

Domain knowledge for documentation sites and knowledge bases.
Part of: references/domains/documentation-kb/

---

## Visitor Profiles

### Task-Focused Developer
Impatient. "I need to know how to do [specific thing] right now." Mid-task, left IDE to find the answer, wants to return ASAP. Measures site quality by seconds-to-answer. Will leave immediately if forced through navigation layers. Search and in-page anchors are primary tools. Code examples must be copy-pasteable and runnable.

### Evaluator
Checking documentation quality as a purchase decision factor. Good docs = well-maintained product. Evaluates: search quality, content freshness (last-updated dates), code example accuracy, coverage depth. A product with poor docs signals poor engineering culture. This visitor may never use the docs for their intended purpose — they are auditing.

### Beginner
Following a tutorial or getting started guide. Needs step-by-step guidance, cannot skip steps, requires context for every action. Easily derailed by assumed knowledge. "Prerequisites" sections are critical. Benefits from progressive disclosure — show the simple path first, link to advanced options.

### Re-Finder
"I saw this config option before, where was it?" Relies on search and breadcrumbs. Remembers partial terms, page locations, visual landmarks. Search must handle fuzzy matching and partial queries. Breadcrumb navigation and consistent page structure help spatial memory.

---

## Primary Barrier: Findability

Information exists but can the visitor find it? Poor information architecture is the #1 frustration with documentation sites. The content may be accurate and comprehensive, but if navigation and search fail, the site fails. This is the inverse of persuasion sites where the barrier is convincing — here the barrier is locating.

---

## Information-Seeking Behavior Model

The B2B awareness model is irrelevant for documentation. Documentation visitors are product-aware or most-aware by definition — they already use or actively evaluate the product. The relevant framework is **information-seeking behavior**:

| Mode | Behavior | What the site must support |
|------|----------|---------------------------|
| **Known-item search** | Visitor knows exactly what they need ("How do I set the timeout parameter?") | Fast, precise search with good indexing; direct deep links; anchor-based URLs |
| **Exploratory search** | Visitor knows the problem area but not the specific solution ("How does authentication work here?") | Clear topic hierarchy; related content links; conceptual overview pages that link to specifics |
| **Re-finding** | Visitor previously found the answer and needs it again ("Where was that migration guide?") | Consistent URLs; breadcrumbs; search history; predictable page structure |

---

## "Coming from X" — Cross-Domain Warnings

When a documentation project team has experience primarily in other site types, these transfer errors are common:

| Coming from... | Watch for... |
|----------------|--------------|
| **B2B SaaS** | Do NOT add persuasion elements to docs. No hero with benefit headline, no "Book a Demo" CTA. Developers landing on docs expect immediate utility — marketing signals "wrong page." |
| **Media / Content** | Docs are not editorial content. No bylines, no opinion pieces, no narrative arcs. Structure serves findability, not engagement. Content should be scannable, not immersive. |
| **E-commerce** | No "browsing" UX. Docs visitors have a specific question — don't make them browse categories when they need search. Category grids are secondary to search. |
| **Portfolio** | Documentation is not a showcase. Visual design should be invisible — it should support reading, not draw attention to itself. Typography, whitespace, and code formatting matter more than visual flair. |
