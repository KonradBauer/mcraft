---
type: knowledge
purpose: "Design patterns and layout strategies for b2b industrial websites"
---
Follow §Communication Rules from agent.md
# B2B Industrial: Page Layout Patterns

> Domain-specific page types for industrial and manufacturing sites.
> Shared B2B patterns (Innovation Layout, Platform Layout, Competitor Layout, Pricing Page, Case Study, Feature Subpage, Comparison Page, About Page, Enterprise Landing) load automatically from `b2b/b2b-patterns.md`.

---

## A. Technical Catalog Page

**Use when:** site has a product catalog (100 to 700K+ SKUs) that engineers need to browse and filter efficiently.

**Core Narrative:** "Find the exact part you need — by specification, category, application, or part number."

**Focus:** Speed of discovery. Engineers should reach the right product page in under 60 seconds from any entry point.

**Structure:**

1. **Multiple navigation paths** — category tree, parametric search, part number lookup, and application-based browsing all coexist. Buyers think "what do I need?" not "which department made this?"

2. **Mega menu** — expose 2–3 levels of category hierarchy at a glance. Cross-link between related products, compatible accessories, and application pages.

3. **Parametric/faceted search** — dynamic filters by material, dimensions, pressure rating, temperature range, thread type, certification, surface finish. Filters adapt to current category — only relevant facets shown.

4. **Product listing grid** — grid/list toggle with sortable columns. Key specs visible in listing view (not just name and image). Result count updates in real-time as filters applied.

5. **Breadcrumb navigation** — full path for deep catalogs (Home > Fittings > Tube Fittings > Compression > 316SS).

6. **Recently viewed / saved items** — persistent across session for engineers comparing multiple options.

**Variant logic:** Catalog-Led sites make this the primary experience. Solution-Led sites use this as a secondary path after application-based routing.

---

## B. Product Spec Sheet Page

**Use when:** every individual product or product variant needs a detail page — the most-visited page type for industrial sites.

**Core Narrative:** "Here are the complete specs, CAD files, and documentation you need to evaluate and specify this product."

**Focus:** Technical completeness. An engineer should never need to call for information that could be on this page.

**Structure:**

1. **Product identity** — part number, description, product family, and high-resolution images from multiple angles with zoom.

2. **Spec table** — full technical specifications in structured format: dimensions, tolerances, materials, weight, operating ranges, performance data. Dual units (Imperial/metric).

3. **CAD download** — prominent button with format selection (STEP, IGES, SolidWorks, DWG). This is the highest-value conversion action — 82% of CAD downloads lead to purchases.

4. **Datasheet download** — PDF with complete specifications, dimensional drawings, performance curves.

5. **Compliance callouts** — UL, CE, RoHS, REACH certifications visible on the product page with links to certificates.

6. **Related products** — compatible accessories, alternative materials/sizes, replacement parts.

7. **RFQ CTA** — pre-populated with product context (part number, configuration). Always accessible.

**Anti-pattern:** Marketing paragraphs instead of spec tables. Engineers want structured data they can compare, not prose about "innovative solutions."

---

## C. Capabilities / Facilities Page

**Use when:** the company is a contract or custom manufacturer — this IS the product page for Capability-Led sites.

**Core Narrative:** "Here's what we can make, what equipment we use, what tolerances we hold, and the certifications that prove it."

**Focus:** Demonstrating manufacturing competence through verifiable technical evidence, not marketing claims.

**Structure:**

1. **Process inventory** — organized by manufacturing process (CNC machining, sheet metal, injection molding, welding, finishing). Each process includes: equipment list with specs, tolerances achievable, materials handled (specific alloys/grades), part size and weight ranges.

2. **Facility overview** — square footage, capacity indicators, number of machines by type. Professional photos of actual shop floor (not stock).

3. **Quality system** — certifications (ISO, AS9100, IATF) with downloadable certificate PDFs. Scope statements showing which facilities and processes are covered. Quality metrics: PPM rates, on-time delivery percentages.

