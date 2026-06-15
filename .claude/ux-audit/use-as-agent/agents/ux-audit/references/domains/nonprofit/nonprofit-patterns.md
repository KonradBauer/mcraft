---
type: knowledge
purpose: "Design patterns and layout strategies for nonprofit websites"
---
Follow §Communication Rules from agent.md
# Nonprofit: Page Layout Patterns

Domain knowledge for nonprofit / cause organization sites.
Part of: references/domains/nonprofit/

---

Select a pattern based on primary audience and conversion goal.

**Narrative arc: Emotion → Evidence → Action** — Nonprofit pages follow this sequence:
- **Emotion**: Activate empathy through mission, stories, and imagery (Hero, Stories)
- **Evidence**: Build trust through impact, transparency, and validation (Metrics, Transparency)
- **Action**: Channel emotion into giving, volunteering, or sharing (Donate, Volunteer, Share)

---

## A. Nonprofit Homepage (Donor-Focused)
**Use when:** Primary audience is individual donors. Organization relies on online donations.
**Core Narrative:** "Here's the problem → here's what we do about it → here's proof it works → here's how you can help."
**Focus:** Emotional engagement leading to donation.
**Structure:**
1. **Mission hero** — Emotional image/video + mission headline + "Donate" CTA + secondary "Learn More"
2. **Impact metrics bar** — 3-4 key numbers: "1,765 homes built" · "28 countries" · "$47M raised" · "12,000 volunteers"
3. **The problem section** — Brief, emotionally compelling description ("1 in 5 children goes to bed hungry")
4. **Programs overview** — 2-3 program cards with outcomes
5. **Beneficiary story spotlight** — One featured story with photo, quote, narrative
6. **Ways to help** — Donate / Volunteer / Advocate — three clear paths
7. **Financial transparency** — Pie chart + charity ratings + annual report link
8. **Newsletter signup** — "Stay connected to our mission"
9. **Footer** — Contact, social, tax-exempt info, legal

---

## B. Advocacy / Campaign Page
**Use when:** Primary goal is mobilizing action (signatures, letters, shares) rather than donations.
**Core Narrative:** "This injustice is happening → it affects people you know → you can do something right now → join thousands who already have."
**Focus:** Urgency and collective action.
**Structure:**
1. **Urgent issue hero** — Bold statement of the problem + "Take Action" CTA
2. **The stakes** — What happens if nothing changes (consequences)
3. **The ask** — Specific action: sign petition, write to representative, share on social
4. **Action tool** — Embedded petition form or letter-writing tool
5. **Supporter count** — "47,382 people have spoken up"
6. **Stories** — Testimonials from people affected
7. **Share section** — Social sharing buttons with pre-written messages
8. **Donate (secondary)** — "Support our advocacy work"

---

## C. Service Access Page
**Use when:** Primary audience is beneficiaries seeking help.
**Core Narrative:** "We can help → here's what we offer → here's if you qualify → here's how to start."
**Focus:** Clarity and accessibility for vulnerable populations.
**Structure:**
1. **"Need help?" hero** — Clear statement of services + "Find Services" CTA
2. **Service directory** — Cards for each program with plain-language descriptions
3. **Eligibility info** — Who qualifies, required documents, income guidelines
4. **How to access** — Steps to get started (call, visit, apply online)
5. **Location + hours** — Address, map, phone, hours (if physical location)
6. **FAQ** — Common questions from service seekers
7. **Contact** — Phone, email, walk-in info

---

## D. Donation Page
**Use when:** Visitor has clicked "Donate" and is ready to give.
**Core Narrative:** "Your gift matters → choose your impact → it's safe and easy → thank you."
**Focus:** Conversion completion with minimum friction.
**Structure:**
1. **Thank-you headline** — "Your gift changes lives" (reinforce emotion)
2. **Impact reminder** — Brief: "$25 = one week of meals" next to amount selector
3. **Donation form** — Suggested amounts, recurring option, payment methods
4. **Trust signals** — Charity ratings, "100% tax-deductible," security badges
5. **Confirmation** — Thank-you page with impact statement, share prompt, receipt

---

## E. Split-Intent Donation Page
**Use when:** Donation page serves both immediate givers and deliberative donors.
**Core Narrative:** "Ready? Give now. Not sure? Scroll for proof, then give."
**Focus:** Parallel paths — speed for decided donors, evidence for hesitant ones.
**Structure:**
1. **Form-first hero** — Donation form above fold: amount selector, frequency toggle, express pay buttons. Completable in <60 seconds
2. **Sticky return anchor** — Floating "Continue donation" bar so scrolling donors never lose the form
3. **Impact proof section** — Below fold: cost-to-outcome tiles, beneficiary quote, progress bar
4. **Trust & transparency** — Charity ratings, financial breakdown, FAQ accordion
5. **Desktop:** Dual-column — form pinned left, scrollable proof right. **Mobile:** Stacked — form top, proof below

---

