# Angielska wersja jezykowa strony (i18n) — Checklist zadan

**Branch:** `feature/i18n-english-locale`
**Ostatnia aktualizacja:** 2026-07-21

---

## Faza 1 — Payload localization: config, flagi pol, migracja danych ✅

- [x] Dodaj `localization: { locales: [{code:'pl',label:'Polski'},{code:'en',label:'English'}], defaultLocale:'pl', fallback:true }` do `src/payload.config.ts`
- [x] Oznacz `localized: true` w `src/collections/ServicePage.ts`: `eyebrow`, `title`, `description`, `scopeItems[].text`, `scopeItems[].description`, `scopeItems[].modalDescription`, `audienceTitle`, `audienceItems[].text`, `additionalSections[].title`, `additionalSections[].items[].text`, `ctaHeader`, `thumbnailTitle`; dodaj `admin.description` hint o aktualizacji tlumaczenia
- [x] Oznacz `localized: true` w `src/collections/Portfolio.ts`: `title`, `description`, `images[].alt` — NIE `slug`
- [x] Oznacz `localized: true` w `src/globals/HeroSection.ts`: `subtitle`, `description`
- [x] Oznacz `localized: true` w `src/globals/AboutSection.ts`: `bioText`
- [x] Oznacz `localized: true` w `src/globals/CvModal.ts`: `experience[].description`, `experience[].company`, `qualifications[].description`, `education[].institution`, `education[].description`, `additionalQualifications[].description`, `skills`, `interests` — NIE pola `year`
- [x] Oznacz `localized: true` w `src/globals/BioModal.ts`: `sections[].title`, `sections[].content`
- [x] Oznacz `localized: true` w `src/collections/StatTile.ts`: `label`, `description` — NIE `number`
- [x] (odkryte podczas Fazy 1) Usun `required: true` ze wszystkich pol ktore stały się `localized: true` (ServicePage.title, scopeItems[].text, additionalSections[].title, richTextItemField.text, Portfolio.title, CvModal experience/qualifications/education/additionalQualifications[].description+institution, BioModal sections[].title+content, StatTile label+description) — Payload egzekwuje `required` osobno per locale, bez tego klient nie moze zapisac czesciowego tlumaczenia EN (patrz kontekst.md, Blokady)
- [x] Uruchom `pnpm generate:types` i sprawdz ze `src/payload-types.ts` sie zregenerowal bez recznych zmian
- [x] Napisz `scripts/migrate-localize-content.ts` — jednorazowy, idempotentny skrypt: per dokument w kazdej dotknietej kolekcji/globalu, odczytaj plaska wartosc, zapisz jako `locale: 'pl'`; jawny `process.exit(0)`/`process.exit(1)` (wzorzec: `docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md`); pure logika w `scripts/lib/localize-migration-helpers.ts` (testowalna bez efektow ubocznych importu)
- [x] (odkryte podczas Fazy 1) Napisz `scripts/backup-before-i18n-migration.ts` — dumpuje service-pages/portfolio-projects/stat-tiles/globals do JSON przed migracja (bezpieczenstwo produkcyjnego wdrozenia)
- [x] Uruchom skrypt migracyjny na lokalnej kopii bazy, zweryfikuj przez Local API ze `payload.find({ locale: 'pl' })` zwraca identyczna tresc jak przed migracja
- [x] Test: `payload.find({ collection: 'service-pages', locale: 'pl' })` po migracji zwraca identyczna tresc jak przed migracja
- [x] Test: `payload.find({ collection: 'service-pages', locale: 'en' })` na dokumencie bez tlumaczenia EN zwraca wartosc PL (automatyczny fallback)
- [x] Test: `payload.findGlobal({ slug: 'bio-modal', locale: 'en' })` z ustawionym `sections[].content` w EN zwraca tresc EN, nie PL
- [x] Test: skrypt migracyjny uruchomiony drugi raz nie duplikuje ani nie psuje danych (idempotencja) — rozszerzono `tests/int/api.int.spec.ts`
- [x] Weryfikacja: wszystkie kolekcje/globale maja poprawnie oznaczone pola; zadna produkcyjna tresc PL nie zniknela po migracji (potwierdzone zapytaniem do realnej bazy)

---

## Faza 2 — Rozpoznawanie i trwalosc jezyka (cookie) ✅

- [x] Stworz `src/lib/i18n/locale.ts` z `getLocale(): Promise<Locale>` — czyta cookie `locale`, waliduje przeciw `['pl','en']`, domyslnie `'pl'`
- [x] Stworz `src/lib/i18n/setLocale.ts` — `'use server'`, `setLocale(locale: Locale)` ustawiajacy cookie (`path:'/'`, `maxAge: 31536000`, `sameSite:'lax'`)
- [x] Zmodyfikuj `src/app/(frontend)/layout.tsx` — wywolaj `getLocale()`, uzyj do `<html lang={locale}>` (RootLayout jest teraz async server component)
- [x] Test: brak cookie → `getLocale()` zwraca `'pl'`
- [x] Test: cookie `'en'` → `getLocale()` zwraca `'en'`
- [x] Test: cookie z nieprawidlowa wartoscia (np. `'de'`, `''`) → `getLocale()` zwraca `'pl'`, nie rzuca wyjatkiem — stworzono `tests/int/locale.int.spec.ts`
- [x] Weryfikacja: `getLocale()` nigdy nie zwraca wartosci spoza `['pl','en']`; `setLocale` poprawnie ustawia cookie widoczne w kolejnym request

