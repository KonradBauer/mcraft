---
type: knowledge
purpose: "UI component library and patterns for course websites"
---
Follow §Communication Rules from agent.md
# Course: Component Library

Domain knowledge for online course and education product sites.
Part of: references/domains/course/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Curriculum Accordion
**Goal:** Show learning path in structured detail so the visitor can assess depth, relevance, and time commitment.

### Anatomy
- **Course stats bar** at top: "8 modules · 42 lessons · 12 hours"
- **Module rows** (collapsed by default): module number + descriptive title
- **Expanded view** reveals: lesson list (3-8 per module) + estimated time per lesson + content type icon (video/exercise/quiz/project)
- **Progress indicator** (for enrolled students): completed lessons marked

### Anti-Patterns
- ❌ All modules expanded by default (overwhelming — defeats progressive disclosure)
- ❌ Vague module titles ("Module 3: Advanced Topics" — says nothing about content)
- ❌ No time estimates (visitor cannot plan their commitment)
- ❌ Lesson count without content type (visitor cannot assess learning variety)

---

## 2. Transformation Testimonial
**Goal:** Show proof of outcome, not just satisfaction. Distinct from B2B testimonials (which focus on business ROI) — course testimonials validate personal transformation.

### Anatomy
- **Student photo** + first name (real person, not stock)
- **Before state**: "I was a [role/situation] struggling with [problem]"
- **After state**: "Now I [specific outcome]"
- **Specific metric**: salary increase, new role, project completed, time saved
- **Quote**: 2-3 sentences in student's voice
- **Video format** most effective when available (authenticity signal)

### Anti-Patterns
- ❌ "Great course! Highly recommend." (no outcome — says nothing useful)
- ❌ Missing photos (anonymous testimonials lack credibility)
- ❌ All same demographic (signals narrow audience, reduces relatability)
- ❌ Only text when video is available (missing strongest trust signal)

---

## 3. Instructor Credibility Block
**Goal:** Establish instructor as a legitimate authority worth paying to learn from. This is make-or-break for course conversion — the instructor IS the product.

### Anatomy
- **Professional photo** (not casual selfie — this is a credibility component)
- **Bio**: 100-150 words, narrative format, focusing on relevant expertise
- **Key credentials**: 3-5 bullets (notable employers, publications, achievements, years of experience)
- **Student count**: total students taught (social proof of teaching ability)
- **Notable affiliations/publications**: logos or names of recognizable organizations

### Placement
After transformation headline (instructor as the guide) OR after curriculum (instructor as proof of depth).

### Anti-Patterns
- ❌ Leading with credentials before establishing what will be learned (visitor needs to care about the topic before caring about who teaches it)
- ❌ Wall of text bio (bullet credentials are scanned; paragraphs are skipped)
- ❌ No photo (anonymous instructor destroys trust for a personal product)

---

## 4. Value Stack
**Goal:** Justify price by showing everything included. Overcomes the "just videos?" objection by demonstrating breadth of value.

### Anatomy
- **Itemized list with icons**: video hours, downloadable resources, templates, community access, certificate, lifetime access, instructor Q&A
- **Total value comparison** (optional): "Total value: $2,400 → Your price: $497" — works when individual items have defensible standalone value
- **Access duration**: "Lifetime access" or specific period, clearly stated

### Anti-Patterns
- ❌ Listing only "12 video lessons" without showing full breadth (undersells the offering)
- ❌ Inflated "total value" with indefensible individual prices (damages credibility)
- ❌ Hiding access terms (creates post-purchase anxiety)

---

## 5. Money-Back Guarantee Badge
**Goal:** Reduce purchase anxiety for an intangible product. Courses cannot be previewed like physical products — the guarantee substitutes for a trial.

### Anatomy
- **Shield or checkmark icon** (visual trust symbol)
- **Headline**: "30-Day Money-Back Guarantee" (or applicable period)
- **One-line explanation**: "Try the full course. If it's not for you, get a complete refund — no questions asked."

### Placement
Near pricing CTA — must be visible at the moment of purchase decision, not buried elsewhere.

### Anti-Patterns
- ❌ Hiding guarantee in FAQ instead of near purchase point (misses the anxiety moment)
- ❌ Complex refund conditions in fine print (undermines the trust signal)
- ❌ No guarantee at all for premium-priced courses (leaves purchase anxiety unaddressed)

---

## 6. Cohort Countdown
**Goal:** Create legitimate urgency for time-bound courses. Unlike fake e-commerce scarcity, cohort deadlines are real and verifiable.

### Anatomy
- **Next cohort date**: "Starts March 15, 2026"
- **Seats remaining** counter: "12 of 30 seats remaining"
- **Enrollment deadline**: "Enrollment closes March 10"
- **Next opportunity** (optional): "Following cohort: June 2026" — reduces FOMO anxiety by showing it will come back

### Anti-Patterns
- ❌ Fake countdown that resets (destroys credibility — visitors notice and share)
- ❌ "Only X seats left!" without visible total (unverifiable claim)
- ❌ No mention of next cohort (creates pressure but also resentment if visitor can't join now)


---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/ux-writing.md` — UX copy guidelines
