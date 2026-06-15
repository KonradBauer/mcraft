---
type: knowledge
purpose: "Design patterns and layout strategies for enterprise tools websites"
---
Follow §Communication Rules from agent.md
# Enterprise Tools: Page Layout Patterns

Domain knowledge for enterprise tools sites — products where the buyer (procurement/IT) is not the end user.
Part of: references/domains/enterprise-tools/

---

**Narrative arc: Authority → Proof → Conversation** — Enterprise page layouts invert the standard B2B SaaS pattern. Instead of Trigger → Guide → Outcome (product-led), enterprise pages follow:
- **Authority**: Establish credibility immediately — who trusts us, what analysts say, what scale we operate at
- **Proof**: Demonstrate capability through customer evidence, security posture, and platform depth
- **Conversation**: Route to a human interaction (demo, sales call) as the natural next step

---

## A. Enterprise Homepage
**Use when:** The product is enterprise-first (ACV >$25K, multi-stakeholder sales cycle, implementation required). The homepage must serve as a router for multiple stakeholder types.
**Core Narrative:** "The platform trusted by [industry] leaders to [outcome]."
**Focus:** Authority-first — trust signals before product features. The homepage is a credibility gateway, not a product tour.
**Structure:**
1. **Authority hero** (above fold) — Outcome headline addressing enterprise-scale pain ("Secure, scalable [category] for the Fortune 500"). CTA: "Request a Demo" or "Talk to Sales." Adjacent: enterprise customer logos (6–8 recognizable brands). Never "Start Free Trial" as primary.
2. **Customer logo bar** — Immediately below hero. 8–12 enterprise logos, monochrome. "Trusted by X of the Fortune 500" or "Powering [industry] at scale." Links to case studies where available.
3. **Solution routing by role/industry** — Card grid or tab navigation: "For IT Leaders," "For Business Leaders," "For [Industry]." Each card: role/industry label + one-line value proposition + link to dedicated solution page. This is the router — it prevents stakeholders from wading through irrelevant content.
4. **Platform overview with key capabilities** — 3–5 capability blocks (not feature lists). Frame as outcomes: "Enterprise-grade security," "Seamless integration," "Scale to 100K users." Visual: platform architecture diagram or product ecosystem map.
5. **Customer success metrics** — Stats block: 3–4 quantified outcomes from enterprise deployments. "Average 340% ROI over 3 years," "72% reduction in [metric]." Source attribution required — anonymous metrics lack credibility at enterprise scale.
6. **Security & compliance trust bar** — Horizontal bar with certification badges: SOC 2 Type II, ISO 27001, HIPAA, GDPR, FedRAMP (if applicable). "Enterprise-grade security" + link to dedicated security page. This appears higher on enterprise sites than SMB — security is a gating criterion.
7. **Analyst recognition** — Gartner Magic Quadrant positioning, Forrester Wave leader badge, G2 Enterprise rating. Current year only — outdated analyst reports damage credibility. Include methodology link.
8. **CTA section** — "Request a Demo" with 5–7 field form (work email, company, company size, role, use case). Alternatively, route to dedicated demo request page. Never chatbot as primary — enterprise buyers expect human contact.

---

## B. Solution Page (by Industry or Role)
**Use when:** The product serves multiple industries or roles, and each stakeholder needs content tailored to their specific challenges. Enterprise sites typically need 3–8 solution pages.
**Core Narrative:** "Here is how [our platform] solves [your specific challenge as a {role/industry}]."
**Focus:** Relevance — proving the product understands this audience's specific world.
**Structure:**
1. **Industry/role-specific hero** — Headline names the audience and their primary pain: "Streamline compliance for financial services" or "Give your IT team visibility across 10,000 endpoints." Visual: product UI in context of this industry/role.
2. **Pain points addressed** — 3–4 pain points specific to this audience, framed as questions or statements they would recognize: "Manual compliance reporting consuming 40 hours per audit?" Each pain point links to the relevant capability section below.
3. **Feature walkthrough relevant to this audience** — 3–5 capabilities shown through this audience's lens. Not generic feature names but contextualized: "Automated SOC 2 evidence collection" (for IT), "Real-time compliance dashboard for board reporting" (for C-suite). Annotated screenshots or workflow diagrams.
4. **Customer case study from same industry** — One featured case study: company logo, industry match, quantified result, 2–3 sentence summary, "Read full story" link. Industry match is critical — a healthcare company case study does not convince a financial services buyer.
5. **Integration ecosystem relevant to industry** — 8–12 integration logos specific to this industry's tech stack. Healthcare: Epic, Cerner, Allscripts. Financial services: Bloomberg, Refinitiv, Plaid. Shows platform fits their existing environment.
6. **CTA: See Demo / Talk to Sales** — Industry-specific routing: "See how [Product] works for [Industry]" or "Talk to our [Industry] specialist." Form may pre-fill industry field.

