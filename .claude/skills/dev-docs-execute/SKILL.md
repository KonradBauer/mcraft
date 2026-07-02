---
name: dev-docs-execute
description: "Kontynuacja pracy nad zadaniem - wykonanie kolejnej fazy/etapu."
argument-hint: "[ścieżka-do-folderu np. 'docs/active/auth-refaktor']"
---

# Wykonanie kolejnej fazy zadania

Pipeline: `/dev-brainstorm` → `/dev-plan` → `/dev-docs` → **`/dev-docs-execute` (WYKONANIE)** → `/dev-docs-review`.

Ten skill wykonuje DOKŁADNIE JEDNĄ fazę z checklisty zadania i zatrzymuje się. Jedyny skill pipeline'u, który pisze kod.

## Zmienne

- ŚCIEŻKA_ZADANIA: $1

**Jeśli $1 puste:** wykonaj `Glob docs/active/*/`. Jeden katalog → użyj go i poinformuj. Wiele → zapytaj usera który (AskUserQuestion). Zero → "Brak aktywnych zadań w docs/active/. Użyj /dev-docs żeby stworzyć strukturę." STOP.

## Twarde reguły wykonania

1. **Jedna faza na uruchomienie.** Po ukończeniu fazy STOP — nie przechodź do następnej.
2. **Scope guard:** niczego z sekcji "Granice scope'u" / "Poza zakresem" nie implementuj, nawet jeśli wygląda na przydatne. Zadanie wymaga pracy poza zakresem → STOP i poinformuj usera.
3. **Dyscyplina testowa** (z `.claude/rules/coding-rules.md`, egzekwowana TUTAJ):
   - Test failuje → napraw KOD, nie test
   - Zakaz osłabiania asercji, usuwania testów, testów bez asercji
   - Mockuj tylko zewnętrzne serwisy, nie testowany kod
4. **Komendy projektu:** wykryj przed pierwszym użyciem — (a) sekcja Commands w `CLAUDE.md` (w tym wymagane prefixy env), (b) package manager z lockfile: `pnpm-lock.yaml`→pnpm, `bun.lockb`→bun, `yarn.lock`→yarn, inaczej npm, (c) skrypty z `package.json`. Nie zgaduj komend.
5. **Format checkboxów:** zadania oznaczaj markdown checkboxem `- [x]`. Emoji ✅ tylko w nagłówku ukończonej fazy (`## Faza 1 — Nazwa ✅`). Nie przepisuj checkboxów na emoji.
6. **Data:** z kontekstu środowiska. Aktualny rok to 2026.

## Kroki

### 0. Walidacja git

1. `git branch --show-current`
2. Wymagany branch: szukaj `Branch:` w plikach `$1/*.md`.
3. Zgodny → kontynuuj. Niezgodny → zapytaj usera (AskUserQuestion): [przełącz na wymagany] [kontynuuj na obecnym — odnotuj w kontekst.md] [przerwij].
4. Niezacommitowane zmiany z poprzednich sesji → pokaż `git status` i zapytaj: [zacommituj jako osobny commit przed startem] [kontynuuj — zmiany wlicz do tej fazy] [przerwij].

### 1. Wczytaj dokumentację zadania

Przeczytaj WSZYSTKIE pliki `.md` w `$1/`:
- `*-plan.md` — fazy, cele, kryteria
- `*-kontekst.md` — decyzje, powiązane pliki, notatki z poprzednich sesji
- `*-zadania.md` — checklist ze statusami

Dodatkowo: jeśli sekcja "Źródła" wskazuje plan techniczny w `docs/plans/` — przeczytaj odpowiedni Implementation Unit przed implementacją (zawiera podejście, wzorce, scenariusze).

### 2. Określ aktualną fazę

- Ostatnia ukończona faza = nagłówek z ✅ lub wszystkie checkboxy `- [x]`
- Następna faza = pierwsza z niezaznaczonymi checkboxami
- Wszystko ukończone → poinformuj: "Wszystkie fazy ukończone. Następny krok: /dev-docs-complete $1" i STOP

### 2.5 Strategia wykonania

| Warunek | Strategia |
|---|---|
| 1-2 zadania lub mały scope | **Inline** — wykonaj bezpośrednio w tej sesji (domyślna) |
| 3+ zadań zależnych sekwencyjnie, duży kontekst per zadanie | **Serial subagents** |
| 3+ zadań niezależnych (rozłączne pliki — zweryfikuj listy plików zadań przed decyzją) | **Parallel subagents** |

W razie wątpliwości: Inline. Subagenty tylko gdy realnie odciążają kontekst.

**Prompt subagenta MUSI zawierać:** (a) treść zadania z checklisty, (b) relewantny fragment planu technicznego (Podejście, Wzorce, Scenariusze testowe), (c) listę plików do zmiany, (d) reguły twarde 2-4 z tego skilla, (e) polecenie: nie commituj, nie aktualizuj dokumentacji — raportuj wynik.

**Integracja wyników:** aktualizacja checklisty, dokumentacji i commity są ZAWSZE robione przez główną sesję, nigdy przez subagenty.

### 3. Wykonaj fazę

- Realizuj zadania z fazy w kolejności.
- Checkboxy `Test:` = integralna część fazy. Pisz testy RAZEM z kodem implementacyjnym, nie na końcu fazy.
- Checkboxów `Weryfikacja:` NIE wykonuj — weryfikuje je `/dev-docs-review` w przeglądarce. Nie rób zrzutów ekranu ani manualnej weryfikacji wizualnej w tym skillu.
- Zadania `(ręczne)` — pomiń, wypisz w podsumowaniu jako czekające na usera.

