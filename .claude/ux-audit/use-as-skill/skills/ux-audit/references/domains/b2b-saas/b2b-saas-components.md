---
type: knowledge
purpose: "UI component library and patterns for b2b saas websites"
---
Follow §Communication Rules from agent.md
# B2B SaaS: Component Library

SaaS-specific component library.
Part of: references/domains/b2b-saas/

For shared B2B components (navigation, hero, trust bar, etc.), see `b2b/b2b-components.md` — loaded automatically.

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Feature Grid (Bento Style)
**Goal**: Education and Hierarchy for core features.

### Anatomy
* **Bento Grid**: Asymmetrical grid boxes.
    * *Large Box*: Primary differentiator.
    * *Small Boxes*: Secondary features.
* **Copy Rule**: Feature Name + "So that" [Benefit].

---

## 2. Feature Tabs (Module Switcher)
**Goal**: Comparison and Segmentation for complex products.

### Anatomy
* **Tabs**: Label by Persona (HR, IT, Sales) or Use Case.
* **Content Area**: Changes dynamically without page reload.
* **Visual**: Screenshot/Graphic changes with the tab.

---

## 3. How It Works (Technical Explainer)
**Goal**: Reduce fear of implementation friction.

### Anatomy
* **Steps**: Max 3-4 steps (Connect -> Configure -> Launch).
* **Visuals**: "Empty States" or rapid setup screens.
* **Integrations**: Logos of connected tools (Slack, CRM).

---

## 4. Interactive Demo (Product-Led)
**Goal**: Immediate value verification (Self-Service).

### Anatomy
* **Ungated Start**: Allow first interactions without email.
* **Format**: Lightbox or Full-width embed.
* **Guide**: Tooltips explaining "Aha!" moments.

---

## 5. ROI / Cost Calculator (Lead Magnet)
**Goal**: High-intent engagement (User inputs data = commitment).

### Anatomy
* **Inputs**: Sliders for variables (e.g., "Number of Users").
* **Output**: Dynamic savings/revenue projection.
* **CTA**: "Get Full Report" (Email gate).

---

## 6. Pricing & Plans
**Goal**: Anchor value and qualify users.

### Anatomy
* **Recommended Badge**: Highlight middle tier (Goldilocks Effect).
* **Checklists**: Distinct "What's missing" in lower tiers (upsell driver).
* **Toggles**: Monthly/Annual (gamify savings).
* **Enterprise**: "Contact Sales" but list features.

---

## 7. Comparison Table
**Goal:** Enable structured comparison between product and competitors (vs. pages) or between tiers (pricing pages). Reduces cognitive load by organizing decision criteria into a scannable grid.

### Anatomy
* **Column headers**: Product names with logos. Own product in leftmost data column or highlighted center.
* **Row labels**: Feature names in left column. Group by category with section headers ("Core Features," "Security," "Support").
* **Cell content**: Checkmarks (✓/✗) for boolean. Specific values for quantitative. Brief text for qualitative. Mix cell types for depth.
* **Highlight column**: Recommended option gets distinct background or top badge (center-stage effect).
* **Row count**: 8–12 visible by default. >15 features: use expandable sections. Excessive rows cause comparison fatigue.
* **Mobile fallback**: Horizontal scroll with sticky first column, or toggle between competitors one at a time.

### Anti-Patterns
* ❌ All-checkmark tables (no differentiation between what checkmarks mean).
* ❌ More than 4 comparison columns (cognitive overload — use filter or recommendation quiz).
* ❌ Outdated competitor data (update quarterly minimum — stale data destroys trust).
* ❌ No clear recommendation — the table must guide a decision, not just present data.

---

## 8. Integration Grid
**Goal:** Answer "Does it work with my stack?" — a gating question for technical buyers. Reduces adoption friction by showing compatibility.

### Anatomy
* **Section headline**: "Works with your stack" or "Integrates with 200+ tools." Include a count.
* **Integration tiles**: Tool logo + name + category tag ("CRM," "Analytics"). Click-through to integration detail page.
* **Category filter** (for 20+ integrations): Horizontal tabs/pills. Default view: "Popular" or "Featured."
* **Tile count**: 12–20 by default. >20: filtering needed. <8: use inline list instead of grid.
* **"Browse all" link**: Routes to integrations directory with search and categories.

### Anti-Patterns
* ❌ Logo images without tool names (visitors may not recognize every logo).
* ❌ No click-through to detail pages (logo alone doesn't answer "how deep is this integration?").
* ❌ "Coming soon" mixed with live integrations without clear differentiation.
* ❌ More than 20 tiles without filtering (Hick's Law violation).

---

## 9. In-App Screenshot Carousel
**Goal:** Show the product's actual interface in sequence — a guided tour building familiarity before trial. Different from bento grid (simultaneous features) — carousel shows flow and sequence.

### Anatomy
* **Caption per screenshot**: What the user is seeing. "Step 1: Import your data from CSV or API." Not "Dashboard view."
* **Hotspot annotations** (optional): 2–3 callouts per screenshot highlighting specific UI elements.
* **Navigation**: Dot indicators, left/right arrows, swipe support. Auto-advance every 5–7 seconds with pause on hover.
* **Device frame**: Browser or app frame for context — prevents screenshot from blending with page.
* **Count indicator**: "3 of 6" near navigation dots.

### When Carousel vs. Tab Switcher
* **Carousel**: Sequential flow (onboarding steps, workflow progression).
* **Tab switcher**: Parallel features (analytics, reporting, messaging) — any-order access.

### Anti-Patterns
* ❌ More than 8 screenshots (fatigue — visitors stop after 4–5; optimal: 4–6).
* ❌ No captions (screenshot alone doesn't communicate value).
* ❌ Auto-advance without visible navigation (loss of control).
* ❌ Low-resolution or clearly staged screenshots.

---

## 10. Sticky / Floating CTA
**Goal:** Keep primary conversion action accessible as the visitor scrolls past the hero on long pages. Increases conversions by ~27% on average.

### Anatomy
* **Button**: Visually distinct from nav CTA (different size, color, or position). Use different copy or add micro-copy.
* **Trigger offset**: Appears after hero CTA scrolls out of viewport (typically 600–800px scroll). Do not show on page load.
* **Position**: Bottom-right corner on desktop (floating pill or bar). Full-width bottom bar on mobile (≤56px height).
* **Dismiss**: Desktop: no dismiss needed (small, unobtrusive). Mobile: small "×" or auto-hide at footer.

### Mobile-Specific Rules
* Sticky bottom bar outperforms floating pill on mobile.
* Include CTA button and optionally one supporting line ("Free 14-day trial").
* Drawer variant (sliding up from bottom) increases orders by ~5.2%.

### Anti-Patterns
* ❌ Appearing on page load (redundant with hero, feels aggressive).
* ❌ Identical copy and styling to nav CTA (confusing — which to click?).
* ❌ Covering content on mobile (especially overlapping with cookie consent).
* ❌ Using on pages shorter than 2 viewports.

---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/composition.md` — Emotional Design, Buyer Legends, narrative arc frameworks
- `shared/evaluation.md` — LIFT, CCD, Nielsen heuristics, cognitive load
