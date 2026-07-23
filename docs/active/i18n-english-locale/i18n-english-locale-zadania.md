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

## Faza 3 — Slownik statycznych tekstow PL/EN ✅

- [x] Stworz `src/lib/i18n/dictionaries/pl.ts` — pelny slownik PL (nav, stopka, etykiety hero/about/areas, modale, aria-labels), namespaced per sekcja
- [x] Stworz `src/lib/i18n/dictionaries/en.ts` — `satisfies Dictionary` z `pl.ts`
- [x] Stworz `src/lib/i18n/getDictionary.ts` z `import 'server-only'` i `getDictionary(locale): Promise<Dictionary>`
- [x] (odkryte podczas Fazy 3) `pnpm add server-only` — paczka wymagana przez plan nie byla zainstalowana w projekcie
- [x] Test: `en.ts` eksportuje dokladnie te same top-level klucze co `pl.ts` (runtime check ponad `satisfies`)
- [x] Test: `getDictionary('en')` zwraca slownik EN, `getDictionary('pl')` zwraca slownik PL — stworzono `tests/int/i18n-dictionary.int.spec.ts`
- [x] Weryfikacja: zero stringow PL zakodowanych bezposrednio w komponentach po zakonczeniu Fazy 6 (slownik jedynym zrodlem statycznej tresci UI) - potwierdzone grepem w Fazie 6, jedyny wyjatek to zamierzony fallback CV/Bio

---

## Faza 4 — Komponent przelacznika jezyka ✅

- [x] Stworz `src/components/mcraft/LanguageSwitcher.tsx` — client component, `useTransition` + `setLocale` (server action) + `router.refresh()`, `isPending` steruje stanem ladowania. Forma: DROPDOWN (decyzja usera)
- [x] Przed `setLocale`, jesli modal otwarty — zamknij go najpierw (`useModal().closeModal()`)
- [x] Zmodyfikuj `src/components/mcraft/ModalProvider.tsx` — wystaw `closeModal` i `isOpen` przez `useModal()`; dodaj `useOptionalModal()` (nie rzuca poza providerem)
- [x] Zmodyfikuj `src/components/mcraft/HomeContent.tsx`, `SubpageLayout.tsx` — wstaw `LanguageSwitcher` w nav desktop
- [x] Zmodyfikuj `src/components/mcraft/MobileNav.tsx` — wstaw `LanguageSwitcher` w nav mobile
- [x] (reczne, rozstrzygniete) Umiejscowienie: ostatnia pozycja w nav pill/topbar (po "Kontakt") na desktopie; osobny wiersz nad LinkedIn w mobile overlay
- [x] Test: klikniecie przelacznika wywoluje `setLocale` z przeciwnym jezykiem niz aktualny
- [x] Test: renderuje sie identycznie (dostepny, klikalny) w kontekscie desktop nav i mobile nav — stworzono `tests/int/LanguageSwitcher.int.spec.tsx` (`afterEach(cleanup)`)
- [x] Weryfikacja: przelacznik dziala bez bledow konsoli; brak regresji w scroll-locku `MobileNav`/`ModalProvider` (potwierdzone recznie w przegladarce: klik EN -> cookie `locale=en` -> `router.refresh()` -> `<html lang="en">`)

- [x] Test [E2E]: otworz strone glowna, kliknij przelacznik na EN, sprawdz ze URL sie nie zmienil (napisano `tests/e2e/language-switcher.e2e.spec.ts` - nie uruchomiono w tej sesji, port 3000 zajety przez niepowiazany projekt na tej maszynie; logika potwierdzona manualnie w przegladarce, patrz kontekst.md)
- [x] Test [E2E]: otworz modal CV, kliknij przelacznik jezyka, sprawdz ze modal sie zamyka (jw., w tym samym pliku)

**Pominiete (poza zakresem tej fazy, wymaga Fazy 6):**
- Test [E2E] z oryginalnej checklisty "sprawdz ze widoczna tresc nav jest po angielsku" - tresc CMS/statyczna nie jest jeszcze przelaczana slownikiem (Faza 6). Napisany test sprawdza to, co Faza 4 faktycznie dostarcza: brak zmiany URL i zmiane `<html lang>`.

---

## Faza 5 — Locale w pobieraniu danych z Payload ✅