**Procedura blokady** — gdy zadanie nie daje się ukończyć (test failuje mimo prób naprawy kodu, brak zależności, sprzeczność w planie):
1. NIE osłabiaj testów, NIE obchodź problemu, NIE zgaduj.
2. Zapisz blokadę w `*-kontekst.md` (sekcja "Blokady": co, dlaczego, co próbowano).
3. Oznacz zadanie w checkliście: `- [ ] [ZABLOKOWANE: powód] treść zadania`.
4. Dokończ pozostałe niezależne zadania fazy, jeśli są.
5. W podsumowaniu jawnie zgłoś blokadę userowi. Faza z blokadą NIE dostaje ✅.

### 4. Walidacja fazy

Jeśli plan definiuje testy akceptacyjne dla tej fazy → wykonaj je (testy automatyczne: unit/integracyjne). Wyniki zapisz w podsumowaniu; artefakty tekstowe (logi) w `$1/` tylko gdy wnoszą wartość dla review.

### 4.5 System-Wide Check — wszystkie odpowiedzi muszą być TAK

1. Typecheck przechodzi bez nowych błędów?
2. Istniejące testy nadal przechodzą?
3. Nowe testy pokrywają happy path + minimum 1 error case?
4. Checkboxy `Test:` fazy mają napisane i przechodzące testy? (Brakuje → napisz TERAZ.)
5. Nowe importy nie łamią istniejących modułów?
6. Lint przechodzi bez nowych błędów?
7. Build przechodzi? (Uruchamiaj gdy faza zmieniała konfigurację, zależności lub strukturę routingu; dla czystych zmian wewnątrz modułów wystarczą punkty 1-6.)

Kolejność uruchamiania: typecheck → test → lint (zgodnie z coding-rules). Odpowiedź NIE → napraw przed przejściem dalej; nie da się naprawić → procedura blokady.

### 5. Aktualizuj dokumentację

**`*-zadania.md`:**
- Ukończone zadania → `- [x]`
- Ukończona faza → dopisz ✅ w nagłówku fazy
- Nowo odkryte zadania: dodaj do fazy, której logicznie dotyczą, z dopiskiem `(odkryte podczas Fazy N)`. Zadanie poza scope → NIE dodawaj do checklisty; odnotuj w kontekst.md jako propozycję.

**`*-kontekst.md`:**
- Dopisz zmiany wprowadzone w fazie i podjęte decyzje
- Zaktualizuj `Ostatnia aktualizacja: RRRR-MM-DD`

### 5.5 Aktualizuj plan techniczny (gdy istnieje)

W pliku z `docs/plans/` wskazanym w "Źródłach":
- Odznacz checkbox ukończonego Implementation Unit
- Odznacz spełnione scenariusze testowe i weryfikacje unitu

Plan techniczny jest żywym dokumentem postępu.

### 6. Commit (inkrementalny)

- Commituj logiczną jednostkę pracy, gdy potrafisz opisać ją sensownym commit message. Message brzmiałby "WIP"/"partial" → nie commituj jeszcze.
- Pattern: `feat|fix|refactor([nazwa-zadania]): [co i dlaczego]`
- Staguj TYLKO pliki danej jednostki (nigdy `git add .`)
- Jedna faza = jeden lub więcej commitów, wg złożoności
- Aktualizacje dokumentacji z kroków 5-5.5 dołącz do ostatniego commita fazy albo osobnym `docs(...)` commitem

### 7. Podsumowanie

Prostym językiem, zrozumiałym dla osoby nietechnicznej:

```
## Podsumowanie fazy [numer/nazwa]

### Co zostało zrobione
[Bez żargonu technicznego]

### Co widać w aplikacji
**Desktop:**
- [Widoczne zmiany]

**Mobile:**
- [Widoczne zmiany]

### Zmiany "pod maską"
[DLACZEGO były ważne, mimo że niewidoczne]

### Blokady / zadania ręczne
[Jeśli są — jawnie; jeśli brak — pomiń sekcję]

### Następny krok
[Następna faza lub /dev-docs-complete]
```

## Format wyjściowy

```
✅ Ukończono fazę [numer/nazwa] w $1
   (lub: ⚠️ Faza [numer] częściowo — [N] zablokowanych zadań)

🔀 Branch: [nazwa-brancha]

📋 Wykonane zadania:
   - [lista]

🧪 Testy: typecheck [PASS/FAIL] | testy [PASS/FAIL/brak] | lint [PASS/FAIL]

📝 Zaktualizowana dokumentacja w $1/ [+ docs/plans/... jeśli dotyczy]

💾 Commity: [lista messages]

---

[PODSUMOWANIE W PROSTYM JĘZYKU]

---

➡️ Review ukończonej fazy:
   Uruchom: /dev-docs-review $1 Faza [numer]
```

## Anty-wzorce — NIGDY

- Nie wykonuj więcej niż jednej fazy na uruchomienie.
- Nie osłabiaj asercji, nie usuwaj testów, nie pisz testów bez asercji — test failuje = napraw kod.
- Nie implementuj niczego z "Poza zakresem", nawet drobiazgu "przy okazji".
- Nie wykonuj checkboxów `Weryfikacja:` — należą do /dev-docs-review.
- Nie używaj `git add .` — staguj wybiórczo.
- Nie zamieniaj checkboxów markdown na emoji w pliku zadań.
- Nie pozwalaj subagentom commitować ani edytować dokumentacji zadania.
- Nie zgaduj przy blokadzie — dokumentuj i zgłoś userowi.
