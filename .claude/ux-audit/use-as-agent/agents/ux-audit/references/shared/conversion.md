---
type: knowledge
purpose: "cross-domain practical patterns for conversion optimization"
---
Follow §Communication Rules from agent.md
# Conversion Patterns

Cross-domain practical patterns for conversion optimization.
Used by: Wireframing (CTA and proof placement), Review (conversion audit).
Applies to: all site types with conversion goals (especially B2B SaaS, e-commerce, course, event).

---

## Social Proof Placement

**Impact:** High — Displaying reviews increases conversion by up to 270%. 93% of consumers say reviews influence purchase decisions.

**Key patterns:**
- Place strongest proof near CTAs — testimonials, ratings, trust badges directly adjacent to conversion buttons
- Use specific, measurable results: "Increased revenue by 34%" outperforms "Great product!"
- Include names, photos, company details for authenticity
- Video testimonials create deeper emotional connection
- Real-time activity indicators ("47 people viewing now") — effective but must be authentic

**Evidence:**
- WikiJob: 34% conversion increase from strategic testimonial placement
- Basecamp Highrise: 102.5% signup increase after adding customer photo + testimonial

**Anti-patterns:**
- Vague social proof ("trusted by thousands" with no specifics)
- Stock photos instead of real customer images
- Testimonials without attribution (name, company, role)
- Social proof contradicting page messaging (testimonial about "quality" on a "speed" page)

---

## Pricing Page Psychology

**Impact:** High — Direct revenue impact.

**Key patterns:**
- **Three tiers optimal** — people love choices but too many cause decision paralysis
- **Anchor with highest price first** — $99 feels reasonable when anchored against $999
- **Decoy effect** — add deliberately inferior option to make target option shine. Price gap max 10-20% to target. (Economist study: 84% chose most expensive with decoy present)
- **Visual highlight target tier** — color, size, "Most Popular" badge, CTA emphasis
- **Feature comparison** — bullet points and icons for side-by-side clarity, not marketing phrases
- **Combine with social proof** — "Chosen by 10,000+ teams" on target tier
- **Annual/monthly toggle** — show savings for annual commitment

**Anti-patterns:**
- More than 4 pricing tiers
- Misleadingly bad decoy option
- Hidden fees discovered at checkout
- No free tier or trial for SaaS
- Feature lists using internal jargon

---

## Sticky Element Rules

**Impact:** Medium — Nielsen Norman Group: sticky headers increase nav discoverability, but satisfaction drops when >20-30% of screen is occupied.

**Rules:**
- Content-to-chrome ratio: 10:1 minimum
- Sticky CTA helpful on long pages, harmful on short pages
- Test at 200% zoom on mobile viewports
- Can trigger CLS (layout shifts) and violate WCAG 2.4.11
- Add `scroll-padding-top` ≥ sticky element height

---

## Exit Intent Patterns

**Impact:** Medium-High — Exit-intent popups recover 10-15% of abandoning visitors. Average popup conversion: 3-5%, optimized campaigns reach double-digit rates.

**Five proven strategies:**
1. **Cart recovery discount** — "10% off if you complete your purchase now"
2. **Content upgrade** — match exit offer to page topic
3. **Social proof reinforcement** — testimonials at moment of doubt
4. **Authentic urgency** — countdown timer or low-stock notice (must be genuine)
5. **Conversational engagement** — "Is there something you couldn't find?" or live chat offer

**Anti-patterns:**
- Exit popup on every page
- Popup before user has engaged with content
- False scarcity or manufactured urgency
- No easy close button
- Popup blocking content on mobile

---

## Post-Conversion Experience

**Impact:** Medium-High — Thank you pages have captive audience. Including real person photo/video increases conversions by up to 80%.

### 3C Framework for Thank You Pages

1. **Confirm** — Express genuine gratitude, confirm what was achieved
2. **Clarify** — Set clear next-step expectations ("You will receive an email within 5 minutes")
3. **Continue** — Strategic second ask: related content, social sharing, survey, upsell, referral

**Wireframe component:**
```
┌─────────────────────────────┐
│ ✓ [Confirmation headline]   │
│ [Order/action summary]      │
│                             │
│ What happens next:          │
│ 1. [Step] — [timeframe]    │
│ 2. [Step] — [timeframe]    │
│                             │
│ [Secondary CTA: share/refer]│
│ [Related resources]         │
└─────────────────────────────┘
```

---

## Cookie Consent (Legal Compliance)

**Impact:** High — Austria 2025 ruling: colored Accept with gray Reject violates GDPR. Over 60% of users don't consent when given equal-choice banner.

**Key patterns:**
- Three-option first layer: Accept All, Reject All, Customize (IAB TCF v2.3)
- Button parity: identical size, color contrast, font weight, placement for Accept and Reject
- All non-essential toggles OFF by default
- Conversational microcopy focusing on user benefits ("Remembers your language preference")
- Preference center link in footer for return access

**Anti-patterns:**
- Pre-checked consent boxes
- Hidden Reject button
- Cookie wall blocking all content
- Auto-scrolling or time-pressure tactics
- Multiple layers of clicks to reject

---

## CTA Design

**Impact:** High

**Key patterns:**
- Outcome-oriented text ("Get My Free Report" not "Submit")
- Visual contrast from surrounding elements — distinct color, size, whitespace
- One primary CTA per viewport (CCD attention ratio 1:1)
- Above fold for primary action
- Repeat CTA after long content sections
- Ghost/outline for secondary actions to establish hierarchy
