---
type: knowledge
purpose: "Site archetypes and reference examples for b2b websites"
---
# B2B: Strategic Archetypes

Domain knowledge shared across all B2B site types.
Part of: references/domains/b2b/

---

Archetypes define what a site optimizes for at the architectural level — how pages connect, what narrative the site tells, and which user journey is prioritized.

**These are SITE-LEVEL archetypes** (what the overall site structure optimizes for). They are distinct from PAGE-LEVEL layout patterns in `patterns.md`, which define the internal structure of individual pages.

---

## Solution-Led
**Optimizes for:** Pain-point alignment and audience segmentation.
**Best fit:** Multiple distinct use cases or personas; problem-aware or solution-aware audience; consultative sales motion.
**Sacrifices:** Product feature depth on homepage; users who already know what they want.

**Site structure signal:**
- Homepage routes to use cases or industries
- Navigation: Solutions by role/industry first, then product
- Key pages: Solution pages (by persona), Case Studies, ROI Calculator
- Social proof: Named customers in target industries, result metrics

---

## Authority-Led
**Optimizes for:** Trust and credibility as the primary conversion mechanism.
**Best fit:** Professional services, consulting, agencies, or products in regulated industries where trust is the main barrier. Also: early-stage companies with strong thought leadership.
**Sacrifices:** Conversion speed; product feature visibility.

**Site structure signal:**
- Homepage leads with credentials, team, methodology, or notable clients
- Navigation: About/Team prominent; Resources/Blog significant
- Key pages: Team, Methodology, Case Studies, Speaking/Press, Contact
- Social proof: Named references, accreditations, publications, media appearances

---

## Education-First
**Optimizes for:** Long-term organic acquisition and trust building for unaware or problem-aware audiences.
**Best fit:** Novel product category requiring explanation; audience that needs to understand the problem before the solution; inbound content strategy is primary channel.
**Sacrifices:** Short-term conversion; bottom-of-funnel directness.

**Site structure signal:**
- Homepage positions the problem and category, not the product
- Navigation: Resources/Blog prominent; Product secondary
- Key pages: Blog, Guides, Glossary, Compare (category education), then Product
- Social proof: Authority signals (publications, subscribers, community size)

---

## Partner / Channel-Led
**Optimizes for:** Dual-entry routing — serving end clients AND recruiting/enabling partners (agencies, VARs, ISVs, consultants) without confusing either audience about who the site is for.
**Best fit:** Products sold primarily through channel partners (HubSpot Partners, Shopify Partners, AWS Partner Network), white-label platforms, and products where implementation requires certified partners.
**Sacrifices:** Direct conversion simplicity. The site must maintain two parallel funnels — direct customer acquisition and partner recruitment/enablement — which splits attention and increases navigation complexity.

**Site structure signal:**
- Homepage serves the end client as primary audience, with a persistent secondary entry point to the partner program (often in utility nav or footer, elevated to main nav for mature programs)
- Navigation: includes a "Partners" or "For Agencies" top-level link routing to a self-contained partner sub-site with its own hero, benefits, application CTA, and partner directory
- Key pages: Partner program landing page, partner directory/finder, partner portal login, certification/training pages, co-marketing resources
- Social proof: Partner count ("2,500+ certified partners"), partner logos with tier badges, end-client testimonials that mention the partner's role

---

## Marketplace / Two-Sided
**Optimizes for:** Simultaneous conversion of two distinct audiences — supply (sellers, freelancers, vendors) and demand (buyers, clients) — without one side's messaging cannibalizing the other.
**Best fit:** Platforms where both sides must reach critical mass — talent marketplaces (Toptal), review aggregators (G2, Clutch), service marketplaces (Upwork), B2B procurement platforms.
**Sacrifices:** Single-narrative clarity. The homepage cannot tell one linear story — it must route or layer. Emotional resonance is diluted because messaging must satisfy two incompatible mental models simultaneously.

**Site structure signal:**
- Homepage opens with a split hero or role-selector ("I'm hiring" / "I'm looking for work"), or a neutral value proposition with role-specific CTAs below
- Navigation: separate top-level paths per audience ("For Clients" / "For Talent") with shared utility pages (About, Trust, Blog)
- Key pages: Dual landing pages per audience, how-it-works (one per side), trust/safety page, success stories segmented by role, pricing (often different models per side)
- Social proof: Volume metrics ("500K+ freelancers," "12,000+ companies") and dual testimonials — one from each side per section

---

## Archetype Selection

When choosing an archetype:

1. **Awareness level** — what does the audience already know?
2. **Competitive position** — what is the differentiator?
3. **Sales motion** — self-serve vs. consultative?

**Default combinations:**
- Consultative sales with multiple personas: Solution-Led
- Trust-dependent / regulated industries: Authority-Led
- Novel category / content-driven acquisition: Education-First
- Channel-dependent distribution: Partner / Channel-Led
- Two-sided platforms: Marketplace / Two-Sided

### Variant Guidance

**Regulated Industry Variants:** Fintech, healthcare, and legaltech do not require separate archetypes — they require checklist additions applied on top of existing archetypes: compliance footer component, elevated trust bar with cert badges (SOC 2, HIPAA, PCI DSS), utility nav for regulatory content, "Request Access" pattern variant for gated features.

**Enterprise vs. SMB Format Defaults:** Same product signals "enterprise-first" when: ACV >$25K, multi-stakeholder sales cycle, implementation/onboarding required, or security/procurement/compliance mentioned. Enterprise defaults: "Talk to Sales" primary CTA, named customer references, dedicated enterprise page, security page in main nav. SMB defaults: self-serve signup, transparent pricing, product-led onboarding, community support.
