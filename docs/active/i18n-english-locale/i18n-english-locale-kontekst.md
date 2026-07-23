# Angielska wersja jezykowa strony (i18n) — Kontekst

**Branch:** `feature/i18n-english-locale`
**Ostatnia aktualizacja:** 2026-07-23 (Faza 6)

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

## Faza 1 — wykonanie (2026-07-23)

Ukonczona. Przelacznik jezyka (Faza 4) bedzie w formie dropdown w nawigacji (decyzja usera, nadpisuje "reczne" placeholder z checklisty).

### Blokady (rozwiazane)

**Payload `required: true` + `localized: true` blokuje stopniowe tlumaczenie EN.**
Payload egzekwuje `required` osobno per locale. Eksperyment: probe zapisania SAMEGO `title` w locale `en` (bez dotykania innych pol) konczyla sie bledem walidacji o brakujacych tlumaczeniach INNYCH wymaganych, zlokalizowanych pol tego samego dokumentu (np. `scopeItems[].text`, `StatTile.label`/`description`) - mimo ze w ogole nie byly edytowane w tym zapisie. To udokumentowane zachowanie Payloada (required = wymagane w KAZDYM zapisywanym locale), nie blad implementacji.
Konflikt z R4/decyzja planu "klient uzupelnia tlumaczenia stopniowo" - klient nie mogby zapisac zadnej czesciowej wersji EN bez przetlumaczenia od razu WSZYSTKICH wymaganych pol dokumentu.
**Rozwiazanie (potwierdzone przez usera):** usunieto `required: true` ze wszystkich pol, ktore staly sie `localized: true` (patrz checklist Fazy 1). Walidacja obecnosci danych w PL pozostaje odpowiedzialnoscia warstwy frontu (mappery w `servicePageData.ts` i komponenty filtruja/fallbackuja brakujace wartosci), nie Payload schema.

### Odkryty gotcha: array items bez `id` przy zapisie innego locale

Gdy pole-tablica (np. `BioModal.sections`) NIE jest samo w sobie `localized`, tylko jego pola-liscie (`title`, `content`) sa - zapisanie nowego arraya BEZ `id` istniejacego elementu tworzy NOWY element (traci wartosci innych locale dla tego "miejsca"). Kazda aktualizacja elementu array w innym locale MUSI przekazac `id` istniejacego elementu, inaczej dane z poprzednich locale dla tego elementu znikaja. Real admin UI nie ma tego problemu (edytuje ten sam zaladowany dokument/formularz), ale dotyczy to skryptow/testow uzywajacych Local API bezposrednio.

### Konsekwencja typow (naprawiona w tej samej fazie, minimalny zakres)

Usuniecie `required: true` zmienilo generowane typy z `string` na `string | null | undefined`, co zepsulo typecheck w `src/lib/servicePageData.ts`, `src/components/mcraft/ModalProvider.tsx` i `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`. Naprawiono minimalnie (filtrowanie niekompletnych wpisow / `?? ''` fallback), BEZ wchodzenia w zakres Fazy 6 (podmiana na slownik).

## Faza 2 — wykonanie (2026-07-23)

Ukonczona. `src/lib/i18n/locale.ts` (`getLocale`, `Locale` type, `LOCALE_COOKIE_NAME`), `src/lib/i18n/setLocale.ts` (server action), `layout.tsx` uzywa `getLocale()` do `<html lang>`.

**Odchylenie od checklisty:** checklist mowil "przekaz locale w dol jako prop" z RootLayout do dzieci - technicznie niewykonalne w App Router (RootLayout nie kontroluje wewnetrznej struktury `children`, ktora jest juz zbudowanym drzewem strony dostarczonym przez routing Next.js; nie da sie doinjectowac propsa bez `cloneElement`, co byloby nieidiomatyczne i kruche). Rzeczywisty wzorzec przekazywania `locale`/`dict` w dol to kazdy `page.tsx` woła `getLocale()` niezaleznie i przekazuje w dol do wlasnych komponentow - to juz zaplanowane wprost w Fazie 5 (Unit 5 planu technicznego). RootLayout w tej fazie dostarcza tylko `<html lang>`.

