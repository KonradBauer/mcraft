---
name: dev-brainstorm
description: 'Walidacja i doprecyzowanie pomysłu przed planowaniem. Interaktywny dialog, pressure test, eksploracja podejść, requirements doc. Używaj przy "mam pomysł", "zróbmy brainstorm", "co myślisz o", "pomóż mi przemyśleć", "chcę zbudować", niejasny scope, wiele możliwych rozwiązań.'
argument-hint: "[pomysł na feature lub problem do zbadania]"
---

# Brainstorm — walidacja pomysłu

Brainstorming odpowiada na pytanie **CO** budować. Poprzedza `/dev-plan`, który odpowiada na pytanie **JAK**. Trwałym wynikiem jest **dokument wymagań** w `docs/dev-brainstorms/` — na tyle konkretny, żeby planowanie nie musiało wymyślać zachowań produktu, granic scope'u ani kryteriów sukcesu.

Ten skill NIE implementuje kodu i NIE podejmuje decyzji technicznych. Eksploruje, doprecyzowuje i dokumentuje decyzje produktowe.

## Twarde reguły — obowiązują w każdej fazie

1. **Jedno pytanie na turę.** Nigdy nie łącz dwóch pytań w jednej wiadomości. Do pytań używaj narzędzia `AskUserQuestion`; jeśli niedostępne — numerowane opcje w chacie i czekaj na odpowiedź.
2. **Nie pisz kodu, nie edytuj plików** poza `docs/dev-brainstorms/`.
3. **Nie wymyślaj odpowiedzi za użytkownika.** Brak odpowiedzi = otwarte pytanie w dokumencie, nie założenie.
4. **Decyzje produktowe rozstrzygaj tutaj, implementacyjne odraczaj** do `/dev-plan`. Rozróżnienie — patrz tabela niżej.
5. **Data:** bierz aktualną datę z kontekstu środowiska (currentDate). Aktualny rok to 2026 — nie datuj dokumentów rokiem z wiedzy treningowej.
6. **Język dokumentu:** taki jak język dotychczasowych plików w `docs/` (w tym projekcie: polski).
7. **Single-select domyślnie.** Multi-select tylko dla list zbiorczych (cele, non-goals, kryteria sukcesu); gdy user wybierze >1 element i priorytet ma znaczenie — dopytaj który jest główny.

## Tabela rozróżnienia: produkt vs implementacja

| Produktowe — rozstrzygaj TERAZ | Implementacyjne — odrocz do /dev-plan |
|---|---|
| Co użytkownik widzi, gdy lista jest pusta | Który komponent renderuje listę |
| Czy operacja wymaga potwierdzenia | Jak wygląda modal potwierdzenia w kodzie |
| Kto ma dostęp do funkcji | Jak zaimplementować sprawdzanie uprawnień |
| Co się dzieje przy błędzie (z perspektywy usera) | Retry logic, kody błędów, format logów |
| Limity: ile plików, jak duże, jakie typy | Walidacja MIME, biblioteka uploadu |
| Kolejność kroków w flow użytkownika | Struktura routingu, nazwy endpointów |

Test samokontroli: jeśli zdanie zawiera nazwę biblioteki, endpointu, tabeli, pliku lub komponentu — to implementacja. Wyjątek: brainstorm inherentnie techniczny (wybór architektury/stacku jest samym tematem) — wtedy szczegóły techniczne są dozwolone, ale tylko w sekcji "Kluczowe decyzje".

## Opis feature'a

<feature_description> #$ARGUMENTS </feature_description>

**Jeśli opis pusty:** zapytaj "Co chciałbyś zbadać? Opisz feature, problem lub usprawnienie." i ZATRZYMAJ SIĘ. Nie kontynuuj bez opisu.

## FAZA 0: Wejście i klasyfikacja

### 0.0 Bootstrap projektu (CLAUDE.md + reguły treści)

Wykonaj na KAŻDYM uruchomieniu, przed czymkolwiek innym:

