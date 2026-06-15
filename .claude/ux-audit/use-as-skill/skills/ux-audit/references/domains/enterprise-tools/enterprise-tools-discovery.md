---
type: knowledge
purpose: "Discovery questions and research framework for enterprise tools projects"
---
# Enterprise Tools: Discovery

Domain knowledge for enterprise tools sites — products where the buyer (procurement/IT) is not the end user.
Part of: references/domains/enterprise-tools/

---

## Enterprise Messaging Hierarchy

The sequence that answers each stakeholder's questions in order of importance. Unlike standard B2B SaaS, enterprise messaging must address organizational risk before individual value.

| Layer | Question | Validation Question | Where to Address |
|-------|----------|---------------------|------------------|
| **1. Authority** | "Can we trust this vendor?" | *Do they serve companies like ours?* | **Hero**: Named customer logos, analyst positioning, scale metrics. |
| **2. Relevance** | "Do they understand our world?" | *Do they speak our industry/role language?* | **Solution routing**: Industry/role-specific paths from homepage. |
| **3. Security** | "Is our data safe?" | *Can we pass procurement review?* | **Trust bar + Security page**: Certifications, architecture, compliance docs. |
| **4. Value** | "What is the ROI?" | *Can we build a business case?* | **Case studies + ROI calculator**: Quantified outcomes, methodology. |
| **5. Capability** | "Does it do what we need?" | *Does it fit our requirements?* | **Product/platform pages**: Features, integrations, enterprise-specific capabilities. |
| **6. Action** | "How do we evaluate further?" | *Is the next step clear and appropriate?* | **CTA**: "Request a Demo" / "Talk to Sales" with qualified form. |

## Rules
- **Authority before features**: Enterprise buyers ask "Can we trust this vendor?" before "What does it do?" Lead with trust signals.
- **Security is a gating criterion**: If the security page does not satisfy IT/procurement, nothing else matters. Elevate security to main navigation.
- **No self-serve pressure**: Enterprise conversion is a conversation. "Start Free Trial" as primary CTA signals the product is not enterprise-ready.
- **Every claim needs proof**: "Enterprise-grade" means nothing without SOC 2, uptime SLAs, and named references. Unsubstantiated claims erode trust.

---

## Enterprise Discovery Guidance

### Key Assumptions to Form

| Assumption | Why it matters | Confidence signal |
|------------|---------------|-------------------|
| **ACV range** | >$25K = Sales-Led default; >$100K = dedicated enterprise team assumed | Pricing page presence/absence, "Contact Sales" vs. visible pricing |
| **Sales motion** | Sales-led / product-led / hybrid? Determines primary CTA and site structure | Demo request prominence vs. free trial prominence |
| **Buying committee composition** | Which stakeholders? (IT, C-suite, procurement, end users) — determines how many content paths needed | "For [Role]" navigation, multiple persona-specific pages |
| **Required compliance certifications** | SOC 2, HIPAA, GDPR, FedRAMP, PCI DSS, ISO 27001 — determines security page scope | Industry vertical (healthcare = HIPAA, government = FedRAMP, finance = PCI DSS) |
| **Implementation complexity** | Self-serve vs. guided onboarding vs. professional services required | Presence of "Implementation" or "Onboarding" page, PS team mentions |
| **Existing tech stack integration needs** | Which systems must the product connect to? Determines integration page priority | Integration directory depth, API documentation presence |
| **Buyer ≠ user gap severity** | How different are the buyer's concerns from the user's? Wider gap = more content segmentation needed | Separate enterprise landing page, role-based navigation depth |
| **Competitive landscape** | Established category with Gartner coverage vs. emerging category | Analyst badge presence, comparison page strategy |

### Common Project Shapes

