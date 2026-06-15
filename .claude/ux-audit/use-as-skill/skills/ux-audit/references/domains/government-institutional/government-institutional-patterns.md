---
type: knowledge
purpose: "Design patterns and layout strategies for government institutional websites"
---
Follow §Communication Rules from agent.md
# Government-Institutional: Page Patterns

Domain knowledge for government and institutional page layout patterns.
Part of: references/domains/government-institutional/

---

## Pattern A: Service Portal Homepage

**Core narrative:** "Find and complete the service you need."

**When to use:** Primary landing page for government service portals (municipal, state, federal).

**Structure:**

1. **Emergency/alert banner area** — Full-width, high contrast. Only for genuine emergencies or critical deadlines. Empty when not needed.
2. **Task-first search** — "What do you need to do?" Large search bar with autocomplete suggesting services ("renew driving license", "apply for building permit"). This is the #1 element on the page.
3. **Popular/common services grid** — 6-9 most-used services as cards with icons. Data-driven selection based on actual usage analytics.
4. **Life events navigation** — "I'm moving", "I'm having a baby", "I'm starting a business" — groups of related services organized by real-life situations rather than departments.
5. **News/announcements** — Recent changes to services, new deadlines, policy updates. Functional, not editorial.
6. **Footer with institutional info** — Contact, office locations/hours, accessibility statement, language selector.

**Anti-patterns:**
- Hero image with mayor's photo and mission statement instead of search
- Navigation organized by department name ("Department of Internal Affairs") rather than citizen tasks
- Carousel/slider of promotional content — citizens need tasks, not marketing
- Social media feeds taking prime real estate

---

## Pattern B: Service Detail / Form Page

**Core narrative:** "Here's exactly what you need and how to complete it."

**When to use:** Individual service pages where citizens learn about and complete a specific government service.

**Structure:**

1. **Service name and plain-language description** — What this service is, who it's for, in 2-3 sentences max. No jargon.
2. **Eligibility checker** — Quick yes/no questions to confirm the citizen qualifies before they invest time filling out forms.
3. **Required documents list** — Everything they need to have ready before starting. Specific: "Color copy of your passport photo page" not "identification document."
4. **Fee information** — Exact cost, accepted payment methods, fee waiver eligibility.
5. **Step-by-step form with progress indicator** — One section per screen. Clear progress bar. Save-and-return capability (citizens may need to gather documents mid-process).
6. **Help/FAQ sidebar** — Contextual help for the current step. Phone number for human assistance always visible.
7. **Estimated processing time** — "You will receive a decision within 14 business days."
8. **Submit + confirmation** — Clear confirmation page with reference number, next steps, and option to download/print confirmation.

**Anti-patterns:**
- Entire multi-section form on one page
- Jargon-heavy labels ("Submit Form ZP-3/A for adjudication")
- No save progress — citizen loses 30 minutes of work if browser closes
- No indication of processing time after submission
- Required documents revealed only mid-form

---

## Pattern C: Institutional Homepage (University / Hospital)

**Core narrative:** "Find what matters to you."

**When to use:** Multi-audience institutions where different visitor groups need fundamentally different content.

**Structure:**

1. **Audience router** — "I am a: prospective student / current student / faculty / parent / alumnus." Prominent, above the fold. Routes to audience-specific content hubs.
2. **Quick links per audience** — After audience selection, show 4-6 most relevant actions for that audience. For prospective students: "Programs", "Admissions", "Tuition", "Campus tour."
3. **News/events** — Institutional news, upcoming events. Builds trust and shows institutional activity.
4. **Emergency information** — Campus alerts, health advisories. Persistent access point.
5. **Search** — Prominent search for users who know what they want. Must search across all audience content.

**Anti-patterns:**
- One-size-fits-all homepage that serves no audience well
- Audience router hidden below the fold
- News section dominated by press releases irrelevant to primary audiences
- Internal organizational structure exposed in navigation (showing "Office of the Provost" instead of "Academic Programs")

---

## Pattern D: Regulation/Document Database Page

**Core narrative:** "Find the exact legal text or public record you need."

**When to use:** Regulatory agencies, legislative archives, court record systems.

**Structure:**

1. **Search with filters** — Full-text search plus structured filters: date range, document type, topic/category, status (active/repealed/proposed). Support both natural language ("rules about food safety") and exact citation ("21 CFR 117").
2. **Browse by category** — Topic-based navigation tree for users who don't know the exact document.
3. **Document view** — Full text with section anchoring, version history, related documents, effective dates. Print-friendly layout.
4. **Download options** — PDF, XML, plain text. Bulk download for professionals.
5. **Change alerts** — Subscribe to notifications when specific regulations are updated.

**Anti-patterns:**
- Search that only matches exact titles, not content
- No indication of whether a regulation is currently in effect
- PDF-only documents with no web-native view
- No version history — users can't determine which version applied on a specific date

<!-- TODO: needs deeper research on specific regulation database interfaces and international standards -->


---

## See Also

- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/localization-pl.md` — Polish market: BLIK, text expansion, dates, trust signals
- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure

---

**Cross-domain loading:** If project involves presenting substantial data, research results, or report content → load `data-content/` domain for visualization and layout patterns.
