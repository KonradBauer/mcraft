---
name: dev-compound
description: "Dokumentowanie rozwiązanego problemu do bazy wiedzy docs/solutions/."
argument-hint: "[opcjonalnie: opis problemu lub --full]"
---

# Compound — dokumentowanie rozwiązanego problemu

Przechwytuje rozwiązania problemów, gdy kontekst jest świeży, do `docs/solutions/[kategoria]/` z YAML frontmatter dla wyszukiwalności.

**Dlaczego "compound"?** Pierwsze rozwiązanie problemu wymaga researchu. Udokumentowane — następne wystąpienie zajmuje minuty. Wiedza się kumuluje.

## Użycie

```bash
/dev-compound                    # Dokumentuj najnowszą naprawę (tryb compact)
/dev-compound [krótki kontekst]  # Z dodatkowym opisem (tryb compact)
/dev-compound --full             # Rozszerzony format z researchem powiązań
```

## Opis problemu

<problem_description> #$ARGUMENTS </problem_description>

## Warunki wstępne — sprawdź PRZED startem

1. **Problem rozwiązany** (nie w trakcie) — jeśli w trakcie: "Dokumentuję po weryfikacji naprawy. Wróć gdy rozwiązanie potwierdzone." STOP.
2. **Rozwiązanie zweryfikowane** jako działające (test przeszedł, zachowanie potwierdzone).
3. **Problem nietrywialny** — typo/oczywisty błąd nie zasługuje na doc; poinformuj i STOP.

## Twarde reguły

1. **Jeden plik wyjściowy** — finalna dokumentacja. Zero plików tymczasowych.
2. **Data:** z kontekstu środowiska (currentDate). Aktualny rok to 2026.
3. **Subagenci NIE widzą tej rozmowy** — ekstrakcja kontekstu sesji odbywa się WYŁĄCZNIE w głównej sesji; agentom przekazuje się gotowy tekst.
4. **Tryb compact = zero pytań do usera.** Autonomiczny przebieg.

## Kategorie (uniwersalne, przenośne między projektami)

- `build-errors/` — kompilacja, bundler, konfiguracja build
- `runtime-errors/` — błędy wykonania, crashe, unhandled exceptions
- `backend-issues/` — backend/CMS projektu (np. Payload: kolekcje, hooks, access; Supabase: RLS, Edge Functions; API: endpointy, middleware)
- `database-issues/` — baza danych: queries, indeksy, transakcje, migracje
- `auth-issues/` — autentykacja i autoryzacja
- `ui-bugs/` — wizualne, layout, responsywność, interakcje, hydration
- `performance-issues/` — wolne zapytania, memory leaks, re-rendery, bundle
- `typescript-errors/` — typy, generics, typy generowane
- `deployment-issues/` — Docker, CI/CD, environment, hosting
- `testing-issues/` — failing testy, konfiguracja, mocking

Problem nie pasuje do żadnej → wybierz najbliższą; NIE twórz nowych kategorii ad hoc. Jeśli baza `docs/solutions/` w projekcie ma już inne nazwy kategorii (np. starsze `payload-issues/`) — używaj istniejących, spójność bazy > świeżość schematu.

---

## Tryb Compact (domyślny)

Wszystko w jednym sekwencyjnym przebiegu głównej sesji:

### Krok 1: Wyciągnij kontekst z bieżącej sesji

Autonomicznie, bez pytań:
- Przejrzyj historię rozmowy: problem → diagnoza → naprawa
- `git log --oneline -10` i `git diff HEAD~1` (lub odpowiedni zakres) — co faktycznie zmieniono
- Zidentyfikuj: symptomy, root cause, rozwiązanie
- Argument podany → użyj jako punkt wyjścia, uzupełnij z sesji i gita

### Krok 2: Auto memory (opcjonalne wzbogacenie)

