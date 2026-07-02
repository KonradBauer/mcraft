---
name: dev-docs-review
description: "Code review wykonanej fazy/etapu przez multi-agent analysis."
argument-hint: "[ścieżka-do-folderu] [numer-fazy]"
---

# Code Review fazy zadania

Pipeline: `/dev-docs-execute` (wykonanie fazy) → **`/dev-docs-review` (REVIEW FAZY)** → poprawki przez `/dev-docs-execute` lub kolejna faza.

Pięć równoległych perspektyw review + konsolidacja + severity gate + checkboxy poprawek.

## Zmienne

- ŚCIEŻKA_ZADANIA: $1
- NUMER_FAZY: $2

**Jeśli $1 puste:** `Glob docs/active/*/` — jeden katalog → użyj; wiele → zapytaj; zero → poinformuj i STOP.
**Jeśli $2 puste:** przyjmij ostatnią fazę oznaczoną ✅ w `*-zadania.md` (ona właśnie została ukończona i czeka na review). Żadna faza nie ma ✅ → zapytaj usera którą fazę review'ować.

## Klasyfikacja severity (jedyna obowiązująca)

- 🔴 `[P1-blocking]` — bug, luka bezpieczeństwa, złamanie wymagania; blokuje kontynuację
- 🟠 `[P2-important]` — realny problem do naprawy, nie blokuje natychmiast
- 🟡 `[P3-nit]` — sugestia, styl, drobiazg

## Kroki

### 1. Walidacja i zakres zmian fazy

1. Folder `$1/` nie istnieje → poinformuj i STOP.
2. Przeczytaj `Branch:` z dokumentacji zadania i nazwę zadania (z nazwy folderu).
3. **Wyznacz zakres zmian fazy — procedura:**
   a. `git log --oneline main..HEAD` (na branchu zadania)
   b. Odfiltruj commity fazy: messages zawierające `([nazwa-zadania])`, powstałe PO poprzednim review (jeśli istnieje `review-faza-[N-1].md`, bierz commity nowsze niż jego data; brak → wszystkie commity zadania)
   c. Zbuduj: LISTĘ PLIKÓW (`git diff --name-only <pierwszy-commit-fazy>^..HEAD` ograniczone do commitów fazy) i DIFF (`git diff <zakres>`)
   d. Zakres pusty lub niejednoznaczny → pokaż `git log --oneline -15` userowi i zapytaj o zakres (AskUserQuestion). NIE review'uj całego repo na ślepo.

### 2. Pakiet kontekstu

Przeczytaj z `$1/`: plan (cele, kryteria), zadania (co miało być zrobione w fazie $2), kontekst (decyzje).

Jeśli "Źródła" wskazują plan techniczny w `docs/plans/` — przeczytaj Implementation Unit odpowiadający fazie i wyciągnij: **Pliki** (w tym ścieżki testów), **Scenariusze testowe**, **Wzorce do naśladowania**.

**Zbuduj PAKIET KONTEKSTU** (wspólny prompt-fragment dla agentów):
- Lista plików zmienionych w fazie (z kroku 1)
- Zakres commitów (hashe)
- Cel fazy i zadania z checklisty
- Fragment Implementation Unit (jeśli jest): oczekiwane pliki, testy, wzorce

Subagent startuje bez kontekstu rozmowy — pakiet MUSI być kompletny i samowystarczalny.

### 3. Uruchom agentów review RÓWNOLEGLE (jedno wywołanie, 5 Agent calls)

**Agent 1 — Security:** `subagent_type: "security-sentinel"`
Prompt: PAKIET KONTEKSTU + "Zrób security review wyłącznie zmian z listy plików. Skup się na: auth, XSS, data exposure, walidacja inputów (Zod), ekspozycja kluczy/sekretów. Każde finding klasyfikuj: 🔴 [P1-blocking] / 🟠 [P2-important] / 🟡 [P3-nit], z plik:linia."

**Agent 2 — Performance:** `subagent_type: "performance-oracle"`
Prompt: PAKIET KONTEKSTU + "Zrób performance review wyłącznie zmian z listy plików. Skup się na: N+1 queries, bundle size, lazy loading, memoization, useEffect cleanup. Klasyfikuj: 🔴/🟠/🟡, z plik:linia."

**Agent 3 — Architektura i jakość:** `subagent_type: "kieran-typescript-reviewer"`
Prompt: PAKIET KONTEKSTU + "Zrób review architektury i jakości TypeScript wyłącznie zmian z listy plików. Skup się na: SOLID, wzorce, nazewnictwo, type safety, organizacja importów. Klasyfikuj: 🔴/🟠/🟡, z plik:linia."

**Agent 4 — Scenariusze i pokrycie testowe:** `subagent_type: "general-purpose"`
Prompt: PAKIET KONTEKSTU + "Sprawdź dla zmian z listy plików: (1) happy path działa; (2) invalid inputs — walidacja i komunikaty; (3) boundary conditions — puste listy, max wartości, null/undefined; (4) race conditions przy operacjach współbieżnych; (5) skala — zachowanie przy 100x danych; (6) pokrycie: czy pliki testowe wymienione w Implementation Unit istnieją i zawierają asercje — brakujący plik testowy z planu = 🟠 [P2-important]. Klasyfikuj: 🔴/🟠/🟡, z plik:linia."

**Agent 5 — E2E w przeglądarce:** `subagent_type: "e2e-browser-verifier"` — TYLKO gdy faza ma niezaznaczone checkboxy `Weryfikacja:`.

