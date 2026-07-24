---
title: "feat: Ukryta podstrona MK Gym (/mk-gym)"
type: feat
status: active
date: 2026-07-24
origin: docs/dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md
---

# feat: Ukryta podstrona MK Gym (/mk-gym)

## Przegląd

Dodajemy nową podstronę `/mk-gym`, strukturalnie i wizualnie identyczną z `/meble-premium`, ale niedostępną z żadnego miejsca we froncie MCRAFT - jedyny sposób trafienia na nią to bezpośredni URL z zewnętrznej strony. Treść (zakres, opcjonalne sekcje, realizacje) zarządzana jest z panelu admina, tłumaczalna PL/EN tym samym mechanizmem co pozostałe podstrony usługowe.

## Ujęcie problemu

Zewnętrzna strona ma linkować bezpośrednio na `/mk-gym` jako wejście do dodatkowego obszaru działalności. Strona główna MCRAFT i nawigacja mają pozostać dokładnie takie jak dziś - zero nowych kafelków, wpisów w menu czy w dropdownie realizacji.

## Śledzenie wymagań

- R1. Nowa podstrona `/mk-gym`, wizualnie i strukturalnie identyczna z `/meble-premium` (hero, zakres usług, opcjonalne dodatkowe sekcje, realizacje, CTA).
- R2. Strona nie jest linkowana z żadnego miejsca na froncie MCRAFT - brak kafelka na stronie głównej, brak wpisu w nawigacji/dropdownie realizacji.
- R3. Nowy wpis obszaru "MK Gym" w istniejącej kolekcji Podstron usługowych, z polami zakresu i opcjonalnych dodatkowych sekcji analogicznymi do Mebli Premium.
- R4. Realizacje dla MK Gym zarządzane w istniejącej kolekcji Realizacji, rozszerzonej o możliwość przypisania do obszaru MK Gym.
- R5. Wszystkie treści MK Gym tłumaczalne PL/EN w panelu admina, tym samym mechanizmem lokalizacji co pozostałe podstrony.

## Granice scope'u

- Brak jakichkolwiek zmian we froncie MCRAFT poza samą stroną `/mk-gym` - żadnego kafelka, wpisu w menu ani w `NavRealizacjeDropdown`.
- Brak wykluczenia z `sitemap.xml` i brak meta `noindex` - jedynym mechanizmem ukrycia jest brak linkowania (deeplink-only), zgodnie ze świadomą decyzją z brainstormu.
- Brak dodatkowego uwierzytelniania/hasła dostępu do `/mk-gym`.
- Brak nowej, samodzielnej kolekcji Payload - rozszerzamy `ServicePage` i `Portfolio`.

## Kontekst i research

### Relevantny kod i wzorce

