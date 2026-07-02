---
name: dev-docs-complete
description: "Archiwizacja ukończonego zadania i wyciągnięcie kluczowych wniosków."
argument-hint: "[nazwa zadania z docs/active/]"
---

# Archiwizacja ukończonego zadania

Pipeline: `/dev-docs-execute` → `/dev-docs-review` → **`/dev-docs-complete` (ARCHIWIZACJA)**. Domyka cykl życia zadania: `docs/active/` → `docs/completed/` + podsumowanie + propagacja wniosków.

## Wejście

<task_name> #$ARGUMENTS </task_name>

**Jeśli puste lub nie znaleziono `docs/active/$ARGUMENTS/`:** wylistuj katalogi z `docs/active/` i zapytaj usera który archiwizować (AskUserQuestion). Zero katalogów → "Brak aktywnych zadań." STOP.

## Kroki

### 1. Zweryfikuj ukończenie — definicja

Przeczytaj `[zadanie]-zadania.md` i sklasyfikuj każdy niezaznaczony checkbox:

| Stan | Blokuje archiwizację? |
|---|---|
| Niezaznaczone zadanie implementacyjne | TAK |
| Niezaznaczony checkbox `Test:` | TAK |
| Niezaznaczony checkbox `Weryfikacja:` | TAK |
| Niezaznaczony wpis w "Do poprawy po review" z 🔴 | TAK |
| Niezaznaczony wpis w "Do poprawy po review" z 🟠/🟡 | Do decyzji usera |
| Zadanie `[ZABLOKOWANE: ...]` | Do decyzji usera |
| Zadanie `(ręczne)` | Do decyzji usera |

Jeśli COKOLWIEK niedokończone: wylistuj pogrupowane wg tabeli i zapytaj (AskUserQuestion): [archiwizuj mimo to — niedokończone wpiszę do podsumowania jako "Znane braki"] [kontynuuj pracę → /dev-docs-execute] [przerwij].

### 2. Status brancha

1. Odczytaj `Branch:` z dokumentacji zadania.
2. Sprawdź merge: `git branch --merged main | grep [branch]` (lub odpowiednik).
3. **Niezmergowany** → poinformuj: "Branch feature/[nazwa] nie jest zmergowany do main. Archiwizacja zwykle następuje PO merge." Zapytaj: [archiwizuj mimo to] [przerwij — najpierw merge/PR]. Nie merguj samodzielnie.

### 3. Wyciągnij wnioski

Z `[zadanie]-kontekst.md` i `review-faza-*.md` zbierz:
- Decyzje architektoniczne warte zachowania
- Odkryte/ustalone wzorce
- Pułapki i edge cases
- Dodane zależności
- Blokady i jak je rozwiązano (lub nie)

### 4. Archiwizuj

1. Utwórz `docs/completed/$ARGUMENTS/`.
2. Przenieś WSZYSTKIE pliki z `docs/active/$ARGUMENTS/` przez `git mv` (zachowuje historię): plan, kontekst, zadania, review-faza-*.
3. Utwórz `docs/completed/$ARGUMENTS/[zadanie]-podsumowanie.md`:

```markdown
# [Tytuł zadania] — Podsumowanie

**Data ukończenia:** RRRR-MM-DD
**Branch:** feature/[nazwa] ([zmergowany / niezmergowany])

## Co zostało dostarczone
- [Konkretny rezultat widoczny dla użytkownika/systemu]

## Kluczowe decyzje
- [Decyzja]: [Uzasadnienie w 1 zdaniu]

## Główne pliki
- `ścieżka` — [co się zmieniło]

## Wnioski
- [Wzorzec / pułapka / lekcja]

## Znane braki
- [Niedokończone elementy z kroku 1, albo "Brak"]
```

4. Usuń pusty katalog `docs/active/$ARGUMENTS/`.
5. **Commit archiwizacji:** `git add -A docs/active/$ARGUMENTS docs/completed/$ARGUMENTS` → commit: `docs: archiwizacja zadania [nazwa]`.

### 5. Propagacja wniosków — z gate'em

Dla każdego wniosku z kroku 3 oceń:

| Wniosek | Cel | Warunek |
|---|---|---|
| Trwałe ograniczenie/konwencja całego projektu | `CLAUDE.md` | TYLKO za jawną zgodą usera — pokaż proponowany diff i zapytaj |
| Reguła kodowania ogólna | `.claude/rules/coding-rules.md` | TYLKO za jawną zgodą usera |
| Rozwiązany nietrywialny problem (bug, pułapka, workaround) | `docs/solutions/` | Zaproponuj `/dev-compound` (krok 6) |
| Wniosek lokalny dla zadania | zostaje w podsumowaniu | domyślne |

Domyślnie wnioski zostają w podsumowaniu. Edycja CLAUDE.md/rules bez zgody usera = ZAKAZ.

### 6. Sugestia dokumentacji problemów

Jeśli praca zawierała nietrywialne rozwiązane problemy (były blokady, review wykrył i naprawiono coś istotnego, workaround na zewnętrzny bug): zapytaj — "Udokumentować rozwiązane problemy w bazie wiedzy? → /dev-compound". User potwierdza → uruchom `/dev-compound` przez Skill tool.

## Format wyjściowy

```
✅ Zadanie "$ARGUMENTS" zarchiwizowane

📁 Przeniesiono do: docs/completed/$ARGUMENTS/
📄 Pliki: [lista]
💾 Commit: docs: archiwizacja zadania [nazwa]
🔀 Branch: [zmergowany / NIEZMERGOWANY — wymaga uwagi]

📝 Propagacja wniosków:
   - [co gdzie dodano po zgodzie usera, lub "Wnioski w podsumowaniu"]

🎯 Kluczowe rezultaty:
   - [punkty]

⚠️ Znane braki: [lista lub brak]
```

## Anty-wzorce — NIGDY

- Nie archiwizuj przy niezaznaczonych 🔴 z review bez decyzji usera.
- Nie edytuj CLAUDE.md ani .claude/rules/ bez pokazania diffu i zgody usera.
- Nie przenoś plików zwykłym mv — używaj `git mv`.
- Nie merguj brancha samodzielnie — tylko informuj o statusie.
- Nie zostawiaj archiwizacji bez commita.
- Nie odwołuj się do `.claude/rules/best-practices.md` ani `troubleshooting.md` — nie istnieją; reguły projektu to `.claude/rules/coding-rules.md`.
