# Ukryta podstrona MK Gym (/mk-gym) — Checklist zadań

**Branch:** `feature/mk-gym-strona`
**Ostatnia aktualizacja:** 2026-07-24

---

## Faza 1 — Kolekcje Payload + seed początkowego rekordu MK Gym ✅

- [x] Zmodyfikuj `src/collections/Portfolio.ts`: dodaj `'mk-gym'` do `filterOptions.slug.in` (linia ~46)
- [x] Zmodyfikuj `src/collections/Portfolio.ts`: zaktualizuj `labels.plural` na "Realizacje (Meble, Konstrukcje i MK Gym)"
- [x] Zmodyfikuj `src/app/api/seed/route.ts`: dodaj wpis `{ slug: 'mk-gym', title: 'MK Gym', eyebrow: 'Obszar działalności', thumbnailTitle: 'MK Gym', scopeItems: [] }` do tablicy `PAGES` *(odkryte podczas Fazy 1: istnieje już ustalony mechanizm seedowania `ServicePage` przez ten endpoint — GET tworzy/aktualizuje idempotentnie, DELETE usuwa rekordy spoza `PAGES` — nie tworzymy osobnego skryptu `scripts/seed-mk-gym.ts`, żeby nie duplikować logiki i nie zostawiać `mk-gym` poza allowlistą DELETE)*
- [x] Test: `tests/int/mk-gym-collections.int.spec.ts` — utworzenie `Portfolio` z `servicePage` wskazującym na dokument o slug `mk-gym` przechodzi walidację `filterOptions`
- [x] Test: `tests/int/mk-gym-collections.int.spec.ts` — dwukrotne wywołanie `GET` z `src/app/api/seed/route.ts` tworzy dokładnie jeden dokument `ServicePage` ze slug `mk-gym` (idempotencja: pierwsze wywołanie `status: 'created'`, drugie `status: 'updated'`)
- [x] Test: `tests/int/mk-gym-collections.int.spec.ts` — dokument `ServicePage` ze slug `mk-gym` ma niepuste pole `title` w locale `pl` po seedzie
- [x] Test (odkryte podczas Fazy 1): `tests/int/mk-gym-collections.int.spec.ts` — Portfolio ze `servicePage` wskazującym na obszar spoza allowlisty nadal jest odrzucane (regresja na `filterOptions`)
- [ ] Weryfikacja: zapytanie `payload.find({ collection: 'service-pages', where: { slug: { equals: 'mk-gym' } } })` zwraca dokładnie jeden dokument
- [ ] (ręczne) Wywołaj `GET /api/seed` na środowisku produkcyjnym po deployu

---

## Faza 2 — Strona /mk-gym (mirror meble-premium) ✅

