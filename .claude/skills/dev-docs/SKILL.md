---
name: dev-docs
description: "Tworzenie kompleksowego planu strategicznego z uporządkowanym podziałem na zadania."
argument-hint: "[opis zadania lub ścieżka do planu z docs/plans/] — tworzy docs/active/[nazwa]/"
---

# Dev-docs — trwała struktura wykonawcza zadania

Pipeline: `/dev-brainstorm` (CO) → `/dev-plan` (JAK) → **`/dev-docs` (STRUKTURA WYKONAWCZA)** → `/dev-docs-execute` (WYKONANIE).

Ten skill tworzy `docs/active/[nazwa-zadania]/` z trzema plikami (plan, kontekst, zadania-checklist), branch git i commit inicjalny. Struktura ma przetrwać resety kontekstu — implementator wykonujący ją za tydzień w świeżej sesji musi mieć wszystko.

Ten skill NIE implementuje kodu i NIE podejmuje decyzji technicznych od zera, gdy istnieje plan techniczny.

## Twarde reguły

1. **Data:** z kontekstu środowiska (currentDate). Aktualny rok to 2026.
2. **Jedno pytanie na turę**, przez `AskUserQuestion`.
3. **Ścieżki w TYM repo:** requirements → `docs/dev-brainstorms/`, plany techniczne → `docs/plans/`, struktury zadań → `docs/active/`.
4. **Nazwa zadania:** 2-4 słowa kebab-case, bez polskich znaków (np. `cms-integracja`, `auth-refaktor`). Branch: `feature/[nazwa-zadania]`.
5. **Gdy istnieje plan techniczny — TRANSFORMUJ go, nie planuj ponownie.** Zakaz wymyślania nowych decyzji technicznych sprzecznych z planem.
6. **Język plików:** polski (zgodnie z istniejącymi w `docs/active/`).

## Wejście

<task_input> #$ARGUMENTS </task_input>

Rozpoznaj typ wejścia:

| Wejście | Akcja |
|---|---|
| Ścieżka do pliku w `docs/plans/` | Przeczytaj plan → tryb TRANSFORM |
| Ścieżka do pliku w `docs/dev-brainstorms/` | Przeczytaj requirements → sprawdź czy istnieje nowszy plan techniczny na jego bazie (Faza 1.1); jest → TRANSFORM, nie ma → BOOTSTRAP |
| Opis tekstowy | Faza 1.1 (szukanie źródeł) |
| Puste | Zapytaj: "Co mam przygotować do wykonania? Podaj opis albo ścieżkę do planu." STOP |

## FAZA 0: Przygotowanie repozytorium

### 0.1 Stan git — procedura

1. Sprawdź `git status`.
2. **Working tree czysty** → idź do 0.2.
3. **Niezacommitowane zmiany** → zapytaj usera (AskUserQuestion):
   - [Zacommituj zmiany teraz] — poproś usera o commit lub wykonaj za zgodą
   - [Stash] — `git stash`, przypomnij o nim w podsumowaniu końcowym
   - [Kontynuuj mimo to] — dozwolone, ale odnotuj w podsumowaniu
   Nie wykonuj `git checkout -b` z brudnym working tree bez decyzji usera.

### 0.2 Branch — procedura

1. Ustal nazwę: `feature/[nazwa-zadania]`.
2. Sprawdź czy branch istnieje: `git branch --list feature/[nazwa-zadania]`.
3. **Nie istnieje** → `git checkout -b feature/[nazwa-zadania]`.
4. **Istnieje** → zapytaj usera: [przełącz się na istniejący] [nowa nazwa z sufiksem -2] [zostań na obecnym branchu].
5. Zapisz finalną nazwę brancha — trafia do wszystkich trzech plików.

## FAZA 1: Źródła i tryb pracy

### 1.1 Znajdź dokumenty źródłowe

Wykonaj OBA:
- `Glob docs/plans/*-plan.md` — plany techniczne z `/dev-plan`
- `Glob docs/dev-brainstorms/*-requirements.md` — requirements z `/dev-brainstorm`

