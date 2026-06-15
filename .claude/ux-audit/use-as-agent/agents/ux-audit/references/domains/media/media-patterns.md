---
type: knowledge
purpose: "Design patterns and layout strategies for media websites"
---
Follow §Communication Rules from agent.md
# Media: Page Layout Patterns

Domain knowledge for media / content publication sites.
Part of: references/domains/media/

---

Select a pattern based on content format and revenue model.

**Narrative arc: Discovery → Consumption → Habit** — Media pages follow this engagement loop:
- **Discovery**: Help visitors find relevant content (Homepage, Navigation, Search)
- **Consumption**: Provide clean reading/viewing experience (Article Page)
- **Habit**: Convert visitors into returning readers (Newsletter, Related Content)

---

## A. Publication Homepage
**Use when:** Client operates a media property with multiple content categories and regular publishing cadence.
**Core Narrative:** "Here's what's important now → browse by interest → subscribe to stay informed."
**Focus:** Editorial hierarchy and content discovery.
**Structure:**
1. **Featured article hero** — Large image + headline + author + reading time (editorial judgment on display)
2. **Topic navigation bar** — "Latest," "Technology," "Culture," "Business," "Opinion" — sticky on scroll
3. **Recent articles grid** — 6-9 article cards in responsive grid
4. **Trending / most-read sidebar** — "Most Read This Week" ranked list
5. **Newsletter subscribe inline** — After first 6-9 articles: "Get the best of [Publication] weekly"
6. **Topic deep-dive** — Curated collection for a specific topic (4-5 articles)
7. **Footer** — Full nav, social links, masthead, advertise, RSS

---

## B. Article Page
**Use when:** The primary content consumption page. Most visitors land here from search or social — NOT the homepage.
**Core Narrative:** "Here's a well-crafted piece worth your time → here's who wrote it → here's what to read next."
**Focus:** Clean reading experience and session extension.
**Structure:**
1. **Article header** — Headline, category tag, author bio (mini), date, reading time
2. **Hero image** — Full-width, with caption and credit
3. **Article body** — 680-720px width, 18-20px text, generous line-height, subheadings every 3-4 paragraphs
4. **Inline newsletter CTA** — After ~40% scroll depth
5. **Author bio (full)** — Photo, name, beat, recent articles link, social links
6. **Related articles** — 3-4 article cards: same topic or same author
7. **Comments** (optional) — If community engagement is valued

---

## C. Newsletter Landing Page
**Use when:** Newsletter IS the product. Site exists primarily to convert visitors into subscribers.
**Core Narrative:** "This newsletter is worth your inbox space → here's proof → subscribe now."
**Focus:** Email subscription conversion.
**Structure:**
1. **Hero with subscribe form** — Newsletter name + value prop + email field + "Subscribe" button
2. **What you get** — 3-4 bullet points: frequency, topics, format
3. **Sample content** — Preview of a recent issue or screenshot
4. **Social proof** — Subscriber count, reader testimonials, company logos
5. **Author/team section** — Who writes this and why they're credible
6. **Pricing** (if paid tiers) — Free vs. Premium comparison
7. **Subscribe CTA repeat** — Bottom of page with same form

---

## D. Category / Topic Page
**Use when:** Visitor is browsing all content within a specific topic area.
**Core Narrative:** "Here's everything we've published on [topic] → newest first."
**Focus:** Content discovery within a topic.
**Structure:**
1. **Category header** — Topic name, description, article count
2. **Featured article** — Top/latest piece in this category
3. **Article list/grid** — Chronological, filterable
4. **Pagination** — Page numbers or "Load More" (not infinite scroll for article archives)
5. **Related topics** — "Also explore: [adjacent topics]"

---

## Audit Checklists

### Content Quality Check
1. **Editorial hierarchy**: Does the homepage clearly signal the most important content?
2. **Freshness visible**: Does every article show publication date?
3. **Author trust**: Does every article have author attribution with credentials?
4. **Reading experience**: Is body text 18px+, max-width 720px, high contrast?
5. **Mobile reading**: Can a mobile reader finish an article without ad interruptions?
6. **Newsletter accessibility**: Can a visitor subscribe from any page in <2 clicks?

### Mobile Viability Check
* **Topic nav**: Horizontal scrollable, not hidden in hamburger
* **Article text**: 18px+ body text, no pinch-to-zoom needed
* **Ads**: Do not cause content layout shifts
* **Share bar**: Bottom bar, not covering content


---

## See Also

- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/emerging.md` — AI chat, dark mode, interactive demos, passwordless auth

---

**Cross-domain loading:** If project involves presenting substantial data, research results, or report content → load `data-content/` domain for visualization and layout patterns.
