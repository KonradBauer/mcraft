---
type: knowledge
purpose: "Site archetypes and reference examples for enterprise tools websites"
---
# Enterprise Tools: Strategic Archetypes

Domain knowledge for enterprise tools sites — products where the buyer (procurement/IT) is not the end user.
Part of: references/domains/enterprise-tools/

---

Archetypes define what a site optimizes for at the architectural level — how pages connect, what narrative the site tells, and which user journey is prioritized.

**These are SITE-LEVEL archetypes** (what the overall site structure optimizes for). They are distinct from PAGE-LEVEL layout patterns in `patterns.md`, which define the internal structure of individual pages.

**Key differentiator from B2B SaaS:** The buyer ≠ the user. Procurement/IT evaluates and purchases; employees use the product. This dual-audience dynamic shapes every archetype — the site must serve evaluators AND champions simultaneously.

---

## Sales-Led Enterprise
**Optimizes for:** Qualified lead generation — demo requests, "Contact Sales," RFP responses. Every page funnels toward a human conversation.
**Best fit:** ERP (SAP, Oracle), HRIS (Workday), CRM (Salesforce), cybersecurity (CrowdStrike, Palo Alto Networks) — high ACV (>$25K), long sales cycles (3–12 months), multi-stakeholder buying committees (6–13 people per Gartner/Forrester).
**Sacrifices:** Self-serve experience, transparent pricing, speed-to-value for individual users. The product is invisible until a sales conversation happens.

**Site structure signal:**
- Homepage leads with authority and trust, not product features — customer logos, analyst recognition, enterprise-scale metrics
- Navigation: Solutions by industry/role first, then Platform/Product, then Resources
- Key pages: Solution pages (by industry and role), Customer Stories, Security & Compliance, Platform Overview, Request Demo
- Social proof: Named Fortune 500 references, Gartner/Forrester positioning, customer success metrics with attribution
- CTA everywhere: "Request a Demo" or "Talk to Sales" — never "Start Free Trial"

---

## Product-Led Enterprise
**Optimizes for:** Free trial or freemium adoption that leads to enterprise contract expansion. Bottom-up: individual users adopt → teams form → IT/procurement formalizes the purchase.
**Best fit:** Collaboration tools (Slack, Notion, Miro), developer tools (GitHub, GitLab), design tools (Figma) — products where individual value is immediate and team value compounds. The product sells itself before sales gets involved.
**Sacrifices:** Direct enterprise pitch on the homepage. The enterprise buyer discovers the product is already in use across the organization. Sales enters after product-qualified signals (usage thresholds, team creation, SSO requests).

**Site structure signal:**
- Homepage leads with product demonstration — interactive preview, product UI, "Get Started Free"
- Navigation: Product first, then Solutions/Use Cases, Pricing (with visible free tier), Enterprise (secondary)
- Key pages: Product tour, Pricing with freemium tier, Enterprise landing page (for when IT/procurement catches up), Integrations, Templates/Use Cases
- Social proof: Usage metrics ("Used by 100K+ teams"), organic adoption stories, "Built with [Product]" showcases
- Dual CTA: "Get Started Free" (primary) + "Contact Sales" (secondary, for enterprise)

---

## Platform/Ecosystem Enterprise
**Optimizes for:** Ecosystem adoption — integrations, marketplace, partner network, developer community. The platform's value is in the ecosystem, not just the core product. Network effects create lock-in.
**Best fit:** Salesforce (AppExchange), ServiceNow (Now Platform), Microsoft 365, SAP (partner ecosystem) — platforms where the marketplace and partner network are as important as the core product.
**Sacrifices:** Simple product narrative. The site must communicate platform vision, individual product capabilities, ecosystem breadth, and partner value simultaneously.

**Site structure signal:**
- Homepage positions the platform vision — "The platform for [domain]" — with routing to products, marketplace, and partners
- Navigation: Platform/Products (mega-menu with product suite), Marketplace/AppExchange, Partners, Solutions by Industry, Developer/API
- Key pages: Platform overview, individual product pages, marketplace/app directory, partner program, developer portal, industry solutions
- Social proof: Ecosystem metrics ("5,000+ apps," "10,000+ partners"), ISV/partner logos, platform adoption statistics
- CTA varies by audience: enterprise buyers → "Contact Sales"; developers → "Start Building"; partners → "Join the Partner Program"

---

## Archetype Selection

When choosing an archetype for enterprise tools:

1. **Go-to-market motion** — Sales-led (demo/RFP) vs. product-led (freemium/trial) vs. ecosystem (platform/marketplace)?
2. **ACV and sales cycle** — >$50K with 6–12 month cycles points to Sales-Led; <$25K with bottom-up adoption points to Product-Led
3. **Ecosystem dependency** — Does the product's value multiply with integrations and partners? If yes, Platform/Ecosystem

**Default combinations:**
- ERP, HRIS, cybersecurity: Sales-Led Enterprise
- Collaboration, dev tools, design tools: Product-Led Enterprise
- Platform with marketplace/partner network: Platform/Ecosystem Enterprise

### Cross-Reference with B2B SaaS

Enterprise tools overlap with B2B SaaS archetypes but with critical differences:
- **Sales-Led Enterprise** extends B2B SaaS Solution-Led with heavier compliance/security emphasis and no self-serve path
- **Product-Led Enterprise** extends B2B SaaS Product-Led with an enterprise expansion layer (the "land and expand" model)
- **Platform/Ecosystem** has no direct B2B SaaS equivalent — it requires marketplace and partner IA that standard SaaS sites lack

<!-- TODO: needs deeper research — hybrid archetype patterns where Sales-Led companies add PLG motions (e.g., Salesforce adding free Developer Edition) -->
