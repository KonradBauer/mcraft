---
type: knowledge
purpose: "UI component library and patterns for b2b services websites"
---
Follow §Communication Rules from agent.md
# B2B Services: Component Library

> Domain-specific components for professional services sites — agencies, consultancies, advisory firms.
> Shared B2B components (navigation, hero, trust bar, forms, FAQ, footer, etc.) load automatically from `b2b/b2b-components.md`.

---

## 1. Team Grid with Deep Bios

**Goal**: Build trust through real people — services sell individuals, not products. Team visibility is the single strongest trust signal for professional services firms.

### Anatomy
* **Photo cards** — high-quality, professionally lit headshots with uniform framing across all team members. Non-negotiable baseline.
* **Hover reveal** — secondary "personality" photo on hover (hobby, pet, informal setting). Humanizes without sacrificing professionalism.
* **Card content** — name, role, specialty area, 1-line positioning statement. Link to full profile page.
* **Scale variants**:
  - Small firms (<15): full bios on single page, leadership featured prominently
  - Mid-size (15–50): filterable grid with expandable or linked individual profiles
  - Large firms (50+): searchable directory with filters by practice area, industry, location; featured leaders on main page
* **Credential integration** — specific intellectual contributions, language fluencies, links to thought leadership, media, LinkedIn

### Anti-Patterns
* ❌ Stock photos or AI-generated headshots — visitors detect inauthenticity instantly; real photos are one of the fastest ways to build trust
* ❌ Inconsistent photo quality — mixed lighting, backgrounds, or cropping signals disorganization
* ❌ Hiding the team behind "About Us" copy — if people are the product, show the people
* ❌ Missing social links — particularly LinkedIn, which serves as external credibility verification

---

## 2. Service Line Cards

**Goal**: Present service offerings in scannable, hierarchical format that guides visitors to the right service page without overwhelming.

### Anatomy
* **Icon-led card** — icon + service name + 1–2 sentence benefit-driven description
* **Visual hierarchy** — primary services larger/more prominent than secondary. Not all services deserve equal weight — if 1–2 drive majority of revenue, design reflects that.
* **Deep link** — each card links to a dedicated service page following: benefit-driven headline → pain point + solution → outcomes (3 bullets) → process (3–4 steps) → proof (testimonial/case study) → FAQ (2–3 objections) → CTA
* **Organization model** — accordion or tab-based for complex service menus. Grouped by client problem, not internal org chart.

### Anti-Patterns
* ❌ Internal org chart as navigation — services organized by firm structure instead of client problems
* ❌ Treating all services as equal — high-value services buried among commodity offerings
* ❌ Jargon-heavy descriptions — "comprehensive solutions" and "industry-leading expertise" carry zero weight
* ❌ Missing service pages — cards that lead to generic "Contact us" instead of dedicated pages

---

## 3. Engagement Model Diagram

**Goal**: Demystify how the firm delivers work — reduce perceived risk by showing exactly how an abstract service becomes a concrete deliverable.

### Anatomy
* **Timeline visualization** — horizontal timeline or numbered steps showing phases of engagement
* **Phase detail** — each phase labeled with: phase name, typical duration, key activities, deliverables
* **Client involvement** — visual indication of client touchpoints and decision moments at each stage
* **Phase distinction** — visual separation between strategy, execution, and measurement phases
* **Team composition** — specific roles assigned per phase (e.g., Project Manager, UX Architect, Solution Engineer)
* **Engagement model variants** — supports fixed-cost project, retainer, and integrated co-creation models

### Anti-Patterns
* ❌ Vague "we collaborate" language without showing actual process steps
* ❌ Overly complex diagrams with 15+ steps — 4–6 phases is optimal for comprehension
* ❌ Missing deliverables — showing activities without stating what the client receives
* ❌ One-size-fits-all process — if the firm has different engagement models, show them separately

---

## 4. Client Results Narrative

**Goal**: Prove impact through both quantitative metrics and qualitative relationship evidence — services buyers evaluate the advisory experience, not just outcomes.

### Anatomy

Two complementary proof formats — comprehensive services sites integrate both:

**Case Study** (metrics-driven):
* **Audience** — procurement officers, technical leads
* **Structure** — Context → Problem → Solution → Implementation → Quantifiable Results
* **Visual** — charts, graphs, before/after comparisons, timeline infographics, metric callouts
* **Tone** — formal, technical, data-driven
* **Key metrics** — operational impact (e.g., "15% revenue growth", "400% contract length growth")

