---
title: "feat: Rozbudowa treści podstron usług - sekcje Dla kogo, kafelki Zakres, dodatkowe sekcje"
type: feat
status: active
date: 2026-07-21
origin: docs/dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md
---

# feat: Rozbudowa treści podstron usług

## Przegląd

Trzy podstrony usług (Nadzór Spawalniczy, Konstrukcje Stalowe, Meble Premium) dostają jednolity, rozszerzalny układ treści: opcjonalna sekcja "Dla kogo?", sekcja ZAKRES w formie kafelków z ikoną (bez opisu na karcie, opis w modalu po kliknięciu), dowolna liczba sekcji dodatkowych które admin dodaje samodzielnie w panelu Payload, i sekcja REALIZACJE zawsze na końcu (poza Nadzorem, gdzie jej nie ma). Dziś Nadzór Spawalniczy renderowany jest osobnym, zduplikowanym komponentem (`NadzorLayout.tsx`) - ten plan scala go z `SubpageLayout.tsx` w jeden wspólny komponent.

## Ujęcie problemu

Klient zgłosił (dokument `opis dodatkowych zmian.docx`, załączony screenshot), że sekcje usług na Konstrukcje Stalowe i Meble Premium są zbyt ubogie treściowo, a jedyny sposób na dodanie nowej treści dziś to prośba do dewelopera. Chce samodzielnie w panelu admina dodawać nowe sekcje treściowe (tytuł + wypunktowana lista) i mieć identyczny, uproszczony wygląd kafelków ZAKRES na wszystkich trzech podstronach.

Źródło: `docs/dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md`

## Śledzenie wymagań

- R1. Opcjonalna sekcja "Dla kogo?" (tytuł + wypunktowana lista) jako pierwsza sekcja treści na każdej z 3 podstron; ukryta gdy pusta.
- R2. Sekcja ZAKRES renderowana jako pionowy stos kafelków (1 kolumna) z ikoną i tytułem, bez opisu widocznego na karcie.
- R3. Kliknięcie kafelka ZAKRES z ustawionym opisem otwiera modal z pełną treścią; kafelki bez opisu nie są klikalne.
- R4. Admin samodzielnie dodaje/edytuje/usuwa/porządkuje dowolną liczbę dodatkowych sekcji (tytuł + lista) między ZAKRES a REALIZACJE, bez udziału dewelopera.
- R5. REALIZACJE zawsze na końcu strony, tylko na Konstrukcje Stalowe i Meble Premium (Nadzór Spawalniczy - bez zmian, nadal bez tej sekcji).
- R6. Kolejność sekcji, wygląd kafelków ZAKRES i zachowanie modali identyczne na wszystkich 3 podstronach.
- R7. Istniejąca treść pozycji ZAKRES (tytuły) zachowana bez utraty danych.
- R8. Sekcje "Dla kogo?" i "Jak przygotować zapytanie?" dla Konstrukcje Stalowe wypełnione od razu treścią klienta.
- R9. Kafelki ZAKRES bez wcześniej ustawionej ikony (Konstrukcje Stalowe, Meble Premium) dostają domyślną ikonę placeholder.

## Granice scope'u

- Nowe sekcje obsługują wyłącznie tytuł + płaską wypunktowaną listę tekstową - bez rich text, obrazków, zagnieżdżonych list, bez systemu blokowego.
- Sekcja "Dla kogo?" to pojedynczy stały slot przed ZAKRES, nie repeater wielu sekcji przed ZAKRES.
- Brak zmian w kolekcji `Portfolio` i mechanice samej sekcji Realizacje (zrealizowane w `2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md`).
- Dodawanie/usuwanie kafelków ZAKRES w adminie już działa - bez zmian.
- Brak wielojęzyczności.

## Kontekst i research

### Relevantny kod i wzorce

