# CMS Integracja — Kontekst techniczny

**Branch:** `feature/cms-integracja`
**Ostatnia aktualizacja:** 2026-06-15

## Kluczowe pliki

| Plik | Rola | Zmiany w tym zadaniu |
|------|------|----------------------|
| `src/payload.config.ts` | Rejestracja kolekcji i globals | Dodać globals + `StatTile` + `ServicePage` |
| `src/payload-types.ts` | Auto-generated typy | Regenerować po każdej zmianie schema |
| `src/app/(frontend)/page.tsx` | Strona główna | Refaktor na server component z fetchem |
| `src/components/mcraft/HomeContent.tsx` | Client component homepage | Zamiana hardcoded data na props |
| `src/components/mcraft/SubpageLayout.tsx` | Szablon podstron | Dodać real images, usunąć `ImageSlot` |
| `src/app/(frontend)/nadzor-spawalniczy/page.tsx` | Podstrona | Fetch z `ServicePage` collection |
| `src/app/(frontend)/konstrukcje-stalowe/page.tsx` | Podstrona | Fetch z `ServicePage` collection |
| `src/app/(frontend)/meble-premium/page.tsx` | Podstrona | Fetch z `ServicePage` collection |

## Pliki do stworzenia

```
src/globals/HeroSection.ts
src/globals/AboutSection.ts
src/globals/CvModal.ts
src/globals/BioModal.ts
src/collections/StatTile.ts
src/collections/ServicePage.ts
```

## Decyzje techniczne

### 1. Globals vs Collections dla treści singleton
- Globals = singleton bez ID (hero, about, modals) — edytowane jako "jeden dokument" w adminie
- Collection `StatTile` zamiast global z array = wygodniejsze dodawanie/usuwanie rekordów;
  sortowanie przez pole `order`

### 2. Dynamic routes dla podstron — NIE
Klient powiedział: nowe obszary działalności to rzadkie zdarzenie, za każdym razem kontaktują się z deweloperem.
Zostawiamy statyczne routes (`/nadzor-spawalniczy/`, etc.). `ServicePage` kolekcja jako źródło danych,
nie jako generator routingu.

### 3. `HomeContent.tsx` pozostaje `'use client'`
Komponent ma stan (modal open/close, animacja zoom). Dane fetchowane w serwerowym `page.tsx` i przekazywane
przez props. Nowe typy props:

```ts
interface HomeContentProps {
  hero: HeroSection
  about: AboutSection
  cvModal: CvModal
  bioModal: BioModal
  tiles: StatTile[]
  areas: Pick<ServicePage, 'slug' | 'thumbnailTitle' | 'thumbnailImage'>[]
}
```

### 4. Rewalidacja (ISR)
Next.js 15 z Payload — użyć `unstable_cache` lub `revalidateTag`. Na start: SSR bez cache,
można dodać ISR w osobnym zadaniu gdy klient zgłosi potrzebę wydajności.

### 5. ImageSlot placeholder
`ImageSlot` (`src/components/mcraft/ImageSlot.tsx`) to obecny placeholder. Po implementacji
zamieniamy na `next/image` z URL z Payload Media (`/api/media/file/[filename]`).

## Zależności

- MongoDB musi działać lokalnie do testów integracyjnych (`pnpm test:int`)
- `pnpm generate:types` po każdej zmianie schema (wymagane przed kompilacją)
- SSL proxy na sieci korporacyjnej: `$env:NODE_OPTIONS="--use-system-ca"; pnpm dev`

## Pytania otwarte

1. **Czy kafelki obszarów (OBSZARY DZIAŁALNOŚCI) na stronie głównej mają mieć real zdjęcia czy zachować SVG ikony?**
   Klient mówi "podmieniać zdjęcia kafelków" — zakładam: zastąpienie SVG ikon zdjęciami z CMS.
   Do potwierdzenia przed Fazą 4.

2. **PDF do pobrania (CV, życiorys)** — klient nie wspomniał. Nie implementujemy upload PDF na razie
   (pola `cvFile` / `bioFile` w schema, ale UI download button zostawiamy bez linku do momentu decyzji).

3. **Kolejność wyświetlania kafelków statystyk** — pole `order` (ręczny drag&drop w Payload UI
   jest dostępny przez `sortableRelationship` lub `@payloadcms/plugin-sort`).
   Na start: pole numeryczne `order`, klient wpisuje cyfry.

## Źródła

- Requirements doc: brak (wymagania zebrane bezpośrednio od klienta)
- Plan techniczny: brak
- Wireframe klienta: `mcraft/uploads/723240149_1293778082824789_3317896823746002372_n.png`
