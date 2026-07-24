# Ukryta podstrona MK Gym (/mk-gym) — Checklist zadań

**Branch:** `feature/mk-gym-strona`
**Ostatnia aktualizacja:** 2026-07-24

---

## Faza 1 — Kolekcje Payload + seed początkowego rekordu MK Gym

- [ ] Zmodyfikuj `src/collections/Portfolio.ts`: dodaj `'mk-gym'` do `filterOptions.slug.in` (linia ~46)
- [ ] Zmodyfikuj `src/collections/Portfolio.ts`: zaktualizuj `labels.plural` na "Realizacje (Meble, Konstrukcje i MK Gym)"
- [ ] Stwórz `scripts/seed-mk-gym.ts`: skrypt Local API tworzący jeden dokument `ServicePage` (slug `mk-gym`, placeholder `eyebrow`/`title`/`description` PL+EN), sprawdzający najpierw czy rekord już istnieje (idempotencja), kończący się `process.exit(0)` / `process.exit(1)` w catch (wzorzec: `scripts/seed-tiles.ts`, `scripts/seed-cv.ts`)
- [ ] Test: `tests/int/mk-gym-collections.int.spec.ts` — utworzenie `Portfolio` z `servicePage` wskazującym na dokument o slug `mk-gym` przechodzi walidację `filterOptions`
- [ ] Test: `tests/int/mk-gym-collections.int.spec.ts` — uruchomienie skryptu seedującego dwukrotnie tworzy dokładnie jeden dokument `ServicePage` ze slug `mk-gym` (idempotencja)
- [ ] Test: `tests/int/mk-gym-collections.int.spec.ts` — dokument `ServicePage` ze slug `mk-gym` ma niepuste pole `title` w obu locale (`pl`, `en`) po seedzie
- [ ] Weryfikacja: zapytanie `payload.find({ collection: 'service-pages', where: { slug: { equals: 'mk-gym' } } })` zwraca dokładnie jeden dokument
- [ ] (ręczne) Uruchom `scripts/seed-mk-gym.ts` na środowisku produkcyjnym po deployu

---

## Faza 2 — Strona /mk-gym (mirror meble-premium)

- [ ] Stwórz `src/app/(frontend)/mk-gym/page.tsx`: kopia struktury `meble-premium/page.tsx` (`force-dynamic`, `getLocale()` + `getDictionary()`, `payload.find` po slug `mk-gym`, `toSubpageLayoutProps` + `toRealizacjeProps(portfolioDocs, 'mk-gym')`, własny `FALLBACK`, canonical URL `https://mcraft.com.pl/mk-gym`)
- [ ] Zmodyfikuj `src/lib/i18n/dictionaries/pl.ts`: dodaj `meta.mkGym: { title, description, ogTitle, ogDescription }`
- [ ] Zmodyfikuj `src/lib/i18n/dictionaries/en.ts`: dodaj analogiczną sekcję `meta.mkGym` z angielskim tłumaczeniem
- [ ] Test: `tests/int/metadata.int.spec.ts` — dodaj case: `generateMetadata` dla `/mk-gym` zwraca różny `title` dla `pl` i `en` (wzorzec: case `nadzor-spawalniczy`)
- [ ] Test: `tests/int/metadata.int.spec.ts` lub równoważny — strona renderuje `FALLBACK` gdy `ServicePage` ze slug `mk-gym` nie istnieje
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym` bezpośrednio, sprawdź że hero/zakres/sekcje/CTA renderują się poprawnie zgodnie z danymi z seeda
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/`, sprawdź że sekcja "Obszary działalności" pokazuje dokładnie 3 kafelki (bez MK Gym) i dropdown realizacji nie zawiera linku do `/mk-gym`
- [ ] Weryfikacja: grep po `mk-gym` w `src/components/mcraft/` i `src/app/(frontend)/page.tsx` nie zwraca nowych wystąpień poza samą stroną `/mk-gym`

---

## Faza 3 — Szczegóły realizacji dla MK Gym (/mk-gym/realizacje/[slug])

- [ ] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`: dodaj `'mk-gym'` do `PORTFOLIO_PAGES` (linia 16) — NIE modyfikuj `NAV_LINKS` (linie 61-73)
- [ ] Test: `tests/int/realizacja-page.int.spec.ts` — `serviceSlug='mk-gym'` z istniejącym slug realizacji przypisanej do obszaru mk-gym renderuje poprawną treść (title, opis, galeria)
- [ ] Test: `tests/int/realizacja-page.int.spec.ts` — `serviceSlug` spoza dozwolonej listy (np. `'nieistniejacy-obszar'`) nadal zwraca `notFound()` (regresja)
- [ ] Test (e2e): `tests/e2e/mk-gym.e2e.spec.ts` — otwórz `/mk-gym/realizacje/<slug-testowej-realizacji>` bezpośrednio, sprawdź że strona się renderuje, link powrotu prowadzi do `/mk-gym`
- [ ] Weryfikacja: diff commitu nie obejmuje `NAV_LINKS` w tym pliku ani `src/components/mcraft/NavRealizacjeDropdown.tsx`
