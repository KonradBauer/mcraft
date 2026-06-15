---
type: knowledge
purpose: "Design patterns and layout strategies for portfolio websites"
---
Follow §Communication Rules from agent.md
# Portfolio: Page Layout Patterns

Domain knowledge for portfolio / personal brand sites.
Part of: references/domains/portfolio/

---

Select a pattern based on practitioner type, audience, and content depth.

**Narrative arc: Identity → Proof → Invitation** — Portfolio pages follow this trust sequence:
- **Identity**: Establish who you are and who you serve (Hero, Empathy)
- **Proof**: Show evidence of competence and relevance (Work, Testimonials)
- **Invitation**: Make it easy to start a conversation (CTA, Contact)

---

## A. Solo Practitioner Homepage
**Use when:** Client is a solo freelancer, consultant, or creative professional. Traffic comes from referrals, LinkedIn, or social media.
**Core Narrative:** "I understand people like you → here's proof I've done this before → here's how I work → let's talk."
**Focus:** Trust-building and conversion to inquiry.
**Structure:**
1. **Identity hero** — "I help [audience] [achieve outcome]" + personal photo + CTA
2. **Problem/empathy section** — Describe the client's pain in second person ("You've hired designers before and gotten pretty mockups that didn't move the needle...")
3. **Selected work / case studies** — 3-5 project cards with industry tag, problem, outcome
4. **Process/approach** — 3-4 step visual: Discovery → Strategy → Execution → Results
5. **Testimonials** — 2-3 client quotes with real names, companies, photos
6. **About / bio** — First person, authentic, brief — credentials woven into personality
7. **Call to action** — "Book a 20-minute discovery call" + "I'll reply within 24 hours"
8. **Footer** — Contact email, LinkedIn, social links

---

## B. Visual Portfolio / Gallery
**Use when:** Client is a photographer, illustrator, or visual creative where the work quality is self-evident from images alone.
**Core Narrative:** "Look at this work → it speaks for itself → hire me."
**Focus:** Visual impact and style matching.
**Structure:**
1. **Full-bleed project grid** — Large thumbnails, minimal text, hover reveals project name
2. **Project pages** — Full-screen images with minimal context (client, year, brief description)
3. **About** — Brief bio, photo, representation/agency info if applicable
4. **Contact** — Email, social links, agent/rep contact

---

## C. Expert / Thought-Leader Homepage
**Use when:** Client is a consultant, speaker, or author whose reputation drives business.
**Core Narrative:** "I'm a recognized expert in [field] → here's proof → here's how I can help you."
**Focus:** Authority positioning and inbound inquiry generation.
**Structure:**
1. **Authority hero** — Name, tagline, key credibility markers (book cover, "As seen in" logos, keynote photo)
2. **About / positioning** — What I believe, what I've done, why I'm different
3. **Speaking / media** — Topics, past events, media appearances, booking info
4. **Writing / newsletter** — Latest articles, newsletter subscribe CTA
5. **Services** — Consulting, advisory, workshops — with "starting at" pricing
6. **Testimonials** — From clients, event organizers, readers
7. **Contact** — Inquiry form with "What are you looking for?" dropdown

---

## D. Case Study Page (Deep Dive)
**Use when:** Visitor clicked through from a portfolio card and wants to evaluate the project in detail.
**Core Narrative:** "Here was the problem → here's what I did → here's the result → you could be next."
**Focus:** Demonstrating process and measurable outcomes.
**Structure:**
1. **Result-first headline** — "How [Client] increased conversion by 42%"
2. **Context** — Client, industry, timeline, role, team size
3. **Challenge** — What was broken or missing
4. **Approach** — Process, key decisions, methodology
5. **Solution** — Deliverables, screenshots, before/after
6. **Results** — Quantified outcomes with context
7. **Client quote** — Testimonial from the project stakeholder
8. **CTA** — "Want similar results? Let's talk."

---

## E. Portfolio Curation Pattern (Agency-Studio-Led)

**Use when:** site belongs to a branding agency or creative studio; primary buyer is a CMO evaluating creative and strategic fit.

**Curation logic:**
Feature 6–12 carefully selected projects — not a comprehensive gallery. 58% of CMOs report seeing too many case studies; 73% cannot differentiate agencies without a relevant case. Curated depth beats comprehensive breadth.

