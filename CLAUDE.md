# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

---

## Project

Marketing website for **MCRAFT / Dr inż. Michał Macherzyński** (welding engineer) built on **Next.js 16 + Payload CMS 3.x** with MongoDB.

Production URL: `https://mcraft.com.pl`

## Commands

```bash
pnpm dev               # dev server at http://localhost:3000
pnpm build             # production build
pnpm lint              # ESLint
pnpm generate:types    # regenerate src/payload-types.ts after schema changes
pnpm generate:importmap

pnpm test:int          # Vitest integration tests (requires MongoDB running)
pnpm test:e2e          # Playwright E2E (auto-starts dev server)
pnpm test              # both suites
```

**Single integration test:**
```bash
pnpm exec vitest run tests/int/api.int.spec.ts
```

**Single E2E test:**
```bash
pnpm exec playwright test tests/e2e/admin.e2e.spec.ts
```

**SSL proxy issue (Windows corporate network):** All `pnpm` commands in PowerShell require:
```powershell
$env:NODE_OPTIONS="--use-system-ca"; pnpm <command>
```

## Architecture

### Route groups

```
src/app/
  (frontend)/     ← public marketing site (MCRAFT brand)
  (payload)/      ← Payload admin panel, auto-handled by withPayload()
  robots.ts       ← /robots.txt
  sitemap.ts      ← /sitemap.xml
```

`(payload)` is managed entirely by Payload — don't add custom code there.

### Frontend pages (`src/app/(frontend)/`)

All pages use `export const dynamic = 'force-dynamic'` — Docker build has no access to Payload/MongoDB, so static pre-rendering is disabled. Do NOT switch to `revalidate` without ensuring the build environment has CMS access.

- `layout.tsx` — metadata (OG, Twitter Card, JSON-LD schema via `<Script>`), Google Fonts, `styles.css`
- `page.tsx` → `<HomeContent />` server component
- `nadzor-spawalniczy/`, `konstrukcje-stalowe/`, `meble-premium/` — service subpages
- `polityka-prywatnosci/` — privacy policy (static, no CMS)
- `opengraph-image.tsx` — dynamic OG image via `next/og` (edge runtime)

### Components (`src/components/mcraft/`)

**Server components (SSR, crawlable):**
- `HomeContent.tsx` — server component; full homepage HTML: Hero → About → Areas → Footer. Wraps everything in `<ModalProvider>`. Contains no hooks.
- `SubpageLayout.tsx` — server component for all three service subpages.

**Client components (interactive islands):**
- `ModalProvider.tsx` — `'use client'`; modal context + state + zoom-from-origin animation + modal panel (CV, Bio, Tiles). Provides `useModal()` hook. Receives `cvModal`, `bioModal`, `tiles` as serializable props from server.
- `ModalTrigger.tsx` — `'use client'`; button/div that calls `openModal` from context.
- `TilesMarquee.tsx` — `'use client'`; interactive scrolling tiles container (opens Tiles modal on click).
- `MobileNav.tsx` — `'use client'`; hamburger + fullscreen overlay menu. iOS-safe scroll lock (position:fixed + top:-scrollY pattern).
- `ImageWithSkeleton.tsx` — `'use client'`; `fill` image with ink shimmer skeleton during load. Accepts `sizes` prop (default `"100vw"`).
- `ImageSlot.tsx` — server; dark placeholder div for missing CMS images.

**Shared utility:**
- `src/lib/mediaUrl.ts` — extracts `.url` from Payload `Media | Document | string | null` fields.

### Modal architecture

`HomeContent` (server) → `ModalProvider` (client, context) → `ModalTrigger` / `TilesMarquee` (client, consume context).

Server-rendered children are passed as React fragments into `ModalProvider`, so all page text is in the initial HTML (SSR-crawlable). The client bundle only includes the interactive islands.

### Payload (`src/`)

- `payload.config.ts` — collections: `Users`, `Media`, `Documents`, `StatTile`, `ServicePage`; globals: `HeroSection`, `AboutSection`, `CvModal`, `BioModal`
- `payload-types.ts` — **auto-generated**, never edit manually; regenerate with `pnpm generate:types`
- `collections/` — add new collections here and register in `payload.config.ts`

### Testing

- `tests/int/` — Vitest with jsdom, tests hit real MongoDB via Payload Local API; fixtures in `tests/helpers/`
- `tests/e2e/` — Playwright on Chromium; `tests/helpers/seedUser.ts` seeds/cleans test user (`dev@payloadcms.com` / `test`)
- Integration tests load `.env` via `vitest.setup.ts`; E2E reads `test.env`

### Path aliases

```
@/*             →  ./src/*
@payload-config →  ./src/payload.config.ts
```

## Design system

Styling uses **Tailwind v4** (`@import "tailwindcss"` in `styles.css`) with arbitrary-value utilities (`max-[980px]:hidden`, `[background:...]`). No `tailwind.config.js` — tokens are defined in `@theme {}` inside `styles.css`.

Key tokens:

| Variable | Value |
|----------|-------|
| `--ink` | `#0e1a17` (dark green-black) |
| `--cream` | `#f3ece0` (warm off-white) |
| `--accent` | `#4f9a8c` (teal) |
| `--light` | `#eceae4` (light warm) |

Fonts: Montserrat (headings + UI labels), Barlow (body), Great Vibes (decorative).

Breakpoints used: `max-[980px]` (tablet/mobile), `max-[700px]`, `max-[560px]` (small mobile), `max-[768px]` (footer grid).

The hero on `≤980px` shows a mobile layout: `min-h-[100svh]`, photo at full opacity, subtitle hidden, button pinned to `absolute bottom-[36px]`.

## Payload key patterns

- Always pass `req` to nested Local API operations in hooks (transaction atomicity)
- Use `overrideAccess: false` when operating on behalf of a user
- Use `req.context` flags to prevent infinite hook loops
- Run `pnpm generate:types` after any schema change

## SEO

- `src/app/robots.ts` — allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot) explicitly
- `src/app/sitemap.ts` — 4 pages with priorities
- `public/llms.txt` — structured facts for LLM crawlers
- JSON-LD schema (LocalBusiness + Person) injected via `<Script id="schema-org" type="application/ld+json">` in `layout.tsx`
- OG image auto-generated at `/opengraph-image` via `next/og`

## Konwencje treści

- **Em dashe zabronione** - używaj zwykłego myślnika `-` zamiast `—` we wszystkich tekstach widocznych dla użytkownika (JSX, metadata, stringi)
- **Zawsze polskie znaki** - wszystkie teksty pisz z pełnymi polskimi znakami diakrytycznymi (ą, ć, ę, ł, ń, ó, ś, ź, ż); nigdy nie zastępuj ich odpowiednikami ASCII
