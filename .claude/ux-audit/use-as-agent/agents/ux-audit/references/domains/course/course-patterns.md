---
type: knowledge
purpose: "Design patterns and layout strategies for course websites"
---
Follow §Communication Rules from agent.md
# Course: Page Layout Patterns

Domain knowledge for online course and education product sites.
Part of: references/domains/course/

---

Select a pattern based on the course model (solo creator, platform, cohort) and conversion goal.

**Narrative arc: Aspiration → Credibility → Proof → Action** — Course page layouts follow this structure:
- **Aspiration**: Hook the visitor with the transformation they desire (Hero, Problem framing)
- **Credibility**: Establish the instructor and curriculum as the legitimate path (Instructor, Curriculum)
- **Proof**: Demonstrate outcomes from real students (Testimonials, Metrics)
- **Action**: Close with pricing, guarantee, and enrollment CTA

---

## A. Course Landing Page
**Use when:** Selling a single course or program where the landing page is the primary conversion vehicle.
**Core narrative:** "You'll go from [current state] to [desired state] — here's exactly how, who'll teach you, and proof it works."

**Structure:**
1. **Transformation headline** — "Master [Skill] and [Outcome] in [Timeframe]" + instructor name/photo + enrollment count + CTA
2. **Problem/opportunity framing** — 2-3 paragraphs on the gap: what the visitor is struggling with or missing, why now is the time to act
3. **Instructor credibility block** — photo, bio, credentials, notable achievements (see components.md)
4. **Curriculum accordion** — module-by-module, expandable, estimated duration per module (see components.md)
5. **Transformation testimonials** — before-after quotes with specifics: student name, starting point, outcome, timeframe
6. **What's included (value stack)** — video hours, resources, community access, certificate, lifetime access (see components.md)
7. **Pricing section** — single tier or 2 tiers max, payment plan option, money-back guarantee badge prominent
8. **FAQ** — "Do I need prior experience?" "How long do I have access?" "What if I'm not satisfied?" "How much time per week?"
9. **Final CTA** — urgency if applicable (cohort deadline, limited seats) + enrollment button

---

## B. Course Catalog / Browse Page
**Use when:** Platform with multiple courses where discovery and filtering are the primary tasks.
**Core narrative:** "Find the right course for your goal."

**Structure:**
1. **Category filters** — topic, skill level, duration, price range, rating
2. **Course cards** — thumbnail, title, instructor, rating, enrollment count, price
3. **Featured/trending courses** — editorial or algorithmic picks, above the fold
4. **Instructor spotlights** — featured instructors with course counts and student metrics
5. **Learning path suggestions** — curated sequences: "Start here → Then this → Advanced"

---

## C. Cohort Enrollment Page
**Use when:** Time-bound cohort-based course where enrollment deadline creates natural urgency.
**Core narrative:** "Join the next cohort — limited seats, specific start date, learn together."

**Structure:**
1. **Cohort date + seats remaining** — prominent countdown or date display, not fake urgency
2. **Transformation promise** — same as Pattern A hero but with cohort-specific framing ("Join 30 peers in...")
3. **Previous cohort outcomes** — alumni metrics, career changes, project showcases
4. **Curriculum** — week-by-week breakdown (not module-by-module), live session schedule
5. **Community preview** — Slack/Discord screenshot, peer interaction description, guest speaker lineup
6. **Investment + payment options** — price, payment plans, early-bird if applicable, employer sponsorship option
7. **Application CTA** — "Apply for Next Cohort" (application implies selectivity, increasing perceived value)


---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/ux-writing.md` — UX copy guidelines

---

**Cross-domain loading:** If project involves presenting substantial data, research results, or report content → load `data-content/` domain for visualization and layout patterns.
