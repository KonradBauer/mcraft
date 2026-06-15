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

## Faza 3 — Podstrony usługowe

- [ ] Zaseed 3 rekordów `ServicePage` (nadzor-spawalniczy, konstrukcje-stalowe, meble-premium) z obecnymi treściami
- [ ] Refaktor `src/app/(frontend)/nadzor-spawalniczy/page.tsx` — fetch ServicePage
- [ ] Refaktor `src/app/(frontend)/konstrukcje-stalowe/page.tsx` — fetch ServicePage
- [ ] Refaktor `src/app/(frontend)/meble-premium/page.tsx` — fetch ServicePage
- [ ] Rozszerzyć `SubpageLayout` props o real images (zastąpić `ImageSlot` przez `next/image`)
- [ ] Obsługa braku obrazka (fallback na `ImageSlot` placeholder)
- [ ] Weryfikacja: galeria na podstronie wyświetla obrazki wgrane przez admin panel

---

## Faza 4 — Obszary na stronie głównej

- [ ] **Pytanie do klienta:** czy kafelki OBSZARÓW mają zdjęcia czy SVG ikony? ← potwierdzić przed implementacją
- [ ] Sekcja OBSZARY w `HomeContent.tsx`: kafelki pobierają `thumbnailTitle` i `thumbnailImage` z props
- [ ] Jeśli zdjęcia: zastąpić SVG ikonę przez `next/image` z `thumbnailImage`
- [ ] Jeśli ikony pozostają: `thumbnailTitle` edytowalny z CMS, ikony hardcoded SVG

---

## Faza 5 — Testy i cleanup

- [ ] Test integracyjny: GET global `hero-section` przez Payload Local API
- [ ] Test integracyjny: GET kolekcji `StatTile` — weryfikacja sortowania
- [ ] Test integracyjny: GET `ServicePage` po slug
- [ ] E2E: admin panel → edycja `about-section` → verifikacja bio na stronie głównej
- [ ] Usunąć `ModalNote` "Treść przykładowa" z ModalCV i ModalBio po podłączeniu danych
- [ ] Usunąć `ImageSlot` import z plików gdzie zastąpiony real images
- [ ] Uruchomić `pnpm lint` i `pnpm build` — zero błędów
- [ ] `pnpm test` — wszystkie testy zielone
