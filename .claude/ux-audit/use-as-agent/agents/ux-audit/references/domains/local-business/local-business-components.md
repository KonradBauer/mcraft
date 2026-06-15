---
type: knowledge
purpose: "UI component library and patterns for local business websites"
---
Follow §Communication Rules from agent.md
# Local Business: Component Library

Domain knowledge for local business sites.
Part of: references/domains/local-business/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Click-to-Call Header
**Goal:** Enable urgent-need visitors to call directly without scrolling. 60%+ of local searches lead to a call.

### Anatomy
* **Persistent header bar**: Phone number (tel: link), "Open Now" / "Closed" status
* **Phone number**: Visible in at least 18px font on mobile, tappable
* **CTA button**: "Call Now" or "Book Appointment" — full-width on mobile, high-contrast
* Example: "Need a Plumber? Call (860) 555-0123 · Open 24/7"

### Anti-Patterns
* ❌ Phone number as an image (not clickable on mobile)
* ❌ Phone number only in footer
* ❌ Small tap targets on mobile
* ❌ "Contact Us" page link instead of showing the actual phone number

---

## 2. Local Hero Section
**Goal:** Confirm service + location match and enable action in <5 seconds.

### Anatomy
* **Headline**: "[Service] in [City/Neighborhood]" — explicit location in H1 for SEO and relevance
* **Subhead**: 1-sentence value prop
* **Background**: Real photo of business/team (not stock)
* **Primary CTA**: "Get a Free Quote" / "Book Appointment" / "Order Online"
* **Trust micro-copy**: "★★★★★ 4.8 on Google · 312 reviews"

### Anti-Patterns
* ❌ Generic headline without location ("Quality Service You Can Trust")
* ❌ Stock photos (destroys local authenticity)
* ❌ No CTA in hero section
* ❌ CTA that says "Learn More" instead of a conversion action

---

## 3. Google Review Widget
**Goal:** Surface the most powerful trust signal for local businesses. 97% of consumers read reviews for local businesses.

### Anatomy
* **Google star rating** + total review count (linked to Google profile)
* **3-5 selected reviews**: Reviewer name, date, star rating, text excerpt
* **"Read all reviews on Google →"** link
* Auto-updating from Google My Business API (or manually curated)

### Anti-Patterns
* ❌ Only showing 5-star reviews (reduces authenticity)
* ❌ Fabricated reviews
* ❌ No link to Google profile (feels like cherry-picking)
* ❌ Reviews older than 6 months

---

## 4. Hours & Directions Block
**Goal:** Answer "Are they open?" and "How do I get there?" without friction.

### Anatomy
* **Current status**: "Open Now" (green) or "Closed · Opens Monday at 9 AM" (red)
* **Full weekly hours table**
* **Address** with "Get Directions" link (opens native maps app on mobile)
* **Embedded Google Map**
* **Parking/transit note** if relevant ("Free parking behind building")

### Anti-Patterns
* ❌ Hours as an image (not machine-readable, not accessible)
* ❌ No "Open Now" indicator
* ❌ No maps integration
* ❌ Directions requiring manual address copy

---

## 5. Service Cards
**Goal:** Help visitors confirm "you do what I need" and improve SEO for service-specific searches.

### Anatomy
* **Card grid**: 3-6 core services
* Each card: Service name, 1-sentence description, representative image/icon, link to dedicated service page
* **Pricing signal** (optional): "Starting at $X" or "Free estimates"

### Anti-Patterns
* ❌ More than 8 service cards on homepage (use dedicated services page)
* ❌ No individual service pages (all content on one page)
* ❌ Vague service names ("Our Solutions" instead of "Roof Repair")

---

## 6. Service Area Map
**Goal:** Confirm geographic coverage for visitor and search engines.

### Anatomy
* **Google Map** with service area highlighted or pinned
* **List of cities/neighborhoods** served, linked to service area pages
* **Radius indicator** or zip code checker
* Example: "We serve Hartford County including West Hartford, Farmington, Avon, Simsbury."

### Anti-Patterns
* ❌ Claiming unrealistically large service area
* ❌ No map visualization
* ❌ Service area pages with duplicate content

---

## 7. Before/After Gallery
**Goal:** Visual proof of work quality for service businesses (contractors, landscapers, dentists, auto body).

### Anatomy
* **Slider or side-by-side** comparison images
* **Project label**: Brief description of work done
* **Location tag** (optional): Reinforces local service
* **4-8 examples** maximum on homepage

### Anti-Patterns
* ❌ Low-quality photos (undermines the "quality work" message)
* ❌ Stock photos of completed work
* ❌ No labeling (visitor can't tell what was done)

---

## 8. Contact Section
**Goal:** Final conversion point for visitors who scrolled through the whole page.

### Anatomy
* **Contact form**: Name, phone, email, message (4 fields max)
* **Clickable phone number**
* **Address** with Google Maps link
* **Hours of operation**
* **Emergency availability note** if applicable

### Anti-Patterns
* ❌ Contact form with more than 6 fields
* ❌ No phone number on the contact section
* ❌ "We'll get back to you" without timeframe
* ❌ CAPTCHA on a contact form (kills mobile conversions)

---

## 9. Credentials / Trust Bar
**Goal:** Communicate professionalism and reduce risk for scheduled-need and comparison visitors.

### Anatomy
* **Google rating**: "★★★★★ 4.8 · 312 reviews"
* **Years in business**: "Family-owned since 2003"
* **Licensing badges**: State license number, certifications
* **Insurance badge**: "Fully insured and bonded"
* **Association logos**: BBB, industry associations

### Anti-Patterns
* ❌ Generic "trusted" claims without specific credentials
* ❌ Expired or unverifiable certifications
* ❌ Too many badges (becomes visual noise — pick 3-4 strongest)

---

## 10. Online Booking Widget
**Goal:** Enable appointment scheduling without a phone call. Especially important for millennial/Gen-Z visitors.

### Anatomy
* **Embedded booking calendar** (from Calendly, Acuity, or industry-specific tool)
* **Service selector**: Choose service type before seeing availability
* **Provider selector** (if multiple): Choose specific provider
* **Confirmation**: Immediate email/SMS confirmation + calendar add

### Anti-Patterns
* ❌ Booking link that opens a separate website with different branding
* ❌ No confirmation after booking
* ❌ Requiring account creation to book
* ❌ Calendar not mobile-optimized


---

## See Also

- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/localization-pl.md` — Polish market: BLIK, text expansion, dates, trust signals
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
