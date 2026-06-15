# CMS Integracja — Plan

**Branch:** `feature/cms-integracja`
**Ostatnia aktualizacja:** 2026-06-15

## Cel

Podłączenie Payload CMS do strony marketingowej MCRAFT tak, by klient mógł edytować treści i grafiki
z panelu admina bez angażowania dewelopera.

## Zakres (wg decyzji klienta)

| # | Sekcja | Co edytowalne |
|---|--------|---------------|
| 2 | HERO | Zdjęcie tła, zdjęcie Michała, podtytuł, opis |
| 3 | Modal CV | Treść popup "Dowiedz się więcej" |
| 4 | KIM JESTEM | Zdjęcie portretowe, tekst bio |
| 5 | Modal Bio | Treść popup "Więcej o mnie" |
| 6 | Kafelki statystyk | Dodawanie/usuwanie/edycja kafelków (auto-karuzela) |
| 7 | Obszary + podstrony | Zdjęcia kafelków, tytuły; pełna treść podstron |

**Poza zakresem:** Logo, nav, prawa kolumna hero (Teoria/Doświadczenie/Praktyka), warsztat (#4 statyczny), footer/kontakt.

## Architektura Payload

### Globals (singleton — jeden dokument na typ)

**`hero-section`**
- `backgroundImage` — Media (upload)
- `personPhoto` — Media (upload)
- `subtitle` — text (np. "Inżynier spawalnik / IWE / IWI / VT2 / PT2")
- `description` — textarea

**`about-section`**
- `portraitPhoto` — Media (upload)
- `bioText` — richText (Lexical)

**`cv-modal`**
- `experience` — array: `{ year: text, description: text }`
- `qualifications` — array: `{ code: text, description: text }`
- `competencies` — textarea
- `cvFile` — Media (PDF upload)

**`bio-modal`**
- `sections` — array: `{ title: text, content: richText }`
- `bioFile` — Media (PDF upload)

### Kolekcja

**`StatTile`** (collection, wiele rekordów)
- `number` — text (np. "18+", "IWE")
- `label` — text (np. "Lat doświadczenia")
- `description` — textarea
- `order` — number (do sortowania)

### Rozszerzenie istniejącego Media

Payload Media już istnieje (`src/collections/Media.ts`). Dodać pole `alt` jeśli go nie ma.

### ServicePage (nowe kolekcje lub istniejące rozszerzenie)

Opcja A — oddzielna kolekcja `ServicePage`:
- `slug` — text (unikalne: nadzor-spawalniczy / konstrukcje-stalowe / meble-premium)
- `eyebrow`, `title`, `description` — text
- `scopeItems` — array: `{ text }`
- `mainImage` — Media
- `galleryImages` — array: `{ image: Media }`
- `thumbnailImage` — Media (kafelek na stronie głównej)
- `thumbnailTitle` — text

Opcja B — seed data w kodzie, tylko Media z CMS (prostsze na start).

**Decyzja:** Opcja A — pełna elastyczność, możliwość klonowania podstron przez admina.

## Zmiana architektury komponentów

`HomeContent.tsx` jest `'use client'` — nie może bezpośrednio wołać Payload Local API.

**Rozwiązanie:**
```
src/app/(frontend)/page.tsx          ← server component
  ├── fetchuje globals przez Payload Local API
  ├── fetchuje StatTile collection (posortowane)
  └── przekazuje dane jako props do <HomeContent data={...} />

HomeContent.tsx                      ← 'use client', otrzymuje props, usuwa hardcoded data
```

Analogicznie dla podstron:
```
src/app/(frontend)/nadzor-spawalniczy/page.tsx
  ├── fetchuje ServicePage gdzie slug === 'nadzor-spawalniczy'
  └── przekazuje do <SubpageLayout {...data} />
```

## Fazy implementacji

### Faza 1 — Schema Payload (2-3 h)
Tworzenie globals i kolekcji; rejestracja w `payload.config.ts`; `pnpm generate:types`.

### Faza 2 — Fetch + Homepage (3-4 h)
- `page.tsx` staje się server component fetchującym dane
- `HomeContent.tsx` refaktor: hardcoded `TILES` i modals → props
- Seed danych testowych przez panel admina

### Faza 3 — Podstrony usługowe (2-3 h)
- Kolekcja `ServicePage` z seed danymi (3 rekordy)
- Każda podstrona fetchuje swój rekord
- `SubpageLayout` rozszerzony o real images (zastąpienie `ImageSlot`)

### Faza 4 — Obszary na stronie głównej (1 h)
- Kafelki obszarów w sekcji OBSZARY DZIAŁALNOŚCI ciągną `thumbnailImage` i `thumbnailTitle`
  z kolekcji `ServicePage`

### Faza 5 — Testy i cleanup (1-2 h)
- Testy integracyjne (Vitest) dla API globals i kolekcji
- E2E: panel admina — edycja treści, zapis, weryfikacja na froncie
- Usunięcie `ImageSlot` placeholderów tam, gdzie są real media

## Ryzyka

| Ryzyko | Mitygacja |
|--------|-----------|
| `HomeContent` jako `'use client'` — brak dostępu do Local API | Fetch w server component `page.tsx`, props do client |
| Karuzela hardcoded w TILES | Refaktor: dane z props, `useEffect` dla animacji bez zmian |
| Dodawanie nowego obszaru = nowa podstrona | Kolekcja `ServicePage` ze slugiem pozwala generować nowe strony; wymaga dodania route lub dynamic route |
| Sharp nie skonfigurowany dla resize | Już jest w Payload config — sprawdzić opcje `imageSizes` |

## Mierniki sukcesu

- Klient może zmienić bio, zdjęcie portretowe i treść CV modala bez kodu
- Dodanie nowego kafelka statystyki w adminie automatycznie pojawia się w karuzeli
- Zmiana zdjęcia na podstronie widoczna po odświeżeniu (lub revalidation)
- Wszystkie testy przechodzą po implementacji

## Źródła

- Requirements doc: brak (wymagania zebrane bezpośrednio od klienta)
- Plan techniczny: brak
- Wireframe klienta: `mcraft/uploads/723240149_1293778082824789_3317896823746002372_n.png`
