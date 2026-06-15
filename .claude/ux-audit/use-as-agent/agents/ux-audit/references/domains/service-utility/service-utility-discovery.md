---
type: knowledge
purpose: "Discovery questions and research framework for service utility projects"
---
# Service-Utility: Discovery

Domain knowledge for service-utility discovery phase — assumptions, project shapes, and key questions.
Part of: references/domains/service-utility/

---

## Key Assumptions to Validate

| Assumption | Why it matters | Default if unasked |
|------------|---------------|-------------------|
| Single tool or multi-tool hub? | Determines navigation model and information architecture entirely | Single tool (Pattern A) |
| Monetization model (ads, freemium, affiliate, lead gen)? | Drives CTA placement, upsell component, and page structure | Freemium |
| Tool complexity (single input/output vs multi-step)? | Affects page layout — simple tools fit above the fold; complex tools need progressive disclosure | Single input/output |
| SEO-driven traffic? | If yes, long-form methodology content is critical for ranking; if no, minimize text | Yes — SEO is primary channel |
| Mobile usage percentage? | Tool interfaces are harder to optimize for mobile; high mobile usage requires touch-first input design | 50%+ mobile |
| Result accuracy requirements? | Medical/financial tools need disclaimers and sourcing; casual tools (generators) need less | Medium — show methodology |
| Existing brand awareness? | Determines whether trust-building is critical (no awareness) or secondary (known brand) | Low — trust signals needed |
| Data freshness requirements? | Real-time data (exchange rates, stock prices) vs static formulas (BMI, unit conversion) | Static formula |
| API/integration needs? | Premium tier often includes API access; affects architecture discussion | Not in scope for UX |

---

## Common Project Shapes

### Single Calculator/Converter Site

- One tool, one page (+ legal/about pages)
- Pattern A is the entire site
- SEO is the only acquisition channel
- Revenue: ads or freemium (batch processing, API)
- Scope: small — 3-5 pages total

### Multi-Tool Platform

- 10-100+ tools organized by category
- Pattern C hub + Pattern A tool pages
- Cross-tool discovery is the main UX challenge
- Revenue: freemium (usage limits across tools) or ads
- Scope: medium — hub + tool page template + category pages

### Comparison Engine

- Input form → results with provider links
- Pattern B is the core experience
- Trust and neutrality are the primary UX concerns
- Revenue: affiliate commissions or lead generation
- Scope: medium — input flow + results + provider detail pages

### Professional Service Lead-Gen Tool

- Free tool demonstrates expertise → consultation CTA
- Pattern A tool page + service pages
- The tool result must create an "I need help with this" moment
- Revenue: service sales (tool is marketing cost)
- Scope: small-medium — tool page + service/pricing pages + contact flow

---

## Unique Constraints for Service-Utility Sites

**Tool must work immediately** — no signup gate, no tutorial, no onboarding. The visitor has a task. Every second between landing and using the tool is a bounce risk.

**SEO is primary traffic driver** — tool pages must be optimized for "[tool type] + [modifier]" keywords. Content below the tool serves SEO, not the user (who already used the tool above).

**Page speed is critical** — tool pages compete on load time. A mortgage calculator that takes 4 seconds to load loses to one that takes 1 second. Minimize JavaScript payload, defer non-essential scripts.

**Result accuracy is trust-critical** — a single wrong result (or a result the user suspects is wrong) can permanently destroy the relationship. Methodology transparency is not optional.

**Tool IS the content** — there is no "content strategy" separate from the tool. The tool experience IS the content. Blog posts, guides, and articles exist only to support SEO and funnel users to the tool.

---

## Top Tasks (Priority Order)

1. **Use the tool** — enter input, get result (this is 90%+ of all visits)
2. **Get result** — copy, download, share, or act on the output
3. **Explore related tools** — discover complementary tools (multi-tool sites only)
4. **Upgrade to premium** — unlock advanced features (freemium model only)
5. **Understand methodology** — verify accuracy for high-stakes decisions
6. **Contact/get help** — report bugs, request features, ask about accuracy

---

## Primary Conversion by Archetype

| Archetype | Primary conversion | Secondary conversion |
|-----------|-------------------|---------------------|
| Free Tool with Monetization | Premium signup or ad impression | Email capture for tool updates |
| Comparison/Aggregator | Affiliate click-through | Lead form submission |
| Professional Service Tool | Consultation booking | Email report delivery |

---

## Discovery Questions Checklist

### Must-ask (block progress if unanswered)

- [ ] What does the tool calculate/convert/generate/compare?
- [ ] Who uses this tool and how often?
- [ ] How does (or will) this make money?
- [ ] What existing tools do users currently use for this task?

### Should-ask (assume if unanswered)

- [ ] What's the expected mobile vs desktop split?
- [ ] Are there regulatory/compliance requirements for the output?
- [ ] Will there be multiple tools or just one?
- [ ] What's the data source for calculations/comparisons?

### Nice-to-ask (inform refinement)

- [ ] What's the current bounce rate on tool pages (if redesign)?
- [ ] Are there seasonal usage patterns?
- [ ] What's the competitive landscape — who ranks #1 for target keywords?
<!-- TODO: needs deeper research — benchmark metrics for tool-site discovery (typical bounce rates, session durations, conversion rates by archetype) -->
