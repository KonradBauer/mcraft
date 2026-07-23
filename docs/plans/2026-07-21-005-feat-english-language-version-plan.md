---
title: "feat: Dodaj angielska wersje jezykowa strony (i18n)"
type: feat
status: active
date: 2026-07-21
origin: docs/dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md
---

# Angielska wersja jezykowa strony (i18n)

## Przeglad

Strona mcraft (Next.js 16 + Payload CMS, single-locale PL) dostaje pelnoprawna wersje angielska: widoczny przelacznik PL/EN, tresc CMS lokalizowana natywnym mechanizmem Payload (`localization` + `localized: true`), statyczne teksty w komponentach przez lekki wlasny slownik PL/EN, wybor jezyka zapamietywany w cookie bez zmiany URL. Klient tlumaczy tresc recznie w panelu admina - zero integracji AI. Architektura ma byc gotowa na kolejne jezyki w przyszlosci (np. DE) bez przebudowy schematu.

## Ujecie problemu

Firma dziala w przemysle (spawanie, konstrukcje, meble premium) - segment gdzie profesjonalna firma "wypada" miec wersje angielska strony. To decyzja wizerunkowa, nie SEO/lead-driven - swiadomie zaakceptowany kompromis: cookie-based przelaczanie bez osobnych URL-i per jezyk oznacza, ze wersja EN nie zostanie osobno zaindeksowana przez Google (zob. Ryzyka). Pelny kontekst decyzji produktowych: [docs/dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md](../dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md).

## Sledzenie wymagan

- R1. Uzytkownik widzi widoczny przelacznik PL/EN w nawigacji (desktop i mobile), dostepny z kazdej strony serwisu.
- R2. Po przelaczeniu na EN, cala tresc serwisu (strona glowna, 3 podstrony uslugowe, polityka prywatnosci) wyswietla sie po angielsku - zarowno tekst zakodowany w komponentach, jak i tresc z CMS.
- R3. Klient moze wpisac angielskie tlumaczenie dla kazdego przetlumaczalnego pola tekstowego w panelu CMS (Payload admin), niezaleznie od polskiej wersji tego samego pola.
- R4. Jesli dane pole nie ma jeszcze wpisanego tlumaczenia EN, strona pokazuje polski tekst tego pola jako fallback (nigdy pusty fragment).
- R5. Wybor jezyka jest zapamietywany miedzy odwiedzinami, URL strony pozostaje bez zmian niezaleznie od wybranego jezyka (bez prefiksow typu `/en/...`).
- R6. Meta dane strony (tytul karty przegladarki, opis w wynikach wyszukiwania/social media) przelaczaja sie razem z reszta tresci.
- R7. Architektura danych pozwala w przyszlosci dodac kolejny jezyk (np. niemiecki) bez przebudowy struktury pol w CMS.

## Granice scope'u

- Zero automatycznego tlumaczenia przez AI (swiadomie odrzucone w brainstormie).
- Panel administracyjny Payload (etykiety pol, menu, komunikaty systemowe) pozostaje wylacznie po polsku.
- Brak osobnych, indeksowalnych URL-i per jezyk (np. `/en/...`) w tej fazie.
- Brak dedykowanego etapu "wstepnego tlumaczenia" przy wdrozeniu - serwis startuje z mechanizmem, tresc EN uzupelnia sie stopniowo przez fallback do PL.
- Tylko PL+EN w tej fazie (architektura gotowa na wiecej, ale dodanie kolejnego jezyka to osobny temat).
- Hardcodowany fallback CV/Bio w `ModalProvider.tsx` (uzywany wylacznie gdy CMS jest pusty) pozostaje zawsze po polsku, niezaleznie od wybranego jezyka - swiadomy wyjatek od R2, zdecydowany podczas planowania (rzadki, tymczasowy stan; podwojny hardcode nie ma realnej wartosci).
- Brak sygnalizacji UI ("ta tresc jest tylko po polsku") gdy pole korzysta z fallbacku - cichy fallback, zgodnie z literalnym brzmieniem R4.
- Rozjazd tresci PL/EN po edycji PL (stare tlumaczenie EN staje sie nieaktualne) nie jest wykrywany ani flagowany mechanizmem systemu - jedyny mitigant to podpowiedz w opisie pola w adminie.
- Bez zmian w `sitemap.ts`/`robots.ts` - brak osobnych URL-i per jezyk, wiec nie ma czego tam dodac.

## Kontekst i research

### Relevantny kod i wzorce

