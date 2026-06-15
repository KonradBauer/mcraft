---
type: knowledge
purpose: "Discovery questions and research framework for b2b industrial projects"
---
# B2B Industrial: Discovery

> Domain-specific discovery guidance for industrial and manufacturing sites.
> Shared B2B discovery (messaging hierarchy, generic assumptions, regulated industry guidance, specialization principle) loads automatically from `b2b/b2b-discovery.md`.

---

## Key Assumptions to Form

### 1. Product Type

What does the company sell, and how is it specified?

| Type | Site architecture implication |
|------|------------------------------|
| **Standard catalog items** | Catalog-Led: parametric search, spec tables, CAD downloads |
| **Custom / build-to-order** | Capability-Led: process pages, equipment lists, RFQ with file upload |
| **Parametric / configurable** | Configurator-Led: CPQ interface, real-time pricing, CAD generation |
| **Complex systems / solutions** | Solution-Led: application-based routing, industry pages |
| **Distributed through dealers** | Distributor-Led: product education + "Where to Buy" locator |

### 2. Sales Channel

How do products reach the buyer?

- **Direct** — manufacturer sells to end customer. Site is the storefront.
- **Distributor network** — manufacturer routes demand to channel partners. Site educates; dealers close.
- **Hybrid** — direct for some products/customers, distributed for others. Requires dual conversion paths.

*Key question: Does the site need to sell, or to generate demand that flows to partners?*

### 3. Primary Buyer Type

Who is the site's primary audience?

| Buyer | What they need from the site |
|-------|------------------------------|
| **Engineers** | Specs, CAD files, comparison tools, application data. Self-service by default (60% complete buying process online). |
| **Procurement** | Pricing, MOQs, lead times, certifications, vendor qualification docs. Relationship and compliance focus. |
| **Mixed** | Both paths must coexist — dual-persona routing is the core UX challenge. |
| **Maintenance** | Part number lookup, cross-references, replacement guides, emergency ordering. |

### 4. Certification Requirements

Which industry certifications does the company hold?

| Industry | Common certifications |
|----------|----------------------|
| General manufacturing | ISO 9001 |
| Aerospace | AS9100, NADCAP, ITAR |
| Automotive | IATF 16949 |
| Medical devices | ISO 13485, FDA |
| Defense | ITAR, MIL-SPEC |
| EU market | CE, RoHS, REACH |
| Electrical | UL, CSA |
| Food/pharma | FDA, HACCP, cGMP |

*Certifications must be prominently displayed with downloadable PDFs. Procurement managers disqualify suppliers in seconds if certs aren't findable.*

### 5. Geographic Coverage

| Scope | Site implication |
|-------|-----------------|
| Single country | Single language/currency, local SEO focus |
| Multi-country EU | Multi-language, CE/RoHS compliance prominent, currency handling |
| Global | Multi-language/currency, regional distributor networks, tariff/export considerations |

### 6. Catalog Size

Dramatically affects information architecture complexity:

| Size | Architecture approach |
|------|----------------------|
| 10–100 SKUs | Simple category browsing, no parametric search needed |
| 100–10K SKUs | Parametric search required, faceted navigation |
| 10K–100K SKUs | Deep taxonomy with mega menu, breadcrumbs, saved searches |
| 100K+ / configurable | Full parametric search + configurator. McMaster-Carr (700K+), MISUMI (sextillions of configurations) |

### 7. Configuration Complexity

How customizable are the products?

- **Fixed products** — standard catalog items sold as-is
- **Material/size variants** — same product in different materials, dimensions, or grades
- **Fully parametric** — infinite configurations defined by parameter selection (CPQ required)
- **Build-to-print** — fully custom from customer drawings (RFQ with file upload)

*Determines whether the site needs a configurator (17% higher conversion, 60–85% time-to-quote reduction) or a traditional catalog.*

### 8. Technical Depth of Audience

How sophisticated are the site's users?

- **Design engineers** — need full performance data, CAD files, material properties, tolerance tables. Most demanding audience.
- **Maintenance technicians** — need part number lookup, cross-references, compatibility info. Speed matters more than depth.
- **General contractors / buyers** — need product selection guidance, application recommendations. Less technically fluent.

*Determines spec table complexity, whether material selection guides are needed, and how much application guidance to provide.*

### 9. Compliance Complexity

Is the business in a heavily regulated industry?

- **Aerospace** — AS9100, NADCAP, ITAR. Traceability documentation, material certifications, process qualifications required per part.
- **Medical** — ISO 13485, FDA. Design history files, biocompatibility data, sterilization validation.
- **Automotive** — IATF 16949. PPAP documentation, statistical process control data.
- **Food/pharma** — FDA, HACCP, cGMP. Material contact certifications, clean room documentation.