4. **Secondary services** — finishing, assembly, testing, kitting, inventory management.

5. **Case studies** — complex parts successfully manufactured, showing tolerances held and problems solved.

6. **RFQ with file upload** — the primary conversion. Pre-qualify with: part description, material, quantity, tolerances, drawing upload (STEP/DWG/PDF).

---

## D. Distributor Locator Page

**Use when:** manufacturer sells through a distribution network and needs to route buyers to channel partners.

**Core Narrative:** "Find your nearest authorized dealer — they have our products in stock and know them inside out."

**Focus:** Efficient geographic routing with dealer type differentiation.

**Structure:**

1. **Auto-detect location** — with address autocomplete for manual override.

2. **Dealer type filter** — authorized distributor, service center, stocking dealer. Distinct pin colors/icons on map.

3. **Result list** — 5–10 initial results with progressive loading. Each listing: name, address, phone, website, hours, distance, product lines carried.

4. **Map + list dual view** — synchronized highlighting between map pins and list items.

5. **Deep linking** — product pages link directly to locator pre-filtered by product category or SKU.

**Variant logic:** Products with limited distribution show fewer, more detailed dealer profiles. Widely distributed products show density map with quick-filter by inventory.

---

## E. Application / Use-Case Page

**Use when:** engineers know their problem but not which product family solves it — the primary navigation path for Solution-Led sites.

**Core Narrative:** "You have this specific engineering challenge — here's how our products solve it, with evidence from real applications."

**Focus:** Problem-first content that routes engineers to the right product family without requiring them to know the product taxonomy.

**Structure:**

1. **Application context** — describe the engineering problem, operating conditions, failure modes, and performance requirements in technical language.

2. **Product mapping** — which products from the catalog address this application, with rationale for selection. Cross-links to product spec pages.

3. **Application-specific case studies** — real-world performance data in this exact application context. Include operating conditions, test results, longevity data.

4. **Selection guidance** — decision matrix or flowchart for choosing between product options within this application.

5. **Related applications** — cross-link to adjacent use cases for engineers exploring broader solutions.

**Organization:** By industry (aerospace, automotive, medical, food processing) or by application type (fluid sealing, vibration isolation, heat management, corrosion protection).

---

## F. Technical Resource Library

**Use when:** site has significant downloadable content — datasheets, white papers, application notes, CAD bundles, certification documents, videos.

**Core Narrative:** "Every technical document in one place — filtered by product, type, and application."

**Focus:** Centralized, filterable access to all technical content with strategic gating.

**Structure:**

1. **Filter by content type** — datasheet, white paper, CAD model, certificate, video, application note.

2. **Filter by product/application** — cross-referenced to product catalog and use cases.

3. **File metadata** — format (PDF, STEP, MP4), file size, last-updated date visible before download.

