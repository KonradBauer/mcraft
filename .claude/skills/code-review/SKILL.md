---
name: code-review
description: "Przeprowadza strukturalne code review — wykrywa stack projektu z CLAUDE.md/package.json i dobiera checklisty. Używaj przy przeglądaniu PR, ocenie implementacji fazy/etapu, weryfikacji zgodności z planem. Generuje raport z klasyfikacją problemów (krytyczne/poważne/drobne/sugestie)."
---

# Code Review

Skill do strukturalnego code review. Workflow, klasyfikacja i zasady są uniwersalne; stack projektu WYKRYJ przed analizą.

## Krok 0: Wykryj stack projektu

1. Przeczytaj `CLAUDE.md` (architektura, konwencje) i `package.json` (dependencies).
2. Zbuduj listę technologii OBECNYCH w projekcie — tylko względem nich oceniaj kod.
3. **Twarda reguła:** nie flaguj braku technologii nieobecnych w package.json i nie proponuj ich dodania (np. brak Sentry/React Query nie jest findingiem, jeśli projekt ich nie używa).
4. Checklisty w `resources/` są warstwą projektową (wygenerowane dla konkretnego stacku — nagłówek pliku mówi którego). Stack projektu inny niż w checklistach → używaj sekcji uniwersalnych (React, Async, TypeScript, Testy, Security, a11y), sekcje backend/framework oceniaj przez analogię do wykrytego stacku.

## Kiedy używać

- Review zmian po zakończeniu fazy/etapu zadania
- Przeglądanie Pull Requestów
- Weryfikacja implementacji przed merge
- Audyt jakości kodu

## Workflow

### Krok 1: Zbierz kontekst i zakres

1. **Co miało być zrobione?** — przeczytaj plan/zadanie/specyfikację (docs/active/, docs/plans/ gdy istnieją).
2. **Jakie pliki się zmieniły?** — wyznacz zakres w tej kolejności:
   - Review PR/brancha → `git diff main...HEAD --name-only`
   - Review fazy zadania → commity z messages zawierającymi `([nazwa-zadania])` (procedura jak w /dev-docs-review)
   - Review niezacommitowanej pracy → `git status` + `git diff`
   - Zakres niejasny → zapytaj usera, NIE review'uj całego repo
3. **Reguły projektu:** przeczytaj `CLAUDE.md` i `.claude/rules/coding-rules.md` — naruszenia reguł projektu to findings.

### Krok 2: Wybierz checklisty

Na podstawie zmienionych plików załaduj odpowiednie sekcje z `resources/tech-stack-checklist.md`. Tabela poniżej to przykład mapowania dla stacku Next.js+Payload — przy innym stacku mapuj analogicznie (pliki frontendowe→sekcje UI/frameworka, pliki backendu→sekcja backendu, testy→Testy, infra→Deployment):

| Pliki | Sekcje do sprawdzenia |
|-------|----------------------|
| `*.tsx`, `*.ts` w `src/` | React 19, TypeScript, Async/Race Conditions |
| `src/app/(frontend)/**` | Next.js App Router (server/client components, metadata, dynamic) |
| `src/collections/**`, `src/globals/**`, `payload.config.ts` | Payload CMS (access, hooks, upload, typy generowane) |
| Komponenty z `'use client'` | React 19 hooks, cleanup, granica server/client |
| `styles.css`, klasy Tailwind | Tailwind v4 (@theme, tokeny vs arbitrary values) |
| `tests/**` | Testy (asercje, AAA, mockowanie tylko zewnętrznych) |
| `Dockerfile`, `docker-compose.yml`, CI | Deployment (uprawnienia, volumes, env) |

Sekcje checklisty nieodpowiadające zmienionym plikom — pomiń.

### Krok 3: Analizuj kod

Dla każdego zmienionego pliku:

1. **Zgodność z planem** — realizuje wymagania?
2. **Poprawność** — błędy logiczne, edge cases?
3. **Bezpieczeństwo** — walidacja inputów, XSS, wycieki danych, access control w Payload (`access:` na kolekcjach), sekrety w kodzie?
4. **Wydajność** — N+1 (pętla z `payload.find`), bundle size, lazy loading, `depth` w zapytaniach Payload?
5. **Race conditions** — useEffect cleanup, AbortController, state machines dla async?
6. **Jakość** — czytelność, DRY vs prostota, nazewnictwo?
7. **Filozofia** — istniejący kod = surowe review; nowy izolowany = pragmatyczne

Techniki i przykłady feedbacku → `resources/review-patterns.md`
Częste błędy w tym stacku → `resources/common-issues.md`

