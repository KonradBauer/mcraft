# Playbook warsztatu — jak korzystać optymalnie

Sekwencje skilli per scenariusz. Zasada nadrzędna: **waga procesu ∝ waga zmiany**.

## 0. Nowy projekt (jednorazowo)

```
skopiuj .claude/  (bez tsc-cache i settings.local.json; CLAUDE.md NIE kopiować)
→ /dev-brainstorm (byle temat — Faza 0.0 bootstrapuje: CLAUDE.md przez /init,
  konwencje treści, gitignore dla .claude/ i raportów)
→ /skill-rules-manager   (sync auto-aktywacji)
→ restart sesji          (wymóg po zmianach hooków)
→ zregeneruj code-review/resources/ pod stack projektu
```

Zależności zewnętrzne wg potrzeb: `agent-browser` (E2E w review/autopilot), `gemini` CLI, `coolify` CLI.

## 1. Nowy feature — ścieżka pełna (domyślna dla nietrywialnych)

```
/dev-brainstorm [pomysł]        → CO budujemy (requirements doc)
   ↓
/dev-plan                        → JAK (plan techniczny, Implementation Units)
   ↓ (opcjonalnie, przy dużych/ryzykownych planach)
/plan-review [ścieżka planu]     → 3 VP wyłapią blokery PRZED kodem
   ↓
/dev-docs                        → struktura wykonawcza + branch (przetrwa reset kontekstu)
   ↓ pętla per faza:
/dev-docs-execute → /dev-docs-review → (poprawki: znowu execute) → następna faza
   ↓ po wszystkich fazach:
/dev-docs-complete               → archiwizacja + merge-check
   ↓ (gdy był nietrywialny problem)
/dev-compound                    → wiedza do docs/solutions/
```

Skille same się handoffują — zacznij od `/dev-brainstorm` i wybieraj rekomendowane opcje.

## 2. Ten sam pipeline autonomicznie

```
/dev-brainstorm → /dev-plan → /dev-docs → /dev-autopilot docs/active/[nazwa]
```

Autopilot kręci pętlę execute→review→fix per faza (max 2 cykle fix), STOP na P1 i blokadach, graceful degradation P2→known-issues, na końcu walidacja+complete+compound. Używaj gdy plan solidny i fazy dobrze zdefiniowane.

## 3. Mała rzecz (1-2 pliki, jasny scope)

Nie odpalaj pipeline'u. Powiedz wprost co zrobić, albo `/dev-brainstorm` z fast-pathem (wykryje jasne wymagania, skróci do potwierdzenia). Struktura docs/active ma sens od ~3+ zadań w 2+ fazach.

## 4. Bug

```
/bugfix [opis lub link Sentry]
```

Samodzielny proces: triage → (rollback? za zgodą) → root cause → failing test → fix → gate dowodowy → commit → monitoring. Diagnoza utknęła → dorzuć `/critical-think`.

## 5. Szukasz co robić / ulepszeń

```
/dev-ideate [obszar] → wybierz pomysł → /dev-brainstorm (auto-handoff) → dalej jak #1
```

## 6. Zdrowie istniejącego kodu

| Potrzeba | Skill |
|---|---|
| Architektura / dług techniczny / YAGNI | `/code-quality [moduł]` → plan naprawczy → `/dev-plan` |
| Wydajność ładowania strony | `/cwv [URL]` — audyt → naprawa → przed/po |
| Bezpieczeństwo (przed deployem, zmiany auth) | `/security` |
| Review brancha/PR standalone | `/code-review` (review FAZ robi pipeline sam) |
| Utrzymanie bazy wiedzy | `/dev-compound-refresh` (okresowo, gdy docs/solutions/ rośnie) |

## 7. Dyscyplina myślenia (wtrącane w dowolny moment)

- `/zroastuj-mnie [plan]` — PRZED planowaniem, pełny ostrzał pomysłu
- `/critical-think` — wątpliwa diagnoza/decyzja, "czy to na pewno"
- `/gemini [zadanie]` — druga opinia innego modelu

## 8. Higiena sesji

- Kontekst puchnie w trakcie zadania → `/dev-docs-update` (zapis stanu + WIP commit) → po resecie `/dev-docs-execute` kontynuuje z checkboxów
- Dodałeś/usunąłeś skill → `/skill-rules-manager`

## Zasady kciuka

1. Pełny pipeline = feature wielofazowy. Fast-path brainstormu = średni. Bezpośrednio = drobiazg.
2. Bugi ZAWSZE przez `/bugfix` — proces jest szybki dla prostych, a chroni przed strzelaniem na ślepo.
3. Nigdy nie pomijaj: review po fazie i gate'u dowodowego przed "gotowe".
4. Duża/ryzykowna zmiana wykryta w trakcie (audytu, fixa, fazy) → nie rób "przy okazji"; handoff do `/dev-plan`.
5. Rozwiązałeś coś nietrywialnego → `/dev-compound` póki kontekst świeży. Wiedza się kumuluje.