- `src/collections/ServicePage.ts:46-130` - pole `scopeItems` (array: `icon`, `text`, `description`, `modalDescription`); `icon`/`description`/`modalDescription` ukryte przez `admin.condition: (data) => data?.slug === 'nadzor-spawalniczy'` (linie 100, 117, 125). To jest bezpośrednia przyczyna R9 - te trzy pola nigdy nie były wypełniane dla Konstrukcje Stalowe / Meble Premium, bo admin ich nie widział w panelu.
- `src/components/admin/ScopeItemRowLabel.tsx` - `useRowLabel` z fallbackiem `data?.text || Punkt N` - wzorzec do reużycia dla list punktowanych (nie tylko `scopeItems`).
- `src/components/admin/IconPickerField.tsx` + `src/lib/tileIcons.tsx` (`ICON_REGISTRY`, 34 ikony) - lista ikon zduplikowana w dwóch miejscach (opcje `select` w `ServicePage.ts` i `ICON_OPTIONS` w `IconPickerField.tsx`) - trzeba je trzymać w synchronizacji, jeśli cokolwiek się zmienia.
- `src/components/mcraft/NadzorLayout.tsx` (243 linie) vs `src/components/mcraft/SubpageLayout.tsx` (207 linii) - topbar (linie 55-71 / 46-62), header (73-93 / 64-84), CTA (172-186 / 134-148) i footer (188-239 / 150-203) są identyczne co do znaku. Różnią się wyłącznie: (a) renderowaniem ZAKRES - `NadzorLayout` to karty `grid-cols-2` z ikoną + tytuł + opcjonalny opis + `ModalTrigger` (linie 99-138), `SubpageLayout` to lista punktowana `grid-rows-3 grid-flow-col` bez ikon i bez opisu (linie 89-98); (b) `NadzorLayout` owija całość w `<ModalProvider>` (linia 54), `SubpageLayout` nie; (c) sekcją REALIZACJE - `NadzorLayout` renderuje ją tylko gdy `realizacje.length > 0` bez fallbacku (linie 143-170), `SubpageLayout` renderuje zawsze, z fallbackiem 3 placeholderów `ImageSlot` gdy pusta (linie 101-130).
- `src/lib/servicePageData.ts` - `toSubpageLayoutProps()` mapuje `ServicePage` → propsy komponentu; `toRealizacjeProps()` mapuje `PortfolioProject[]` → karty. Wzorzec do rozszerzenia, nie do zastąpienia.
- `src/components/mcraft/ModalProvider.tsx:250-259` - `ModalScopeContent` już renderuje `{ title, description }` w modalu, gotowe do użycia bez zmian - `NadzorLayout` już z tego korzysta przez `ModalTrigger modalKey="scope"`.
- `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` - wszystkie `force-dynamic`, pobierają `service-pages` przez `payload.find`; dwie ostatnie dodatkowo pobierają `portfolio-projects` i wołają `toRealizacjeProps`.
- `src/app/api/seed/route.ts` - endpoint `GET`/`DELETE` seedujący/nadpisujący dokumenty `ServicePage` z hardcodowanej tablicy `PAGES` (linie 5-40). **Ryzyko:** to jest publiczny, nieautoryzowany `GET` route, który przy ponownym wywołaniu robi `payload.update` z pełną tablicą `scopeItems` z kodu - jeśli dodać tam nową treść, każde kolejne odpalenie tego endpointu nadpisze ręczne zmiany admina w panelu. Dlatego treść seedowa dla R8 NIE powinna iść przez ten route (patrz Unit 6).
- `scripts/seed-cv.ts`, `scripts/seed-tiles.ts` - istniejący wzorzec jednorazowych skryptów seedujących przez Payload Local API (`getPayload({config})` + `payload.update`/`payload.create`), uruchamianych ręcznie, nie jako publiczny endpoint. Wzorzec do naśladowania dla Unit 6.
- `tests/e2e/frontend.e2e.spec.ts` - istniejące testy Playwright sprawdzające tytuł i nagłówek `h1` na wszystkich 3 podstronach - punkt wyjścia do rozszerzenia o nowe sekcje.

### Wiedza instytucjonalna

- Brak katalogu `docs/solutions/` w tym repo (nie istnieje) - najbliższym odpowiednikiem jest poprzedni plan `docs/plans/2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md`, który świadomie odroczył scalenie zduplikowanego markupu topbar/footer ("uzasadniają późniejszą ekstrakcję do `PageShell`, ale nie wymuszają jej teraz") - ten plan jest pierwszym, który faktycznie spłaca ten dług, tym razem wymuszony wprost przez wymaganie R6.
- Ten sam poprzedni plan ustalił zasadę: przy zmianie schematu pola nie usuwać starych pól (`galleryImages` zostało w schemacie ServicePage mimo że przestało być renderowane) - ten sam wzorzec stosujemy tu: `scopeItems` zostaje niezmienione strukturalnie (usuwamy tylko `admin.condition`), nowe pola dodajemy obok.
- W repo nie ma formalnego systemu migracji Payload (Mongo jest bezschematowe, `payload.config.ts` nie ma skonfigurowanego `migrationDir`) - zmiany schematu = edycja collection config + `pnpm generate:types`, ewentualny backfill danych = ręczny skrypt jak `seed-tiles.ts`, nie migration file.

## Kluczowe decyzje techniczne

