---
type: knowledge
purpose: "UI component library and patterns for enterprise tools websites"
---
Follow §Communication Rules from agent.md
# Enterprise Tools: Component Library

Domain knowledge for enterprise tools sites — products where the buyer (procurement/IT) is not the end user.
Part of: references/domains/enterprise-tools/

**Source of Truth** for enterprise-specific component structure and behavioral psychology.

---

## 1. ROI Calculator
**Goal:** Quantify value for the business buyer — arms the internal champion with a defensible business case. High-intent engagement: user inputs their own data, creating commitment and personalized output.

### Anatomy
* **Input fields**: Company size (employees or seats), current annual spend on the problem, time spent on manual processes (hours/week), number of affected teams/departments. 4–6 inputs maximum — more creates abandonment.
* **Slider controls**: For numeric inputs — sliders with editable number fields. Pre-populated with industry-median defaults so the calculator shows value immediately, before customization.
* **Calculated output**: Dynamic savings/ROI projection. Show: annual cost savings, time savings, ROI percentage, payback period. Format as a summary card with 3–4 headline metrics.
* **Methodology link**: Small text link to calculation assumptions. Enterprise buyers will question methodology — transparency builds trust.
* **CTA**: "Get Full Report" (email-gated PDF with detailed breakdown) or "Discuss These Numbers with Sales." The report becomes a shareable artifact for the buying committee.

### Anti-Patterns
* ❌ Unrealistic assumptions that destroy credibility (e.g., "Save 90% of costs" with minimal input).
* ❌ No methodology transparency — enterprise buyers will reject black-box calculations.
* ❌ Requiring email before showing ANY results — show summary first, gate the detailed report.
* ❌ Inputs that require data the visitor does not have handy (e.g., "What is your annual IT infrastructure spend?" — too specific for a first visit).

---

## 2. Multi-Stakeholder Navigation
**Goal:** Route different buyer personas to relevant content without forcing all audiences through one generic product page. Solves the buyer ≠ user problem at the navigation level.

### Anatomy
* **Format options**: (a) Top-nav dropdown: "Solutions for IT" / "Solutions for Business Leaders" / "Solutions for Developers." (b) Homepage card grid acting as a router. (c) Tab interface on key pages segmenting content by role.
* **Label convention**: "For [Role]" not "By [Department]." Role labels match how visitors self-identify: "For IT Leaders" not "For Information Technology."
* **Content per path**: Each role path leads to a dedicated landing page (or page section) with role-specific: pain points, features, case studies, and CTA. Minimum 3 distinct paths for enterprise tools.
* **Escape hatches**: Every role-specific page includes navigation back to the general product view. Visitors may explore multiple role paths.

