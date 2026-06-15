---
type: knowledge
purpose: "UI component library and patterns for ecommerce websites"
---
Follow §Communication Rules from agent.md
# E-commerce: Component Library

Domain knowledge for e-commerce / DTC sites.
Part of: references/domains/ecommerce/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Product Card
**Goal:** Enable quick quality assessment and comparison across a grid without clicking into each PDP.

### Anatomy
* **Product image**: Primary, with hover-to-show-second-angle on desktop
* **Product name**: Descriptive ("Merino Wool Crew Sweater" not "The Essential")
* **Price**: With strikethrough original if on sale + savings amount/percentage
* **Star rating + review count**: "★★★★☆ 2,847 reviews"
* **Quick-add button** or size selector (reduces clicks to cart)
* **Badge**: "New" / "Best Seller" / "Low Stock"

### Anti-Patterns
* ❌ Missing price on card
* ❌ Image-only with no product info on hover
* ❌ "Quick View" modals that load slowly
* ❌ More than 4 products per row on desktop, 2 on mobile

---

## 2. PDP Hero (Product Detail Page)
**Goal:** Provide enough information above the fold to trigger "add to cart" for product-focused shoppers.

### Anatomy
* **Image gallery**: 3-5 images minimum (product on white, lifestyle, scale reference, detail/texture, UGC photo)
* **Product title + subtitle/variant**
* **Price** + "or X payments of $Y with Afterpay/Klarna"
* **Star rating + review count** (clickable, jumps to reviews)
* **Variant selectors**: Size, color with visual swatches (not dropdowns)
* **"Add to Cart" button**: High contrast, full width on mobile, visible without scrolling
* **Shipping estimate**: "Free shipping · Arrives by Mar 3"
* **Trust micro-copy** beneath CTA: "Free returns · Secure checkout"

### Anti-Patterns
* ❌ Add-to-cart button below the fold
* ❌ Horizontal tabs for product details (27% of users overlook them — use vertical accordion)
* ❌ Auto-playing video that delays image loading
* ❌ Missing price on PDP

---

## 3. Review / UGC Block
**Goal:** Provide "people like me" validation. Products with reviews are 270% more likely to sell.

### Anatomy
* **Aggregate score** + total review count
* **Rating distribution**: Bar chart (5-star → 1-star)
* **Filters**: By rating, by verified purchase, by photo
* **Individual review cards**: Star rating, reviewer name, "Verified Purchase" badge, text, photos, "Helpful" vote
* **Customer photo gallery**: From submitted reviews

### Anti-Patterns
* ❌ Hiding negative reviews (reduces trust more than showing them)
* ❌ No photo reviews
* ❌ No filter/sort options

---

## 4. Cart Sidebar / Mini-Cart
**Goal:** Enable add-to-cart without full page navigation. Keep shopper in browsing flow.

### Anatomy
* **Slide-out panel** or drawer (not a new page)
* **Line items**: Thumbnail, name, variant, quantity, price
* **Quantity adjuster**: +/- buttons
* **Order subtotal**
* **Free shipping progress bar**: "Add $23 more for free shipping!"
* **"Checkout" primary CTA** + "Continue Shopping" secondary
* **Cross-sell**: "Frequently bought together" (1-2 items max)

### Anti-Patterns
* ❌ Full page redirect on "Add to Cart"
* ❌ No upsell/cross-sell
* ❌ Missing free-shipping threshold indicator

---

## 5. Category / Collection Page
**Goal:** Enable browsing and filtering across product groups. The primary shopping interface for browsers and researchers.

### Anatomy
* **Category header**: Name, brief description, hero image (optional)
* **Filter sidebar** (desktop) / filter drawer (mobile): Price range, size, color, material, rating
* **Sort control**: Relevance, price low→high, price high→low, newest, best-selling, top-rated
* **Product grid**: 3-4 columns desktop, 2 columns mobile
* **Results count**: "Showing 48 of 124 products"
* **Pagination or infinite scroll** with "Load More" button

### Anti-Patterns
* ❌ No filters on 50+ product collections
* ❌ Infinite scroll without "back to top" or position memory
* ❌ Filters that cause full page reload
* ❌ Missing product count

---

## 6. Announcement / Promo Banner
**Goal:** Communicate site-wide offers or value props without disrupting navigation.