4. **Gating strategy** — individual spec sheets and datasheets ungated (engineers won't tolerate barriers to basic product data). Bundle downloads (complete catalogs, design handbooks) can be gated for lead capture.

5. **Download tracking** — feed to CRM for lead scoring and sales intelligence.

**Key insight:** Ungated information is shared 57% more readily. Gating basic product data doesn't capture leads — it drives engineers to competitors who don't gate.

---

## G. Product Configurator Page

**Use when:** products are parametrically defined with many possible configurations — the primary interface for Configurator-Led sites.

**Core Narrative:** "Build exactly what you need — select parameters, see the result in real time, and get instant pricing and CAD output."

**Focus:** Configuration completion → part number → CAD download → order/quote.

**Structure:**

1. **Step-by-step parameter selection** — progressive disclosure prevents overwhelming complexity. Material → dimensions → features → finish.

2. **Constraint-based logic** — only compatible options shown at each step. Invalid configurations prevented before user encounters them.

3. **Real-time visualization** — 2D/3D rendering updates as parameters change. Engineers need to see what they're specifying.

4. **Instant pricing and delivery** — price and delivery estimates update with each parameter change.

5. **Output generation** — configured product generates: part number, downloadable CAD model (multiple formats), quotation, BOM data.

6. **Save and share** — configured products saved to account for later; shareable links for team review.

**Performance:** 60–85% time-to-quote reduction. 17% higher lead conversion than sites without CPQ.

---

## H. Certification / Quality Page

**Use when:** procurement and quality teams need to verify supplier qualifications — particularly important for regulated industries (aerospace, medical, defense, automotive).

**Core Narrative:** "Here are our certifications, their scope, and the documentation to prove it."

**Focus:** Procurement qualification — everything a quality manager needs to approve this supplier.

**Structure:**

1. **Primary certification badges** — ISO 9001, AS9100, IATF 16949, ISO 13485, ITAR, FDA, CE, UL displayed prominently.

2. **Downloadable certificates** — actual PDFs of each certificate with expiration dates.

3. **Scope statements** — which facilities and which processes are covered by each certification.

4. **Quality metrics** — PPM defect rates, on-time delivery percentages, inspection capabilities, measurement equipment.

5. **Compliance frameworks** — for regulated industries, organize by framework (aerospace, medical, defense) showing all relevant certifications per framework.

6. **Audit information** — last audit dates, auditing bodies, facility addresses.

---

## I. Equipment / Process Detail Page

**Use when:** Capability-Led sites need deep-dive pages for specific manufacturing processes or key equipment.

**Core Narrative:** "Here's exactly what this machine can do — tolerances, materials, sizes, and the certifications that back it up."

**Focus:** Technical depth on a specific process or piece of equipment.

**Structure:**

1. **Equipment specifications** — make/model, axis count, travel dimensions, spindle speeds, tolerance capabilities.

2. **Materials handled** — specific alloys, grades, and material types with any limitations.

3. **Part size/weight ranges** — minimum and maximum dimensions and weights.

4. **Process flow** — how this equipment fits into the overall manufacturing sequence.

5. **Certifications specific to process** — NADCAP for special processes, etc.

6. **Sample parts** — gallery of parts produced on this equipment with specs achieved.

---

## J. Material Selection Guide

**Use when:** engineers need to choose between materials for their application — interactive decision support.

**Core Narrative:** "Compare materials by the properties that matter for your application — strength, temperature, corrosion, cost."

**Focus:** Data-driven material comparison that accelerates engineering decisions.

**Structure:**

1. **Interactive comparison table** — material properties side by side with sortable columns.

2. **Property filters** — filter by tensile strength range, temperature rating, chemical resistance, cost tier.

3. **Application suitability** — which materials are recommended for which applications/environments.

4. **Performance data** — curves, test results, and certification data per material.

5. **Availability and lead time** — which materials are stocked vs. made-to-order.

6. **Regulatory notes** — RoHS, REACH, food-contact, or medical-grade compliance per material.

---

## Conversion Patterns

Industrial conversion differs fundamentally from SaaS or services — the goal is specification and procurement, not consultation or signup.

### CAD Download as Primary Conversion
**The single most important conversion event in industrial B2B.** 82% of downloads lead to physical purchases. The mechanism: engineer downloads CAD → inserts in assembly → part number carries to BOM → manufacturer specified by default. CAD download buttons must be the most prominent CTA on product pages.

### RFQ as Primary CTA
**Flow:** Browse catalog → evaluate specs → configure (optional) → request quote with technical context.
**Implementation:** RFQ form pre-populates with product context (part number, configuration, quantity). File upload for drawings is non-negotiable for custom manufacturing.

### Multi-Path Discovery
Engineers discover products through four simultaneous paths — the site must support all of them:
1. **Category browsing** — traditional catalog navigation
2. **Parametric search** — filter by technical specifications
3. **Part number search** — direct lookup by part number or cross-reference
4. **Application routing** — problem-first navigation to product families

### Ungated Specs / Gated Bundles
**Ungated:** Individual product datasheets, spec sheets, CAD files. 79% of engineers rate datasheets as most valuable content; gating basic data drives them to competitors.
**Gated:** Complete catalogs, design handbooks, comprehensive buyer's guides — high-value compiled resources where contact exchange is proportional to value delivered.

### Trade Show Integration
75% of engineers plan to attend at least one industry event. Event-specific landing pages with QR codes connect in-person conversations to online evaluation. Lead capture tagged with event source for CRM routing.

---

## K. Approval Workflow Pattern

**Use when:** buyer accounts have multi-role purchasing authority (Admin sets limits; Buyer submits; Approver reviews).

**Trigger:** Order total exceeds buyer's spending authority — OR — order includes restricted category, restricted supplier, or exception item.

**Flow:**
1. Buyer builds cart and attempts checkout
2. System checks total against buyer's authority limit
3. Under-limit: normal "Place Order" button
4. Over-limit: "Submit for Approval" button replaces "Place Order"
5. Approver receives notification with draft order link
6. Approver can: Approve all lines / Reject all / Modify quantities / Approve partial (releases approved lines; rejected lines return to buyer as draft with comments)
7. Buyer notified of decision with reason codes

**States:** Draft → Pending Approval → Approved / Rejected / Partially Approved

**Key UX requirement:** Buyer must see order status after submission — not a black box. Status page shows: submitted time, approver name, expected response time, current state.

**Anti-pattern:** No post-submission visibility for buyer. Buyer has no way to know if order is approved, pending, or rejected without calling.

---

## L. Reorder and Replenishment Pattern

**Use when:** buyer needs to repeat a past order — standard for MRO, consumables, recurring operations.

**Entry points:**
* Order History → one-click Reorder button per order
* Saved List → one-click "Load to Cart"
* Predictive Reorder (Sana Commerce model) — system pre-builds cart from purchase history; buyer reviews and confirms

**Reorder UX requirements:**
* Price-change alert — if any item price changed since last order, show old vs. new before adding to cart
* Availability alert — if any item is out of stock or lead time changed, surface before cart
* Quantity pre-populated from original order; buyer can edit before loading

**Named List Templates:**
Format: `[Frequency] [Use] – [Location]` (e.g., "Monthly MRO – Building A", "Q1 Electrical – HVAC Project")
Templates support partial load — buyer selects which items to include on this run.

**Scheduled / Recurring Orders:**
Buyer sets: frequency (weekly/monthly/custom), start date, optional end date, auto-submit or review-before-submit toggle. System generates order on schedule; buyer receives notification N days before.

---

## M. Bulk Ordering Pattern

**Use when:** buyer knows SKUs and quantities without needing to browse the catalog — procurement specialists, MRO buyers, field teams with pre-built BOMs.

**Primary entry point:** Quick Order Pad (see Components: Quick-Order Pad)

**Flows:**

**Known-SKU direct entry:** Quick Order Pad → validate → add to B2B Cart → PO checkout. Buyer never visits a product page.

**Barcode scan → job-site list:** Mobile scan of parts on-site → appends to running order list → submit to cart when complete. Used by field buyers building a replenishment order during a site visit.

**CSV / BOM upload:** Buyer exports BOM from ERP or engineering tool → uploads CSV → validation shows matched SKUs, unmatched items, and substitution suggestions → confirmed items inject into cart. See Quick-Order Pad for CSV format details.

**Part-number reorder bypass:** Buyers with established part numbers use Quick Order Pad to bypass catalog entirely. Navigation to the catalog is optional, not required.

---

## N. LTL Freight Interface Pattern

**Use when:** order weight or volume exceeds parcel shipping thresholds (typically 150+ lbs or >3 pallets). Freight costs are the #1 source of B2B checkout abandonment when hidden.

**Progressive disclosure logic:**

1. Cart weight/volume threshold → trigger LTL Estimator in checkout step 2
2. **Delivery location classifier:**
   - Commercial with loading dock
   - Commercial without loading dock
   - Residential
   - Limited access (construction site, farm, inside delivery required)
3. **Accessorial detection (conditional questions):**
   - Dock availability → if No → forklift available? → if No → liftgate required (auto-inject liftgate fee)
   - Inside delivery required? → if Yes → inside delivery fee
   - White glove / installation required?
4. **Pallet capacity visualizer:** shows estimated pallet count + weight distribution
5. **Fulfillment methods in one selector:** Ground (if parcel-eligible), LTL Standard, LTL Expedited, Will-Call / Branch Pickup, Local Delivery (if offered)

**Key rule:** Show freight cost estimate in cart before checkout, not after order placement. "Estimated freight: $347 — final amount confirmed at shipping" is acceptable. No freight cost = checkout abandonment.

**Anti-patterns:**
* ❌ Hiding freight cost until order confirmation email
* ❌ Single "Freight" option with no accessorial capture
* ❌ Separate freight quote workflow (phone call required)

---

## O. Punchout / eProcurement Pattern

**Use when:** buyer's organization uses an eProcurement system (SAP Ariba, Coupa, Jaggaer, Oracle iProcurement) and the supplier is connected via OCI or cXML.

**Level 1 Punchout (standard):**
1. Buyer launches supplier site from within their eProcurement system (SSO via cXML PunchOutSetupRequest)
2. Buyer browses supplier catalog and builds cart as normal
3. **"Transfer Cart" replaces "Checkout"** — cart is transmitted as cXML PunchOutOrderMessage back to buyer's system
4. Buyer completes purchase order inside their eProcurement system
5. Supplier receives PO via EDI/cXML OrderRequest

**Level 2 Punchout (deep-link search):**
1. Buyer searches within their eProcurement system
2. Deep-link returns specific product pages from supplier catalog
3. Buyer adds to requisition without full punchout session

**UX requirements for punchout mode:**
* Hide checkout button — replace with "Transfer Cart" or "Return Cart to [System Name]"
* Hide cost allocation fields — handled in buyer's ERP
* Hide account-level pricing display — contract pricing passes in cXML, not displayed
* Session banner: "You are shopping in [Company Name] eProcurement mode"

**cXML data requirements:**
Supplier catalog must export: UNSPSC codes, supplier part numbers, buyer part numbers (if configured), unit pricing, UOM, lead times.

---

## P. Hybrid Procurement Engineer Pattern

**Use when:** site serves both engineers (evaluating specs, downloading CAD) and procurement specialists (placing repeat orders by part number). This is the default for large catalog distributors.

**Single product-centric navigation — 3 information layers per product page:**

**Layer 1 (above fold — always visible):**
Price, availability, Add to Cart, quantity stepper, UOM selector, stock location, estimated delivery date. No need to scroll to buy.

**Layer 2 (tabbed below Layer 1):**
Full spec table (all dimensions, tolerances, ratings, certifications), CAD download (STEP, IGES, DWG, DXF), compliance documents (SDS, RoHS, REACH), related products.

**Layer 3 (visible to logged-in buyers only):**
Your contract price, account-specific lead times, saved list addition, quick-reorder from past orders, job code field.

**Spec-to-Cart flow:**
Parametric filter → unified results table (spec + price + availability in same row) → "Add to Cart" from results list (skip product detail page for known buyers). Engineers drill into Layer 2; procurement buyers use Layer 1 + 3 only.

**Anti-pattern:** Separate "Engineering" and "Purchasing" landing pages or navigation categories. Engineers and procurement specialists look at the same product — only the information priority differs. Split navigation forces both personas to navigate to the "wrong" section.

---

## Q. Dual Conversion Path — Routing Archetypes

**Use when:** site needs to route both catalog buyers and custom-quote buyers from the same homepage without forcing either through the wrong flow.

### 5 Routing Archetypes

| Archetype | Routing model | Platform reference |
|-----------|---------------|-------------------|
| **Custom-First** | Single "Upload File" CTA; AI routes internally (custom vs. standard); no user-facing path split | Xometry, Protolabs |
| **Catalog-First** | No RFQ; all products have fixed pricing; custom needs go to a separate contact form | McMaster-Carr |
| **Configurable Hybrid** | Parametric configurator generates part number → direct order; truly custom escalates to RFQ | MISUMI |
| **Instant-Pricing-with-Custom-Fallback** | Instant pricing within capability bounds; "Request Custom Quote" appears when parameters exceed bounds | SendCutSend |
| **Tiered Complexity** | Tier 1: Instant Quote Engine (standard); Tier 2: Sales-Assisted (complex assemblies); Tier 3: Target-Price (strategic accounts) | Xometry 3-tier model |

### Routing Decision Matrix

| Visitor signal | Route to |
|----------------|----------|
| File upload (CAD, STEP, DXF) | Custom quoting flow |
| Parametric search / part number entry | Catalog ordering |
| Configurator within capability bounds | Direct order |
| Configurator exceeds bounds (tolerance, material, geometry) | Custom RFQ with pre-populated context |
| Quantity exceeds pricing tier | Volume quote request |
| "Request Modification" on standard product | Custom RFQ with product context |

---

## R. Instant Quote Engine Pattern

**Use when:** site offers custom manufacturing with real-time pricing (CNC, sheet metal, 3D printing, injection molding).

### 5-Step Flow

1. **Upload** — drag-and-drop zone; accepts STEP, SLDPRT, STL, DXF, IGES; multi-file for assemblies; file size and format validation with clear error messages
2. **Process & Material Selection** — process first (CNC / Sheet Metal / 3D Print / Injection Molding), then material dropdown filtered to process compatibility; dependent dropdowns prevent invalid combinations
3. **Configuration** — quantity stepper (real-time price update on change), surface finish / anodize / plating options, tolerance class selector, secondary operations (tapping, bending, welding), certifications (ITAR, AS9100, RoHS)
4. **DFM Feedback** — color-coded geometry analysis (see Archetypes: Configurator-Led DFM section); click-to-highlight problematic coordinate in embedded 3D viewer; for injection molding: flow simulation showing gate location and knit lines (Protolabs ProDesk model)
5. **Quote Review & Order** — itemized price breakdown (material + machining + finish + setup + shipping); lead time options (standard / expedited / rush); add to Quote Cart or place direct order

### Anti-Patterns
* ❌ Black box rejection without DFM coordinate — engineer cannot fix what they cannot see
* ❌ Separate RFQ form for files that fail instant pricing — pre-populate context and escalate inline
* ❌ Quote expires without notification — email reminder with re-quote option

---

## S. Homepage Dual-Path Disambiguation

**Use when:** site serves both catalog buyers and custom-quote buyers; homepage must self-sort visitors into correct flow without friction.

### Pattern Options

**Self-Selection Cards:**
Two equal-weight cards side by side: "Order Standard Parts" / "Get Custom Quote" — each card has a short description of what it's for ("Already know your part number or spec" / "Need a one-off or engineered-to-order part"). Cards use visual differentiation (icon, accent color) but equal button size.

**Search-First Design:**
Single prominent search bar with placeholder text that acknowledges both paths: "Search by part number, SKU, or describe what you need." AI routing: part number pattern → catalog; descriptive text → instant quote engine entry.

**Process Selector:**
Three-step wizard as homepage hero: "What are you making?" (dropdown: Bracket, Housing, Enclosure, Fastener, Other) → "What's your process?" → "Standard part or custom?" Directs to correct flow at step 3.

**Test-Drive / Sample Parts:**
Link to order sample parts before registration — lets buyers evaluate material quality and surface finish before committing to a quote. Reduces barrier for first-time visitors. (SendCutSend model)

**Recommended default for new sites:** Self-selection cards — most transparent, least engineering investment, easiest A/B test.

---

## See Also

* `b2b/b2b-patterns.md` — shared B2B page patterns (Innovation, Platform, Competitor, Pricing, Case Study, Feature Subpage, Comparison, About, Enterprise Landing). Loaded automatically with any b2b-* sub-type.
* `b2b-industrial-components.md` — individual components that compose into these patterns.
* `b2b-industrial-archetypes.md` — strategic archetypes that determine which patterns to prioritize.
