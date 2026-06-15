# CMS Integracja — Checklist zadań

**Branch:** `feature/cms-integracja`
**Ostatnia aktualizacja:** 2026-06-15

---

## Faza 1 — Schema Payload ✅

- [x] Stworzyć `src/globals/HeroSection.ts` (backgroundImage, personPhoto, subtitle, description)
- [x] Stworzyć `src/globals/AboutSection.ts` (portraitPhoto, bioText)
- [x] Stworzyć `src/globals/CvModal.ts` (experience[], qualifications[], competencies, cvFile)
- [x] Stworzyć `src/globals/BioModal.ts` (sections[], bioFile)
- [x] Stworzyć `src/collections/StatTile.ts` (number, label, description, order)
- [x] Stworzyć `src/collections/ServicePage.ts` (slug, eyebrow, title, description, scopeItems[], mainImage, galleryImages[], thumbnailImage, thumbnailTitle)
- [x] Zarejestrować globals i kolekcje w `src/payload.config.ts`
- [x] Uruchomić `pnpm generate:types`
- [ ] Sprawdzić panel admina: czy globals i kolekcje widoczne (weryfikacja manualna)

---

## Faza 2 — Fetch + Homepage ✅

- [x] Przekształcić `src/app/(frontend)/page.tsx` w async server component
- [x] Dodać fetch globals (hero, about, cvModal, bioModal) przez Payload Local API
- [x] Dodać fetch `StatTile` (posortowane wg `order`)
- [x] Dodać fetch `ServicePage` (slug + thumbnailTitle)
- [x] Zdefiniować typ `HomeContentProps` i przekazać dane do `<HomeContent />`
- [x] Refaktor `HomeContent.tsx`: usunąć hardcoded `TILES`, zastąpić props
- [x] Refaktor `ModalCV`: treść z props zamiast hardcoded JSX (fallback gdy brak danych)
- [x] Refaktor `ModalBio`: treść z props zamiast hardcoded JSX (fallback gdy brak danych)
- [x] Refaktor `ModalTiles`: kafelki z props zamiast hardcoded `TILES`
- [x] Karuzela (marquee): dane z props, animacja bez zmian
- [ ] Zaseed testowych danych w panelu admina (ręczne — wymaga działającego serwera)
- [ ] Weryfikacja: edycja tytułu w panelu → widoczna na stronie (ręczna)

> **Uwaga SSG:** `/` buduje się statycznie (SSG). Zmiany w CMS będą widoczne po przebudowie.
> Dodanie `dynamic = 'force-dynamic'` lub ISR revalidation — opcjonalnie w Fazie 5.

---

## Faza 3 — Podstrony usługowe ✅

- [ ] Zaseed 3 rekordów `ServicePage` w panelu admina (ręczne — wymaga działającego serwera)
- [x] Refaktor `src/app/(frontend)/nadzor-spawalniczy/page.tsx` — fetch ServicePage
- [x] Refaktor `src/app/(frontend)/konstrukcje-stalowe/page.tsx` — fetch ServicePage
- [x] Refaktor `src/app/(frontend)/meble-premium/page.tsx` — fetch ServicePage
- [x] Rozszerzyć `SubpageLayout` props o real images (mainImageUrl, galleryImages[])
- [x] Obsługa braku obrazka (fallback na `ImageSlot` placeholder)
- [x] Helper `src/lib/servicePageData.ts` — toSubpageLayoutProps() z fallback na hardcoded
- [ ] Weryfikacja: galeria na podstronie wyświetla obrazki (ręczna — po seedzie)

---

## Faza 4 — Obszary na stronie głównej ✅

- [x] Decyzja klienta: SVG jako fallback, thumbnailImage opcjonalne
- [x] Sekcja OBSZARY: kafelki pobierają `thumbnailTitle` i `thumbnailImage` z CMS
- [x] Kafelek z thumbnailImage: next/image (120px strip u góry kafelka)
- [x] Kafelek bez thumbnailImage: SVG ikona (fallback hardcoded per slug)

---

## Faza 5 — Testy i cleanup ✅

- [x] Test integracyjny: GET global `hero-section` przez Payload Local API
- [x] Test integracyjny: GET kolekcji `StatTile` — weryfikacja sortowania
- [x] Test integracyjny: GET `ServicePage` po slug
- [x] E2E: admin panel → edycja `about-section` → weryfikacja bio na stronie głównej
- [x] Usunąć `ModalNote` "Treść przykładowa" z ModalCV i ModalBio — N/A (nie istniało w TSX)
- [x] Usunąć `ImageSlot` import — N/A (nadal używany jako fallback gdy brak zdjęcia w CMS)
- [x] Uruchomić `pnpm lint` i `pnpm build` — zero błędów (naprawiono brakujący `@eslint/eslintrc`, migracja do flat config)
- [x] `pnpm test:int` — 10/10 zielonych