*Higher compliance = more documentation downloads, longer qualification process, dedicated quality/certification page essential.*

### 10. Content Format Preferences

What technical content does the audience expect?

| Content type | Engineer preference (2025) | Priority |
|-------------|---------------------------|----------|
| Datasheets | 79% most valuable | Non-negotiable — every product must have one |
| Technical articles | 61% | High — application-specific problem-solving |
| CAD drawings | 37% | Non-negotiable — 89% only select from manufacturers with CAD online |
| Product demo videos | 35% | Medium — process demonstrations, installation |
| Product reviews | 34% | Medium — engineering peer testimonials |
| White papers | 32% | Medium — deep technical content for consideration |
| Case studies | 25% | Standard — problem → solution → result format |

### 11. CAD Ecosystem Integration

Which CAD formats do customers need?

Common formats and their ecosystems:
- **STEP (.stp)** — universal exchange format, works across most CAD systems
- **IGES (.igs)** — legacy exchange format, still widely used
- **SolidWorks (.sldprt)** — dominant in SMB manufacturing
- **AutoCAD (.dwg)** — dominant in architectural/structural applications
- **Creo/Pro-E (.prt)** — common in aerospace and automotive
- **STL (.stl)** — 3D printing and visualization

*89% of designers only select from manufacturers with CAD files online. 82% buy the physical part after downloading the CAD model. This is the most consequential content decision for industrial sites.*

### 12. Multi-Language / Currency Requirements

- **Languages** — which markets? English-only vs. German/French/Spanish/Polish/Chinese
- **Currency** — single currency, multi-currency display, or dynamic conversion?
- **Regional pricing** — same global pricing or region-specific?
- **Export controls** — ITAR or EAR restrictions on who can access certain product data?

---

## Common Project Shapes

| Shape | Typical scope | Default archetype | Key pages |
|-------|-------------|-------------------|-----------|
| **Parts distributor** (100+ SKUs) | Multi-page with deep catalog taxonomy | Catalog-Led | Home, Catalog (multi-level), Product Pages, Resource Library, RFQ, About |
| **Custom manufacturer** | Multi-page with process focus | Capability-Led | Home, Capabilities (per process), Equipment, Quality/Certs, Case Studies, RFQ, About |
| **Equipment OEM with dealers** | Multi-page + dealer portal | Distributor-Led | Home, Products, Applications, Distributor Locator, Resources, About |
| **Configurable products** | Product-centric with config wizard | Configurator-Led | Home, Product Families, Configurator, Specs, CAD Downloads, RFQ, About |
| **Industrial solutions provider** | Application-organized | Solution-Led | Home, Industries, Applications, Products, Case Studies, Resources, About |

---

## Unique Constraints

### Technical accuracy is non-negotiable
A wrong specification can cause engineering failures, safety incidents, or procurement disasters. Every spec table, tolerance value, and material designation must be verified. This constraint is absolute — there is no "good enough" for technical data.

### CAD file availability is a gating criterion
89% of designers only select components from manufacturers with CAD files online. A manufacturer without CAD downloads is invisible to the specification process. CAD models generate 2.5× greater leads than text-based information, and 82% of downloads convert to purchases.

### Desktop-dominant workflows
While mobile matters for initial research and maintenance technicians, the core engineering workflow (CAD evaluation, spec comparison, configuration) happens on desktop. Mobile responsiveness is important but desktop is the primary design target. Print-friendly pages still matter — engineers print specs for the shop floor.

### Engineers gate their own contact
Only 6% of engineers prefer no salesperson contact, but 60% complete the buying process online before reaching out. The site must support deep self-service without forcing premature sales contact. Registration walls for basic product data drive engineers to competitors.

### AI skepticism is high and rising
Trust in AI-generated content dropped to 4.4/10 (from 6.5 in 2024). 70% rarely or never use generative AI in purchasing decisions. Vendor websites and human expertise remain the primary trust anchors. Don't rely on AI-generated content for technical authority.

### 92% enter evaluation with a vendor in mind
Most B2B buyers start with at least one preferred vendor before formal evaluation (Forrester). The site's job is often to be the vendor already in mind — achieved through CAD availability, complete specs, and strong organic search presence — not to convert cold visitors.

---

## See Also

* `b2b/b2b-discovery.md` — shared B2B discovery (messaging hierarchy, generic assumptions, regulated industry guidance, specialization-as-positioning principle). Loaded automatically with any b2b-* sub-type.
* `b2b-industrial-archetypes.md` — the 5 strategic archetypes referenced throughout discovery.
