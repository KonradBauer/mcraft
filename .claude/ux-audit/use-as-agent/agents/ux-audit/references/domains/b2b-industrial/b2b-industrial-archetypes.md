---
type: knowledge
purpose: "Site archetypes and reference examples for b2b industrial websites"
---
# B2B Industrial: Strategic Archetypes

> Domain-specific archetypes for industrial and manufacturing sites.
> Shared B2B archetypes (Solution-Led, Authority-Led, Education-First, Partner/Channel-Led, Marketplace/Two-Sided) load automatically from `b2b/b2b-archetypes.md`.

---

## 1. Catalog-Led

**Optimizes for:** Speed of product discovery — engineers should find the exact part in under 60 seconds.

**Best fit:** Standard parts distributors, industrial supply companies with large SKU counts (100 to 700K+ products). McMaster-Carr, Grainger, Fastenal model.

**Sacrifices:** Brand storytelling, thought leadership depth. The site is a search engine, not a marketing vehicle.

**Site structure signal:** Parametric search as primary navigation. Product database with full specs, pricing, availability, and CAD downloads. Natural-language query parsing (e.g., "1/4"-20 x 1" bolt" auto-populates parametric filters). Deep breadcrumb navigation for catalog taxonomy.

**Conversion mechanism:** CAD specification-lock — 82% of CAD downloads lead to physical purchases. The engineer downloads a CAD model, inserts it into their assembly, and the part number carries through to the BOM.

---

## 2. Capability-Led

**Optimizes for:** Demonstrating what the company *can make*, not what's in a catalog. Sells manufacturing capacity and technical competence.

**Best fit:** Contract manufacturers, fabrication shops, job shops, custom machining houses. PEKO Precision, EVS Metal model.

**Sacrifices:** Product-centric browsing. There is no catalog to search — the product is the company's ability to produce.

**Site structure signal:** Capabilities page as the primary entry point, organized by process (CNC machining, sheet metal fabrication, injection molding, welding, finishing). Equipment lists with specifications (e.g., "5-axis CNC mills up to 60" x 30" travel"). Tolerances achievable per process. Materials handled with specific alloys/grades. Part size and weight ranges. Facility photos and virtual tours.

**Trust signals:** ISO/AS9100/IATF certifications prominently displayed. Case studies showing complex parts manufactured. Quality metrics (PPM defect rates, on-time delivery percentages).

**Conversion mechanism:** RFQ form with drawing file upload — engineers submit CAD files and specs for quoting.

---

## 3. Distributor-Led

**Optimizes for:** Routing visitors to channel partners, not direct sales. Product pages educate; the "Where to Buy" locator converts.

**Best fit:** Manufacturers selling through distribution networks — building materials companies, HVAC manufacturers, equipment OEMs with dealer networks.

**Sacrifices:** Direct conversion. The manufacturer generates demand and educates; the distributor closes the sale.

**Site structure signal:** Product pages with full specs and applications but no direct pricing or add-to-cart. "Where to Buy" distributor locator as the primary CTA on every product page. Locator auto-detects location, filters by dealer type (authorized distributor, service center, stocking dealer), and deep-links from product pages pre-filtered by category.

**Key challenge:** Balancing manufacturer brand authority with channel partner relationships. The site must drive demand to the brand while routing purchases through partners.

**Conversion mechanism:** Distributor referral clicks — measured as the primary KPI.

---

## 4. Configurator-Led

**Optimizes for:** Real-time product configuration with instant pricing, part number generation, and CAD output. The configurator IS the product experience.

**Best fit:** Parametric standard components, custom-configured parts, companies with effectively infinite product variations. MISUMI (80 sextillion possible configurations), Parker Hannifin model.

**Sacrifices:** Traditional catalog browsing. Products aren't listed — they're generated from parameters.

**Site structure signal:** Product configurator as the primary interface. Progressive disclosure: step-by-step parameter selection (material → dimensions → features → finish). Constraint-based logic showing only compatible options at each step. Real-time 2D/3D rendering updates as parameters change. Instant pricing and delivery dates. Generated part numbers that flow to ERP/manufacturing systems.

**Performance benchmarks:** 60–85% time-to-quote reduction vs. manual quoting. 17% higher lead conversion than sites without CPQ (Configure-Price-Quote).

**Conversion mechanism:** Configuration completion → part number generation → CAD download → RFQ or direct order.

**DFM Feedback Loop (Design for Manufacturability):**
After file upload, the instant quote engine runs automated geometry analysis and returns color-coded feedback before pricing:
* 🟢 **Green** — manufacturable as-is; pricing available immediately
* 🟡 **Yellow / Advisory** — manufacturable with minor changes; pricing shown with advisory note (e.g., "wall thickness 0.8mm — recommended minimum 1.2mm for this material")
* 🔴 **Red / Blocking** — geometry issue prevents quoting; highlighted coordinate in 3D viewer pinpoints the problem (e.g., "undercut at this feature requires EDM — not available for this process selection")

