---
type: knowledge
purpose: "Design patterns and layout strategies for local business websites"
---
Follow §Communication Rules from agent.md
# Local Business: Page Layout Patterns

Domain knowledge for local business sites.
Part of: references/domains/local-business/

---

Select a pattern based on business type and primary conversion action.

**Narrative arc: Relevance → Credibility → Action** — Local business pages follow this sequence:
- **Relevance**: Confirm service + location match (Hero, Services)
- **Credibility**: Prove quality through reviews and credentials (Social Proof, Trust)
- **Action**: Enable contact/booking with minimum friction (CTA, Contact)

---

## A. Local Service Homepage
**Use when:** Client is a service business (plumber, electrician, lawyer, contractor) where phone calls are the primary conversion.
**Core Narrative:** "We're here, we're good, and contacting us is easy."
**Focus:** Phone-first, location-prominent.
**Structure:**
1. **Click-to-call header** — Phone number, "Open Now" status, CTA button (persistent on mobile)
2. **Hero section** — "[Service] in [City]" headline + real photo + primary CTA
3. **Trust bar** — Google rating, years in business, licensing badges
4. **Services overview** — 3-6 service cards linking to detail pages
5. **Social proof** — 3-5 Google reviews + before/after photos
6. **About / credentials** — Team photo, certifications, brief story
7. **Service area** — Embedded map + list of areas served
8. **Contact section** — Form, phone, address, hours, emergency note
9. **Footer** — NAP (Name, Address, Phone), hours, social, legal

---

## B. Appointment Business Homepage
**Use when:** Client is a booking-first business (salon, dentist, fitness studio) where online scheduling is the primary conversion.
**Core Narrative:** "See what we offer → choose your service → book now."
**Focus:** Booking funnel with minimal friction.
**Structure:**
1. **Hero with booking CTA** — "Book Your Appointment" + embedded booking widget or prominent link
2. **Services + pricing** — Service cards with prices and duration
3. **Team / providers** — Staff photos with specialties (clickable to book with specific provider)
4. **Social proof** — Google reviews + before/after (salon/dental)
5. **Gallery** — Photos of the space, results, atmosphere
6. **FAQ** — Insurance, cancellation, first-visit info
7. **Location + hours** — Map, directions, parking
8. **Footer** — NAP, booking link, social

---

## C. Restaurant / Food Service Homepage
**Use when:** Client is a restaurant, café, bakery, or catering company.
**Core Narrative:** "Here's our food → here's how to get it → here's where to find us."
**Focus:** Menu access and order/reservation conversion.
**Structure:**
1. **Hero** — Food photography + "Order Online" / "Make a Reservation" dual CTA
2. **Menu highlights** — 3-4 popular items with photos, or link to full menu
3. **Full menu** — HTML menu (not PDF!) organized by category, with prices
4. **Order / reservation section** — Online ordering integration + reservation widget
5. **Location + hours** — Map, address, hours, parking, delivery zone
6. **About / story** — Brief origin story, chef bio, concept (if applicable)
7. **Press / recognition** — "Best of" awards, press mentions
8. **Footer** — NAP, hours, ordering links, social

---

## D. Service Page (Individual)
**Use when:** Visitor landed on a specific service page from search (e.g., "emergency plumbing west hartford").
**Core Narrative:** "We do this specific thing → we're good at it → here's how to get started."
**Focus:** Service-specific SEO and conversion.
**Structure:**
1. **Service headline** — "[Specific Service] in [Location]"
2. **Service description** — What it includes, who it's for, when you need it
3. **Pricing** (if transparent) — Starting prices or "Free estimate" CTA
4. **Before/after** — Service-specific examples
5. **Reviews** — Filtered to this service if possible
6. **FAQ** — Service-specific questions
7. **CTA** — "Call Now" / "Request a Free Estimate"

---

## Audit Checklists

### Local Business Conversion Check
1. **Phone clickable**: Is the phone number a `tel:` link on mobile?
2. **Hours visible**: Can a visitor find hours in <5 seconds?
3. **Google reviews**: Are reviews displayed on the homepage?
4. **Location confirmed**: Is the service area or address clear?
5. **Mobile-first**: Does the site work on mobile (65%+ of traffic)?
6. **Menu format**: Is the restaurant menu HTML, not PDF?

### Mobile Viability Check
* **Click-to-call**: Phone number tappable in header, visible without scrolling
* **Booking widget**: Full-width, mobile-optimized, no horizontal scrolling
* **Maps link**: Opens native maps app for directions
* **Forms**: Single column, minimal fields, large touch targets


---

## See Also

- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/localization-pl.md` — Polish market: BLIK, text expansion, dates, trust signals
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
