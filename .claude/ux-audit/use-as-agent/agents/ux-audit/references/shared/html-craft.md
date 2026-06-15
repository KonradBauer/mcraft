---
type: knowledge
purpose: "Deliverable rules every HTML output must follow — semantic markup, no process metadata, text hierarchy, project language, color restraint. CSS source lives in templates.html."
---
Follow §Communication Rules from agent.md
# HTML Craft Base

Shared deliverable rules for ALL HTML outputs the agent emits (wireframes, messaging canvas, copy-doc, visual sitemaps, template inventories). This file documents the conventions every HTML deliverable must follow. The actual CSS lives elsewhere — see below.

Used by: wireframe-craft.md (wireframes), messaging-canvas.md (messaging canvas), messaging-copy-draft.md (copy doc)

---

## Google Fonts Link

Include in every HTML deliverable `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## CSS Source

Base CSS — `:root` tokens, global reset, body + h1–h4 typography, responsive base — lives inline inside every workflow template (`wireframing-template.html`, `audit-template.html`, `messaging-canvas-template.html`, `project-plan-template.html`) in each file's own top `<style>` block. Deliverable-specific CSS extensions (`.mc-*` for messaging canvas and copy-draft sub-page, `.pp-*` for project plan, `.wf-*` for wireframing, `.audit-*` for audit findings) live in the same per-template blocks. **Every template self-contains its full styling** — no shared CSS file loaded at render time.

**Cross-template synchronization is currently a manual discipline** — when base tokens change, each workflow template's top `<style>` block needs the same edit. A future project may introduce a build script, compliance test, or single-source mechanism for the shared portion; until then, the canonical base block lives in `wireframing-template.html` (the most-frequently-referenced template) and other templates are expected to track it when drift would matter. See `projects/archive/2026-04-21-wireframing-pipelines-unification/DECISIONS.md` for the sync-deferral rationale.

When generating any HTML deliverable, the agent clones the relevant workflow template in full (each is a complete self-contained HTML5 document) rather than extracting CSS blocks from a shared source. Head-metadata placeholder substitution (`{project-language}`, `{slug}`) happens at clone time. The deliverable rules below apply regardless of which template is cloned.

---

## Deliverable Rules

Rules that apply to ALL HTML deliverables regardless of type.

### Semantic HTML
- Use semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<h1>`–`<h6>`)
- Section headings use appropriate heading level (`<h3>` for section labels, not `<div>`)
- Lists use `<ul>`/`<ol>`, not styled `<div>` stacks

### No Process Metadata in Deliverables
- HTML deliverables are user-facing artifacts, not workflow dashboards
- Do NOT include: STOP numbers, step references, path labels ("Refine path"), workflow state, dates of generation
- Process metadata (which STOP, which step, which path) belongs in **chat output** alongside the deliverable, not inside the HTML file
- Exception: document title (`<title>` and `<h1>`) may include project slug for identification

### 3-Level Text Hierarchy
- Primary: `--wf-text` (#111) — headings, decisions, key content
- Secondary: `--wf-secondary` (#444) — supporting text, evidence, descriptions
- Muted: `--wf-muted` (#888) — labels, annotations, tertiary info

### Project Language
- All labels, headings, field names, row labels, UI text (buttons, toggles), variant chips, and descriptive option names render in the project language at runtime
- Reference templates use English as structural placeholders — agent translates when generating the actual deliverable
- Follows §Communication Rules from agent.md: "All output in project language — labels, headings, field names included"
- Confidence labels also render in project language
- Variant chip labels are descriptive (effect-based, not source-based) and render in project language

### Color Restraint
- Grayscale base — no brand colors, no gradients
- One accent color (`--wf-accent`) permitted for system meaning only (e.g., primary action, active state)
- Semantic colors (green/yellow/red) permitted only for confidence/status indicators — not decoration

### Two-level CSS scoping — core vs. extensions

Interactive deliverables follow a two-level class-prefix discipline: `.wf-*` is the **core** prefix owned by the template (closed element vocabulary — `.wf-card`, `.wf-grid`, `.wf-button`, etc.), and `.wf-ext-*` is the **extension** prefix used when an authored data block needs custom styling for a kind outside the closed core. Project data blocks may carry a top-level `customStyles` string; the shell IIFE injects it at `DOMContentLoaded` after a namespace guard scrubs any rule whose selector does not start with `.wf-ext-`. This keeps the core appearance stable across projects while giving authors a structured escape hatch. Canonical convention + worked example: see `references/shared/interactive-deliverable-shell.md` §Two-level CSS scoping convention.
