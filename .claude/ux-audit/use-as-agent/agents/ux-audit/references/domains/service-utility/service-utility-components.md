---
type: knowledge
purpose: "UI component library and patterns for service utility websites"
---
Follow §Communication Rules from agent.md
# Service-Utility: Components

Domain knowledge for service-utility UI components, anatomy, and anti-patterns.
Part of: references/domains/service-utility/

---

## Tool Interface Hero

**Goal:** deliver the tool's value above the fold, immediately usable.

**Anatomy:**
- Input field(s) or upload area — clearly labeled, with placeholder examples
- Action button — prominent, verb-based label ("Calculate," "Convert," "Generate," not "Submit")
- Output preview — visible area where results will appear (not a separate page)
- Format hints — inline guidance for expected input format

**Sizing:** the entire input-to-action flow must fit above the fold on desktop (≤600px height). On mobile, input + button above fold; output scrolls into view.

**Anti-patterns:**
- Hero image instead of the actual tool — wastes prime real estate on decoration
- Requiring signup before first use — kills conversion; tool-first means value-first
- Explaining the tool before showing it — "Our calculator helps you..." text above the tool pushes it below the fold
- Tiny input fields with large surrounding whitespace — the tool should dominate the viewport

---

## Result Display

**Goal:** present tool output clearly and actionably.

**Anatomy:**
- Result value — large, prominent typography. The number/output is the star.
- Context/explanation — what the result means, in plain language (e.g., "Your monthly payment would be $1,247")
- Action buttons — copy to clipboard, download, share link, print. Always present.
- Confidence/accuracy indicator — where applicable, show precision level or data freshness

**Behavior:** results should appear inline (same page), not on a new page. Use smooth scroll or animation to draw attention to the output area. Preserve inputs so the user can modify and recalculate without re-entering everything.

**Anti-patterns:**
- Burying the result in text — the number/output must be the most visually prominent element
- No copy button — users frequently need to paste results elsewhere
- Redirecting to a new page for results — breaks the single-page tool mental model
- Showing result and immediately covering it with a signup modal
<!-- TODO: needs deeper research — accessibility requirements for dynamically appearing results (ARIA live regions) -->

---

## Methodology Explainer

**Goal:** build trust that the tool is accurate.

**Anatomy:**
- Collapsible section (expanded by default on first visit, collapsed for returning users)
- Calculation method description — plain language, not academic
- Data sources — named and linked where possible
- Last updated date — critical for time-sensitive calculations (tax rates, exchange rates)
- Limitations disclaimer — what the tool does NOT account for

**Placement:** below the tool interface, above the fold only if space permits. Never between input and output.

**Anti-patterns:**
- No transparency about how results are calculated — breeds distrust
- Academic/technical language that users cannot verify — feels like obfuscation
- Missing update timestamps on time-sensitive data
- Disclaimers that undermine the tool ("This is for entertainment purposes only" on a financial calculator)

---

## Premium Upsell Banner

**Goal:** convert free tool users to paid.

**Anatomy:**
- Appears AFTER the tool delivers value, not before
- Specific benefit tied to the task just completed: "Need more? Upgrade for [specific premium feature]"
- Clear pricing — no "contact us for pricing" on utility tools
- Dismissible — never blocks the free result

**Timing:** show after the user has received their result. Ideal: after second or third use in a session (demonstrates habitual need).

**Anti-patterns:**
- Blocking the result behind a paywall (bait-and-switch) — destroys trust permanently
- Vague upsell ("Go Pro!") without specific value proposition
- Upsell that appears before the tool is used — user hasn't experienced value yet
- Non-dismissible overlay on the result

---

## Related Tools Grid

**Goal:** increase session depth by surfacing relevant tools.

**Anatomy:**
- 3-6 tool cards in a horizontal row or responsive grid
- Each card: tool name + one-line description + usage count or popularity indicator
- Cards link directly to the tool page (not to a description page)

**Selection logic:** related by task context, not by category taxonomy. A "PDF to Word" converter should show "Word to PDF," "PDF Merge," "PDF Compress" — not "Image to PNG" just because it's also a converter.

**Anti-patterns:**
- Unrelated tool suggestions — feels like spam, not like helpfulness
- Too many options (>6) — decision paralysis; this is a utility, not a catalog
- Cards that lead to description pages instead of directly to the tool

---

## Input Validation Feedback

**Goal:** prevent errors and guide correct tool usage.

**Anatomy:**
- Inline validation messages — appear next to the relevant field, not in an alert box
- Format hints — shown before the user types (placeholder text or helper text below field)
- Example inputs — "e.g., 250000" for a mortgage amount field
- Real-time feedback — validate as the user types or on blur, not only on submission

**Error message principles:**
- Say what went wrong AND what to do: "Enter a number between 1 and 100" not "Invalid input"
- Use neutral tone, never blame the user: "Amount must be positive" not "You entered an invalid amount"
- Preserve valid inputs when one field fails validation

**Anti-patterns:**
- Silent failure — tool produces no output and no error message
- Error messages only after submission — forces the user to re-enter all fields
- Technical error messages ("NaN," "undefined," "Error 422")
- Clearing all fields on validation failure

---

## Trust Badge Strip

**Goal:** establish credibility for first-time visitors arriving via search.

**Anatomy:**
- Compact horizontal strip below the tool or in the footer zone
- Elements: usage counter ("12M+ calculations"), methodology badge ("Bank-grade encryption"), data source ("Powered by [recognized source]"), media mentions
- Subtle — should not compete with the tool interface for attention

**Anti-patterns:**
- Fake or inflated numbers — users will check; getting caught destroys all trust
- Trust badges above the tool — pushes the tool below the fold
- Generic badges ("Trusted by millions") without specificity
<!-- TODO: needs deeper research — which trust signals have highest impact on tool-site conversion rates -->


---

## See Also

- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
