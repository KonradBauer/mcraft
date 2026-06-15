---
type: knowledge
purpose: "UI component library and patterns for nonprofit websites"
---
Follow §Communication Rules from agent.md
# Nonprofit: Component Library

Domain knowledge for nonprofit / cause organization sites.
Part of: references/domains/nonprofit/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Mission Hero
**Goal:** Create emotional connection in <5 seconds and prompt action. The hero must answer "what does this org do?" and "why should I care?"

### Anatomy
* **Emotional image or video**: Featuring real beneficiaries (not stock photos), with consent
* **Mission headline**: Outcome-focused ("Every child deserves a safe place to sleep") not org-focused ("We are a 501(c)(3) organization")
* **"Donate" CTA**: High-contrast button, contrasting color from rest of nav
* **Secondary CTA**: "Learn How You Can Help" or "See Our Impact"

### Anti-Patterns
* ❌ Stock photos of happy diverse people (feels generic, reduces trust)
* ❌ Org-centric headline ("About Our Foundation" instead of the mission)
* ❌ No donation CTA in hero
* ❌ Video that autoplays with sound

---

## 2. Impact Metric Display
**Goal:** Translate abstract mission into concrete, countable results. Donors need to see giving leads to measurable change. Proof must feel earned, not decorative.

### Anatomy
* **3-4 large-format numbers** in a horizontal row
* Each: number (large, bold), label (short descriptor), icon (optional)
* Examples: "12,847 meals served" · "3,200 families housed" · "42 communities reached" · "98% of funds to programs"
* Optional: live counter or "this year" qualifier for recency
* **Before/after framing**: Pair a metric with its starting point ("From 12 wells to 340 wells in 3 years") to show trajectory, not just a snapshot
* **Beneficiary voice badge**: At least one metric anchored by a direct quote from a beneficiary — humanizes the number
* **Verified data indicator**: Small "audited" or "independently verified" label on metrics sourced from annual reports or third-party audits — builds trust without cluttering

### Anti-Patterns
* ❌ Vanity metrics without context ("10,000 social media followers")
* ❌ Stale numbers without time frame
* ❌ More than 4 metrics (dilutes impact)
* ❌ Metrics that don't relate to mission outcomes
* ❌ Numbers without trajectory — a single figure with no baseline feels unverifiable
* ❌ Verified badges on unverified claims — if the number is an estimate, label it honestly

---

## 3. Donation Form with Recurring Option
**Goal:** Make giving frictionless and encourage recurring donations. Every unnecessary field costs completions.

### Anatomy
* **Suggested gift amounts**: $25, $50, $100, $250 + custom field
* **Impact statements per amount**: "$25 = one week of meals for a child"
* **Recurring toggle**: "Make this a monthly gift" (default: one-time, but recurring visually prominent)
* **Donor info**: Name, Email, Payment (credit card, PayPal, Apple Pay)
* **Optional**: "Cover the processing fee" checkbox, dedication ("In honor of…")
* **Security badges** and SSL indicator
* **"Donate" button**: Contrasting color, large (not "Submit")

### Anti-Patterns
* ❌ More than 5-6 form fields
* ❌ No suggested amounts (choice paralysis)
* ❌ No impact statements with amounts
* ❌ No recurring option
* ❌ Redirecting to third-party payment page with different branding
* ❌ No security indicators

---

## 4. Beneficiary Story Card
**Goal:** Create emotional connection. People give to stories, not numbers.

### Anatomy
* **Authentic photo** of a real beneficiary (with consent)
* **Name and context**: "Maria, mother of three, Houston TX"
* **Narrative**: 2-3 sentences — before state → intervention → outcome
* **Quote** from the beneficiary
* **"Read full story →"** link
* **Embedded CTA**: "Donate to help more people like Maria"

### Anti-Patterns
* ❌ Stock photos
* ❌ Anonymous/depersonalized stories
* ❌ Exploitative imagery (poverty porn)
* ❌ No CTA linked to the story

---

## 5. Ways to Help Section
**Goal:** Provide multiple on-ramps for different commitment levels.

### Anatomy
* **Three clear paths**: Donate (primary), Volunteer (secondary), Advocate/Share (tertiary)
* Each: icon/image, brief description, dedicated CTA
* **Visual hierarchy**: Donate gets the largest card/most prominent position

### Anti-Patterns
* ❌ Only showing the donation path (alienates non-donor supporters)
* ❌ All three paths at equal visual weight (no prioritization)
* ❌ Too many options (more than 4 causes paralysis)

---

