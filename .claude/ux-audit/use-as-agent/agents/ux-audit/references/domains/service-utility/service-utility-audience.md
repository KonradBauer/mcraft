---
type: knowledge
purpose: "Audience profiles and user needs for service utility websites"
---
# Service-Utility: Audience

Domain knowledge for service-utility audience segments, mental models, and cross-domain migration warnings.
Part of: references/domains/service-utility/

---

## Audience Segments

### Task-Focused User

Has one specific need. Zero patience for anything between them and the tool.

- Mental model: "I need to convert this PDF to Word right now."
- Behavior: lands on page, uses tool, leaves. Total session: under 2 minutes.
- Needs: immediate tool access, zero friction, fast output.
- Tolerance for friction: effectively zero. Any signup wall, cookie banner that obscures the tool, or "watch this ad first" interstitial causes immediate bounce.
- Design implication: the tool must be usable within 3 seconds of page load.

### Repeat User

Returns regularly for the same tool. Bookmarks the page.

- Mental model: "My calculator site" — they've adopted the tool into their workflow.
- Behavior: direct navigation or bookmark. Skips homepage entirely.
- Needs: fast loading, remembers preferences/recent inputs, no friction on return visits.
- Tolerance for friction: low, but will tolerate minor changes if core workflow is preserved.
- Design implication: persistent state (last used settings, recent conversions), keyboard shortcuts, no re-onboarding on return visits.
<!-- TODO: needs deeper research — retention patterns and feature expectations for repeat tool users -->

### Comparison Shopper

Evaluating options through the tool. Using the calculator or checker to make a decision.

- Mental model: "Let me run the numbers before I decide."
- Behavior: enters multiple scenarios, compares results, may screenshot or share outputs.
- Needs: trustworthy results, transparent methodology, ability to adjust inputs and see changes.
- Tolerance for friction: moderate — willing to fill out a longer form if results are comprehensive.
- Design implication: save/compare functionality, exportable results, clear source attribution for data.

### Accidental Visitor

Arrived via SEO. May not know the brand.

- Mental model: "Google sent me here. Is this legit?"
- Behavior: scans for credibility signals before using the tool. May check multiple competing tools.
- Needs: immediate tool access + credibility signals that the result is accurate.
- Tolerance for friction: very low. Will hit back button within 5 seconds if the page looks untrustworthy or the tool isn't immediately visible.
- Design implication: trust indicators near the tool (usage count, last updated, methodology link), clean professional design, no aggressive popups.

---

## Primary Barrier

**Trust in tool accuracy.** "Is this calculator correct? Can I rely on this result?"

Unlike e-commerce (where the barrier is price/fit) or B2B SaaS (where it's feature comparison), service-utility sites live or die on perceived accuracy. A mortgage calculator that produces a number the user doubts is worse than useless — it actively damages trust.

Trust signals that matter:
- Methodology transparency ("How we calculate this")
- Data source attribution ("Rates updated daily from [source]")
- Social proof of accuracy ("Used by X professionals" or "X calculations performed")
- Last-updated timestamp
- Professional design quality (a poorly designed calculator feels inaccurate)

---

## Awareness Model

**Nearly irrelevant.** Visitors are task-aware, not product-aware. They searched for "mortgage calculator" not for the brand.

- Users arrive with full awareness of their need and zero awareness of the brand
- Brand building happens through repeated tool quality, not through marketing content
- The traditional awareness funnel (unaware → problem-aware → solution-aware → product-aware) collapses into a single state: "I need this tool now"
- Implication: homepage SEO matters more than brand campaigns; tool quality IS the marketing

---

## "Coming From X" Warnings

### Coming from B2B SaaS

Don't gate the tool behind signup. Tool-first sites must deliver value BEFORE asking for anything. Gating the core tool is conversion suicide.

- B2B SaaS instinct: "capture the lead first, deliver value second"
- Service-utility reality: value first, always. The tool IS the top of funnel.
- Signup should unlock extras (save results, history, premium features), never block the core tool.

### Coming from Media/Content

This is not content to be read. The visitor wants to DO something, not READ something. Minimize text, maximize interactivity.

- Media instinct: "write great content, visitors will engage"
- Service-utility reality: every word of text that pushes the tool below the fold is a conversion cost.
- Explanatory content belongs BELOW the tool, never above it.

### Coming from E-Commerce

There's no product catalog. The single tool IS the product. Navigation should be minimal.

- E-commerce instinct: "offer variety, let users browse"
- Service-utility reality: a single tool page should feel complete and self-contained. If you have multiple tools, the hub page handles discovery — individual tool pages should not distract with navigation.
