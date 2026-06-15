---
type: knowledge
purpose: "UI component library and patterns for documentation kb websites"
---
Follow §Communication Rules from agent.md
# Documentation & KB: Component Library

Domain knowledge for documentation sites and knowledge bases.
Part of: references/domains/documentation-kb/

**Source of Truth** for strict component structure and behavioral design.

---

## 1. Search-First Hero
**Goal:** Make search the dominant first action. Documentation homepages exist to route — search is the fastest router.

### Anatomy
* **Search input**: Large, prominent (50%+ of hero width). Full-width on mobile.
* **Magnifying glass icon**: Left-aligned inside input.
* **Autocomplete**: Dropdown with results as user types. Shows page titles, section headers, and code symbols.
* **Keyboard shortcut hint**: "Press / to search" or "Cmd+K" displayed near input. Power users expect keyboard access.
* **Background**: Minimal. No imagery, no gradients that compete with search. Solid color or subtle pattern.
* **Popular searches** (optional): 3-5 pill links below search bar showing common queries ("Authentication", "Rate Limits", "Webhooks").

### Anti-Patterns
* No marketing headline above search (signals "wrong page" to developers).
* No small search icon tucked in the corner (search is the primary action, not a utility).
* No missing autocomplete (forces exact query matching, increases failed searches).
* No search that only matches page titles (must index full content, code examples, and headings).

---

## 2. Code Snippet Block
**Goal:** Copyable, runnable code examples. The core unit of developer documentation.

### Anatomy
* **Syntax highlighting**: Language-appropriate coloring. Must support the product's primary languages.
* **Language selector tabs**: cURL, Python, Node.js, Ruby, Go (or whatever the product supports). Tabs persist across the page — selecting Python once shows Python everywhere.
* **Copy button**: Top-right corner of code block. Shows "Copied!" feedback for 2 seconds.
* **Line numbers**: Visible for blocks >5 lines.
* **SDK version indication**: Badge or comment showing which SDK version the example targets.

### Anti-Patterns
* No non-copyable code (screenshots of code, code in images).
* No single-language only for multi-SDK products (forces developers to mentally translate).
* No outdated code that no longer compiles/runs.
* No missing version indication when breaking changes exist between SDK versions.

---

## 3. Version Selector
**Goal:** Ensure visitors see documentation for the correct product version. Critical when breaking changes exist between versions.

### Anatomy
* **Dropdown**: Shows version list ("v3.2 (latest)", "v3.1", "v2.x (legacy)"). Current version clearly labeled. Located in top navigation or sidebar header.
* **Version banner**: When viewing non-latest docs, a persistent banner warns: "You are viewing docs for v2.x. Switch to latest." Distinct background color (yellow/amber).
* **URL structure**: Version embedded in URL path (/docs/v3/authentication). Enables bookmarking and sharing specific-version docs.
* **Default behavior**: Always default to latest version. Never default to an outdated version.

### Anti-Patterns
* No missing version selector when multiple versions have breaking changes (visitors follow wrong instructions).
* No defaulting to an outdated version (new users start with old docs).
* No missing visual warning when viewing old docs (visitor does not realize they are on the wrong version).
* No version changes losing the visitor's current page (should navigate to same page in new version).

---

## 4. API Reference Sidebar
**Goal:** Persistent hierarchical navigation for API endpoints. Enables rapid jumping between related endpoints.

### Anatomy
* **Collapsible tree**: Endpoint groups > individual endpoints > HTTP methods. Current page highlighted with accent color. Parent sections auto-expanded.
* **Expand/collapse**: Click to toggle groups. Visual indicator (chevron/arrow) shows state.
* **Scroll position**: Sidebar scrolls independently from content. Current page auto-scrolled into view on load.
* **Sticky behavior**: Sidebar persists on content scroll. Does not scroll with the page.
* **Search/filter** (for large APIs): Text input at top of sidebar filtering the tree in real-time.

### Anti-Patterns
* No flat list of 200+ endpoints without grouping (impossible to navigate).
* No sidebar disappearing on scroll (visitor loses navigation context).
* No missing current-page indicator (visitor cannot orient within the hierarchy).
* No groups matching internal code organization instead of user tasks (developers think in tasks, not modules).

---

## 5. Feedback Widget
**Goal:** Capture content quality signal directly from the reader. Enables data-driven content improvement.

### Anatomy
* **Prompt**: "Was this helpful?" displayed at bottom of every content page.
* **Thumbs up / thumbs down**: Binary choice. Low friction — one click to respond.
* **Optional text field**: Appears after thumbs down. "What were you looking for?" Free text, not required.
* **"Edit this page" link**: Routes to source file on GitHub/GitLab. Empowers community contributions.
* **Confirmation**: Brief "Thanks for your feedback" message after submission.

### Anti-Patterns
* No missing feedback mechanism on docs pages (no signal for content quality).
* No multi-step survey (too much friction — binary is sufficient for signal).
* No feedback widget that requires login (eliminates most responses).
* No "Edit this page" link pointing to a non-editable location.

---

## 6. Breadcrumb Navigation
**Goal:** Orientation within deep hierarchies. Answers "Where am I?" at a glance.

### Anatomy
* **Path trail**: Docs > Section > Subsection > Current Page. Each segment is a clickable link except the current page.
* **Separator**: ">" or "/" between segments. Consistent across all pages.
* **Placement**: Top of content area, above the page title. Below the global nav, above the content.
* **Truncation**: For paths >4 levels, collapse middle segments with "..." expandable on click.

### Anti-Patterns
* No missing breadcrumbs in deep hierarchies (visitor loses spatial context).
* No breadcrumbs that do not match sidebar navigation (conflicting mental models).
* No non-clickable breadcrumb segments (defeats the purpose of navigation).
* No breadcrumbs showing file system paths instead of human-readable labels.

---

## 7. Table of Contents (On-Page)
**Goal:** In-page navigation for long content pages. Shows document structure at a glance.

### Anatomy
* **Heading list**: Auto-generated from H2 and H3 headings. Indented to reflect hierarchy.
* **Position**: Right sidebar on desktop (sticky). Collapsed into expandable section on mobile.
* **Active state**: Current section highlighted as visitor scrolls (scroll spy).
* **Click behavior**: Smooth scroll to target heading with URL hash update.

### Anti-Patterns
* No including H4+ headings (too much detail, defeats scannability).
* No table of contents on short pages (<3 sections — adds clutter without value).
* No missing scroll spy (visitor cannot tell which section they are currently reading).

---

## 8. Callout / Admonition Block
**Goal:** Draw attention to critical information that the reader must not miss — warnings, tips, deprecation notices.

### Anatomy
* **Types**: Note (blue/info), Tip (green/success), Warning (yellow/amber), Danger (red/error), Deprecated (strikethrough styling).
* **Icon**: Left-aligned icon matching the type (info circle, lightbulb, triangle alert, stop sign).
* **Title**: Optional bold title ("Breaking Change in v3.0").
* **Content**: 1-3 sentences. Must be actionable — not just "Be careful" but "Do X to avoid Y."

### Anti-Patterns
* No overuse (>3 callouts per page diminishes their attention-drawing power).
* No long callouts (>3 sentences — move to its own section).
* No warning without action ("Be careful with this" — careful HOW?).
* No using callouts for primary content (they are interruptions, not content containers).


---

## See Also

- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
- `shared/accessibility.md` — WCAG wireframe decisions, focus, target size, landmarks
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/emerging.md` — AI chat, dark mode, interactive demos, passwordless auth
