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
- **Faza 3 (2026-07-21):** ukończona. **Luka w planie wykryta i naprawiona w miejscu:** Faza 3 kazała usunąć `NadzorLayout.tsx`, ale import w `nadzor-spawalniczy/page.tsx` miał zostać zaktualizowany dopiero w Fazie 5 — usunięcie pliku bez tej zmiany psuło build. Poprawka przeniesiona do Fazy 3 (jedyny sposób utrzymać zielony build między fazami); odpowiednie checkboxy w Fazie 5 oznaczone jako już zrobione, z odnośnikiem. `pnpm build` przechodzi, `pnpm exec tsc --noEmit` czysty.
  - **Tymczasowy stan między fazami:** `/nadzor-spawalniczy` do czasu Fazy 4 nadal pokazuje placeholder "Realizacja 1/2/3" (stara logika `SubpageLayout` renderuje Realizacje zawsze, z fallbackiem) — Faza 4 to naprawia (`realizacje && realizacje.length > 0`, bez fallbacku). To oczekiwane, nie regresja.
  - Browser pane (`/agent-browser`) zaczął timeoutować na `computer{action:"screenshot"}` w trakcie weryfikacji tej fazy (na wszystkich stronach, nawet niezmienionych) — potwierdzone jako problem środowiska/tool, nie kodu: `get_page_text` i `read_console_messages` działały poprawnie przez cały czas i potwierdziły oczekiwaną strukturę DOM na wszystkich 3 podstronach. Jeden udany zrzut ekranu przed wystąpieniem timeoutów potwierdził wizualnie: kafelek w jednej kolumnie, romb-fallback ikony (brak `icon` w danych seed), brak tekstu opisu na karcie.
- **Faza 4 (2026-07-21):** ukończona. Dodano `BulletList` (współdzielony przez "Dla kogo?" i sekcje dodatkowe), sekcja Realizacje zmieniona na `realizacje && realizacje.length > 0` bez fallbacku placeholderów. Naprawia tymczasowy stan z Fazy 3 - `/nadzor-spawalniczy` już nie pokazuje "Realizacja 1/2/3" (potwierdzone w przeglądarce przez `get_page_text`).
  - **Dwie dodatkowe poprawki konfiguracyjne odkryte podczas pisania testu komponentu** (poza checklistą, ale konieczne żeby test w ogóle dało się napisać/uruchomić): (1) `vitest.config.mts` `include` rozszerzony z `tests/int/**/*.int.spec.ts` na `tests/int/**/*.int.spec.{ts,tsx}` - test renderujący JSX wymaga `.tsx`; (2) w nowym pliku testowym dodany `afterEach(cleanup)` z `@testing-library/react` - bez tego kolejne `render()` w tym samym pliku kumulowały się w DOM (4 nakładające się `<h2>Zakres</h2>` przy 4. teście), co nie jest specyficzne dla tego testu, tylko ogólny wymóg RTL + vitest bez automatycznego cleanupu w `vitest.setup.ts`. Warto rozważyć dodanie `afterEach(cleanup)` globalnie w `vitest.setup.ts`, jeśli przyszłe testy komponentów będą częste - nie zrobione teraz, bo dotyczyłoby plików spoza tego zadania.
  - `toBeInTheDocument()`/`jest-dom` matchers NIE są zainstalowane w projekcie (`@testing-library/jest-dom` brak w `package.json`) - testy używają `toBeTruthy()`/`toBeNull()` zamiast tego, żeby nie dodawać nowej zależności bez pytania usera.
- **Faza 5 (2026-07-21):** ukończona. Import/routing wszystkich 3 podstron potwierdzony jednolity (zero różnic vs `main` dla `konstrukcje-stalowe`/`meble-premium/page.tsx`) - właściwa praca tej fazy wykonana już w Fazie 3. Dodano E2E test "brak sekcji Realizacje na Nadzorze" do `tests/e2e/frontend.e2e.spec.ts`.
  - **Odkryty pre-existing bug (poza scope tej fazy, zgłoszony jako osobne zadanie - task_bd7ad1c7):** test `subpage meble-premium loads` w `tests/e2e/frontend.e2e.spec.ts` failuje na `main` i na tym branchu identycznie - oczekuje `/Meble premium/` w tytule, a rzeczywisty tytuł to "Meble stalowe premium - loft i industrial | MCRAFT" (celowo ustawiony w commicie `fbd4edd` "remove duplicate MCRAFT suffix from page titles"). Niezwiązane z tym zadaniem, `meble-premium/page.tsx` nie był dotykany. Nie naprawione tutaj (poza scope), zgłoszone przez `spawn_task`.
- **Faza 6 (2026-07-21):** ukończona - ostatnia faza zadania. Kluczowe odkrycie: lokalna baza dev była całkowicie pusta (0 dokumentów `service-pages`) - strony renderowały się z hardcodowanego `FALLBACK` w każdym `page.tsx`, nie z bazy. Sekwencja wykonana: (1) diagnostyka programowa (tymczasowy skrypt, usunięty po użyciu) potwierdziła że baza jest pusta, (2) odpalono istniejący `src/app/api/seed/route.ts` (GET) żeby stworzyć bazowe dokumenty `ServicePage` - to bezpieczne na pustej bazie deweloperskiej (nie ma czyjejś ręcznej pracy do nadpisania), (3) ponowna diagnostyka potwierdziła: wszystkie pozycje `scopeItems` na `konstrukcje-stalowe`/`meble-premium` MAJĄ już `icon: "ShieldCheck"` - `defaultValue` pola zaaplikował się przy tworzeniu przez Local API mimo że pole było ukryte w UI, dokładnie jak przewidywał plan techniczny. Backfill ikony okazał się zbędny. (4) Uruchomiono `scripts/seed-service-sections.ts` - dodał `audienceTitle`/`audienceItems`/`additionalSections` dla `konstrukcje-stalowe`, nie ruszając `scopeItems`. Zweryfikowane w przeglądarce (`get_page_text`): pełna kolejność sekcji Dla kogo → Zakres → Jak przygotować zapytanie? zgodna z dokumentem klienta, słowo w słowo.
  - Skrypty seedujące w tym repo (Local API + `getPayload`) muszą kończyć się `process.exit(0)` - bez tego proces wisi w nieskończoność (otwarte połączenie MongoDB nie pozwala zamknąć event loopu). Ten sam wzorzec co `seed-tiles.ts`/`seed-cv.ts`, teraz też w `seed-service-sections.ts`.
  - Ta faza kończy całą listę zadań `podstrony-uslug-sekcje` - wszystkie 6 faz ukończone.

## Źródła

- Requirements doc: [docs/dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md](../../dev-brainstorms/2026-07-21-podstrony-uslug-rozbudowa-tresci-requirements.md)
- Plan techniczny: [docs/plans/2026-07-21-004-feat-podstrony-uslug-sekcje-plan.md](../../plans/2026-07-21-004-feat-podstrony-uslug-sekcje-plan.md)