- **Scalenie `NadzorLayout.tsx` do `SubpageLayout.tsx`, usunięcie pliku `NadzorLayout.tsx`**: R6 wymaga identycznego layoutu na 3 podstronach: dwa pliki różniące się już tylko renderowaniem ZAKRES/Realizacje to czysty dług, nie uzasadniona duplikacja. `SubpageLayout` zostaje nazwą kanoniczną, bo już jest importowany przez 2 z 3 stron.
- **Cały `SubpageLayout` owinięty w `ModalProvider`**: dziś robi to tylko `NadzorLayout`; po scaleniu kafelki ZAKRES z modalem są na wszystkich 3 podstronach, więc provider musi być zawsze obecny.
- **Sekcja Realizacje: usunięcie fallbacku 3 placeholderów, przejście na wzorzec Nadzoru (`realizacje && realizacje.length > 0`)**: skoro Portfolio jest już realnym źródłem danych (poprzedni plan), fałszywe placeholdery "Realizacja 1/2/3" są mylące bardziej niż brak sekcji. Spójne też z tym, że nowe sekcje (Dla kogo, dodatkowe) też chowają się przy braku treści.
- **Nowe pola na `ServicePage` dodane obok `scopeItems`, bez migracji danych**: `audienceTitle` (text, default `"Dla kogo?"`) + `audienceItems` (array `{text}`) dla R1; `additionalSections` (array `{title, items: array<{text}>}`) dla R4. Zgodne z ustalonym w repo wzorcem addytywnych zmian schematu.
- **Usunięcie `admin.condition` z `icon`/`description`/`modalDescription` w `scopeItems`**: to jedyna zmiana która realnie odsłania te pola dla Konstrukcje Stalowe / Meble Premium w panelu - bez niej R6/R9 są niewykonalne, bo admin fizycznie nie widzi tych pól w UI.
- **Domyślna ikona placeholder = `ShieldCheck`**: to już `defaultValue` pola `icon` w schemacie. Payload aplikuje `defaultValue` przy tworzeniu/aktualizacji dokumentu przez Local API gdy pole nie jest podane w danych - a `src/app/api/seed/route.ts` tworzył `scopeItems` dla Konstrukcje Stalowe/Meble Premium bez klucza `icon`. Istnieje spora szansa, że te wiersze w bazie już mają `icon: 'ShieldCheck'` zapisane, mimo że pole było ukryte w UI. Weryfikacja rzeczywistego stanu w bazie i ewentualny backfill - patrz "Odroczone do implementacji".
- **Bullet listy sekcji "Dla kogo?" i "dodatkowe sekcje" w jednej kolumnie, nie w gridzie 2-kolumnowym**: klient wprost poprosił o rezygnację z układu 2-kolumnowego dla list z rombowymi znacznikami (`opis dodatkowych zmian.docx`) - dziś to dokładnie mechanizm `grid-rows-3 grid-flow-col` w starym ZAKRES `SubpageLayout.tsx:91`. Ponieważ ZAKRES przechodzi na kafelki, ten sam mechanizm bullet-listy jest teraz przenoszony do nowych sekcji Dla kogo/dodatkowe - i tam też ma być jednokolumnowy, żeby nie wprowadzać z powrotem układu, którego klient nie chciał.
- **Treść seedowa R8 przez osobny, ręcznie uruchamiany skrypt (`scripts/seed-service-sections.ts`), nie przez `src/app/api/seed/route.ts`**: ten route to publiczny, nieautoryzowany GET, który przy każdym wywołaniu nadpisuje `scopeItems` z hardcodowanej tablicy - dopisanie tam nowej treści oznaczałoby ryzyko, że przypadkowe/automatyczne odpalenie route'u (np. przez crawler) zresetuje treść, którą klient sam wpisał w panelu. Jednorazowy skrypt uruchamiany ręcznie (wzorzec `seed-tiles.ts`) nie ma tego ryzyka.

## Otwarte pytania

### Rozwiązane podczas planowania