**Test next/headers w Vitest:** `cookies()` z `next/headers` wymaga kontekstu requestu Next.js i rzuca poza nim - `tests/int/locale.int.spec.ts` mockuje caly modul `next/headers` (`vi.mock`) i dynamicznie importuje `getLocale` per test, zeby uniknac tego problemu. Wzorzec do powielenia w Fazie 7 (metadata) jesli tam tez potrzebny bedzie test dotykajacy `cookies()`.

Build (`pnpm run build`) przeszedl czysto po zmianie RootLayout na async server component.

## Faza 3 — wykonanie (2026-07-23)

Ukonczona. `src/lib/i18n/dictionaries/pl.ts` (`Dictionary` typ), `dictionaries/en.ts` (`satisfies Dictionary`), `src/lib/i18n/getDictionary.ts`.

**Odkryta zaleznosc:** `server-only` (paczka Vercela wymagana przez plan - `import 'server-only'` w `getDictionary.ts`) nie byla zainstalowana w projekcie (`pnpm add server-only`, wersja 0.0.1, zero zaleznosci). Bez niej import w ogole by sie nie zresolvowal.

**Wazny detal implementacyjny:** `pl.ts` NIE uzywa `as const` - to celowe. Gdyby uzyc `as const`, `type Dictionary = typeof pl` zwezalby kazdy string do jego DOKLADNEJ literalnej wartosci, a wtedy `en.ts satisfies Dictionary` wymuszalby identyczne stringi PL w en.ts (kompilacja by sie nie powiodla przy jakiejkolwiek realnej translacji). Bez `as const` TypeScript naturalnie szerzy typy stringow do `string`, co pozwala `en.ts` miec zupelnie inna tresc przy zachowaniu identycznego ksztaltu kluczy.

**`server-only` w testach:** paczka `server-only` rzuca wyjatkiem zawsze poza kontekstem RSC Next.js (warunek `exports["react-server"]` nie jest ustawiony w plain Node/Vitest) - `tests/int/i18n-dictionary.int.spec.ts` mockuje cala paczke (`vi.mock('server-only', () => ({}))`) zeby zaimportowac `getDictionary`.

Slownik pokrywa wszystkie statyczne stringi UI znalezione w: `HomeContent.tsx`, `SubpageLayout.tsx`, `MobileNav.tsx`, `NavRealizacjeDropdown.tsx`, `TilesMarquee.tsx`, `RealizacjaGaleria.tsx`, `ModalProvider.tsx` (etykiety UI, NIE hardcodowany fallback CV/Bio - ten zostaje PL na zawsze, zgodnie z decyzja planu), `[serviceSlug]/realizacje/[slug]/page.tsx`, `not-found.tsx`. Nazwy obszarow dzialalnosci (`areas.names.*`) trzymane jako pojedyncza linia tekstu (bez recznego `\n`) - podzial na dwie linie wukladzie kafelka homepage to decyzja wizualna Fazy 6, nie danych slownika.

## Faza 4 — wykonanie (2026-07-23)

Ukonczona. `src/components/mcraft/LanguageSwitcher.tsx` (dropdown, click-based nie hover-based - musi dzialac na dotyku w MobileNav), wpieto w `HomeContent.tsx`/`SubpageLayout.tsx` (desktop nav, po "Kontakt") i `MobileNav.tsx` (osobny wiersz nad LinkedIn).

**Kluczowa poprawka projektowa:** `ModalProvider` dostal `useOptionalModal()` obok istniejacego `useModal()`. Powod: `MobileNav` (ktory teraz zawsze renderuje `LanguageSwitcher`) jest uzywany takze na `[serviceSlug]/realizacje/[slug]/page.tsx`, ktora NIE ma `<ModalProvider>` w drzewie (ta strona nie jest w scope Fazy 4 do modyfikacji). `useModal()` rzucalby wyjatkiem przy kazdym renderze tej strony. `useOptionalModal()` zwraca `null` zamiast rzucac, `LanguageSwitcher` uzywa `modal?.isOpen`/`modal?.closeModal()` bezpiecznie.

