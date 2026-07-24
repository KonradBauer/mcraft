# Ukryta podstrona MK Gym (/mk-gym) — Podsumowanie

**Data ukończenia:** 2026-07-24
**Branch:** feature/mk-gym-strona (zmergowany do main przez PR [#2](https://github.com/KonradBauer/mcraft/pull/2))

## Co zostało dostarczone

- Nowa podstrona `/mk-gym`, strukturalnie identyczna z `/meble-premium` (hero, zakres, opcjonalne sekcje, realizacje, CTA), niedostępna z żadnego miejsca we froncie MCRAFT (deeplink-only, zgodnie z wymaganiem).
- Rozszerzone kolekcje Payload (`ServicePage` slug `mk-gym`, `Portfolio.filterOptions`) zamiast nowej kolekcji - zakres, sekcje i realizacje edytowalne w panelu admina, tłumaczalne PL/EN tym samym mechanizmem co pozostałe podstrony.
- Branding jako osobna strona (dopracowany po Fazie 2, na żądanie usera): własne logo (białe tło, 3x większe niż wordmark) zamiast napisu "MCRAFT", nawigacja zastąpiona jednym linkiem powrotu na `mkcraft.com.pl` (desktop + mobile), własny favicon, tytuł karty przeglądarki dokładnie "MK Gym" (bez sufiksu "| MCRAFT"), wyłączony pełnoekranowy loading screen MCRAFT.
- `/mk-gym/realizacje/[slug]` działa identycznie jak dla pozostałych dwóch obszarów portfolio.

## Kluczowe decyzje

- Model danych: rozszerzenie istniejących kolekcji (`ServicePage`, `Portfolio`) zamiast nowej kolekcji - spójność ze wzorcem (Konstrukcje Stalowe dodane tą samą metodą), brak duplikacji logiki.
- Seed początkowego rekordu przez istniejący, ustalony mechanizm `src/app/api/seed/route.ts` (tablica `PAGES`), nie przez nowy skrypt - odkryte podczas implementacji, uniknięto duplikacji i ochroniło rekord przed `DELETE` (który usuwa wszystko spoza allowlisty).
- Ukrycie strony: wyłącznie brak linkowania z frontendu (żadnych zmian w `sitemap.ts`/`robots.ts`) - świadoma decyzja usera z brainstormu.
- Logo/nawigacja/favicon/tytuł/loading screen na `/mk-gym`: zaimplementowane jako opcjonalne propy (`logoImageUrl`, `logoHref`, `navOverride`) na współdzielonym `SubpageLayout` i warunek ścieżki (`usePathname`) w `PageLoader` - zero zmian zachowania dla pozostałych 3 podstron bez tych propów/prefiksu.
- Zwykły `<img>` zamiast `next/image` dla logo - next/image wymaga `images.localPatterns` w Next 16 dla lokalnych plików spoza CMS, próba dała runtime 500 wykryty dopiero przez e2e (build tego nie łapie dla stron `force-dynamic`).

## Główne pliki

- `src/app/(frontend)/mk-gym/page.tsx` — nowa strona (kopia wzorca `meble-premium/page.tsx`).
- `src/collections/Portfolio.ts` — `filterOptions.slug.in` += `mk-gym`.
- `src/app/api/seed/route.ts` — `PAGES` += wpis `mk-gym`.
- `src/components/mcraft/SubpageLayout.tsx` — opcjonalne propy `logoImageUrl`/`logoHref`/`navOverride`.
- `src/components/mcraft/PageLoader.tsx` — `usePathname()` + `DISABLED_PREFIXES` wyłącza splash na `/mk-gym`.
- `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — `PORTFOLIO_PAGES` += `mk-gym` (jedyna zmiana, `NAV_LINKS` nietknięte).
- `src/lib/i18n/dictionaries/{pl,en}.ts` — `meta.mkGym`, `mkGym.backToMcraft`.
- `public/mk-gym-logo.png`, `public/mk-gym-favicon.png` — assety brandingu.
- Testy: `tests/int/mk-gym-collections.int.spec.ts`, `tests/int/PageLoader.int.spec.tsx`, `tests/int/realizacja-page.int.spec.ts`, rozszerzenia `SubpageLayout.int.spec.tsx` i `metadata.int.spec.ts`, `tests/e2e/mk-gym.e2e.spec.ts` (11 scenariuszy).

## Wnioski

- **Zawsze sprawdź, czy w repo istnieje już mechanizm seedowania danej kolekcji, zanim napiszesz nowy skrypt** - `src/app/api/seed/route.ts` z tablicą `PAGES` już obsługiwał `ServicePage`, w tym idempotentny upsert i ochronę przed usunięciem (`DELETE` usuwa wszystko spoza allowlisty). Nowy `scripts/seed-*.ts` zdublowałby logikę i zostawił rekord bez tej ochrony.
- **`pnpm build` nie łapie runtime błędów `next/image` na stronach `force-dynamic`** - build statycznie analizuje, ale nie renderuje takich stron. Błąd `images.localPatterns` (Next 16, lokalne pliki spoza standardowego przepływu) ujawnił się dopiero przy faktycznym uruchomieniu e2e. Dla jednorazowych, małych obrazków (logo, ikony) zwykły `<img>` bywa prostszy i bez ryzyka konfiguracyjnego.
- **Jawne `icons`/`title` w root `layout.tsx` przykrywają konwencje plikowe (`icon.png`) i szablony (`title.template`) w segmentach potomnych** - żeby nadpisać, trzeba jawnie zadeklarować `icons`/`title: { absolute }` w `generateMetadata` dziecka, nie polegać na konwencji plikowej.
- **Pełna suita e2e (`pnpm exec playwright test`, wszystkie pliki naraz) jest niestabilna na tej maszynie Windows** (prawdopodobnie Turbopack dev + MongoDB pod korporacyjnym proxy) - potwierdzone jako pre-existing, niezwiązane z tą zmianą. Uruchamianie pojedynczych plików w izolacji (`--workers=1`) daje stabilne wyniki. Zgłoszone jako osobne zadanie do zbadania.
- **`git push`/`gh` przez korporacyjny proxy wymagają `http.sslBackend schannel`** (lokalnie w repo) zamiast domyślnego `openssl` z niepełnym CA bundle - inaczej `SSL certificate problem: unable to get local issuer certificate`.

## Znane braki

- **(ręczne, do wykonania po deployu)** Wywołać `GET /api/seed` na środowisku produkcyjnym, żeby faktycznie utworzyć rekord `ServicePage` (slug `mk-gym`) na produkcyjnej bazie - bez tego `/mk-gym` na produkcji renderuje się z hardcoded `FALLBACK`, nie z (choćby placeholder) treścią CMS.
- Poza scope tego zadania: `src/app/api/seed/route.ts` (`GET`/`DELETE`) nie ma żadnej autoryzacji - pre-existing problem, zgłoszony osobno (spawn_task) do naprawy poza tym branchem.
- Poza scope tego zadania: niestabilność pełnej suity e2e pod wieloma workerami - zgłoszona osobno (spawn_task) do zbadania.
