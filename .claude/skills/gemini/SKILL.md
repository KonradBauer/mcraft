---
name: gemini
description: Uruchom Gemini CLI jako subagenta do analizy kodu, audytu UX, przeglądu bezpieczeństwa lub dowolnego zadania projektowego. Zapisuje ustrukturyzowany feedback w docs/gemini/ jako plik markdown z datą. Używaj gdy potrzebujesz drugiej opinii AI lub analizy przez Gemini.
argument-hint: [zadanie do wykonania, np. "przeanalizuj UX strony głównej"]
allowed-tools: Bash(gemini *), Bash(mkdir *), Bash(date *), Bash(which *), Write, Read
disable-model-invocation: true
---

Jesteś agentem pośredniczącym między użytkownikiem a Gemini CLI. Twoim zadaniem jest uruchomienie Gemini z podanym zadaniem i zapisanie wyników.

## Zadanie od użytkownika

$ARGUMENTS

## Instrukcje

### 1. Walidacja

- Sprawdź czy Gemini CLI jest zainstalowany: `which gemini`
- Jeśli nie znaleziono → poinformuj użytkownika i zakończ
- Jeśli zadanie jest zbyt ogólne → poproś o doprecyzowanie

### 2. Przygotuj folder na wyniki

- Domyślny folder: `docs/gemini/` (jeśli projekt ma już inną konwencję na takie artefakty — np. istniejący `Zasoby/gemini/` — użyj jej)
- Jeśli nie istnieje: `mkdir -p docs/gemini`

### 3. Uruchom Gemini CLI

- Zbuduj prompt bezpiecznie — treść zadania może zawierać cudzysłowy; preferuj heredoc zamiast interpolacji:
  ```bash
  gemini -p "$(cat <<'GEMINI_EOF'
  [treść zadania]
  GEMINI_EOF
  )"
  ```
- Duże analizy trwają minuty — uruchamiaj z timeoutem ≥ 300000 ms; dłuższe zadania w trybie background
- Gemini ma dostęp do plików projektu i może je analizować
- Błąd / pusta odpowiedź → pokaż stderr użytkownikowi i zakończ; NIE zapisuj pustego pliku

### 4. Zapisz wyniki

- Pobierz datę: `date +%Y-%m-%d` (aktualny rok: 2026)
- Nazwa pliku: `RRRR-MM-DD_[nazwa-zadania].md`
  - Przykład: `2026-07-02_analiza-ux-strony-glownej.md`
  - Format nazwy: kebab-case, max 50 znaków (bez daty)
- Zapisz w folderze z kroku 2

**Format pliku:**
```markdown
# [Tytuł zadania]

**Data:** RRRR-MM-DD
**Źródło:** Gemini CLI
**Zapytanie:** $ARGUMENTS

---

## Odpowiedź Gemini

[Pełna odpowiedź od Gemini]

---

*Wygenerowano przez /gemini*
```

## Format wyjściowy
```
✅ Gemini wykonał zadanie
📄 Zapisano: docs/gemini/RRRR-MM-DD_[nazwa-pliku].md

📋 Podsumowanie:
   • [punkt 1]
   • [punkt 2]
   • [punkt 3]

💡 Pełna odpowiedź w pliku powyżej
```