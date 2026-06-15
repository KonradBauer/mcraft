---
type: knowledge
purpose: "Design patterns and layout strategies for documentation kb websites"
---
Follow §Communication Rules from agent.md
# Documentation & KB: Page Layout Patterns

Domain knowledge for documentation sites and knowledge bases.
Part of: references/domains/documentation-kb/

---

Documentation pages have no persuasion arc. There is no Trigger > Guide > Outcome narrative — structure serves findability and task completion. Every layout pattern below optimizes for the visitor finding the answer and leaving as fast as possible.

---

## A. Documentation Homepage
**Use when:** Entry point for a documentation site or developer portal.
**Core narrative:** None. Structure serves findability, not storytelling.
**Focus:** Route visitors to their answer as fast as possible.
**Structure:**
1. **Search-first hero** — Prominent search bar (full width or 60%+), placeholder text suggesting common queries, popular/recent searches displayed below. Search is the dominant first action, not a secondary nav element.
2. **Quick-start cards** — 3-4 cards for the most common entry points (Getting Started, API Reference, SDKs, Examples). Each card: icon + title + one-line description.
3. **Topic categories** — 6-12 domain-organized cards (Authentication, Payments, Webhooks, Testing). Each links to a category landing page. Organized by user task, not internal product structure.
4. **What's new** — Changelog entries, new feature documentation, migration guides. Signals active maintenance. 3-5 recent items with dates.
5. **Feedback / contribution** — "Was this helpful?" widget + "Edit on GitHub" link. Closes the quality feedback loop.

---

## B. API Reference Page
**Use when:** Product has API endpoints that developers need to integrate.
**Core narrative:** None. Pure reference material — completeness and accuracy over readability.
**Focus:** Every detail a developer needs to make a successful API call.
**Structure:**
1. **Endpoint header** — HTTP method badge (GET/POST/PUT/DELETE) + full path (`/v1/customers/{id}`). Method badge color-coded by convention (GET=green, POST=blue, DELETE=red).
2. **Description + authentication** — 1-3 sentences on what the endpoint does. Authentication requirements (API key, OAuth, scope). Rate limit information.
3. **Parameters table** — Name, type, required/optional, description, default value. Grouped by location (path, query, body). Nested objects expandable.
4. **Request/response examples** — Multi-language code tabs (cURL, Python, Node.js, Ruby, Go). Copy button per tab. Request and response shown side-by-side or sequentially.
5. **Error codes** — Table of possible error responses with HTTP status, error code, description, and resolution guidance.
6. **Related endpoints** — Links to related operations (list > get > create > update > delete for the same resource).

---

## C. Getting Started Guide
**Use when:** New user onboarding — first experience with the product or a major feature.
**Core narrative:** "Go from zero to working implementation."
**Focus:** Linear, no-skip, hand-holding progression. Every step must produce a visible result.
**Structure:**
1. **Prerequisites** — Exact requirements: language version, installed tools, account type, API key. Checkboxes or "verify" commands. Do not assume any prior setup.
2. **Step-by-step instructions** — Numbered steps with code blocks. Each step: what to do, the code/command, what happens when you run it. No steps that require inference.
3. **Expected output at each step** — Show what the terminal/browser/UI should display after each step. "If you see X, you're on track. If you see Y, check [troubleshooting link]."
4. **Next steps** — 3-4 links to logical continuations: deeper tutorials, API reference, configuration guide, example projects.

---

## D. Conceptual / Explanation Page
**Use when:** Visitor needs to understand how something works before they can use it (authentication flows, data models, architecture decisions).
**Core narrative:** "Here's the mental model you need."
**Focus:** Understanding, not action. Diagrams and examples over step-by-step instructions.
**Structure:**
1. **Overview paragraph** — 2-3 sentences answering "What is this and why does it matter?"
2. **Diagram or visual** — Architecture diagram, flow chart, or sequence diagram. Text alone is insufficient for conceptual content.
3. **Detailed explanation** — Broken into logical sections with clear headers. Each section builds on the previous.
4. **Examples** — Concrete scenarios showing the concept in practice.
5. **Related links** — How-to guides that apply this concept, API reference for relevant endpoints.

---

## E. Troubleshooting / FAQ Page
**Use when:** Visitor has a specific problem or error and needs a solution.
**Core narrative:** "Here's what went wrong and how to fix it."
**Focus:** Fast matching of symptom to solution.
**Structure:**
1. **Common issues list** — Scannable list of problems/symptoms at the top. Each links to its solution section below.
2. **Problem > cause > solution blocks** — Each issue gets: symptom description (what the user sees), cause (why it happens), solution (exact steps to fix), prevention (how to avoid it).
3. **Error code reference** — If applicable, a table mapping error codes to explanations and fixes.
4. **Escalation path** — "Still stuck?" link to support contact, community forum, or GitHub issues.

---

## Audit Checklists

### Content Quality Check
* **Every code example runs** — Copy-paste from docs into a fresh environment. If it fails, the docs fail.
* **Last-updated dates visible** — Every page shows when it was last reviewed. Stale content is worse than missing content.
* **Version accuracy** — Code examples specify which version they work with. Version selector defaults to latest.
* **Prerequisites stated** — No assumed knowledge. Every tutorial lists exact requirements.

### Navigation Quality Check
* **Search returns relevant results** — Test with 10 common queries. If search fails, the site fails.
* **Breadcrumbs on every page** — Visitor must always know where they are in the hierarchy.
* **Sidebar reflects current location** — Current page highlighted, parent sections expanded.
* **Deep links work** — Every heading has an anchor link. URLs are shareable and stable.

### Mobile Viability Check
* **Code blocks scroll horizontally** — Never wrap code. Horizontal scroll with visible scrollbar.
* **Sidebar collapses** — Left nav becomes hamburger or overlay on mobile.
* **Tables scroll** — Horizontal scroll with sticky first column.
* **Copy buttons accessible** — Code copy buttons must be reachable on touch.


---

## See Also

- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/emerging.md` — AI chat, dark mode, interactive demos, passwordless auth