## F. Year-End Campaign Landing Page
**Use when:** Seasonal fundraising push (GivingTuesday through Dec 31) with matching gift or deadline.
**Core Narrative:** "Time is running out — your gift is multiplied — join thousands giving now."
**Focus:** Ethical urgency paired with social proof and match mechanics.
**Structure:**
1. **Urgency header** — Match status + real deadline ("Every gift doubled until Dec 31 — $32K of $50K matched")
2. **Progress thermometer** — Visual bar with live amount, donor count
3. **Embedded donation form** — Campaign-specific amounts, monthly-first toggle, express pay
4. **Match explanation** — Sponsor identity, cap, terms in 1-2 lines
5. **Social proof feed** — Recent donation ticker or supporter count
6. **Minimal navigation** — Collapse main nav; single "Return to main site" text link
7. **Countdown ethics** — Days-remaining counter only when deadline is real and imminent (<72 h). No hours:minutes:seconds unless final 24 h. Never fake or resetting timers

---

## G. Email-to-Landing Page Flow
**Use when:** Campaign email links to a dedicated donation landing page.
**Core Narrative:** "You read the email — here's exactly what was promised — give now."
**Focus:** Scent continuity from inbox to conversion.
**Structure:**
1. **Headline match** — Landing hero repeats email subject/promise verbatim or near-exact
2. **Visual match** — Same campaign image, color palette, and typography as the email
3. **Pre-filled fields** — Pass donor name/email via URL parameters; form shows recognized data
4. **Form above fold** — Donate module immediately visible, no scrolling to reach it
5. **Single CTA** — Remove nav, footer links, sidebars. Every non-donate link is a conversion leak
6. **Segment variants** — High-value donors see higher anchors and different impact stories than acquisition-list donors

---

## H. Storytelling Architecture: 4 Rooms + Threshold
**Use when:** Building a narrative donor journey across sections or pages.
**Core Narrative:** "Orient me → make me feel → show me proof → let me act → close the loop."
**Focus:** Regulated emotional arc that converts empathy into giving.
**Structure:**
1. **Room 1 — Orientation** — "Where am I, what is this cause?" Low intensity, high clarity. Front-door readiness on every page
2. **Room 2 — Humanization** — One identifiable face, real stakes. Emotion rises within scope. No statistics adjacent to the portrait
3. **Room 3 — Legibility** — "I understand how this works." Fund-use specificity, partner logos, governance signals. Trust rises
4. **Room 4 — Agency** — "I choose my impact." Amount options, impact calculator, giving frequency. Emotion converts to action
5. **Threshold** — Donation form as story climax. Embed efficacy language ("Your $50 provides…"). Reduce perceived length via grouping
6. **Post-threshold** — Confirmation page as resolution. Restate amount + impact. Seed next chapter, not "you're done"
7. **Pacing rule** — Never stack two high-distress modules without a grounding or agency module between them

---

## I. Tease-Commit-Resolve Cross-Page Pattern
**Use when:** Multi-page narrative arc (e.g., homepage teaser → impact page → donation page).
**Core Narrative:** "Curiosity → proof → resolution through giving."
**Focus:** Maintaining narrative scent across page transitions.
**Structure:**
1. **Tease (low commitment)** — One compelling human detail + efficacy hook ("See what your gift changes"). Appears on homepage or campaign card
2. **Commit (medium)** — Click into proof: impact dashboard, use-of-funds breakdown, beneficiary update. Same language as tease
3. **Resolve (high)** — Donation form repeats identical impact language. Gift closes the narrative loop
4. **Breadcrumb as progress** — Show arc position: "The Need → The Proof → Your Impact" instead of hierarchical breadcrumbs
5. **Each page self-contained** — Every page works as a standalone entry point. Cross-page arc adds depth but is not required for conversion

---

## J. Mobile Donation Flow
**Use when:** Designing the donation experience for mobile-first or mobile-only audiences.
**Core Narrative:** "Tap, choose, pay — done."
**Focus:** Minimum time-to-donate with thumb-friendly progression.
**Structure:**
1. **Express pay priority** — Apple Pay / Google Pay full-width buttons above all card fields. One tap after amount selection
2. **Accordion sections** — Amount → Payment → Info expand one at a time. Feels like steps without page navigation
3. **Auto-advance** — After amount selection, payment section opens automatically
4. **Minimal keyboard** — Numeric pad for amounts, autofill for email/name, no free-text fields unless necessary
5. **Amount grid** — 2×2 button grid (not horizontal scroll) + "Other" field. Thumb-friendly tap targets ≥44px
6. **Sticky submit** — Bottom-anchored button showing amount + frequency ("Donate $50/month"). Above iOS safe area
7. **Impact micro-line** — Single sentence under selected amount ("Provides school supplies for 3 children"). No forced scroll

---

