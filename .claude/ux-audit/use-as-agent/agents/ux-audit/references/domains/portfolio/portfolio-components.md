---
type: knowledge
purpose: "UI component library and patterns for portfolio websites"
---
Follow §Communication Rules from agent.md
# Portfolio: Component Library

Domain knowledge for portfolio / personal brand sites.
Part of: references/domains/portfolio/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Identity Hero
**Goal:** Establish who this person is and whether the visitor is in the right place — in under 5 seconds.

### Anatomy
* **Headline**: "I help [audience] [achieve outcome]" — specific, not generic
* **Subhead**: 1-2 sentences elaborating the value proposition
* **Personal photo**: Real, professional-but-approachable (not corporate headshot, not stock)
* **Primary CTA**: "See my work" (scroll anchor) or "Let's talk" (contact)
* **Secondary CTA** (optional): "Book a 20-min call"

### Anti-Patterns
* ❌ Company logo instead of personal photo
* ❌ Generic headline ("Welcome to my portfolio")
* ❌ No CTA — visitor reaches hero with no prompt to act
* ❌ Autoplay video that delays content loading

---

## 2. Project Case Study Card
**Goal:** Provide enough context for the visitor to determine relevance without clicking through.

### Anatomy
* **Project thumbnail**: Result screenshot or key visual
* **Client industry tag**: "B2B SaaS" / "E-commerce" / "Fintech"
* **One-line problem statement**: "Redesigned onboarding flow to reduce churn"
* **One-line result**: "42% increase in trial-to-paid conversion"
* **"View Case Study →"** link

### Anti-Patterns
* ❌ Screenshot-only with no context
* ❌ Listing every project ever done (dilutes focus)
* ❌ No measurable outcome
* ❌ Showcasing personal projects instead of client work

---

## 3. About-the-Person Section
**Goal:** Build personal connection and psychological alignment. Clients hire people, not brands.

### Anatomy
* **Professional photo**: Genuine, not corporate headshot
* **First-person narrative**: 3-5 sentences max
* **Credentials woven into story**, not listed as bullets
* **Personality detail** (optional): "I'm based in Portland and have strong opinions about coffee"

### Anti-Patterns
* ❌ Third-person corporate bio
* ❌ Listing every skill/tool
* ❌ Stock photo or no photo
* ❌ Wall of text

---

## 4. Services / How-I-Help Block
**Goal:** Clarify what the freelancer offers without forcing inference from case studies.

### Anatomy
* **2-4 service offerings** as cards or columns
* Each: service name + 1-2 sentence description + "ideal for" statement
* **Pricing signal** (optional): "Projects typically start at $5K"
* Example: "Brand Strategy — Define your positioning, messaging, and visual identity. Ideal for startups pre-launch or companies rebranding. Typically 4-6 weeks."

### Anti-Patterns
* ❌ Listing 15+ services (signals lack of specialization)
* ❌ No pricing signals at all (increases inquiry anxiety)
* ❌ Jargon-heavy descriptions ("360° integrated solutions")

---

## 5. Client Testimonials
**Goal:** Third-party validation of competence, reliability, and working relationship quality.

### Anatomy
* **Quote text**: Specific about outcome or experience, not generic praise
* **Attribution**: Full name, title, company, photo
* **Outcome reference**: "After working with [Name], our conversion rate increased 34%"
* **2-3 testimonials** max on homepage (more on dedicated page)

### Anti-Patterns
* ❌ Anonymous testimonials ("— Happy Client")
* ❌ Generic praise ("Great to work with!")
* ❌ More than 5 testimonials on one page (diminishing returns)
* ❌ No photo of the person giving the testimonial

---

## 6. Hire-Me CTA
**Goal:** Convert trust into action with a specific, low-friction invitation.

### Anatomy
* **Headline**: "Got a project in mind?" or "Let's work together"
* **What happens next**: "Tell me about your project and I'll reply within 24 hours with initial thoughts."
* **Form fields**: Name, Email, Brief project description (free text), Budget range (optional dropdown), How did you find me? (optional)
* **OR**: Calendar booking link (Calendly/Cal.com) for discovery call
* **Submit button**: "Send message" or "Book a call" (not "Submit" or "Get Started")