1. Sprawdź czy `CLAUDE.md` istnieje w root projektu.
2. **Nie istnieje** → uruchom `/init` (Skill tool) żeby go wygenerować. Poczekaj na zakończenie.
3. Sprawdź czy CLAUDE.md zawiera poniższe reguły treści (szukaj sekcji o em dashach / polskich znakach). **Brakuje** → dopisz na końcu CLAUDE.md sekcję:

```markdown
## Konwencje treści

- **Em dashe zabronione** - używaj zwykłego myślnika `-` zamiast `—` we wszystkich tekstach widocznych dla użytkownika (JSX, metadata, stringi, dokumentacja)
- **Zawsze polskie znaki** - wszystkie teksty pisz z pełnymi polskimi znakami diakrytycznymi (ą, ć, ę, ł, ń, ó, ś, ź, ż); nigdy nie zastępuj ich odpowiednikami ASCII
```

4. Obie reguły już obecne → nic nie rób.
5. **Gitignore warsztatu i raportów.** Sprawdź `.gitignore` w root; dopisz brakujące z poniższych wpisów (nie duplikuj istniejących):

```gitignore
# Warsztat Claude (lokalny, nie do zdalnego repo)
.claude/
# Raporty robocze AI
docs/audits/
docs/gemini/
docs/ideation/
```

   Uwaga: jeśli `.claude/` jest już trackowane w repo (sprawdź `git ls-files .claude | head -1`), sam wpis w .gitignore nie usunie go ze zdalnego — poinformuj usera, że pełne usunięcie wymaga `git rm -r --cached .claude/` + commit, i zapytaj czy wykonać.

6. Kontynuuj do 0.1.

To jedyne dozwolone autonomiczne edycje CLAUDE.md i .gitignore w tym skillu — ograniczone do powyższych sekcji/wpisów.

### 0.1 Wznowienie istniejącej pracy

Wykonaj: `Glob docs/dev-brainstorms/*-requirements.md`.

Jeśli istnieje plik, którego temat pasuje do opisu ALBO zmodyfikowany w ciągu ostatnich 14 dni i user nawiązuje do wcześniejszej rozmowy:
1. Przeczytaj dokument.
2. Zapytaj (AskUserQuestion): "Znalazłem istniejący requirements doc dla [temat]. Kontynuować od niego czy zacząć od nowa?"
3. Przy wznowieniu: streść stan w ≤5 bulletach, kontynuuj od otwartych pytań, AKTUALIZUJ istniejący plik (nie twórz nowego, nie zmieniaj daty w nazwie).

Jeśli nic nie pasuje — idź dalej bez pytania.

### 0.2 Klasyfikacja scope — punktacja

Policz punkty na podstawie opisu (przy wątpliwości licz punkt):

| Kryterium | Punkty |
|---|---|
| Dotyka więcej niż ~3 plików/obszarów (szacunkowo) | +1 |
| Brak kryteriów akceptacji w opisie | +1 |
| Widzisz ≥2 istotnie różne podejścia | +1 |
| Dotyka danych, API, uprawnień, płatności lub security | +1 |
| Opis zawiera "nie wiem", "może", "jakoś", "coś w stylu" | +1 |

**Wynik:** 0-1 pkt → **Lekka** | 2-3 pkt → **Standardowa** | 4-5 pkt → **Głęboka**

Zapisz klasyfikację w pamięci roboczej — steruje budżetami w dalszych fazach. Jeśli klasyfikacja niemożliwa (opis zbyt lakoniczny), zadaj JEDNO doprecyzowujące pytanie i sklasyfikuj po odpowiedzi.

### 0.3 Fast-path: wymagania już jasne

Jeśli spełnione są WSZYSTKIE 4 warunki:
- [ ] Opis zawiera konkretne kryteria akceptacji
- [ ] Istnieje wzorzec w repo, do którego opis się odwołuje
- [ ] Dokładne zachowanie jest opisane (co user widzi/robi)
- [ ] Scope jest ograniczony i domknięty

