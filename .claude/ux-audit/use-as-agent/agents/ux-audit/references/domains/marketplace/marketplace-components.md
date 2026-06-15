---
type: knowledge
purpose: "UI component library and patterns for marketplace websites"
---
Follow §Communication Rules from agent.md
# Marketplace: Component Library

Domain knowledge for two-sided marketplace sites.
Part of: references/domains/marketplace/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Dual-CTA Hero
**Goal:** Route two audiences from a single homepage without forcing a choice or creating decision paralysis.

### Anatomy
* **Primary action**: Search bar for demand side — the largest, most prominent interactive element. Includes placeholder text suggesting search terms ("Search for handmade gifts, vintage clothing...") and optional category dropdown.
* **Secondary action**: "Sell on [Platform]" as a text link or outlined button, visually subordinate but visible. Positioned above, below, or beside the search bar — never at equal visual weight.
* **Background**: Imagery or video showing marketplace breadth (product diversity, happy buyers/sellers). Avoid single-product hero images that suggest e-commerce, not marketplace.
* **Supporting text**: One-line value proposition for demand side ("Find unique [items/services] from [X] sellers").

### Anti-Patterns
* Split-screen 50/50 hero requiring self-identification ("I'm a buyer" / "I'm a seller") — forces a choice before the visitor has context, increases bounce.
* Role-selector modals or popups on first visit — interrupts browsing intent, especially for demand-side visitors who just want to search.
* Hiding the seller CTA entirely — misses supply-side acquisition from organic homepage traffic.

---

## 2. Listing Card
**Goal:** Compress a single listing into a scannable, comparable unit that enables rapid evaluation across search results and category pages.

### Anatomy
* **Primary image**: Square or 4:3 aspect ratio. High quality, seller-provided. Consistent aspect ratio across all cards for grid alignment.
* **Price**: Prominent, second-largest text element after the image. Currency symbol + amount. Strike-through for discounted prices.
* **Title**: Truncated to 2 lines maximum. Descriptive enough to differentiate from similar listings.
* **Seller rating**: Star display (1–5) + review count in parentheses (e.g., "4.8 (127)"). Visible without interaction.
* **Location / delivery info**: Shipping cost or "Free shipping" badge, estimated delivery time, or seller location for local/service marketplaces.
* **Save icon**: Heart or bookmark icon for wishlisting. Top-right corner of image.
* **Hover state** (desktop): Quick-view overlay or second product image. Reveals additional details without navigating away.

### Anti-Patterns
* No price visible on card — forces click-through just to evaluate, increases comparison friction.
* No seller rating visible — removes the primary trust signal from the browsing experience.
* Image carousel on card — adds interaction complexity to what should be a scannable unit; save carousel for the listing detail page.
* Inconsistent image aspect ratios — breaks grid alignment and creates visual noise.

---

## 3. Buyer Protection Badge
**Goal:** Transfer trust from individual sellers to the platform. The buyer doesn't need to trust every seller perfectly — the platform guarantees the transaction.

### Anatomy
* **Icon**: Shield icon (universally associated with protection and security).
* **Label**: "[Platform] Purchase Protection" or "Buyer Guarantee" — names the platform explicitly.
* **Description**: One-line explanation of what protection includes ("Full refund if item doesn't arrive or doesn't match description").
* **Placement**: Near purchase CTA on listing detail pages (adjacent, not below the fold). Also in the homepage trust and safety section.
* **Link**: "Learn more" text link to full protection policy page.

### Anti-Patterns
* Hiding protection details behind a link with no inline summary — the one-line description must be visible without clicking.
* Generic "Secure checkout" language without specifying what the platform actually guarantees.
* Placing the badge only in the footer — it must appear at the moment of purchase decision.

---

## 4. Seller Rating Display
**Goal:** Enable buyer trust assessment at a glance. Ratings are the marketplace's primary trust currency — they must be visible everywhere a seller appears.

### Anatomy
* **Star rating**: 1–5 stars, with half-star precision. Filled stars in brand accent color.
* **Review count**: Number in parentheses next to stars (e.g., "4.9 (342)"). Count matters as much as score — 4.7 with 500 reviews is more trustworthy than 5.0 with 3 reviews.
* **Verified badge**: "Verified Seller" label with checkmark icon if the seller has passed identity/quality verification. Only shown when earned.
* **Placement**: On listing cards (compact: stars + count). On listing detail pages (expanded: stars + count + verification badge + member-since). On seller profile pages (full: stars + count + badge + rating distribution breakdown).

### Anti-Patterns
* Showing rating without review count — a 5.0 rating with no count context is meaningless.
* Displaying ratings below 3.5 without additional context — indicates a quality problem the platform should address before surfacing.
* Using custom rating scales (1–10, percentage) instead of the universally understood 5-star system.

---

## 5. Category Browse Grid
**Goal:** Show breadth of marketplace supply and enable quick navigation for visitors who don't have a specific search term.

### Anatomy
* **Cards**: 8–12 category cards in a responsive grid (4 columns desktop, 2 columns mobile).
* **Card content**: Category image (lifestyle or representative product photo) + category name + optional listing count ("2,400 listings").
* **Image style**: Consistent treatment across all cards — either all lifestyle photography, all product-on-white, or all illustrated icons. Visual consistency signals curation.
* **Click target**: Entire card is clickable, routing to filtered search results or category landing page.

### Anti-Patterns
* Text-only category list — loses the visual browsing appeal that drives exploration and communicates marketplace breadth.
* More than 12 top-level categories on homepage — overwhelming; use sub-categories on dedicated browse pages.
* Stock photography that doesn't represent actual marketplace inventory — sets expectations the marketplace can't meet.

---

## 6. Transaction Volume Banner
**Goal:** Signal marketplace health, activity, and critical mass to both buyers and sellers. A thriving marketplace attracts more participants on both sides (network effect).

### Anatomy
* **Metrics**: 3–4 key numbers in a horizontal stat bar: total sales or GMV ("$2B+ in sales"), active sellers ("150,000+ sellers"), active buyers ("10M+ buyers"), geographic reach ("Available in 190 countries").
* **Format**: Large display numbers with context labels. Consistent formatting (all use "+" suffix for rounded numbers, or all use precise counts).
* **Layout**: Horizontal row on desktop, 2x2 grid or stacked on mobile. Full-width background band to distinguish from content sections.
* **Placement**: Homepage (below categories or above footer) and seller onboarding landing page.

### Anti-Patterns
* Showing metrics that reveal small scale — "500 sellers" amplifies smallness rather than signaling critical mass. If numbers aren't impressive yet, use qualitative proof instead ("Featured in TechCrunch," "Backed by [Investor]").
* Mixing incompatible metric types without a coherent story — pick metrics that together paint a picture of marketplace health.
* Displaying stale metrics without "as of" dates — enterprise or sophisticated sellers will question data freshness.


---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/evaluation.md` — LIFT, CCD, Nielsen heuristics, cognitive load
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
