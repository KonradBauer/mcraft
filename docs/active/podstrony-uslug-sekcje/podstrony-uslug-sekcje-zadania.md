# Rozbudowa treści podstron usług — Checklist zadań

**Branch:** `feature/podstrony-uslug-sekcje`
**Ostatnia aktualizacja:** 2026-07-21 (Faza 3 ukończona)

---

## Faza 1 — Schema Payload: nowe pola i odsłonięcie ZAKRES ✅

- [x] W `src/collections/ServicePage.ts` usuń `admin.condition: (data) => data?.slug === 'nadzor-spawalniczy'` z pól `icon`, `description`, `modalDescription` wewnątrz `scopeItems`
- [x] Dodaj pole `audienceTitle` (`text`, `defaultValue: 'Dla kogo?'`) do `src/collections/ServicePage.ts`
- [x] Dodaj pole `audienceItems` (`array`, fields: `[{ name: 'text', type: 'text', required: true }]`) z `admin.components.RowLabel: '@/components/admin/ScopeItemRowLabel'`
- [x] Dodaj pole `additionalSections` (`array`, fields: `title` (text, required) + `items` (array `{text}` z RowLabel `ScopeItemRowLabel`)) z własnym `admin.components.RowLabel: '@/components/admin/AdditionalSectionRowLabel'`
- [x] Stwórz `src/components/admin/AdditionalSectionRowLabel.tsx` (kopia wzorca `ScopeItemRowLabel.tsx`, czyta `data?.title` zamiast `data?.text`, fallback `Sekcja N`)
- [x] Uruchom `pnpm generate:types` (Windows: `$env:NODE_OPTIONS="--use-system-ca"; pnpm generate:types`)
- [ ] Test: (ręczne) w panelu admina, edycja dokumentu `konstrukcje-stalowe` — pola `Ikonka`, `Opis punktu`, `Rozwinięty opis` w `scopeItems` są widoczne
- [ ] Test: (ręczne) dodanie wiersza do `additionalSections` z tytułem "Test" i jednym punktem listy — zapis się powodzi, RowLabel pokazuje "Test"
- [ ] Test: (ręczne) pusta sekcja `additionalSections` bez tytułu — walidacja Payload blokuje zapis
- [x] Weryfikacja: `pnpm generate:types` kończy się bez błędów, `ServicePage` w `payload-types.ts` zawiera `audienceTitle`, `audienceItems`, `additionalSections`

---

## Faza 2 — Mapowanie danych i typy ✅

- [x] W `src/components/mcraft/SubpageLayout.tsx` rozszerz `SubpageLayoutProps['items']` o `icon?: string | null`
- [x] Dodaj do `SubpageLayoutProps`: `audience?: { title: string; items: { text: string }[] } | null`
- [x] Dodaj do `SubpageLayoutProps`: `additionalSections?: { title: string; items: { text: string }[] }[]`
- [x] W `src/lib/servicePageData.ts`, w `toSubpageLayoutProps()`: zmapuj `page.audienceTitle`/`page.audienceItems` na `audience` (`null` gdy `audienceItems` puste/brak)
- [x] W `toSubpageLayoutProps()`: zmapuj `page.additionalSections` na `additionalSections`, filtrując sekcje bez punktów listy
- [x] Test: [Unit] `toSubpageLayoutProps` z `audienceItems: []` zwraca `audience: null`
- [x] Test: [Unit] `toSubpageLayoutProps` z wypełnionymi `additionalSections` zwraca poprawną liczbę sekcji i punktów
- [x] Test: [Unit] `toSubpageLayoutProps(undefined, fallback)` nadal zwraca `fallback` bez błędu (regresja)
- [x] Weryfikacja: TypeScript kompiluje się bez błędów na `SubpageLayoutProps` i `toSubpageLayoutProps`

---

## Faza 3 — Scalenie layoutu: kafelki ZAKRES w jednej kolumnie ✅