→ pomiń Fazy 1.1-1.2. Potwierdź zrozumienie w 3-5 bulletach, zapytaj "Dobrze rozumiem?" i po potwierdzeniu przejdź do Fazy 3.

Jeśli choć jeden warunek niespełniony — pełny przebieg.

## FAZA 1: Zrozumienie

### 1.1 Skan repo

Budżet zależny od scope:

- **Lekka:** 1-2 wyszukiwania (Grep/Glob) tematu. Sprawdź czy coś podobnego już istnieje. Koniec.
- **Standardowa / Głęboka:** (a) przeczytaj `CLAUDE.md` i reguły projektu pod kątem ograniczeń wpływających na temat; (b) Grep 2-4 powiązanych terminów; (c) przeczytaj JEDEN najbardziej relewantny istniejący artefakt (brainstorm, plan, feature doc).

Po skanie wypisz userowi 1-3 zdania: co znalazłeś albo "nic powiązanego w repo".

**Zakazy:** nie czytaj testów, migracji, konfiguracji CI/CD ani niskopoziomowej architektury — chyba że brainstorm jest inherentnie techniczny.

### 1.2 Pressure test — procedura wewnętrzna

Odpowiedz sobie (NIE wyświetlaj userowi eseju z odpowiedziami) na pytania właściwe dla scope:

**Lekka:** Czy to rozwiązuje prawdziwy problem? Czy nie duplikuje czegoś istniejącego? Czy istnieje lepsze ujęcie przy zerowym dodatkowym koszcie?

**Standardowa (dodatkowo):** Czy to właściwy problem, czy proxy ważniejszego? Co się stanie, jeśli nic nie zrobimy? Czy sąsiednie ujęcie daje więcej wartości bez większego kosztu utrzymania?

**Głęboka (dodatkowo):** Jaką trwałą zdolność to tworzy w horyzoncie 6-12 miesięcy? Czy to kierunek produktu, czy lokalny plaster?

Dla KAŻDEGO pytania przypisz jeden z trzech wyników i wykonaj akcję:

| Wynik | Akcja |
|---|---|
| **OK** | Kontynuuj, nic nie mów |
| **WĄTPLIWOŚĆ** | Zanotuj; zadaj userowi jako jedno z pytań w Fazie 1.3 |
| **RED FLAG** (duplikacja istniejącej funkcji, problem-proxy, wyraźnie lepszy frame za darmo) | PRZED dialogiem przedstaw userowi jako AskUserQuestion z opcjami: [kontynuuj jak jest] [zmień ujęcie na: ...] [porzuć temat] |

Maksymalnie JEDNO pytanie red-flag na cały brainstorm — nie blokuj usera wielokrotnie. Wynik pressure testu wyostrzają rozmowę; decyzja zawsze należy do usera.

### 1.3 Dialog

**Budżet pytań:** Lekka ≤3, Standardowa ≤7, Głęboka ≤10. Przekroczenie dozwolone TYLKO gdy user aktywnie rozwija temat i sam generuje nowe wątki.

**Kolejność tematów** — zadawaj pytania tylko o tematy bez odpowiedzi, w tej kolejności:
1. **Problem** — kto go ma, kiedy występuje
2. **Wartość** — co się poprawia, gdy zadziała
3. **Zachowanie** — co user widzi/robi, krok po kroku
4. **Granice** — czego świadomie NIE robimy
5. **Kryteria sukcesu** — po czym poznamy, że działa
6. **Edge cases** — stany puste, błędy, limity (tylko Standardowa/Głęboka)

**Zasady:**
- Jedno pytanie na turę (twarda reguła nr 1 — obowiązuje też tutaj)
- Zaczynaj szeroko, zawężaj
- Przynoś pomysły i alternatywy, nie tylko przeprowadzaj wywiad — ale w formie opcji do wyboru, nie monologu
- Zależności/prerequisites poruszaj tylko gdy materialnie wpływają na scope

