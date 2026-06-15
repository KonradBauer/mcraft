---
type: knowledge
purpose: "Audience profiles and user needs for marketplace websites"
---
# Marketplace: Audience Psychology

Domain knowledge for two-sided marketplace sites.
Part of: references/domains/marketplace/

---

## Audience Segments

Two-sided marketplaces serve two fundamentally different audiences with incompatible motivations. Every UX decision must account for both sides without one cannibalizing the other.

---

### Demand-Side (Buyer)

**Mindset:** Task-oriented. Arrives with a specific need and evaluates whether this platform can fulfill it.

**Core question:** "I need [specific thing] — is it available here, and can I trust this platform to deliver?"

**Primary barrier:** Trust in individual sellers (not the platform itself). The platform is an intermediary — the buyer must trust both the marketplace's curation and the specific seller they transact with.

**What resolves it:**
- Ratings and reviews from previous buyers (volume matters — 50+ reviews signal reliability)
- Verified seller badges and identity verification
- Buyer protection guarantees (refund policy, dispute resolution, escrow)
- Transaction history visibility (number of completed sales, response time)

**Decision sequence:**
1. Can I find what I need? (Search/browse quality)
2. Can I trust this specific seller? (Ratings, reviews, verification)
3. Is the price fair? (Comparison across listings)
4. What happens if something goes wrong? (Buyer protection)

---

### Supply-Side (Seller)

**Mindset:** Opportunity-seeking. Evaluates whether the platform is worth the effort of listing, learning the system, and paying fees.

**Core question:** "Can I make money here? How much effort is required? Will I actually get customers?"

**Primary barrier:** Effort-to-reward uncertainty. Sellers invest time before seeing any return — creating listings, learning platform rules, building a profile. They need confidence the payoff justifies the setup cost.

**What resolves it:**
- Earnings potential data ("Average seller earns $X/month," "Top sellers earn $Y")
- Success stories from sellers in similar categories
- Streamlined listing creation (low barrier to first listing)
- Transparent fee structure (no hidden costs)
- Demand visibility ("X buyers search for [category] monthly")

**Decision sequence:**
1. Is there demand for what I offer? (Category activity, buyer volume)
2. How much can I earn? (Earnings data, success stories)
3. How hard is it to get started? (Onboarding friction)
4. What does the platform take? (Fee transparency)

---

## Awareness Model

| Level | Demand-side (Buyer) | Supply-side (Seller) |
|-------|---------------------|----------------------|
| **Solution-Aware** | Knows marketplaces exist for this need, evaluating which platform | Knows selling online is possible, evaluating which platform |
| **Product-Aware** | Knows this specific marketplace, comparing against alternatives | Knows this marketplace, comparing fees/reach against alternatives |
| **Most-Aware** | Ready to transact, needs trust signals and a smooth checkout | Ready to list, needs easy onboarding and fee clarity |

**Typical awareness fit:** Most marketplace visitors arrive solution-aware or product-aware. They already know what a marketplace is — they are evaluating at the platform level. Category-unaware visitors are rare; marketplace discovery usually happens through search for a specific item or service, not through category education.

---

## Conversion Triggers

| Trigger | Demand-side | Supply-side |
|---------|-------------|-------------|
| Social proof | Review volume, buyer protection stats | Seller earnings data, success stories |
| Risk reversal | Money-back guarantee, free returns, dispute resolution | Free to list, no upfront costs, cancel anytime |
| Time-to-value | "Find what you need in minutes" | "Create your first listing in 5 minutes" |
| Peer validation | "Millions of buyers trust [Platform]" | "Join 100,000+ sellers earning on [Platform]" |
| Scarcity (when genuine) | "Only 2 left," "Booking fast" | "High demand in your category," "X buyers searching" |

---

## "Coming from X" — Cross-Domain Warnings

When a marketplace project team has experience primarily in other site types, these transfer errors are common:

| Coming from... | Watch for... |
|----------------|--------------|
| **B2B SaaS** | Don't apply single-funnel thinking. A marketplace has two parallel funnels — one for buyers, one for sellers — each with different conversion goals, messaging, and trust requirements. Social proof must serve both sides, not just buyers. A "Book a Demo" CTA makes no sense here. |
| **E-commerce** | Marketplace doesn't control product quality — the trust architecture fundamentally shifts. In e-commerce, the brand IS the trust signal. In a marketplace, trust must be distributed: platform trust (buyer protection, dispute resolution) plus individual seller reputation (ratings, reviews, verification). Don't assume brand-level quality consistency. |
| **Media / Content** | Content is not the product; listings are. Discovery UX is transactional, not editorial. Visitors are searching for specific items or services, not browsing for interesting content. Engagement metrics (time on site, pageviews) matter less than conversion metrics (searches to transactions, listing views to purchases). |
| **Portfolio** | Marketplace sellers are not portfolio clients. Seller profiles need transactional trust signals (ratings, response time, completion rate), not aesthetic presentation. The goal is conversion confidence, not inspiration. |
| **Local Business** | Scale changes everything. Local business sites serve a single provider; marketplaces aggregate thousands. Search, filtering, and comparison become primary UX challenges. You cannot hand-craft each seller's presentation — you need systematic, template-driven listing quality. |
