# Rozbudowa treści podstron usług — Checklist zadań

**Branch:** `feature/podstrony-uslug-sekcje`
**Ostatnia aktualizacja:** 2026-07-21

---

## Faza 1 — Schema Payload: nowe pola i odsłonięcie ZAKRES

- [ ] W `src/collections/ServicePage.ts` usuń `admin.condition: (data) => data?.slug === 'nadzor-spawalniczy'` z pól `icon`, `description`, `modalDescription` wewnątrz `scopeItems`
- [ ] Dodaj pole `audienceTitle` (`text`, `defaultValue: 'Dla kogo?'`) do `src/collections/ServicePage.ts`
- [ ] Dodaj pole `audienceItems` (`array`, fields: `[{ name: 'text', type: 'text', required: true }]`) z `admin.components.RowLabel: '@/components/admin/ScopeItemRowLabel'`
- [ ] Dodaj pole `additionalSections` (`array`, fields: `title` (text, required) + `items` (array `{text}` z RowLabel `ScopeItemRowLabel`)) z własnym `admin.components.RowLabel: '@/components/admin/AdditionalSectionRowLabel'`
- [ ] Stwórz `src/components/admin/AdditionalSectionRowLabel.tsx` (kopia wzorca `ScopeItemRowLabel.tsx`, czyta `data?.title` zamiast `data?.text`, fallback `Sekcja N`)
- [ ] Uruchom `pnpm generate:types` (Windows: `$env:NODE_OPTIONS="--use-system-ca"; pnpm generate:types`)
- [ ] Test: (ręczne) w panelu admina, edycja dokumentu `konstrukcje-stalowe` — pola `Ikonka`, `Opis punktu`, `Rozwinięty opis` w `scopeItems` są widoczne
- [ ] Test: (ręczne) dodanie wiersza do `additionalSections` z tytułem "Test" i jednym punktem listy — zapis się powodzi, RowLabel pokazuje "Test"
- [ ] Test: (ręczne) pusta sekcja `additionalSections` bez tytułu — walidacja Payload blokuje zapis
- [ ] Weryfikacja: `pnpm generate:types` kończy się bez błędów, `ServicePage` w `payload-types.ts` zawiera `audienceTitle`, `audienceItems`, `additionalSections`

---

## Faza 2 — Mapowanie danych i typy

- [ ] W `src/components/mcraft/SubpageLayout.tsx` rozszerz `SubpageLayoutProps['items']` o `icon?: string | null`
- [ ] Dodaj do `SubpageLayoutProps`: `audience?: { title: string; items: { text: string }[] } | null`
- [ ] Dodaj do `SubpageLayoutProps`: `additionalSections?: { title: string; items: { text: string }[] }[]`
- [ ] W `src/lib/servicePageData.ts`, w `toSubpageLayoutProps()`: zmapuj `page.audienceTitle`/`page.audienceItems` na `audience` (`null` gdy `audienceItems` puste/brak)
- [ ] W `toSubpageLayoutProps()`: zmapuj `page.additionalSections` na `additionalSections`, filtrując sekcje bez punktów listy
- [ ] Test: [Unit] `toSubpageLayoutProps` z `audienceItems: []` zwraca `audience: null`
- [ ] Test: [Unit] `toSubpageLayoutProps` z wypełnionymi `additionalSections` zwraca poprawną liczbę sekcji i punktów
- [ ] Test: [Unit] `toSubpageLayoutProps(undefined, fallback)` nadal zwraca `fallback` bez błędu (regresja)
- [ ] Weryfikacja: TypeScript kompiluje się bez błędów na `SubpageLayoutProps` i `toSubpageLayoutProps`

---

## Faza 3 — Scalenie layoutu: kafelki ZAKRES w jednej kolumnie

- [ ] Owiń całą zawartość `SubpageLayout` w `<ModalProvider>`
- [ ] Przenieś z `NadzorLayout.tsx` do `SubpageLayout.tsx`: funkcję `ScopeIcon`, import `ICON_REGISTRY`, `ModalTrigger`
- [ ] Zastąp listę punktowaną ZAKRES (`grid-rows-3 grid-flow-col`) kartami przeniesionymi z `NadzorLayout.tsx`, zmieniając `grid-cols-2` na układ jednokolumnowy (np. `flex flex-col gap-[18px]`)
- [ ] Usuń z przeniesionego JSX renderowanie `item.description` pod tytułem karty (opis trafia wyłącznie do modala)
- [ ] Zachowaj warunek: kafelek bez `description` renderuje się jako nieklikalny `<div>`, kafelek z `description` jako `<ModalTrigger modalKey="scope">`
- [ ] Usuń plik `src/components/mcraft/NadzorLayout.tsx`
- [ ] Test: [E2E] `/konstrukcje-stalowe` — ZAKRES w jednej kolumnie, z ikoną i tytułem, bez tekstu opisu na karcie
- [ ] Test: [E2E] Kliknięcie kafelka z `modalDescription` otwiera modal z pełną treścią; `Escape` i klik w tło zamykają modal
- [ ] Test: [E2E] Kafelek bez opisu nie reaguje na kliknięcie
- [ ] Test: [E2E] `/nadzor-spawalniczy` renderuje się identycznie jak przed zmianą
- [ ] Weryfikacja: `pnpm lint` i `pnpm build` bez błędów
- [ ] Weryfikacja: (ręczne, `/agent-browser`) wizualne porównanie kafelków ZAKRES na 3 podstronach — wyglądają tak samo

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

- [ ] W `src/app/(frontend)/nadzor-spawalniczy/page.tsx` zamień import `NadzorLayout` na `SubpageLayout`
- [ ] Zamień `<NadzorLayout {...} />` na `<SubpageLayout {...} />` (bez `realizacje`, jak dziś)
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
