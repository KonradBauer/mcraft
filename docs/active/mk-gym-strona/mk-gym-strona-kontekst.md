# Ukryta podstrona MK Gym (/mk-gym) — Kontekst

**Branch:** `feature/mk-gym-strona`
**Ostatnia aktualizacja:** 2026-07-24

## Powiązane pliki

- `src/collections/ServicePage.ts` — kolekcja podstron usługowych; `access.create: () => false` blokuje tworzenie nowych rekordów przez panel/REST/GraphQL, `update` nie jest ograniczone.
- `src/collections/Portfolio.ts:45-47` — `filterOptions.slug.in` do rozszerzenia o `'mk-gym'`; `labels.plural` do aktualizacji.
- `scripts/seed-mk-gym.ts` (nowy) — jednorazowy skrypt seedujący początkowy rekord `ServicePage` (slug `mk-gym`).
- `src/app/(frontend)/meble-premium/page.tsx` — wzorzec do skopiowania 1:1 dla nowej strony `/mk-gym`.
- `src/app/(frontend)/mk-gym/page.tsx` (nowy) — nowa strona, kopia wzorca meble-premium.
- `src/lib/servicePageData.ts` — `toSubpageLayoutProps` + `toRealizacjeProps`, slug-agnostyczne, reużyte bez zmian.
- `src/lib/i18n/dictionaries/pl.ts`, `src/lib/i18n/dictionaries/en.ts` — dodanie sekcji `meta.mkGym` analogicznej do `meta.meblePremium`.
- `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx:16` — `PORTFOLIO_PAGES` do rozszerzenia o `'mk-gym'`. `NAV_LINKS` (linie 61-73) w tym samym pliku — **NIE modyfikować**.
- `src/components/mcraft/NavRealizacjeDropdown.tsx` — hardcoded `AREAS` (3 pozycje) — **NIE modyfikować**.
- `src/app/(frontend)/page.tsx` + `src/components/mcraft/HomeContent.tsx` — pobierają wszystkie rekordy `service-pages`, ale renderują kafelki tylko z hardcoded `AREA_DEFAULTS` — potwierdzone jako bezpieczne, nie wymaga zmian.
- `src/app/sitemap.ts`, `src/app/robots.ts` — statyczne listy, bez enumeracji z CMS — **NIE modyfikować** (świadoma decyzja: brak wykluczenia SEO, tylko brak linku).
- `tests/int/mk-gym-collections.int.spec.ts` (nowy) — testy integracyjne kolekcji.
- `tests/int/metadata.int.spec.ts` — rozszerzenie o case dla `/mk-gym`.
- `tests/int/realizacja-page.int.spec.ts` (nowy) — testy integracyjne trasy szczegółów realizacji.
- `tests/e2e/mk-gym.e2e.spec.ts` (nowy) — E2E: bezpośredni dostęp do `/mk-gym`, brak linku ze strony głównej/nawigacji.

## Decyzje techniczne

- Model danych: rozszerzenie `ServicePage` (nowy rekord, slug `mk-gym`) i `Portfolio` (`filterOptions` += `mk-gym`) zamiast nowej kolekcji — spójne z istniejącym wzorcem (Konstrukcje Stalowe dodane tą samą metodą) (zob. plan techniczny).
- Tworzenie początkowego rekordu `ServicePage` przez skrypt seedujący z Payload Local API (domyślny `overrideAccess: true`), bo `access.create` na tej kolekcji jest zablokowane dla REST/GraphQL/panelu. Późniejsza edycja treści odbywa się normalnie przez panel.
- `PORTFOLIO_PAGES` w `[serviceSlug]/realizacje/[slug]/page.tsx` rozszerzamy o `'mk-gym'`, ale `NAV_LINKS` w tym samym pliku oraz `NavRealizacjeDropdown.tsx` pozostają nietknięte — jedyna bariera chroniąca brak linkowania na tej trasie.
- Ukrycie SEO: brak zmian w `sitemap.ts`/`robots.ts` (świadoma decyzja z brainstormu — "tylko brak linku").
- Treść startowa (seed) dla `meta.mkGym` i `ServicePage` (slug `mk-gym`) to neutralny placeholder — realny content uzupełni redaktor przez panel po wdrożeniu.
- Nowy rekord `ServicePage` tworzony od zera z polami `localized: true` już w configu — bezpieczny, nie wymaga migracji danych (problem z utratą danych przy `localized: true` dotyczy wyłącznie pól z istniejącą, niezmigrowaną płaską wartością).

## Zależności

- Faza 2 zależy od Fazy 1 (potrzebny rekord `ServicePage` i rozszerzone `filterOptions`).
- Faza 3 zależy od Fazy 1 i Fazy 2.
- Seed początkowego rekordu wymaga jednorazowego uruchomienia skryptu również na środowisku produkcyjnym po deployu (analogicznie do innych skryptów seedujących w repo).

## Źródła
- Requirements doc: [docs/dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md](../../dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md)
- Plan techniczny: [docs/plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md](../../plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md)
