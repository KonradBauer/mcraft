---
type: knowledge
purpose: "Principles, patterns, vocabulary, and composition recipes for low-fidelity HTML wireframes"
---
Follow §Communication Rules from agent.md
# Low-Fi Wireframe Craft

Principles, vocabulary, composition recipes, and CSS architecture for building low-fidelity HTML wireframes.
Used by: Wireframing (WF4 — HTML wireframe production), Reverse-Wireframing (finishing pass).
Applies to: all site types.

**Data contract (v4.2+):** `references/wireframing/wireframing-schema.md` is the single source of truth for the JSON schema — section→element structure, the 13 core leaf kinds, the 3 container kinds, the extension envelope, and the MD output mapping. Do NOT duplicate the schema or the per-kind MD mapping here. This craft doc covers principles, vocabulary intent, composition recipes, antipatterns, and HTML/CSS scoping conventions.

**Living reference:** the embedded design-system preview in `references/wireframing/wireframing-template.html` is the canonical shape reference for every core kind, every promoted kind, every variant, and the extension mechanism. One preview page with all 11 section examples stacked in order — open the template directly in a browser and scroll to the matching section when in doubt about composition.

---

## Include / Exclude Ruleset

Single ruleset — no fidelity levels. Every HTML wireframe follows these rules.

### Include