**Success Story** (narrative-driven):
* **Audience** — executives, founders, stakeholders
* **Structure** — fluid narrative emphasizing human element, overcoming friction, emotional relief
* **Visual** — high-quality photography, video testimonials, pull quotes, workplace imagery
* **Tone** — informal, empathetic, relatable

### Placement
* Distributed throughout site near relevant services — NOT on a separate testimonials page
* Include context about engagement scope and challenge alongside endorsement
* Relationship-focused pull quotes with full attribution (name, title, company)

### Anti-Patterns
* ❌ Metrics-only case studies without relationship evidence — "they can tell who cared and put time and energy vs. who did it on assembly line basis"
* ❌ Separate "Testimonials" page as content graveyard — distribute proof where it supports decisions
* ❌ Anonymous testimonials — full attribution is non-negotiable for professional services credibility
* ❌ Only one format — firms need both case studies (procurement path) and success stories (executive path)

---

## 5. Credentials & Awards Bar

**Goal**: Provide third-party validation of expertise — particularly important for procurement-path visitors evaluating firm qualifications.

### Anatomy
* **Client logos** — organizations served, with permission
* **Certifications** — industry-specific compliance badges (ISO, SOC 2, professional designations)
* **Awards** — recognized industry program badges
* **Media presence** — "As seen in" logos for thought leadership validation
* **Review platforms** — third-party ratings (Clutch, G2) with score visible

### Placement
* Above fold on homepage and key service pages
* Near case studies for reinforcement
* On proposal/contact pages for final-stage trust

### Anti-Patterns
* ❌ Outdated certifications or expired awards
* ❌ Logos without context — a logo bar means nothing if visitors don't know why those clients matter
* ❌ Mixing credential types randomly — group by category (clients / certifications / awards / media)

---

## 6. Thought Leadership Hub

**Goal**: Demonstrate expertise through original intellectual contribution — the #1 conversion mechanism for high-growth professional services firms.

### Anatomy
* **Content pillar architecture** — central theme hub page with linked cluster content (articles, videos, podcasts, research)
* **Pillar pages** — comprehensive "ultimate guides" of 3,000–5,000+ words on core topics, supported by related cluster content
* **Content types** — articles, reports, original research, speaking engagements, publications, webinar recordings
* **Author attribution** — every piece linked to team member profile, reinforcing individual expertise
* **Filtering** — by topic, service area, content type, author

### Anti-Patterns
* ❌ Generic blog posts without original insight — "5 Tips for Better Marketing" adds no credibility
* ❌ Infrequent publishing — a hub with 3 posts from 2 years ago signals abandonment
* ❌ No connection to services — thought leadership that doesn't link back to what the firm actually does
* ❌ Missing author identity — anonymous content undermines the people-as-product positioning

---

## 7. Practice Area Filters

**Goal**: Help visitors navigate complex multi-service firms by self-selecting into the right service pathway.

### Anatomy
* **Filter taxonomy** — by service type, industry vertical, engagement model
* **Applied across** — case studies, team directory, thought leadership, service pages
* **Visual design** — pill buttons or sidebar filters with result counts
* **URL persistence** — filtered states are shareable/bookmarkable for procurement teams building shortlists
* **Cross-linking** — filtered views link to dedicated practice area pages for deeper exploration

### Anti-Patterns
* ❌ Too many filter dimensions at once — 2–3 filter types maximum per view
* ❌ Filters that return zero results — always show available options based on content
* ❌ Inconsistent taxonomy — using different category names across different pages

---

## 8. Vertical Expertise Filters

**Goal**: Route multi-vertical firms' visitors to industry-specific content that demonstrates relevant experience and regulatory knowledge.

### Anatomy
* **Industry landing pages** — dedicated pathways for each vertical (e.g., Healthcare, Financial Services, Manufacturing)
* **Tailored content** — relevant case studies, team members with sector experience, industry-specific thought leadership
* **Regulatory awareness** — sector-specific terminology, compliance requirements, vertical-specific process adaptations
* **Dynamic trust signals** — advanced implementations use IP tracking or marketing automation to dynamically show relevant client logos, case studies, and testimonials matching visitor's industry

