# Ukryta podstrona MK Gym (/mk-gym) — Kontekst

**Branch:** `feature/mk-gym-strona`
**Ostatnia aktualizacja:** 2026-07-24 (Faza 3 ukończona — cały plan zrealizowany)

## Powiązane pliki

- `src/collections/ServicePage.ts` — kolekcja podstron usługowych; `access.create: () => false` blokuje tworzenie nowych rekordów przez panel/REST/GraphQL, `update` nie jest ograniczone.
- `src/collections/Portfolio.ts:45-47` — `filterOptions.slug.in` do rozszerzenia o `'mk-gym'`; `labels.plural` do aktualizacji.
- `src/app/api/seed/route.ts` — **odkryte podczas Fazy 1**: to już istniejący, ustalony mechanizm seedowania `ServicePage` (tablica `PAGES`, `GET` tworzy/aktualizuje idempotentnie, `DELETE` usuwa rekordy spoza `PAGES`). Dodajemy tu wpis dla `mk-gym` zamiast tworzyć nowy skrypt `scripts/seed-*.ts` — unika duplikacji logiki i chroni rekord przed przypadkowym usunięciem przez `DELETE` (który usuwa wszystko spoza allowlisty `PAGES`).
- `src/app/(frontend)/meble-premium/page.tsx` — wzorzec do skopiowania 1:1 dla nowej strony `/mk-gym`.
- `src/app/(frontend)/mk-gym/page.tsx` (nowy) — nowa strona, kopia wzorca meble-premium; przekazuje `logoImageUrl="/mk-gym-logo.png"` do `SubpageLayout`.
- `public/mk-gym-logo.png` (dodany przez usera, 500x500 PNG) — logo widoczne w topbarze WYŁĄCZNIE na `/mk-gym`, w miejscu napisu "MCRAFT".
- `src/components/mcraft/SubpageLayout.tsx:107-138` — współdzielony topbar wszystkich podstron usługowych; rozszerzony o opcjonalne propy `logoImageUrl`, `logoHref`, `navOverride` (domyślnie brak → zachowanie bez zmian dla pozostałych podstron).
- `src/components/mcraft/MobileNav.tsx` — bez zmian; przyjmuje generyczną tablicę `NavItem[]`, więc pojedynczy link powrotu przechodzi bez modyfikacji komponentu.
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
- Tworzenie początkowego rekordu `ServicePage`: NIE przez nowy skrypt, tylko przez rozszerzenie istniejącego `src/app/api/seed/route.ts` (tablica `PAGES`, wywołuje `payload.create`/`update` z `overrideAccess: true`) — to już ustalony w repo mechanizm dla tej kolekcji (zob. odkrycie w Fazie 1). Późniejsza edycja treści odbywa się normalnie przez panel.
- `PORTFOLIO_PAGES` w `[serviceSlug]/realizacje/[slug]/page.tsx` rozszerzamy o `'mk-gym'`, ale `NAV_LINKS` w tym samym pliku oraz `NavRealizacjeDropdown.tsx` pozostają nietknięte — jedyna bariera chroniąca brak linkowania na tej trasie.
- Ukrycie SEO: brak zmian w `sitemap.ts`/`robots.ts` (świadoma decyzja z brainstormu — "tylko brak linku").
- Treść startowa (seed) dla `meta.mkGym` i `ServicePage` (slug `mk-gym`) to neutralny placeholder — realny content uzupełni redaktor przez panel po wdrożeniu.
- Nowy rekord `ServicePage` tworzony od zera z polami `localized: true` już w configu — bezpieczny, nie wymaga migracji danych (problem z utratą danych przy `localized: true` dotyczy wyłącznie pól z istniejącą, niezmigrowaną płaską wartością).
- Logo MK Gym w topbarze: dodajemy opcjonalny prop `logoImageUrl` do współdzielonego `SubpageLayout` zamiast forkować cały layout na osobny komponent — zmiana jest lokalna (jeden warunkowy render w topbarze), pozostałe podstrony nie przekazują tego propa więc ich zachowanie się nie zmienia. Logo ZASTĘPUJE napis "MCRAFT" (nie wyświetla się obok).
- Nawigacja na `/mk-gym`: standardowe linki podstrony (`#about`, `#areas`, dropdown realizacji, `#contact`) są ZASTĘPOWANE pojedynczym linkiem powrotu na `https://mkcraft.com.pl` (desktop + mobile menu). Language switcher (translacja PL/EN) POZOSTAJE bez zmian. Klik w logo również prowadzi na `https://mkcraft.com.pl` (nie na wewnętrzne `/`). Realizowane przez propy `logoHref` i `navOverride` na `SubpageLayout` (domyślnie brak → pozostałe podstrony bez zmian). Decyzja usera, 2026-07-24.
- Nowy klucz słownika i18n `dict.mkGym.backToMcraft` (PL: "Powrót na mkcraft.com.pl" / EN: analogiczne tłumaczenie) — etykieta linku powrotu, tłumaczalna zgodnie z R5. (Docelowa domena `mkcraft.com.pl` potwierdzona przez usera — zob. sekcja "Dopracowanie brandingu" niżej.)

