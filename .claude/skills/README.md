# Warsztat skilli — konwencje i architektura

Przenośny zestaw skilli i subagentów do pracy z Claude Code. Ten plik dokumentuje konwencje obowiązujące w całym warsztacie. Zaktualizowano po pełnym audycie i rewricie: 2026-07-02.

**Jak używać warsztatu (sekwencje per scenariusz): [PLAYBOOK.md](PLAYBOOK.md)**

## Pipeline wytwórczy (rdzeń)

```
/dev-ideate ──► /dev-brainstorm ──► /dev-plan ──► /dev-docs ──► /dev-docs-execute ◄──► /dev-docs-review
 (pomysły)       (CO budować)        (JAK)        (struktura)      (1 faza/run)         (5 agentów)
                                                                        │
                                                    /dev-autopilot (orkiestruje pętlę) 
                                                                        │
                                                  /dev-docs-complete ──► /dev-compound ◄──► /dev-compound-refresh
                                                    (archiwizacja)        (baza wiedzy docs/solutions/)
```

Wsparcie: `/bugfix` (naprawa bugów), `/plan-review` (3 VP), `/code-quality` (audyt 4-przebiegowy), `/code-review` (review standalone), `/cwv` (audyt+naprawa Core Web Vitals: PSI/Lighthouse → playbooki → przed/po), `/critical-think` + `/zroastuj-mnie` (dyscyplina myślenia), `/dev-docs-update` (zapis stanu przed limitem kontekstu), `/agent-browser` (E2E), `/gemini` (druga opinia AI), `/security`, `/coolify-manager`, `/skill-rules-manager`.

## Konwencje twarde (obowiązują wszystkie skille)

1. **Ścieżki artefaktów:** requirements → `docs/dev-brainstorms/`, plany → `docs/plans/` (numeracja NNN GLOBALNA), zadania → `docs/active/[nazwa]/`, archiwum → `docs/completed/`, wiedza → `docs/solutions/`, ideacja → `docs/ideation/`, audyty → `docs/audits/`.
2. **Checkboxy:** zadania `- [ ]`/`- [x]`; emoji ✅ TYLKO w nagłówku w pełni ukończonej fazy. Markery: `[ZABLOKOWANE: powód]`, `(ręczne)`, `(odkryte podczas Fazy N)`.
3. **Severity:** 🔴 P1-blocking / 🟠 P2-important / 🟡 P3-nit (+ 🔵 suggestion poza gate'em). Failed E2E = P2.
4. **Subagenci:** NIE widzą rozmowy — każdy prompt musi być samowystarczalny (pakiet kontekstu). `Explore` tylko do wyszukiwania kodu, NIGDY do analizy otwartej/audytu dokumentów (→ `general-purpose`). Porażka agenta → odnotuj i kontynuuj, max 1 retry. Commity i aktualizacje dokumentacji robi wyłącznie główna sesja.
5. **Pytania do usera:** `AskUserQuestion`, jedno na turę, budżety per skill. Rekomendacja jako pierwsza opcja z "(Rekomendowane)".
6. **Komendy projektu:** zawsze z sekcji Commands w CLAUDE.md docelowego repo (package manager, env prefixy, URL dev servera).
7. **Dyscyplina testowa:** test failuje → napraw kod; zakaz osłabiania asercji, testów bez asercji, mockowania testowanego kodu.
8. **Akcje produkcyjne** (rollback, redeploy, restart) i **edycja CLAUDE.md/rules** → wymagają zgody usera (wyjątek: Faza 0.0 dev-brainstorm — sekcja Konwencje treści).
9. **Gate'y PASS/FAIL** przed zapisem artefaktów; FAIL → popraw przed pokazaniem userowi.
10. **Data:** z kontekstu środowiska (currentDate), nie z wiedzy treningowej.

## Portowalność

Skille workflow są **adaptacyjne** — wykrywają kontekst projektu zamiast go zakładać:
- komendy/package manager: CLAUDE.md Commands + lockfile (bugfix, execute, autopilot, auto-error-resolver)
- URL dev servera: CLAUDE.md + package.json next→:3000 / vite→:5173 (agent-browser, autopilot, e2e-verifier)
- stack do review/audytu: CLAUDE.md + package.json, zakaz flagowania braku nieużywanych technologii (code-review, security, agenci review)
- frame'y ideacji i kategorie compound: uniwersalne role/kategorie, konkretyzowane ze skanu projektu

Jedyna warstwa projektowa do regeneracji przy portowaniu: `code-review/resources/` (checklisty i common-issues wygenerowane per stack — nagłówki plików mówią dla którego).

Skille guideline'owe (`supabase-dev-guidelines`, `sentry-integration`, `tailwind-react-guidelines`, `ux-ui-guidelines`) mają **gate stosowalności** — same sprawdzają stack projektu i odmawiają działania poza nim.

`payload/` to oficjalny vendor skill — nie edytować lokalnie (dywergencja od upstream).

## Higiena repo

`/dev-brainstorm` Faza 0.0 pilnuje w każdym projekcie: CLAUDE.md istnieje (tworzy przez `/init`), sekcja Konwencje treści (zakaz em dashy, polskie znaki), `.gitignore` zawiera: `.claude/`, `docs/audits/`, `docs/gemini/`, `docs/ideation/` — warsztat i raporty AI zostają lokalne, poza zdalnym repo.

## Auto-aktywacja

`skill-rules.json` + hook `skill-activation-prompt.sh` (UserPromptSubmit). Audyt i synchronizacja: `/skill-rules-manager` — uruchamiaj po dodaniu/usunięciu skilli. Keywords specyficzne, nie ogólne ("supabase" tak, "error" nie). Meta-skille poza skill-rules.json.

## Wnioski z audytu 2026-07 (dla przyszłych zmian)

Najczęstsze defekty znalezione i naprawione — sprawdzaj je przy każdym nowym skillu:
1. **Kopiowanie z innego projektu bez adaptacji** (Supabase/Vite/Sentry w repo Payload/Next) — 6+ skilli; naprawa: gate stosowalności lub warianty per stack.
2. **Rozjazd ścieżek między skillami** (`docs/brainstorms/` vs `docs/dev-brainstorms/`) — łamał integrację pipeline'u.
3. **Prompty subagentów zakładające dostęp do rozmowy** — subagent startuje na zimno.
4. **Kryteria "z wyczucia"** ("aż będzie jasne", "gdy przydatne") — zamieniaj na punktacje, budżety, tabele decyzyjne, warunki STOP.
5. **Review z `git status`** po workflow, który commituje — martwe wejście; wyznaczaj zakres commitów.
6. **Brak obsługi pustych argumentów i stanów brzegowych** (brudny git, istniejący branch/katalog, blokady).
7. **Zły typ subagenta** (`Explore` do analizy otwartej).