### Anti-Patterns
* ❌ No indication of what happens after submission
* ❌ Required phone number field
* ❌ CAPTCHA that creates friction
* ❌ "Request a Quote" (too transactional for relationship-building stage)

---

## 7. Process / Approach Section
**Goal:** Reduce uncertainty about what working together looks like. Clients fear the unknown process more than the unknown outcome.

### Anatomy
* **3-4 steps**: Discovery → Strategy → Execution → Results (or similar)
* **Each step**: Name + 1-2 sentence description of what happens
* **Timeline indicator** (optional): "Typical project: 4-8 weeks"
* **Visual**: Numbered steps, timeline, or simple icons

### Anti-Patterns
* ❌ More than 5 steps (complexity anxiety)
* ❌ Jargon-heavy step names ("Ideation Sprint" instead of "Discovery")
* ❌ No time estimate at all
* ❌ Process that reads like a corporate methodology deck

---

## 8. Client Logo Bar
**Goal:** Quick credibility through brand recognition — "I've worked with companies you know."

### Anatomy
* **4-8 logos**: Monochrome/grayscale for visual consistency
* **Placement**: Below hero or below case studies
* **Optional**: "Selected clients" label above

### Anti-Patterns
* ❌ Including logos of companies where you were an employee, not a hired freelancer
* ❌ Logos without permission
* ❌ More than 12 logos (becomes a wall, dilutes impact)
* ❌ Full-color logos competing with page design


---

## 9. Branding Case Study Structure

**Goal:** Present a brand transformation with a visual-narrative arc — strategic rationale first, then creative concept, then system, then impact. 70–80% visual, 20–30% text.

### 7-Section Anatomy

| # | Section | Purpose | Content |
|---|---------|---------|---------|
| 1 | **Hero Hook** | Stop the scroll — establish the project's emotional register | Full-bleed image or motion; bold concept headline (e.g., "New Nature"); minimal text |
| 2 | **Strategic Friction** | Establish the problem space and the brief | 2-column text + pull quote from client executive or strategic rationale |
| 3 | **Central Revelation** | The core idea — presented as an event, not a description | Oversized type on brand-color background; forces scroll pause; single sentence |
| 4 | **Visual Transformation** | Show the brand change — before/after or new brand only | Slider or stark side-by-side (see Before/After Component) |
| 5 | **System Architecture** | Demonstrate the system's range and logic | Staggered masonry or horizontal scroll; micro-interactions on hover |
| 6 | **World Building** | Brand in context — not just the logo, but the world it creates | Full-width mockups with parallax; environmental and digital applications |
| 7 | **Cultural & Commercial Impact** | Outcomes and credit | Metric counters + testimonials; credits block |

### Cross-Agency Section Flow

| Agency | Flow variant |
|--------|-------------|
| Pentagram | Strategic brief → concept statement → identity system → applications → credits |
| Collins | Problem provocation → reframe → creative system → world → results |
| Wolff Olins | Brief → approach → core idea → expression → impact |
| Moving Brands | Discovery insights → strategy → creative → digital expression → launch |
| DIA Studio | Concept brief → motion logic → generative system → applications |

### Credits Block Anatomy
Client name / Sector / Discipline (Brand Identity, Motion, Naming, etc.) / Office (if multi-location agency) / Partner-in-Charge / Project Team (named) / Collaborators (photographers, directors, etc.)

---

## 10. Before/After Brand Transformation Component

**Goal:** Show the strategic and visual change from old brand to new brand — or from problem to solution.

### 4 Variants

**Variant A — Narrative Transformation (Agency Default)**
Agency-preferred: shows the new brand only, no old brand displayed. Strategic framing explains the "before" in words; creative work stands alone. Avoids showing the old brand on the agency's portfolio. Use for: Pentagram, Collins, Wolff Olins model.

**Variant B — Editorial Comparison**
Side-by-side: "Before" label left, "After" label right. Clean white background, identical crop and scale. Use for: case studies where old brand is well-known (shows scope of transformation), client-focused presentations.

**Variant C — Interactive Slider**
Drag handle divides old brand (left) from new brand (right). Requirements:
* Keyboard accessible: arrow keys move handle in steps
* Labels fade to 20% opacity while dragging (prevent label overlap)
* Bounds padding: 10% minimum from each edge (full-reveal of one side is intentional state, requires double-click)
* Identical crop, identical scale, identical lighting for before/after images
* Mobile: touch-drag with 44px minimum touch target on handle