### Krok 4: Klasyfikuj problemy

Mapowanie na skalę /dev-docs-review: 🔴=P1, 🟠=P2, 🟡=P3 (🔵 nie ma odpowiednika — sugestie nie wchodzą do severity gate).

````
🔴 [blocking] KRYTYCZNE — blokuje merge
   - Błędy bezpieczeństwa (XSS, injection, brak walidacji na granicy API)
   - Crash / utrata danych
   - Payload: kolekcja z danymi wrażliwymi bez `access` (domyślnie publiczne read!)
   - Payload: mutacje w hookach bez przekazania `req` (łamie atomowość transakcji)
   - Sekrety/klucze zacommitowane do repo
   - Złamane wymaganie z planu

🟠 [important] POWAŻNE — wymaga poprawy
   - N+1: `payload.find` w pętli zamiast jednego zapytania z `where in`
   - Zapytania bez `limit` na potencjalnie dużych kolekcjach
   - Problemy wydajnościowe (zbędne re-rendery, brak `sizes` na fill images)
   - Brak WCAG podstaw (alt, focus, kontrast)
   - Niespełnione wymagania niekrytyczne
   - `useEffect` z async bez AbortController / cleanup
   - Test osłabiony lub bez asercji
   - `any`, non-null assertion `!`, nieuzasadnione `as`

🟡 [nit] DROBNE — zalecane
   - Niespójność stylu, lepsze nazewnictwo
   - Brakujące typy zwracane funkcji publicznych
   - Przestarzałe wzorce React (forwardRef, Context.Provider)
   - Tailwind: arbitrary value tam gdzie istnieje token z @theme

🔵 [suggestion] SUGESTIE — opcjonalne
   - Alternatywne podejścia
   - Propozycje refaktoryzacji
````

### Krok 5: Wygeneruj raport

## Format raportu

````markdown
## Code Review: [nazwa fazy/zadania]

### Podsumowanie
[✅ gotowe / ⚠️ wymaga poprawek / ❌ wymaga znaczących zmian]

### Statystyki
- Plików sprawdzonych: X
- 🔴 [blocking]: X
- 🟠 [important]: X
- 🟡 [nit]: X
- 🔵 [suggestion]: X

### Problemy

#### 🔴 [blocking] Krytyczne
1. **[plik:linia]** — [opis]
   - Problem: [co jest źle + scenariusz awarii]
   - Rozwiązanie: [jak naprawić]

#### 🟠 [important] Poważne
[jak wyżej]

#### 🟡 [nit] Drobne
1. **[plik:linia]** — [opis]

#### 🔵 [suggestion] Sugestie
1. [propozycja]

### Co zrobiono dobrze
- [pozytywne aspekty — zawsze minimum 1, jeśli istnieje]

### Rekomendacja
- [ ] Gotowe do merge
- [ ] Wymaga drobnych poprawek
- [ ] Wymaga znaczących zmian
- [ ] Wymaga przeprojektowania
````

## Integracja z /dev-docs-review

`/dev-docs-review` orkiestruje multi-agent review faz zadań i używa skali P1/P2/P3 (mapowanie w Kroku 4). Ten skill służy do review standalone (PR, branch, ad hoc) — nie duplikuj obu na tych samych zmianach.

## Zasady

1. **Skup się na zakresie** — review'uj tylko wyznaczone zmiany; problemy zauważone poza zakresem oznacz `[poza zakresem]` zamiast pomijać lub dismissować jako "pre-existing"
2. **Bądź konkretny** — pliki, linie, scenariusz awarii
3. **Proponuj rozwiązania** — nie tylko wskazuj problemy
4. **Doceniaj** — zauważaj dobre rozwiązania
5. **Priorytetyzuj** — blocking > important > nit
6. **Istniejący kod = surowo** — każda dodana złożoność wymaga uzasadnienia
7. **Nowy izolowany kod = pragmatycznie** — działa i jest testowalne → nie blokuj postępu
8. **Duplication > Complexity** — prosta duplikacja lepsza niż złożona abstrakcja DRY
9. **5-sekundowa reguła** — nazwa funkcji/komponentu niezrozumiała w 5 sekund = zła nazwa
10. **Nie flaguj braku technologii, których projekt nie używa** (Sentry, React Query, Supabase, shadcn/ui)

## Dokumentacja referencyjna

- **Checklisty techniczne** → `resources/tech-stack-checklist.md`
- **Techniki feedbacku** → `resources/review-patterns.md`
- **Częste błędy** → `resources/common-issues.md`
