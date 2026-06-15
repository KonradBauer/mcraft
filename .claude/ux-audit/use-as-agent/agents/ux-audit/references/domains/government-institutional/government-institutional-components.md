---
type: knowledge
purpose: "UI component library and patterns for government institutional websites"
---
Follow §Communication Rules from agent.md
# Government-Institutional: Components

Domain knowledge for government and institutional UI components and wireframe elements.
Part of: references/domains/government-institutional/

---

## Task-First Search

**Goal:** Route citizens to the right service immediately without requiring them to understand the site's structure.

**Anatomy:**
- Large search bar, prominently placed (often the first interactive element on the page)
- Autocomplete suggesting services by name and keywords ("renew driving license", "apply for building permit", "pay property tax")
- Autocomplete groups results by category (Services, Information, Forms, Contacts)
- Popular/recent tasks displayed below the search bar as quick links
- Search works with plain language, not just exact service names

**Anti-patterns:**
- Hero image with institutional mission statement instead of search
- Requiring users to navigate menu hierarchies to find services
- Search that returns hundreds of results with no categorization or ranking
- Search limited to page titles — must search content and form names

**Wireframe notes:** Search bar should be minimum 50% of content width. Autocomplete dropdown should show 5-8 suggestions grouped by type.

---

## Life Events Navigation

**Goal:** Organize services by real-life situations rather than bureaucratic department structure.

**Anatomy:**
- Cards or links organized by life events: "Having a baby", "Moving home", "Starting a business", "Retiring", "Losing a loved one"
- Each event expands (or links) to show all relevant services across departments
- Icons or illustrations per event for scannability
- 6-10 life events covering the most common citizen needs

**Anti-patterns:**
- Organizing services only by department name ("Department of Internal Affairs" — meaningless to citizens)
- Life events that are too granular (dozens of micro-events) or too broad (3 events covering everything)
- No cross-departmental linking — a life event should pull services from multiple departments

**Wireframe notes:** Card grid, 2-3 columns. Each card: icon + event name + brief description ("All the services you need when you're expecting a child"). Click leads to event-specific service listing.

---

## Step-by-Step Form

**Goal:** Guide users through complex government forms without overwhelming them.

**Anatomy:**
- One question or logical section per screen
- Progress bar showing current step and total steps ("Step 3 of 7")
- Save-and-return capability with unique reference code (citizens may need to gather documents mid-process)
- Plain-language labels — not form field IDs or legal codes
- Inline help text explaining what each field means and why it's needed
- Real-time validation with specific error messages ("Enter your PESEL number — it's the 11-digit number on your ID card")
- Summary/review screen before final submission
- Clear confirmation page with reference number

**Anti-patterns:**
- Entire form on one page (30+ fields visible at once)
- Jargon-heavy labels without explanation
- No save progress — citizen loses work if browser closes or session times out
- Generic error messages ("Invalid input" without explaining what's wrong)
- No progress indicator — user doesn't know how much is left
- Session timeout without warning — critical for users who need time

**Wireframe notes:** Single-column layout. One primary question/section visible. "Continue" button at bottom. "Save and return later" link. Help text as expandable accordion or persistent sidebar. Progress bar at top.

---

## Audience Router

**Goal:** Direct diverse audiences to relevant content from a single homepage.

**Anatomy:**
- "I am a..." selector with 4-6 audience types
- Each audience type leads to a tailored content hub with relevant quick links
- Persistent in navigation so users can switch audiences
- Remembers selection via cookie for return visits (with consent)

**Anti-patterns:**
- Forcing all audiences through the same content path
- Too many audience options (more than 6 creates decision paralysis)
- Audience labels using internal terminology ("Stakeholder" instead of "Business Partner")
- No way to access content for other audiences after initial selection

**Wireframe notes:** Prominent placement above the fold. Can be horizontal tabs, card grid, or dropdown. Each option: audience label + 1-line description of what they'll find.

---

## Alert/Emergency Banner

**Goal:** Surface critical time-sensitive information above all other content.

**Anatomy:**
- Full-width banner at the very top of the page, above navigation
- High contrast colors (red for emergencies, yellow/amber for warnings, blue for informational)
- Concise message with link to details
- Dismissible but persistent across pages during the emergency period
- Severity levels: Emergency (red), Warning (amber), Informational (blue)

**Anti-patterns:**
- Using alert banner for non-urgent content or promotions
- Alert that cannot be dismissed (blocks content permanently)
- Multiple simultaneous alerts creating "alert fatigue"
- Low-contrast alert that blends into the page

**Wireframe notes:** Full viewport width. 40-60px height. Icon + text + link + close button. Fixed to top of viewport or top of page depending on severity.

---

## Accessibility Toolbar

**Goal:** Provide user-adjustable accessibility options beyond browser defaults.

**Anatomy:**
- Font size controls (A- / A / A+) with 3-5 size levels
- High contrast toggle (at minimum: default + high contrast dark + high contrast light)
- Text-to-speech activation or link to assistive reading mode
- Language selector (especially in multilingual jurisdictions)
- Usually positioned in utility navigation bar above main navigation
- Settings persist across sessions via cookie (with consent)

**Anti-patterns:**
- Hiding accessibility options in footer or settings page
- Accessibility toolbar that is itself not accessible (ironic but common)
- Font size controls that break page layout at larger sizes
- No persistence — user must re-adjust on every page visit

**Wireframe notes:** Utility bar, top-right corner. Small but always visible. Icon-based controls with text labels. Should not interfere with main navigation.

<!-- TODO: needs deeper research on specific government accessibility patterns across jurisdictions and mandated tooling requirements -->

---

## Status Tracker

**Goal:** Let citizens check the progress of their submitted application or request.

**Anatomy:**
- Reference number input for anonymous lookup
- Authenticated dashboard view for logged-in users showing all their applications
- Visual progress indicator (submitted → under review → decision made → completed)
- Estimated completion date per stage
- Notification preferences (email/SMS when status changes)
- Download/print capability for status confirmation

**Anti-patterns:**
- No status tracking at all — citizen submits and gets no feedback
- Status limited to "processing" with no granularity
- Requiring authentication just to check basic status (reference number lookup should work)
- No estimated timelines

**Wireframe notes:** Status as horizontal stepper with current step highlighted. Below stepper: details for current step, estimated completion, and any required actions from the citizen.


---

## See Also

- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/localization-pl.md` — Polish market: BLIK, text expansion, dates, trust signals
- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
