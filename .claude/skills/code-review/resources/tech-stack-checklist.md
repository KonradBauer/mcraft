# Tech Stack Checklist

> **[WARSTWA PROJEKTOWA]** Ten plik jest wygenerowany dla konkretnego projektu (mcraft). Przy przenoszeniu warsztatu do innego repo: zregeneruj checklisty wg CLAUDE.md i package.json docelowego projektu, zachowując strukturę sekcji (framework / CMS-backend / React / async / styling / TS / testy / security / performance / deployment / a11y). Sekcje React 19, Async, TypeScript i a11y są w większości uniwersalne.

Checklisty do code review dla stacku tego projektu: **Next.js 16 (App Router) + React 19 + Payload CMS 3 + MongoDB + Tailwind v4 + TypeScript**. Testy: Vitest (integracyjne) + Playwright (E2E). Deployment: Docker + Coolify na VPS.

Ładuj tylko sekcje odpowiadające zmienionym plikom.

---

## Next.js 16 (App Router)

### Route groups i struktura
- [ ] `(payload)` route group NIETKNIĘTE — zarządzane przez withPayload(), zero custom kodu tam
- [ ] Strony frontendowe mają `export const dynamic = 'force-dynamic'` — NIE zmieniaj na `revalidate`/SSG (build w Dockerze nie ma dostępu do MongoDB)
- [ ] Server components domyślnie; `'use client'` tylko dla interaktywnych wysp
- [ ] Dane z CMS fetchowane w server components przez Payload Local API (`getPayload` + `payload.find`/`findGlobal`), nie przez fetch do własnego API

### Granica server/client
- [ ] Props przekazywane z server do client components są serializowalne (bez funkcji, bez instancji klas)
- [ ] Server-rendered children przekazywane jako fragmenty do client providerów (wzorzec ModalProvider) — treść w initial HTML
- [ ] Brak hooków w server components
- [ ] Brak importu server-only kodu (payload config) w client components

### Metadata i SEO
- [ ] `metadata` export na nowych stronach (title, description, canonical, openGraph)
- [ ] OG image wskazuje istniejący statyczny asset, nie dynamiczny route z hashem
- [ ] Nowa publiczna strona dodana do `src/app/sitemap.ts`

### Obrazy
- [ ] `next/image` zamiast `<img>` (wyjątki uzasadnione komentarzem)
- [ ] Obrazy `fill` mają prop `sizes` adekwatny do layoutu
- [ ] Nowe ścieżki obrazów dodane do `images.localPatterns` w `next.config.ts`
- [ ] Wzorzec projektu: `ImageWithSkeleton` dla obrazów z CMS, `ImageSlot` jako placeholder

---

## Payload CMS 3

### Access control
- [ ] Każda kolekcja/global ma przemyślane `access` — `read: () => true` TYLKO dla treści jawnie publicznych
- [ ] Operacje create/update/delete ograniczone tam, gdzie kolekcja ma stały zestaw rekordów (wzorzec ServicePage: `create: () => false`)
- [ ] `overrideAccess: false` przy operacjach Local API w imieniu użytkownika

### Hooks
- [ ] Zagnieżdżone operacje Local API w hookach dostają `req` (atomowość transakcji)
- [ ] Flagi `req.context` zapobiegają nieskończonym pętlom hooków
- [ ] Hooki nie robią fetchów w pętli po dokumentach (N+1)

### Schema i typy
- [ ] Po KAŻDEJ zmianie schematu: `pnpm generate:types` — i wygenerowany plik w commicie
- [ ] `src/payload-types.ts` NIGDY nie edytowany ręcznie
- [ ] Nowa kolekcja zarejestrowana w `payload.config.ts`
- [ ] Pola relacji/upload obsługują oba kształty: `string | Dokument` (helper `mediaUrl`)

### Upload
- [ ] `staticDir` poza `public/` dla kolekcji upload (public/ jest nadpisywane przy budowie obrazu Docker)
- [ ] Nowy `staticDir` = odpowiadający volume w `docker-compose.yml` + mkdir/chown w Dockerfile i entrypoint
- [ ] `mimeTypes` ograniczone do potrzebnych typów