### Anti-Patterns
* ❌ Industry pages that are just the homepage with a different header — each must have unique, substantive content
* ❌ Claiming expertise without proof — listing an industry without relevant case studies or team experience
* ❌ Missing regulatory context — industries like healthcare, finance, legal require visible compliance awareness

---

## 9. Contact Form Variants (Pre-Discovery Intake)

**Goal**: Initiate a professional relationship, not a transaction — qualifying forms that route prospects to the right team while filtering for fit.

### Anatomy
* **Essential fields** — email and phone as minimum viable capture
* **Qualifying questions** — optional fields using conditional logic: budget range, timeline, engagement type, vertical, business size
* **Progressive profiling** — capture minimal data initially; use enrichment tools (ZoomInfo, Clearbit, Demandbase) to populate company data in backend
* **Conditional logic** — enterprise selection expands to compliance/integration needs; small business keeps brief, routes to different tier
* **Strategic friction** — if overwhelmed by price-shoppers, purposefully add "Budget Range" or "Project Timeline" as qualifier
* **CTA text** — benefit-oriented: "Book Your Free Consultation", "Schedule a Strategy Call", "Request a Proposal"
* **Multi-step layout** — break long discovery forms into logical steps with progress bars
* **Field labels** — clear and specific: "Work Email Address" not generic "Email"

### Anti-Patterns
* ❌ Generic "Contact Us" form with no qualifying intelligence — wastes both firm's and prospect's time
* ❌ 15-field forms on first contact — progressive profiling exists for a reason
* ❌ Only targeting warm traffic — must also offer secondary CTAs for cold visitors (guides, newsletters, webinars)
* ❌ Missing real-time validation — unhelpful error messages cause form abandonment
* ❌ Buried contact information — making it hard for ready-to-buy visitors to reach the firm

---

## 10. Video Testimonials

**Goal**: Combine the two highest-preference B2B content formats — reviews and testimonials — in the most persuasive medium.

### Anatomy
* **Format** — client speaking on camera about the engagement experience
* **Quote excerpts** — text pull-quotes alongside video for scanning without playing
* **Context framing** — brief text describing engagement scope, challenge, and client role/company
* **Duration** — 60–90 seconds maximum for homepage/service page placement; longer cuts for case study pages
* **Attribution** — full name, title, company, visible in text and video

### Placement
* Near relevant services (not on a dedicated testimonials page)
* Within case study pages as supporting evidence
* Homepage for highest-impact proof

### Anti-Patterns
* ❌ Poor production quality — bad audio, shaky camera, poor lighting undermines the trust it's meant to build
* ❌ Scripted delivery — viewers detect rehearsed responses; guided conversation beats scripted testimonials
* ❌ No text fallback — many visitors browse without audio; quote excerpts are essential
* ❌ Only one testimonial — a single video looks cherry-picked; minimum 3 across different services/industries

---

## 11. Individual Team Member Profiles

**Goal**: Provide deep-dive pages for key practitioners — in professional services, buyers research individuals, not just the firm.

### Anatomy
* **Professional bio** — role, specialty, years of experience, educational background
* **Expertise markers** — specific intellectual contributions, publications, speaking engagements, media appearances
* **Case study links** — projects this individual led or contributed to
* **Thought leadership** — articles, reports, presentations authored by this person
* **Language fluencies** — relevant for international or multilingual firms
* **Social proof** — LinkedIn profile link, industry association memberships
* **Contact path** — direct booking link or "Work with [Name]" CTA where appropriate

### Anti-Patterns
* ❌ Cookie-cutter bios — identical structure with only name/title swapped; each profile should reflect the individual
* ❌ Missing intellectual output — a senior consultant with no published thinking signals lack of depth
* ❌ No connection to firm's work — profiles that don't link to case studies or services miss the point
* ❌ Outdated information — stale speaking dates or old role titles erode credibility

---

## See Also

* `b2b/b2b-components.md` — shared B2B components (navigation, hero, trust bar, forms, FAQ, footer, stats, CTA, logo grid, video embed). Loaded automatically with any b2b-* sub-type.
* `b2b-services-patterns.md` — page layout patterns that compose these components into full page types.
* `b2b-services-archetypes.md` — strategic archetypes that determine which components to emphasize.