- **Struktura pola "Dla kogo?"** (odroczone z brainstormu, R1): osobne stałe pola `audienceTitle` + `audienceItems` na `ServicePage`, nie pierwszy element wspólnego typu z `additionalSections` - prostsze query/rendering, zgodne z ustaleniem z brainstormu że to pojedynczy stały slot.
- **Model danych repeatera `additionalSections`** (odroczone z brainstormu, R4): zagnieżdżony `array` (sekcja: `title` + `items: array<{text}>`), nie `blocks` - w repo nie ma dziś ani jednego pola `blocks`, a wymaganie jest świadomie ograniczone do jednego prostego typu treści (patrz Granice scope'u) - `blocks` byłby złożonością bez pokrycia w potrzebie.
- **Sposób ujednolicenia `NadzorLayout`/`SubpageLayout`** (odroczone z brainstormu, R6): scalenie w jeden plik `SubpageLayout.tsx`, usunięcie `NadzorLayout.tsx` - patrz Kluczowe decyzje.
- **Mechanizm migracji `scopeItems`** (odroczone z brainstormu, R7): brak migracji - pola dodane obok istniejących, `scopeItems.text` nietknięte.
- **Domyślna ikona placeholder** (odroczone z brainstormu, R9): `ShieldCheck` (już `defaultValue` pola).

### Odroczone do implementacji

- Czy istniejące dokumenty `ServicePage` dla `konstrukcje-stalowe`/`meble-premium` już mają `icon: 'ShieldCheck'` zapisane w bazie (dzięki `defaultValue` zaaplikowanemu przy tworzeniu przez `/api/seed`), czy pole jest faktycznie puste - do sprawdzenia bezpośrednio w MongoDB/panelu admina na starcie implementacji, zanim napisze się kod backfillu, żeby nie robić zbędnego skryptu.
- Dokładny podział sekcji na `<section>` z osobnym tłem (np. czy ZAKRES zachowuje własne tło `bg-cream` jak dziś w Nadzorze, a "Dla kogo"/dodatkowe sekcje są na tle strony) - decyzja wizualna do dopracowania przy implementacji i porównaniu zrzutów ekranu (`/agent-browser`), nie do sztywnego ustalenia w planie.
- Dokładne nazwy pomocniczych komponentów wewnątrz `SubpageLayout.tsx` (np. `BulletList`, `ScopeCard`) - do ustalenia przy pisaniu kodu.

## Implementation Units

---

- [x] **Unit 1: Nowe pola na `ServicePage` - "Dla kogo?" i "Dodatkowe sekcje", odsłonięcie pól ZAKRES dla wszystkich podstron**

**Cel:** Panel admina Payload udostępnia pola potrzebne do R1, R4, R9 i usuwa ograniczenie, które dziś chowa ikonę/opis ZAKRES dla Konstrukcje Stalowe i Meble Premium.

**Wymagania:** R1, R4, R7, R9

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/collections/ServicePage.ts`
- Stwórz: `src/components/admin/AdditionalSectionRowLabel.tsx`
- Regeneruj: `src/payload-types.ts` (`pnpm generate:types`)

**Podejście:**
- Usuń `admin.condition: (data) => data?.slug === 'nadzor-spawalniczy'` z pól `icon`, `description`, `modalDescription` wewnątrz `scopeItems` (linie ok. 100, 117, 125) - zostają widoczne dla wszystkich 3 slugów. Nie zmieniaj nazw pól ani ich typu.
- Dodaj pole `audienceTitle` (`text`, `defaultValue: 'Dla kogo?'`, label np. "Tytuł sekcji 'Dla kogo?'") zaraz po `scopeItems` lub przed nim - o kolejności w adminie decyduje kolejność renderowania na froncie (Dla kogo przed Zakres).
- Dodaj pole `audienceItems` (`array`, fields: `[{ name: 'text', type: 'text', required: true }]`) z `admin.components.RowLabel` wskazującym na istniejący `@/components/admin/ScopeItemRowLabel` (jego logika `data?.text || Punkt N` pasuje bez zmian).
- Dodaj pole `additionalSections` (`array`, fields: `[{ name: 'title', type: 'text', required: true }, { name: 'items', type: 'array', fields: [{ name: 'text', type: 'text', required: true }], admin: { components: { RowLabel: '@/components/admin/ScopeItemRowLabel' } } }]`), z własnym `admin.components.RowLabel: '@/components/admin/AdditionalSectionRowLabel'` na poziomie sekcji (etykieta po `title`, fallback `Sekcja N`).
- `AdditionalSectionRowLabel.tsx` - kopia wzorca `ScopeItemRowLabel.tsx`, czyta `data?.title` zamiast `data?.text`.
- Po zapisaniu zmian uruchom `pnpm generate:types` (Windows: `$env:NODE_OPTIONS="--use-system-ca"; pnpm generate:types`).

**Wzorce do naśladowania:**
- `src/components/admin/ScopeItemRowLabel.tsx` - wzorzec RowLabel do skopiowania dla `AdditionalSectionRowLabel.tsx`
- `src/collections/ServicePage.ts:46-130` - istniejący `array` field `scopeItems` jako wzorzec konfiguracji (`admin.components.RowLabel`, struktura `fields`)

**Scenariusze testowe:**
- [E2E] W panelu admina, edycja dokumentu `konstrukcje-stalowe`: pola `Ikonka`, `Opis punktu`, `Rozwinięty opis` w `scopeItems` są widoczne (dziś ukryte)
- [E2E] Dodanie wiersza do `additionalSections` z tytułem "Test" i jednym punktem listy - zapis się powodzi, RowLabel w adminie pokazuje "Test"
- [E2E] Pusta sekcja `additionalSections` (bez tytułu) - walidacja Payload blokuje zapis (`title` required)

**Weryfikacja:**
- `pnpm generate:types` kończy się bez błędów
- `ServicePage` w `payload-types.ts` zawiera `audienceTitle`, `audienceItems`, `additionalSections` z oczekiwanymi typami

---

- [x] **Unit 2: Aktualizacja mapowania danych i typów (`servicePageData.ts`)**

**Cel:** Dane z nowych pól Payload docierają do komponentu frontendowego w gotowym do renderowania kształcie.

**Wymagania:** R1, R4, R9

**Zależności:** Unit 1 (wymaga zaktualizowanych typów `payload-types.ts`)

**Pliki:**
- Modyfikuj: `src/lib/servicePageData.ts`
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx` (tylko interfejs `SubpageLayoutProps` - reszta w Unit 3/4)

**Podejście:**
- Rozszerz `SubpageLayoutProps['items']` o `icon?: string | null` (dziś typ jest w `SubpageLayout.tsx` bez tego pola, mimo że `toSubpageLayoutProps` już je zwraca - to była niejawna zgodność strukturalna dzięki `NadzorLayoutProps`, teraz trzeba ją zadeklarować wprost).
- Dodaj do `SubpageLayoutProps`: `audience?: { title: string; items: { text: string }[] } | null` i `additionalSections?: { title: string; items: { text: string }[] }[]`.
- W `toSubpageLayoutProps()`: zmapuj `page.audienceTitle`/`page.audienceItems` na `audience` (pomiń/`null`, gdy `audienceItems` puste lub brak); zmapuj `page.additionalSections` na `additionalSections`, filtrując sekcje bez punktów listy.
- Nie zmieniaj sygnatury `toRealizacjeProps()`.

**Wzorce do naśladowania:**
- `src/lib/servicePageData.ts:9-29` - istniejący wzorzec `toSubpageLayoutProps` (mapowanie z fallbackiem)

**Scenariusze testowe:**
- [Unit] `toSubpageLayoutProps` z dokumentem mającym `audienceItems: []` zwraca `audience: null` (sekcja ma się chować)
- [Unit] `toSubpageLayoutProps` z dokumentem mającym wypełnione `additionalSections` zwraca tablicę z poprawną liczbą sekcji i punktów
- [Unit] `toSubpageLayoutProps(undefined, fallback)` nadal zwraca `fallback` bez rzucania błędu (regresja istniejącego zachowania)

**Weryfikacja:**
- TypeScript kompiluje się bez błędów na `SubpageLayoutProps` i `toSubpageLayoutProps`

---

- [x] **Unit 3: Scalenie layoutu - kafelki ZAKRES w jednej kolumnie, `ModalProvider`, usunięcie `NadzorLayout.tsx`**

**Cel:** Sekcja ZAKRES na wszystkich 3 podstronach wygląda i zachowuje się identycznie: kafelki z ikoną i tytułem, bez opisu na karcie, klik otwiera modal.

**Wymagania:** R2, R3, R6

**Zależności:** Unit 2

**Pliki:**
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx`
- Usuń: `src/components/mcraft/NadzorLayout.tsx`

**Podejście:**
- Owiń całą zawartość `SubpageLayout` w `<ModalProvider>` (dziś robi to tylko `NadzorLayout`).
- Przenieś z `NadzorLayout.tsx` do `SubpageLayout.tsx`: funkcję `ScopeIcon` (ikona lub romb-fallback), import `ICON_REGISTRY`, `ModalTrigger`.
- Zastąp obecną listę punktowaną ZAKRES (`SubpageLayout.tsx:89-98`, `grid-rows-3 grid-flow-col`) kartami z `NadzorLayout.tsx:99-138`, ale zmień `grid-cols-2` na układ jednokolumnowy (pionowy stos, np. `flex flex-col gap-[18px]`) - to jest literalna realizacja prośby klienta o "jedną kolumnę".
- Karta NIE renderuje już `item.description` pod tytułem (usuń ten fragment z przeniesionego JSX - to dokładnie to, co pokazuje screenshot klienta jako "do usunięcia"). `description`/`modalDescription` trafiają wyłącznie do `content` przekazywanego w `ModalTrigger`.
- Zachowaj warunek: kafelek bez `description` renderuje się jako zwykły `<div>` (nieklikalny), kafelek z `description` jako `<ModalTrigger modalKey="scope">`.
- Usuń plik `NadzorLayout.tsx` po przeniesieniu logiki.

**Wzorce do naśladowania:**
- `src/components/mcraft/NadzorLayout.tsx:11-15` (`ScopeIcon`), `95-140` (karty ZAKRES) - źródło przenoszonej logiki
- `src/components/mcraft/ModalProvider.tsx:250-259` (`ModalScopeContent`) - już gotowe, bez zmian

**Scenariusze testowe:**
- [E2E] `/konstrukcje-stalowe` - sekcja ZAKRES pokazuje kafelki w jednej kolumnie (nie w gridzie 2-kolumnowym), z ikoną i tytułem, bez tekstu opisu widocznego na karcie
- [E2E] Kliknięcie kafelka z ustawionym `modalDescription` otwiera modal z pełną treścią; `Escape` i klik w tło zamykają modal
- [E2E] Kafelek bez opisu nie reaguje na kliknięcie (brak pustego modala, brak `cursor-pointer`)
- [E2E] `/nadzor-spawalniczy` renderuje się identycznie jak przed zmianą (ta sama logika, teraz współdzielona)

**Weryfikacja:**
- `pnpm lint` i `pnpm build` bez błędów
- Wizualne porównanie (`/agent-browser` screenshot) trzech podstron - kafelki ZAKRES wyglądają tak samo

---

- [ ] **Unit 4: Renderowanie sekcji "Dla kogo?", "Dodatkowe sekcje" i REALIZACJE bez placeholderów**

**Cel:** Pełna kolejność sekcji z R1/R4/R5 działa na wszystkich 3 podstronach: Dla kogo → Zakres → dodatkowe sekcje → Realizacje.

**Wymagania:** R1, R4, R5, R6

**Zależności:** Unit 3

**Pliki:**
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx`

**Podejście:**
- Dodaj lokalny (nieeksportowany) komponent `BulletList({ title, items }: { title: string; items: { text: string }[] })` w `SubpageLayout.tsx` - renderuje `<h2>` + `<ul>` jednokolumnową z rombowym znacznikiem (ten sam wizualny język co dawny ZAKRES: `w-[9px] h-[9px] bg-accent rotate-45`), ale bez `grid-flow-col` - pojedyncza kolumna.
- Sekcja "Dla kogo?": renderuj `<BulletList title={audience.title} items={audience.items} />` tylko gdy `audience && audience.items.length > 0`, umieszczona przed ZAKRES.
- Sekcja "dodatkowe sekcje": `additionalSections?.map((section) => <BulletList key={...} title={section.title} items={section.items} />)`, umieszczona po ZAKRES, w kolejności z tablicy (kolejność ustala admin przez drag&drop w panelu Payload array field).
- Sekcja REALIZACJE: zamień warunek renderowania z "zawsze, fallback 3 placeholderów" (`SubpageLayout.tsx:101-130`) na wzorzec z `NadzorLayout.tsx:143-170` (`{realizacje && realizacje.length > 0 && (...)}`, bez fallbacku), umieszczona na samym końcu, po dodatkowych sekcjach.
- Usuń nieużywany po zmianie import/kod związany z placeholderami `ImageSlot` dla Realizacji, jeśli nic więcej go nie używa w tym pliku (sprawdź, `ImageSlot` jest nadal używany w kartach realizacji z brakującym `thumbnailUrl` - tego wywołania nie usuwaj).

**Wzorce do naśladowania:**
- `src/components/mcraft/NadzorLayout.tsx:143-170` - wzorzec warunkowego renderowania Realizacji bez fallbacku
- Dawny `SubpageLayout.tsx:91-97` (rombowy bullet) - wizualny język do zachowania w `BulletList`

**Scenariusze testowe:**
- [Unit] `SubpageLayout` z `audience: null` nie renderuje nagłówka "Dla kogo?" (test komponentu lub snapshot)
- [E2E] `/konstrukcje-stalowe` po wypełnieniu `audienceItems` i `additionalSections` w adminie pokazuje sekcje w kolejności: Dla kogo → Zakres → dodatkowe sekcje → Realizacje
- [E2E] `/nadzor-spawalniczy` - sekcja Realizacje nie renderuje się w ogóle (nie tylko pusta) - sprawdź brak nagłówka "Realizacje" w DOM
- [E2E] Podstrona bez żadnych dodatkowych sekcji ani "Dla kogo" renderuje się bez błędów, pokazuje tylko Zakres (+ Realizacje jeśli dotyczy)

**Weryfikacja:**
- `pnpm lint` i `pnpm build` bez błędów
- Kolejność sekcji w DOM zgodna z R6 na wszystkich 3 podstronach

---

- [ ] **Unit 5: Podłączenie 3 podstron do wspólnego komponentu**

**Cel:** `nadzor-spawalniczy` renderuje się przez ten sam komponent co pozostałe dwie podstrony.

**Wymagania:** R6

**Zależności:** Unit 4

**Pliki:**
- Modyfikuj: `src/app/(frontend)/nadzor-spawalniczy/page.tsx`

**Podejście:**
- Zamień import `NadzorLayout` na `SubpageLayout` (`@/components/mcraft/SubpageLayout`).
- Zamień `<NadzorLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} />` na `<SubpageLayout {...toSubpageLayoutProps(docs[0], FALLBACK)} />` - bez przekazywania `realizacje` (jak dziś), więc sekcja Realizacje pozostaje nieobecna zgodnie z R5.
- `konstrukcje-stalowe/page.tsx` i `meble-premium/page.tsx` nie wymagają zmian (już renderują `SubpageLayout`).

**Wzorce do naśladowania:**
- `src/app/(frontend)/konstrukcje-stalowe/page.tsx` - docelowy kształt importu/renderowania, już obecny

**Scenariusze testowe:**
- [E2E] `/nadzor-spawalniczy` ładuje się bez błędów, `<h1>` zawiera "Nadzór" (rozszerzenie istniejącego testu w `tests/e2e/frontend.e2e.spec.ts`)
- [E2E] `/nadzor-spawalniczy` nie zawiera sekcji "Realizacje" w DOM

**Weryfikacja:**
- `pnpm build` bez błędów
- `tests/e2e/frontend.e2e.spec.ts` przechodzi dla wszystkich 3 podstron

---

- [ ] **Unit 6: Treść startowa dla Konstrukcje Stalowe i weryfikacja domyślnej ikony**

**Cel:** Konstrukcje Stalowe ma od razu wypełnione "Dla kogo?" i "Jak przygotować zapytanie?" zgodnie z treścią klienta (R8); istniejące kafelki ZAKRES mają ikonę zamiast pustego miejsca (R9).

**Wymagania:** R8, R9

**Zależności:** Unit 1 (nowe pola muszą istnieć w schemacie)

**Pliki:**
- Stwórz: `scripts/seed-service-sections.ts`

**Podejście:**
- Skrypt wzorowany na `scripts/seed-tiles.ts` (import `dotenv/config`, `getPayload`, `payload.config.js`) - znajduje dokument `service-pages` o `slug: 'konstrukcje-stalowe'` i aktualizuje go `payload.update()` o:
  - `audienceTitle: 'Dla kogo?'`, `audienceItems`: `Zakłady produkcyjne`, `Firmy budowlane i wykonawcy`, `Inwestorzy prywatni`, `Projektanci i architekci` (dokładna treść z `opis dodatkowych zmian.docx`)
  - `additionalSections`: jedna sekcja `{ title: 'Jak przygotować zapytanie?', items: [rodzaj konstrukcji, rysunki lub szkice, podstawowe wymiary, przewidywane obciążenia, miejsce użytkowania: wewnątrz czy na zewnątrz, wymagany materiał, sposób zabezpieczenia powierzchni, miejsce dostawy, informacja czy potrzebny jest montaż, planowany termin] } (dokładna treść z dokumentu klienta)
- **Nie modyfikuj `scopeItems`** w tym skrypcie - update musi dotyczyć tylko nowych pól, żeby nie ryzykować nadpisania istniejącej treści ZAKRES.
- Przed pisaniem logiki backfillu ikony: sprawdź bezpośrednio w bazie (przez panel admina lub `payload.find`) czy istniejące wiersze `scopeItems` dla `konstrukcje-stalowe`/`meble-premium` już mają `icon: 'ShieldCheck'` (patrz "Odroczone do implementacji" - `defaultValue` mógł się już zaaplikować przy tworzeniu przez `/api/seed`). Jeśli tak - nic do zrobienia, R9 spełnione automatycznie przez sam fakt odsłonięcia pola w Unit 1. Jeśli nie - rozszerz skrypt o pętlę ustawiającą `icon: 'ShieldCheck'` dla każdego wiersza `scopeItems` bez ikony, dla obu slugów.
- Skrypt uruchamiany ręcznie raz (nie wpięty w żaden route ani cron).

**Wzorce do naśladowania:**
- `scripts/seed-tiles.ts` - struktura skryptu, import `payload.config.js`, wywołanie przez Local API
- `src/app/api/seed/route.ts:5-40` - źródło aktualnej treści `scopeItems` dla `konstrukcje-stalowe` (do zachowania bez zmian)

**Scenariusze testowe:**
- [E2E] Po uruchomieniu skryptu, `/konstrukcje-stalowe` pokazuje sekcję "Dla kogo?" z 4 wypunktowanymi pozycjami zgodnymi z dokumentem klienta
- [E2E] `/konstrukcje-stalowe` pokazuje sekcję "Jak przygotować zapytanie?" z 10 punktami w kolejności z dokumentu
- [E2E] Kafelki ZAKRES na `/konstrukcje-stalowe` i `/meble-premium` pokazują ikonę (nie puste miejsce) po wdrożeniu

**Weryfikacja:**
- Ponowne uruchomienie skryptu jest bezpieczne (idempotentne - nie duplikuje sekcji, nadpisuje tylko `audienceTitle`/`audienceItems`/`additionalSections`)
- `scopeItems.text` na obu podstronach identyczne jak przed uruchomieniem skryptu

---

## Wpływ systemowy

- **Graf interakcji:** `ModalProvider` obejmuje teraz całość każdej z 3 podstron usług (dziś tylko Nadzór) - `ModalTrigger` używany w kartach ZAKRES na Konstrukcje Stalowe/Meble Premium pierwszy raz. Sam `ModalProvider`/`ModalScopeContent` nie wymaga zmian, tylko szerszego zasięgu użycia.
- **Propagacja błędów:** Brak nowych zewnętrznych zależności ani wywołań sieciowych - błędy ograniczone do walidacji Payload (pola `required`) i standardowego renderowania Next.js.
- **Ryzyka cyklu życia stanu:** Brak - strony są `force-dynamic`, bez cache po stronie klienta dla tych danych.
- **Parytet surface API:** `src/app/api/seed/route.ts` pozostaje nietknięty w tym planie (świadomie, patrz Kluczowe decyzje) - jeśli w przyszłości ktoś doda tam `scopeItems`/nowe pola, ryzyko nadpisania treści admina wraca. Warto to odnotować jako osobny temat do rozważenia (poza scope'em tego planu).
- **Pokrycie integracyjne:** Scenariusz "dokument `ServicePage` bez żadnych nowych pól" (istniejące produkcyjne dane przed migracją) musi renderować się identycznie jak dziś dla ZAKRES/Realizacje - pokryty przez Unit 2 (test `toSubpageLayoutProps` na starym kształcie danych) i Unit 4 (E2E "bez dodatkowych sekcji").

## Ryzyka i zależności

- **`icon.defaultValue` może już być zapisany w bazie dla części dokumentów, ale nie dla wszystkich** (np. jeśli ktoś ręcznie edytował dokument przez Local API/skrypt pomijający `defaultValue`) - Unit 6 musi to zweryfikować przed założeniem, że backfill jest zbędny.
- **Kolejność `additionalSections` w adminie = kolejność na stronie** - to zależy od naturalnego zachowania Payload `array` field (drag&drop reorder), nie wymaga dodatkowego pola `order` - do potwierdzenia że domyślne zachowanie Payload array field wystarcza (powinno, ale warto zweryfikować wizualnie po zapisaniu kilku sekcji w innej kolejności).
- **Zagnieżdżony `array` w `array`** (`additionalSections.items`) to pierwszy taki przypadek w tym repo (potwierdzone researchiem - wszystkie 7 istniejących pól `array` są płaskie) - nie ma lokalnego wzorca do skopiowania 1:1, tylko ogólna dokumentacja Payload (`.claude/skills/payload/reference/FIELDS.md`). Warto to zweryfikować szybkim testem w adminie zaraz po Unit 1, zanim zbuduje się na tym reszta planu.
- **Sekwencja:** Unit 1 → Unit 2 → Unit 3 → Unit 4 → Unit 5 (ściśle liniowo, każdy zależy od poprzedniego). Unit 6 zależy tylko od Unit 1, może iść równolegle z Unit 2-5.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md](../dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md)
- Powiązany plan: [docs/plans/2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md](2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md)
- Kolekcja: `src/collections/ServicePage.ts`
- Komponent: `src/components/mcraft/SubpageLayout.tsx` (docelowo jedyny, po usunięciu `NadzorLayout.tsx`)
- Mapowanie danych: `src/lib/servicePageData.ts`
- Źródło wymagań klienta: `opis dodatkowych zmian.docx` (root projektu)