**Organization:**
Organize by client sector + service type. Feature projects that demonstrate range (different industries, different scale, different media) and depth (different phases of the same brief). Not chronological — relevance to target client is the sorting principle.

**Filter bar:**
* Industry tags: Technology, Consumer, Healthcare, Financial Services, Cultural Institutions, Retail, Other
* Service tags: Brand Identity, Brand System, Naming, Motion Identity, Packaging, Environmental, Digital Experience
* Default view: unfiltered grid (curated relevance order)
* Filter state persists on back-navigation from case study

**Thumbnail design:**
Full-bleed project thumbnail with no overlay text on hover. Project name, client name, and 1 sector + 1 service tag appear below the image as text. Avoid: "hover reveal" pattern that hides project details — CMOs scan grids and read labels, they don't hover each item to reveal basic information.

---

## F. Case Study Navigation Pattern

**Use when:** agency site with 6+ case studies; primary visitor path is to scan the work and dive into specific projects.

**Grid to case study:**
* /work — filtered project grid
* Card anatomy: project name (H3), client name, sector tag, service tag, full-bleed thumbnail (2:1 or 16:9 ratio)
* Click → case study opens (same tab; /work/project-slug)

**Within-case-study navigation:**
* "← Previous Project" and "Next Project →" — keeps CMO in the portfolio without returning to grid
* Order: same sequence as grid; filtered order preserved if user arrived via filter
* Breadcrumb: "Work / [Client Name]" at top — single click to return to filtered grid state (not unfiltered)

**Case study page — top of page navigation:**
* Agency logo (home link)
* "← All Work" link (returns to filtered grid state)
* No full nav bar on case study page — minimize escape paths once CMO is engaged

---

## G. "How We Work" / Process Page Pattern

**Use when:** agency-studio site; standalone page in main navigation (labeled "Process," "Approach," or "How We Work").

**Purpose:** CMO evaluates: "Is their process systematic or intuitive?" and "Would I enjoy working with them?" This page answers both.

**Structure:**
1. **Agency philosophy** — 1–2 sentences on the agency's belief about what makes brand work succeed. Not a mission statement. An actual point of view.
2. **Process phases** — Discovery → Strategy → Creative Exploration → Refinement → Launch. Each phase: name, 1-sentence description, key deliverable (e.g., "Brand Strategy Brief"), optional duration range.
3. **Client involvement per phase** — what the client does at each stage (approvals, workshops, feedback rounds). Signals that the agency expects an engaged client, not a passive one.
4. **Optional: Team structure** — who works on a typical engagement (strategist, designer, project lead, senior partner). Shows accountability and avoids "bait-and-switch" concern (junior team after senior pitch).

**What this page is NOT:**
Not a sales pitch. Not a list of services. Not a timeline with Gantt chart. A CMO reading this should understand how the agency thinks, not just what they deliver.

---

## H. New Business Inquiry Pattern

**Use when:** agency-studio site; contact page optimized for qualified new-business leads, not general inquiries.

**Form anatomy:**
* Full name (required)
* Company name (required)
* Role / title (required) — helps agency assess seniority and decision-making authority
* Type of challenge — dropdown: Brand Identity / Brand Refresh / Naming / Motion Identity / Digital Experience / Not Sure Yet
* Project timeline — dropdown: ASAP (0–3 months) / Near-term (3–6 months) / Planning (6–12 months) / Exploring options
* Budget range — optional, but present; shows agency is selective about fit
* How did you find us? — dropdown: Recommendation / Saw our work / Award / Social media / Search / Other
* Brief description of the challenge — textarea, optional but encouraged

**Framing strategy:**
The form signals selectivity — the agency is choosing clients as much as clients are choosing them. Language: "Tell us about your challenge" (not "Send us a message"). Response time promise: "We review all inquiries and respond within 2 business days."

**Anti-patterns:**
* ❌ Generic contact form ("Name, Email, Message")
* ❌ No role/title field (can't assess fit without knowing who's reaching out)
* ❌ No timeline or budget signal (agency cannot assess fit without scope)

---

## Audit Checklists

### Portfolio Quality Check
1. **Mirror effect**: Does the featured work match the target client's industry?
2. **Outcome specificity**: Does every case study include a measurable result?
3. **CTA clarity**: Can the visitor start a conversation in one click from any section?
4. **Pricing signals**: Can the visitor self-qualify on budget before reaching out?
5. **Authenticity**: Is the tone first-person and genuine, not corporate?


---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
