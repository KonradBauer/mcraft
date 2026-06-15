---
type: knowledge
purpose: "Discovery questions and research framework for marketplace projects"
---
# Marketplace: Discovery

Domain knowledge for two-sided marketplace sites.
Part of: references/domains/marketplace/

---

## Marketplace Messaging Hierarchy

The messaging sequence differs per side. Both must be addressed, but through separate paths.

### Demand-Side (Buyer) Hierarchy

| Layer | Question | Where to Address |
|-------|----------|------------------|
| **1. Availability** | "Do they have what I need?" | **Search bar + category browse**: Immediately show breadth and enable discovery. |
| **2. Trust** | "Can I trust these sellers?" | **Ratings, reviews, buyer protection**: Visible on listing cards and detail pages. |
| **3. Value** | "Is the price fair?" | **Price on listing cards + comparison across listings**: Enable in-platform comparison. |
| **4. Safety** | "What if something goes wrong?" | **Buyer protection badge + refund policy**: Near purchase CTA. |
| **5. Action** | "How do I buy/book?" | **Purchase CTA**: Clear, prominent, low-friction. |

### Supply-Side (Seller) Hierarchy

| Layer | Question | Where to Address |
|-------|----------|------------------|
| **1. Opportunity** | "Can I make money here?" | **Earnings data, demand stats**: Hero of seller onboarding page. |
| **2. Effort** | "How hard is it to start?" | **How it works (3 steps)**: Seller onboarding page, streamlined flow. |
| **3. Cost** | "What does the platform take?" | **Fee transparency section**: Clear commission/fee breakdown. |
| **4. Proof** | "Do sellers like me succeed here?" | **Seller success stories**: Category-specific testimonials with earnings. |
| **5. Action** | "How do I start?" | **"Start Selling" CTA**: Low-friction first listing creation. |

---

## Key Assumptions to Form

- **Chicken-and-egg**: Which side is harder to acquire? Which side should be subsidized or prioritized in early-stage growth? (Usually supply first — you need listings before buyers have a reason to visit)
- **Minimum viable supply**: How many listings or sellers are needed before the demand side finds the marketplace useful? (Category-dependent: 50 listings may work for luxury watches; 10,000 needed for general fashion)
- **Horizontal vs. vertical**: Does the marketplace span many categories (Etsy, Amazon Marketplace) or focus on one domain (Rover for pet care, Houzz for home)? Horizontal needs strong search/filter; vertical needs deep domain UX
- **Fee structure**: Commission per transaction (Etsy, Airbnb), seller subscription (Amazon Pro), listing fee (eBay), or hybrid? Fee model affects seller onboarding messaging and pricing page design
- **Trust mechanism**: Escrow (Upwork), insurance/guarantee (Airbnb Host Guarantee), identity verification (Uber), quality curation (Toptal)? Trust mechanism determines what badges and protection language to surface
- **Managed vs. open**: Does the platform curate supply (managed — Toptal, Faire) or allow anyone to list (open — Etsy, eBay)? Managed marketplaces shift trust to platform curation; open marketplaces rely on ratings/reviews
- **Payment flow**: Direct payment, platform-mediated, escrow, milestone-based? Payment complexity affects checkout UX and trust architecture

---

## Common Project Shapes

- **Consumer goods marketplace**: Search-first homepage, visual listing cards, category browse, buyer protection prominent. Examples: Etsy, Depop, Poshmark
- **Service marketplace**: Category/location search hero, provider profiles with availability, booking flow, review-driven trust. Examples: Fiverr, Upwork, TaskRabbit, Thumbtack
- **Rental / booking marketplace**: Date + location search hero, calendar availability, instant booking vs. request-to-book, host/guest dual onboarding. Examples: Airbnb, Turo, Vacasa
- **B2B procurement marketplace**: Industry-specific category routing, RFQ flow, supplier verification and certification badges, bulk pricing. Examples: Alibaba, Faire, Thomasnet

---

## Unique Constraints

- **Two-sided cold start problem**: The marketplace is only valuable when both sides have critical mass. Early-stage marketplaces may need to fake density (geographic focus, category restriction) or subsidize one side. UX must not expose empty categories or zero-result searches
- **Trust architecture**: Unlike e-commerce (brand = trust) or B2B SaaS (company = trust), marketplace trust is distributed across three layers: platform trust (buyer protection, payment security), seller trust (ratings, verification), and listing trust (photos, descriptions, reviews). All three must be addressed in the UX
- **Payment flow complexity**: Marketplace payments involve escrow, holds, splits, refunds, and platform fees — far more complex than simple checkout. The UX must abstract this complexity while maintaining transparency ("Your payment is held securely until delivery is confirmed")
- **Category-specific UX needs**: A listing card for handmade jewelry needs different attributes than one for freelance design services or short-term apartment rentals. Template flexibility within consistent structure is required
- **Regulatory and compliance**: Marketplaces face platform liability questions, tax collection requirements (marketplace facilitator laws), and category-specific regulations (food safety, professional licensing). These affect footer content, seller onboarding requirements, and listing creation flows

---

## Top Tasks and Conversion Metrics

### Demand-Side Top Tasks
1. Search for a specific item or service
2. Browse and compare listings within a category
3. Evaluate seller trustworthiness (reviews, ratings, verification)
4. Complete a purchase or booking
5. Track order/booking status and communicate with seller

**Primary conversion:** Search > listing view > purchase/booking completion
**Secondary conversion:** Browse > save/wishlist > return purchase

### Supply-Side Top Tasks
1. Understand earning potential and platform fees
2. Create first listing (lowest possible friction)
3. Manage listings and inventory
4. Respond to buyer inquiries
5. Receive payment and track earnings

**Primary conversion:** Landing page visit > account creation > first listing published
**Secondary conversion:** First listing > first sale > continued active selling

---

## Top Anxieties and Trust Signals

### Buyer Anxieties

| Anxiety | Trust Signal |
|---------|-------------|
| "What if the seller doesn't deliver?" | Buyer protection guarantee with specific refund policy |
| "Is this listing accurate?" | Verified photos, buyer reviews with photos, seller verification |
| "Is the price fair?" | Price comparison across similar listings, price history if available |
| "Is my payment secure?" | Secure payment badge, platform-mediated payment (not direct to seller) |
| "What if I need to return it?" | Clear return policy on listing detail page, platform-mediated returns |

### Seller Anxieties

| Anxiety | Trust Signal |
|---------|-------------|
| "Will I actually get customers?" | Demand data ("X buyers search for [category] monthly"), marketplace traffic stats |
| "Are the fees worth it?" | Fee calculator, earnings comparison with/without platform, transparent fee breakdown |
| "Is the setup too complicated?" | "List in 5 minutes" messaging, streamlined onboarding, listing creation wizard |
| "Will I get paid reliably?" | Payment schedule clarity, payout history examples, secure payment infrastructure |
| "What if a buyer is unfair?" | Seller protection policy, dispute resolution process, review response capability |
