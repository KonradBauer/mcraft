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

## Faza 2 — Strona /mk-gym (mirror meble-premium)

- [ ] Stwórz `src/app/(frontend)/mk-gym/page.tsx`: kopia struktury `meble-premium/page.tsx` (`force-dynamic`, `getLocale()` + `getDictionary()`, `payload.find` po slug `mk-gym`, `toSubpageLayoutProps` + `toRealizacjeProps(portfolioDocs, 'mk-gym')`, własny `FALLBACK`, canonical URL `https://mcraft.com.pl/mk-gym`)
- [ ] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx`: dodaj opcjonalne propy `logoImageUrl?: string | null`, `logoHref?: string` (domyślnie `'/'`), `navOverride?: { href: string; label: string } | null` do `SubpageLayoutProps`
- [ ] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx`: w topbarze — gdy `logoImageUrl` podany, renderuj `<img src={logoImageUrl} alt="MK Gym" />` zamiast napisu "MCRAFT"; link logo prowadzi na `logoHref` (zamiast hardcoded `/`)
- [ ] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx`: gdy `navOverride` podany, zastąp CAŁĄ standardową nawigację (`#about`, `#areas`, `NavRealizacjeDropdown`, `#contact`) pojedynczym linkiem `<a href={navOverride.href}>{navOverride.label}</a>` — zarówno w desktopowym rzędzie linków, jak i w tablicy `SUBPAGE_NAV_LINKS` przekazywanej do `MobileNav`. `LanguageSwitcher`/`MobileLanguageToggle` (translacja) POZOSTAJE widoczny niezależnie od `navOverride`. Brak propa → zachowanie identyczne jak dziś (regresja na pozostałych podstronach)
- [ ] Zmodyfikuj `src/lib/i18n/dictionaries/pl.ts`: dodaj `mkGym.backToMcraft: "Powrót na mcraft.com.pl"`
- [ ] Zmodyfikuj `src/lib/i18n/dictionaries/en.ts`: dodaj `mkGym.backToMcraft` z angielskim tłumaczeniem
- [ ] Zmodyfikuj `src/app/(frontend)/mk-gym/page.tsx`: przekaż do `SubpageLayout` — `logoImageUrl="/mk-gym-logo.png"`, `logoHref="https://mcraft.com.pl"`, `navOverride={{ href: 'https://mcraft.com.pl', label: dict.mkGym.backToMcraft }}`
- [ ] Zmodyfikuj `src/lib/i18n/dictionaries/pl.ts`: dodaj `meta.mkGym: { title, description, ogTitle, ogDescription }`
- [ ] Zmodyfikuj `src/lib/i18n/dictionaries/en.ts`: dodaj analogiczną sekcję `meta.mkGym` z angielskim tłumaczeniem
- [ ] Test: `tests/int/metadata.int.spec.ts` — dodaj case: `generateMetadata` dla `/mk-gym` zwraca różny `title` dla `pl` i `en` (wzorzec: case `nadzor-spawalniczy`)
- [ ] Test: `tests/int/metadata.int.spec.ts` lub równoważny — strona renderuje `FALLBACK` gdy `ServicePage` ze slug `mk-gym` nie istnieje
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym` bezpośrednio, sprawdź że hero/zakres/sekcje/CTA renderują się poprawnie zgodnie z danymi z seeda
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym`, sprawdź że w topbarze renderuje się `<img>` z `/mk-gym-logo.png` zamiast napisu "MCRAFT"
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym`, sprawdź że topbar NIE zawiera linków `#about`/`#areas`/dropdownu realizacji/`#contact`, zawiera link powrotu na `https://mcraft.com.pl` (desktop) oraz language switcher (PL/EN) nadal działa
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — klik w logo na `/mk-gym` prowadzi na `https://mcraft.com.pl`
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym` w widoku mobilnym, otwórz menu, sprawdź że zawiera tylko link powrotu (bez pozostałych pozycji) i language toggle
- [ ] Test (e2e): `tests/e2e/frontend.e2e.spec.ts` (istniejący) lub nowy — otwórz `/meble-premium` (lub inną istniejącą podstronę), sprawdź że topbar nadal pokazuje napis "MCRAFT", standardową nawigację i klik w logo prowadzi na `/` (regresja na `SubpageLayout`)
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/`, sprawdź że sekcja "Obszary działalności" pokazuje dokładnie 3 kafelki (bez MK Gym) i dropdown realizacji nie zawiera linku do `/mk-gym`
- [ ] Weryfikacja: grep po `mk-gym` w `src/components/mcraft/` i `src/app/(frontend)/page.tsx` nie zwraca nowych wystąpień poza samą stroną `/mk-gym`

---

## Faza 3 — Szczegóły realizacji dla MK Gym (/mk-gym/realizacje/[slug])

- [ ] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`: dodaj `'mk-gym'` do `PORTFOLIO_PAGES` (linia 16) — NIE modyfikuj `NAV_LINKS` (linie 61-73)
- [ ] Test: `tests/int/realizacja-page.int.spec.ts` — `serviceSlug='mk-gym'` z istniejącym slug realizacji przypisanej do obszaru mk-gym renderuje poprawną treść (title, opis, galeria)
- [ ] Test: `tests/int/realizacja-page.int.spec.ts` — `serviceSlug` spoza dozwolonej listy (np. `'nieistniejacy-obszar'`) nadal zwraca `notFound()` (regresja)
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym/realizacje/<slug-testowej-realizacji>` bezpośrednio, sprawdź że strona się renderuje, link powrotu prowadzi do `/mk-gym`
- [ ] Weryfikacja: diff commitu nie obejmuje `NAV_LINKS` w tym pliku ani `src/components/mcraft/NavRealizacjeDropdown.tsx`