<!-- TODO: needs deeper research — optimal number of solution pages and diminishing returns threshold -->

---

## C. Security & Compliance Page
**Use when:** The product targets enterprise buyers where security/compliance is a gating criterion (virtually all enterprise tools). This page is often the second or third most-visited page for enterprise prospects.
**Core Narrative:** "Your data is safe with us — here is the proof."
**Focus:** Evidence-based trust. Every claim must have verifiable proof — certifications, audit reports, architecture details.
**Structure:**
1. **Certification badges** (above fold) — SOC 2 Type II, ISO 27001, HIPAA, GDPR, FedRAMP, PCI DSS — whichever apply. Each badge links to certificate or audit summary. "Last audited: [date]" adds freshness signal.
2. **Security architecture overview** — High-level architecture diagram: encryption at rest and in transit (AES-256, TLS 1.3), network segmentation, access controls. Technical enough for IT evaluation, scannable enough for business buyers.
3. **Data residency options** — Map or table showing available data center regions: US, EU, APAC, specific countries. Required for GDPR compliance and industry-specific regulations. Include data sovereignty commitments.
4. **Uptime & SLA commitments** — Historical uptime (99.9%+ expected), SLA tiers by plan, remediation commitments. Link to real-time status page. "99.95% uptime over the last 12 months" with source.
5. **Penetration testing & audit details** — Frequency of pen testing, third-party audit firm name (if disclosable), bug bounty program details. "Annual third-party penetration testing by [Firm]."
6. **Security whitepaper download** — Comprehensive security document (10–20 pages). Gate by work email only — procurement needs this for vendor assessment. Include DPA, subprocessor list, and incident response plan as separate downloads.
7. **Contact security team CTA** — "Have security questions? Talk to our security team directly." Dedicated security contact, not generic sales. Enterprise procurement teams expect a security-specific point of contact.

---

## Audit Checklists

### Enterprise Trust Hierarchy Check
Enterprise pages must follow this trust signal order (highest impact first):
1. **Named customer references** at similar scale and industry
2. **Analyst positioning** (Gartner, Forrester) — current year
3. **Compliance certifications** — verifiable, with audit dates
4. **Quantified customer outcomes** — attributed, time-bound
5. **Product capabilities** — last, not first (inverts standard SaaS hierarchy)

### Multi-Stakeholder Content Check
* Does every major page section serve at least one identified stakeholder persona?
* Can each stakeholder find their content within 2 clicks from the homepage?
* Does role-based navigation exist (tabs, dropdowns, or dedicated pages)?
* Are CTAs appropriate per stakeholder? (IT → security whitepaper; C-suite → ROI calculator; procurement → compliance docs)

### Enterprise Conversion Check
* Primary CTA is "Request Demo" or "Talk to Sales" — never "Start Free Trial" on enterprise-first pages
* Demo request form has 5–7 fields (work email, company, size, role, use case) — not 15+
* No personal email domains accepted (gmail, yahoo, hotmail blocked or flagged)
* Company size field enables lead routing (SMB → self-serve, enterprise → sales)

### Mobile Viability Check
* Tables: horizontal scroll with sticky first column, or stacked cards
* Certification badges: wrap to 2 rows maximum on mobile
* Demo request form: single column, field labels above (not inline)
* Solution routing cards: stack vertically, maintain tap targets (44px minimum)


---

## See Also

- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/evaluation.md` — LIFT, CCD, Nielsen heuristics, cognitive load
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination

---

**Cross-domain loading:** If project involves presenting substantial data, research results, or report content → load `data-content/` domain for visualization and layout patterns.