## K. Persistent vs. Episodic Storytelling Architecture
**Use when:** Choosing between long-running narrative (annual report style) and campaign-specific stories.
**Focus:** Matching story architecture to content lifecycle and donor relationship stage.
**Structure:**
1. **Persistent architecture** — Single-page scrollytelling with embedded donate. Story + form on one surface. Best for: campaign landings, time-bound appeals, paid acquisition pages
2. **Episodic architecture** — Each page is a self-contained "room" and potential front door. Best for: evergreen organizational sites, returning donors, multi-program orgs
3. **Hybrid (recommended default)** — Persistent for campaigns, episodic for evergreen sections. Switch by URL intent
4. **Decision rule** — If deadline exists and traffic is high-intent → persistent. If audience enters from anywhere and content is timeless → episodic
5. **Returning donors** — Skip orientation, lead with legibility + progress. Compress to 1-2 touchpoints

---

## L. Cross-Page Scent & Navigation as Safety Rail
**Use when:** Story spans multiple pages and donors may feel lost or emotionally overwhelmed.
**Focus:** Consistent visual cues, escape routes, and progress indicators across narrative pages.
**Structure:**
1. **Arc-aligned nav labels** — Use emotional journey labels ("The Need" / "The Proof" / "Your Impact") not org-chart labels ("Programs" / "About")
2. **Visual continuity** — Same imagery style, color palette, and typography across all story pages. No tonal jump-scares
3. **Narrative breadcrumb** — "You've seen the need → You've seen the proof → Choose your impact" replaces hierarchical breadcrumbs
4. **Escape routes** — Persistent nav as safety rail. Donors can step out when emotion rises without losing context
5. **Progress indicator** — Subtle step dots or progress bar showing position in the arc. Reduces anxiety, supports re-entry
6. **Scent fulfillment** — Every link delivers exactly what its label promises. "See what $50 does" must land on a page that shows what $50 does

---

## M. Scrollytelling as Immersion Tool
**Use when:** Campaign landing or key impact explainer needs continuous narrative flow.
**Focus:** Scroll-triggered content reveal that sustains transportation without sacrificing performance.
**Structure:**
1. **Scroll-triggered reveals** — Text, images, and data appear as donor scrolls. Each scroll step = one narrative beat
2. **Parallax with purpose** — Background movement only when it reinforces the story (e.g., landscape shifting from drought to harvest). No decorative parallax
3. **Embedded donate module** — Form appears within the scroll narrative at the climax point. Not a separate page
4. **Performance budget** — Total asset weight <2 MB. Lazy-load below-fold images. Degrade gracefully to static layout on slow connections
5. **Accessibility fallback** — `prefers-reduced-motion` disables animation. All content accessible without scroll triggers
6. **Scope guard** — Use only for 1-2 key pages per site. Overuse dilutes impact and inflates build cost

---

## N. Impact Calculator & Choice Architecture
**Use when:** Donor wants to understand exactly what their gift provides before committing.
**Focus:** Interactive "your donation provides X" tool with ethical defaults.
**Structure:**
1. **Pre-set tiers** — 3-4 amounts with concrete outcomes ("$25 = 1 week of meals · $50 = school supplies for 3 children · $100 = clean water for a family")
2. **Slider or stepper** — Optional continuous input that updates outcome description in real-time. Constrain range to avoid paradox of choice
3. **Diegetic framing** — "Choose how you help Maria's village" not "Select donation amount." Keep calculator inside the story
4. **Default selection** — Pre-select second-lowest tier. Avoids cheapest default while remaining accessible
5. **Nudge ethics** — No decoy tiers (one option intentionally inferior). Every tier must have an honest impact justification
6. **"Other" parity** — Custom amount field visually equal to pre-set buttons, not hidden or de-emphasized
7. **Transition to form** — Selected impact carries into donation form as confirmation ("You're providing clean water for 1 family")

---

## Audit Checklists

### Nonprofit Conversion Check
1. **Donate button visible**: Is "Donate" in contrasting color in nav on every page?
2. **Impact specificity**: Does every donation amount have an impact statement?
3. **Story presence**: Is there at least one beneficiary story on the homepage?
4. **Transparency**: Can a visitor find financial accountability data in <2 clicks?
5. **Recurring option**: Does the donation form offer monthly giving?
6. **Multiple paths**: Can visitors donate, volunteer, AND share?

### Storytelling & Journey Check
1. **Emotional pacing**: Are high-distress modules followed by grounding or agency modules?
2. **Scent continuity**: Does every link deliver what its label promises?
3. **Front-door readiness**: Can a donor entering on any page orient within 5 seconds?
4. **Post-threshold closure**: Does the confirmation page restate impact and seed next engagement?
5. **Navigation labels**: Do nav items reflect the donor journey, not the org chart?

### Mobile Viability Check
* **Donate button**: Tappable, prominent, persistent on scroll
* **Donation form**: Single column, express payment options
* **Impact metrics**: Readable without horizontal scrolling
* **Stories**: Images and text scale properly
* **Express pay**: Apple Pay / Google Pay above card fields, full-width
* **Performance**: Scrollytelling pages <2 MB total, reduced-motion fallback present


---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs

---

**Cross-domain loading:** If project involves presenting substantial data, research results, or report content → load `data-content/` domain for visualization and layout patterns.