| Shape | Description | Default archetype | Key pages |
|-------|-------------|-------------------|-----------|
| **Enterprise SaaS marketing site** | Sales-led, high ACV, multi-stakeholder | Sales-Led Enterprise | Homepage, 3–5 solution pages, security, case studies, demo request |
| **Platform ecosystem site** | Marketplace + partner network + core product | Platform/Ecosystem | Platform overview, marketplace directory, partner program, developer portal, industry solutions |
| **Vertical SaaS for specific industry** | Deep domain expertise for one industry (healthcare, fintech, legal) | Sales-Led Enterprise (with industry-specific depth) | Industry-focused homepage, compliance page tailored to vertical regs, workflow-specific solution pages |
| **PLG with enterprise expansion** | Bottom-up adoption with enterprise upsell | Product-Led Enterprise | Product-led homepage, pricing with free tier, enterprise landing page, admin/team features |

### Unique Constraints

| Constraint | Impact on site architecture |
|-----------|---------------------------|
| **Buyer ≠ user dynamic** | Dual-audience content strategy — procurement evaluates security/compliance/ROI while end-users evaluate usability/features. Site needs role-based navigation or modular page sections. |
| **Long sales cycles (3–12 months)** | The site is revisited multiple times by different stakeholders. Each visit must provide new depth — not just a single-visit conversion funnel. Bookmark-friendly URLs, downloadable resources. |
| **Multi-stakeholder content needs** | 6–13 evaluators per deal (Gartner/Forrester). Each needs content for their specific evaluation criteria. A single product page is insufficient. |
| **Compliance/security requirements** | Security & compliance page is a top-3 destination. Must be in main navigation, not buried in footer. Downloadable evidence (whitepapers, DPA, certifications). |
| **No self-serve pricing** | Pricing page either does not exist or shows "Contact Sales" for enterprise tier. ROI calculator substitutes for price transparency. |
| **Implementation/onboarding complexity** | Post-sale experience matters as much as product capabilities. "Implementation" or "Getting Started" content reduces buyer anxiety about deployment risk. |
| **Procurement gate** | Procurement can veto a deal after all other stakeholders approve. DPA, subprocessor list, vendor assessment questionnaire, and data residency docs must be accessible without requiring a sales conversation. |

---

## Top Tasks by Persona

| Persona | Top 3 tasks on the site | Primary page destinations |
|---------|------------------------|--------------------------|
| **IT Decision Maker** | (1) Evaluate security posture, (2) Check integration compatibility, (3) Assess technical architecture | Security page, Integrations, API docs, Architecture overview |
| **Business Buyer (C-suite/VP)** | (1) Validate ROI potential, (2) Check analyst positioning, (3) Find industry-relevant case study | ROI calculator, Analyst recognition section, Case studies filtered by industry |
| **End User / Champion** | (1) Try the product, (2) Find team/admin features, (3) Build internal pitch | Free trial/demo, Enterprise features page, Downloadable pitch materials |
| **Procurement** | (1) Download compliance documentation, (2) Review data handling practices, (3) Assess vendor stability | Security page, DPA download, Compliance certifications, About/Company page |

---

## Primary Conversion

**Demo request or Contact Sales** — this is the enterprise equivalent of "Add to Cart."

The conversion is a conversation, not a transaction. The site's job is to generate a qualified lead with enough context for sales to have a meaningful first conversation.

**Conversion path by archetype:**
- **Sales-Led Enterprise**: Homepage → Solution Page (by role/industry) → Demo Request form
- **Product-Led Enterprise**: Homepage → Free Trial signup → (organic adoption) → Enterprise inquiry form (triggered by usage threshold or team expansion)
- **Platform/Ecosystem**: Homepage → Platform Overview → Solution Page or Marketplace → Contact Sales

**Supporting conversions** (secondary CTAs throughout the site):
- Security whitepaper download (gates procurement contact information)
- ROI calculator with emailed report (gates business buyer contact)
- Webinar/event registration (gates lower-intent leads for nurturing)
- Newsletter signup (lowest friction, longest nurture path)

<!-- TODO: needs deeper research — enterprise conversion rate benchmarks by ACV tier and industry vertical -->
