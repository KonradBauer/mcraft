---
type: agent-ops
purpose: "Baseline sitemap structure template"
---
# Flexible sitemap structure (indented list)

Use this structure as a baseline. Adapt labels based on `ia_principles.md` (Problem Space).

* **Format**: use a simple **Indented List** (Standard Markdown List).
* **Why?**: Faster to iterate, easier to read, no rendering errors.

```markdown
* Home
    * [Primary Nav 1] (e.g., Offering)
        * [Sub-item 1]
        * [Sub-item 2]
    * [Primary Nav 2] (e.g., About)
        * [Sub-item]
    * [Conversion Point] (e.g., Contact)
```

## Adaptation rules
1. **Language**: Use **ONLY** the project's selected language (defined in `project_context.md`). Do NOT include English equivalents (e.g., write "Oferta", NOT "Oferta (Offering)"). This applies to ALL output including navigation labels, footer categories, and mega menu entries.
2. **Top Tasks**: Ensure the top 3 user tasks are reachable within 1 click.
3. **Naming**: Use labels like "Automate X" (Problem) instead of "Module Y" (Solution).

---

## Footer architecture ("The Safety Net")

The footer is where users go when the main navigation fails them.

### Fat Footer Pattern
Expose the entire second-level hierarchy for SEO and power users:
```
┌─────────────────────────────────────────────────────┐
│ OFFERING     │ SOLUTIONS    │ RESOURCES  │ COMPANY  │
│ - Feature A  │ - Industry 1 │ - Blog     │ - About  │
│ - Feature B  │ - Industry 2 │ - Docs     │ - Team   │
│ - Feature C  │ - Role 1     │ - Guides   │ - Careers│
└─────────────────────────────────────────────────────┘
│ [Tiny Tasks: Privacy Policy | Terms | Media Kit]   │
└─────────────────────────────────────────────────────┘
```

**Language adaptation:** The diagram above uses English labels as a structural template. In output, translate ALL footer category names and items to the project language and adapt them to the specific project context. Do not translate 1:1 from the template — choose categories that match the project's actual content structure (e.g., a SaaS product might use "Product", "Solutions", "Resources", "Company" while a services company might use "Services", "Industries", "Knowledge", "About").

### Footer rules
* **Tiny Tasks Home**: Privacy, Terms, Media Kit belong here, NOT in header.
* **CTA Persistence**: Include a final conversion CTA (e.g., Newsletter signup).

---

## Mega menu pattern (optional)

For mature companies with multiple products/audiences.

### Product vs Solution dichotomy
Separate paths for different user needs:

```
┌─────────────────────────────────────────────────────┐
│ BY PRODUCT          │ BY SOLUTION                   │
│ (Technical Buyer)   │ (Business Buyer)              │
│ - CRM Module        │ - Increase Sales              │
│ - Analytics Module  │ - Reduce Churn                │
│ - API Platform      │ - Automate Reporting          │
│ - API Platform      │ - Automate Reporting          │
└─────────────────────────────────────────────────────┘
```

**Language adaptation:** Same as footer — translate all labels to the project language and adapt column names to match the project's actual product/solution structure. The Technical Buyer / Business Buyer distinction stays as a design principle but labels are translated.

* **Left column (Product)**: For bottom-funnel users who know what they need.
* **Right column (Solution)**: For top-funnel users who feel pain but don't know the remedy.

---

## IA decision reasoning schema

For significant IA decisions (non-obvious structural choices, label decisions, navigation trade-offs), record a reasoning item alongside the sitemap. Include one reasoning item per decision that the reader could not reconstruct from the sitemap alone.

**Schema:**

| Field | Type | Description |
|:------|:-----|:------------|
| `element` | string | The page, section, nav item, or structural element being decided |
| `rationale` | string | Why this element exists or is structured this way |
| `alternatives` | array of strings | Other options considered and rejected |
| `confidence` | `high` \| `medium` \| `low` | How certain the agent is that this is the right call |
| `decision_status` | `confirmed` \| `provisional` \| `needs-validation` | Whether user has approved, it's a working assumption, or it needs more input |

**Example (markdown table form, for inline use in ux_strategy.md):**

| Element | Rationale | Alternatives | Confidence | Status |
|:--------|:----------|:-------------|:-----------|:-------|
| Solutions / By Role | Multiple personas in discovery; role routing reduces pogo-sticking | By Industry, single "How it works" | high | confirmed |
| Resources hub (top nav) | Content volume warrants its own nav slot; SEO secondary benefit | Footer-only, no resources section | medium | provisional |
| No dedicated Pricing page | Pricing is custom/sales-led; publishing it creates support noise | Standard pricing page, pricing on landing | low | needs-validation |

**Example (JSON block form, used inside the `strategy_meta` output):**

```json
"sitemap_ia_decisions": [
  {
    "element": "Solutions / By Role",
    "rationale": "Multiple personas confirmed in discovery; role-based routing reduces pogo-sticking",
    "alternatives": ["Solutions / By Industry", "Single 'How it works' page"],
    "confidence": "high",
    "decision_status": "confirmed"
  },
  {
    "element": "Resources hub (top nav)",
    "rationale": "Content volume warrants own nav slot; SEO secondary benefit",
    "alternatives": ["Footer-only", "No resources section"],
    "confidence": "medium",
    "decision_status": "provisional"
  }
]
```

**Rules:**
* Record reasoning items only for non-obvious decisions — do not annotate self-evident structure.
* For one-pager projects, `element` refers to sections, not pages.
* Confidence `low` always requires `decision_status: needs-validation`.