Przeczytaj MEMORY.md z katalogu auto memory (ścieżka z kontekstu systemowego). Nie istnieje/pusty → pomiń. Relewantne wpisy → użyj jako dodatkowy kontekst z tagiem "(auto memory [claude])". Priorytet zawsze: rozmowa i codebase > memory.

### Krok 3: Klasyfikuj

Kategoria z listy wyżej + filename: `YYYY-MM-DD-kebab-case-title.md`.

### Krok 4: Zapisz dokument

Utwórz katalog (`docs/solutions/[category]/`) i zapisz plik:

```markdown
---
title: "Zwięzły opis problemu"
date: YYYY-MM-DD
category: kategoria
severity: low | medium | high | critical
stack:
  - Next.js
  - Payload
  - TypeScript
tags:
  - tag1
  - tag2
status: verified
last_verified: YYYY-MM-DD
---

# Tytuł problemu

## Symptomy

- Dokładne komunikaty błędów (cytuj dosłownie)
- Obserwowalne zachowanie

## Root Cause

Techniczna przyczyna (1-3 zdania).

## Rozwiązanie

Krok po kroku z kodem:

\```typescript
// kod rozwiązania
\```

## Komendy diagnostyczne

\```bash
# komendy pomocne przy diagnozie
\```

## Zapobieganie

- Jak uniknąć w przyszłości

## Powiązane

- Linki do docs/solutions/, issues

## Kontekst

Okoliczności, środowisko, wersje.
```

`stack` i `tags` = FAKTYCZNE technologie problemu (stack tego projektu: Next.js, Payload, MongoDB, TypeScript, Tailwind — wybierz dotyczące; nie wklejaj pełnej listy).

### Krok 5: Commit

`git add docs/solutions/[category]/[filename].md` → commit: `docs(solutions): [krótki tytuł problemu]`.
(Jeśli dodano regułę w Kroku 6 — dołącz `learned-patterns.md` do tego samego commita.)

### Krok 6: Ocena reguły learned-patterns

Autonomicznie (bez pytania) oceń: czy problem jest rule-worthy — **minimum 2 z 5 kryteriów:**

1. **Ryzyko powtórzenia** — łatwo popełnić ponownie (nieintuicyjne API, słaba dokumentacja)
2. **Wysoka waga** — ciche błędy, luka bezpieczeństwa, utrata danych, trudny debug
3. **Prosty wzorzec** — reguła wyrażalna w 1-3 liniach "rób X, nie Y"
4. **Szerokie zastosowanie** — dotyczy przyszłego kodu w tym stacku, nie jednorazówki
5. **Niewidoczna luka** — nie manifestuje się jawnym błędem; cicho złe wyniki

**Jeśli rule-worthy:**
1. Przeczytaj `.claude/rules/learned-patterns.md` (jeśli istnieje).
2. Duplikat/bardzo podobna reguła istnieje → pomiń.
3. Odczytaj `<!-- rule-count: N -->`. N ≥ 50 → NIE dodawaj; w podsumowaniu zasugeruj `/dev-compound-refresh`.
4. Plik nie istnieje → stwórz z nagłówkiem:
   ```markdown
   # Learned Patterns

   Reguły wyciągnięte z rozwiązanych problemów w docs/solutions/. Zarządzane przez /dev-compound i /dev-compound-refresh.

   <!-- rule-count: 0 -->
   ```
5. Dopisz na końcu:
   ```markdown
   - **[Tytuł wzorca]**: [1-2 zdania: "rób X, nie Y"]
     Source: docs/solutions/[category]/[filename].md
   ```
6. Zaktualizuj rule-count na N+1.

**Nie rule-worthy →** pomiń cicho.

### Krok 7: Podsumowanie

```
Dokumentacja zapisana (tryb compact)

Plik: docs/solutions/[category]/[filename].md
Commit: docs(solutions): [tytuł]
Reguła: [Dodana do learned-patterns.md / Limit osiągnięty / Nie rule-worthy]

Bogatsza wersja (cross-referencje, strategia zapobiegania): /dev-compound --full
```

