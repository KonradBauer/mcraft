---
type: knowledge
purpose: "Design patterns and layout strategies for marketplace websites"
---
Follow §Communication Rules from agent.md
# Marketplace: Page Layout Patterns

Domain knowledge for two-sided marketplace sites.
Part of: references/domains/marketplace/

---

Select a pattern based on which audience the page serves (demand, supply, or both) and the visitor's position in the transaction flow.

**Narrative arc: Discover > Trust > Transact** — All marketplace page layouts follow this three-phase structure:
- **Discover**: Help the visitor find what they need or understand the opportunity (Search, Browse, Earnings data)
- **Trust**: Build confidence in the platform and in the specific counterparty (Reviews, Protection, Verification)
- **Transact**: Enable the conversion action with minimal friction (Purchase, Book, List)

---

## A. Marketplace Homepage
**Use when:** Two-sided platform where demand side drives homepage traffic. The homepage must serve buyers as the primary audience while maintaining a visible entry point for sellers.
**Core narrative (demand):** "Everything you're looking for is here — browse, trust, transact."
**Core narrative (supply):** "This is where your customers already are — start earning."
**Structure:**
1. **Search-first hero** — Search bar is the dominant element, with category suggestions or popular searches below. Location input if relevant. Secondary "Start selling" CTA visible but visually subordinate (text link or outlined button, not competing with search). Background imagery shows breadth of marketplace offerings.
2. **Category browse** — 8–12 visual category cards with category image + name + optional listing count. Enables exploration for visitors who don't know exactly what they want. Grid layout on desktop, horizontal scroll on mobile.
3. **Trending / featured listings** — Curated or algorithmically selected listings demonstrating marketplace quality and activity. Shows the marketplace is alive and active. 4–8 listing cards with images, prices, ratings.
4. **Trust and safety block** — Buyer protection guarantee, secure payment, dispute resolution, verification badges. Addresses the core demand-side anxiety: "What if something goes wrong?" Shield icon + one-line protection description + link to full policy.
5. **Supply-side recruitment section** — Dedicated section targeting sellers: earnings potential data, simplified "how it works" (3 steps), and "Start selling" CTA. This is the primary seller conversion point on the homepage.
6. **Marketplace stats** — Transaction volume, active sellers, active buyers, categories or countries served. Horizontal stat bar communicating marketplace health and scale. Signals critical mass to both sides.

---

## B. Listing Detail Page
**Use when:** Visitor is evaluating a specific listing — the most critical conversion page in any marketplace. This is where the transaction decision happens.
**Core narrative:** "This is exactly what you're looking for — here's everything you need to decide."
**Structure:**
1. **Image gallery** — Primary image with thumbnail strip or grid. Lightbox on click. Minimum 3 images for physical goods; hero image + context shots for services. Mobile: horizontal swipe with dot indicators.
2. **Title + price + key details** — Listing title (H1), price (largest number on page), key attributes (size, condition, availability, delivery time). Above the fold alongside image gallery.
3. **Seller profile snippet** — Seller name, profile photo, star rating (1–5) with review count, "Verified Seller" badge if applicable, member-since date, response time. Links to full seller profile. Positioned near the purchase CTA — seller trust directly influences purchase confidence.
4. **Description / specifications** — Full listing description written by seller. For structured marketplaces: specification table (dimensions, materials, features). Expandable if long.
5. **Reviews from previous buyers** — Star distribution summary + individual review cards (reviewer name, date, rating, text, optional photos). Sort by most recent or most helpful. Review count visible. This section is the primary trust mechanism.
6. **Similar listings** — 4–8 related listings from other sellers. Enables comparison without leaving the platform. Keeps the buyer in the marketplace if this listing doesn't convert.
7. **Trust badge + purchase CTA** — Prominent "Buy Now" or "Book" or "Contact Seller" button. Adjacent buyer protection badge ("[Platform] Purchase Protection" with shield icon). Price repeated near CTA. On mobile: sticky bottom bar with price + CTA.

---

## C. Seller Onboarding Landing
**Use when:** Recruiting supply side — dedicated landing page for potential sellers arriving from homepage CTA, ads, or referral links.
**Core narrative:** "Start earning on [Platform] — here's what sellers like you achieve."
**Structure:**
1. **Earnings-first hero** — Lead with seller success metrics: average earnings, top seller earnings, or earnings calculator. Headline frames the opportunity ("Earn $X/month selling [category] on [Platform]"). CTA: "Start Selling" or "Create Your First Listing."
2. **How it works** — 3-step process: (1) Create your profile/listing, (2) Receive orders/bookings, (3) Get paid. Visual icons or illustrations per step. Emphasis on simplicity and speed ("List your first item in 5 minutes").
3. **Seller success stories** — 2–3 real seller testimonials with photo, name, category, earnings data, and quote. Specificity matters: "I earn $3,200/month selling vintage clothing" converts better than "I love selling here."
4. **Fee transparency** — Clear breakdown of platform fees: commission percentage, payment processing fees, any listing fees, subscription tiers if applicable. No hidden costs. Comparison with competitor platforms if favorable. This section directly addresses the primary seller anxiety about effort-to-reward ratio.
5. **Getting started CTA** — Final conversion section repeating the primary CTA with a summary of key benefits. "Join X sellers already earning on [Platform]." Optional: "No upfront costs" or "Free to list" risk reversal micro-copy.

---

## Audit Checklists

### Dual-Audience Check
* **Homepage routing** — Can a buyer start browsing within 3 seconds? Can a potential seller find the "Start selling" path within 5 seconds?
* **Navigation clarity** — Are buyer paths and seller paths clearly separated in nav without requiring self-identification?
* **Social proof balance** — Does social proof serve both sides (transaction volume for buyers, earnings data for sellers)?

### Trust Architecture Check
* **Buyer protection visible** — Is the protection guarantee visible on listing detail pages near the purchase CTA?
* **Seller verification** — Are verified badges explained (what verification means)?
* **Review integrity** — Are reviews from verified purchasers clearly marked?

### Mobile Viability Check
* **Search** — Is the search bar prominent and functional on mobile (not hidden behind a tap)?
* **Listing cards** — Do listing cards show price, image, and rating without requiring horizontal scroll?
* **Purchase CTA** — Is the purchase/booking CTA accessible via sticky bottom bar on listing detail pages?


---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/evaluation.md` — LIFT, CCD, Nielsen heuristics, cognitive load
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