---

## Faza 3 — Slownik statycznych tekstow PL/EN

- [ ] Stworz `src/lib/i18n/dictionaries/pl.ts` — pelny slownik PL (nav, stopka, etykiety hero/about/areas, modale, aria-labels), namespaced per sekcja
- [ ] Stworz `src/lib/i18n/dictionaries/en.ts` — `satisfies Dictionary` z `pl.ts`
- [ ] Stworz `src/lib/i18n/getDictionary.ts` z `import 'server-only'` i `getDictionary(locale): Promise<Dictionary>`
- [ ] Test: `en.ts` eksportuje dokladnie te same top-level klucze co `pl.ts` (runtime check ponad `satisfies`)
- [ ] Test: `getDictionary('en')` zwraca slownik EN, `getDictionary('pl')` zwraca slownik PL — stworz `tests/int/i18n-dictionary.int.spec.ts`
- [ ] Weryfikacja: zero stringow PL zakodowanych bezposrednio w komponentach po zakonczeniu Fazy 6 (slownik jedynym zrodlem statycznej tresci UI)

---

## Faza 4 — Komponent przelacznika jezyka

- [ ] Stworz `src/components/mcraft/LanguageSwitcher.tsx` — client component, `useTransition` + `setLocale` (server action) + `router.refresh()`, `isPending` steruje stanem ladowania
- [ ] Przed `setLocale`, jesli modal otwarty — zamknij go najpierw (`useModal().closeModal()`)
- [ ] Zmodyfikuj `src/components/mcraft/ModalProvider.tsx` — wystaw `closeModal` przez `useModal()` do uzytku poza providerem, jesli jeszcze niedostepne
- [ ] Zmodyfikuj `src/components/mcraft/HomeContent.tsx`, `SubpageLayout.tsx` — wstaw `LanguageSwitcher` w nav desktop
- [ ] Zmodyfikuj `src/components/mcraft/MobileNav.tsx` — wstaw `LanguageSwitcher` w nav mobile
- [ ] (reczne) Zdecyduj dokladne umiejscowienie wizualne przelacznika w nav (przed/po linkach, dopasowanie do `bg-white/30 backdrop-blur-md` na desktopie) — decyzja odroczona z planu
- [ ] Test: klikniecie przelacznika wywoluje `setLocale` z przeciwnym jezykiem niz aktualny
- [ ] Test: renderuje sie identycznie (dostepny, klikalny) w kontekscie desktop nav i mobile nav — stworz `tests/int/LanguageSwitcher.int.spec.tsx` (pamietaj `afterEach(cleanup)`)
- [ ] Test [E2E]: otworz strone glowna, kliknij przelacznik na EN, sprawdz ze URL sie nie zmienil a widoczna tresc nav jest po angielsku
- [ ] Test [E2E]: otworz modal CV, kliknij przelacznik jezyka, sprawdz ze modal sie zamyka (nie zostaje otwarty z podmieniona trescia w tle)
- [ ] Weryfikacja: przelacznik dziala z kazdej z 4 stron serwisu bez bledow konsoli; brak regresji w scroll-locku `MobileNav`/`ModalProvider`

---

## Faza 5 — Locale w pobieraniu danych z Payload

