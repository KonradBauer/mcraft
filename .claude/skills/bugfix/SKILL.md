---
name: bugfix
description: "Systematyczna naprawa bugów w działającej aplikacji. Używaj przy błędach z Sentry, failujących E2E, zgłoszeniach userów, nieoczekiwanym zachowaniu po użyciu. Wywołuj przez /bugfix [opis bugu lub link Sentry]."
argument-hint: "[opis bugu lub link Sentry]"
---

# Bugfix — systematyczna naprawa bugów

Skill do naprawy bugów wykrytych w działającej aplikacji — alerty Sentry, E2E failures, zgłoszenia userów, nieoczekiwane zachowanie.

**Nadrzędna zasada:** znajdź root cause ZANIM zaproponujesz fix. Naprawa symptomu to porażka.

## Zmienne

- OPIS_BUGU: $1

**Jeśli $1 puste:** zapytaj "Jaki bug naprawiamy? Podaj opis, komunikat błędu lub link Sentry." STOP do odpowiedzi.

## Twarde reguły

1. **Komendy projektu** wykryj przed użyciem: sekcja Commands w `CLAUDE.md` (w tym wymagane prefixy env) + package manager z lockfile (`pnpm-lock.yaml`→pnpm, `bun.lockb`→bun, `yarn.lock`→yarn, inaczej npm). Nie zgaduj.
2. **Dyscyplina testowa:** test failuje → napraw kod, nie test. Zakaz osłabiania asercji.
3. **Akcje produkcyjne (rollback, redeploy) wymagają potwierdzenia usera** — proponuj, nie wykonuj samodzielnie, chyba że user już jawnie polecił.

## Instrukcje

### Faza 0: Triage

1. **Źródło bugu:** Sentry / E2E test / manual / zgłoszenie usera
2. **Priorytet:**
   - P0 — blokuje userów, aplikacja niedostępna
   - P1 — poważny, funkcjonalność uszkodzona
   - P2 — drobny, może poczekać
3. **Blast radius:** ilu userów dotyczy, od kiedy, jaki % ruchu (jeśli dane dostępne; brak dostępu do metryk → zapytaj usera lub odnotuj "nieznany")
4. **Sprawdź bazę wiedzy:**
   - Przeszukaj `docs/solutions/` — czy ten problem był już rozwiązany
   - Sprawdź Sentry (jeśli dostępne) — regression? (first seen vs last seen), grupowanie z innymi błędami
   - **Znaleziono rozwiązanie →** zastosuj je, POTEM: jeśli test reprodukujący da się napisać szybko (< kilka minut) — napisz go (Faza 2) przed weryfikacją; zawsze przejdź przez pełny gate Fazy 4. Fix z bazy nie trzyma → wróć do pełnego procesu od Fazy 1.

### Faza 0.5: Stabilizacja (tylko P0/P1)

1. **Czy rollback ostatniego deployu rozwiąże problem?**
   - `git log --oneline -10` — co weszło w ostatnim deploymencie
   - **Jeśli tak — ZAPROPONUJ rollback userowi** (AskUserQuestion): [rollback teraz] [naprawiaj forward bez rollbacku]. Opcje wykonania rollbacku:
     - Coolify: redeploy poprzedniego taga/commita przez dashboard
     - Git: `git revert <commit>` + deploy
     - CI/CD: pipeline z poprzednim stabilnym SHA
   - Po rollbacku investigację przeprowadź potem, w spokoju
   - Jeśli rollback nie pomoże lub user odmówił — kontynuuj do Fazy 1

### Faza 1: Investigacja

**ZANIM cokolwiek naprawisz:**

1. **Zbierz kontekst:**
   - Sentry: error message, stack trace, breadcrumbs, affected users, release
   - Logi: co działo się PRZED błędem
   - Network: request, payload, response code
   - DB: stan danych, których bug dotyczy (jeśli relewantne)
   - Brak dostępu do któregoś źródła → poproś usera o wklejenie (stack trace, log) zamiast zgadywać

2. **Reprodukuj:**
   - Kroki do reprodukcji, środowisko, dane testowe
   - Niepowtarzalny? → zbierz więcej danych, nie zgaduj

3. **Sprawdź zmiany:**
   - `git log --oneline --since="3 days ago"` — co się zmieniło
   - `git bisect` — jeśli wiadomo kiedy działało, a kiedy przestało
   - Nowe dependency, zmiana configu, zmiana środowiska

4. **Śledź dane (multi-component):**

   System ma wiele warstw (API → serwis → baza, frontend → backend → DB)?
   - Dodaj diagnostic logging na KAŻDEJ granicy komponentów
   - Uruchom raz, zbierz dowody GDZIE się psuje
   - Dopiero potem analizuj ten konkretny komponent

   Szczegółowa technika: przeczytaj `techniki/root-cause-tracing.md`

5. **Określ rozmiar fixa:**
   - Mały (1-2 pliki, oczywista zmiana) — naprawiaj na bieżącym branchu
   - Duży (3+ plików, zmiana logiki) — stwórz branch `fix/opis-bugu`

6. **OUTPUT:** zapisz jednozdaniowe podsumowanie: "Root cause to X, bo Y". Nie potrafisz go sformułować → nie rozumiesz jeszcze buga, wróć do punktu 1.

### Faza 2: Failing test

1. Napisz MINIMALNY test reprodukujący buga
2. Uruchom — MUSI failować
3. Test przechodzi → nie rozumiesz buga. Wróć do Fazy 1
4. Buga nie da się pokryć unit testem → test integracyjny lub scenariusz E2E

### Faza 3: Fix