### Zapytania
- [ ] `depth` świadomie dobrany (nie domyślny głęboki populate "na wszelki wypadek")
- [ ] `limit` na zapytaniach po kolekcjach mogących rosnąć
- [ ] Batch query (`where: { field: { in: [...] } }`) zamiast find w pętli

---

## React 19

### Nowe API
- [ ] `use()` zamiast `useEffect` + `useState` dla async data w client components
- [ ] `useOptimistic()` dla optimistic updates
- [ ] `useActionState()` / `useFormStatus()` dla form actions

### Usunięte/zmienione wzorce
- [ ] Brak `forwardRef` — ref to zwykły prop w React 19
- [ ] `<Context>` zamiast `<Context.Provider>`
- [ ] `use(Context)` zamiast `useContext` gdy potrzebne warunkowe użycie

### Rendering
- [ ] Suspense boundaries dla async client components
- [ ] Stan na odpowiednim poziomie (lifting vs colocation)
- [ ] Keys w listach stabilne i unikalne (nie index przy reorderowalnych listach)
- [ ] Brak hydration mismatch (Date.now(), Math.random(), window-checks w renderze)

---

## Async / Race Conditions

### useEffect cleanup
- [ ] useEffect z async ma AbortController w cleanup
- [ ] setTimeout/setInterval ma clearTimeout/clearInterval w return
- [ ] requestAnimationFrame loop sprawdza cancel flag
- [ ] IntersectionObserver / MutationObserver disconnected w cleanup
- [ ] Event listenery na window/document usuwane w cleanup

### State management
- [ ] Więcej niż 1 boolean ładowania = discriminated union / state machine
- [ ] Operacje wzajemnie wykluczające się mają guard
- [ ] Promise.allSettled dla równoległych operacji mogących niezależnie failować

### Async patterns
- [ ] Promise.finally() do cleanup zamiast duplikacji w resolve/reject
- [ ] Brak floating promises w event handlerach (`.catch()` lub `void` ze świadomością)

---

## Tailwind CSS 4

### Konfiguracja (v4)
- [ ] Konfiguracja przez blok `@theme` w `styles.css` (brak tailwind.config.js — to poprawne w v4)
- [ ] Import przez `@import "tailwindcss"`

### Konwencje TEGO projektu (nie flaguj jako błędy!)
- [ ] Kolory przez tokeny z @theme (`bg-ink`, `text-light`, `bg-accent`, `bg-cream`) — NIE hex inline gdy token istnieje
- [ ] Arbitrary values dla spacing/breakpointów (`px-[56px]`, `max-[980px]:hidden`) SĄ konwencją projektu — flaguj tylko hardcoded KOLORY omijające tokeny
- [ ] Breakpointy projektu: `max-[980px]`, `max-[768px]`, `max-[700px]`, `max-[560px]` — nowy kod używa tych samych
- [ ] Fonty przez zmienne: font-montserrat (nagłówki/UI), font-sans/Barlow (body)

### Klasy
- [ ] Brak `@apply` w kodzie aplikacyjnym — kompozycja w React
- [ ] Brak przestarzałych klas v3 (`bg-opacity-*` → `bg-black/50`)
- [ ] Hover/focus/active states zdefiniowane dla interaktywnych elementów
- [ ] Em dashe ZABRONIONE w treściach widocznych dla użytkownika (JSX, metadata) — zwykły myślnik `-`

---

## TypeScript

### Typy
- [ ] Brak `any` (użyj `unknown` + type guard)
- [ ] Props komponentów typowane interfejsem
- [ ] Explicit return types dla eksportowanych funkcji
- [ ] Typy z `@/payload-types` dla danych CMS (nie ręczne duplikaty)

### Strict mode
- [ ] Brak `!` (non-null assertion) — jawna obsługa null
- [ ] Brak `as` poza DOM narrowing
- [ ] Optional chaining zamiast łańcuchów `&&`

