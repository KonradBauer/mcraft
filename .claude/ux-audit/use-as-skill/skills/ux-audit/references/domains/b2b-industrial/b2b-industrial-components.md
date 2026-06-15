---
type: knowledge
purpose: "UI component library and patterns for b2b industrial websites"
---
Follow §Communication Rules from agent.md
# B2B Industrial: Component Library

> Domain-specific components for industrial and manufacturing sites.
> Shared B2B components (navigation, hero, trust bar, forms, FAQ, footer, stats, CTA, logo grid, video embed) load automatically from `b2b/b2b-components.md`.

---

## 1. Spec Table

**Goal**: Present technical specifications in structured, scannable format — the primary content type engineers evaluate.

### Anatomy
* **Structured columns** — dimensions, tolerances, materials, ratings, weight, operating ranges in consistent units
* **Dual units** — Imperial and metric with clear labels
* **Sortable columns** — allow sorting by any parameter
* **Key spec highlighting** — visually differentiate the specs that matter most for selection decisions
* **Zebra striping** — alternating row colors with fixed headers for long tables
* **Comparison mode** — select 2–4 products for side-by-side diff with differences highlighted

### Anti-Patterns
* ❌ Specs buried in marketing paragraphs — structured tables, not prose
* ❌ Missing units or ambiguous labels (e.g., "Size: 10" — 10 what?)
* ❌ Incomplete data — a missing spec forces an engineer to call, and they'll go to a competitor who publishes it

---

## 2. Product Configurator

**Goal**: Enable real-time product configuration with instant pricing, part number generation, and CAD output — the primary interface for Configurator-Led sites.

### Anatomy
* **Progressive disclosure** — step-by-step parameter selection (material → dimensions → features → finish). Prevents overwhelming complexity.
* **Constraint-based logic** — only compatible options shown at each step; invalid configurations prevented
* **Real-time visual feedback** — 2D/3D rendering updates as parameters change
* **Instant pricing and delivery** — pricing updates with each configuration change; delivery estimates shown
* **Output generation** — generates part number, downloadable CAD model, and quotation from configured product
* **CPQ integration** — configuration data flows to ERP, generating BOMs and fabrication drawings

### Performance
* 60–85% time-to-quote reduction vs. manual quoting
* 17% higher lead conversion than sites without CPQ

### Anti-Patterns
* ❌ Configurator that requires login before showing any options — engineers need to explore freely
* ❌ Configuration output without CAD download — the whole point is specification-lock
* ❌ Non-responsive configurator — must work on tablet for engineers reviewing on shop floor

---

## 3. RFQ Form

**Goal**: Capture quote requests with enough technical context for accurate quoting — the primary conversion mechanism for Capability-Led and custom manufacturing sites.

### Anatomy
* **Essential fields** (3–5 for standard products) — name, company, email, part number/description, quantity
* **Progressive fields** (revealed for complex products) — material requirements, tolerances, file upload (STEP/DWG/PDF), timeline, annual volume, application description
* **File upload** — drag-and-drop for CAD files with format validation. Non-negotiable for contract manufacturers — engineers need to attach drawings.
* **Product context** — pre-populate part number and configuration from the product page the user came from
* **Auto-routing** — route by product category to the appropriate sales engineer
* **Immediate confirmation** — display expected response time after submission

### Anti-Patterns
* ❌ Generic "Contact Us" form with no technical fields — fails to capture context for quoting
* ❌ No file upload capability — forces engineers to email drawings separately, breaking the flow
* ❌ 15-field form for a simple quote — use progressive disclosure, not a wall of fields

---

## 4. Certification Badges Block

**Goal**: Establish credibility through documented quality system certifications — procurement managers disqualify suppliers in seconds if certifications aren't findable.

### Anatomy
* **Visual badges** — ISO 9001, AS9100, IATF 16949, ISO 13485, ITAR, FDA, CE, UL logos displayed prominently
* **Position** — header area or hero-adjacent on all credibility-critical pages. Not the footer.
* **Clickable** — each badge links to detailed certification page with downloadable certificate PDFs
* **Scope visibility** — which facilities and which processes are covered by each certification

