---
type: knowledge
purpose: "UI component library and patterns for community websites"
---
Follow §Communication Rules from agent.md
# Community: Component Library

Domain knowledge for community and membership sites.

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Belonging Hero
**Goal:** Create immediate identity recognition and signal community scale.

### Anatomy
- **Community Name**: Prominent, brand-level treatment.
- **Identity Statement**: "[Community] is where [identity group] come to [shared activity]." Specific to the audience — not generic "Join our community."
- **Member Count**: Numeric display with social proof framing ("Join 5,247 members").
- **Avatar Collage**: 5-8 real member photos in overlapping row, signaling real people inside.
- **Primary CTA**: "Join [Community Name]" or "Become a Member."

### Anti-Patterns
- Generic "Join our community" without identity specificity — fails the belonging test.
- Stock photos instead of real member avatars — signals inauthenticity.
- Missing member count when community has 100+ members — wastes a trust signal.

---

## 2. Member Count Display
**Goal:** Signal community scale and legitimacy.

### Anatomy
- **Numeric Count**: Exact or rounded number ("5,247 members" or "5,000+ members").
- **Stacked Avatars**: 5-8 real member photos in overlapping thumbnail row.
- **Join CTA**: Inline with count — "Join 5,247 members →".

### Anti-Patterns
- Showing low count when community is new — use founder credibility and waitlist framing instead until 100+ members.
- Generic avatar placeholders instead of real photos — undermines the authenticity signal.
- Stale count that never updates — use dynamic or recently-updated numbers.

---

## 3. Sample Post / Content Preview
**Goal:** Show community experience without giving away full value.

### Anatomy
- **Post Author**: Avatar + display name + role/badge (if applicable).
- **Timestamp**: Relative time ("2 hours ago") to signal recency.
- **Post Excerpt**: ~100 words, truncated mid-thought to create curiosity.
- **Engagement Metrics**: Likes, replies, visible below the excerpt.
- **Blur Overlay**: Bottom of post blurs into a CTA — "Join to read full discussion."

### Anti-Patterns
- Best post from 6 months ago — suggests inactivity; always show recent content.
- Full untruncated posts — removes the gating incentive to join.
- Posts with zero engagement — ghost town signal; curate posts with genuine activity.

---

## 4. Activity Proof Banner
**Goal:** Prove the community is alive and active right now.

### Anatomy
- **Real-Time or Recent Metrics**: New discussions this week, live events scheduled, new members joined, replies posted.
- **Formatting**: Compact horizontal bar or card grid with icon + number + label.
- **Animated Counter** (optional): Rolling number animation draws attention and signals dynamism.
- **Cadence Label**: "This week" or "Last 7 days" to frame the timeframe.

### Anti-Patterns
- Static metrics that never update — defeats the "alive" signal.
- Vanity metrics without context ("10,000 messages" means nothing without timeframe).
- Metrics that expose low activity — hide this component if the community is in cold-start phase.

---

## 5. Membership Tier Card
**Goal:** Present access levels clearly with minimal decision friction.

### Anatomy
- **Tier Name**: Descriptive or aspirational ("Explorer," "Pro Member," "Founding Member").
- **Price**: Monthly amount + billing period. Show annual discount if available.
- **Feature List**: Checkmark list of what's included at this tier.
- **CTA**: Tier-specific action ("Start Free," "Go Pro," "Apply").
- **Recommended Badge**: Visual highlight on the suggested tier (border, "Most Popular" label, slightly larger card).
- **Reassurance**: "Cancel anytime" below CTA.

### Anti-Patterns
- Hiding the free tier or making it visually inferior — free members are the recruitment pipeline for paid.
- Too many tiers (more than 3) — creates decision paralysis.
- Missing "Cancel anytime" — the #1 objection for paid communities is lock-in anxiety.

---

## 6. Creator / Founder Block
**Goal:** Establish initial trust when community is creator-led.

### Anatomy
- **Photo**: Professional but approachable headshot.
- **Bio**: 2-3 sentences covering credentials and relevance to the community topic.
- **Credentials**: Specific proof points — audience size, publications, experience, notable work.
- **"Why I Built This" Statement**: 1-2 sentences explaining the personal motivation behind the community.

### Anti-Patterns
- Missing entirely from a community that's clearly creator-dependent — the creator IS the trust signal.
- Corporate bio tone in a personal community — authenticity matters more than polish.
- No credentials or proof points — "I'm passionate about X" without evidence doesn't build trust.


---

## See Also

- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