---

## Tryb Full (`--full`)

Rdzeń identyczny z Compact (Kroki 1-3 w głównej sesji — TYLKO ona widzi rozmowę), plus równoległy research przed zapisem:

### Faza 1: Przygotuj PAKIET PROBLEMU (główna sesja)

Wykonaj Kroki 1-3 trybu Compact. Zbuduj samowystarczalny tekst: symptomy + root cause + rozwiązanie z kodem + kategoria. Ten pakiet idzie do agentów.

### Faza 2: Równoległy research (2 agenty, jedno wywołanie)

- `Agent(subagent_type: "Explore", prompt: PAKIET PROBLEMU + "Przeszukaj docs/solutions/ pod kątem powiązanych dokumentów. Zwróć: ścieżki + relacja (uzupełnia/podważa/duplikuje) + kandydaci do odświeżenia. NIE twórz ani nie edytuj żadnych plików — zwróć wyłącznie tekst.")`
- `Agent(subagent_type: "general-purpose", prompt: PAKIET PROBLEMU + "Opracuj strategie zapobiegania: wytyczne, sygnały ostrzegawcze, sensowne przypadki testowe. NIE twórz ani nie edytuj żadnych plików — zwróć wyłącznie tekst.")`

Porażka agenta → kontynuuj bez jego sekcji, odnotuj w podsumowaniu.

### Faza 3: Montaż i zapis (główna sesja)

1. POCZEKAJ na oba wyniki Fazy 2.
2. Zmontuj dokument: szablon Compact + rozszerzenia — pełniejsze kroki diagnostyczne, strategia zapobiegania z testami, cross-referencje z Fazy 2.
3. Zapisz JEDEN plik + commit (jak Krok 5) + ocena reguły (jak Krok 6).

### Faza 4: Ocena odświeżenia starszych docs

Odśwież ma sens, gdy: powiązany doc rekomenduje podejście, które nowa naprawa podważa | nowa naprawa zastępuje starsze rozwiązanie | praca obejmowała refaktor/migrację/upgrade | agent z Fazy 2 wskazał kandydatów.

Nie ma sensu, gdy: brak powiązanych | spójne z nową wiedzą | pokrycie powierzchowne.

Widzisz kandydata → wspomnij w podsumowaniu i zasugeruj `/dev-compound-refresh [wąski scope]`. Nie odświeżaj samodzielnie w tym przebiegu.

---

## Typowe błędy do unikania

| Źle | Dobrze |
|-----|--------|
| Subagent "wyciąga historię rozmowy" | Subagent NIE widzi rozmowy — główna sesja ekstrahuje i przekazuje PAKIET PROBLEMU |
| Subagenci tworzą pliki robocze | Subagenci zwracają tekst; główna sesja zapisuje jeden finalny plik |
| Frontmatter z pełnym stackiem projektu | Tylko technologie, których problem dotyczy |
| Kategoria wymyślona ad hoc | Wyłącznie kategorie z listy |
| Pytania do usera w trybie compact | Compact = autonomiczny |
| Plik zapisany bez commita | Commit `docs(solutions): ...` zawsze |

## Auto-sugestia (nie auto-wykonanie)

Po rozwiązaniu NIETRYWIALNEGO problemu (spełnia warunki wstępne) możesz JEDNOKROTNIE zaproponować: "Warte udokumentowania — /dev-compound?". Nie proponuj przy trywialnych naprawach, nie przerywaj pracy usera, nie ponawiaj po odmowie w tej samej sesji. Frazy typu "działa"/"naprawione" same w sobie NIE są wystarczającym triggerem.

## Powiązane komendy

- `/dev-compound-refresh [scope]` — odświeżenie istniejącej dokumentacji solutions
- `/dev-docs-complete` — archiwizacja zadania (sugeruje ten skill na końcu)