**Warunki STOP (dialog kończy się, gdy zachodzi KTÓRYKOLWIEK):**
- Tematy 1-5 mają odpowiedzi
- Budżet pytań wyczerpany
- User sygnalizuje: "wystarczy", "dalej", "leć", "przejdźmy dalej"

## FAZA 2: Eksploracja podejść

**Warunek wejścia:** pozostają ≥2 wiarygodne kierunki. Jeśli jeden kierunek jest oczywisty — przedstaw go jako rekomendację (2-4 zdania + dlaczego) i przejdź do Fazy 3 bez menu opcji.

Przy ≥2 kierunkach przedstaw 2-3 podejścia w tym formacie:

```
### Podejście A: <nazwa>
Opis: <≤3 zdania>
Zalety: <bullety>
Wady: <bullety>
Ryzyka/niewiadome: <bullety>
Najlepsze gdy: <1 zdanie>
```

**Challenger option:** dołącz JEDNĄ celowo ambitniejszą alternatywę tylko gdy widzisz rozszerzenie o wysokiej wartości i niskim koszcie utrzymania. Oznacz ją jawnie jako "Challenger" — nigdy nie ustawiaj jej jako domyślnej. Pomiń, gdy praca już jest na granicy over-scope.

Zawsze wskaż rekomendację + 1 zdanie uzasadnienia. Preferuj prostsze rozwiązania, gdy złożoność tworzy realny koszt utrzymania — ale nie ucinaj taniego polishu o wysokiej wartości.

Gdy relewantne, oznacz wybór jako: reużycie istniejącego wzorca / rozszerzenie istniejącej zdolności / budowa od zera.

Wybór podejścia = AskUserQuestion (single-select, rekomendacja jako pierwsza opcja z dopiskiem "(Rekomendowane)").

## FAZA 3: Dokument wymagań

### 3.1 Gate: czy pisać dokument

| Warunek | Akcja |
|---|---|
| Scope Standardowa lub Głęboka | Pisz dokument |
| Scope Lekka ORAZ ≥1 nietrywialna decyzja warta zachowania | Pisz dokument kompaktowy |
| Scope Lekka, user potrzebował tylko potwierdzenia, zero trwałych decyzji | NIE pisz. Podsumuj w chacie (≤6 bulletów) i przejdź do Fazy 4 |

### 3.2 Ścieżka i nazwa pliku

```
docs/dev-brainstorms/YYYY-MM-DD-<kebab-case-temat>-requirements.md
```

- Data = dzisiejsza (z currentDate)
- Temat = 2-5 słów kebab-case, np. `2026-07-02-eksport-raportow-pdf-requirements.md`
- Upewnij się, że katalog istnieje przed zapisem
- Przy wznowieniu: aktualizuj istniejący plik, zachowaj oryginalną datę w nazwie

### 3.3 Szablon

Użyj szablonu; sekcje niepasujące do scope POMIŃ (nie zostawiaj pustych nagłówków):

```markdown
---
date: YYYY-MM-DD
topic: <kebab-case-topic>
---

# <Tytuł tematu>

## Problem
[Kogo dotyczy, co się zmienia i dlaczego to ważne]

## Wymagania
- R1. [Konkretne zachowanie od strony użytkownika]
- R2. [Konkretne zachowanie od strony użytkownika]

## Kryteria sukcesu
- [Weryfikowalne kryterium — musi dać się odpowiedzieć tak/nie]

## Granice scope'u
- [Świadomy non-goal lub wykluczenie]

## Kluczowe decyzje
- [Decyzja]: [Uzasadnienie]

## Zależności / Założenia
- [Tylko gdy materialne]

## Otwarte pytania

### Do rozwiązania przed planowaniem
- [Dotyczy R1][Decyzja użytkownika] [Pytanie blokujące planowanie]

### Odroczone do planowania
- [Dotyczy R2][Techniczne] [Pytanie do rozstrzygnięcia podczas planowania]
- [Dotyczy R2][Wymaga researchu] [Pytanie wymagające researchu]

## Następne kroki
[→ /dev-plan gdy brak pytań blokujących | → Wznów /dev-brainstorm gdy są]
```