Dopasowanie: temat semantycznie zgodny z wejściem, preferuj najnowszy. Wiele kandydatów → zapytaj usera.

### 1.2 Wybierz tryb

| Stan źródeł | Tryb |
|---|---|
| Plan techniczny istnieje | **TRANSFORM** — plan jest źródłem prawdy; requirements (jeśli jest) tylko jako kontekst produktowy |
| Tylko requirements doc | **BOOTSTRAP** z kontekstem produktowym |
| Brak źródeł | **BOOTSTRAP** od zera |

Ogłoś userowi tryb i użyte źródła jednym zdaniem.

### 1.3 Tryb TRANSFORM — zasady

- Implementation Units planu → fazy/zadania checklisty (mapowanie 1 Unit = 1 sekcja fazy albo grupa zadań, wg zależności)
- Sekcja **Scenariusze testowe** unitu → checkboxy `Test:` w TEJ SAMEJ fazie co zadania implementacyjne
- Sekcja **Weryfikacja** unitu → checkboxy `Weryfikacja:` w TEJ SAMEJ fazie
- Kluczowe decyzje techniczne planu → sekcja "Decyzje techniczne" w pliku kontekstu (kopiuj, nie parafrazuj znaczenia)
- Ścieżki plików z unitów → "Powiązane pliki" w kontekście
- NIE dodawaj: analizy obecnego stanu, szacunków czasowych, oceny ryzyka — to już jest w planie technicznym; linkuj zamiast duplikować

### 1.4 Tryb BOOTSTRAP — zasady

Zbadaj repo (Glob/Grep/Read kluczowych plików) i stwórz plan zawierający:
- Podsumowanie wykonawcze (2-4 zdania)
- Analizę obecnego stanu (co istnieje, co się zmienia)
- Stan docelowy
- Fazy z zadaniami (kryteria akceptacji per zadanie)
- Ryzyka i mitygacje (tylko materialne)
- Mierniki sukcesu

Nakład pracy per zadanie: S/M/L/XL. Zadania numeruj w fazach, określ zależności.

Jeśli w BOOTSTRAP odkryjesz duże nierozstrzygnięte pytania produktowe → zarekomenduj `/dev-brainstorm` przed kontynuacją.

## FAZA 2: Utworzenie struktury

Katalog: `docs/active/[nazwa-zadania]/`

**Jeśli katalog już istnieje:** zapytaj usera — [aktualizuj istniejące pliki (zachowaj zaznaczone checkboxy)] [nadpisz od zera] [przerwij]. Nigdy nie nadpisuj bez pytania.

### Plik 1: `[nazwa-zadania]-plan.md`

```markdown
# [Tytuł zadania] — Plan

**Branch:** `feature/[nazwa-zadania]`
**Ostatnia aktualizacja:** RRRR-MM-DD

## Cele i zakres

[2-5 zdań: co robimy i po co. Granice scope jako bullety.]

## Fazy

### Faza 1 — [Nazwa]
[Cel fazy + zadania z kryteriami akceptacji]

### Faza 2 — [Nazwa]
[...]

## Kryteria akceptacji całości

- [Weryfikowalne kryterium]

## Źródła
- Requirements doc: [docs/dev-brainstorms/... jeśli użyty]
- Plan techniczny: [docs/plans/... jeśli użyty]
```

### Plik 2: `[nazwa-zadania]-kontekst.md`

```markdown
# [Tytuł zadania] — Kontekst

**Branch:** `feature/[nazwa-zadania]`
**Ostatnia aktualizacja:** RRRR-MM-DD

## Powiązane pliki

- `ścieżka/pliku` — [rola w zadaniu]

## Decyzje techniczne

- [Decyzja]: [Uzasadnienie] (zob. plan techniczny, gdy stamtąd pochodzi)

## Zależności

- [Zależność techniczna lub sekwencyjna]

## Źródła
- Requirements doc: [ścieżka jeśli użyty]
- Plan techniczny: [ścieżka jeśli użyty]
```

### Plik 3: `[nazwa-zadania]-zadania.md`