**Gate serwera przed Agentem 5:** sprawdź czy aplikacja działa (np. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`). Nie działa → uruchom dev server zgodnie z Commands w `CLAUDE.md`, poczekaj na ready. Nie da się uruchomić → pomiń Agenta 5, odnotuj w raporcie "E2E pominięte: serwer niedostępny".
Prompt: PAKIET KONTEKSTU + lista niezaznaczonych checkboxów `Weryfikacja:` z fazy + URL aplikacji + "Zweryfikuj każdy scenariusz w przeglądarce przez agent-browser. Dla każdego: ✅ passed / 🟠 [P2-important] failed + screenshot."

**Porażka agenta:** pusty/błędny wynik → odnotuj w raporcie "perspektywa X niedostępna", kontynuuj z pozostałymi. Nie ponawiaj więcej niż raz.

### 3.5 Konsolidacja

1. Zbierz findings wszystkich agentów.
2. Deduplikuj (ten sam plik+linia+problem od różnych agentów = jeden wpis, zachowaj najwyższe severity).
3. Sortuj: P1 → P2 → P3.
4. Cross-check z planem technicznym: implementacja odbiega od planu (inne pliki, inne podejście, brakujące testy z **Pliki: Test:**) → sekcja "Odchylenia od planu"; brakujący plik testowy zdefiniowany w planie = 🟠 [P2-important].

### 4. Zapisz wyniki

**Utwórz `$1/review-faza-$2.md`:**

```markdown
# Review — Faza $2

**Data:** RRRR-MM-DD
**Zakres commitów:** [hash..hash]
**Werdykt:** [⛔ WYMAGA POPRAWEK / ⚠️ KONTYNUUJ Z ZASTRZEŻENIAMI / ✅ GOTOWE DO KONTYNUACJI]

## Findings

### 🔴 P1-blocking
- **plik:linia** — [opis + scenariusz awarii]

### 🟠 P2-important
- **plik:linia** — [opis]

### 🟡 P3-nit
- **plik:linia** — [opis]

## Odchylenia od planu
- [odchylenie albo "Brak"]

## Weryfikacje E2E
- ✅/🟠 [scenariusz] — [wynik, screenshot jeśli jest]
(albo: "E2E pominięte: [powód]")

## Perspektywy niedostępne
- [agent który zawiódł, albo pomiń sekcję]
```

**Zaktualizuj `$1/[zadanie]-zadania.md`:**
- Sekcja `## Do poprawy po review fazy $2` z checkboxami (NIE bullet points):
```markdown
- [ ] 🔴 [blocking] **plik:linia** — opis
- [ ] 🟠 [important] **plik:linia** — opis
```
- 🟡 P3 dodawaj tylko wybiórczo (realnie warte zrobienia).
- E2E passed → odznacz odpowiednie checkboxy `Weryfikacja:` fazy (`- [x]`). Failed → zostaw niezaznaczone; failure ląduje jako 🟠 w "Do poprawy".

**Zaktualizuj `$1/[zadanie]-kontekst.md`:** notatka o review + kluczowe wnioski + data.

### 4.5 Severity gate

| Stan | Werdykt |
|---|---|
| ≥1 × P1 | ⛔ WYMAGA POPRAWEK — X problemów P1 blokuje kontynuację |
| tylko P2 | ⚠️ KONTYNUUJ Z ZASTRZEŻENIAMI — X problemów P2 do naprawy |
| tylko P3 | ✅ GOTOWE DO KONTYNUACJI — X sugestii do rozważenia |
| zero findings | ✅ GOTOWE DO KONTYNUACJI — brak zastrzeżeń |

Failed E2E liczy się jako P2.

### 5. Podsumowanie i handoff

Format wyjściowy:

```
✅ Code Review fazy $2 zakończony

📊 Statystyki:
   - Plików sprawdzonych: X
   - 🔴 [blocking]: X
   - 🟠 [important]: X
   - 🟡 [nit]: X
   - 🌐 [E2E]: X passed / Y failed / pominięte

📄 Raport: $1/review-faza-$2.md
📝 Zadania do poprawy: $1/[zadanie]-zadania.md

---

[PODSUMOWANIE GŁÓWNYCH PROBLEMÓW — prostym językiem]

---

[WERDYKT severity gate]
```

Następnie AskUserQuestion: "Co dalej?"
- **Wykonaj poprawki teraz** → uruchom `/dev-docs-execute $1` (sekcja "Do poprawy po review fazy $2" jest teraz najbliższą niedokończoną "fazą")
- **Kolejna faza bez poprawek** — pokazuj TYLKO gdy zero P1
- **Gotowe na teraz**

## Anty-wzorce — NIGDY

- Nie review'uj na podstawie `git status` — zmiany fazy są już zacommitowane; wyznacz zakres commitów.
- Nie wysyłaj agentom promptu bez PAKIETU KONTEKSTU — subagent nie widzi tej rozmowy.
- Nie uruchamiaj Agenta 5 bez sprawdzenia, że serwer działa.
- Nie dismissuj findings jako "pre-existing" — zgłoś, nawet jeśli poza fazą (oznacz `[poza fazą]`).
- Nie dodawaj kategorii severity spoza P1/P2/P3.
- Nie naprawiaj problemów w tym skillu — review raportuje; poprawki wykonuje /dev-docs-execute.
- Nie oferuj "kolejna faza bez poprawek" przy jakimkolwiek P1.
