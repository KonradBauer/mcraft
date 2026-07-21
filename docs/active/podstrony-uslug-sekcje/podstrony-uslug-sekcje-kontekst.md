# Rozbudowa treści podstron usług — Kontekst

**Branch:** `feature/podstrony-uslug-sekcje`
**Ostatnia aktualizacja:** 2026-07-21

## Powiązane pliki

- `src/collections/ServicePage.ts` — kolekcja Payload; pole `scopeItems`, nowe pola `audienceTitle`/`audienceItems`/`additionalSections`
- `src/components/admin/ScopeItemRowLabel.tsx` — wzorzec RowLabel (`data?.text || Punkt N`), reużywany dla nowych list punktowanych
- `src/components/admin/AdditionalSectionRowLabel.tsx` — nowy, RowLabel dla sekcji dodatkowych (`data?.title || Sekcja N`)
- `src/components/admin/IconPickerField.tsx`, `src/lib/tileIcons.tsx` — lista 34 ikon (zduplikowana w dwóch miejscach, trzymać w synchronizacji)
- `src/lib/servicePageData.ts` — `toSubpageLayoutProps()`, `toRealizacjeProps()` — mapowanie Payload → propsy komponentu
- `src/components/mcraft/SubpageLayout.tsx` — docelowo jedyny komponent layoutu podstron usług
- `src/components/mcraft/NadzorLayout.tsx` — do usunięcia po przeniesieniu logiki do `SubpageLayout.tsx`
- `src/components/mcraft/ModalProvider.tsx` — `ModalScopeContent` (linie 250-259), gotowe bez zmian
- `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — routing stron
- `src/app/api/seed/route.ts` — istniejący seed `ServicePage` (NIE modyfikować w tym zadaniu — ryzyko nadpisania treści admina, patrz Decyzje techniczne)
- `scripts/seed-tiles.ts`, `scripts/seed-cv.ts` — wzorzec jednorazowych skryptów seedujących
- `scripts/seed-service-sections.ts` — nowy, jednorazowy skrypt treści startowej Konstrukcje Stalowe
- `src/payload-types.ts` — auto-generowany (`pnpm generate:types`), nie edytować ręcznie
- `tests/e2e/frontend.e2e.spec.ts` — istniejące testy Playwright, do rozszerzenia

## Decyzje techniczne

- **Scalenie `NadzorLayout.tsx` do `SubpageLayout.tsx`, usunięcie pliku `NadzorLayout.tsx`**: R6 wymaga identycznego layoutu na 3 podstronach — dwa pliki różniące się już tylko renderowaniem ZAKRES/Realizacje to czysty dług, nie uzasadniona duplikacja.
- **Cały `SubpageLayout` owinięty w `ModalProvider`**: dziś robi to tylko `NadzorLayout`; po scaleniu kafelki ZAKRES z modalem są na wszystkich 3 podstronach.
- **Sekcja Realizacje: usunięcie fallbacku 3 placeholderów, przejście na wzorzec Nadzoru** (`realizacje && realizacje.length > 0`, bez fallbacku) — Portfolio jest realnym źródłem danych, fałszywe placeholdery mylą bardziej niż brak sekcji.
- **Nowe pola na `ServicePage` dodane obok `scopeItems`, bez migracji danych**: `audienceTitle`/`audienceItems` dla "Dla kogo?", `additionalSections` (array `{title, items: array<{text}>}`) dla sekcji dodatkowych. Zgodne z ustalonym w repo wzorcem addytywnych zmian schematu (precedens: `galleryImages` zostało w schemacie ServicePage mimo wycofania z renderowania w poprzednim planie).
- **Usunięcie `admin.condition` z `icon`/`description`/`modalDescription` w `scopeItems`**: jedyna zmiana realnie odsłaniająca te pola dla Konstrukcje Stalowe/Meble Premium w panelu.
- **Domyślna ikona placeholder = `ShieldCheck`**: to już `defaultValue` pola `icon` w schemacie. Sprawdzić w bazie przed pisaniem backfillu — `defaultValue` mógł się już zaaplikować przy tworzeniu dokumentów przez `/api/seed`.
- **Bullet listy "Dla kogo?" i "dodatkowe sekcje" w jednej kolumnie, nie w gridzie 2-kolumnowym** — klient wprost poprosił o rezygnację z układu 2-kolumnowego dla list z rombowymi znacznikami.
- **Treść seedowa (Konstrukcje Stalowe) przez osobny, ręcznie uruchamiany skrypt `scripts/seed-service-sections.ts`, nie przez `src/app/api/seed/route.ts`** — ten route to publiczny, nieautoryzowany GET, który przy każdym wywołaniu nadpisuje `scopeItems` z hardcodowanej tablicy; dopisanie tam nowej treści ryzykowałoby zresetowanie ręcznych zmian admina.
- **Model danych `additionalSections`: zagnieżdżony `array` (nie `blocks`)** — w repo nie ma dziś ani jednego pola `blocks`; wymaganie świadomie ograniczone do jednego prostego typu treści.

(Pełne uzasadnienia i alternatywy rozważone podczas planowania: zob. plan techniczny.)

## Zależności

- Sekwencja ścisła: Faza 1 → Faza 2 → Faza 3 → Faza 4 → Faza 5 (każda zależy od poprzedniej).
- Faza 6 zależy tylko od Fazy 1 (nowe pola muszą istnieć w schemacie), może iść równolegle z Fazami 2-5.
- Po każdej zmianie schematu w Fazie 1: `pnpm generate:types` (Windows: `$env:NODE_OPTIONS="--use-system-ca"; pnpm generate:types`) musi przejść przed rozpoczęciem Fazy 2.
- Zagnieżdżony `array` w `array` (`additionalSections.items`) to pierwszy taki przypadek w tym repo — **potwierdzone w Fazie 1**: `pnpm generate:types` wygenerował poprawny zagnieżdżony typ (`additionalSections: { title: string; items?: { text: string; id?: string|null }[] | null; id?: string|null }[]`) bez żadnych problemów. Ryzyko z planu nie zmaterializowało się.

## Notatki z sesji

- **Faza 1 (2026-07-21):** ukończona. Schema `ServicePage` rozszerzona, `admin.condition` usunięty z `icon`/`description`/`modalDescription`, `pnpm generate:types` przeszedł czysto. 3 zadania `(ręczne)` (weryfikacja w panelu admina) czekają na użytkownika — nie były częścią automatycznej weryfikacji tej fazy.
- **Faza 2 (2026-07-21):** ukończona. `SubpageLayoutProps` rozszerzone o `icon`, `audience`, `additionalSections`; `toSubpageLayoutProps()` mapuje nowe pola z filtrowaniem pustych sekcji/punktów. Testy jednostkowe w `tests/int/servicePageData.int.spec.ts` (6 przypadków, nie wymagają MongoDB — czysta transformacja danych) — rozszerzone ponad checklistę o 2 dodatkowe przypadki brzegowe (brak `audienceItems` w ogóle, filtrowanie sekcji dodatkowych bez punktów) dla lepszego pokrycia tej samej logiki filtrującej.

## Źródła

- Requirements doc: [docs/dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md](../../dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md)
- Plan techniczny: [docs/plans/2026-07-21-004-feat-podstrony-uslug-sekcje-plan.md](../../plans/2026-07-21-004-feat-podstrony-uslug-sekcje-plan.md)