### Anti-Patterns
* ❌ Certifications buried in footer — procurement managers won't scroll to find them
* ❌ Claiming certifications without downloadable proof — PDFs of actual certificates are expected
* ❌ Outdated certifications — expired certs are worse than no certs

---

## 5. CAD/Document Download

**Goal**: Enable specification-lock — when an engineer downloads your CAD model and inserts it into their assembly, your part number carries through to the BOM.

### Anatomy
* **Prominent placement** — primary button on product pages, not a secondary feature. This is the highest-value conversion action in industrial B2B.
* **Multiple formats** — STEP, IGES, SolidWorks, AutoCAD DWG, PDF drawing as minimum
* **Ungated access** — individual spec sheets and CAD files must be freely accessible. 89% of designers only select from manufacturers with CAD files online.
* **Format and size display** — show file type and size before download
* **Download tracking** — track for lead scoring (53% of downloaders are engineers, 21% managers/directors)

### Key Metric
82% of businesses ultimately buy the physical part after downloading the CAD model. CAD models generate 2.5× greater leads than text-based information. This is the single most important conversion mechanism in industrial B2B.

### Anti-Patterns
* ❌ Gating CAD downloads behind registration — engineers will go to competitors who don't gate
* ❌ Only offering PDF drawings — engineers need native 3D formats for assembly integration
* ❌ Missing CAD files entirely — this is a disqualifying absence for 89% of designers

---

## 6. Distributor Map

**Goal**: Connect buyers with local authorized dealers, distributors, or service centers — the primary conversion component for Distributor-Led sites.

### Anatomy
* **Auto-detect location** — with address autocomplete for manual override
* **Dealer type filters** — authorized distributor, service center, stocking dealer with distinct pin colors/icons
* **Result list** — 5–10 initial results with "show more" progressive loading. Each listing: name, address, phone, website, hours, distance, inventory/product lines carried.
* **Deep linking** — product pages link to locator pre-filtered by product category/SKU
* **Map + list** — dual view with synchronized highlighting

### Anti-Patterns
* ❌ Locator that requires ZIP code without auto-detection — add friction only when necessary
* ❌ No dealer type differentiation — a service center and a stocking dealer serve different needs
* ❌ Outdated dealer data — wrong hours, closed locations, or incorrect contact info erodes trust in the manufacturer

---

## 7. Part Number Search with Autocomplete

**Goal**: Enable instant product lookup by part number, cross-reference number, or natural-language description — the fastest path to a product for engineers who know what they need.

### Anatomy
* **Autocomplete** — suggestions appear after 2–3 characters with part number, description, and thumbnail
* **Cross-reference support** — engineers switching from a competitor need to find your equivalent part
* **Natural-language parsing** — handle queries like "1/4"-20 x 1" bolt" with auto-populated parametric filters
* **Part-number URL structure** — direct URL access (e.g., `site.com/[part_number]/`) for sharing and bookmarking
* **Search scope indicator** — show whether searching across all products, within current category, or within configurator

### Anti-Patterns
* ❌ Search that only matches exact strings — must handle partial matches, cross-references, and natural language
* ❌ No autocomplete — engineers expect instant feedback; a blank search box with "Submit" feels archaic
* ❌ Returning marketing pages instead of product pages — search must prioritize product specs

---

## 8. Product Comparison Tool

**Goal**: Enable side-by-side specification comparison for 2–4 products — 59% of engineers rate this as a valuable tool.

### Anatomy
* **Selection mechanism** — "Add to compare" checkbox on product listing pages
* **Comparison tray** — persistent bottom bar showing selected products across navigation
* **Spec diff** — highlight differences between products; hide identical rows for clarity
* **PDF export** — engineers need to share comparisons with colleagues and procurement
* **Spec table format** — rows = specifications, columns = products