- Content regions/zones with clear visual hierarchy
- Inter (Google Fonts) as primary font, hierarchy via size/weight/letter-spacing (1rem body, 2rem H2, 2.5rem H1)
- Real draft copy for all headings, paragraphs, button labels, link labels, micro reassurance — never lorem ipsum, never label-only placeholders
- Solid gray placeholder boxes with centered text labels for media — sized via `media.height` (`sm` / `md` / `lg` / `cover`)
- Native HTML controls with browser-default styling (inputs, selects, textareas, buttons)
- Semantic HTML5 elements (nav, article, aside, section, footer)
- Full-width sections, content contained via `.wf-inner` wrapper (max-width 1200px) inside each section
- Annotations as visible inline notes (monospace, uppercase, dashed border)
- 3-level text color hierarchy: primary (#111), secondary (#444), muted (#888)

### Exclude

- Brand colors, gradients, themed palettes
- Custom font pairings, precise kerning (Inter only, weight + size for hierarchy)
- Real photography, final illustrations, detailed icons
- Pixel-perfect spacing, complex overlapping grids
- JavaScript animations, hover states, micro-interactions
- Custom-styled dropdowns, shadow DOM, UI component libraries
- Lorem ipsum or generic dummy text

### Conditional

- One accent color permitted for system meaning only (e.g., primary button background `#1a1a1a`) — must not imply branding
- Extension-scoped CSS via top-level `customStyles` is permitted when an extension kind cannot render acceptably with the generic fallback (see §Extension architecture)

---

## Core Principles

1. **Optimize for the decision being made** — Match fidelity to uncertainty level. Low-fi wireframes answer "Is this the right structure?" — not "Does this look good?"
2. **"Just enough" detail** — Communicate hierarchy and flow without constraining visual design. Enough to evaluate structure; not so much that reviewers critique aesthetics.
3. **Content-out design** — Layout dictated by content priority, not container shapes. Start with what the section says, then find the kind.
4. **Make hierarchy testable in seconds** — A 5-second glance reveals: what's most important, what's secondary, where to act. Achieved through type scale + spacing + position.
5. **Deliberate imperfection** — Must look like a draft. Grayscale, native controls signal "critique structure, not aesthetics."
6. **Semantic rigor** — Meaningful HTML markup (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`) enables accessibility testing and clean MD extraction.
7. **Native responsiveness** — Mobile-first single-column default. Progressive enhancement at breakpoints. Simple CSS media queries only.
8. **Closed core first, extensions sparingly** — The 13 core leaf kinds and 3 container kinds cover patterns recurring across ≥5 domains. Reach for extensions only when the closed core (including the 5 promoted kinds) cannot express intent.

---

## Vocabulary — Atoms (13 core leaf kinds)

The closed core leaf kinds are the atoms every wireframe is composed from. The schema defines field shapes and rendering contracts; this section explains intent and when to reach for each.

### Text & structure

- `heading` — Section and page titles. `level: 1–4` maps to `<h1>`–`<h4>`. Use `level: 1` once per page (typically the hero), `level: 2` for top-level section titles, `level: 3` inside cards.
- `paragraph` — Body copy. One concrete idea per paragraph; if a section needs more than three paragraphs, the section is doing too much.
- `label` — Uppercase eyebrow above a heading. Categorizes the section ("FOR REVENUE TEAMS", "WHAT YOU GET", "PRICING"). Sets reader expectation in one glance.
- `micro` — Italic risk-reducer or reassurance copy. Lives next to fields and conversion buttons ("No credit card. Cancel any time."). If a paragraph reads as a footnote, it should be a `micro`.
- `list` — `ordered: true | false`. Use for feature lists inside pricing cards, requirement enumerations, ordered procedures.

### Actions (button vs link split)

The single most important vocabulary distinction. `cta` is deprecated — never write new wireframes that treat `cta` as the button primitive.

- `button` — A button-styled action. Variants:
  - `primary` — One per section, max one per page in most layouts. The high-commitment ask ("Start free trial", "Send the message", "Book the demo").
  - `secondary` — Low-commitment alternative next to a primary, or a single ask in lower-conversion contexts ("Talk to sales", "Contact us", "Watch demo" when packaged as a button rather than an arrow link).
- `link` — A text-styled navigation element. Variants:
  - `plain` — Inline reference inside body copy or footers.
  - `arrow` — Standalone "more info" affordance with the trailing → glyph. Used at the bottom of feature cards ("How call logging works →"), in resource lists, and anywhere a button would over-promise commitment.

The rule of thumb: if clicking starts a flow or transaction, it's a `button`. If clicking moves the visitor to read more, it's a `link`. An arrow link is NOT a button — see §Antipatterns.

### Media

- `media` — Gray placeholder box with a centered label. Required field: `label` (descriptive alt, e.g. `[Hero image — pipeline view]`). Optional `height` controls vertical space:
  - `sm` (≈120px) — Icon grids, feature card icons, inline glyphs
  - `md` (≈240px, default) — Standard content imagery, in-flow screenshots
  - `lg` (≈400px) — Featured imagery, full-width content blocks below the fold
  - `cover` — Fills the parent card height; use ONLY inside a `card` child of a `grid` (the card stretches via `align-self: stretch`, giving `cover` real container height to fill). This is the canonical hero composition pattern.
  Width remains container-driven — there is no `media.width`. If you need a hero with the image to the right of the copy, compose `grid(2, [card(copy), card(media height: cover)])`.

### Form

- `field` — Native `<input>`, `<select>`, or `<textarea>`. Required: `name`, `fieldType` (`text` | `email` | `select` | `textarea`), `placeholder`. Use real placeholders ("Your work email", not "Input"). Fields stack one per row in low-fi; multi-column form layouts are a mid-fi concern.

### Promoted kinds

Five patterns promoted from the domain reference library to closed kinds because they recur in ≥5 domains with stable shape and clear semantic intent. Use them by name — never re-implement them out of generic cards.

- `stat` — `value` + `label`, optional `detail` and `icon`. Renders a prominent value with a small label underneath. Always wrap stats in a `grid` (typical: `grid(3, …)` or `grid(4, …)`). Replaces the v4.2 anti-pattern of using oversized headings to fake a stat block.
- `testimonial` — `quote` + `author`, optional `role`, `company`, `photo`, `rating` (1–5). Renders as `<blockquote>` with author block. Always wrap testimonials in a `grid` (typical: `grid(3, …)`). Replaces the v4.2 pattern of flattening testimonials into generic cards with bold attribution lines.
- `trust-bar` — Single horizontal strip of logo / badge `items[]`. Used directly under hero or above-the-fold to bank credibility. Distinct from a `grid` of logos because it implies a strip layout, not a card grid.
- `banner` — Single-line top-of-page strip for announcements (event, release, regulatory note). Optional `dismissible: true`. Use sparingly; over-using banners trains visitors to ignore the strip entirely.
- `accordion` — `items[]` of `{ label, body }` with optional `defaultOpen` (item label string). Renders via native `<details>`/`<summary>`, toggle state baked in. The only kind that genuinely could not be expressed in the v3 vocabulary; FAQs were previously faked with stacked cards. Always reach for `accordion` for FAQ patterns.

---

## Vocabulary — Containers (3 core container kinds)

- `grid` — `columns: integer | number[]`, `children[]`. Integer for equal columns (2, 3, 4); array for asymmetric ratios (e.g. `[1, 2]` or `[475, 665]`). Children may be cards, leaf kinds, or extension elements. Mixing is allowed for asymmetric patterns. The wrapper for all multi-column compositions.
- `card` — `children[]` of leaf kinds only (no nested grids, no nested cards). Optional `variant: default | tile | highlight`. `default` is flush (transparent, no padding — layout grouping when the live page shows no visible tile border); `tile` is warm-fill rounded (use when the live page has a visible bordered card); `highlight` is accent-bordered (featured/recommended card). Cards are flex columns with `align-self: stretch` when grid children — this is what lets `media` with `height: cover` fill the card.
- `accordion` — Listed both as a promoted leaf-style kind and a container because its `items[].body` arrays accept leaf kinds. No nested accordions or grids inside an accordion item — exactly one level of nesting.

**Recursion cap (binding):**
- `grid` may contain `card` children OR leaf kinds (incl. `stat`, `testimonial`) directly.
- `card` may contain only leaf kinds.
- `accordion` items' bodies contain only leaf kinds.

If you find yourself wanting `card-in-card` or `grid-in-card`, the design wants two sections, not one nested layout.

---

## Composition Recipes

Canonical shapes for the common section types. Every recipe matches a section in the embedded design-system preview — open the template to see the rendered version.

### Hero (canonical 2-column composition)

```
grid(2,
  card(
    label,
    heading (level: 1),
    paragraph,
    button (variant: primary),
    link   (variant: arrow)
  ),
  card(
    media (height: cover)
  )
)
```

The right card is intentionally a single `media` with `height: cover` so the image fills the card height the left card sets via copy — that's what gives the hero visual weight. A bare `media` outside a card collapses to ~120px regardless of context.

### Trust-bar

```
label,
trust-bar (items: [logo × 6])
```

Use directly under the hero. The optional `label` ("TRUSTED BY REVENUE TEAMS AT") frames the strip; without it, the logos read as random.

### Banner

```
banner (text: …, dismissible: true | false)
```

A `banner` is its own section by convention — not nested inside a content section. Reserve for time-sensitive announcements.

### Features (3-column card grid)

```
label,
heading (level: 2),
grid(3,
  card(media (height: sm), heading (level: 3), paragraph, link (variant: arrow)),
  card(media (height: sm), heading (level: 3), paragraph, link (variant: arrow)),
  card(media (height: sm), heading (level: 3), paragraph, link (variant: arrow))
)
```

The arrow link, not a button, is the right action for feature cards — the visitor isn't converting from a feature card, they're moving deeper into the story.

### Stats (4-column stat grid)

```
label,
grid(4,
  stat (value, label, detail?),
  stat (value, label, detail?),
  stat (value, label, detail?),
  stat (value, label, detail?)
)
```

Always use `stat` kinds, never oversized headings. The rendered shape — large value, small label below, optional detail line — is what makes a stat block legible at a glance.

### Testimonials (3-column testimonial grid)

```
label,
grid(3,
  testimonial (quote, author, role, company, photo?, rating?),
  testimonial (quote, author, role, company, photo?, rating?),
  testimonial (quote, author, role, company, photo?, rating?)
)
```

Always use `testimonial` kinds. The 5-star `rating` is optional — include it only when the source actually has ratings (e.g. UGC-style review pages).

### Pricing (3-column with highlight)

```
label,
grid(3,
  card (variant: tile,      children: heading, paragraph (price), list, button (variant: secondary)),
  card (variant: highlight, children: label ("MOST TEAMS PICK THIS"), heading, paragraph (price), list, button (variant: primary)),
  card (variant: tile,      children: heading, paragraph (price), list, button (variant: secondary))
)
```

The highlight card anchors the recommended tier. Its inner `label` ("MOST TEAMS PICK THIS") makes the recommendation explicit; relying on the visual variant alone is too subtle in low-fi.

### Process / timeline (extension)

```
label,
grid(4,
  process-step (className: wf-ext-process-step, fields: { stepNumber, label, description }),
  process-step (className: wf-ext-process-step, fields: { stepNumber, label, description }),
  process-step (className: wf-ext-process-step, fields: { stepNumber, label, description }),
  process-step (className: wf-ext-process-step, fields: { stepNumber, label, description })
)
```

`process-step` is an extension kind — there's no closed-core `process-step`. The schema's extension envelope makes this composable without bloating the core. Pair with a `customStyles` rule scoped to `.wf-ext-process-step` for the connector lines / numbered badges. See §Extension architecture for the full envelope.

### FAQ (accordion)

```
label,
accordion (
  defaultOpen: "<label of the highest-confidence first question>",
  items: [
    { label, body: [paragraph] },
    { label, body: [paragraph] },
    …
  ]
)
```

The first item starts open as the highest-confidence visitor question — gives the section visual anchor and demonstrates the pattern.

### Contact form

```
heading (level: 2),
paragraph,
field (name: name,  fieldType: text,     placeholder: "Your name"),
field (name: email, fieldType: email,    placeholder: "Work email"),
field (name: team,  fieldType: select,   placeholder: "Team size — pick one"),
field (name: notes, fieldType: textarea, placeholder: "What are you trying to fix? (optional)"),
micro (text: "We'll never share your email. Replies come from a real CSM, not a bot."),
button (variant: primary, label: "Send the message")
```

The `micro` immediately above the submit button is the canonical place for reassurance copy — it answers the "what do I lose by clicking" objection at the moment of decision.

### CTA section (button × 2)

```
heading (level: 2),
paragraph,
button (variant: primary,   label: "Start free trial"),
button (variant: secondary, label: "Talk to sales instead"),
micro  (text: "Trials are 14 days. No card required.")
```

The dual-button pattern (primary + secondary side by side) gives a hesitant visitor a low-commitment alternative without forcing them off-page. The trailing `micro` removes the last conversion-blocker.

---

## Extension architecture

When the closed core cannot express intent — process timelines with custom step styling, comparison rows, pricing-tier metadata strips, team-member cards — use the structured extension envelope. Extensions preserve core predictability (MD export, audit state, cross-project comparability) while restoring authoring inventiveness.

### Envelope (recap — full spec in schema)

Every extension element carries:

- `kind` — Stable, lowercase, hyphen-separated name (`process-step`, `comparison-row`, `pricing-tier-meta`, `team-member`).
- `className` — CSS class for the rendered element. **Must be prefixed `wf-ext-*`.** The renderer's namespace guard scrubs any custom CSS rule whose outermost selector does not match this prefix.
- Either `fields` (structured per-extension shape) OR `children` (array of leaf core kinds) — not both.
- `fallbackMd` — Markdown emitted when MD is rendered. Required because both renderers (IIFE client-side and agent on-request) must produce identical output (see schema §Two-path MD renderer contract).

### Worked example 1 — `process-step`

```json
{
  "kind": "process-step",
  "className": "wf-ext-process-step",
  "fields": {
    "stepNumber": "1. Day 0",
    "label": "Connect your CRM",
    "description": "OAuth into HubSpot or Salesforce. Read-only at first."
  },
  "fallbackMd": "**1. Day 0 — Connect your CRM** · OAuth into HubSpot or Salesforce. Read-only at first."
}
```

Paired with a top-level `customStyles` rule:

```css
.wf-ext-process-step {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-left: 3px solid var(--wf-accent);
}
.wf-ext-process-step .wf-ext__field-key { display: none; }
```

The second rule hides the generic-fallback definition-list keys ("stepNumber:", "label:", "description:") because the custom layout renders the values in a meaningful order without needing the field names visible.

### Worked example 2 — `comparison-row`

```json
{
  "kind": "comparison-row",
  "className": "wf-ext-comparison-row",
  "children": [
    { "kind": "label",     "text": "Auto-logged calls" },
    { "kind": "paragraph", "text": "Available in Starter and Growth" },
    { "kind": "paragraph", "text": "Available in Enterprise with audit log" }
  ],
  "fallbackMd": "- **Auto-logged calls** — Starter / Growth · Enterprise (with audit log)"
}
```

Uses `children` instead of `fields` because each cell is itself a leaf kind. Pair with `customStyles` scoped to `.wf-ext-comparison-row` to lay the children out as 3 columns with `display: grid`.

### When NOT to extend

- The pattern fits a closed-core kind. `stat`, `testimonial`, `trust-bar`, `banner`, `accordion` already cover the most common cases — never re-invent them as extensions.
- The pattern occurs in only one section of one project. Extensions are for patterns the agent will reach for repeatedly (cross-project bounded names: `process-step`, `comparison-row`, `pricing-tier-meta`, `team-member`).
- Reverse-mode wireframing — Phantom doesn't emit extensions, and the finishing-pass authority is bounded to the closed core. Extensions are a forward-mode tool only.

### Generic fallback

Unknown kinds (no matching IIFE renderer) render via `<div class="wf-ext wf-ext--{kind} {className}">` with `children` walked recursively or `fields` rendered as a definition list. The fallback keeps an unknown extension visible (boxed and labeled) rather than silently dropped.

---

## Anti-Patterns

1. **Rendering arrow-links as `cta`** — The classic v4.2 conflation. An arrow link is `link` with `variant: arrow`, not `cta`/`button`. If a feature card's "Learn more →" renders as a button, you've miscoded the kind. The button vs link split exists precisely to surface this mistake at authoring time.
2. **Treating `cta` as the button primitive** — `cta` is a deprecated one-release back-compat alias that routes to `button`. New wireframes must use `button` (variants `primary` | `secondary`) for actions and `link` (variants `plain` | `arrow`) for inline navigation. Any new content using `cta` should be flagged in self-correction.
3. **Faking `stat` blocks with oversized headings** — A stat block built from `heading` + `paragraph` looks structurally generic and cannot be styled, queried, or audited as a stat. Use `stat` kinds inside a `grid`. If the source has a value+label pattern, it's a stat — name it as one.
4. **Flattening `testimonial` blocks into generic cards** — `card(heading, paragraph, paragraph)` is not a testimonial. Use the `testimonial` kind so the quote, author, role, company, optional photo, and optional rating render with the correct semantics and MD output (`> quote\n> — author, role @ company`).
5. **Building `accordion` patterns out of stacked cards** — FAQs need toggle state, baked into native `<details>`/`<summary>`. A stack of cards loses the affordance and produces wrong MD.
6. **Bare `media` in heroes without `height: cover`** — A `media` element placed as a sibling of copy collapses to ~120px and kills hero visual weight. Wrap it in a `card` inside a 2-column `grid` and set `height: cover` so the card stretches and the media fills it.
7. **The "Pretty Trap"** — Premature aesthetics shift feedback to visual taste. If a reviewer critiques shades of gray, the wireframe is too polished.
8. **Lorem Ipsum Trap** — Dummy text hides content-structure mismatches. Real draft copy forces thinking about what the section says.
9. **Unreadable grayscale** — Gray-on-gray kills legibility. Dark text (#111) on white; secondary (#444) for supporting text; reserve muted (#888) for labels and annotations.
10. **Unlabeled placeholders** — Every `media` needs a centered descriptive label: `[Hero image — pipeline view]`, not a bare rectangle.
11. **Over-precision in spacing** — "Pixel-fixing" triggers mid-fidelity expectations. Spacing decisions belong to visual design.
12. **Over-engineering CSS** — Complex CSS defeats "cheap and disposable." If the CSS is precious, fidelity is too high.
13. **Bordered sections trap** — Borders on every section make the page feel "boxy." Rely on whitespace and typography hierarchy for section separation.
14. **Extension overuse** — Reaching for an extension when a closed-core kind fits. If the pattern looks like a `stat`, `testimonial`, `trust-bar`, `banner`, or `accordion`, use the promoted kind.
15. **`customStyles` outside `.wf-ext-*` scope** — The namespace guard scrubs rules whose outermost selector does not target `.wf-ext-*`. Attempting to override `.wf-card`, `.wf-grid`, `.wf-button`, etc. is silently dropped — and would defeat the cross-project rendering contract anyway.

---

## CSS Base + Wireframe Extensions

Wireframe CSS lives in the interactive deliverable template at `references/wireframing/wireframing-template.html`. The template holds all CSS needed to render the data block into the interactive shell.

**v4.0+ build model:** the agent does NOT generate standalone per-page HTML files. Instead, it writes a structured data block (JSON) into `projects/{client}/{slug}_wireframes.html` per the schema in `references/wireframing/wireframing-schema.md`. The IIFE in `wireframing-template.html` reads the data block at runtime and renders each wireframe page, including all CSS.

### Two-level CSS scoping

The template uses a deliberate two-tier scoping convention:

- **Core `.wf-*` classes** — Defined inside the template, govern the closed core kinds. Never overridden per-project. Examples: `.wf-section`, `.wf-card`, `.wf-grid`, `.wf-grid-2`/`-3`/`-4`, `.wf-button`, `.wf-button--primary`/`--secondary`, `.wf-link`, `.wf-link--arrow`, `.wf-media`, `.wf-media--sm`/`--md`/`--lg`/`--cover`, `.wf-field`, `.wf-list`, `.wf-label`, `.wf-micro`, `.wf-stat`, `.wf-testimonial`, `.wf-trust-bar`, `.wf-banner`, `.wf-accordion`, `.wf-note`, `.wf-nav`, `.wf-footer`.
- **Extension `.wf-ext-*` classes** — Authored per-project via top-level `customStyles`, govern extension kinds only. Namespace-guarded — the guard scrubs any rule whose outermost selector does not match `.wf-ext-*`.

This separation is what lets extensions be inventive without destabilizing the core rendering contract.

Read: `@references/wireframing/wireframing-template.html`

---

## HTML Structure Pattern

**v4.0+ model:** sections are defined as `sections[]` entries in the data block (see `references/wireframing/wireframing-schema.md`), not authored as raw HTML. The IIFE renders each section into a full-width `.wf-section` with a `.wf-inner` wrapper, section content from `elements[]`, and a meta strip at the bottom.

The conceptual section shape — for understanding what the renderer produces — is:

1. A full-width `.wf-section` with a `.wf-inner` wrapper.
2. Content area: `elements[]` rendered in order — eyebrow `label`, `heading`, `paragraph`s, `button`s and `link`s, `media` placeholders, `field`s, promoted kinds (`stat`/`testimonial`/`trust-bar`/`banner`/`accordion`), and any extension elements.
3. Meta strip at the bottom: section type, narrative arc, user question, section goal — label prefixes localized to the project language at render time.

Nav and footer use their own dedicated classes (`.wf-nav`, `.wf-footer`) with `.wf-inner` inside — they do not receive a meta strip.

---

## Static Interactive Patterns

Represent interactive elements without JavaScript. The wireframe shows the default state; promoted kinds with built-in state (e.g. `accordion`) bake the state into the markup.

| Element | Low-Fi Representation |
|---------|----------------------|
| Navigation | Text links in `<nav>` with `.wf-inner`, mobile: "[Menu]" placeholder |
| Hero | `grid(2, [card(label + heading + paragraph + button + arrow link), card(media height: cover)])` |
| Feature grid | `grid(3, [card(media sm + heading + paragraph + arrow link)])` — never buttons inside feature cards |
| Stats | `grid(N, [stat × N])` — never oversized headings |
| Testimonials | `grid(3, [testimonial × 3])` with quote + author + role + company; rating optional |
| Trust strip | `trust-bar` kind, single-row logo strip; preceded by an uppercase `label` for context |
| Banner | `banner` kind, single-line top-of-page strip; `dismissible: true` for non-critical |
| Pricing | `grid(3, [card default, card highlight, card default])` with heading + list + button per card |
| Tabs | Tab strip with one active (bold/underline), one visible panel, others as collapsed headings |
| Accordion / FAQ | `accordion` kind with `defaultOpen` set to the first item label; native `<details>`/`<summary>` |
| Carousel | First item shown + "[<] [>]" text buttons + dot indicators |
| Modal | Inline `<aside>` block with annotation: "[Opens as Modal]" |
| Forms | Stacked `field` elements + `micro` reassurance + `button` (variant: primary) |
| CTA section | `heading` + `paragraph` + `button primary` + `button secondary` + `micro` |
| Process / timeline | `grid(N, [process-step × N])` extension; `customStyles` for connector / badge styling |
| Footer | Grouped column links in `.wf-footer__grid` + contact + legal |

---

## Copy Approach

Low-fi wireframes always use real draft copy at intent level:

- **Headings:** Real headline communicating the section's promise (not "Heading 1")
- **Body text:** Real sentences explaining what the section delivers (not lorem ipsum)
- **Button labels:** Real action labels reflecting what happens next ("Start free trial", not "Click here")
- **Link labels:** Real destinations ("How call logging works", not "Learn more" alone — pair with the trailing → glyph rendered by `variant: arrow`)
- **Field placeholders:** Real labels ("Your work email", not "Input")
- **Section labels:** Uppercase `label` kind above `heading` (e.g., "PRICING", "PROCESS")
- **Stat values + labels:** Real metric + concrete label ("30% — Faster deal cycles", not "Big Number — Some KPI")
- **Testimonial quotes:** Real-sounding quotes with named, attributed authors and concrete roles
- **Banner text:** One real announcement line, not "Announcement goes here"
- **Micro-copy:** Italic `micro` for risk reducers, reassurance, and supporting notes

Copy doesn't need to be final — it needs to be real enough to evaluate whether the content strategy works. The question is "Does this section say the right thing?" not "Is this the perfect wording?"

---

## Annotation Approach

**Canonical section→element→MD mapping:** `references/wireframing/wireframing-schema.md` — §Element kinds table. Do not duplicate the mapping here. This section covers annotation patterns (meta strip, visible notes) only.

### Visible notes only

Use `<div class="wf-note">` for annotations visible during browser review.

### Annotation format

Section annotations use a **single meta strip** — one full-width gray strip at the bottom of each section with four segments flowing inline: section name, narrative arc, user question, section goal. Element: `<div class="wf-note wf-note--meta wf-note--meta-boxed">`. Inside it, one `<div class="wf-note__row">` flex row holds four `<span class="wf-note__seg">` children, each wrapping a `<strong>{Label}:</strong>` plus its value.

**Element rule.** The meta strip uses `<div>`. The `<aside>` element is reserved for interaction notes inside content elements (e.g. `<aside class="wf-note">[Opens as Modal]</aside>`) — using it for the meta strip would conflate two different annotation roles in the same element.

**Localization.** Label prefixes and narrative arc values are rendered in the project language. Polish label prefixes are `Sekcja:`, `Narracja:`, `Pytanie:`, `Cel:`. The `<strong>` wrapper on labels is part of the markup, not the styling.

**Markup.** In v4.0+, section markup is rendered by the IIFE in `references/wireframing/wireframing-template.html` from the structured `elements[]` data block — not cloned from a template snippet. The agent writes structured JSON; the IIFE emits the markup with the four meta segments in place.

**Narrative arc values** — one of:
- **opening** (Polish: `otwarcie`) — hooks attention, anchors the topic
- **tension** (Polish: `napięcie`) — builds identification with the problem
- **evidence** (Polish: `dowód`) — provides proof, data, analysis
- **resolution** (Polish: `rozwiązanie`) — delivers the answer, offer, or trust signal

The header (`<header class="wf-nav">`) and footer (`<footer class="wf-footer">`) do NOT receive annotations — they are page chrome, not content sections.

### Section Map Schema

The section map is the single source of truth for what every section in a wireframe contains and why. Reverse Wireframing builds it in memory from layout data; forward Wireframing builds it as part of strategy. All fields are required for every section entry.

**Implementation note (v4.0+):** the field-level contract below is the conceptual schema. The implementable JSON shape consumed by the interactive wireframing deliverable lives in `references/wireframing/wireframing-schema.md` — it maps these fields to the `sections[]` entry structure and adds the `elements[]` array + deliberations layer on top.

| Field | Description |
|---|---|
| **Section type** | Identified type from the layout — one of: `nav`, `hero`, `features`, `pricing`, `testimonials`, `gallery`, `form`, `cta`, `footer`, `sidebar`, `breadcrumb`, `timeline`, `stats`, `video`, `accordion`, `comparison-table`, `trust-strip`, `announcement`, or any other type that fits the structure. (Note: `cta` here names a section type — distinct from the deprecated `cta` element kind.) |
| **Purpose** | What this section does for the page in plain language — one short clause. |
| **User's question** | What the visitor is thinking when they reach this section. Phrased as a first-person internal question. |
| **Layout** | Spatial grid description — full-width 1-col, 2-col 50/50 with image left and copy right, 3-col equal cards, grid 4×2 of product cards, full-width with overlay text, etc. |
| **Elements** | Concrete element list using the closed-core kinds and any extensions — e.g. `label, heading, paragraph, button (primary), link (arrow), media (height: cover)`. |
| **Copy** | Substrate-bound text content per `references/wireframing/substrate-fidelity.md` — see taxonomy (must-survive / compressible / excludable) and the three discipline rules (anti-invention, anti-pattern-skip, compression discipline). Text only — no URLs, no markdown link or image syntax. Images become their description (e.g. `[logo]`). |
| **Narrative** | Role in the page's narrative arc — one of `opening`, `tension`, `evidence`, `resolution`. **Inference rules from page position:** the first content section after nav is almost always `opening`; sections that introduce a problem or contrast are `tension`; data, proof, testimonials, and case studies are `evidence`; pricing, primary CTAs, and final trust strips are `resolution`. The agent infers the value from position and content, not from explicit signaling in the source. |

The schema is the contract between the section-mapping pass and the wireframe-rendering pass. Every section entry must populate every field — empty fields fail the section map.

### No data-* attributes

The MD content wireframe carries all structured annotations for downstream agents. HTML wireframes use visible notes only — reviewers should see everything without inspecting source.

### What to annotate

- Every `<section>` gets exactly one `wf-note` as its first child inside `.wf-inner`
- Interaction notes ("[Opens as Modal]", "[Scrolls to pricing]") go in separate `wf-note` elements within the relevant element
- Content dependencies ("Needs: 3 case studies") go in separate `wf-note` elements