### Anti-Patterns
* ❌ Forcing all audiences through one generic product page — the CTO and procurement officer have fundamentally different questions.
* ❌ More than 5 role paths in navigation — creates decision paralysis (Hick's Law). Consolidate to 3–4 primary paths.
* ❌ Role labels that do not match visitor self-identification ("Enterprise Solutions" means nothing — "For IT Teams Managing 500+ Endpoints" is specific).
* ❌ Dead-end role pages without cross-navigation to other stakeholder content.

---

## 3. Security Trust Bar
**Goal:** Address enterprise security concerns immediately — security is a gating criterion, not a nice-to-have. Appears higher on enterprise sites than standard B2B SaaS.

### Anatomy
* **Format**: Horizontal bar, full-width, distinct background (light gray or subtle brand tint). Appears below hero or at section transitions.
* **Certification badges**: SOC 2 Type II, ISO 27001, HIPAA, GDPR, FedRAMP — rendered as recognizable badge icons. Each links to the security page or certificate.
* **Headline text**: "Enterprise-grade security" or "Your data, protected" — short, authoritative.
* **Link**: "Learn about our security →" routing to dedicated Security & Compliance page.
* **Placement**: Hero-adjacent (within first viewport) on enterprise-facing pages. Footer-only placement is insufficient for enterprise audience.

### Anti-Patterns
* ❌ Hiding security info in the footer only — enterprise IT evaluators scan for security signals in the first 10 seconds.
* ❌ Generic "We take security seriously" without specific certifications — claims without evidence are worse than no claims.
* ❌ Outdated certification badges (show year of last audit; stale badges erode trust).
* ❌ Mixing security badges with generic trust signals (G2 ratings, customer count) — keep security distinct.

---

## 4. Customer Logo Bar (Enterprise)
**Goal:** Signal enterprise credibility through brand association. Enterprise buyers need to see companies of similar size and industry — SMB logos actively harm enterprise credibility.

### Anatomy
* **Logo count**: 6–10 logos. Enough for breadth, few enough for recognition. Monochrome (grayscale) for visual unity.
* **Headline**: "Trusted by X of the Fortune 500" or "Powering [category] at [Company], [Company], and [Company]." Named references > generic counts.
* **Logo selection criteria**: Prioritize (1) industry match with target audience, (2) brand recognition, (3) company scale. A healthcare enterprise tool should show hospital systems and pharma companies, not generic tech logos.
* **Click-through** (optional): Logo links to relevant case study. Increases engagement and provides deeper proof.
* **Placement**: Immediately below hero. Second most important trust signal after the headline.

### Anti-Patterns
* ❌ Showing SMB logos to enterprise audience — signals the product is not ready for enterprise scale.
* ❌ "500+ customers" without named logos — enterprise buyers want to know WHO, not just how many.
* ❌ Logos without permission (legal risk and trust risk if discovered).
* ❌ More than 12 logos in the hero-adjacent bar — becomes visual noise. Use a Logo Grid component for larger collections.

---

## 5. Analyst Badge
**Goal:** Third-party credibility via analyst recognition. Enterprise buyers rely on analyst firms to reduce evaluation burden — a Gartner Leader position can shortcut months of evaluation.

### Anatomy
* **Badge visual**: Official Gartner Magic Quadrant graphic, Forrester Wave positioning, G2 Enterprise Grid. Use the analyst firm's official badge artwork (licensed).
* **Context line**: "Named a Leader in the 2026 Gartner Magic Quadrant for [Category]." Always include: analyst firm, report name, positioning, and year.
* **Link**: Routes to gated or ungated analyst report summary, or to a landing page where the full report can be requested.
* **Placement**: Homepage (section 6–7, after customer proof), Enterprise landing page, and in the navigation mega-menu as a featured resource.
* **Freshness**: Current year only. Analyst reports older than 18 months should be removed — stale reports signal declining market position.

### Anti-Patterns
* ❌ Outdated analyst reports (must be current year or previous year maximum — 2024 reports in 2026 actively damage credibility).
* ❌ Cherry-picking obscure analyst firms — Gartner, Forrester, IDC are the recognized authorities. Niche analyst mentions belong in a "Recognition" page, not homepage.
* ❌ Displaying the badge without context ("Leader" means nothing without the category and year).
* ❌ Using analyst positioning from a different product category than what the visitor is evaluating.

---

## 6. Demo Request Form
**Goal:** Capture qualified enterprise leads with enough information for sales routing while minimizing friction. This is THE primary conversion mechanism for enterprise tools — the equivalent of "Add to Cart" in e-commerce.

### Anatomy
* **Required fields** (5–7 maximum):
  - Work email (block personal domains: gmail, yahoo, hotmail)
  - Full name
  - Company name
  - Company size (dropdown: 1–50, 51–200, 201–1000, 1001–5000, 5000+)
  - Use case or department (dropdown or free text)
* **Optional fields** (2–3 maximum):
  - Job title/role
  - Timeline ("When are you looking to implement?")
  - "What brings you here today?" (dropdown for lead routing: evaluating options, replacing current tool, new initiative)
* **Form behavior**: Inline validation (real-time). Work email domain enrichment (auto-fill company name, size from Clearbit/ZoomInfo). Confirmation page with next steps and expected response time.
* **Micro-copy**: "We will reach out within 1 business day" (sets expectation). "Your data is protected under our privacy policy" (links to policy).
* **Placement**: Dedicated page (/demo or /contact-sales) + embedded in key pages (enterprise landing, solution pages). Never as a popup.

### Anti-Patterns
* ❌ Requiring personal email — enterprise leads come from work domains; personal emails are unqualifiable.
* ❌ Too many required fields (15+ fields kills conversion). Every additional field reduces completion by ~7%.
* ❌ No confirmation or next-step communication — enterprise buyers need to know what happens after they submit.
* ❌ Chatbot as the only contact mechanism — enterprise buyers expect to reach a human, not a bot. Chatbot can supplement but not replace the form.
* ❌ "Start Free Trial" as the only CTA — many enterprise products require guided implementation and cannot be self-served.

<!-- TODO: needs deeper research — optimal field count benchmarks specifically for enterprise ACV >$50K vs. $25K–$50K -->


---

## See Also

- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/evaluation.md` — LIFT, CCD, Nielsen heuristics, cognitive load
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
