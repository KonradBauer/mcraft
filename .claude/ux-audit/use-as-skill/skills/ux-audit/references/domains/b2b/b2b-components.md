---
type: knowledge
purpose: "UI component library and patterns for b2b websites"
---
Follow §Communication Rules from agent.md
# B2B: Component Library

Domain knowledge shared across all B2B site types.
Part of: references/domains/b2b/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Global Navigation (The Control Center)
**Goal**: Reduce interaction cost; allow mental modeling in milliseconds.

### Anatomy
* **Sticky Header**: Persists on scroll.
* **Labels**: Descriptive (e.g., "HR Analytics") NOT Generic ("Products").
* **Role-Based Segmentation**: "For Marketers" / "For Developers" (Dropdowns).
* **Primary CTA**: Imperative Verb (e.g., "Book a Demo") - Right aligned.
* **Utility Links**: Login, Support (Visual weight < 30% of Primary CTA).

### Anti-Patterns
* ❌ "Home" text link (Use Logo).
* ❌ Organized by Format (Videos/Whitepapers) -> Use Topics instead.

---

## 2. Hero Section (The Hook)
**Goal**: Pass the 5-second relevance test.

### Anatomy
* **Eyebrow**: Uppercase categorization (e.g., "AI-POWERED CRM").
* **H1 Headline**: Outcome + Time/Magnitude (e.g., "Close books 5x faster").
* **Subhead**: The "Mechanism of Action" (How it works).
* **Visual**: Product Interface (UI) or Context-of-Use Video.
* **Social Proof Injection**: "Trusted by..." micro-text near CTA.

### Layouts
1. **Split Screen (50/50)**: Text Left / Visual Right (Standard).
2. **Centered Stack**: Cinematic, best for brand dominance.

---

## 3. Trust Bar (Social Proof - Logos)
**Goal**: Immediate risk reduction (Bandwagon Effect).

### Anatomy
* **Style**: Monochrome (Grayscale), 50% Opacity.
* **Content**: 5-6 Recognizable Logos or Quantitative Proof ("$5B Processed").
* **Placement**: Immediately below Hero.

---

## 4. Value Proposition Strip (Sub-Hero)
**Goal**: Reinforce "Why Us" immediately if Hero is visual-heavy.
**Usage**: Alternative to Trust Bar for niche solutions.

### Anatomy
* **Format**: Full-width band with background color.
* **Content**: 3 Icons + Short Benefit Blurbs (e.g., "Fast Setup", "Secure", "24/7 Support").
* **Risk**: Do not stack directly with Trust Bar (choose one or space them out).

---

## 5. PAS Module (Problem-Agitation-Solution)
**Goal**: Build empathy before selling features.

### Anatomy
1. **Problem**: "Manual entry eats your weekends." (Validation)
2. **Agitation**: "Error rates increase 40%." (Consequence/Cost)
3. **Solution**: "Automate with 1-click." (The Relief)

### Layouts
* **Zig-Zag**: Alternating Text/Image rows.
* **3-Column Cards**: Icon + Pain Point.

---

## 6. Social Proof (Testimonials & Cases)
**Goal**: Deep validation and "Relatability".

### Anatomy
* **Testimonial Cards**: Card UI with Quote + Face + Role. (Avoid Sliders if possible).
* **Case Study Snippet**: "Client Logo" + "Result Metric" + "Read Story" link.
* **Placement**: Mid-funnel (after Features).

---

## 7. FAQ (Objection Handling)
**Goal**: Kill objections (Security, Contract, Support) without a meeting.

### Anatomy
* **Format**: Accordion (Expandable).
* **Key Topics**: SOC2/GDPR, Onboarding Time, Cancellation Policy.

---

## 8. Forms (Lead Capture)
**Goal**: Pipeline entry.

### Anatomy
* **Top-of-Funnel**: Email only.
* **Bottom-of-Funnel**: Enrichment (Role, Company Size).
* **Micro-Copy**: "No credit card required" (Risk Reversal).
* **Error Handling**: Inline validation (Real-time).

---

## 9. Fat Footer (Safety Net)
**Goal**: Catch-all and Legitimacy.

### Anatomy
* **Legal**: Privacy Policy (Mandatory), Terms.
* **Status**: Copyright Year (Dynamic).
* **Badges**: Security (SOC2, ISO).

---

## 10. Announcement Bar
**Goal:** Surface time-sensitive information (feature launches, events, promotions) without disrupting navigation. Creates urgency and signals product momentum.

### Anatomy
* **Strip container**: Full-width bar above main navigation, 32–40px height, distinct background color (brand accent or contrasting neutral).
* **Message text**: Maximum 80 characters including CTA link. Format: "[Announcement] → [CTA label]".
* **CTA link**: Inline text link or small button routing to detail page (blog post, changelog, feature page).
* **Dismiss control**: Small "×" on right. Dismissal persists via cookie for session or 7 days. After dismissal, nav reclaims the space.

