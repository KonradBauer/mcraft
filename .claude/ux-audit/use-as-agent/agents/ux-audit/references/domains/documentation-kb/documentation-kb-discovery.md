---
type: knowledge
purpose: "Discovery questions and research framework for documentation kb projects"
---
# Documentation & KB: Discovery

Domain knowledge for documentation sites and knowledge bases.
Part of: references/domains/documentation-kb/

---

## Key Assumptions to Form

- **Developer docs or non-technical KB?** Technical audience (developers, engineers) vs. end-user audience (business users, customers). Determines vocabulary, content format (code snippets vs. annotated screenshots), and navigation model.
- **API-first or UI-first product?** API-first needs endpoint reference, code examples, SDKs. UI-first needs feature walkthroughs, annotated screenshots, video tutorials.
- **Version control needed?** Multiple product versions in market simultaneously? Breaking changes between versions? Determines whether version selector and version-specific URLs are required.
- **Search requirements** — Full-text search, fuzzy matching, code-aware search (searching for function names, parameters)? Volume of content determines search infrastructure needs.
- **Content authoring model** — MDX/Markdown in a Git repo, CMS-based, auto-generated from code (OpenAPI, JSDoc), or a mix? Determines update workflow and contributor experience.
- **Multi-language / i18n?** Documentation in multiple human languages? Determines URL structure, translation workflow, and content parity tracking.
- **Content volume** — Dozens of pages or thousands? Determines whether flat structure or deep hierarchy is appropriate, and whether search is a nice-to-have or a requirement.

---

## Common Project Shapes

- **API / developer docs**: Utility-First archetype. Sidebar + search + code examples. MDX/Markdown source. OpenAPI for reference pages.
- **SaaS help center**: Knowledge Base archetype. Category grid + search + screenshot-heavy articles. CMS or help desk platform (Zendesk, Intercom).
- **Open-source project docs**: Utility-First archetype. Community contributions via GitHub PRs. Getting started guide is the most critical page. README is the true homepage.
- **Internal company KB**: Knowledge Base archetype. Wiki-style (Confluence, Notion). Search and categorization are primary. Freshness is the main challenge.
- **Product documentation hub**: Product Documentation Hub archetype. Task-oriented structure. Mix of guides, walkthroughs, and video. Often embedded within the product.

---

## Unique Constraints

- **Content must be technically accurate** — Unlike marketing copy, documentation errors cause real failures. Code examples must compile and run. Configuration values must be correct. Inaccuracy destroys trust faster than incompleteness.
- **Examples must actually work** — Every code snippet, API call, and configuration example should be tested against the current version. Automated testing of docs examples (doctest) is a best practice.
- **Search quality makes or breaks the experience** — For documentation, search is not a feature — it is the primary navigation mechanism. Poor search quality is the single highest-impact failure mode.
- **Stale content is worse than missing content** — A missing page returns a 404 and forces the visitor to ask support. A stale page returns wrong instructions the visitor follows, causing failures and eroding trust. Last-updated dates and content review cycles are essential.
- **Deep linking is essential** — Documentation URLs are shared in Slack messages, Stack Overflow answers, GitHub issues, and code comments. URLs must be permanent, human-readable, and granular (heading-level anchors).

---

## Top Tasks

| Task | Frequency | What the site must do |
|------|-----------|----------------------|
| Search for a specific answer | Very high | Return relevant results within the first 3 results. Support partial queries, typos, and code terms. |
| Follow a tutorial / getting started | High | Provide linear, step-by-step path with zero assumed knowledge. Every step produces visible output. |
| Browse API reference | High | Persistent sidebar navigation with endpoint grouping. Code examples in multiple languages. |
| Check changelog / what is new | Medium | Chronological list with version numbers, dates, and categorization (breaking, feature, fix). |
| Report an issue or contribute | Low-Medium | "Edit this page" links, GitHub issue templates, feedback widgets. |

---

## Primary Conversion

Not applicable — documentation is a utility site. There is no conversion funnel, no persuasion arc, no lead capture goal.

**Success = visitor found the answer and returned to their work.**

Metrics that matter: time-to-answer, search success rate, bounce rate from search results, support ticket deflection rate, page feedback scores.

---

## Visitor Anxieties and Trust Signals

| Anxiety | Trust signal |
|---------|-------------|
| "Is this up to date?" | Last-updated date on every page. Version badge on code examples. Changelog with recent entries. |
| "Does this work with my version?" | Version selector in navigation. Version-specific URLs. Banner warning on old docs. |
| "Can I trust this code example?" | Working code with copy button. Language tabs. SDK version indication. Automated testing badge. |
| "Is this the official source?" | Custom domain (docs.company.com). Consistent branding with product. "Official" label in search results. |
| "Will this URL still work tomorrow?" | Permanent URLs. Redirect from old paths. No link rot. |
| "Who wrote this / can I contribute?" | GitHub edit links. Community contribution guidelines. "Last edited by" attribution. |