## Stan po Fazie 1

- `src/collections/Portfolio.ts`: `filterOptions.slug.in` zawiera `'mk-gym'`; `labels.plural` zaktualizowane.
- `src/app/api/seed/route.ts`: `PAGES` zawiera wpis `mk-gym` (placeholder `title: 'MK Gym'`, `eyebrow: 'Obszar działalności'`, `scopeItems: []`) — `GET /api/seed` seeduje/aktualizuje go idempotentnie, `DELETE /api/seed` już go chroni (jest w allowliście).
- Nowy test `tests/int/mk-gym-collections.int.spec.ts` (4 przypadki) — wszystkie zielone; pełna suita `tests/int` (49 testów) i typecheck/lint bez regresji.
- Poza scope tej fazy: `src/app/api/seed/route.ts` (GET i DELETE) nie ma żadnej autoryzacji — pre-existing problem, niezwiązany z tym zadaniem, zgłoszony osobno (spawn_task) do naprawy poza tym branchem.

## Stan po Fazie 2

- `src/app/(frontend)/mk-gym/page.tsx` istnieje, renderuje `SubpageLayout` z danymi z CMS (seed z Fazy 1) + `logoImageUrl`/`logoHref`/`navOverride`.
- `SubpageLayout.tsx` ma 3 nowe opcjonalne propy; bez nich zachowanie 3 pozostałych podstron niezmienione (potwierdzone testami regresji: unit + e2e).
- Nowe klucze i18n: `mkGym.backToMcraft` (PL/EN), `meta.mkGym.*` (PL/EN, `title` celowo identyczny w obu locale — nazwa marki).
- Testy: 4 nowe w `tests/int/SubpageLayout.int.spec.tsx`, 1 nowy case w `tests/int/metadata.int.spec.ts`, nowy plik `tests/e2e/mk-gym.e2e.spec.ts` (7 scenariuszy). Pełna suita `tests/int` (54 testy), typecheck, lint, `pnpm build` — wszystko zielone.
- **Napotkany i naprawiony błąd:** pierwsza wersja użyła `next/image` dla loga — przeszła typecheck/lint/build, ale w runtime dawała 500 na `/mk-gym` (Next 16 wymaga wpisu w `images.localPatterns` w konfiguracji dla lokalnych plików spoza standardowego przepływu). Wykryte dopiero przez faktyczne odpalenie e2e (build nie renderuje stron `force-dynamic`). Wycofano do zwykłego `<img>` (z `eslint-disable-next-line @next/next/no-img-element`) — prostsze, bez zmian w konfiguracji, zgodne z pierwotną checklistą.
- **Znalezisko dot. infrastruktury testów (nie regresja):** pełne `pnpm exec playwright test` (30 testów, wszystkie pliki naraz) jest niestabilne na tej maszynie (timeouty nawigacji, prawdopodobnie obciążenie Turbopack dev + MongoDB pod Windows/proxy firmowym) — powtórzone dwukrotnie z tym samym wzorcem awarii NIEZALEŻNYM od moich zmian (dotyczy też `/`, `/admin/login`, testów niezwiązanych z mk-gym). Potwierdzone jako pre-existing: uruchomienie WYŁĄCZNIE plików sprzed tej zmiany (`frontend.e2e.spec.ts` + `language-switcher.e2e.spec.ts`) też ma 1 flaky fail (niezwiązany, kolizja kliknięcia z nakładką modala przy 2 workerach). Mój nowy `tests/e2e/mk-gym.e2e.spec.ts` uruchomiony w izolacji (`--workers=1`) przechodzi stabilnie 7/7 w dwóch niezależnych próbach.

## Dopracowanie brandingu /mk-gym (po Fazie 2, przed Fazą 3)

User poprosił o dodatkowe doszlifowanie wyglądu/brandingu strony `/mk-gym`, żeby sprawiała wrażenie zupełnie osobnej strony (nie sekcji MCRAFT):