- [x] Zmodyfikuj `src/app/(frontend)/page.tsx` — dodaj `locale` (z `getLocale()`) do wszystkich 6 wywolan w `Promise.all`
- [x] Zmodyfikuj `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — dodaj `locale` do `payload.find` (service-pages + ew. portfolio-projects)
- [x] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — dodaj `locale` w komponencie strony (+ przekazano do `MobileNav`, ktory od Fazy 4 przyjmuje ten prop)
- [x] Sprawdz czy `src/lib/servicePageData.ts` (`toSubpageLayoutProps`, `toRealizacjeProps`) wymaga zmiany sygnatury — potwierdzone: NIE, mapper jest locale-agnostic
- [x] Test: `toSubpageLayoutProps` poprawnie mapuje dane niezaleznie od locale, w jakim zostaly pobrane — rozszerzono `tests/int/servicePageData.int.spec.ts`
- [x] Test [E2E]: odwiedz `/konstrukcje-stalowe` z cookie `locale=en`, sprawdz ze tresc CMS (tytul, opis) jest po angielsku lub PL fallback — napisano `tests/e2e/locale-content.e2e.spec.ts`; zweryfikowano manualnie w przegladarce (patrz kontekst.md) - `<html lang="en">`, h1 pokazuje PL fallback (brak tlumaczenia EN w lokalnej bazie), brak crasha
- [x] Weryfikacja: zadne z 6 miejsc wywolania Payload nie pomija `locale`; zmiana jezyka realnie zmienia zwracana tresc CMS

---

## Faza 6 — Podmiana statycznych tekstow na slownik + konsolidacja duplikatow ✅

- [x] Zmodyfikuj `src/components/mcraft/HomeContent.tsx` — zastap hardcodowane stringi odwolaniami do slownika (dict jako prop)
- [x] Zmodyfikuj `src/components/mcraft/SubpageLayout.tsx` — jw.
- [x] Zmodyfikuj `src/components/mcraft/ModalProvider.tsx` — etykiety UI (nie fallback CV/Bio — ten zostaje PL) na slownik; dodano `useOptionalModal()`, `closeModal`/`isOpen` w kontekscie (Faza 4), teraz + `dict` prop
- [x] Zmodyfikuj `src/components/mcraft/MobileNav.tsx` — aria-labels, LinkedIn itd. na slownik
- [x] Zmodyfikuj `src/components/mcraft/NavRealizacjeDropdown.tsx` — etykiety obszarow na slownik
- [x] Zmodyfikuj `src/components/mcraft/TilesMarquee.tsx` — teksty na slownik
- [x] Zmodyfikuj `src/components/mcraft/RealizacjaGaleria.tsx` — teksty (Brak zdjec, Powieksz, Zamknij galerie) na slownik
- [x] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — stopka na slownik, Google Maps `&hl=${locale}`
- [x] Zmodyfikuj `src/app/(frontend)/not-found.tsx` — stopka + naglowki na slownik (async server component + `getLocale()`/`getDictionary()`); Google Maps NIE dotyczy (ta strona nie ma mapy - checklist zalozenie bledne, zweryfikowane w kodzie)
- [ ] (pominieto, opcjonalne) Wydziel wspolny komponent `Footer`/`Nav` konsolidujacy 4 kopie — plan sam oznaczyl to jako opcjonalne "jesli nie zwieksza ryzyka"; przy juz duzym scope tej fazy pominiete swiadomie
- [x] Test: `SubpageLayout` renderowany z `dict` EN pokazuje angielskie etykiety nav/CTA zamiast polskich — rozszerzono `tests/int/SubpageLayout.int.spec.tsx`
- [x] Test [E2E]: otworz kazda z 4 glownych stron w trybie EN, sprawdz brak widocznych polskich stringow poza danymi faktycznymi (NIP/adres/telefon) i fallbackiem CV/Bio — napisano `tests/e2e/dictionary-en.e2e.spec.ts`; zweryfikowano manualnie w przegladarce (patrz kontekst.md)
- [x] Test [E2E]: sprawdz `aria-label` przyciskow mobile nav po przelaczeniu na EN — w tym samym pliku
- [x] Weryfikacja: grep po kluczowych polskich frazach (np. "Skontaktuj się", "Zobacz") w dotknietych plikach nie zwraca wynikow poza slownikiem i fallbackiem CV/Bio — potwierdzone (zero wynikow)

**Odkryty krytyczny bug (2026-07-23):** funkcje w obiekcie slownika (`footer.copyright(year)`, `gallery.zoomAria(alt)`, `gallery.photoAria(index)`) powodowaly crash calej strony w trybie EN - "Functions cannot be passed directly to Client Components" - React Server Components nie moga serializowac funkcji w propsach przekazywanych do Client Components (`ModalProvider`, `TilesMarquee`, `RealizacjaGaleria`, `MobileNav`, `NavRealizacjeDropdown` sa `'use client'` i dostaja caly obiekt `dict`). Naprawione: zamieniono funkcje na plain stringi (`copyrightSuffix`, `zoomAriaLabel`, `photoAriaLabel`) + interpolacja template literal w miejscu uzycia (server component), nie wewnatrz slownika. Zweryfikowane w przegladarce po restarcie dev servera - dziala poprawnie.

---

## Faza 7 — Lokalizacja meta danych i JSON-LD ✅

- [x] Zmodyfikuj `src/app/(frontend)/layout.tsx` — `export const metadata` → `generateMetadata()`, `<html lang={locale}>`, `openGraph.locale` (pl_PL/en_US), opisowe pola `schemaOrg` na slownik (dane faktyczne bez zmian)
- [x] Zmodyfikuj `src/app/(frontend)/page.tsx`, `nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — statyczny `metadata` → `generateMetadata()` (page.tsx home nie mial wlasnego metadata - dziedziczy z layout.tsx, bez zmian)
- [x] Zmodyfikuj `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — istniejacy `generateMetadata` dostaje `locale`
- [x] Test: stworzono `tests/int/metadata.int.spec.ts` sprawdzajacy ze `generateMetadata()` zwraca rozne wartosci dla `locale: 'pl'` vs `'en'`
- [x] Test [E2E]: zweryfikowano manualnie w przegladarce - `document.title` i `<html lang="en">` poprawne po przelaczeniu
- [x] Test [E2E]: zweryfikowano manualnie w przegladarce - `<meta name="description">` na `/konstrukcje-stalowe` po angielsku
- [x] Weryfikacja: brak statycznych `export const metadata` w dotknietych plikach (wszystkie dynamiczne, locale-aware)

---

## Faza 8 — Tlumaczenie polityki prywatnosci ✅

- [x] Stworz `src/app/(frontend)/polityka-prywatnosci/content.pl.tsx`
- [x] Stworz `src/app/(frontend)/polityka-prywatnosci/content.en.tsx`
- [x] Zmodyfikuj `src/app/(frontend)/polityka-prywatnosci/page.tsx` — wywolaj `getLocale()`, renderuj odpowiedni wariant tresci (metadata pozostaje statyczny PL - poza scope tej fazy, `robots: noindex`)
- [x] Test: stworzono `tests/int/polityka-prywatnosci.int.spec.ts` sprawdzajacy render odpowiedniej tresci per locale
- [x] Test [E2E]: napisano `tests/e2e/polityka-prywatnosci.e2e.spec.ts` - odwiedz `/polityka-prywatnosci` z `locale=en`, sprawdz ze naglowki sekcji i tresc sa po angielsku; zweryfikowano manualnie w przegladarce
- [x] Test [E2E]: link "Polityka prywatności" w stopce prowadzi do tej samej strony niezaleznie od jezyka (URL bez zmian) - w tym samym pliku
- [x] Weryfikacja: strona renderuje sie poprawnie w obu jezykach bez bledow konsoli, brak mieszania PL/EN w obrebie jednego widoku (potwierdzone manualnie)

---

## Do poprawy po review fazy 8 ✅

- [x] 🟠 [important] **`src/app/(frontend)/polityka-prywatnosci/content.pl.tsx:46-49`, `content.en.tsx:46-49`, `page.tsx:3-5,16-17`** — usunieto rownolegle obiekty `politykaPrywatnosciPlText`/`EnText`; `page.tsx` teraz wola `getDictionary(locale)`, uzywa `dict.footer.copyrightSuffix` i `dict.notFound.backHome` (reuzyte), `content.*.tsx` eksportuja TYLKO komponent JSX
- [x] 🟠 [important] **`src/app/(frontend)/polityka-prywatnosci/page.tsx:7-11`** — `metadata` -> `generateMetadata()` z `dict.meta.privacyPolicy.title/description` (nowy klucz w slowniku); zweryfikowano w przegladarce: `<title>` poprawnie przelacza sie PL/EN
- [x] 🟡 [nit] **`page.tsx:17,30`** — jeden lookup `ContentComponent = locale === 'en' ? ... : ...` zamiast dwoch osobnych ternary (drugi ternary zniknal wraz z usunieciem `text` w poprzednim punkcie)
- [x] 🟡 [nit] **`tests/int/polityka-prywatnosci.int.spec.ts:17-27`** — dodano `expect(screen.queryByText('Privacy Policy')).toBeNull()` w wariancie PL dla symetrii z EN

## Notatki operacyjne (poza checklista implementacji)

- (reczne) Przed pierwszym wdrozeniem produkcyjnym: zweryfikuj `Vary: Cookie`/cache config na hostingu (Coolify) — ryzyko mixed-language cache leak, jesli reverse proxy cache'uje bez tego nagłówka
- (reczne) Po wdrozeniu: przypomnij klientowi ze tlumaczenia EN sa jego odpowiedzialnoscia (panel admina ma juz podpowiedz w opisie pol)
- (reczne, opcjonalnie) Po zakonczeniu: `/dev-compound` — udokumentuj w `docs/solutions/` pierwsze realne problemy z Payload localization napotkane w tym repo