**Variant D — Sequential Scroll**
Timeline with era bands: each scroll step reveals a new brand era. Use for: company with multiple brand generations; heritage narrative. Label each era with date range.

### When to Use Each Variant
* Client prefers not to show old brand publicly → Variant A
* Old brand is well-known and transformation scope is the story → Variant B
* High-design site, technical capability signal matters → Variant C
* Company history or multiple rebrand generations → Variant D

### Anti-Patterns
* ❌ Auto-moving slider (animation removes user agency)
* ❌ Misaligned framing between before/after (different crop makes comparison meaningless)
* ❌ Interactive slider on every project (dilutes the interaction; use once per portfolio)

---

## 11. Brand System Display Component

**Goal:** Demonstrate the range, logic, and craftsmanship of a complete brand identity system.

### 6-Section Vertical Scroll

**Section 1 — Logo System**
Primary logo + variations grid (2×3: primary / horizontal / stacked / icon-only / reversed / animated). Animated version autoplays on scroll entrance. Clear space rules diagram. On dark background + on light background + on brand-color background.

**Section 2 — Color Palette**
Swatches with: hex + RGB + CMYK + Pantone. Usage ratio as **proportional colored blocks** (not equal-width swatches — if primary blue is 60% of usage, its block is 60% of the bar). Gradient atmospheres. Color-in-context mockups (button, background, illustration).

**Section 3 — Typography Specimen**
Full character set display. Hierarchy at actual sizes: H1 → H2 → H3 → Body → Caption. Weight variants shown together. Type pairing demonstration (e.g., display serif + body sans-serif in a real layout).

**Section 4 — Iconography & Graphic Language**
Icon grid (minimum 24 icons) showing system logic. Pattern or texture system. Motion principles (if applicable).

**Section 5 — Applications Gallery**
Full-bleed mockups organized by touchpoint category: Digital (website, app), Print (packaging, collateral), Environmental (signage, wayfinding), Motion (title card, loading animation).

**Section 6 — Tools & Systems**
For sophisticated studios: Figma plugin documentation, generative tool pipeline, Cinema 4D / p5.js / Three.js outputs. Signals technical depth — differentiates studios that build brand systems as logic engines from those who produce static deliverables.

### Layout Note
Avoid: static PDF image embedded in webpage. Use: asymmetric bento-box CSS grid for simultaneous logo + palette + type display in one viewport — enables side-by-side comparison without scrolling.

---

## 12. Creative Process Gallery

**Goal:** Show how the agency works — from brief to output — to help CMO buyers evaluate methodology and cultural fit.

### 4 Variants by Audience

**Variant A — Inline Process Moments (CMO audience)**
2–4 process images embedded within the case study scroll, between Strategic Friction and Central Revelation sections. Brief caption (1 line). Shows that strategy preceded aesthetics. Recommended for all Agency-Studio-Led case studies.

**Variant B — Process Timeline (Procurement audience)**
Dedicated section or standalone page: Discovery → Strategy → Creative Exploration → Refinement → Launch. Each phase: label, brief description, optional duration. Use on: Approach / How We Work page. Helps procurement evaluators assess methodology repeatability.

**Variant C — Behind-the-Scenes Gallery (Design Director / Creative peer audience)**
Expandable lightbox grid: mood boards, concept rounds, rejected directions, sketch photography. Optional by project — some agencies prefer not to show rejected directions. Use: agencies targeting other creatives or design-literate clients.

**Variant D — Tool Documentation (Agency peer / Award jury audience)**
DIA Studio model: custom pipeline screenshots, generative output previews, code logic (p5.js, Three.js, Cinema 4D). Shows that the agency is building brand systems as computational logic engines, not just aesthetic outputs. Use: studios seeking award recognition or peer positioning.

### Default Recommendation
* Variant A: always include within case study
* Variant B: dedicate one page in site nav ("Process" or "How We Work")
* Variants C/D: use for specific projects where the process is part of the value proposition

### Anti-Patterns
* ❌ Process gallery before case study results — leads with method before establishing quality
* ❌ Generic stock photography of "people in a meeting" — process documentation must show actual work artifacts

---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