- `src/payload.config.ts` - brak sekcji `localization`; `collections: [Users, Media, Documents, StatTile, ServicePage, Portfolio]`, `globals: [HeroSection, AboutSection, CvModal, BioModal]`, `editor: lexicalEditor()`.
- `src/collections/ServicePage.ts`, `src/collections/Portfolio.ts`, `src/globals/{HeroSection,AboutSection,CvModal,BioModal}.ts`, `src/collections/StatTile.ts` - kolekcje/globale z tekstem do lokalizacji (pelna lista pol w Unit 1).
- `src/lib/stringToLexical.ts` - istniejacy wzorzec konwersji plain string -> lexical JSON, uzywany przy migracjach schematu (dokladnie ta sama technika bedzie potrzebna przy migracji danych do `localized: true`).
- `src/lib/servicePageData.ts` (`toSubpageLayoutProps`, `toRealizacjeProps`) - jedyny dedykowany mapper danych CMS -> props komponentu w projekcie.
- `src/components/mcraft/ModalProvider.tsx` - najwiekszy blok hardcodowanej tresci PL (fallback CV/Bio, linie ~144-225), wlasny scroll-lock (`document.body.style.overflow/position/top/width`, linie ~294-297) niezalezny od `MobileNav.tsx` (linie ~28-32) - **kolizja przy manipulacji tym samym `body.style` z dwoch miejsc niezaleznie** - przelacznik jezyka NIE MOZE reuzywac tego wzorca.
- `src/components/mcraft/MobileNav.tsx`, `NavRealizacjeDropdown.tsx` - client components z lokalnym `useState`, najblizszy stylistyczny wzorzec dla nowego `LanguageSwitcher.tsx`.
- Nav (`O mnie`/`Obszary`/`Realizacje`/`Kontakt`) i stopka (dane firmy, `Skontaktuj sie`, `Polityka prywatnosci`, `Wykonanie:`) sa zduplikowane w **4 miejscach**: `HomeContent.tsx`, `SubpageLayout.tsx`, `[serviceSlug]/realizacje/[slug]/page.tsx`, `not-found.tsx` - naturalna okazja do konsolidacji przy wprowadzaniu slownika (zgodnie z `coding-rules.md` pkt 3, "wyciagaj shared logic zamiast duplikowac").
- `src/app/(frontend)/layout.tsx` - `<html lang="pl">` (hardcoded), statyczny `export const metadata`, `openGraph.locale: 'pl_PL'` (hardcoded), JSON-LD `schemaOrg` (opisy PL na sztywno, dane faktyczne NIP/REGON/adres wewnatrz).
- 6 miejsc wywolujacych `getPayload`/`payload.find`/`payload.findGlobal` bez parametru `locale`: `page.tsx` (home), 3x `page.tsx` podstron uslugowych, `[serviceSlug]/realizacje/[slug]/page.tsx` (komponent + osobne `generateMetadata`).
- `tests/int/servicePageData.int.spec.ts` - wzorzec testowania czystego mappera (Arrange-Act-Assert, fixture na gorze pliku).
- `tests/int/SubpageLayout.int.spec.tsx` - wzorzec testowania renderu przez `@testing-library/react`; **`afterEach(cleanup)` musi byc jawny** (RTL w tym projekcie nie robi tego automatycznie).
- `tests/int/api.int.spec.ts` - wzorzec testu Local API bezposrednio przez `getPayload({ config })`.
- Brak istniejacego testu E2E dla nav/language switcher w `tests/e2e/` - nowy teren.

### Wiedza instytucjonalna

- `docs/solutions/backend-issues/2026-07-21-payload-defaultvalue-applies-despite-hidden-admin-condition.md` - zachowanie Payloada w bazie moze odbiegac od tego co sugeruje panel admina/config; po dodaniu `localized: true` sprawdz realny ksztalt dokumentow przez Local API zamiast zakladac ze migracja sie udala.
- `docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md` - kazdy skrypt Local API w `scripts/` musi konczyc sie jawnym `process.exit(0)`/`process.exit(1)` - dotyczy skryptu migracyjnego w Unit 1.
- `docs/solutions/testing-issues/2026-07-21-testing-library-react-render-leak-without-cleanup.md` - nowe testy komponentowe (`LanguageSwitcher`, rozszerzenia `SubpageLayout`) potrzebuja jawnego `afterEach(cleanup)`.
- Baza `docs/solutions/` jest bardzo mala (3 wpisy) - brak precedensow dla Payload localization/richText/hookow w tym repo, to praktycznie greenfield.

### Referencje zewnetrzne

- Payload CMS 3.85.1, `localization` config: `locales` (obiekty `{code,label}` lub string[]), `defaultLocale`, `fallback` (domyslnie `true`).
- `fallback: true` jest w pelni automatyczny na poziomie Payload (`fields/hooks/afterRead/promise.js`) - **zero kodu aplikacji potrzebne dla R4**. Wyjatek: dla pol innych niz `text`/`textarea` (m.in. `richText`, `array`) fallback odpala sie tylko przy `null`/`undefined`, NIE przy pustej tablicy `[]` czy pustym dokumencie Lexical - to rozroznienie ma znaczenie dla `audienceItems`/`additionalSections[].items` (richText w array).
- Local API/REST: `locale` param (`'pl' | 'en' | 'all'`); pominiecie parametru = domyslnie `defaultLocale` (bezpieczne, ale jawne przekazanie jest czytelniejsze).
- **Krytyczne:** konwersja istniejacego pola `localized: false -> true` NIE jest transparentna dla istniejacych danych w MongoDB - stare dokumenty maja plaski string (`title: "Foo"`), po fladze Payload oczekuje `title: { pl: "Foo" }`. Bez migracji istniejaca tresc PL "znika" (nie jest zwracana). Wymaga jawnego skryptu migracyjnego per kolekcja/global.
- `localized: true` na `array` lokalizuje CALA tablice (rozna liczba/kolejnosc wierszy per jezyk). Lokalizacja pojedynczego pola-liscia wewnatrz NIElokalizowanej tablicy (np. `items: [{ icon: text, label: text(localized) }]`) zachowuje wspolna strukture wierszy - to wlasciwy wzorzec dla `scopeItems`, `audienceItems`, `additionalSections[].items`, `images[]`. Nie da sie zagniezdzic `localized` w `localized` (Payload to cicho ignoruje bez specjalnej flagi kompatybilnosci v2).
- `generate:types` NIE generuje odrebnego typu dla pol `localized` - `title: string` wyglada identycznie przed i po fladze (fallback juz rozwiazany po stronie Payload przy zapytaniu z konkretnym `locale`). Nie polegac na wygenerowanych typach jako zrodle prawdy o tym co jest zlokalizowane.
- Next.js 16: `cookies()` z `next/headers` jest async (`await cookies()`), Request-time API - wymusza dynamic rendering (bez znaczenia tutaj, kazda strona ma juz `force-dynamic`). Ustawianie cookie (`cookieStore.set()`) mozliwe TYLKO w Server Function/Route Handler, nie w Server Component.
- `router.refresh()` (nie pelny `window.location.reload()`) re-fetchuje RSC payload z nowym cookie bez przeladowania strony - zachowuje stan zamontowanych client components.