**Reguły ID wymagań:**
- Numery R1..Rn nadawaj raz, w kolejności powstania
- NIGDY nie renumeruj — plan i review odwołują się do ID
- Usunięte wymaganie oznacz `R3. [USUNIĘTE: powód]`, nie używaj numeru ponownie
- ID stosuj zawsze w Standardowa/Głęboka; w bardzo małych docs (1-3 wymagania) zwykłe bullety są akceptowalne

**Klasyfikacja otwartych pytań:**
- `Do rozwiązania przed planowaniem` — WYŁĄCZNIE decyzje produktowe, które user musi podjąć (test: czy odpowiedź zmienia zachowanie widoczne dla użytkownika?)
- `Odroczone do planowania` — pytania techniczne i wymagające researchu; NIE wymuszaj ich rozstrzygania podczas brainstormu
- Przenoszenie pytania do "Odroczone" to poprawne domknięcie, nie porażka

### 3.4 Checklist przed zapisem — wszystkie punkty muszą przejść

- [ ] Każde R# opisuje zachowanie widoczne dla użytkownika/systemu, nie technologię
- [ ] Zero nazw bibliotek, endpointów, schematów, plików (wyjątek: temat inherentnie techniczny → tylko w "Kluczowe decyzje")
- [ ] Każde kryterium sukcesu jest weryfikowalne (odpowiedź tak/nie możliwa)
- [ ] Standardowa/Głęboka: sekcja "Granice scope'u" zawiera ≥1 świadomy non-goal
- [ ] Żadne pytanie techniczne nie siedzi w "Do rozwiązania przed planowaniem"
- [ ] Żadne wymaganie nie zależy od czegoś oznaczonego jako out of scope
- [ ] Gdyby brainstorm skończył się teraz — planowanie nie musi wymyślać zachowań produktu

Jeśli którykolwiek punkt FAIL → popraw dokument PRZED pokazaniem userowi. Nie zapisuj wersji failującej.

### 3.5 Przykład minimalnego wypełnionego dokumentu

```markdown
---
date: 2026-07-02
topic: eksport-raportow-pdf
---

# Eksport raportów do PDF

## Problem
Klienci proszą o raporty mailem; obecnie robimy zrzuty ekranu ręcznie. Tracimy ~2h tygodniowo.

## Wymagania
- R1. Użytkownik może pobrać raport miesięczny jako PDF jednym kliknięciem z widoku raportu.
- R2. PDF zawiera te same dane co widok na ekranie (wykresy jako obrazy, tabela wartości).
- R3. Plik nazywa się `raport-YYYY-MM.pdf`.

## Kryteria sukcesu
- Wygenerowanie PDF trwa poniżej 10 sekund dla typowego raportu.
- Zero ręcznych zrzutów ekranu przy wysyłce raportów po wdrożeniu.

## Granice scope'u
- Bez automatycznej wysyłki mailem (osobny temat).
- Bez konfigurowalnych szablonów PDF.

## Kluczowe decyzje
- Eksport synchroniczny (bez kolejki): raporty są małe, kolejka to zbędna złożoność.

## Otwarte pytania

### Odroczone do planowania
- [Dotyczy R2][Techniczne] Jak renderować wykresy do obrazu.

## Następne kroki
→ /dev-plan
```

## FAZA 4: Handoff

### 4.1 Drzewo decyzyjne

