# MCRAFT

Strona marketingowa dla **MCRAFT / Dr inż. Michał Macherzyński** (inżynier spawalnictwa), zbudowana na **Next.js 16 + Payload CMS 3.x** z MongoDB.

Produkcja: [https://mcraft.com.pl](https://mcraft.com.pl)

## Stack

- Next.js 16 (App Router)
- Payload CMS 3.x (admin panel, Local API, kolekcje/globals)
- MongoDB (mongoose adapter)
- Tailwind v4 (bez `tailwind.config.js` - tokeny w `@theme {}` w `styles.css`)
- Vitest (integration) + Playwright (E2E)
- pnpm

## Szybki start

```bash
cp .env.example .env      # uzupełnij DATABASE_URL, PAYLOAD_SECRET itd.
pnpm install
pnpm dev                  # http://localhost:3000
```

Panel admina Payload: `http://localhost:3000/admin`.

## Komendy

```bash
pnpm dev               # dev server
pnpm build              # build produkcyjny
pnpm lint               # ESLint
pnpm generate:types     # regeneruje src/payload-types.ts po zmianie schematu
pnpm generate:importmap

pnpm test:int           # testy integracyjne Vitest (wymaga uruchomionego MongoDB)
pnpm test:e2e           # testy E2E Playwright (sam odpala dev server)
pnpm test               # test:int + test:e2e
```

Pojedynczy test:

```bash
pnpm exec vitest run tests/int/api.int.spec.ts
pnpm exec playwright test tests/e2e/admin.e2e.spec.ts
```

### Windows (sieć korporacyjna, problem SSL)

Polecenia `pnpm` w PowerShell wymagają:

```powershell
$env:NODE_OPTIONS="--use-system-ca"; pnpm <command>
```

`git push` / `git fetch` / `gh` trafiają na ten sam proxy - napraw to przełączeniem backendu SSL gita:

```bash
git config http.sslBackend schannel
```

## Struktura

```
src/app/
  (frontend)/     # publiczna strona (marka MCRAFT + mikro-marka MK-GYM)
  (payload)/      # panel admina Payload, obsługiwany przez withPayload() - nie edytuj
  robots.ts
  sitemap.ts
```

Strony w `(frontend)` używają `export const dynamic = 'force-dynamic'` - build Dockera nie ma dostępu do Payload/MongoDB, więc statyczny prerendering jest wyłączony. Nie zmieniaj na `revalidate` bez zapewnienia dostępu do CMS w środowisku builda.

### Podstrony

- `nadzor-spawalniczy/`, `konstrukcje-stalowe/`, `meble-premium/` - podstrony usług
- `mk-gym/`, `mk-gym/realizacje/[slug]/` - mikro-marka MK-GYM z własnym brandingiem (favicon, tytuł, logo, hero banner na stronach realizacji); realizacje mk-gym to zagnieżdżona tablica w `ServicePage`, nie osobna kolekcja
- `[serviceSlug]/realizacje/` - dynamiczne strony realizacji per usługa; dla `meble-premium`/`konstrukcje-stalowe` z kolekcji `Portfolio`, dla `mk-gym` z tablicy `realizacje` w `ServicePage`
- `polityka-prywatnosci/` - polityka prywatności (statyczna, bez CMS)
- `opengraph-image.tsx` - dynamiczny obraz OG przez `next/og` (edge runtime)

### Komponenty (`src/components/mcraft/`)

- **Server (SSR):** `HomeContent.tsx`, `SubpageLayout.tsx` - pełne HTML strony, crawlable
- **Client (interaktywne wyspy):** `ModalProvider.tsx` (kontekst modali), `ModalTrigger.tsx`, `TilesMarquee.tsx`, `MobileNav.tsx`, `ImageWithSkeleton.tsx`
- **Shared:** `src/lib/mediaUrl.ts` - wyciąga `.url` z pól media Payload

### Payload (`src/`)

- `payload.config.ts` - kolekcje: `Users`, `Media`, `Documents`, `StatTile`, `ServicePage`, `Portfolio`; globals: `HeroSection`, `AboutSection`, `CvModal`, `BioModal`
- `payload-types.ts` - **auto-generowany**, nigdy nie edytuj ręcznie; regeneruj przez `pnpm generate:types`
- `collections/` - nowe kolekcje dodawaj tu i rejestruj w `payload.config.ts`
- Lokalizacja: `pl` (domyślny) + `en`, z fallbackiem

### Testy

- `tests/int/` - Vitest + jsdom, testy uderzają w prawdziwy MongoDB przez Payload Local API; fixtures w `tests/helpers/`
- `tests/e2e/` - Playwright na Chromium; `tests/helpers/seedUser.ts` seeduje/czyści testowego użytkownika
- Testy integracyjne ładują `.env` przez `vitest.setup.ts`; E2E czyta `test.env`

### Aliasy ścieżek

```
@/*             →  ./src/*
@payload-config →  ./src/payload.config.ts
```

## Konwencje treści

- **Zakaz myślnika em-dash** - używaj zwykłego `-`, nie `—`, we wszystkich tekstach widocznych dla użytkownika
- **Zawsze pełne polskie znaki diakrytyczne** (ą, ć, ę, ł, ń, ó, ś, ź, ż) - nigdy odpowiedniki ASCII

## Więcej

Szczegółowe wytyczne dla pracy nad kodem (architektura, Payload patterns, SEO) - zobacz `CLAUDE.md`.
