---
type: knowledge
purpose: "Site archetypes and reference examples for b2b saas websites"
---
# B2B SaaS: Strategic Archetypes

SaaS-specific domain knowledge for B2B SaaS sites.
Part of: references/domains/b2b-saas/

For base B2B archetypes (Solution-Led, Authority-Led, Education-First, Partner/Channel-Led, Marketplace/Two-Sided), see `b2b/b2b-archetypes.md` — loaded automatically with any b2b-* sub-type.

---

## Product-Led
**Optimizes for:** Feature discovery and self-service conversion.
**Best fit:** Strong product differentiation; product-aware or most-aware audience; self-serve or PLG motion.
**Sacrifices:** Top-of-funnel education; audience who doesn't yet know the product.

**Site structure signal:**
- Homepage leads with product demonstration or interactive preview
- Navigation: Product features first
- Key pages: Features, Pricing, Interactive Demo, Signup
- Social proof: Usage metrics, G2/Capterra ratings, integration logos

---

## Developer / Community-Led
**Optimizes for:** Time-to-first-API-call (or time-to-first-value). Conversion path is free tool → community adoption → paid plan. Documentation quality and developer experience are the primary conversion levers, not sales copy.
**Best fit:** API-first products (Stripe, Twilio), open-source with commercial layer (Vercel, Supabase), developer tools where individual adoption precedes organizational purchase, infrastructure products where developers influence 49% of buying decisions and 58% manage budgets.
**Sacrifices:** Lead capture. No gated content, no "Book a Demo" as primary CTA. Marketing-qualified leads are replaced by product-qualified leads (users who hit usage thresholds).

**Site structure signal:**
- Homepage opens with a code snippet or interactive demo, not a benefit headline. Hero CTA is "Get Started" or "Read Docs," not "Talk to Sales"
- Navigation: Docs, API Reference, Pricing, Blog, Community (GitHub/Discord link); enterprise as secondary nav item
- Key pages: Documentation hub (often the most-visited section), interactive playground/sandbox, changelog, status page, community forum, pricing with generous free tier
- Social proof: GitHub stars, npm downloads, community member count, "Built with [Product]" showcase — volume metrics over brand logos

---

## Archetype Selection

SaaS-specific archetype defaults:
- Single-product startup with strong product: Product-Led
- API-first / developer tools: Developer / Community-Led

### Variant Guidance

**Documentation Site as Format Variant:** A documentation site (`docs.company.com`) is a format variant, not a separate archetype. It is a sub-site within the Developer/Community-Led or any multi-page archetype with its own IA principles (search-first hero, sidebar navigation, version selector) but no independent conversion goal. In workflow routing, treat as a format alongside one-pager, multi-page, landing+subpages.