**Locale jako prop, nie z `getLocale()` bezposrednio:** `HomeContentProps`/`SubpageLayoutProps`/`MobileNavProps` dostaly opcjonalny `locale?: Locale` (default `'pl'`) zamiast wymagac go od razu - unika zlamania typow w `page.tsx` plikach, ktore jeszcze nie wolaja `getLocale()` (to Faza 5). Po Fazie 5 realna wartosc bedzie zawsze przekazywana, default stanie sie martwym kodem tylko na wypadek braku propa.

**Test jsdom - `aria-hidden` na dropdownie:** panel dropdownu jest zawsze w DOM (widocznosc przez klasy CSS `invisible`/`opacity-0`), ale jsdom w Vitest NIE parsuje prawdziwego Tailwind CSS - `getByRole`/`getByText` widzialyby ukryte opcje jako dostepne. Naprawione dodaniem `aria-hidden={!open}` na kontenerze dropdownu (realna poprawka accessibility, nie tylko test hack - screen reader tez nie powinien widziec ukrytego menu).

**Weryfikacja manualna w przegladarce (real Chrome, nie jsdom):** otwarto mobile nav, kliknieto przelacznik -> dropdown pokazal PL/EN poprawnie -> klik EN -> `document.cookie` = `locale=en`, `document.documentElement.lang` = `en`, URL bez zmian. Pelny flow Faza 2 + Faza 4 dziala end-to-end.

**Blokada operacyjna (nie blokada kodu):** napisano `tests/e2e/language-switcher.e2e.spec.ts` (2 scenariusze: brak zmiany URL + html lang po przelaczeniu, zamkniecie modala CV przed przelaczeniem), ale NIE dalo sie ich uruchomic w tej sesji - port 3000 na tej maszynie zajety przez inny, niepowiazany projekt uzytkownika (proces node.exe serwujacy strone "KCRAFT", nie mcraft). Nie zabito tego procesu (nie nalezy do tego projektu). Logika testow zweryfikowana manualnie w przegladarce (patrz wyzej) - testy powinny przejsc przy wolnym porcie 3000 lub w CI.

## Faza 5 — wykonanie (2026-07-23)

Ukonczona. Wszystkie 6 miejsc wywolania Payload (`page.tsx` x6 w Promise.all, 3x subpage `service-pages`+`portfolio-projects`, `realizacje/[slug]/page.tsx`) dostaly `locale` z `getLocale()`. `servicePageData.ts` bez zmian sygnatury - potwierdzone testem, ze mapper jest locale-agnostic (mapuje cokolwiek dostanie, nie zna pojecia jezyka).

Przy okazji: `realizacje/[slug]/page.tsx` przekazuje teraz `locale` do `<MobileNav>` (ktory od Fazy 4 przyjmuje ten prop opcjonalnie) - drobna, naturalna dokonczenie wpiecia z poprzedniej fazy, nie nowy zakres.

**Weryfikacja manualna w przegladarce:** ustawiono cookie `locale=en`, odwiedzono `/konstrukcje-stalowe` - `<html lang="en">`, strona nie crashuje, `h1` pokazuje polski fallback ("Konstrukcje stalowe") bo lokalna baza dev nie ma jeszcze wpisanego tlumaczenia EN dla tego dokumentu. Dokladnie zgodne z R4 (fallback nigdy nie jest pusty).

**E2E:** napisano `tests/e2e/locale-content.e2e.spec.ts`, nie uruchomiono automatycznie w tej sesji (ten sam port-3000-conflict z niepowiazanym projektem co w Fazie 4) - logika potwierdzona manualnie jak wyzej.

## Faza 6 — wykonanie (2026-07-23)

Ukonczona - najwieksza faza planu (9 plikow + 2 pliki dictionaries). Wszystkie statyczne stringi UI w komponentach zastapione odwolaniami do `dict` (prop przekazywany z gory, od `page.tsx` przez `HomeContent`/`SubpageLayout` do klienckich komponentow lisci). Fallback CV/Bio w `ModalProvider.tsx` (hardcodowana tresc gdy CMS pusty) POZOSTAJE po polsku zawsze, zgodnie z decyzja planu - zmienione zostaly tylko etykiety UI wokol niego (naglowki sekcji, eyebrow/title/sub modali, przycisk pobierania).

### Krytyczny bug: funkcje w slowniku łamią RSC serialization

