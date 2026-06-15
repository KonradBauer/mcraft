---
type: knowledge
purpose: "cross-domain patterns for organizing content at scale"
---
# Content Architecture Patterns

Cross-domain patterns for organizing content at scale.
Used by: Strategy & IA, Template Inventory.
Applies to: all site types with content sections.

---

## 1. Hub & Spoke Model (Topic Clusters)

For Resources, Blog, and Knowledge sections.

### Structure
```
[Pillar Page / Hub]  ←─────┐
       ↓                    │
┌──────┴──────┐             │
▼      ▼      ▼             │
[Spoke A] [Spoke B] [Spoke C]
(Links back to Hub)─────────┘
```

- **Hub (Pillar Page)**: Comprehensive guide targeting a broad keyword (e.g., "The Complete Guide to B2B Marketing").
- **Spokes (Cluster Content)**: Supporting articles, videos, case studies that link back to the Hub.
- **Internal Linking Rule**: Every blog post MUST have a sticky sidebar or inline CTA pointing to a relevant transactional page (Product, Pricing).

---

## 2. Case Study Architecture (Proof-Based)

### Taxonomy
Case studies MUST be filterable by:
- **Industry** (Healthcare, FinTech, etc.)
- **Use Case** (Onboarding, Retention, etc.)
- **Result Type** (Growth, Efficiency, Cost Savings)

### The "Glanceable" Header
Every case study page starts with a **Key Stats Bar**:
```
+-------------+-------------+-------------+
|   300% ROI  |  2-Week     |  $2M        |
|             |  Setup      |  Saved      |
+-------------+-------------+-------------+
```

### Atomic Deployment
Break case studies into reusable "atoms":
- **Quotes**: Distribute on Homepage, Pricing, Checkout.
- **Stats**: Use in Hero sections.
- **Logos**: Create a dynamic "Trusted by" bar across the site.

This is "Contextual Social Proof" – place evidence where objections arise.

---

## 3. Resources Section Navigation

**Anti-Pattern (Format-Based):**
- ❌ Whitepapers | Videos | Webinars

**Best Practice (Topic-Based):**
- ✅ Security | Compliance | Getting Started

Users search for *answers*, not *file formats*.