### Anti-Patterns
* ❌ Comparison limited to products in the same category — engineers compare across categories
* ❌ No persistent tray — losing selections on navigation forces re-selection
* ❌ Missing export — if the comparison can't be shared, it's only useful in the moment

---

## 9. Real-Time Pricing

**Goal**: Display pricing that responds to configuration, quantity, and customer context — reducing the quote cycle from days to seconds.

### Anatomy
* **Configuration-driven** — price updates as configurator parameters change
* **Volume tiers** — display tier breakpoints showing price per unit at different quantities
* **Contract pricing** — "Log in for your price" for customers with negotiated rates
* **Dynamic/index-linked** — base price with "subject to raw material surcharge" caveat where applicable
* **Quote fallback** — "Request Quote" button for custom configurations or quantities outside standard tiers

### Anti-Patterns
* ❌ "Contact us for pricing" as the only option — buyers can't build internal business cases without some pricing signal
* ❌ Pricing without quantity context — per-unit price is meaningless without MOQ and tier information
* ❌ Stale pricing — if prices change with raw material costs, show last-updated date

---

## 10. Breadcrumb Navigation (Deep Catalogs)

**Goal**: Maintain orientation in deep catalog taxonomies with hundreds to hundreds of thousands of SKUs.

### Anatomy
* **Full path** — Home > Category > Subcategory > Sub-subcategory > Product (e.g., Home > Fittings > Tube Fittings > Compression > 316SS)
* **Clickable at every level** — each breadcrumb is a link back to that category level
* **Consistent placement** — same position on every page
* **Complementary to mega menu** — breadcrumbs show where you are; mega menu shows where you can go

### Anti-Patterns
* ❌ Breadcrumbs that show the internal database structure instead of user-friendly categories
* ❌ Missing breadcrumbs on product pages — the most common place they're needed

---

## 11. Technical Resource Library

**Goal**: Centralize all downloadable technical content — datasheets, white papers, application notes, CAD bundles, certification documents, videos.