Protolabs ProDesk "ProtoFlow" model: fill analysis for injection molded parts shows flow simulation before quoting, surfacing gate location and knit line predictions.

**Manual Quote Fallback:**
When instant pricing is unavailable (complex assemblies, ITAR-controlled parts, weldments, exotic materials, tolerances outside process bounds): "Request Manual Quote" CTA with pre-populated context from the configurator (process, material, quantity, uploaded file). Do not show a blank RFQ form — carry all context forward.

**Anti-pattern:** "Black box rejection" — system rejects file with no coordinate-level diagnostic. Engineer cannot fix what they cannot locate.

---

## 5. Solution-Led

**Optimizes for:** Problem-first routing that helps engineers find the right product family by describing their application, not by knowing the product category.

**Best fit:** Industrial conglomerates with broad product portfolios across multiple industries. Siemens Industry, ABB, Honeywell model. System integrators and complex solutions providers.

**Sacrifices:** Direct product search efficiency. Engineers who already know the part number may find extra navigation layers frustrating.

**Site structure signal:** Navigation organized by "Industries" or "Applications" rather than product families. Problem-first content: "Water Treatment," "Automotive Assembly," "Food Processing" as primary categories. Each industry/application page maps relevant products, services, and case studies to specific challenges. Cross-linking from application context to product spec pages.

**Best for companies where:** Engineers may not know which product family solves their problem, or where a solution involves multiple product categories working together.

---

## 6. Catalog-First Procurement (Ordering-Optimized)

**Optimizes for:** Frictionless reorder by procurement specialists who know their part numbers and need to place orders efficiently — not evaluate products.

**Best fit:** MRO distributors, industrial supply houses, multi-category distributors whose buyers already know what they want. McMaster-Carr (ordering) model distinct from McMaster-Carr (engineering spec) — same site, different buyer mode.

**Sacrifices:** Product discovery depth. Buyers who don't know the part number need the Catalog-Led or Solution-Led path.

**Site structure signal:** Sticky Quick Order Pad or part-number search as primary homepage CTA alongside (not below) the catalog browse entry. Account Dashboard as primary logged-in landing page. Add-to-Cart available from search results without visiting product detail page. B2B Cart as multi-line workspace. PO-based checkout default.

**Differentiator from Catalog-Led:** Catalog-Led optimizes for engineers *finding and evaluating* a part. Catalog-First Procurement optimizes for buyers *placing an order for a known part*. The same site often serves both — the 3-layer product page structure in the Hybrid Procurement Engineer pattern (see Patterns) handles both modes with one page layout.

---

## 7. Dual-Path (Standard + Custom)

**Optimizes for:** Converting both catalog buyers (known SKUs, immediate purchase) and custom manufacturing buyers (engineered-to-order) from the same homepage — without forcing either buyer through the wrong flow.

**Best fit:** Manufacturers selling both standard catalog parts AND custom-manufactured components. SendCutSend (standard sheet metal + custom cutting), MISUMI-Fictiv merger model (catalog configurables + fully custom), hybrid job shops with a standard product line.

**Sacrifices:** Simplicity. Dual-path sites require explicit disambiguation at every major entry point. Poor execution creates two half-finished experiences instead of one coherent one.

**Site structure signal:** Homepage presents two distinct CTAs with equal visual weight — one for each path (e.g., "Order Standard Parts" / "Get Custom Quote"). Self-selection cards or process selector on homepage. Configurator and catalog search coexist without one being subordinate.

**Graceful escalation:** When a buyer uses the configurator but their parameters exceed capability bounds (e.g., tolerance tighter than process allows), the site escalates to custom RFQ with all configurator context pre-populated — part number, process, material, quantity, uploaded file. No data loss on path switch.

**Platform references:** SendCutSend (instant pricing + custom fallback), MISUMI (parametric catalog as configurator hybrid), Xometry (tiered: instant / sales-assisted / target-price).

---

## Archetype Selection

| Business type | Default archetype |
|--------------|-------------------|
| Standard parts distributor (100+ SKUs) | Catalog-Led |
| Custom/contract manufacturer | Capability-Led |
| Manufacturer with dealer/distributor network | Distributor-Led |
| Parametric/configurable products | Configurator-Led |
| Complex solutions / system integrator / conglomerate | Solution-Led |
| Procurement specialist, repeat orders, known SKUs | Catalog-First Procurement |
| Manufacturer with standard + custom-engineered products | Dual-Path |

**Hybrid combinations are common:**
- Catalog + Configurator: Standard parts with some configurable options (e.g., McMaster-Carr for standards, MISUMI for configured)
- Capability + Solution: Contract manufacturer organized by application rather than process
- Distributor + Solution: OEM with industry-specific landing pages routing to channel partners

**Differentiator from b2b-services:** Industrial archetypes are defined by *how the product is found and specified*, not by the firm's positioning strategy. The website's primary job is technical evaluation and specification, not trust-building and relationship initiation.