Pierwsza wersja slownika (Faza 3) miala 3 pola jako funkcje: `footer.copyright(year)`, `gallery.zoomAria(alt)`, `gallery.photoAria(index)`. Dzialalo to poprawnie w testach jednostkowych (Vitest/jsdom nie wymusza granicy serializacji RSC), ale w REALNYM Next.js dev serverze powodowalo natychmiastowy crash calej strony w trybie EN:

```
Error: Functions cannot be passed directly to Client Components unless you explicitly
expose it by marking it with "use server".
```

**Przyczyna:** `dict` (caly obiekt) jest przekazywany jako prop z komponentow serwerowych (`HomeContent`, `SubpageLayout`, `page.tsx`) do komponentow klienckich (`ModalProvider`, `TilesMarquee`, `RealizacjaGaleria`, `MobileNav`, `NavRealizacjeDropdown` - wszystkie `'use client'`). React Server Components serializuje CALY graf propsa przy przejsciu przez granice serwer->klient - JAKAKOLWIEK funkcja gdziekolwiek w tym obiekcie (nawet nieuzywana przez dany konkretny komponent) powoduje blad na calym obiekcie.

**Naprawa:** usunieto funkcje ze slownika calkowicie. `copyright(year) => string` zastapiono plain stringiem `copyrightSuffix` + interpolacja `` `© ${year} ${dict.footer.copyrightSuffix}` `` bezposrednio w JSX (server component, nie przekazywana dalej jako funkcja). Analogicznie `zoomAria`/`photoAria` -> `zoomAriaLabel`/`photoAriaLabel` + template literal w miejscu uzycia.

**Lekcja na przyszlosc:** slownik i18n przekazywany jako prop przez granice Server/Client Component w Next.js App Router MOZE zawierac WYLACZNIE dane serializowalne (stringi, liczby, plaskie obiekty/tablice) - zero funkcji, nawet "niewinnych" helperow formatujacych. Testy jednostkowe (Vitest) NIE wykryja tego bledu, bo nie ma tam prawdziwej granicy RSC - wymagana jest weryfikacja w prawdziwym `next dev`/`next build` + realna przegladarka.

### Weryfikacja manualna w przegladarce (po naprawie)

Odwiedzono strone glowna, `/konstrukcje-stalowe`, `/nieistniejaca-strona-xyz` (404) z cookie `locale=en`:
- Strona glowna: caly UI chrome po angielsku (PHD ENG., WELDING ENGINEER, FIND OUT MORE, WHO AM I?, WHAT I OFFER, AREAS OF ACTIVITY, SEE MORE, LET'S TALK ABOUT YOUR PROJECT, GET IN TOUCH, All rights reserved., Privacy policy, Built by:), zero bledow konsoli.
- `/konstrukcje-stalowe`: UI chrome po angielsku (SCOPE, GET IN TOUCH), tresc CMS (tytul, opis, "Dla kogo?", zakres uslug) poprawnie fallbackuje do PL - lokalna baza dev nie ma jeszcze wpisanych tlumaczen EN dla tego dokumentu (zgodnie z R4, nie jest to blad).
- Nazwy obszarow dzialalnosci (Nadzor spawalniczy/Konstrukcje stalowe/Meble premium) na stronie glownej takze PL - to `ServicePage.thumbnailTitle` z CMS (ma pierwszenstwo nad `dict.areas.names` gdy wypelnione), poprawne zachowanie.
- 404: naglowek/opis/przycisk po angielsku; `<title>` strony pozostaje PL (statyczny `export const metadata`, celowo NIE dotykany - to zakres Fazy 7, ktora nie wymienia `not-found.tsx` w swojej liscie plikow).

### E2E

Napisano `tests/e2e/dictionary-en.e2e.spec.ts` (4 strony + mobile nav aria-labels), NIE uruchomiono automatycznie w tej sesji - ten sam port-3000-conflict z niepowiazanym projektem uzytkownika co w poprzednich fazach. Logika 1:1 potwierdzona manualnie powyzej.

## Zrodla
- Requirements doc: [docs/dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md](../../dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md)
- Plan techniczny: [docs/plans/2026-07-21-005-feat-english-language-version-plan.md](../../plans/2026-07-21-005-feat-english-language-version-plan.md)
