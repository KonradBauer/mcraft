# Angielska wersja jezykowa strony (i18n) — Kontekst

**Branch:** `feature/i18n-english-locale`
**Ostatnia aktualizacja:** 2026-07-21

## Powiazane pliki

- `src/payload.config.ts` — dodanie sekcji `localization`
- `src/collections/ServicePage.ts` — flagi `localized: true` na tekstach + admin.description hint
- `src/collections/Portfolio.ts` — flagi `localized: true` (title, description, images[].alt), NIE slug
- `src/globals/HeroSection.ts` — flagi `localized: true` (subtitle, description)
- `src/globals/AboutSection.ts` — flaga `localized: true` (bioText)
- `src/globals/CvModal.ts` — flagi `localized: true` (opisy, NIE pola year)
- `src/globals/BioModal.ts` — flagi `localized: true` (sections[].title, sections[].content)
- `src/collections/StatTile.ts` — flagi `localized: true` (label, description), NIE number
- `scripts/migrate-localize-content.ts` — jednorazowy skrypt migracji istniejacych danych PL do ksztaltu locale-keyed
- `src/payload-types.ts` — regenerowany przez `pnpm generate:types`, bez recznej edycji
- `src/lib/i18n/locale.ts` — `getLocale()`, czyta cookie, domyslnie `'pl'`
- `src/lib/i18n/setLocale.ts` — server action ustawiajacy cookie
- `src/lib/i18n/dictionaries/pl.ts`, `src/lib/i18n/dictionaries/en.ts` — slownik statycznych tekstow
- `src/lib/i18n/getDictionary.ts` — `server-only` loader slownika
- `src/components/mcraft/LanguageSwitcher.tsx` — nowy komponent przelacznika
- `src/components/mcraft/ModalProvider.tsx` — wystawienie `closeModal` do uzytku poza providerem; hardcodowany fallback CV/Bio zostaje PL zawsze
- `src/components/mcraft/HomeContent.tsx`, `SubpageLayout.tsx`, `MobileNav.tsx`, `NavRealizacjeDropdown.tsx`, `TilesMarquee.tsx`, `RealizacjaGaleria.tsx` — podmiana hardcodowanych stringow na slownik
- `src/app/(frontend)/layout.tsx` — `getLocale()`, `<html lang>`, `generateMetadata()`, JSON-LD schema.org
- `src/app/(frontend)/page.tsx`, `nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — locale w `payload.find`/`findGlobal`, `generateMetadata()`
- `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — locale w danych i `generateMetadata`, stopka
- `src/app/(frontend)/not-found.tsx` — stopka, Google Maps hl param
- `src/app/(frontend)/polityka-prywatnosci/page.tsx` + nowe `content.pl.tsx`/`content.en.tsx`
- `src/lib/servicePageData.ts` — sprawdzic czy sygnatura mapperow wymaga zmiany (prawdopodobnie nie)

## Decyzje techniczne

- Payload native localization, nie reczne dublowanie pol (`titleEn`) — jeden config, skaluje sie do kolejnych jezykow.
- Lekki wlasny slownik PL/EN (typed dictionaries, `satisfies`), nie next-intl/i18next.
- Cookie (nie localStorage) jako mechanizm trwalosci — localStorage nie jest czytelny server-side, caly render jest SSR (`force-dynamic`).
- Zawsze PL przy pierwszej wizycie (brak cookie) — bez detekcji Accept-Language. Firma dziala glownie w Polsce, Accept-Language bywa mylacy.
- Lokalizacja pol-lisci wewnatrz tablic (`scopeItems`, `audienceItems`, `additionalSections[].items`, `images[]`), nie calych tablic — zachowuje wspolna strukture/kolejnosc miedzy jezykami.
- Jawna lista pol wykluczonych z `localized: true`: `slug` (Portfolio i ServicePage), `order`, `servicePage` (relationship), pola `upload`/`select`/`number` jako wartosc faktyczna, `CvModal.year`.
- `Portfolio.images[].alt` DOSTAJE `localized: true` — accessibility dla EN.
- Migracja danych jako jawny, oddzielny krok (Faza 1) — konwersja bez migracji gubi istniejaca produkcyjna tresc PL.
- Przelacznik jezyka NIE dotyka `document.body` scroll-locka — unika kolizji z `ModalProvider`/`MobileNav`.
- Przelaczenie jezyka zamyka otwarty modal PRZED `router.refresh()` — unika podmiany tresci pod otwartym modalem i nieaktualnego `lastOrigin` w animacji zoom.
- Meta dane przez `generateMetadata()`, nie statyczny `export const metadata` — statyczny metadata nie moze czytac cookies.
- JSON-LD schema.org: opisowe pola tekstowe przelaczaja sie z jezykiem, dane faktyczne (adres, NIP, REGON, telefon) zostaja identyczne.
- Google Maps iframe dostaje `&hl=${locale}`.
- Caly scope w jednym planie, bez fazowania na osobne release'y.
- Polityka prywatnosci jako osobna, statyczna tresc (nie CMS) — wlasne pliki PL/EN.

(Pelne uzasadnienia i zrodla decyzji: zob. plan techniczny, sekcja "Kluczowe decyzje techniczne")

## Zaleznosci

- Faza 4 zalezy od Fazy 2 (cookie) i Fazy 3 (etykiety slownika).
- Faza 5 zalezy od Fazy 1 (pola musza byc `localized`) i Fazy 2 (`getLocale()`).
- Faza 6 zalezy od Fazy 3 (slownik) i Fazy 4 (przelacznik juz wpiety w nav).
- Faza 7 zalezy od Fazy 2 (`getLocale()`) i Fazy 3 (slownik).
- Faza 8 zalezy od Fazy 2 i Fazy 3.
- Fazy 1, 2, 3 nie zaleza od siebie nawzajem — mozna je prowadzic rownolegle/w dowolnej kolejnosci.

## Zrodla
- Requirements doc: [docs/dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md](../../dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md)
- Plan techniczny: [docs/plans/2026-07-21-005-feat-english-language-version-plan.md](../../plans/2026-07-21-005-feat-english-language-version-plan.md)
