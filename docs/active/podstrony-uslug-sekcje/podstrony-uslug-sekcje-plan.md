# Rozbudowa treści podstron usług — Plan

**Branch:** `feature/podstrony-uslug-sekcje`
**Ostatnia aktualizacja:** 2026-07-21

## Cele i zakres

Trzy podstrony usług (Nadzór Spawalniczy, Konstrukcje Stalowe, Meble Premium) dostają jednolity układ treści: opcjonalna sekcja "Dla kogo?", sekcja ZAKRES jako kafelki z ikoną (bez opisu na karcie, opis w modalu), dowolna liczba sekcji dodatkowych dodawanych samodzielnie przez admina w panelu Payload, i sekcja REALIZACJE zawsze na końcu (poza Nadzorem, gdzie jej nie ma). Dziś Nadzór Spawalniczy renderowany jest osobnym, zduplikowanym komponentem (`NadzorLayout.tsx`) — zostaje scalony z `SubpageLayout.tsx`.

Granice scope'u:
- Nowe sekcje: wyłącznie tytuł + płaska wypunktowana lista tekstowa — bez rich text, obrazków, zagnieżdżonych list, bez systemu blokowego.
- Sekcja "Dla kogo?" to pojedynczy stały slot przed ZAKRES, nie repeater wielu sekcji przed ZAKRES.
- Brak zmian w kolekcji `Portfolio` i mechanice samej sekcji Realizacje.
- Dodawanie/usuwanie kafelków ZAKRES w adminie już działa — bez zmian.
- Brak wielojęzyczności.

## Fazy

### Faza 1 — Schema Payload: nowe pola i odsłonięcie ZAKRES

Cel: panel admina udostępnia pola "Dla kogo?" i "Dodatkowe sekcje", oraz przestaje ukrywać ikonę/opis ZAKRES dla Konstrukcje Stalowe i Meble Premium.

Kryteria akceptacji:
- `pnpm generate:types` przechodzi bez błędów, `ServicePage` zawiera `audienceTitle`, `audienceItems`, `additionalSections`.
- W panelu admina, na dokumencie `konstrukcje-stalowe`, pola `Ikonka`/`Opis punktu`/`Rozwinięty opis` w `scopeItems` są widoczne.

### Faza 2 — Mapowanie danych i typy

Cel: dane z nowych pól docierają do frontendu w gotowym do renderowania kształcie.

Kryteria akceptacji:
- `toSubpageLayoutProps` zwraca `audience: null` gdy `audienceItems` puste, i poprawną tablicę `additionalSections`.
- TypeScript kompiluje się bez błędów.

### Faza 3 — Scalenie layoutu: kafelki ZAKRES w jednej kolumnie

Cel: ZAKRES wygląda i zachowuje się identycznie na wszystkich 3 podstronach — kafelki z ikoną i tytułem w jednej kolumnie, bez opisu na karcie, klik otwiera modal. `NadzorLayout.tsx` znika, logika trafia do `SubpageLayout.tsx`.

Kryteria akceptacji:
- `pnpm lint` i `pnpm build` przechodzą.
- Kafelki ZAKRES na wszystkich 3 podstronach wyglądają identycznie (stos pionowy, ikona + tytuł, klik → modal gdy jest opis).

### Faza 4 — Nowe sekcje treści i Realizacje bez placeholderów

Cel: pełna kolejność sekcji działa: Dla kogo → Zakres → dodatkowe sekcje → Realizacje (Realizacje tylko na Konstrukcje Stalowe/Meble Premium).

Kryteria akceptacji:
- Kolejność sekcji w DOM zgodna z powyższą na wszystkich 3 podstronach.
- `/nadzor-spawalniczy` nie renderuje sekcji Realizacje w ogóle (nie tylko pustej).

### Faza 5 — Podłączenie 3 podstron do wspólnego komponentu

Cel: `nadzor-spawalniczy/page.tsx` renderuje ten sam komponent co pozostałe dwie podstrony.

Kryteria akceptacji:
- `pnpm build` przechodzi.
- Istniejące testy `tests/e2e/frontend.e2e.spec.ts` przechodzą dla wszystkich 3 podstron.

### Faza 6 — Treść startowa Konstrukcje Stalowe i domyślna ikona

Cel: Konstrukcje Stalowe ma od razu wypełnione "Dla kogo?" i "Jak przygotować zapytanie?" zgodnie z treścią klienta; kafelki ZAKRES bez wcześniejszej ikony mają ikonę placeholder.

Kryteria akceptacji:
- `/konstrukcje-stalowe` pokazuje "Dla kogo?" (4 punkty) i "Jak przygotować zapytanie?" (10 punktów) zgodnie z dokumentem klienta.
- Kafelki ZAKRES na Konstrukcje Stalowe i Meble Premium pokazują ikonę.

## Kryteria akceptacji całości

- Wszystkie 3 podstrony usług mają identyczny layout sekcji (poza obecnością Realizacji na Nadzorze).
- Admin może samodzielnie w panelu Payload dodać nową sekcję "tytuł + lista" bez zmian w kodzie.
- Zero utraty istniejącej treści `scopeItems` po wdrożeniu.
- `pnpm lint`, `pnpm build` i istniejące testy E2E przechodzą.

## Źródła

- Requirements doc: [docs/dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md](../../dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md)
- Plan techniczny: [docs/plans/2026-07-21-004-feat-podstrony-uslug-sekcje-plan.md](../../plans/2026-07-21-004-feat-podstrony-uslug-sekcje-plan.md)
