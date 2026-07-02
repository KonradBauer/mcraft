---
name: plan-review
description: "Wieloperspektywiczny przegląd planu z VP Product, VP Engineering i VP Design. Używaj przy przeglądaniu planów implementacji, dokumentów projektowych, propozycji architektonicznych lub planów fazowych w celu identyfikacji blokerów, anty-wzorców, konfliktów i regresji."
argument-hint: "[ścieżka-do-planu]"
disable-model-invocation: true
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Glob, Agent
---

# Przegląd Planu

Wieloperspektywiczny przegląd planu z VP Product, VP Engineering i VP Design w celu identyfikacji blokerów, anty-wzorców, konfliktów i regresji.

Szczegółowe prompty VP, kategorie problemów, definicje ważności i szablony formatu wyjściowego znajdziesz w [agent-prompt.md](agent-prompt.md) w `${CLAUDE_SKILL_DIR}`.

## Przepływ pracy

1. **Wczytaj plan** — załaduj plik planu z `$ARGUMENTS`. Jeśli nie podano: wykonaj `Glob docs/plans/*-plan.md`, pokaż 3-5 najnowszych i zapytaj użytkownika który przeglądać
2. **Wczytaj materiały referencyjne** — załaduj `${CLAUDE_SKILL_DIR}/agent-prompt.md` z promptami VP i formatem wyjściowym
3. **Uruchom 3 agentów VP równolegle** — użyj narzędzia Agent, aby uruchomić wszystkich trzech w jednej wiadomości:
   - VP Product (subagent_type: `general-purpose`) — wpływ na użytkownika, zakres, zależności, harmonogramy
   - VP Engineering (subagent_type: `general-purpose`) — dług techniczny, anty-wzorce, architektura, regresje, bezpieczeństwo
   - VP Design (subagent_type: `general-purpose`) — spójność UX, dostępność, zgodność z design systemem

   Typ `Explore` jest tu NIEPOPRAWNY — to agent do lokalizowania kodu, jawnie nieprzeznaczony do audytu dokumentów projektowych. Agent VP nie widzi tej rozmowy — pełna treść planu MUSI być w promptcie.
4. **Konsolidacja wyników** — deduplikacja, ranking wg ważności (Krytyczny > Wysoki > Średni > Niski), odniesienia krzyżowe
5. **Prezentacja wyników** — pokaż tabelę problemów krytycznych i tabelę wszystkich problemów (format w agent-prompt.md)
6. **Zwróć rekomendacje** — zwróć pełne podsumowanie przeglądu jako tekst do głównej konwersacji

## Prompty agentów VP

Przy uruchamianiu agentów VP dołącz pełną treść planu do każdego promptu. Każdy agent powinien zwrócić ustrukturyzowane wyniki w tym formacie:

```
Perspektywa: [product|engineering|design]
Problemy:
- Ważność: [Krytyczny|Wysoki|Średni|Niski]
  Kategoria: [Bloker|Anty-wzorzec|Konflikt|Regresja|Zakres|Wzorzec|UX]
  Opis: [<240 znaków]
  Kompromisy: [Opcja A vs Opcja B]
  Rekomendacja: [Zalecane działanie]
```

## Format wyjściowy

Przedstaw skonsolidowane wyniki jako:

**Problemy krytyczne** (wymagają natychmiastowej decyzji):

| # | VP | Kategoria | Problem | Kompromisy | Rekomendacja |
|---|----|-----------|---------|-----------:|--------------|

**Wszystkie problemy** (pełna lista rankingowa):

| # | VP | Ważność | Kategoria | Problem (<240 znaków) |
|---|----|---------|-----------|----------------------|

Zakończ podsumowaniem rekomendacji zawierającym:
- Łączną liczbę znalezionych problemów
- Podział wg ważności
- Sugerowane modyfikacje planu jako konkretne edycje tekstowe

Główna konwersacja zastosuje zatwierdzone edycje — NIE edytuj pliku planu bezpośrednio.