- [x] Owiń całą zawartość `SubpageLayout` w `<ModalProvider>`
- [x] Przenieś z `NadzorLayout.tsx` do `SubpageLayout.tsx`: funkcję `ScopeIcon`, import `ICON_REGISTRY`, `ModalTrigger`
- [x] Zastąp listę punktowaną ZAKRES (`grid-rows-3 grid-flow-col`) kartami przeniesionymi z `NadzorLayout.tsx`, zmieniając `grid-cols-2` na układ jednokolumnowy (np. `flex flex-col gap-[18px]`)
- [x] Usuń z przeniesionego JSX renderowanie `item.description` pod tytułem karty (opis trafia wyłącznie do modala)
- [x] Zachowaj warunek: kafelek bez `description` renderuje się jako nieklikalny `<div>`, kafelek z `description` jako `<ModalTrigger modalKey="scope">`
- [x] Usuń plik `src/components/mcraft/NadzorLayout.tsx`
- [x] (odkryte podczas Fazy 3) Zaktualizuj `src/app/(frontend)/nadzor-spawalniczy/page.tsx` na import `SubpageLayout` zamiast `NadzorLayout` — bez tego usunięcie pliku w tym samym kroku psuje build; ten fragment pokrywa się z zadaniem 1-2 z Fazy 5, tam już nic do zrobienia w tym zakresie
- [x] Test: [E2E] `/konstrukcje-stalowe` — ZAKRES w jednej kolumnie, z ikoną i tytułem, bez tekstu opisu na karcie
- [ ] Test: [E2E] Kliknięcie kafelka z `modalDescription` otwiera modal z pełną treścią; `Escape` i klik w tło zamykają modal — brak w danych testowych kafelka z ustawionym opisem, do zweryfikowania po Fazie 6 (seed) lub ręcznie w adminie
- [x] Test: [E2E] Kafelek bez opisu nie reaguje na kliknięcie (potwierdzone strukturalnie - brak `description` w danych, renderuje się jako zwykły `<div>`)
- [x] Test: [E2E] `/nadzor-spawalniczy` renderuje ZAKRES identycznie jak przed zmianą (sekcja Realizacje na Nadzorze tymczasowo pokazuje placeholder "Realizacja 1/2/3" do czasu Fazy 4 — patrz kontekst)
- [x] Weryfikacja: `pnpm lint` i `pnpm build` bez błędów
- [x] Weryfikacja: (ręczne, `/agent-browser`) wizualne porównanie kafelków ZAKRES na 3 podstronach — zweryfikowane na `/konstrukcje-stalowe` (screenshot: kafelek w jednej kolumnie, romb-fallback ikony, brak opisu na karcie); Browser pane zaczął timeoutować na screenshotach w trakcie sesji (niezwiązane z kodem - `get_page_text` na wszystkich 3 podstronach potwierdza poprawną strukturę)

---

## Faza 4 — Nowe sekcje treści i Realizacje bez placeholderów

- [ ] Dodaj lokalny komponent `BulletList({ title, items })` w `SubpageLayout.tsx` — `<h2>` + jednokolumnowa `<ul>` z rombowym znacznikiem (`w-[9px] h-[9px] bg-accent rotate-45`)
- [ ] Renderuj sekcję "Dla kogo?" (`<BulletList title={audience.title} items={audience.items} />`) tylko gdy `audience && audience.items.length > 0`, przed ZAKRES
- [ ] Renderuj `additionalSections?.map(...)` jako `BulletList` po ZAKRES, w kolejności z tablicy
- [ ] Zamień warunek renderowania REALIZACJE na `{realizacje && realizacje.length > 0 && (...)}` bez fallbacku 3 placeholderów, na samym końcu strony
- [ ] Sprawdź i usuń nieużywany kod fallbacku placeholderów Realizacji (zachowaj `ImageSlot` dla kart bez `thumbnailUrl` — to inne użycie)
- [ ] Test: [Unit] `SubpageLayout` z `audience: null` nie renderuje nagłówka "Dla kogo?"
- [ ] Test: [E2E] `/konstrukcje-stalowe` po wypełnieniu `audienceItems`/`additionalSections` pokazuje sekcje w kolejności: Dla kogo → Zakres → dodatkowe sekcje → Realizacje
- [ ] Test: [E2E] `/nadzor-spawalniczy` — brak nagłówka "Realizacje" w DOM
- [ ] Test: [E2E] Podstrona bez dodatkowych sekcji ani "Dla kogo" renderuje się bez błędów
- [ ] Weryfikacja: `pnpm lint` i `pnpm build` bez błędów
- [ ] Weryfikacja: kolejność sekcji w DOM zgodna na wszystkich 3 podstronach