- [ ] Zmodyfikuj `src/app/(frontend)/page.tsx` — dodaj `locale` (z `getLocale()`) do wszystkich 6 wywolan w `Promise.all`
- [ ] Zmodyfikuj `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — dodaj `locale` do `payload.find` (service-pages + ew. portfolio-projects)
- [ ] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — dodaj `locale` w komponencie strony
- [ ] Sprawdz czy `src/lib/servicePageData.ts` (`toSubpageLayoutProps`, `toRealizacjeProps`) wymaga zmiany sygnatury (prawdopodobnie nie — locale juz "wpieczony" w dane wejsciowe)
- [ ] Test: `toSubpageLayoutProps` poprawnie mapuje dane niezaleznie od locale, w jakim zostaly pobrane — rozszerz `tests/int/servicePageData.int.spec.ts`
- [ ] Test [E2E]: odwiedz `/konstrukcje-stalowe` z cookie `locale=en`, sprawdz ze tresc CMS (tytul, opis, zakres uslug) jest po angielsku lub PL fallback
- [ ] Weryfikacja: zadne z 6 miejsc wywolania Payload nie pomija `locale`; zmiana jezyka realnie zmienia zwracana tresc CMS

---

## Faza 6 — Podmiana statycznych tekstow na slownik + konsolidacja duplikatow

- [ ] Zmodyfikuj `src/components/mcraft/HomeContent.tsx` — zastap hardcodowane stringi odwolaniami do slownika (dict jako prop)
- [ ] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx` — jw.
- [ ] Zmodyfikuj `src/components/mcraft/ModalProvider.tsx` — etykiety UI (nie fallback CV/Bio — ten zostaje PL) na slownik
- [ ] Zmodyfikuj `src/components/mcraft/MobileNav.tsx` — aria-labels, LinkedIn itd. na slownik
- [ ] Zmodyfikuj `src/components/mcraft/NavRealizacjeDropdown.tsx` — etykiety obszarow na slownik
- [ ] Zmodyfikuj `src/components/mcraft/TilesMarquee.tsx` — teksty na slownik
- [ ] Zmodyfikuj `src/components/mcraft/RealizacjaGaleria.tsx` — teksty (Brak zdjec, Powieksz, Zamknij galerie) na slownik
- [ ] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — stopka na slownik, Google Maps `&hl=${locale}`
- [ ] Zmodyfikuj `src/app/(frontend)/not-found.tsx` — stopka na slownik, Google Maps `&hl=${locale}`
- [ ] (opcjonalnie, jesli nie zwieksza istotnie ryzyka) Wydziel wspolny komponent `Footer`/`Nav` konsolidujacy 4 kopie
- [ ] Test: `SubpageLayout` renderowany z `dict` EN pokazuje angielskie etykiety nav/CTA zamiast polskich — rozszerz `tests/int/SubpageLayout.int.spec.tsx`
- [ ] Test [E2E]: otworz kazda z 4 glownych stron w trybie EN, sprawdz brak widocznych polskich stringow poza danymi faktycznymi (NIP/adres/telefon) i fallbackiem CV/Bio
- [ ] Test [E2E]: sprawdz `aria-label` przyciskow mobile nav po przelaczeniu na EN
- [ ] Weryfikacja: grep po kluczowych polskich frazach (np. "Skontaktuj się", "Zobacz") w dotknietych plikach nie zwraca wynikow poza slownikiem i fallbackiem CV/Bio

---

## Faza 7 — Lokalizacja meta danych i JSON-LD

- [ ] Zmodyfikuj `src/app/(frontend)/layout.tsx` — `export const metadata` → `generateMetadata()`, `<html lang={locale}>`, `openGraph.locale`, opisowe pola `schemaOrg` na slownik (dane faktyczne bez zmian)
- [ ] Zmodyfikuj `src/app/(frontend)/page.tsx`, `nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — statyczny `metadata` → `generateMetadata()`
- [ ] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — istniejacy `generateMetadata` dostaje `locale`
- [ ] Test: stworz `tests/int/metadata.int.spec.ts` sprawdzajacy ze `generateMetadata()` zwraca rozne wartosci dla `locale: 'pl'` vs `'en'`
- [ ] Test [E2E]: odwiedz strone glowna z `locale=en`, sprawdz `document.title` i `<html lang="en">`
- [ ] Test [E2E]: odwiedz podstrone uslugowa z `locale=en`, sprawdz ze `<meta name="description">` jest po angielsku
- [ ] Weryfikacja: brak statycznych `export const metadata` w dotknietych plikach (wszystkie dynamiczne, locale-aware)

---

## Faza 8 — Tlumaczenie polityki prywatnosci

- [ ] Stworz `src/app/(frontend)/polityka-prywatnosci/content.pl.tsx`
- [ ] Stworz `src/app/(frontend)/polityka-prywatnosci/content.en.tsx`
- [ ] Zmodyfikuj `src/app/(frontend)/polityka-prywatnosci/page.tsx` — wywolaj `getLocale()`, renderuj odpowiedni wariant tresci
- [ ] Test: stworz `tests/int/polityka-prywatnosci.int.spec.ts` sprawdzajacy render odpowiedniej tresci per locale
- [ ] Test [E2E]: odwiedz `/polityka-prywatnosci` z `locale=en`, sprawdz ze naglowki sekcji i tresc sa po angielsku
- [ ] Test [E2E]: link "Polityka prywatności" w stopce prowadzi do tej samej strony niezaleznie od jezyka (URL bez zmian)
- [ ] Weryfikacja: strona renderuje sie poprawnie w obu jezykach bez bledow konsoli, brak mieszania PL/EN w obrebie jednego widoku

---

## Notatki operacyjne (poza checklista implementacji)

- (reczne) Przed pierwszym wdrozeniem produkcyjnym: zweryfikuj `Vary: Cookie`/cache config na hostingu (Coolify) — ryzyko mixed-language cache leak, jesli reverse proxy cache'uje bez tego nagłówka
- (reczne) Po wdrozeniu: przypomnij klientowi ze tlumaczenia EN sa jego odpowiedzialnoscia (panel admina ma juz podpowiedz w opisie pol)
- (reczne, opcjonalnie) Po zakonczeniu: `/dev-compound` — udokumentuj w `docs/solutions/` pierwsze realne problemy z Payload localization napotkane w tym repo