## Kluczowe decyzje techniczne

- **Payload native localization**, nie reczne dublowanie pol (`titleEn`) - jeden config, skaluje sie czysto do kolejnych jezykow (R7). *(zob. zrodlo)*
- **Lekki wlasny slownik PL/EN** (typed dictionaries, `satisfies`), nie next-intl/i18next - strona ma 4 podstrony, nie potrzebuje pluralizacji/formatowania specyficznego per jezyk. *(zob. zrodlo)*
- **Cookie (nie localStorage)** jako mechanizm trwalosci wyboru jezyka - localStorage nie jest czytelny server-side, a caly render jest SSR (`force-dynamic`); to koryguje pierwotny zapis w zrodle ("cookie/localStorage") na techniczna koniecznosc.
- **Zawsze PL przy pierwszej wizycie** (brak cookie) - bez detekcji `Accept-Language`. Rozstrzygniete podczas planowania: firma dziala glownie w Polsce, `Accept-Language` bywa mylacy (korpo-laptopy, VPN z EN), ryzyko pokazania EN prawdziwemu polskiemu klientowi B2B przewaza nad korzysciami automatycznej detekcji.
- **Lokalizacja pol-lisci wewnatrz tablic, nie calych tablic** - `scopeItems`, `audienceItems`, `additionalSections[].items`, `images[]` zachowuja wspolna strukture/kolejnosc/liczbe wierszy miedzy jezykami; lokalizowany jest tylko tekst (`text`, `description`, `alt` itd.), nie kontener. Wyjatek: `title`/`description`/`bioText`/`skills`/`interests` na poziomie kolekcji/globala sa prostymi polami tekstowymi, lokalizowane bezposrednio.
- **Jawna lista pol wykluczonych z `localized: true`**: `slug` (Portfolio i ServicePage - napedza routing, ktory pozostaje wspolny per R5), `order`, `servicePage` (relationship), wszystkie pola typu `upload`/`select`/`number` uzywane jako wartosc faktyczna (np. `StatTile.number` typu "18+"), `CvModal` pola `year` (daty/okresy, nie tresc opisowa).
- **`Portfolio.images[].alt` DOSTAJE `localized: true`** - accessibility dla EN-czytajacych uzytkownikow screen readerow, spojne z reszta lokalizowanej tresci.
- **Migracja danych jako jawny, oddzielny krok** (Unit 1) - konwersja pol na `localized: true` bez migracji "gubi" istniejaca produkcyjna tresc PL (ServicePage/Portfolio maja realne, edytowane przez klienta dane). Skrypt jednorazowy w `scripts/`, wzorzec z `stringToLexical.ts`/istniejacych skryptow seed (`process.exit`), weryfikacja realnego stanu w MongoDB po migracji (nie tylko ufnosc w kod).
- **Przelacznik jezyka NIE dotyka `document.body` scroll-locka** - unika kolizji z istniejacym wzorcem w `ModalProvider`/`MobileNav` (oba niezaleznie nadpisuja te same style'y). Prosty toggle button + server action + `router.refresh()`, zero wlasnego overlay/locka.
- **Przelaczenie jezyka zamyka otwarty modal PRZED `router.refresh()`** - `ModalProvider` trzyma stan modala niezaleznie od drzewa serwerowego; bez zamkniecia, `router.refresh()` podmienilby tresc CV/Bio "pod spodem" otwartego modala, a animacja zoom-from-origin bazujaca na `getBoundingClientRect()` moglaby uzyc nieaktualnego `lastOrigin` po zmianie dlugosci tekstu PL->EN.
- **Meta dane przez `generateMetadata()`** (nie statyczny `export const metadata`) w `layout.tsx` i wszystkich `page.tsx` z wlasnym metadata - statyczny `metadata` nie moze czytac cookies.
- **JSON-LD schema.org**: opisowe pola tekstowe (np. `description` firmy/osoby) przelaczaja sie z jezykiem; dane faktyczne (adres, NIP, REGON, telefon) pozostaja identyczne w obu jezykach.
- **Google Maps iframe** dostaje `&hl=${locale}` w URL - jednolinijkowa poprawka spojnosci (embed domyslnie idzie za jezykiem przegladarki, nie strony).
- **Wszystko w jednym planie, bez fazowania** - migracja per-kolekcja to ten sam powtarzalny wzorzec x6, rozbicie na osobne plany wydluza timeline bez realnego zmniejszenia ryzyka. Rozstrzygniete podczas planowania.
- **Polityka prywatnosci** tlumaczona jako osobna, statyczna tresc (nie CMS) - strona nie ma dzis zadnego backendu Payload, dostaje wlasne pliki tresci PL/EN analogicznie do dictionary.

## Otwarte pytania

### Rozwiazane podczas planowania

- Domyslny jezyk bez cookie: zawsze PL, bez detekcji Accept-Language.
- Fallback CV/Bio w ModalProvider (gdy CMS pusty): zawsze PL, bez tlumaczenia na EN.
- Zakres release'u: caly scope (6 kolekcji/globali) w jednym planie, bez fazowania.
- Lokalizacja `Portfolio.images[].alt`: tak.
- Sygnalizacja fallbacku w UI: brak (cichy fallback).
- Format numeru telefonu w stopce: identyczny w obu jezykach (bez zmian).
- Google Maps `hl` param: dodac, podazajac za wybranym jezykiem.

### Odroczone do implementacji

- Dokladna kolejnosc i nazwy kluczy w slownikach `pl.ts`/`en.ts` (namespacing per sekcja/komponent) - do ustalenia przy pisaniu Unit 3, w miare przenoszenia realnych stringow.
- Dokladny ksztalt skryptu migracyjnego (per-dokument `payload.update` vs batch native MongoDB update) - zalezy od realnej ilosci dokumentow w produkcyjnej bazie, do sprawdzenia na starcie Unit 1.
- Czy reverse proxy/CDN przed aplikacja (hosting Coolify) wysyla `Vary: Cookie` dla stron dynamicznych - wymaga weryfikacji konfiguracji hostingu, nie tylko kodu Next.js; ryzyko mixed-language cache leak jesli nie. Do sprawdzenia przed/przy wdrozeniu produkcyjnym (zob. Ryzyka).
- Dokladne umiejscowienie `LanguageSwitcher` w layoucie nav (przed/po linkach, wlasny styl vs dopasowanie do istniejacego `bg-white/30 backdrop-blur-md` na desktopie) - decyzja wizualna do rozstrzygniecia przy implementacji Unit 4, z uwzglednieniem istniejacego design systemu.

## Implementation Units

- [x] **Unit 1: Payload localization - config, flagi pol, migracja danych** ✅

**Cel:** Wlaczyc natywna lokalizacje Payload, oznaczyc wszystkie kwalifikujace sie pola jako `localized: true` we wszystkich 6 kolekcjach/globalach, zmigrowac istniejaca produkcyjna tresc PL do ksztaltu locale-keyed bez utraty danych.

**Wymagania:** R3, R4, R7

**Zaleznosci:** Brak (fundament)

**Pliki:**
- Modyfikuj: `src/payload.config.ts` (dodaj `localization: { locales: [{code:'pl',label:'Polski'},{code:'en',label:'English'}], defaultLocale:'pl', fallback:true }`)
- Modyfikuj: `src/collections/ServicePage.ts` (`localized: true` na: `eyebrow`, `title`, `description`, `scopeItems[].text`, `scopeItems[].description`, `scopeItems[].modalDescription`, `audienceTitle`, `audienceItems[].text`, `additionalSections[].title`, `additionalSections[].items[].text`, `ctaHeader`, `thumbnailTitle`; dodaj `admin.description` hint o aktualizacji tlumaczenia na lokalizowanych polach)
- Modyfikuj: `src/collections/Portfolio.ts` (`localized: true` na: `title`, `description`, `images[].alt`; NIE na `slug`)
- Modyfikuj: `src/globals/HeroSection.ts` (`localized: true` na: `subtitle`, `description`)
- Modyfikuj: `src/globals/AboutSection.ts` (`localized: true` na: `bioText`)
- Modyfikuj: `src/globals/CvModal.ts` (`localized: true` na: `experience[].description`, `experience[].company`, `qualifications[].description`, `education[].institution`, `education[].description`, `additionalQualifications[].description`, `skills`, `interests`; NIE na pola `year`)
- Modyfikuj: `src/globals/BioModal.ts` (`localized: true` na: `sections[].title`, `sections[].content`)
- Modyfikuj: `src/collections/StatTile.ts` (`localized: true` na: `label`, `description`; NIE na `number`)
- Stworz: `scripts/migrate-localize-content.ts` (jednorazowy skrypt: dla kazdego dokumentu w kazdej dotknietej kolekcji/globalu, odczytaj obecna plaska wartosc, zapisz jako wartosc dla locale `pl`; jawny `process.exit(0)`/`process.exit(1)`, idempotentny - pomija dokumenty juz zmigrowane)
- Modyfikuj: `src/payload-types.ts` (regenerowany przez `pnpm generate:types` - bez recznej edycji)
- Test (unit/int): `tests/int/api.int.spec.ts` (rozszerz)

**Podejscie:**
- Kolejnosc: najpierw dopisz config + flagi pol, wygeneruj typy, potem napisz i uruchom skrypt migracyjny na lokalnej kopii bazy, zweryfikuj przez Local API ze `payload.find({ locale: 'pl' })` zwraca dokladnie te same wartosci co przed migracja.
- Migracja per-dokument przez Local API (`payload.update({ ..., locale: 'pl', data: {...} })`) - bezpieczniejsze niz surowe zapytania Mongo, uruchamia walidacje/hooki Payloada.

**Wzorce do nasladowania:**
- `src/lib/stringToLexical.ts` - technika konwersji istniejacej plaskiej wartosci do nowego ksztaltu bez utraty tresci.
- `docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md` - wzorzec zakonczenia skryptu.
- Istniejace skrypty w `scripts/` (np. `seed-service-sections.ts`) - styl, idempotencja.

**Scenariusze testowe:**
- [x] [Unit] `payload.find({ collection: 'service-pages', locale: 'pl' })` po migracji zwraca identyczna tresc jak przed migracja (zero utraty danych).
- [x] [Unit] `payload.find({ collection: 'service-pages', locale: 'en' })` na dokumencie bez tlumaczenia EN zwraca wartosc PL (automatyczny fallback Payload).
- [x] [Unit] `payload.findGlobal({ slug: 'bio-modal', locale: 'en' })` z bezposrednio ustawionym `sections[].content` w EN zwraca tresc EN, nie PL.
- [x] [Unit] Skrypt migracyjny uruchomiony drugi raz (na juz zmigrowanych danych) nie duplikuje ani nie psuje danych (idempotencja).

**Weryfikacja:**
- [x] Wszystkie kolekcje/globale maja poprawnie oznaczone pola; zadna istniejaca produkcyjna tresc PL nie zniknela po migracji (potwierdzone zapytaniem do realnej bazy, nie tylko typami).

**Odkryte podczas implementacji (2026-07-23):** Payload egzekwuje `required: true` osobno per locale - z `localized: true` zachowanym blokowaloby to zapisywanie czesciowych tlumaczen EN (klient musialby przetlumaczyc WSZYSTKIE wymagane pola dokumentu na raz). Usunieto `required: true` ze wszystkich pol, ktore staly sie `localized: true` (decyzja potwierdzona przez usera). Szczegoly: [i18n-english-locale-kontekst.md](../active/i18n-english-locale/i18n-english-locale-kontekst.md#faza-1--wykonanie-2026-07-23).

---

- [x] **Unit 2: Rozpoznawanie i trwalosc jezyka (cookie)** ✅

**Cel:** Serwerowy mechanizm odczytu wybranego jezyka (domyslnie PL) i server action do jego zmiany, bez zaleznosci od konkretnego UI.

**Wymagania:** R5

**Zaleznosci:** Brak

**Pliki:**
- Stworz: `src/lib/i18n/locale.ts` (`getLocale(): Promise<Locale>` - czyta cookie `locale`, waliduje wartosc przeciw `['pl','en']`, domyslnie `'pl'`)
- Stworz: `src/lib/i18n/setLocale.ts` (`'use server'` - `setLocale(locale: Locale)`, `cookies().set('locale', locale, { path:'/', maxAge: 31536000, sameSite:'lax' })`)
- Modyfikuj: `src/app/(frontend)/layout.tsx` (wywolaj `getLocale()`, przekaz `locale` w dol jako prop do dzieci / uzyj do `<html lang={locale}>`)
- Test (unit): `tests/int/locale.int.spec.ts`

**Podejscie:**
- `getLocale()` woluje sie raz w root layout (server component), locale przekazywany dalej przez propsy - zgodnie z istniejacym wzorcem serializable props (`ModalProvider` dostaje `cvModal`/`bioModal`/`tiles` z gory).
- Brak middleware - niepotrzebny przy braku rewrite'ow URL, `force-dynamic` juz wylacza cache na poziomie Next.js.

**Wzorce do nasladowania:**
- `src/lib/stringToLexical.ts` - styl malego, czystego modulu w `src/lib/`.

**Scenariusze testowe:**
- [x] [Unit] Brak cookie -> `getLocale()` zwraca `'pl'`.
- [x] [Unit] Cookie z wartoscia `'en'` -> `getLocale()` zwraca `'en'`.
- [x] [Unit] Cookie z nieprawidlowa wartoscia (np. `'de'`, `''`, uszkodzony string) -> `getLocale()` zwraca `'pl'` (bezpieczny fallback, nie rzuca wyjatkiem).

**Weryfikacja:**
- [x] `getLocale()` nigdy nie zwraca wartosci spoza `['pl','en']`; `setLocale` poprawnie ustawia cookie widoczne w kolejnym request.

**Odchylenie (2026-07-23):** "przekaz locale w dol jako prop" z RootLayout nie jest technicznie wykonalne w Next.js App Router (RootLayout nie kontroluje `children`). Kazdy `page.tsx` (Unit 5) wola `getLocale()` niezaleznie zamiast dziedziczyc przez propsy z layoutu.

---

- [ ] **Unit 3: Slownik statycznych tekstow PL/EN**

**Cel:** Jedno zrodlo prawdy dla wszystkich statycznych stringow UI (nav, stopka, etykiety, komunikaty), zastepujace obecna 4-krotna duplikacje nav/stopki.

**Wymagania:** R2

**Zaleznosci:** Brak

**Pliki:**
- Stworz: `src/lib/i18n/dictionaries/pl.ts` (pelny slownik PL - nav, stopka, etykiety hero/about/areas, modale, aria-labels, itd. - zrodlo prawdy typu)
- Stworz: `src/lib/i18n/dictionaries/en.ts` (`satisfies Dictionary` z `pl.ts` - gwarancja kompletnosci na etapie kompilacji)
- Stworz: `src/lib/i18n/getDictionary.ts` (`import 'server-only'`; `getDictionary(locale): Promise<Dictionary>`)
- Test (unit): `tests/int/i18n-dictionary.int.spec.ts`

**Podejscie:**
- Struktura slownika namespaced per sekcja (`nav`, `footer`, `hero`, `about`, `areas`, `modal.cv`, `modal.bio`, `mobileNav`, itd.) - odzwierciedla istniejace sekcje komponentow, latwe do zmapowania przy Unit 6.
- `server-only` gwarantuje ze przypadkowy import w client component (`MobileNav.tsx`, `LanguageSwitcher.tsx`) wywala blad builda zamiast cicho przeciekac caly slownik do bundla - do tych komponentow trafia tylko potrzebny wycinek przez propsy.

**Wzorce do nasladowania:**
- Styl typowania z `src/lib/bulletStyles.ts` (typed const + union type).

**Scenariusze testowe:**
- [Unit] `en.ts` eksportuje dokladnie te same top-level klucze co `pl.ts` (kontrola runtime jako dodatkowe zabezpieczenie ponad `satisfies`).
- [Unit] `getDictionary('en')` zwraca slownik EN, `getDictionary('pl')` zwraca slownik PL.

**Weryfikacja:**
- Zero stringow PL zakodowanych bezposrednio w komponentach po zakonczeniu Unit 6 (slownik jest jedynym zrodlem statycznej tresci UI).

---

- [ ] **Unit 4: Komponent przelacznika jezyka**

**Cel:** Widoczny, dzialajacy przelacznik PL/EN dostepny z kazdej strony, bez kolizji z istniejacym scroll-lockiem, bezpiecznie zamykajacy otwarty modal przed przelaczeniem.

**Wymagania:** R1

**Zaleznosci:** Unit 2 (mechanizm cookie), Unit 3 (etykiety "PL"/"EN" ze slownika)

**Pliki:**
- Stworz: `src/components/mcraft/LanguageSwitcher.tsx`
- Modyfikuj: `src/components/mcraft/ModalProvider.tsx` (wystaw `closeModal` przez `useModal()` do uzytku poza providerem, jesli jeszcze niedostepne)
- Modyfikuj: `src/components/mcraft/HomeContent.tsx`, `SubpageLayout.tsx` (wstaw `LanguageSwitcher` w nav desktop)
- Modyfikuj: `src/components/mcraft/MobileNav.tsx` (wstaw `LanguageSwitcher` w nav mobile)
- Test (unit): `tests/int/LanguageSwitcher.int.spec.tsx`

**Podejscie:**
- Client component: `useTransition` + wywolanie server action `setLocale` + `router.refresh()`; `isPending` steruje subtelnym stanem ladowania (np. `opacity-50`) na przycisku.
- Przed wywolaniem `setLocale`, jesli modal jest otwarty (`useModal().closeModal()` dostepne), zamknij go najpierw - unika podmiany tresci "pod spodem" otwartego modala.
- Zero manipulacji `document.body.style` - prosty toggle, nie overlay.

**Wzorce do nasladowania:**
- `MobileNav.tsx`/`NavRealizacjeDropdown.tsx` - styl client componentu z lokalnym `useState`.
- `ModalProvider.tsx` (`useModal` hook) - wzorzec context/hook w tym projekcie.

**Scenariusze testowe:**
- [Unit] Klikniecie przelacznika wywoluje `setLocale` z przeciwnym jezykiem niz aktualny.
- [Unit] Renderuje sie identycznie (dostepny, klikalny) w kontekscie desktop nav i mobile nav.
- [E2E] Otworz strone glowna, kliknij przelacznik na EN, sprawdz ze URL sie nie zmienil a widoczna tresc nav jest po angielsku.
- [E2E] Otworz modal CV, kliknij przelacznik jezyka, sprawdz ze modal sie zamyka (nie zostaje otwarty z podmieniona trescia w tle).

**Weryfikacja:**
- Przelacznik dziala z kazdej z 4 stron serwisu bez bledow konsoli; brak regresji w istniejacym scroll-locku `MobileNav`/`ModalProvider`.

---

- [ ] **Unit 5: Locale w pobieraniu danych z Payload**

**Cel:** Kazde wywolanie `payload.find`/`payload.findGlobal` na froncie przekazuje aktualny jezyk, zeby CMS zwracal tresc we wlasciwym locale.

**Wymagania:** R2, R3, R4

**Zaleznosci:** Unit 1 (pola musza byc `localized`), Unit 2 (`getLocale()`)

**Pliki:**
- Modyfikuj: `src/app/(frontend)/page.tsx` (6 wywolan w `Promise.all` - dodaj `locale`)
- Modyfikuj: `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` (kazdy: `payload.find` dla `service-pages` + ew. `portfolio-projects`)
- Modyfikuj: `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` (komponent strony)
- Modyfikuj: `src/lib/servicePageData.ts` (jesli sygnatura `toSubpageLayoutProps`/`toRealizacjeProps` wymaga zmiany - do potwierdzenia przy implementacji, prawdopodobnie NIE wymaga, bo Payload juz zwraca zlokalizowana wartosc przy zapytaniu z `locale`)
- Test (unit): `tests/int/servicePageData.int.spec.ts` (rozszerz o scenariusz z danymi w wielu locale)

**Podejscie:**
- Kazdy `page.tsx` woluje `getLocale()` (Unit 2) przed wywolaniami Payload, przekazuje wynik jako `locale` do kazdego `payload.find`/`findGlobal`.
- `servicePageData.ts` prawdopodobnie NIE wymaga zmiany sygnatury - locale jest juz "wpieczony" w dane, ktore mapper dostaje na wejsciu.

**Wzorce do nasladowania:**
- Istniejacy wzorzec `Promise.all` w `page.tsx` (home).

**Scenariusze testowe:**
- [Unit] `toSubpageLayoutProps` poprawnie mapuje dane niezaleznie od tego, w jakim locale zostaly pobrane (mapper jest locale-agnostic, tylko przekazuje dalej).
- [E2E] Odwiedz `/konstrukcje-stalowe` z ustawionym cookie `locale=en`, sprawdz ze tresc z CMS (tytul, opis, zakres uslug) jest po angielsku (lub PL fallback, jesli pole niewypelnione w EN).

**Weryfikacja:**
- Zadne z 6 miejsc wywolania Payload nie pomija `locale`; zmiana jezyka realnie zmienia zwracana tresc CMS.

---

- [ ] **Unit 6: Podmiana statycznych tekstow na slownik + konsolidacja duplikatow**

**Cel:** Wszystkie hardcodowane polskie stringi w komponentach zastapione odwolaniami do slownika (Unit 3); przy okazji skonsolidowana 4-krotna duplikacja nav/stopki.

**Wymagania:** R2

**Zaleznosci:** Unit 3 (slownik), Unit 4 (przelacznik juz wpiety w nav)

**Pliki:**
- Modyfikuj: `src/components/mcraft/HomeContent.tsx`, `SubpageLayout.tsx`, `ModalProvider.tsx`, `MobileNav.tsx`, `NavRealizacjeDropdown.tsx`, `TilesMarquee.tsx`, `RealizacjaGaleria.tsx`
- Modyfikuj: `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`, `not-found.tsx` (stopka + Google Maps `hl` param)
- Test (unit): `tests/int/SubpageLayout.int.spec.tsx` (rozszerz o assercje na tresci EN)

**Podejscie:**
- Stopniowa migracja sekcja po sekcji (nie big-bang rewrite) - kazdy komponent dostaje wycinek `dict` jako prop z gory.
- Przy okazji dotykania wszystkich 4 kopii stopki: wydzielic wspolny komponent `Footer`/`Nav` jesli to nie zwieksza istotnie ryzyka tego unitu (ocena przy implementacji - priorytet to i18n, refaktor jest bonusem, nie blokerem).
- Google Maps iframe URL dostaje `&hl=${locale}` w kazdej z 4 kopii stopki.

**Wzorce do nasladowania:**
- `src/lib/i18n/getDictionary.ts` (Unit 3).

**Scenariusze testowe:**
- [Unit] `SubpageLayout` renderowany z `dict` EN pokazuje angielskie etykiety nav/CTA zamiast polskich.
- [E2E] Otworz kazda z 4 glownych stron (home, 3x podstrona uslugowa) w trybie EN, sprawdz brak widocznych polskich stringow poza danymi faktycznymi (NIP/adres/telefon) i fallbackiem CV/Bio.
- [E2E] Sprawdz `aria-label` przyciskow mobile nav (otworz/zamknij menu) po przelaczeniu na EN.

**Weryfikacja:**
- Grep po kluczowych polskich frazach (np. "Skontaktuj się", "Zobacz") w dotknietych plikach nie zwraca wynikow poza slownikiem i fallbackiem CV/Bio (swiadomy wyjatek).

---

- [ ] **Unit 7: Lokalizacja meta danych i JSON-LD**

**Cel:** Tytul karty przegladarki, opis, OG/Twitter card oraz `<html lang>` przelaczaja sie z jezykiem; JSON-LD schema.org tlumaczy pola opisowe, zachowuje dane faktyczne.

**Wymagania:** R6

**Zaleznosci:** Unit 2 (`getLocale()`), Unit 3 (slownik dla tresci meta)

**Pliki:**
- Modyfikuj: `src/app/(frontend)/layout.tsx` (`export const metadata` -> `generateMetadata()`, `<html lang={locale}>`, `openGraph.locale`, `schemaOrg` opisowe pola)
- Modyfikuj: `src/app/(frontend)/page.tsx`, `nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` (statyczny `metadata` -> `generateMetadata()`)
- Modyfikuj: `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` (istniejacy `generateMetadata` dostaje `locale`)
- Test (unit): `tests/int/metadata.int.spec.ts`

**Podejscie:**
- Kazdy `generateMetadata()` woluje `getLocale()` niezaleznie (wykonuje sie w osobnym wywolaniu niz komponent strony w Next.js).
- Dane faktyczne w JSON-LD (adres, NIP, REGON, telefon) pozostaja identyczne; tylko opisowe `description` pol firmy/osoby przelacza sie ze slownikiem.

**Wzorce do nasladowania:**
- Istniejaca struktura `metadata`/`schemaOrg` w `layout.tsx` (zachowac ksztalt, zmienic tylko zrodlo tekstu).

**Scenariusze testowe:**
- [E2E] Odwiedz strone glowna z `locale=en`, sprawdz `document.title` i `<html lang="en">`.
- [E2E] Odwiedz jedna z podstron uslugowych z `locale=en`, sprawdz ze `<meta name="description">` jest po angielsku.

**Weryfikacja:**
- Brak statycznych `export const metadata` w dotknietych plikach (wszystkie dynamiczne, locale-aware).

---

- [ ] **Unit 8: Tlumaczenie polityki prywatnosci**

**Cel:** Strona `/polityka-prywatnosci` (statyczna, bez CMS) ma pelna wersje angielska, przelaczana tym samym mechanizmem co reszta serwisu.

**Wymagania:** R2

**Zaleznosci:** Unit 2 (`getLocale()`), Unit 3 (wzorzec organizacji tresci)

**Pliki:**
- Modyfikuj: `src/app/(frontend)/polityka-prywatnosci/page.tsx`
- Stworz: `src/app/(frontend)/polityka-prywatnosci/content.pl.tsx` (lub podobny podzial tresci PL)
- Stworz: `src/app/(frontend)/polityka-prywatnosci/content.en.tsx`
- Test (unit): `tests/int/polityka-prywatnosci.int.spec.ts`

**Podejscie:**
- Tresc prawna jest dluzsza niz typowe UI stringi - osobne pliki tresci per jezyk czytelniejsze niz wpychanie do glownego slownika (Unit 3).
- `page.tsx` woluje `getLocale()`, renderuje odpowiedni wariant tresci.

**Wzorce do nasladowania:**
- Istniejaca struktura sekcji w `polityka-prywatnosci/page.tsx` (zachowac numeracje/uklad, zmienic tylko jezyk).

**Scenariusze testowe:**
- [E2E] Odwiedz `/polityka-prywatnosci` z `locale=en`, sprawdz ze naglowki sekcji i tresc sa po angielsku.
- [E2E] Link "Polityka prywatności" w stopce (Unit 6) prowadzi do tej samej strony niezaleznie od jezyka (URL bez zmian, zgodnie z R5).

**Weryfikacja:**
- Strona renderuje sie poprawnie w obu jezykach bez bledow konsoli; brak mieszania PL/EN w obrebie jednego widoku.

## Wplyw systemowy

- **Graf interakcji:** Zmiana jezyka (client action) -> cookie -> `router.refresh()` -> re-fetch wszystkich server components na biezacej stronie (nav, tresc glowna, stopka, metadata) -> `ModalProvider` dostaje nowe propsy `cvModal`/`bioModal`/`tiles`, ale wlasny stan (`isOpen`) przezywa refresh, stad wymog zamkniecia modala przed przelaczeniem (Unit 4).
- **Propagacja bledow:** Brak tlumaczenia EN nie jest bledem - Payload `fallback: true` cicho zwraca PL. Realny blad (np. nieprawidlowa wartosc cookie) jest lapany w `getLocale()` (Unit 2) i zawsze degraduje do bezpiecznego `'pl'`, nigdy nie crashuje strony.
- **Ryzyka cyklu zycia stanu:** Otwarty modal + przelaczenie jezyka (opisane w Unit 4); brak innych zrodel dlugozyjacego stanu klienckiego na tej stronie poza modalami i mobile nav (ktory juz ma wlasny scroll-lock, nie dotykany przez Unit 4).
- **Parytet surface API:** REST/GraphQL API Payloada automatycznie wspiera `?locale=` po Unit 1 - brak dodatkowej pracy, to freebie z natywnej lokalizacji.
- **Pokrycie integracyjne:** Scenariusze `[E2E]` w Unit 4-8 pokrywaja cross-layer flow (cookie -> SSR -> CMS -> render); brak istniejacego pokrycia E2E dla nav w ogole, wiec to nowy teren testowy, nie tylko rozszerzenie istniejacego.

## Ryzyka i zaleznosci

- **Migracja danych produkcyjnych (Unit 1) to najwiekszy pojedynczy risk planu** - ServicePage/Portfolio maja realna, edytowana przez klienta tresc (potwierdzone w tej samej sesji roboczej przy naprawie brakujacego obszaru dzialalnosci). Bledna migracja = utrata tresci klienta. Mitygacja: skrypt idempotentny, weryfikacja przez Local API przed/po, testowanie na lokalnej kopii bazy przed produkcja.
- **SEO: wersja EN prawdopodobnie nie zostanie osobno zaindeksowana przez Google** (cookie-based bez URL prefix - crawlery nie maja cookie, nie wysylaja uzytecznego `Accept-Language`). Swiadomie zaakceptowane w brainstormie (cel = wizerunek, nie SEO) - udokumentowane tutaj, zeby nie bylo zaskoczeniem pozniej.
- **CDN/reverse proxy cache bez `Vary: Cookie`** moze serwowac ten sam zcache'owany HTML uzytkownikom z roznymi jezykami, jesli infrastruktura hostingowa (Coolify) cache'uje na poziomie przed aplikacja. Next.js sam nic nie cache'uje (`force-dynamic`), ale to nie gwarantuje warstwy przed nim. Do zweryfikowania w konfiguracji hostingu przed/przy wdrozeniu produkcyjnym - odroczone do implementacji.
- **Rozjazd tresci PL/EN w czasie** (klient edytuje PL, EN zostaje nieaktualne) nie jest wykrywany mechanizmem - jedyny mitigant to podpowiedz tekstowa w adminie (Unit 1). Zaakceptowane ograniczenie, nie do rozwiazania w tym scope.
- **Rozmiar Unit 6** (7+ plikow, konsolidacja 4 duplikatow) jest najwiekszym pojedynczym unitem pod wzgledem liczby dotknietych plikow - jesli przy implementacji okaze sie zbyt duzy do jednego atomowego commita, rozwazyc podzial na "nav+modale" i "stopka+galeria" jako osobne pod-commity w ramach tego samego unitu koncepcyjnego.

## Dokumentacja / Notatki operacyjne

- Po wdrozeniu: przypomniec klientowi (poza scope kodu) ze tlumaczenia EN sa jego odpowiedzialnoscia - panel admina ma juz podpowiedz w opisie kazdego lokalizowanego pola (Unit 1).
- Przed pierwszym wdrozeniem produkcyjnym: zweryfikowac `Vary: Cookie`/cache config na hostingu (zob. Ryzyka) - operacyjny krok poza tym planem, ale blokujacy dla poprawnego dzialania na produkcji.
- Warto rozwazyc `/dev-compound` po zakonczeniu wdrozenia, zeby udokumentowac w `docs/solutions/` pierwsze realne problemy z Payload localization napotkane w tym repo (baza wiedzy jest dzis pusta w tym temacie).

## Zrodla i referencje

- **Dokument zrodlowy:** [docs/dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md](../dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md)
- Powiazany kod: `src/payload.config.ts`, `src/lib/servicePageData.ts`, `src/lib/stringToLexical.ts`, `src/components/mcraft/ModalProvider.tsx`
- Zewnetrzne docs: [Payload Localization](https://payloadcms.com/docs/configuration/localization), [Payload Migrations](https://payloadcms.com/docs/database/migrations), [Next.js cookies() API](https://nextjs.org/docs/app/api-reference/functions/cookies), [Google Search Central: Multi-Regional and Multilingual Sites](https://support.google.com/webmasters/answer/182192)