## 6. Financial Transparency Block
**Goal:** Address the #1 donor anxiety: "Will my money be used well?"

### Anatomy
* **Pie chart or breakdown**: "87¢ of every dollar goes directly to programs"
* **Charity rating badges**: GuideStar, Charity Navigator, BBB Wise Giving
* **Annual report link**: PDF or interactive report
* **Audit statement**: "Independently audited annually"

### Anti-Patterns
* ❌ No financial data visible on the site
* ❌ Vague statements ("We use donations responsibly") without numbers
* ❌ Outdated annual reports (more than 1 year old)

---

## 7. Volunteer / Get Involved CTA
**Goal:** Provide a non-monetary way to support the mission.

### Anatomy
* **Headline**: "Give your time" or "Get involved"
* **2-3 opportunity types** with descriptions and time commitment
* **"Sign Up to Volunteer" button** → simple form (name, email, interest area, availability)
* **Link to upcoming events** or volunteer orientation

### Anti-Patterns
* ❌ Burying volunteer opportunities below donation CTAs
* ❌ Extensive application forms for simple roles
* ❌ No description of what volunteering involves

---

## 8. Persistent Donate Button
**Goal:** Keep the primary conversion action accessible on every page.

### Anatomy
* **Button in main nav**: Contrasting color from other nav items, persistent on scroll
* **Label**: "Donate" or "Give Now"
* **Behavior**: Links to donation page or opens donation modal

### Anti-Patterns
* ❌ "Donate" button styled the same as other nav items (invisible)
* ❌ Donate link buried in footer
* ❌ Donate button that scrolls away with the page

---

## 9. Program Cards
**Goal:** Show what the organization actually does — convert abstract mission into concrete programs.

### Anatomy
* **Card grid**: 2-4 programs
* Each: program name, beneficiary-focused description, key outcome metric, "Learn More" link
* **Image**: Program in action (real photos)

### Anti-Patterns
* ❌ Org-speak ("Our Community Resilience Initiative" instead of "We help families find housing")
* ❌ No outcome metrics
* ❌ Internal jargon in descriptions

---

## 10. Newsletter / Updates Signup
**Goal:** Capture visitors who aren't ready to donate but want to stay engaged.

### Anatomy
* **Headline**: "Stay connected to our mission"
* **Email field** + "Subscribe" button
* **Privacy assurance**: "We respect your privacy. Unsubscribe anytime."
* **Frequency indicator**: "Monthly updates"

### Anti-Patterns
* ❌ Asking for too much info (name + email + phone + address)
* ❌ No frequency indication
* ❌ Aggressive popup before visitor engages with content


---

## 11. Donation Form Variants & Mobile Patterns
**Goal:** Serve two donor populations simultaneously — immediate givers (<60s) and deliberative givers who need proof first — while keeping mobile fully functional.

### Anatomy
* **Split-intent layout**: Form + express pay above the fold for immediate givers; impact proof, FAQs, and trust signals below the fold for deliberative givers
* **Sticky return anchor**: Floating "Continue donation" summary so scrolling donors never lose their place
* **Progressive disclosure on mobile**: Single visible page with accordion sections that expand one at a time — feels like steps without page navigation
* **Mobile rules**: Single-page form (two-step max only if step 1 captures amount + payment); no horizontal scroll; no forced landscape; no carousels pushing form down
* **Sticky CTA thumb-zone spec**: Bottom-center or bottom-right; 48px minimum height; above iOS safe area; shows selected amount when available ("Donate $50")

### Anti-Patterns
* ~~Forcing all donors through a narrative before showing the form~~
* ~~Multi-step wizard where a single page with progressive disclosure would suffice~~
* ~~Sticky CTA on the donation page itself (only on content pages)~~
* ~~Horizontal scrolling amount selectors on mobile~~
* ~~Sticky button that occludes content on screens narrower than 375px~~

---

## 12. Gift Amount Array Design
**Goal:** Minimize choice paralysis while nudging toward a sustainable gift size through anchoring and impact framing.

### Anatomy
* **4 preset amounts + "Other" field** as the default array; 3 + Other for high-urgency or pre-qualified audiences
* **1-2-5 ladder scaling**: Amounts follow roughly 1x-2x-5x-10x progression (e.g., $25, $50, $100, $250) — each step feels proportional and reduces cognitive load
* **Pre-select the second-lowest amount**: Avoids the "cheapest" default while keeping the ask accessible
* **"Other" field at equal visual weight**: Same size and prominence as preset buttons — never hidden or minimized
* **Impact-per-amount label**: One sentence under each preset ("$50 = school supplies for 3 children") — the single most reliable pattern for increasing average gift
* **Round numbers by default**: Specific numbers only when mapped to real, auditable impact units ("$28 funds 4 hygiene kits")
* **2x2 grid on mobile**: Thumb-friendly tap targets, not a horizontal row