### Imports
- [ ] `import type { X }` dla typów
- [ ] Path alias `@/` używany konsekwentnie
- [ ] Brak circular dependencies
- [ ] Grupowanie: stdlib → third-party → local

---

## Testy

### Reguły twarde
- [ ] Każdy test ma minimum 1 asercję
- [ ] Mockowane TYLKO zewnętrzne serwisy, nie testowany kod
- [ ] Asercje nie osłabione względem poprzedniej wersji (diff testów!)
- [ ] Testy integracyjne używają fixtures z `tests/helpers/`, nie pełnych datasetów

### Struktura
- [ ] Arrange-Act-Assert w describe/it
- [ ] Testowane ZACHOWANIE, nie implementacja (internal state)
- [ ] Nowa funkcja = min. 1 happy path + 1 error case
- [ ] E2E: seedowanie/cleanup przez `tests/helpers/seedUser.ts`

---

## Bezpieczeństwo

### Input
- [ ] Walidacja każdego inputu na granicy API (Payload fields validation lub Zod w route handlers)
- [ ] Brak dynamicznego wykonywania kodu z user input
- [ ] Upload: mimeTypes + rozsądny limit rozmiaru

### Dane
- [ ] Kolekcje Payload nie eksponują wrażliwych pól przez publiczne read
- [ ] Error messages nie zdradzają internals (ścieżki, wersje, stack trace do klienta)
- [ ] Brak logowania danych osobowych/sekretów

### Secrets
- [ ] Brak hardcoded secrets/kluczy
- [ ] Env przez `process.env`, `.env` w `.gitignore`
- [ ] PAYLOAD_SECRET / DATABASE_URL nigdy w kodzie ani logach

### Output
- [ ] Brak XSS — surowy HTML wstrzykiwany do DOM wyłącznie po sanityzacji (np. DOMPurify); preferuj zwykły JSX
- [ ] Security headers nietknięte w next.config.ts (chyba że zmiana świadoma)

---

## Wydajność

### Bundle
- [ ] Dynamic import / React.lazy dla komponentów > 50KB
- [ ] Nowa dependency uzasadniona (bundlephobia) i zgłoszona userowi
- [ ] Named imports (tree shaking)

### Zapytania
- [ ] O(n²)+ wymaga komentarza-uzasadnienia
- [ ] Pętla z zapytaniem do Payload/DB = N+1 → batch/in
- [ ] Pagination/limit zamiast pełnych kolekcji

### Obrazy i LCP
- [ ] `sizes` na fill images adekwatny (nie domyślne 100vw dla miniatur)
- [ ] Lazy loading poniżej fold; priorytet dla hero/LCP
- [ ] Rozmiary plików w `public/` sensowne (favicon ≤ ~100KB, nie 1MB)

---

## Docker / Deployment

- [ ] Katalogi zapisywalne runtime (upload staticDir) = named volume + chown na usera aplikacji (nextjs)
- [ ] Nic zapisywalnego w `public/` — nadpisywane przy budowie obrazu
- [ ] Nowe env vars dodane do docker-compose.yml i .env.example
- [ ] Zmiany w Dockerfile/entrypoint spójne (mkdir + chown w OBU miejscach gdy dotyczy)

---

## Dostępność (a11y)

### Interactive elements
- [ ] Touch targets min 44x44px
- [ ] Focus visible (outline)
- [ ] Keyboard navigation działa (modale: Escape zamyka, focus trap)

### Semantics
- [ ] Headings w hierarchii (h1 → h2 → h3)
- [ ] Landmarks (`main`, `nav`, `footer`)
- [ ] `aria-label` dla icon buttons; `aria-hidden` dla dekoracyjnych SVG
- [ ] Alt na obrazach treściowych (z pola `alt` w Media)

### Visual
- [ ] Kontrast WCAG 2.2 AA (4.5:1 tekst, 3:1 UI)
- [ ] Nie tylko kolor przekazuje informację
- [ ] Animacje respektują `prefers-reduced-motion`
