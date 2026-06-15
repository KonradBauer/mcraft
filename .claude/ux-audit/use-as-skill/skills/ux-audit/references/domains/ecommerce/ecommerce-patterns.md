---
type: knowledge
purpose: "Design patterns and layout strategies for ecommerce websites"
---
Follow §Communication Rules from agent.md
# E-commerce: Page Layout Patterns

Domain knowledge for e-commerce / DTC sites.
Part of: references/domains/ecommerce/

---

Select a pattern based on catalog size, product type, and visitor intent.

**Narrative arc: Desire → Trust → Action** — E-commerce pages follow this emotional sequence:
- **Desire**: Create want through visuals, lifestyle, aspiration (Hero, Featured Products)
- **Trust**: Remove anxiety through reviews, policies, guarantees (Social Proof, Trust Signals)
- **Action**: Enable frictionless purchase (Add to Cart, Checkout)

---

## A. DTC Storefront Homepage
**Use when:** Client sells physical products directly to consumers. Traffic mix includes brand-aware returning visitors and cold traffic from ads/social.
**Core Narrative:** "This brand makes something you'll love → here's proof → here's what's new and popular → buying is easy and risk-free."
**Focus:** Product discovery and brand impression.
**Structure:**
1. **Announcement bar** — Free shipping threshold, current promo code, or seasonal sale callout
2. **Hero section** — Flagship product or seasonal campaign image + benefit-driven headline + "Shop Now" CTA
3. **Trust bar** — 3-4 trust signals: "Free shipping over $75" · "30-day returns" · "50,000+ reviews" · "Secure checkout"
4. **Featured collections** — 2-3 curated grids: "Best Sellers," "New Arrivals," "Staff Picks"
5. **Social proof / UGC block** — Customer photo grid, Instagram feed, or video testimonials
6. **Brand story snippet** — 2-3 sentences about founder/mission + "Learn More" link
7. **Incentive capture** — Email/SMS signup: "Get 15% off your first order"
8. **Footer** — Nav links, customer service, payment icons, social links

---

## B. Product Detail Page (PDP)
**Use when:** Visitor has selected a specific product to evaluate. Most critical page for conversion — where browsing becomes buying.
**Core Narrative:** "Here's exactly what you're getting → others love it → buying is safe and easy."
**Focus:** Conversion through information completeness and trust.
**Structure:**
1. **PDP Hero** (above fold) — Image gallery + title + price + variants + "Add to Cart" + shipping estimate + trust micro-copy
2. **Product details accordion** — Description, materials/ingredients, dimensions, care instructions
3. **Size/fit guide** (if applicable) — Measurements, model reference, fit finder
4. **Reviews section** — Aggregate score, distribution chart, individual reviews with photos, filters
5. **Cross-sell** — "You May Also Like" + "Frequently Bought Together"
6. **Recently viewed** — Horizontal scroll of recent products

---

## C. Collection / Category Page
**Use when:** Visitor is browsing a product category. Serves researchers comparing options and browsers discovering products.
**Core Narrative:** "Here's everything in this category → filter to find what you want → quick-assess each product."
**Focus:** Findability and comparison.
**Structure:**
1. **Category header** — Name, description, hero image
2. **Filter + sort bar** — Sidebar filters (desktop) / drawer (mobile) + sort dropdown
3. **Product grid** — Product cards in responsive grid with quick-add capability
4. **Results info** — Count, pagination or "Load More"

---

## D. Cart & Checkout
**Use when:** Visitor has items in cart and is progressing toward purchase.
**Core Narrative:** "Here's what you're buying → the total is clear → checkout is fast and safe."
**Focus:** Friction removal and abandonment prevention.
**Structure:**
1. **Cart summary** — Line items with edit capability, subtotal, shipping estimate
2. **Free shipping progress** — "Add $23 more for free shipping!"
3. **Cross-sell** — "Frequently bought together" (subtle, 1-2 items)
4. **Express checkout** — Apple Pay, Google Pay, Shop Pay
5. **Checkout form** — Guest checkout default, information → shipping → payment → confirmation
6. **Order summary sidebar** — Persistent summary through all steps
7. **Trust footer** — Payment icons, SSL badge, return policy link

---

## E. Brand Story / About Page
**Use when:** Visitor wants to understand who's behind the brand. Especially important for premium DTC where story justifies price.
**Core Narrative:** "We started because... → We believe... → Here's how we make it → Here's proof it matters."
**Focus:** Emotional connection and brand differentiation.
**Structure:**
1. **Founder/origin hero** — Photo + founding story headline
2. **Mission statement** — 2-3 sentences on the "why"
3. **Process / craftsmanship** — How products are made, sourced, or designed
4. **Values** — 3-4 concrete values with visual evidence
5. **Press / recognition** — Media logos, awards
6. **CTA** — "Shop Our Collection" — route back to commerce

---

## Audit Checklists

### Conversion Factors Audit (E-commerce)
1. **Product findability**: Can a product-focused shopper find their item in <3 clicks?
2. **Trust signals**: Are return policy, shipping info, and payment security visible before checkout?
3. **Mobile checkout**: Can a mobile user complete purchase in <3 minutes?
4. **Review presence**: Does every product with 5+ reviews display them prominently?
5. **Cart recovery**: Is the mini-cart accessible from every page?
6. **Guest checkout**: Can a visitor buy without creating an account?

### Mobile Viability Check
* **Product images**: Zoomable, swipeable gallery on mobile
* **Add to Cart**: Full-width button, visible without scrolling on PDP
* **Filters**: Drawer-based, not sidebar (which collapses awkwardly)
* **Checkout**: Single-column, express payment options above form


---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/ux-writing.md` — UX copy guidelines