### Anatomy
* **Filter by content type** — datasheet, white paper, CAD model, certificate, video, application note
* **Filter by product/application** — cross-reference documents to products and use cases
* **File metadata** — display format (PDF, STEP, MP4), file size, and last-updated date before download
* **Gating strategy** — individual spec sheets ungated (engineers won't tolerate barriers to basic product data); bundle downloads (complete catalogs, design handbooks) can be gated
* **Download tracking** — feed to CRM for lead scoring and sales intelligence

### Anti-Patterns
* ❌ Gating individual datasheets — ungated info is shared 57% more readily; gating basic data drives engineers to competitors
* ❌ PDF-only catalog as the entire "resource" — not searchable, not mobile-friendly, not indexable
* ❌ Outdated documents — Accenture identified this as a recurring industrial buyer pain point

---

## 12. Facilities / Equipment Gallery

**Goal**: Authenticate manufacturing capability through real facility evidence — professional photos of actual equipment, not stock factory images.

### Anatomy
* **Equipment inventory** — specific machines listed with specifications (e.g., "Mazak Integrex i-400, 5-axis, 25.6" swing")
* **Facility metrics** — square footage, capacity indicators, number of machines by type
* **Photo gallery** — professional photos of the actual shop floor. 360° photography or virtual tours for deeper engagement.
* **Process visualization** — show the manufacturing flow from raw material to finished part
* **Video walkthrough** — facility tour demonstrating operational capability

### Anti-Patterns
* ❌ Stock photos of generic factories — immediately undermines credibility
* ❌ Equipment lists without specifications — "CNC machines" means nothing; "5-axis CNC with 60" travel" means everything
* ❌ Outdated facility photos — if the shop floor has been upgraded, the photos should reflect it

---

## 13. Parametric / Faceted Search Interface

**Goal**: Enable engineers to narrow large product catalogs by technical specifications — 66% rate this as the most valuable interactive tool.

### Anatomy
* **Dynamic facets** — only relevant attributes appear for the current category (don't show "thread type" for sheet material)
* **Multi-select logic** — AND within a facet (e.g., material = "316SS" OR "304SS"), AND between facets (material = 316SS AND pressure = 6000 PSI)
* **Active filter display** — show count of active filters with easy individual removal
* **Real-time result count** — update count as filters are applied before committing
* **"Clear all" escape** — one-click reset for starting over
* **Common industrial facets** — material, dimensions (OD, ID, length), pressure rating, temperature range, thread type, certification, surface finish

### Anti-Patterns
* ❌ Static filters that don't adapt to category context — showing irrelevant parameters adds noise
* ❌ Filters that return zero results without warning — always indicate when a combination yields no matches
* ❌ No filter persistence across pagination — losing selections on page 2 forces restart

---

## 14. B2B Cart (Ordering Workspace)

**Goal:** Line-item management workspace for multi-SKU procurement orders — not a B2C summary step.

### Header-Level Fields
* **PO Number** — text input, required for most industrial buyers
* **Ship-To Address** — dropdown from saved addresses
* **Requested Delivery Date** — date picker
* **Cost Allocation Category** — optional, from account config

### Per-Line-Item Fields
* SKU / Part Number (read-only)
* Product Name (truncated with tooltip)
* UOM (Unit of Measure) — dropdown (each, box, case, pallet)
* Quantity — numeric with +/− steppers; triggers stock check on change
* Unit Price labeled **"Your Price"** (contract) vs. strikethrough list price
* Line Total (auto-calculated)
* Per-line Delivery Date — override from header
* Job Code / Cost Center — dropdown from account config
* Per-line PO number — optional override
* Internal Reference / Notes — free-text
* Availability Status badge — In Stock / Partial / Ships in N days / Call

### Approval State Machine
States: **Draft → Pending Approval → Approved → Rejected → Partially Approved**

Trigger rules: order total threshold, product category restriction, supplier restriction, exception item. "Submit for Approval" replaces "Place Order" for under-authority buyers. Approver receives draft order with line-item edit capability. Partially Approved state releases approved lines; rejected lines return to draft with comments.

### Collaboration Features
* **Save as Template** — saves cart under a named list (e.g., "Monthly MRO – Building A")
* **Share Cart** — URL or email; recipient loads exact cart into their account
* **Cart Comments** — per-line notes visible to approver and fulfillment
* **Sales Rep Masquerade** — rep can build/edit cart on behalf of buyer (BigCommerce B2B feature)

### Anti-Patterns
* ❌ B2C mini-cart flyout for 20+ line items
* ❌ Single PO field only (no per-line override)
* ❌ Hiding contract pricing until checkout
* ❌ Showing list price without "Your Price" differentiation

---

## 15. PO-Based Checkout Flow

**Goal:** 5-step checkout designed for purchase order workflows — not credit card optimized.

### Flow
1. **Cart Review & Validation** — resolve stock conflicts, substitution prompts, minimum order checks
2. **Shipping & Fulfillment Selection** — all methods in one selector:
   - Ground / Standard
   - Freight (LTL/FTL — triggers accessorial detection; see Patterns: LTL Freight)
   - Will-Call / Branch Pickup (location selector + inventory confirmation)
   - Split Shipment (partial ship now + backorder)
   - Scheduled / Blanket Release (future delivery date with quantity allocation)
3. **Payment Method Selection** — Net 30/60/90 PO is primary, credit card secondary, ACH optional:

| Method | UX requirement |
|--------|----------------|
| Net 30/60/90 PO | Default for approved accounts; show credit utilization |
| Blanket PO | Reference number field + remaining balance display |
| Credit Card | Secondary; show card on file or capture new |
| ACH / Wire | Available for large orders; bank account fields |

4. **Tax Exemption Handling** — auto-apply stored certificate if on file; upload new certificate (PDF); async "pending review" state for new submissions; Avalara/TaxJar integration note
5. **Order Review & Confirmation** — sticky "Place Order" button; full line-item summary; PDF confirmation email; order confirmation page shows Order ID + estimated ship dates

### Anti-Patterns
* ❌ Multi-page checkout with forced re-authentication
* ❌ Credit card as default payment method
* ❌ Tax exemption as manual post-order process

---

## 16. Account Dashboard

**Goal:** Centralized workspace for ongoing procurement — not a "profile page."

### 9-Module Structure

| Module | Key functions |
|--------|---------------|
| **Order History** | Search by PO, date, SKU, job code; one-click reorder; CSV export; delivery status |
| **Invoice Management** | Bulk payment, aging report, dispute flag, PDF download |
| **Saved Lists** | Named templates (e.g., "Monthly MRO"); one-click cart load |
| **Quick Order** | Pad entry + CSV upload; see Quick-Order Pad component |
| **Account Pricing** | Contract pricing tiers, expiry dates, price change alerts |
| **Credit & Billing** | Credit limit, utilization scorecard, payment history |
| **User Management** | RBAC: Admin / Buyer / Approver / Viewer — 4 roles; invite new users; set spending limits per role |
| **Shipping Addresses** | Manage multiple ship-to locations; set default |
| **Reports & Analytics** | Spend by category, supplier, time period; budget vs. actual |

### Navigation Pattern
Left-side persistent module nav with active state. Not a tab bar — dashboards are too deep for tabs. Responsive: module nav collapses to hamburger on mobile.

### Anti-Patterns
* ❌ Flat dashboard with no module hierarchy
* ❌ Order history limited to last 30 days
* ❌ Reorder without price-change alert

---

## 17. Quick-Order Pad

**Goal:** Allow known-SKU buyers to build a cart without catalog browsing — primarily for procurement specialists and repeat buyers.

### Input Methods

**Method 1: Manual Entry Grid**
Table with SKU and Quantity columns. Tab-key navigation moves between cells (SKU → Qty → next SKU). Add row button. Validation on blur: SKU lookup shows product name + availability confirmation inline.

**Method 2: Copy-Paste Text Area**
Accepts: `SKU QTY` per line. Delimiter tolerance: space, comma, semicolon, tab. Paste triggers bulk parse + validation. Error rows highlighted with inline message. Valid rows populate entry grid.

**Method 3: CSV / XLS Upload**
Template download link with correct column headers. Row-level validation on upload — valid rows populate grid, errors shown in overlay table with download-errors button. Does not reject the entire file for partial errors.

**Method 4: Barcode / QR Scan (mobile)**
Camera trigger in mobile view. Scans industrial barcodes (Code 128, QR, Data Matrix). Appends SKU to grid on successful decode.

### Anti-Patterns
* ❌ Single-SKU-at-a-time entry for repeat buyers
* ❌ Rejecting entire CSV for one malformed row
* ❌ No template download

---

## 18. Cost Center Allocation

**Goal:** Assign order costs to internal budget codes — required for multi-department industrial buyers.

### Allocation Model (MSC Industrial reference)
* **Order-level allocation** — apply a single cost center to all lines
* **Per-item override** — individual lines can override the order-level code
* **Split allocation** — divide one line item across multiple cost centers (fractional percentages, must total 100%)
* **Mandatory vs. optional** — configurable per account; mandatory fields block checkout until populated
* **Printed on packing slip and invoice** — allocation code appears on all fulfillment documents for internal reconciliation

### Punchout Exception
When an order originates via punchout (OCI/cXML), cost allocation is handled inside the buyer's ERP system, not on the supplier site. The supplier site's allocation fields are hidden for punchout sessions. See Patterns: Punchout / eProcurement for the full punchout flow.

### Anti-Patterns
* ❌ Cost allocation only at order level (no per-line or split support)
* ❌ Allocation codes not printed on invoices
* ❌ No account-level field configuration (always mandatory or always optional)

---

## See Also

* `b2b/b2b-components.md` — shared B2B components (navigation, hero, trust bar, forms, FAQ, footer, stats, CTA, logo grid, video embed). Loaded automatically with any b2b-* sub-type.
* `b2b-industrial-patterns.md` — page layout patterns that compose these components into full page types.
* `b2b-industrial-archetypes.md` — strategic archetypes that determine which components to prioritize.