- [x] Stwórz `src/app/(frontend)/mk-gym/page.tsx`: kopia struktury `meble-premium/page.tsx` (`force-dynamic`, `getLocale()` + `getDictionary()`, `payload.find` po slug `mk-gym`, `toSubpageLayoutProps` + `toRealizacjeProps(portfolioDocs, 'mk-gym')`, własny `FALLBACK`, canonical URL `https://mcraft.com.pl/mk-gym`)
- [x] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx`: dodaj opcjonalne propy `logoImageUrl?: string | null`, `logoHref?: string` (domyślnie `'/'`), `navOverride?: { href: string; label: string } | null` do `SubpageLayoutProps`
- [x] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx`: w topbarze — gdy `logoImageUrl` podany, renderuj `<img src={logoImageUrl} alt="MK Gym" />` zamiast napisu "MCRAFT"; link logo prowadzi na `logoHref` (zamiast hardcoded `/`) *(zwykły `<img>`, nie `next/image` — next/image wymagałby konfiguracji `images.localPatterns` w Next 16 dla lokalnego pliku spoza CMS; próbowano next/image, spowodowało runtime 500 na `/mk-gym`, wycofano — zob. Blokady/decyzje niżej)*
- [x] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx`: gdy `navOverride` podany, zastąp CAŁĄ standardową nawigację (`#about`, `#areas`, `NavRealizacjeDropdown`, `#contact`) pojedynczym linkiem — zarówno w desktopowym rzędzie linków, jak i w tablicy `SUBPAGE_NAV_LINKS` przekazywanej do `MobileNav`. `LanguageSwitcher`/`MobileLanguageToggle` (translacja) POZOSTAJE widoczny niezależnie od `navOverride`. Brak propa → zachowanie identyczne jak dziś (regresja na pozostałych podstronach)
- [x] Zmodyfikuj `src/lib/i18n/dictionaries/pl.ts`: dodaj `mkGym.backToMcraft: "Powrót na mcraft.com.pl"`
- [x] Zmodyfikuj `src/lib/i18n/dictionaries/en.ts`: dodaj `mkGym.backToMcraft` z angielskim tłumaczeniem
- [x] Zmodyfikuj `src/app/(frontend)/mk-gym/page.tsx`: przekaż do `SubpageLayout` — `logoImageUrl="/mk-gym-logo.png"`, `logoHref="https://mcraft.com.pl"`, `navOverride={{ href: 'https://mcraft.com.pl', label: dict.mkGym.backToMcraft }}`
- [x] Zmodyfikuj `src/lib/i18n/dictionaries/pl.ts`: dodaj `meta.mkGym: { title, description, ogTitle, ogDescription }`
- [x] Zmodyfikuj `src/lib/i18n/dictionaries/en.ts`: dodaj analogiczną sekcję `meta.mkGym` z angielskim tłumaczeniem
- [x] Test: `tests/int/metadata.int.spec.ts` — dodaj case: `generateMetadata` dla `/mk-gym` *(dostosowane: `title` to marka "MK Gym", identyczna w obu locale celowo — asercja na `description`, która faktycznie różni się pl/en, plus `alternates.canonical`)*
- [x] Test (odkryte): pokrycie "FALLBACK gdy ServicePage nie istnieje" już istnieje ogólnie w `tests/int/servicePageData.int.spec.ts` (`toSubpageLayoutProps` jest slug-agnostyczne) — nowy duplikat pominięty świadomie
- [x] Test (unit, dodane zamiast części E2E): `tests/int/SubpageLayout.int.spec.tsx` — 4 nowe testy: domyślny wordmark+nav, logo zamiast wordmarku, `logoHref` domyślny/`/` vs custom, `navOverride` zastępuje nav i zachowuje language switcher
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym` bezpośrednio, sprawdź że hero/zakres renderują się poprawnie zgodnie z danymi z seeda
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym`, sprawdź że w topbarze renderuje się `<img>` z alt "MK Gym" zamiast napisu "MCRAFT"
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym`, sprawdź że topbar NIE zawiera linków `#about`/`#areas`/dropdownu realizacji/`#contact`, zawiera link powrotu na `https://mcraft.com.pl` (desktop) oraz language switcher (PL/EN) nadal widoczny
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — logo na `/mk-gym` ma `href="https://mcraft.com.pl"` (asercja atrybutu, bez realnego kliku na zewnętrzną domenę)
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym` w widoku mobilnym, otwórz menu, sprawdź że zawiera tylko link powrotu (bez pozostałych pozycji) i language toggle
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — regresja: `/meble-premium` nadal pokazuje napis "MCRAFT", standardową nawigację i klik w logo prowadzi na `/`
- [x] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/`, sprawdź że sekcja "Obszary działalności" pokazuje dokładnie 3 kafelki (bez MK Gym) i brak linku `mk-gym` gdziekolwiek na stronie
- [ ] Weryfikacja: grep po `mk-gym` w `src/components/mcraft/` i `src/app/(frontend)/page.tsx` nie zwraca nowych wystąpień poza samą stroną `/mk-gym`

---

## Faza 3 — Szczegóły realizacji dla MK Gym (/mk-gym/realizacje/[slug])

- [ ] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`: dodaj `'mk-gym'` do `PORTFOLIO_PAGES` (linia 16) — NIE modyfikuj `NAV_LINKS` (linie 61-73)
- [ ] Test: `tests/int/realizacja-page.int.spec.ts` — `serviceSlug='mk-gym'` z istniejącym slug realizacji przypisanej do obszaru mk-gym renderuje poprawną treść (title, opis, galeria)
- [ ] Test: `tests/int/realizacja-page.int.spec.ts` — `serviceSlug` spoza dozwolonej listy (np. `'nieistniejacy-obszar'`) nadal zwraca `notFound()` (regresja)
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym/realizacje/<slug-testowej-realizacji>` bezpośrednio, sprawdź że strona się renderuje, link powrotu prowadzi do `/mk-gym`
- [ ] Weryfikacja: diff commitu nie obejmuje `NAV_LINKS` w tym pliku ani `src/components/mcraft/NavRealizacjeDropdown.tsx`