1. **Jedna zmiana naprawiająca root cause** — nie symptom
   - NIE naprawiaj wielu rzeczy naraz
   - NIE dodawaj "ulepszeń" przy okazji
   - NIE osłabiaj asercji, żeby test przeszedł

2. **Uruchom test z Fazy 2** — MUSI przejść

3. **Uruchom pełny suite** — zero regresji

4. **Fix nie działa:**
   - < 3 próby: wróć do Fazy 1, przeanalizuj z nową wiedzą
   - ≥ 3 próby: **STOP.** Zakwestionuj architekturę:
     - Każdy fix ujawnia nowy problem w innym miejscu?
     - Fixy wymagają "masowej refaktoryzacji"?
     - Trzymamy się wzorca z bezwładności?
     - **Omów z userem zanim podejmiesz kolejną próbę** — przedstaw dotychczasowe próby i hipotezy

5. **Opcjonalnie — defense-in-depth:**
   Po udanym fixie dodaj walidację na wielu warstwach, żeby bug był strukturalnie niemożliwy.
   Szczegóły: przeczytaj `techniki/defense-in-depth.md`

### Faza 3.5: Cleanup

Przed weryfikacją — usuń diagnostic logi z Fazy 1:
- Usuń `console.error('DEBUG:...')` i tymczasowe logi
- Sprawdź `git diff` — kod diagnostyczny nie może trafić do commita
- Produkcyjny kod bez debug logowania

### Faza 4: Weryfikacja (Gate Function)

**Zanim powiesz "naprawione" — URUCHOM komendy i PRZECZYTAJ output:**

| Claim | Wymagany dowód | NIE wystarczy |
|-------|----------------|---------------|
| "Testy przechodzą" | Output komendy testowej: 0 failures | "Powinno przechodzić" |
| "Typecheck OK" | Output tsc: 0 errors | "Zmiana jest prosta" |
| "Lint czysty" | Output lintera: 0 errors | Częściowe sprawdzenie |
| "Bug naprawiony" | Test z Fazy 2 przechodzi | "Kod wygląda dobrze" |

Kolejność:
1. Typecheck → przeczytaj output → 0 errors?
2. Testy → przeczytaj output → 0 failures?
3. Lint → przeczytaj output → 0 errors?
4. E2E (jeśli dotyczy) → przechodzi?

**DOPIERO TERAZ możesz powiedzieć "naprawione".**

Cokolwiek failuje → wróć do Fazy 3. NIE racjonalizuj ("to pre-existing", "to niezwiązane") — pre-existing failure zgłoś userowi jawnie, nie zamiataj.

### Faza 4.5: Commit

Po przejściu gate'u:
- Staguj TYLKO pliki fixa i testu (nie `git add .`)
- Message: `fix: [co naprawiono i dlaczego się psuło]` (lub `fix(scope): ...` zgodnie z konwencją repo)
- Test reprodukujący commituj RAZEM z fixem — dokumentuje buga

### Faza 5: Monitoring po wdrożeniu

1. Bug dotyczył produkcji — po deployu fixa:
   - Sentry: error rate spada?
   - Metryki: endpoint/funkcja wraca do normy?
   - Potwierdź na żywo — nie polegaj tylko na lokalnych testach
   - Brak dostępu do prod → przekaż userowi checklistę weryfikacyjną zamiast pomijać krok
2. Bug dotyczył E2E/staging → uruchom pełny E2E suite po fixie

### Faza 6: Zamknięcie

1. **Dokumentacja:** problem wart zapamiętania?
   - Tak → uruchom `/dev-compound` z opisem problemu, root cause i rozwiązania
   - Nie (trywialny fix) → pomiń
2. **Pattern:** ten typ buga może się powtórzyć?
   - Tak → zaproponuj regułę, hook lub walidację zapobiegającą
3. **Zamknij issue/ticket**, jeśli istnieje

---

## Red Flags — łapiesz się na tym → STOP

- "Szybki fix, zbadamy później" → Faza 1
- "Spróbujmy zmienić X i zobaczymy" → Faza 1
- "Dodajmy kilka zmian naraz" → Faza 3, punkt 1
- "Pomińmy test, sprawdzę ręcznie" → Faza 2
- "Pewnie to X, naprawmy to" → Faza 1
- "Jeszcze jedna próba" (po 2+ nieudanych) → Faza 3, punkt 4
- "Gotowe!" (bez uruchomienia komend) → Faza 4

## Techniki wspierające

Pliki w katalogu `techniki/` — czytaj gdy potrzebne:

- **`root-cause-tracing.md`** — śledź buga wstecz przez call stack do źródła
- **`defense-in-depth.md`** — po fixie dodaj walidację na wielu warstwach
- **`condition-based-waiting.md`** — zamień sleep()/setTimeout() na polling warunku (flaky testy)
- **`find-polluter.sh`** — skrypt bisection: który test zanieczyszcza stan

## Racjonalizacje vs rzeczywistość

| Wymówka | Rzeczywistość |
|---------|---------------|
| "Prosty bug, nie potrzeba procesu" | Proste bugi też mają root cause. Proces jest szybki dla prostych. |
| "Awaryjnie, nie ma czasu" | Systematyczne debugowanie jest SZYBSZE niż strzelanie na ślepo. |
| "Najpierw fix, potem zbadamy" | Pierwszy fix ustala pattern. Zrób dobrze od razu. |
| "Napiszę test po potwierdzeniu fixa" | Test, który od razu przechodzi, niczego nie dowodzi. |
| "Kilka fixów naraz oszczędzi czas" | Nie wiadomo co zadziałało. Powoduje nowe bugi. |
| "Widzę problem, naprawmy to" | Widzieć symptom ≠ rozumieć root cause. |