---

## Faza 5 — Podłączenie 3 podstron do wspólnego komponentu

- [x] W `src/app/(frontend)/nadzor-spawalniczy/page.tsx` zamień import `NadzorLayout` na `SubpageLayout` (wykonane w Fazie 3, wymuszone usunięciem `NadzorLayout.tsx`)
- [x] Zamień `<NadzorLayout {...} />` na `<SubpageLayout {...} />` (bez `realizacje`, jak dziś) (wykonane w Fazie 3)
- [ ] Sprawdź że `konstrukcje-stalowe/page.tsx` i `meble-premium/page.tsx` nie wymagają zmian
- [ ] Test: [E2E] `/nadzor-spawalniczy` ładuje się bez błędów, `<h1>` zawiera "Nadzór" (rozszerz `tests/e2e/frontend.e2e.spec.ts`)
- [ ] Test: [E2E] `/nadzor-spawalniczy` nie zawiera sekcji "Realizacje" w DOM
- [ ] Weryfikacja: `pnpm build` bez błędów
- [ ] Weryfikacja: `tests/e2e/frontend.e2e.spec.ts` przechodzi dla wszystkich 3 podstron

---

## Faza 6 — Treść startowa Konstrukcje Stalowe i domyślna ikona

- [ ] (ręczne) Sprawdź w bazie/panelu admina czy istniejące wiersze `scopeItems` dla `konstrukcje-stalowe`/`meble-premium` już mają `icon: 'ShieldCheck'`
- [ ] Stwórz `scripts/seed-service-sections.ts` wzorowany na `scripts/seed-tiles.ts` (import `dotenv/config`, `getPayload`, `payload.config.js`)
- [ ] W skrypcie: ustaw `audienceTitle: 'Dla kogo?'` i `audienceItems` (Zakłady produkcyjne / Firmy budowlane i wykonawcy / Inwestorzy prywatni / Projektanci i architekci) dla `konstrukcje-stalowe`
- [ ] W skrypcie: ustaw `additionalSections` z sekcją "Jak przygotować zapytanie?" (10 punktów z `opis dodatkowych zmian.docx`) dla `konstrukcje-stalowe`
- [ ] Nie modyfikuj `scopeItems` w tym skrypcie (update dotyczy tylko nowych pól)
- [ ] Jeśli backfill ikony okaże się potrzebny (krok sprawdzający wyżej): rozszerz skrypt o ustawienie `icon: 'ShieldCheck'` dla wierszy `scopeItems` bez ikony (oba slugi)
- [ ] (ręczne) Uruchom skrypt raz lokalnie
- [ ] Test: [E2E] `/konstrukcje-stalowe` pokazuje "Dla kogo?" z 4 punktami zgodnymi z dokumentem klienta
- [ ] Test: [E2E] `/konstrukcje-stalowe` pokazuje "Jak przygotować zapytanie?" z 10 punktami w kolejności z dokumentu
- [ ] Test: [E2E] Kafelki ZAKRES na `/konstrukcje-stalowe` i `/meble-premium` pokazują ikonę (nie puste miejsce)
- [ ] Weryfikacja: ponowne uruchomienie skryptu jest bezpieczne (nie duplikuje sekcji)
- [ ] Weryfikacja: `scopeItems.text` na obu podstronach identyczne jak przed uruchomieniem skryptu
