---
type: knowledge
purpose: "Site archetypes and reference examples for marketplace websites"
---
# Marketplace: Strategic Archetypes

Domain knowledge for two-sided marketplace sites.
Part of: references/domains/marketplace/

---

Archetypes define what a site optimizes for at the architectural level — how pages connect, what narrative the site tells, and which user journey is prioritized.

**These are SITE-LEVEL archetypes** (what the overall site structure optimizes for). They are distinct from PAGE-LEVEL layout patterns in `patterns.md`, which define the internal structure of individual pages.

---

## Dual-Acquisition Marketplace
**Optimizes for:** Converting both supply-side (sellers) and demand-side (buyers) from a single site. GMV and transaction volume measure demand-side success; active listings measure supply-side success.
**Best fit:** Consumer and prosumer marketplaces where both sides discover the platform organically — Etsy, Airbnb, Fiverr, Upwork, TaskRabbit, Depop. Works when the platform's value proposition is strong enough that neither side needs a fully separate marketing site.
**Sacrifices:** Single-narrative clarity. The homepage cannot tell one linear story — it must serve two audiences with incompatible mental models simultaneously.

**Site structure signal:**
- Homepage opens with search/browse for demand side (largest, most prominent element) plus a secondary CTA for supply side ("Start selling on [Platform]") — visually subordinate but persistently visible
- Navigation splits by role: demand-side paths (Browse, Categories, How It Works for Buyers) and supply-side paths (Sell on [Platform], Seller Resources, Seller Dashboard)
- Key pages: Search results, listing detail, seller profile, how-it-works (one per side), trust and safety, seller onboarding landing, category pages
- Social proof: Transaction volume metrics ("$3B in annual sales"), dual-sided metrics (active sellers + active buyers), category-specific proof (e.g., "50,000+ handmade sellers" for craft marketplaces)

---

## Archetype Selection

When choosing a marketplace archetype:

1. **Which side is scarce?** — The harder-to-acquire side gets more dedicated acquisition pages (usually supply in early stage, demand at scale)
2. **Horizontal vs. vertical?** — Horizontal marketplaces (many categories) need strong browse/search; vertical marketplaces (one category) need deep domain-specific UX
3. **Transaction model** — Commission-based, subscription-based, or listing-fee-based changes how pricing is communicated to each side

**Default approach:**
- Consumer goods marketplace: Dual-Acquisition with search-first homepage
- Service marketplace: Dual-Acquisition with category-first homepage
- Rental/booking marketplace: Dual-Acquisition with location + date search hero
- B2B procurement marketplace: Dual-Acquisition with industry/category routing

### Variant Guidance

**Managed vs. Open Marketplace:** Managed marketplaces (Toptal, where the platform curates supply) shift the homepage toward demand-side only — supply acquisition happens through a separate application funnel, often as a standalone landing page. Open marketplaces (Etsy, where anyone can list) must handle both sides from the main site.

**Vertical Marketplace Variants:** Vertical marketplaces serving a single category (e.g., only pet services, only home renovation) do not need a separate archetype — they need deeper category-specific UX: domain-specific filters, specialized listing templates, industry trust signals (licenses, certifications, insurance verification).

**Local vs. Global:** Local marketplaces add location as a primary filter dimension (hero search includes location input). Global marketplaces add shipping/delivery logistics visibility to listing cards and detail pages.