### Anti-Patterns
* ❌ Using as a permanent navigation element (should be temporary and dismissable).
* ❌ Stacking multiple announcement bars (maximum one at a time).
* ❌ Text exceeding 80 characters causing wrapping on mobile.

---

## 11. Stats / Metrics Block
**Goal:** Communicate scale, impact, or credibility through 3–4 quantified data points. Distinct from Trust Bar (logos) — Stats Block answers "How big/effective/fast?" while Trust Bar answers "Who uses this?"

### Anatomy
* **Metric value**: Large display number with formatting (e.g., "12M+", "99.9%", "340%"). Largest reasonable type size — scannable from a distance.
* **Context label**: 2–5 words below each metric (e.g., "API requests per day"). Makes the metric meaningful.
* **Source link** (optional): Small text link to methodology. Adds credibility for enterprise buyers.
* **Layout**: 3 metrics in a row on desktop, stacked or 2+1 on mobile. 4 maximum — beyond 4, impact dilutes.

### Anti-Patterns
* ❌ Metrics without context labels ("12M+" means nothing alone).
* ❌ Mixing metric types (don't combine "users" + "uptime" + "countries" — tell one coherent story).
* ❌ Using when numbers aren't impressive (50 customers amplifies smallness — use Trust Bar instead).
* ❌ Vague metrics: "Thousands of users" fails. "12,847 teams" passes.

---

## 12. Mid-Page CTA Section
**Goal:** Re-engage visitors who scrolled past the hero CTA and consumed enough content to be ready for action.

### Anatomy
* **Hook line**: One sentence connecting preceding content to the action. "Ready to see it in action?" Not a repeat of the hero headline.
* **Primary CTA button**: Matches primary conversion action but with contextually different copy. Hero: "Start Free Trial." Mid-page after features: "Try It Free for 14 Days."
* **Micro-copy** (optional): One line reducing commitment anxiety. "No credit card required."
* **Visual treatment**: Distinguished by background color change or contained card styling. Must feel intentional, not intrusive.

### Anti-Patterns
* ❌ More than 2 per homepage (CTA fatigue signals desperation).
* ❌ Identical copy to hero CTA (feels repetitive, not contextual).
* ❌ Placing before visitor has received enough information to act.

---

## 13. Logo Grid (Customers)
**Goal:** Communicate customer volume and brand quality in a dedicated section. Distinct from Trust Bar (hero-adjacent, 4–6 logos) — Logo Grid makes social proof by breadth the primary message.

### Anatomy
* **Count label**: "Join 500+ companies" or "Trusted by 12,000+ teams" above the grid. Always include a count.
* **Logo grid**: 12–24 logos, responsive (4 columns desktop, 2 mobile). Monochrome (grayscale) for visual unity.
* **Sort logic**: By brand recognition, not alphabetically. Most recognizable logos in top-left (natural reading order entry point).
* **Hover state** (optional): Grayscale → color on hover, with tooltip and optional case study link.
* **"View all" link**: If >24 customers, link to dedicated page. Never show 100+ logos in one grid.

### Anti-Patterns
* ❌ 4–6 logos as a "Grid" (that's a Trust Bar — Grid needs volume).
* ❌ Alphabetical sorting (wastes top-left attention on "Acme Corp" instead of "Google").
* ❌ Including logos of companies no longer customers.

---

## 14. Video Embed / Demo Reel
**Goal:** Show the product in action. Bridges gap between benefit claims and feature reality, reducing uncertainty before trial.

### Anatomy
* **Thumbnail**: Custom designed (not auto-generated). Shows product UI, not a person talking. Centered play button overlay.
* **Runtime badge**: Small pill in bottom-right showing video length ("2:14"). Visitors calibrate commitment before clicking.
* **Caption**: One line: what the viewer will see. "Watch: Setting up your first workflow in 90 seconds."
* **Transcript link**: Text link for accessibility and SEO.
* **Hosting**: Wistia or Vimeo for business (analytics, no suggested videos). YouTube only if SEO visibility outweighs competitor suggestion risk.

### Placement Rules
* Below the fold on homepages (hero → value prop → video). Above the fold on product pages where video IS the primary content.
* Never autoplay with sound. Autoplay muted with captions acceptable on landing pages only.

### Anti-Patterns
* ❌ Videos longer than 3 minutes on landing pages (optimal: 60–120 seconds).
* ❌ YouTube embeds showing competitor suggestions at end-of-play.
* ❌ No thumbnail (black rectangle signals "generic webinar").
* ❌ Placing video above the headline — headline must contextualize what the visitor will watch.

---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/evaluation.md` — LIFT, CCD, Nielsen heuristics, cognitive load
