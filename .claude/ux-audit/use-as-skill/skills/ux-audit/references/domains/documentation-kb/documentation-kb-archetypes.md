---
type: knowledge
purpose: "Site archetypes and reference examples for documentation kb websites"
---
# Documentation & KB: Strategic Archetypes

Domain knowledge for documentation sites and knowledge bases.
Part of: references/domains/documentation-kb/

---

Archetypes define what a site optimizes for at the architectural level — how pages connect, what narrative the site tells, and which user journey is prioritized.

**These are SITE-LEVEL archetypes** (what the overall site structure optimizes for). They are distinct from PAGE-LEVEL layout patterns in `patterns.md`, which define the internal structure of individual pages.

**Key distinction from persuasion-oriented sites:** Documentation archetypes have no conversion funnel. There is no persuasion arc — the visitor already uses or evaluates the product. Success is measured by task completion, not by conversion.

---

## Utility-First Documentation
**Optimizes for:** Task completion speed. Core metric: time-to-answer.
**Best fit:** Developer tools (docs.stripe.com, Vercel docs), API platforms, open-source projects, complex SaaS with technical users.
**Sacrifices:** Everything persuasion-related. No heroes, no social proof sections, no pricing CTAs, no conversion funnels. Pure utility. A docs site that tries to sell undermines its purpose.

**Site structure signal:**
- "Homepage" is search bar + popular topics + quick-start links
- Navigation: persistent left sidebar with hierarchical topic tree, breadcrumbs, version selector
- Key pages: Getting started guide, API reference, tutorials, conceptual explanations, changelog, troubleshooting/FAQ
- Social proof: None traditional. Trust built through content quality — up-to-date examples, working code snippets. Community contributions (GitHub edit links) are the closest analog

---

## Knowledge Base / Help Center
**Optimizes for:** Self-service support deflection. Core metric: ticket deflection rate.
**Best fit:** SaaS support portals, consumer product help centers, internal knowledge bases.
**Sacrifices:** Technical depth. Content must be accessible to non-technical users. Jargon and code examples are replaced by step-by-step instructions with annotated screenshots.

**Site structure signal:**
- Homepage is category grid with search bar
- Navigation: category-first (not hierarchy-first), FAQ-style content organization
- Key pages: Category landing pages, step-by-step articles, troubleshooting guides, "Contact Support" fallback
- Search is critical — visitors arrive with a specific problem and expect immediate routing to the answer

---

## Product Documentation Hub
**Optimizes for:** Onboarding success and feature discovery for non-developer products.
**Best fit:** Complex SaaS tools (Salesforce, HubSpot), design tools, productivity suites — products where users are not developers but need to learn complex workflows.

**Site structure signal:**
- Homepage organized by user journey stages (Getting Started > Core Features > Advanced)
- Navigation: task-oriented ("How to...") rather than feature-oriented ("Settings API")
- Key pages: Getting started guides, feature walkthroughs, use case templates, video tutorials, best practices
- Content format: annotated screenshots and short videos preferred over code snippets

---

## Archetype Selection

When choosing an archetype:

1. **Audience technical level** — developers vs. end users vs. mixed?
2. **Content type** — API reference, how-to guides, troubleshooting, or a mix?
3. **Success metric** — time-to-answer, ticket deflection, or onboarding completion?

**Default combinations:**
- API-first / developer tools: Utility-First Documentation
- SaaS support portal: Knowledge Base / Help Center
- Complex non-developer SaaS: Product Documentation Hub
- Open-source project: Utility-First Documentation
- Internal company knowledge: Knowledge Base / Help Center