- **Logo:** białe tło (owinięte w `<span className="bg-white p-[10px]">`) + 3x większy rozmiar (`h-[34px]` → `h-[102px]`). Pozycja linku powrotu (po prawej) była już poprawna w Fazie 2.
- **Domena docelowa (korekta):** logo i link powrotu w nawigacji przez pomyłkę wskazywały na `https://mcraft.com.pl` (bez "k") - user doprecyzował dwukrotnie, że to naprawdę osobna domena `mkcraft.com.pl`. Poprawiono `logoHref`, `navOverride.href` w `mk-gym/page.tsx` oraz treść `dict.mkGym.backToMcraft` (PL/EN) na `mkcraft.com.pl`. Canonical/OG URL samej strony `/mk-gym` (ona sama żyje pod mcraft.com.pl/mk-gym) pozostaje bez zmian - to inna rzecz niż link wyjścia z nawigacji.
- **Favicon:** wygenerowany `public/mk-gym-favicon.png` (kompozycja loga na białym tle, 512x512, przez jednorazowy skrypt `sharp` — `flatten` + `resize contain`) i podpięty jawnie przez `icons: { icon: '/mk-gym-favicon.png' }` w `generateMetadata` strony `/mk-gym`. **Uwaga:** konwencja plikowa Next (`icon.png` w folderze route'u) NIE zadziałała, bo root `layout.tsx` ma jawne `icons: { icon: '/favicon.png' }` w swoim `generateMetadata` — jawna wartość w rodzicu przykrywa konwencję plikową w segmentach potomnych. Dlatego jawne `icons` w `mk-gym/page.tsx` (nadpisuje rodzica) + plik w `public/`, nie plik w folderze route'u.
- **Tytuł karty przeglądarki:** `title: dict.meta.mkGym.title` (plain string) automatycznie dostawał szablon `'%s | MCRAFT'` z root layoutu → `"MK Gym | MCRAFT"`. Zmienione na `title: { absolute: dict.meta.mkGym.title }` — Next.js `absolute` jawnie pomija szablon rodzica, więc karta pokazuje dokładnie `"MK Gym"`.
- **Loading screen:** `PageLoader` (pełnoekranowa plansza z animacją i napisem "MCRAFT", renderowana globalnie w root `layout.tsx` dla wszystkich stron) wyłączona na `/mk-gym` i jego pod-trasach przez `usePathname()` wewnątrz `PageLoader.tsx` (`DISABLED_PREFIXES = ['/mk-gym']`) — komponent zwraca `null` zamiast planszy, bez dotykania `layout.tsx` ani innych stron.
- Nowe testy: `tests/int/PageLoader.int.spec.tsx` (3 testy: renderuje się na zwykłej stronie, nie renderuje się na `/mk-gym` i jego pod-trasach), rozszerzony `tests/int/SubpageLayout.int.spec.tsx` (asercje na rozmiar/tło loga), rozszerzony `tests/e2e/mk-gym.e2e.spec.ts` (dokładny tytuł karty, favicon różny od `/favicon.png`, brak `.weld-fill` splasha, wymiary/tło loga).

## Stan po Fazie 3

- `PORTFOLIO_PAGES` w `[serviceSlug]/realizacje/[slug]/page.tsx` zawiera `'mk-gym'` — jedyna zmiana w tym pliku, potwierdzona `git diff`. `NAV_LINKS` (ten sam plik) i `NavRealizacjeDropdown.tsx` bez zmian.
- Nowy test `tests/int/realizacja-page.int.spec.ts` (3 przypadki): poprawny render dla `mk-gym`, link powrotu w nagłówku wskazuje `/mk-gym`, regresja `notFound()` dla nieznanego obszaru. Wzorzec mockowania: `next/headers`, `server-only`, `next/navigation` (`useRouter` nadpisany przez `vi.importOriginal`, żeby zachować prawdziwy `notFound`).
- Nowy e2e scenariusz w `tests/e2e/mk-gym.e2e.spec.ts`: seeduje tymczasową realizację przez Payload Local API (`beforeAll`/`afterAll`, wzorzec `tests/helpers/seedUser.ts` już używany w `admin.e2e.spec.ts`), otwiera `/mk-gym/realizacje/<slug>` bezpośrednio, sprawdza treść i link powrotu.
- Pełna suita `tests/int` (60 testów), typecheck, lint — zielone. E2e `tests/e2e/mk-gym.e2e.spec.ts` w izolacji (`--workers=1`): 11/11 zielone.
- To domyka wszystkie 3 fazy planu technicznego `docs/plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md`.

## Zależności

- Faza 2 zależy od Fazy 1 (potrzebny rekord `ServicePage` i rozszerzone `filterOptions`).
- Faza 3 zależy od Fazy 1 i Fazy 2.
- Seed początkowego rekordu wymaga jednorazowego uruchomienia skryptu również na środowisku produkcyjnym po deployu (analogicznie do innych skryptów seedujących w repo).

## Źródła
- Requirements doc: [docs/dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md](../../dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md)
- Plan techniczny: [docs/plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md](../../plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md)