- `src/app/(frontend)/meble-premium/page.tsx` - wzorzec strony do skopiowania 1:1 (locale, dict, `payload.find` po slug, `FALLBACK`, `toSubpageLayoutProps` + `toRealizacjeProps`).
- `src/collections/ServicePage.ts` - `access: { create: () => false }` - **nikt nie tworzy nowych rekordów przez panel/REST/GraphQL**; istniejące 3 rekordy (nadzor-spawalniczy, konstrukcje-stalowe, meble-premium) musiały powstać przez skrypt seedujący z Local API. Edycja (`update`) nie jest ograniczona - redaktor może swobodnie edytować treść po seedzie.
- `src/collections/Portfolio.ts:45-47` - `filterOptions.slug.in: ['meble-premium', 'konstrukcje-stalowe']` - dokładne miejsce do rozszerzenia o `'mk-gym'`. `labels.plural` ("Realizacje (Meble i Konstrukcje)") wymaga aktualizacji.
- `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx:16` - `const PORTFOLIO_PAGES = ['meble-premium', 'konstrukcje-stalowe']` - gate decydujący czy strona realizacji się renderuje (inaczej `notFound()`); wymaga dodania `'mk-gym'`. Ten sam plik ma hardcoded `NAV_LINKS` (linie 61-73) - **te NIE mogą zostać rozszerzone o mk-gym** (zachowanie R2).
- `src/components/mcraft/NavRealizacjeDropdown.tsx` - hardcoded tablica `AREAS` (3 pozycje) - potwierdzone, że nie pobiera danych z CMS dynamicznie. **Nie modyfikować** - to gwarancja że mk-gym nie "wycieknie" do dropdownu na innych stronach.
- `src/app/(frontend)/page.tsx` + `HomeContent.tsx` - strona główna pobiera WSZYSTKIE rekordy `service-pages` (`limit: 10`, bez filtra po slug), ale `HomeContent.tsx` renderuje kafelki wyłącznie z hardcoded `AREA_DEFAULTS` (3 pozycje) i ignoruje dodatkowe rekordy z CMS. **Potwierdzone jako bezpieczne** - 4. rekord (mk-gym) nie wygeneruje kafelka.
- `src/app/sitemap.ts`, `src/app/robots.ts` - statyczne, ręcznie pisane listy, zero enumeracji z CMS. `/mk-gym` nie pojawi się tam, dopóki jawnie nie zostanie dodana (nie dodajemy - zgodnie z granicami scope'u).
- `src/lib/servicePageData.ts` - `toSubpageLayoutProps` i `toRealizacjeProps` są slug-agnostyczne, można użyć bez zmian z `serviceSlug: 'mk-gym'`.
- `src/lib/i18n/dictionaries/{pl,en}.ts` - sekcja `meta.meblePremium: { title, description, ogTitle, ogDescription }` - wzorzec do skopiowania jako `meta.mkGym`.
- Konwencja `docs/plans/`: najwyższy istniejący numer to `005` → ten plan to `006`.

### Wiedza instytucjonalna

- `docs/solutions/backend-issues/2026-07-23-payload-unmigrated-locale-fields-lose-data-on-save.md` - problem z utratą danych przy `localized: true` dotyczy WYŁĄCZNIE pól z istniejącą, niezmigrowaną płaską wartością. Nowy rekord `ServicePage` (slug `mk-gym`) tworzony od zera, z polami już `localized: true` w configu, **nie jest zagrożony** - nie ma żadnej starej wartości do stracenia. Migracja nie jest potrzebna dla tego planu.
- `docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md` - każdy skrypt seedujący w `scripts/` łączący się przez `getPayload({ config })` musi kończyć się jawnym `process.exit(0)` / `process.exit(1)` w catch (wzorzec: `scripts/seed-tiles.ts`, `scripts/seed-cv.ts`).
- `docs/solutions/backend-issues/2026-07-21-payload-defaultvalue-applies-despite-hidden-admin-condition.md` - `admin.condition` nie wpływa na `defaultValue` przy tworzeniu dokumentu. Istotne przy seedowaniu `scopeItems` jeśli używane są pola z warunkowym `admin.condition` (np. ikony) - nie zakładać pustych wartości bez sprawdzenia.

## Kluczowe decyzje techniczne

- Model danych: rozszerzenie `ServicePage` (nowy rekord, slug `mk-gym`) i `Portfolio` (`filterOptions` += `mk-gym`) zamiast nowej kolekcji (zob. źródło) - potwierdzone przez research jako spójne z istniejącym wzorcem (Konstrukcje Stalowe został dodany tą samą metodą).
- Tworzenie początkowego rekordu `ServicePage` przez skrypt seedujący z Payload Local API (domyślny `overrideAccess: true`), ponieważ `access.create` na tej kolekcji jest zablokowane (`() => false`) dla REST/GraphQL/panelu. Późniejsza edycja treści odbywa się normalnie przez panel (`update` nie jest ograniczone).
- `PORTFOLIO_PAGES` w `[serviceSlug]/realizacje/[slug]/page.tsx` rozszerzamy o `'mk-gym'`, ale `NAV_LINKS` w tym samym pliku oraz `NavRealizacjeDropdown.tsx` pozostają nietknięte - to jedyna bariera chroniąca R2 na tej trasie.
- Ukrycie SEO: brak zmian w `sitemap.ts`/`robots.ts` (świadoma decyzja z brainstormu - "tylko brak linku").
- Treść startowa (seed) dla `meta.mkGym` i `ServicePage.mk-gym` to neutralny placeholder (np. `eyebrow: "Obszar działalności"`, `title: "MK Gym"`), nie wymyślona treść marketingowa - realny content uzupełni redaktor przez panel po wdrożeniu (zgodnie z R3/R5).

## Otwarte pytania

### Rozwiązane podczas planowania

- Czy wpis MK Gym potrzebuje osobnej grupy/sekcji w sidebarze admina?: Nie - dołącza jako kolejny rekord do istniejącej listy "Podstrony usługowe", tak jak pozostałe 3 obszary.
- Etykieta kolekcji Portfolio ("Realizacje (Meble i Konstrukcje)"): aktualizujemy na "Realizacje (Meble, Konstrukcje i MK Gym)" żeby redaktor widział pełny zakres wyboru w adminie.
- Jak obejść `access.create: () => false` na `ServicePage` dla początkowego rekordu?: Skrypt jednorazowy w `scripts/` przez Local API (domyślny `overrideAccess: true`), wzorzec `scripts/seed-tiles.ts` + `process.exit`.

### Odroczone do implementacji

- Finalna treść marketingowa MK Gym (zakres usług, sekcje, opisy) - seed dostarcza neutralny placeholder; redaktor uzupełnia prawdziwą treść PL/EN przez panel po wdrożeniu. Nie jest to blokerem dla tego planu.

## Implementation Units

- [x] **Unit 1: Rozszerzenie kolekcji Payload + seed początkowego rekordu MK Gym** ✅

**Cel:** Kolekcje `ServicePage` i `Portfolio` obsługują obszar `mk-gym`; istnieje jeden początkowy dokument `ServicePage` (slug `mk-gym`) gotowy do wyświetlenia i dalszej edycji przez panel.

**Wymagania:** R3, R4, R5

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/collections/Portfolio.ts` (linia ~46: `filterOptions.slug.in` += `'mk-gym'`; `labels.plural` → "Realizacje (Meble, Konstrukcje i MK Gym)")
- Modyfikuj: `src/app/api/seed/route.ts` (zamiast `scripts/seed-mk-gym.ts` — zob. notatka niżej)
- Test (unit): `tests/int/mk-gym-collections.int.spec.ts`

**Podejście:**
- **Odkryte podczas implementacji:** repo ma już ustalony mechanizm seedowania `ServicePage` — `src/app/api/seed/route.ts` z tablicą `PAGES` (`GET` tworzy/aktualizuje idempotentnie, `DELETE` usuwa rekordy spoza `PAGES`). Zamiast nowego `scripts/seed-mk-gym.ts` dodano wpis `mk-gym` do tej tablicy — spójne z istniejącym wzorcem, unika duplikacji logiki i chroni rekord przed `DELETE`.
- Brak potrzeby migracji danych (nowy rekord, zob. wiedza instytucjonalna).

**Wzorce do naśladowania:**
- `src/app/api/seed/route.ts` (istniejące wpisy `PAGES` dla pozostałych 3 obszarów)
- `src/collections/ServicePage.ts` (kształt pól)

**Scenariusze testowe:**
- [Unit] Utworzenie `Portfolio` z `servicePage` wskazującym na dokument o slug `mk-gym` przechodzi walidację `filterOptions` (nie rzuca błędu relacji)
- [Unit] Dwukrotne wywołanie `GET /api/seed` tworzy dokładnie jeden dokument `ServicePage` ze slug `mk-gym` (idempotencja: `created` → `updated`)
- [Unit] Dokument `ServicePage` ze slug `mk-gym` ma niepuste pole `title` w locale `pl` po seedzie
- [Unit] (odkryte) Portfolio ze `servicePage` spoza allowlisty nadal odrzucane (regresja na `filterOptions`)

**Weryfikacja:**
- Testy integracyjne przechodzą na realnej instancji MongoDB; zapytanie `payload.find({ collection: 'service-pages', where: { slug: { equals: 'mk-gym' } } })` zwraca dokładnie jeden dokument.

---

- [x] **Unit 2: Strona /mk-gym (mirror meble-premium)** ✅

**Cel:** `/mk-gym` renderuje treść z CMS w layoucie identycznym z `/meble-premium`, w obu locale.

**Wymagania:** R1, R5

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/app/(frontend)/mk-gym/page.tsx`
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx` (nowe opcjonalne propy `logoImageUrl`, `logoHref`, `navOverride` — dodane w tej samej fazie, żeby obsłużyć logo w topbarze i nawigację z linkiem powrotu wymagane przez usera w trakcie implementacji)
- Modyfikuj: `src/lib/i18n/dictionaries/pl.ts` (dodaj `meta.mkGym: { title, description, ogTitle, ogDescription }` oraz `mkGym.backToMcraft`)
- Modyfikuj: `src/lib/i18n/dictionaries/en.ts` (analogicznie, angielskie tłumaczenie)
- Test (unit): `tests/int/metadata.int.spec.ts` (case dla `/mk-gym` — asercja na `description`, nie `title`, bo tytuł "MK Gym" jest celowo identyczny w obu locale)
- Test (unit): `tests/int/SubpageLayout.int.spec.tsx` (4 nowe testy dla `logoImageUrl`/`logoHref`/`navOverride`)
- Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts`

**Podejście:**
- Kopiuj strukturę `meble-premium/page.tsx` 1:1: `force-dynamic`, `getLocale()` + `getDictionary()`, `payload.find({ collection: 'service-pages', where: { slug: { equals: 'mk-gym' } }, locale })`, `toSubpageLayoutProps` + `toRealizacjeProps(portfolioDocs, 'mk-gym')`.
- Canonical URL: `https://mcraft.com.pl/mk-gym`. Własny `FALLBACK` placeholder (analogiczny kształt co w meble-premium) na wypadek braku rekordu w danym środowisku.
- Logo: zwykły `<img>` (nie `next/image` — próbowano, Next 16 wymaga `images.localPatterns` w configu dla lokalnych plików spoza standardowego przepływu, dawało runtime 500; wycofano do `<img>` z `eslint-disable-next-line`).

**Wzorce do naśladowania:**
- `src/app/(frontend)/meble-premium/page.tsx` (kopiowany 1:1, zmienione stringi/slug)
- `src/lib/servicePageData.ts` (bez zmian, reużyte funkcje)

**Scenariusze testowe:**
- [Unit] `generateMetadata` dla `/mk-gym` zwraca różny `description` dla locale `pl` i `en` (tytuł identyczny celowo — nazwa marki)
- [Unit] `SubpageLayout` bez `logoImageUrl`/`navOverride` zachowuje się identycznie jak dziś (regresja)
- [Unit] `SubpageLayout` z `logoImageUrl` renderuje `<img>` zamiast wordmarku; z `navOverride` zastępuje nawigację, zachowuje language switcher
- [E2E] Otwórz `/mk-gym` bezpośrednio (bez nawigowania z innej strony) → sprawdź że hero, zakres i CTA renderują się poprawnie, treść odpowiada seedowi z Unit 1
- [E2E] Topbar `/mk-gym`: logo zamiast wordmarku, link powrotu zamiast standardowej nawigacji, language switcher działa, klik logo → `https://mcraft.com.pl`
- [E2E] Mobile: menu na `/mk-gym` pokazuje tylko link powrotu + language toggle
- [E2E] Regresja: `/meble-premium` topbar bez zmian (wordmark, standardowa nawigacja, logo → `/`)
- [E2E] Otwórz `/` (stronę główną) → sprawdź, że sekcja "Obszary działalności" pokazuje dokładnie 3 kafelki (bez MK Gym) i nigdzie nie ma linku do `/mk-gym`

**Weryfikacja:**
- Strona renderuje się poprawnie z danymi z seeda w obu locale; grep po `mk-gym` w `src/components/mcraft/` i `src/app/(frontend)/page.tsx` nie zwraca nowych wystąpień poza samą stroną `/mk-gym`. Potwierdzone: `pnpm build` przechodzi, e2e (izolowanie, `--workers=1`) 7/7 zielone.

---

- [ ] **Unit 3: Szczegóły realizacji dla MK Gym (/mk-gym/realizacje/[slug])**

**Cel:** Dynamiczna trasa szczegółów realizacji obsługuje obszar `mk-gym` tak samo jak pozostałe dwa obszary portfolio.

**Wymagania:** R1, R4

**Zależności:** Unit 1, Unit 2

**Pliki:**
- Modyfikuj: `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` (linia 16: `PORTFOLIO_PAGES` += `'mk-gym'`)
- Test (unit): `tests/int/realizacja-page.int.spec.ts`

**Podejście:**
- Jedyna zmiana to rozszerzenie `PORTFOLIO_PAGES`. `NAV_LINKS` (linie 61-73) i `NavRealizacjeDropdown.tsx` pozostają BEZ ZMIAN - to świadome ograniczenie chroniące R2 na tej trasie.

**Wzorce do naśladowania:**
- Istniejąca logika `sp.slug !== serviceSlug` → `notFound()` (już generyczna, nie wymaga zmian)

**Scenariusze testowe:**
- [Unit] `serviceSlug='mk-gym'` z istniejącym slug realizacji przypisanej do obszaru mk-gym → render z poprawną treścią (title, opis, galeria)
- [Unit] `serviceSlug` spoza dozwolonej listy (np. `'nieistniejacy-obszar'`) nadal zwraca `notFound()` - test regresji na niezmienionym gate
- [E2E] Otwórz `/mk-gym/realizacje/<slug-testowej-realizacji>` bezpośrednio → sprawdź że strona się renderuje, link powrotu prowadzi do `/mk-gym` (nie do strony głównej)

**Weryfikacja:**
- Testy integracyjne przechodzą; diff commitu nie obejmuje `NAV_LINKS` w tym pliku ani `NavRealizacjeDropdown.tsx`.

## Wpływ systemowy

- **Graf interakcji:** Nowa strona korzysta z istniejących server-side helperów (`getLocale`, `getDictionary`, `toSubpageLayoutProps`, `toRealizacjeProps`) bez modyfikacji ich logiki - ryzyko regresji na pozostałych podstronach ograniczone do zmian w `Portfolio.ts` (rozszerzenie enum) i `[serviceSlug]/realizacje/[slug]/page.tsx` (rozszerzenie gate'u).
- **Parytet surface API:** Trzy powierzchnie muszą pozostać spójne po zmianie: kolekcja `Portfolio` (filterOptions), trasa szczegółów realizacji (`PORTFOLIO_PAGES`) i sama strona `/mk-gym` - wszystkie trzy odwołują się do tego samego slug `mk-gym`, literówka w jednym miejscu cicho zepsuje flow (np. realizacja przypisana, ale strona szczegółów 404).
- **Pokrycie integracyjne:** Kluczowy scenariusz cross-layer to "realizacja utworzona w adminie z `servicePage=mk-gym` → widoczna na `/mk-gym` → klik w kafelek realizacji → poprawny render `/mk-gym/realizacje/[slug]`" - pokryty przez E2E w Unit 2 i Unit 3 łącznie.

## Ryzyka i zależności

- Największe ryzyko to przypadkowe dodanie `mk-gym` do współdzielonych, hardcoded list nawigacyjnych (`NAV_LINKS`, `NavRealizacjeDropdown.AREAS`, `HomeContent.AREA_DEFAULTS`) przy okazji "kopiuj-wklej" ze wzorca meble-premium - każdy unit jawnie zaznacza, których list NIE dotykać.
- Seed początkowego rekordu `ServicePage` wymaga jednorazowego uruchomienia skryptu na środowisku produkcyjnym po deployu (analogicznie do innych skryptów seedujących w repo) - bez tego `/mk-gym` renderuje się z `FALLBACK`, nie z prawdziwą (choćby placeholder) treścią CMS.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md](docs/dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md)
- Powiązany kod: `src/app/(frontend)/meble-premium/page.tsx`, `src/collections/ServicePage.ts`, `src/collections/Portfolio.ts`, `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`
- Powiązane rozwiązania: `docs/solutions/backend-issues/2026-07-23-payload-unmigrated-locale-fields-lose-data-on-save.md`, `docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md`