### Anti-Patterns
* ~~Charm pricing ($19 instead of $20) — commercial pattern that feels manipulative in donation contexts~~
* ~~More than 5 preset options (decision fatigue)~~
* ~~Personalized anchors based on donor history without testing — can cause sticker shock and reduce conversion~~
* ~~Impact labels that cannot be verified or audited~~
* ~~Hiding "Other" behind a link or secondary UI~~

---

## 13. Recurring Donation Mechanics
**Goal:** Make monthly giving the default path and support the identity shift from "donor" to "sustainer" — recurring donors retain at ~83% vs ~44% for single-gift.

### Anatomy
* **Monthly-first default**: Monthly tab/toggle is pre-selected; one-time is one tap away and clearly labeled
* **Explicit frequency confirmation**: Summary step states frequency before submit ("Monthly donation of $25") — no dark patterns
* **Post-submit upgrade prompt**: After a one-time gift, offer a smaller monthly amount ("Your $100 one-time gift OR $15/month"); easy-skip button, no guilt language, clear math
* **Identity framing**: Label recurring donors as "sustainers" or "monthly partners" — not just a checkbox, but a role with meaning
* **Retention-aware design**: Confirmation email previews what the monthly relationship looks like (updates, reports, community access)

### Anti-Patterns
* ~~Pre-checking recurring without clear visual indication (dark pattern)~~
* ~~Recurring upsell on large one-time gifts (>$100) where it feels tone-deaf~~
* ~~Burying frequency selection below payment fields~~
* ~~No narrative justification for why monthly matters — treating it as a pricing option instead of an identity~~

---

## 14. Fee Coverage Checkbox
**Goal:** Let donors opt in to covering processing fees without adding friction at the worst possible moment or hurting retention.

### Anatomy
* **Always opt-in, never pre-checked**: Donor actively chooses to cover the fee
* **Placement**: After amount selection, before payment entry — not competing with the submit decision
* **Transparency wording**: Show real-time updated total ("Your gift: $50 + $1.50 processing = $51.50 today"); dollar amounts feel more concrete than percentages
* **Cap display at ~3%**: Frame the fee as a small, bounded addition
* **Gentle language for small gifts (≤$80)**: "Round up my gift" instead of "Cover our fees" — or omit entirely
* **Standard checkbox for larger gifts**: Neutral-to-positive impact on conversion above $80

### Anti-Patterns
* ~~Pre-checked fee coverage box (dark pattern, potential EU regulatory issue)~~
* ~~Showing the fee question at the moment of payment entry — maximum cognitive load~~
* ~~Percentage-only display without dollar amount~~
* ~~Guilt-inducing copy ("without fee coverage, we lose $X")~~

---

## 15. Thank-You Page
**Goal:** Close the emotional arc and convert the highest-intent moment into a second action. The story resolves here — not with a receipt, but with meaning.

### Anatomy
* **Emotional confirmation**: Donor's name + gift amount + impact restatement ("Your $50 provides clean water for 2 families this month")
* **ONE secondary CTA** (pick one per campaign): Recurring upgrade, social share, newsletter signup, or event registration — never a menu of competing options
* **Receipt access**: Visible link to tax receipt / email confirmation notice; immediate confirmation email triggered
* **Share prompt**: Pre-written social copy with one-click sharing; framed as amplifying impact, not self-promotion
* **Organization contact**: Email or phone for questions about the gift
* **Relationship framing**: "You've started something" language — not "you're done"

### Anti-Patterns
* ~~Generic "Thank you for your donation" with no impact language (46% of nonprofits do this)~~
* ~~Omitting the gift amount from the confirmation (36% of nonprofits do this)~~
* ~~Multiple competing CTAs — dilutes the post-gift moment~~
* ~~Treating the page as a dead end instead of a story resolution~~
* ~~Immediate re-ask for another donation~~

---

## 16. Express Checkout Buttons
**Goal:** Enable one-tap donation completion after amount selection by surfacing digital wallets as the primary payment path.

### Anatomy
* **Placement above card fields**: Express pay is the primary path, card entry is the fallback ("Or pay with card" link below)
* **Full-width buttons on mobile**: Not small icons — use standard Apple Pay / Google Pay branded button styles (brand guidelines require this)
* **Platform detection**: Show Apple Pay on iOS, Google Pay on Android; show both on desktop
* **Skip all form fields on wallet selection**: Name and email come from the wallet — no redundant entry
* **No forced account creation**: Wallet donations complete without requiring a site account
* **Trust signals adjacent**: Security badges and "encrypted" indicator near payment buttons

