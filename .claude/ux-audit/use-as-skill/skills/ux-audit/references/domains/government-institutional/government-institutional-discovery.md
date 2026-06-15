---
type: knowledge
purpose: "Discovery questions and research framework for government institutional projects"
---
# Government-Institutional: Discovery

Domain knowledge for government and institutional project discovery and scoping.
Part of: references/domains/government-institutional/

---

## Key Assumptions to Validate

| Assumption Area | Questions to Answer |
|---|---|
| **Government level** | Federal, state/regional, or municipal? Scope determines complexity, compliance requirements, and user base size. |
| **Primary services** | What services does this institution provide? Service delivery portal vs. informational site vs. regulatory database? |
| **Multilingual requirements** | Which languages are legally required? Is full translation mandated or only key pages? |
| **Accessibility compliance** | WCAG AA minimum — is AAA required? Which jurisdiction's accessibility law applies (ADA, EN 301 549, national legislation)? |
| **Design system** | Is there a mandated government design system (e.g., GOV.UK Design System, US Web Design System, local equivalent)? Must the site use it? |
| **Authentication** | Digital ID integration required (e.g., ePUAP in Poland, eIDAS in EU, Login.gov in US)? What identity verification level? |
| **Legacy systems** | What back-office systems must the site integrate with? What data formats are required? |
| **Content governance** | Who owns content? How many departments contribute? What's the approval workflow? |
| **Existing analytics** | What are current top tasks? Where do users abandon? What are the most-searched terms? |
| **Budget/procurement** | Government procurement rules apply — what are the constraints on technology choices? |

---

## Common Project Shapes

### Municipal Service Portal
**Scope:** 50-200 services, 1-3 languages, WCAG AA, citizen authentication via national ID.
**Key challenge:** Organizing services by citizen mental models rather than departmental silos.
**Typical timeline:** 6-12 months for initial launch, ongoing iteration.

### University Website
**Scope:** 5+ audience segments, 1000+ content pages, recruitment funnel for prospective students, service portal for current students.
**Key challenge:** Content governance across dozens of faculties and departments.
**Typical timeline:** 8-18 months, often tied to recruitment cycle.

### Hospital/Health System Site
**Scope:** Patient-facing services (appointment booking, results, provider directory) + institutional content.
**Key challenge:** HIPAA/health data compliance, integration with EHR systems, emergency information.
**Typical timeline:** 6-12 months, often phased.

### Regulatory Agency Site
**Scope:** Regulation database, filing portal, compliance guidance, public records.
**Key challenge:** Legal accuracy of content, document versioning, professional user efficiency.
**Typical timeline:** 8-14 months.

---

## Unique Constraints

- **WCAG compliance is legally mandated** — not a "nice to have." Budget must include accessibility testing with actual assistive technology users.
- **Plain language requirements** — many jurisdictions mandate plain language for public communications. Content must be reviewed for readability level.
- **Multilingual requirements** — often legally mandated, not just a business decision. Full translation including forms and error messages.
- **No analytics-driven optimization that excludes vulnerable users** — you cannot A/B test your way into removing an accessibility feature because "only 2% of users need it."
- **Government design systems** — many governments mandate specific design systems. Check before proposing any visual design.
- **Procurement rules** — technology choices may be constrained by government procurement frameworks and approved vendor lists.
- **Data sovereignty** — hosting and data storage often must be within national borders.
- **Archival requirements** — government content may need to be preserved and accessible for legal/historical purposes.

---

## Top Tasks (Priority Order)

1. **Complete a specific service** — Apply for permit, pay tax, renew license, register for something.
2. **Find specific information** — Eligibility requirements, deadlines, regulations, contact details.
3. **Check application status** — "Where is my application? Has it been processed?"
4. **Contact the right department** — Find phone number, email, office hours, physical location.
5. **Download forms/documents** — Many processes still require offline forms or supporting documents.

---

## Primary Success Metric

**Not applicable: government sites have no "conversion" in the commercial sense.**

Success = citizen completed their task. Metrics:
- Task completion rate (% of started services that are successfully submitted)
- Time on task (shorter is better — unlike media sites)
- Search success rate (% of searches that lead to a service page visit)
- Abandonment rate at each form step (identifies friction points)
- Support call volume (decreasing calls = site is working)
- Accessibility audit score (WCAG compliance percentage)

---

## Discovery Red Flags

- **"We want it to look modern"** — Aesthetics must never compromise accessibility or clarity. Push back on visual trends that reduce usability.
- **"Let's organize by department"** — Citizens don't know or care about internal org structure. Always organize by tasks and life events.
- **"We don't need multilingual"** — Check legal requirements. In many jurisdictions this is not optional.
- **"Accessibility will be Phase 2"** — Accessibility is not a feature to add later. It must be designed in from day one. Retrofitting is 10x more expensive.
- **"We'll use our existing CMS"** — Government CMSs are often outdated. Assess whether the CMS can support required accessibility standards, multilingual content, and form capabilities before committing.

<!-- TODO: needs deeper research on specific government design systems (gov.uk, USWDS, EU guidelines) and their wireframe implications -->
