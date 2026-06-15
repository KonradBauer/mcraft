---
type: knowledge
purpose: "UI component library and patterns for event websites"
---
Follow §Communication Rules from agent.md
# Event: Component Library

Domain knowledge for event / product launch sites.
Part of: references/domains/event/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Event Hero
**Goal:** Answer "what, when, where, why" in 5 seconds. All critical info above fold.

### Anatomy
* **Event name** (H1, prominent)
* **Date + time** (with timezone)
* **Location** or "Virtual" badge
* **One-line value prop**: "The premier conference for product leaders"
* **Countdown timer**: Days : Hours : Minutes : Seconds
* **"Register Now" CTA**: High-contrast, large button

### Anti-Patterns
* ❌ Event name without date visible above fold
* ❌ No countdown timer on time-bound events
* ❌ Multiple CTAs competing with "Register Now"
* ❌ Hero focused on branding over information

---

## 2. Countdown Timer
**Goal:** Create real urgency by showing time remaining before a deadline. Up to 332% conversion lift when genuine.

### Anatomy
* **Display**: Days : Hours : Minutes : Seconds
* **Label**: "Early bird pricing ends in…" or "Event starts in…"
* **Visually prominent** but integrated into hero
* **Expiry behavior**: Shows "Early bird ended" or removes timer when done

### Anti-Patterns
* ❌ Fake countdowns that reset (destroys trust permanently)
* ❌ Countdown with no label (countdown to what?)
* ❌ Evergreen countdowns on non-time-bound pages
* ❌ Countdown running for more than 72 hours on non-event pages (reduces urgency effect)

---

## 3. Speaker / Lineup Card
**Goal:** Showcase credibility and content quality. For conferences, speakers ARE the product.

### Anatomy
* **Professional headshot** (consistent framing across all speakers)
* **Name + Title + Company**
* **Topic or session title**
* **Brief bio** (2-3 sentences) on hover or click
* **Social media link** (optional)

### Anti-Patterns
* ❌ Stock photos instead of real headshots
* ❌ Listing too many speakers without hierarchy (keynotes should be larger)
* ❌ No session topics listed
* ❌ Speakers without titles/companies

---

## 4. Ticket Tier Selector
**Goal:** Enable self-selection and create urgency through tier availability.

### Anatomy
* **2-3 tier cards** side by side: Early Bird, General, VIP
* Each: tier name, price, included features list, availability status, "Select" button
* **Highlighted/recommended tier** (usually middle or best-value)
* **Sold-out tiers** shown with strikethrough (social proof of demand)
* **Group discount callout** if applicable

### Anti-Patterns
* ❌ More than 4 tiers (choice paralysis)
* ❌ No feature comparison between tiers
* ❌ Hiding the price
* ❌ No "sold out" indicators for expired tiers

---

## 5. Agenda / Schedule Overview
**Goal:** Help visitors assess content relevance and time commitment.

### Anatomy
* **Day-by-day or track-by-track** overview
* **Scannable timeline** format: Time → Session → Speaker → Track
* **Session types** visually distinguished: Keynote, Workshop, Panel, Networking
* **"View Full Agenda →"** link for detailed descriptions
* **Filter by track** for multi-track events

### Anti-Patterns
* ❌ Full session descriptions on the landing page (overwhelming — use overview + detail link)
* ❌ No time indicators
* ❌ No distinction between session types
* ❌ Agenda as PDF download instead of HTML

---

## 6. Registration Form
**Goal:** Minimize friction at the point of highest intent. Every field costs completions.

### Anatomy
* **Essential fields only**: Name, Email, Ticket Type (if multiple)
* **Optional**: Company, Role (useful for networking), Dietary restrictions
* **Payment integration** if paid event
* **Progress indicator** if multi-step ("Step 1 of 2")
* **Confirmation page** with calendar add link (.ics) and share prompt

### Anti-Patterns
* ❌ Requiring too many fields
* ❌ No confirmation page
* ❌ No calendar add option
* ❌ No share/invite prompt after registration

---

## 7. Value Proposition Section
**Goal:** Justify time/cost investment with specific benefit statements.

### Anatomy
* **3-4 benefit statements** with icons
* Examples: "Learn from 20+ industry leaders," "Hands-on workshops," "Networking with 500+ professionals," "Actionable takeaways"
* **Specific over generic**: "Connect with 50+ VPs of Product" beats "great networking opportunities"

### Anti-Patterns
* ❌ Generic benefit statements ("Learn and grow")
* ❌ More than 5 benefits (dilutes impact)
* ❌ Benefits that don't answer "why should I attend THIS event?"

---

## 8. Past Event Proof
**Goal:** Show the event has a track record. Reduce risk for first-time attendees.

### Anatomy
* **Photo gallery**: 6-12 photos from the previous event
* **Video highlights**: 1-2 minute sizzle reel
* **Stats**: "Last year: 500 attendees, 30 speakers, 4.8/5 satisfaction"
* **Testimonials**: Past attendee quotes with name + company

### Anti-Patterns
* ❌ No proof for recurring events (huge missed opportunity)
* ❌ Poor quality photos (signals low-quality event)
* ❌ Stats without context ("500 attendees" means nothing without satisfaction data)

---

## 9. Venue / Travel Section
**Goal:** Remove logistics barriers for in-person events.

### Anatomy
* **Venue name + address** with Google Maps link
* **Embedded map**
* **Getting there**: Directions from airport, parking info, public transit
* **Hotel recommendations**: Partner hotels with discount codes
* **Visa info** (for international events)

### Anti-Patterns
* ❌ No map or directions
* ❌ Hotel recommendations without discount codes (missed value)
* ❌ This section for virtual events (remove entirely)

---

## 10. Closing CTA
**Goal:** Final conversion push after visitor has consumed all page content.

### Anatomy
* **Repeat "Register Now" button**
* **Countdown timer** (if applicable)
* **Urgency copy**: "Only 48 spots remaining. Early bird pricing ends March 15."
* **Social proof**: "Join 1,247 others already registered"

### Anti-Patterns
* ❌ No CTA at the bottom (visitor scrolls to the end and has no prompt)
* ❌ Different CTA than the hero (confusing)
* ❌ No urgency or social proof reinforcement


---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/localization-pl.md` — Polish market: BLIK, text expansion, dates, trust signals