```markdown
# [Tytuł zadania] — Checklist zadań

**Branch:** `feature/[nazwa-zadania]`
**Ostatnia aktualizacja:** RRRR-MM-DD

---

## Faza 1 — [Nazwa]

- [ ] [Zadanie implementacyjne: czasownik + konkretny plik/efekt]
- [ ] [Zadanie implementacyjne]
- [ ] Test: [scenariusz z planu technicznego]
- [ ] Weryfikacja: [kryterium weryfikacji z planu technicznego]

---

## Faza 2 — [Nazwa]

- [ ] [...]
```

**Reguły checklisty:**
- Każdy checkbox = jedna wykonywalna akcja z konkretnym plikiem lub obserwowalnym efektem
- Checkboxy `Test:` i `Weryfikacja:` w tej samej fazie co implementacja, których dotyczą — NIGDY w osobnej sekcji na końcu
- Zadania ręczne/manualne oznacz `(ręczne)` — np. seed w panelu admina
- Bez planu technicznego lub bez scenariuszy testowych w nim — nie wymyślaj sztucznych checkboxów `Test:`; feature-bearing zadania nadal powinny mieć test zgodnie z regułami projektu

## FAZA 3: Commit inicjalny

1. `git add docs/active/[nazwa-zadania]/`
2. Commit message: `docs: inicjalizacja planu dla [nazwa-zadania]`
3. Ten commit jest częścią workflow — wykonaj bez dodatkowego pytania (user zainicjował skill, który go deklaruje).

## Referencje kontekstowe (sprawdź podczas Fazy 1)

- `CLAUDE.md` — architektura projektu
- `.claude/rules/coding-rules.md` — standardy kodowania (testy, typy, bezpieczeństwo)
- `docs/solutions/` — wiedza instytucjonalna, jeśli istnieje

## Gate przed zakończeniem — wszystkie punkty muszą przejść

- [ ] Trzy pliki istnieją w `docs/active/[nazwa-zadania]/` i każdy ma nagłówek Branch + Ostatnia aktualizacja
- [ ] Tryb TRANSFORM: każdy Implementation Unit planu ma odpowiednik w checkliście (żaden nie zgubiony)
- [ ] Tryb TRANSFORM: checkboxy `Test:`/`Weryfikacja:` siedzą w fazach, nie w osobnej sekcji
- [ ] Sekcja "Źródła" wypełniona w plan.md i kontekst.md
- [ ] Checklist wykonywalny przez świeżą sesję bez dostępu do tej rozmowy
- [ ] Commit wykonany

## Format wyjściowy

```
✅ Plan utworzony dla "[nazwa-zadania]"

🔀 Branch: feature/[nazwa-zadania]

📁 Struktura:
   - docs/active/[nazwa-zadania]/
     - [nazwa-zadania]-plan.md
     - [nazwa-zadania]-kontekst.md
     - [nazwa-zadania]-zadania.md

📝 Commit: docs: inicjalizacja planu dla [nazwa-zadania]

➡️ Następny krok: /dev-docs-execute docs/active/[nazwa-zadania]
```

Jeśli w Fazie 0 użyto stash — dopisz przypomnienie o `git stash pop`.

## Anty-wzorce — NIGDY

- Nie planuj od zera, gdy istnieje plan techniczny — transformuj go.
- Nie szukaj w `docs/brainstorms/` — poprawna ścieżka to `docs/dev-brainstorms/`.
- Nie duplikuj do plików treści planu technicznego (ryzyka, szacunki, analiza stanu) — linkuj w "Źródła".
- Nie twórz brancha na brudnym working tree bez decyzji usera.
- Nie nadpisuj istniejącego `docs/active/[nazwa]/` bez pytania.
- Nie umieszczaj checkboxów Test/Weryfikacja w osobnej sekcji na końcu checklisty.
- Nie używaj tej komendy do trywialnych zadań (1-2 pliki, brak faz) — wykonaj je bezpośrednio; struktura docs/active ma sens od ~3+ zadań w ≥2 fazach.