```
CZY "Do rozwiązania przed planowaniem" zawiera elementy?
├─ TAK → zadawaj te pytania teraz, jedno na turę (wróć do trybu Fazy 1.3)
│        NIE oferuj opcji "Planowanie" ani "Praca"
│        ├─ user odpowiada → aktualizuj doc, wróć do 4.1
│        ├─ user chce przejść dalej mimo pytań → przekonwertuj KAŻDY element na:
│        │    jawną decyzję / jawne założenie / pytanie "Odroczone do planowania",
│        │    zaktualizuj doc, potem → gałąź NIE
│        └─ user chce pauzę → podsumowanie "wstrzymany" (szablon niżej), koniec
└─ NIE → AskUserQuestion: "Brainstorm ukończony. Co dalej?"
         Opcje (pokazuj tylko pasujące):
         1. Przejdź do planowania (Rekomendowane) — uruchom /dev-plan
         2. Przejdź bezpośrednio do pracy — TYLKO gdy gate spełniony*
         3. Przejrzyj i dopracuj — TYLKO gdy dokument istnieje
         4. Zadaj więcej pytań
         5. Gotowe na teraz
```

*Gate bezpośredniej pracy (wszystkie): scope Lekka + kryteria sukcesu jasne + granice jasne + brak istotnych otwartych pytań technicznych. Niespełniony → nie pokazuj opcji 2.

### 4.2 Wykonanie wybranej opcji

- **Planowanie:** uruchom `/dev-plan` (Skill tool) w bieżącej sesji. Argument: ścieżka requirements doc; gdy dokumentu brak — zwięzłe podsumowanie decyzji. NIE drukuj podsumowania końcowego.
- **Praca:** uruchom `/dev-docs-execute` z outputem brainstormu jako kontekstem. NIE drukuj podsumowania końcowego.
- **Dopracuj:** przeczytaj doc krytycznie, zaproponuj poprawki, zastosuj po akceptacji, wróć do 4.1.
- **Więcej pytań:** wróć do Fazy 1.3 z budżetem +3 pytania, potem wróć do 4.1.
- **Gotowe na teraz:** wydrukuj podsumowanie końcowe (niżej).

### 4.3 Szablony podsumowań końcowych

Podsumowanie drukuj TYLKO gdy workflow się kończy lub pauzuje (nie przy powrotach do 4.1).

Ukończony:

```text
Brainstorm ukończony!

Requirements doc: docs/dev-brainstorms/YYYY-MM-DD-<topic>-requirements.md  # jeśli stworzony

Kluczowe decyzje:
- [Decyzja 1]
- [Decyzja 2]

Rekomendowany następny krok: /dev-plan
```

Wstrzymany (niepuste pytania blokujące):

```text
Brainstorm wstrzymany.

Requirements doc: docs/dev-brainstorms/YYYY-MM-DD-<topic>-requirements.md  # jeśli stworzony

Planowanie zablokowane przez:
- [Pytanie 1]
- [Pytanie 2]

Wznów /dev-brainstorm gdy będziesz gotowy je rozstrzygnąć.
```

## Anty-wzorce — NIGDY

- Nie zadawaj 2+ pytań w jednej turze.
- Nie umieszczaj bibliotek, endpointów, schematów w wymaganiach (test z tabeli rozróżnienia).
- Nie twórz dokumentu dla trywialnej prośby ("zmień kolor przycisku").
- Nie zostawiaj pustych "Kryteriów sukcesu" w Standardowa/Głęboka.
- Nie wymyślaj odpowiedzi za usera — brak odpowiedzi to otwarte pytanie.
- Nie renumeruj R# po ich nadaniu.
- Nie wyświetlaj userowi surowych rozważań pressure testu — tylko wnioski w formie pytań/opcji.
- Nie dryfuj w planowanie techniczne — inspekcja testów/migracji/deploymentu należy do /dev-plan.

## Subagenci (opcjonalnie)

Główny przebieg jest interaktywny (dialog z userem) — subagenci nie mogą rozmawiać z userem, więc rdzeń zostaje w głównej sesji. Jedyne sensowne odciążenie:

- **Skan repo (Faza 1.1) dla scope Głęboka:** agent `Explore` (breadth: "medium"). Wejście: temat brainstormu + 3-5 terminów. Wyjście: lista powiązanych plików/artefaktów + 3-zdaniowe streszczenie. Kryterium zakończenia: streszczenie dostarczone. Dla Lekkiej i Standardowej — skanuj samodzielnie, spawn się nie opłaca.