### Anti-Patterns
* ~~Express pay buried below card fields (afterthought positioning)~~
* ~~Requiring account creation before wallet payment~~
* ~~Custom-styled wallet buttons that violate Apple/Google brand guidelines~~
* ~~Showing wallet options the device does not support~~

---

## 17. Narrative Transportation UI Pattern
**Goal:** Sustain emotional immersion across the page so the donor stays in "story mode" rather than snapping back to "website mode" — transported visitors resist counterarguing and adopt narrative-consistent beliefs.

### Anatomy
* **Scrollytelling structure**: Content advances as the user scrolls; no pagination breaks that de-transport
* **Progressive reveal**: Story elements appear in sequence — situation, human moment, intervention, outcome — using scroll-triggered transitions
* **Visual pacing**: Full-bleed imagery for emotional beats; contained layout for informational beats; whitespace as pause between emotional peaks
* **Diegetic UI**: Interactive elements framed within the story ("Choose how you help Maria's village") rather than generic labels ("Select donation amount")
* **Narrative scent on links**: Every link promises and delivers emotional continuity — "See what your gift changes" lands on a page that immediately shows what gifts change
* **Campaign landings only**: Reserve for high-stakes campaign pages and key impact explainers — not the default for every page

### Anti-Patterns
* ~~Scrollytelling on evergreen informational pages (overkill, maintenance burden)~~
* ~~Interactive elements that break emotional continuity with "tool mode"~~
* ~~Full-bleed imagery used as decoration rather than narrative beat~~
* ~~Tonal jump-scares — abrupt shift from immersive story to administrative donation form~~

---

## 18. IPOP Content Model
**Goal:** Serve multiple visitor modes (analytical, emotional, evidential, participatory) on a single page without building separate experiences — derived from Smithsonian museum exhibition design.

### Anatomy
* **Ideas module**: The causal model of change — why this approach works, what theory of change drives the program (1-2 sentences, not academic)
* **People module**: A human moment — one face, one name, one quote; the identifiable person who makes the cause real
* **Objects / Evidence module**: Concrete artifacts — outcome numbers, photos of the work, verified data, financial transparency
* **Physical / Interactive module**: A small action the visitor can take on this page — choose an impact amount, explore a proof element, calculate personal contribution effect
* **All four present on key narrative pages**: Homepage, program detail, campaign landing, about page — each module can be lightweight but must exist

### Anti-Patterns
* ~~Pages that are all "People" (pure emotional appeal with no evidence)~~
* ~~Pages that are all "Objects" (data dumps with no human connection)~~
* ~~Interactive elements that feel like pricing tables commodifying suffering~~
* ~~Skipping "Ideas" — donors who need to understand the mechanism before feeling will disengage~~

---

## 19. Emotional Pacing / Load Map Module
**Goal:** Regulate emotional intensity across the page so donors sustain engagement without hitting compassion fatigue or pseudo-inefficacy. The page is an empathy regulator, not a one-way emotional ramp.

### Anatomy
* **Emotional load formula**: Intensity of affect content minus efficacy signals minus agency offered minus clarity of next step — if load is high, next module must bring it down
* **Pacing rhythm**: HIGH AFFECT (human story) → GROUNDING (how it works) → AGENCY (choose impact) → REST/DIGNITY (progress, hope) → repeat
* **Never stack 2+ high-distress modules** without a grounding or agency module between them
* **Tension-release pattern**: Borrow from screenwriting — alternate between empathy/tension and hope/efficacy; never dwell in one emotional register for more than two consecutive modules
* **Post-intensity recovery**: After a heavy story module, the next module increases clarity, dignity, or actionable specificity — never follows with statistics about scale (triggers pseudo-inefficacy)
* **Visual intensity mapping**: During wireframing, annotate each module section as HIGH / MEDIUM / LOW emotional intensity to verify the rhythm before build

### Anti-Patterns
* ~~Three consecutive high-distress modules without grounding (compassion fatigue trigger)~~
* ~~Overwhelming statistics placed adjacent to an individual's photo (pseudo-inefficacy: "my help is a drop in the ocean")~~
* ~~Treating emotion as a one-way ramp that culminates in a donate button~~
* ~~No recovery module between the heaviest story content and the donation form~~
* ~~Guilt left unresolved — distress without an immediate efficacy path increases avoidance, not giving~~

---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
