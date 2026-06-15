---
type: knowledge
purpose: "Design patterns and layout strategies for event websites"
---
Follow §Communication Rules from agent.md
# Event: Page Layout Patterns

Domain knowledge for event / product launch sites.
Part of: references/domains/event/

---

Select a pattern based on event type, pricing model, and audience.

**Narrative arc: What → Why → Who → How Much → Now** — Event pages follow this persuasion sequence:
- **What**: Communicate the event essentials (Hero, Date, Location)
- **Why**: Justify time/cost investment (Value Props, Agenda)
- **Who**: Show credibility through people (Speakers, Attendees, Proof)
- **How Much**: Enable self-selection (Pricing, Tiers)
- **Now**: Create urgency and close (Countdown, Closing CTA)

---

## A. Conference / Multi-Day Event
**Use when:** Paid event with multiple speakers, tracks, and ticket tiers. 100+ expected attendees.
**Core Narrative:** "This is happening → it's valuable for you → time is running out → register now."
**Focus:** Speaker credibility + agenda depth + urgency mechanics.
**Structure:**
1. **Event hero** — Name, date, location, countdown timer, "Register Now" CTA (all above fold)
2. **Value proposition** — 3-4 benefit statements: learning, networking, actionable takeaways
3. **Speaker lineup** — Headshot grid: keynotes large, breakout speakers in grid below
4. **Agenda overview** — Day-by-day scannable timeline with session types
5. **Social proof** — Past attendee testimonials, company logos, "X registered" counter
6. **Ticket tiers** — Early Bird, General, VIP side by side with features + availability
7. **FAQ** — Refund policy, included items, virtual option, logistics
8. **Closing CTA** — Register button + countdown + urgency copy + social proof
9. **Venue / travel** (in-person) — Map, directions, hotel recommendations

**CTA placement rule:** After every 2-3 sections. Top + after speakers + after pricing + bottom = 4 CTAs minimum. Placement at multiple touchpoints increases conversion by ~27%.

---

## B. Webinar / Virtual Event
**Use when:** Free or low-cost virtual event, typically 1-3 hours, single topic.
**Core Narrative:** "This expert is teaching [topic] live → it's free/affordable → save your spot."
**Focus:** Speaker authority + topic relevance + time convenience.
**Structure:**
1. **Hero** — Title, speaker photo + credentials, date/time with timezone, "Register Free" CTA
2. **What you'll learn** — 3-5 bullet points of specific takeaways
3. **Speaker bio** — Full bio with credentials, achievements, photo
4. **Social proof** — "2,000+ registered" or past webinar testimonials
5. **Registration form** — Inline: Name, Email, "Register" (minimal fields)
6. **FAQ** — Recording availability, time commitment, Q&A format

---

## C. Product Launch / Coming Soon
**Use when:** Product launch, crowdfunding, or waitlist page with a reveal date.
**Core Narrative:** "Something exciting is coming → here's a hint → be first to know."
**Focus:** Anticipation and email capture.
**Structure:**
1. **Teaser hero** — Product name/teaser, countdown to launch, email signup
2. **Sneak peek** — 2-3 feature hints or preview images (create curiosity, not full reveal)
3. **Why it matters** — Problem statement the product solves
4. **Social proof** — Waitlist count, press mentions, investor logos
5. **Email signup repeat** — "Be the first to know" + email field

---

## D. Meetup / Community Event
**Use when:** Free or low-cost recurring event (monthly meetup, workshop series).
**Core Narrative:** "Join our community → here's what's happening next → it's free/low-cost → RSVP."
**Focus:** Community belonging + next event details.
**Structure:**
1. **Next event hero** — Topic, date, location/virtual, speaker, "RSVP" CTA
2. **What to expect** — Format description, typical agenda, who attends
3. **Speaker/host** — Brief bio and photo
4. **Past events** — Recaps, photos, recordings
5. **Community info** — Discord/Slack link, member count, "Join the Community" CTA
6. **RSVP form** — Name, Email (2 fields maximum)

---

## Audit Checklists

### Event Conversion Check
1. **Essentials above fold**: Are event name, date, location, and CTA all visible without scrolling?
2. **Urgency present**: Is there a countdown timer or scarcity indicator?
3. **Speaker quality**: Are speakers shown with credentials and session topics?
4. **Pricing clear**: Can a visitor see ticket prices without clicking through?
5. **Registration friction**: Is the form 3 fields or fewer for free events?
6. **Social proof**: Is there a registration count or past attendee testimonials?
7. **CTA repetition**: Are there 3+ registration CTAs across the page?

### Mobile Viability Check
* **Hero info**: All essentials (name, date, CTA) visible without scrolling on mobile
* **Countdown timer**: Readable on small screens
* **Registration form**: Full-width, single-column
* **Speaker grid**: Adapts to 2-column or stacked on mobile


---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/localization-pl.md` — Polish market: BLIK, text expansion, dates, trust signals