### Anatomy
* **Single-line text strip** above header
* **Rotating messages** (max 3) if multiple promos active
* **Contrasting background color**
* **Dismissable** (X button)
* Example: "☀️ Summer Sale: 25% off sitewide with code SUN25 · Ends Sunday"

### Anti-Patterns
* ❌ More than one banner stacked
* ❌ Non-dismissable banners
* ❌ Banner that pushes content too far below fold

---

## 7. Trust Bar (E-commerce variant)
**Goal:** Preempt the three purchase anxieties before the visitor scrolls.

### Anatomy
* **3-4 horizontal trust signals**: "Free shipping over $75" · "30-day hassle-free returns" · "50,000+ 5-star reviews" · "Secure checkout"
* **Icons** paired with each statement
* **Full-width strip**, subtle background

### Anti-Patterns
* ❌ Generic statements without specifics ("Great customer service" vs "4.9★ on Trustpilot")
* ❌ More than 4 items (dilutes impact)

---

## 8. Mega Menu (Category Navigation)
**Goal:** Enable fast navigation across a deep product catalog without leaving the current page.

### Anatomy
* **Triggered on hover** (desktop) / tap (mobile)
* **Category columns**: Organized by product type, not brand
* **Featured section**: "New Arrivals" or "Best Sellers" with product image
* **Max depth**: 2 levels. Third level = dedicated landing page
* **Visual cue**: Category images or icons for scanning

### Anti-Patterns
* ❌ More than 30 links visible at once
* ❌ Text-only with no visual hierarchy
* ❌ Hamburger menu on desktop (hides the entire catalog)

---

## 9. Checkout Flow
**Goal:** Minimize abandonment from cart to purchase confirmation.

### Anatomy
* **Progress indicator**: Cart → Information → Shipping → Payment → Confirmation
* **Guest checkout**: Always available (forced account creation = 34% abandonment)
* **Express checkout**: Apple Pay, Google Pay, Shop Pay above the form
* **Order summary**: Persistent sidebar showing items, subtotal, shipping, taxes, total
* **Trust signals**: SSL badge, payment method logos, "Secure checkout" text
* **Promo code field**: Visible but not prominent (don't distract from completing purchase)

### Anti-Patterns
* ❌ Forced account creation before checkout
* ❌ Hidden shipping costs revealed at payment step
* ❌ No express payment options
* ❌ Promo code field too prominent (sends visitors to Google for codes, losing them)

---

## 10. Incentive Capture (Email/SMS Popup)
**Goal:** Capture browsers who won't buy today in exchange for a discount on first purchase.

### Anatomy
* **Trigger**: After 15-30 seconds or scroll depth 40%+ (not on page load)
* **Offer**: "Get 15% off your first order"
* **Fields**: Email only (add SMS opt-in as optional checkbox)
* **Design**: Modal overlay, easy to dismiss
* **Secondary placement**: Inline block after social proof section

### Anti-Patterns
* ❌ Popup on page load (before visitor has seen any products)
* ❌ Popup that's hard to close on mobile
* ❌ Asking for too much information (name + email + phone + birthday)
* ❌ No clear value exchange

---

## 11. Size / Fit Guide
**Goal:** Reduce return rates and purchase anxiety for apparel and footwear. Sizing uncertainty is the #1 barrier to apparel conversion online.

### Anatomy
* **Measurement table**: Size (S/M/L or numeric) × measurements (chest, waist, length)
* **Fit description**: "Runs true to size" / "Slim fit — size up if between sizes"
* **Model reference**: "Model is 5'9", wearing size M"
* **Fit finder tool** (optional): Interactive questionnaire recommending a size

### Anti-Patterns
* ❌ Size guide as a PDF download
* ❌ No model reference photos with size callout
* ❌ Inconsistent sizing across products with no guidance

---

## 12. Recently Viewed / Recommendations
**Goal:** Reduce re-finding friction and increase cross-sell through personalized suggestions.

### Anatomy
* **"Recently Viewed" row**: Horizontal scroll of last 4-8 viewed products
* **"You May Also Like" row**: Algorithm-driven recommendations based on current product
* **"Frequently Bought Together"**: 2-3 complementary products with combined price and "Add All to Cart"

### Anti-Patterns
* ❌ Recommending out-of-stock items
* ❌ Recommending the same product the visitor is viewing
* ❌ More than 3 recommendation rows on a single page


---

## See Also

- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/forms.md` — multi-step forms, validation, progressive disclosure, smart defaults
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/ux-writing.md` — UX copy guidelines
