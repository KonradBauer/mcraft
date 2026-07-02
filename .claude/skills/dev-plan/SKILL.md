---
name: dev-plan
description: "Planowanie techniczne implementacji z Implementation Units."
argument-hint: "[opcjonalnie: ścieżka do requirements doc lub opis feature'a]"
---

# Stwórz plan techniczny

`/dev-brainstorm` definiuje **CO** budować. `/dev-plan` definiuje **JAK**. `/dev-docs-execute` wykonuje plan.

Ten workflow produkuje trwały plan implementacji w `docs/plans/`. Plan jest gotowy, gdy implementator może zacząć pewnie, bez potrzeby żeby plan pisał za niego kod.

## Twarde reguły — obowiązują w każdej fazie

1. **NIGDY nie koduj.** Nie implementuj, nie uruchamiaj testów, nie buduj aplikacji, nie badaj zachowania runtime. Jeśli odpowiedź wymaga zmiany kodu i zobaczenia efektu — to należy do `/dev-docs-execute`; odrocz jako niewiadomą implementacyjną.
2. **Decyzje, nie kod.** Zapisuj podejście, granice, pliki, zależności, ryzyka, scenariusze testowe. Zero fenced bloków kodu implementacji (wyjątek: kształt kodu jest sam w sobie artefaktem designu). Zero komend git, commit messages, receptur komend testowych.
3. **Jedno pytanie na turę.** Do pytań `AskUserQuestion`; bez niego — numerowane opcje i czekaj.
4. **Źródło prawdy = requirements doc**, gdy istnieje. Nie wymyślaj zachowań produktu — to domena `/dev-brainstorm`.
5. **Data:** z kontekstu środowiska (currentDate). Aktualny rok to 2026.
6. **Język planu:** taki jak dotychczasowych plików w `docs/plans/` (w tym projekcie: polski; nazwy plików i tytuły typu `feat:` po angielsku, zgodnie z istniejącymi planami).
7. **Ścieżki katalogów w TYM repo:** requirements docs → `docs/dev-brainstorms/`, plany → `docs/plans/`, wiedza instytucjonalna → `docs/solutions/`.

## Opis feature'a

<feature_description> #$ARGUMENTS </feature_description>

**Jeśli opis pusty:** wykonaj `Glob docs/dev-brainstorms/*-requirements.md`. Znaleziony relewantny dokument → użyj jako input. Brak → zapytaj: "Co chciałbyś zaplanować? Opisz feature, bug fix lub usprawnienie." i ZATRZYMAJ SIĘ.

## FAZA 0: Wejście, źródło i głębokość

### 0.1 Wznowienie istniejącego planu

Jeśli user wskazuje istniejący plan LUB `Glob docs/plans/*-plan.md` zwraca plik pasujący tematem, zmodyfikowany w ciągu 14 dni:
1. Przeczytaj go.
2. Zapytaj: aktualizować w miejscu czy tworzyć nowy?
3. Przy aktualizacji: ZACHOWAJ zaznaczone checkboxy `- [x]`, rewiduj tylko sekcje wciąż relewantne, nie zmieniaj nazwy pliku.

### 0.2 Znajdź upstream requirements doc

Wykonaj `Glob docs/dev-brainstorms/*-requirements.md`.

Dokument jest trafny, gdy: temat semantycznie pasuje do opisu ORAZ (stworzony w ciągu 30 dni LUB wyraźnie wciąż aktualny). Wiele trafnych → zapytaj usera który (AskUserQuestion).

### 0.3 Przenieś treść źródła (gdy dokument istnieje)

1. Przeczytaj dokument W CAŁOŚCI.
2. Ogłoś userowi: "Planuję na bazie: <ścieżka>".
3. Przenieś do planu KAŻDĄ z sekcji źródła (jeśli w źródle występuje):

| Sekcja źródła | Trafia do planu jako |
|---|---|
| Problem | Ujęcie problemu |
| Wymagania (R1..Rn) | Śledzenie wymagań — te same ID, nie renumeruj |
| Kryteria sukcesu | Śledzenie wymagań / Weryfikacja unitów |
| Granice scope'u | Granice scope'u |
| Kluczowe decyzje | Kluczowe decyzje techniczne (z adnotacją `(zob. źródło)`) |
| Zależności / Założenia | Ryzyka i zależności |
| Otwarte pytania: blokujące | Faza 0.5 — rozstrzygnij PRZED planowaniem |
| Otwarte pytania: odroczone | Faza 2 — lista pytań planistycznych |

4. Gate: przed finalizacją planu (Faza 5) przeskanujesz źródło sekcja po sekcji — nic nie może być cicho pominięte.

### 0.4 Fallback bez requirements doc

Oceń: czy niejednoznaczność dotyczy produktu (zachowania usera, scope, wartość) czy techniki?

- **Produktowa** → zarekomenduj `/dev-brainstorm`. User mimo to chce tu zostać → bootstrap.
- **Techniczna lub brak** → planuj bezpośrednio.

**Planning bootstrap** (max 5 pytań, jedno na turę) musi ustalić: ujęcie problemu, zamierzone zachowanie, granice + non-goals, kryteria sukcesu, blokujące pytania/założenia. Jeśli bootstrap odkryje duże nierozwiązane pytania produktowe → ponownie zarekomenduj `/dev-brainstorm`; user odmawia → każdą lukę zapisz jako JAWNE założenie w planie i kontynuuj.

### 0.5 Rozstrzygnij blokery przed planowaniem

Dla każdego pytania z `Do rozwiązania przed planowaniem` w źródle:

- Pytanie faktycznie techniczne/architektoniczne/badawcze → przeklasyfikuj do listy pytań planistycznych (Faza 2).
- Pytanie zmienia zachowanie produktu, scope lub kryteria sukcesu → to prawdziwy bloker. Przedstaw userowi (AskUserQuestion): [wznów /dev-brainstorm] [przekonwertuj na jawną decyzję/założenie i kontynuuj].

NIE planuj z nierozwiązanymi prawdziwymi blokerami.

### 0.6 Głębokość planu — punktacja

Policz punkty (przy wątpliwości licz punkt):

| Kryterium | Punkty |
|---|---|
| Dotyka więcej niż ~3 plików/obszarów | +1 |
| Wiele warstw (UI + API + dane) lub cross-cutting | +1 |
| Widzisz ≥2 istotnie różne podejścia techniczne | +1 |
| Dotyka danych, API, uprawnień, płatności, security lub migracji | +1 |
| Docelowy obszar legacy / słabo przetestowany / historycznie kruchy | +1 |

**Wynik:** 0-1 → **Lekka** | 2-3 → **Standardowa** | 4-5 → **Głęboka**

Klasyfikacja steruje: liczbą unitów, sekcjami opcjonalnymi, agentami warunkowymi.

## FAZA 1: Zbierz kontekst

### 1.0 Podsumowanie kontekstu planowania

Przygotuj 1-2 akapity: problem, wymagania, kluczowe decyzje (ze źródła lub opisu). To input dla wszystkich agentów poniżej.

### 1.1 Research lokalny (zawsze)

Uruchom RÓWNOLEGLE (jedno wywołanie z dwoma Agent tool calls):

- `Agent(subagent_type: "repo-research-analyst", prompt: <podsumowanie kontekstu> + "Zbadaj strukturę repo, konwencje i wzorce relewantne dla tego tematu")`
- `Agent(subagent_type: "learnings-researcher", prompt: <podsumowanie kontekstu> + "Przeszukaj docs/solutions/ pod kątem powiązanych rozwiązań")`

Zbierz: wzorce/konwencje do naśladowania, relewantne pliki/moduły/testy, guidance z CLAUDE.md, wiedzę z `docs/solutions/`.

**Gdy agent zwróci pusty/bezużyteczny wynik:** odnotuj "brak lokalnych wzorców" i kontynuuj — nie ponawiaj, nie blokuj.

### 1.1b Postawa wykonawcza (test-first itp.)

Ustaw sygnał postawy wykonawczej, gdy zachodzi KTÓRYKOLWIEK:
- User jawnie prosi o TDD / test-first / characterization-first
- Dokument źródłowy tego wymaga
- Research pokazuje, że obszar docelowy jest legacy/kruchy → characterization coverage przed zmianą

Sygnał przenosisz później jako `Notatka wykonawcza` w relewantnych unitach — cicho, bez pytania usera. Pytaj TYLKO gdy postawa zmieniłaby sekwencjonowanie lub ryzyko całego planu i nie da się jej wywnioskować.

### 1.2 Decyzja o researchu zewnętrznym — tabela

Przejdź wiersze od góry; pierwszy pasujący wygrywa:

| Warunek | Decyzja |
|---|---|
| Temat: security, płatności, prywatność, zewnętrzne API, migracje danych, compliance | RESEARCH |
| Brak lokalnych wzorców (wynik 1.1) ORAZ framework/biblioteka kluczowa dla podejścia | RESEARCH |
| User jawnie eksploruje nieznany teren ("nie wiem jak to się robi") | RESEARCH |
| Repo ma silny lokalny wzorzec dla tego problemu | POMIŃ |
| User wskazał konkretne pliki/wzorce i zna zamierzony kształt | POMIŃ |
| Żaden z powyższych | POMIŃ |

Ogłoś decyzję jednym zdaniem, np. "Repo ma solidne wzorce — pomijam research zewnętrzny." albo "Temat dotyczy płatności — sprawdzam aktualne best practices."

### 1.3 Research zewnętrzny (gdy RESEARCH)

Uruchom równolegle:
- `Agent(subagent_type: "best-practices-researcher", prompt: <podsumowanie kontekstu>)`
- `Agent(subagent_type: "framework-docs-researcher", prompt: <podsumowanie kontekstu> + nazwy frameworków/bibliotek)`

### 1.4 Konsolidacja researchu

Wypisz (w pamięci roboczej, do użycia w planie):
- Wzorce codebase + ścieżki plików
- Wiedza instytucjonalna
- Referencje zewnętrzne (jeśli zebrane)
- Powiązane issues/PR-y/prior art
- Ograniczenia materialnie kształtujące plan

### 1.5 Analiza flow i edge-cases (warunkowa)

TYLKO dla Standardowa/Głęboka LUB gdy kompletność user flow niejasna:

- `Agent(subagent_type: "spec-flow-analyzer", prompt: <podsumowanie kontekstu> + <wyniki researchu>)`

Z outputu bierz wyłącznie: brakujące edge cases, przejścia stanów, luki w handoffach — te, które materialnie poprawiają plan.

## FAZA 2: Rozwiąż pytania planistyczne

Zbuduj listę pytań z: odroczonych pytań źródła + luk z researchu + decyzji technicznych koniecznych dla użytecznego planu.

Dla KAŻDEGO pytania przypisz kategorię:

| Kategoria | Test | Akcja |
|---|---|---|
| **Rozwiązywalne teraz** | Odpowiedź poznawalna z repo, dokumentacji lub wyboru usera | Rozstrzygnij; zapisz w "Rozwiązane podczas planowania" |
| **Odroczone do implementacji** | Odpowiedź zależy od zmiany kodu / runtime / test failures | Zapisz w "Odroczone do implementacji" z powodem |

**Budżet pytań do usera: max 5.** Pytaj TYLKO gdy odpowiedź materialnie wpływa na architekturę, scope, sekwencjonowanie lub ryzyko ORAZ nie da się jej odpowiedzialnie wywnioskować z repo/źródła. Pozostałe rozstrzygaj sam i dokumentuj uzasadnienie.

## FAZA 3: Ustrukturyzuj plan

### 3.1 Tytuł i nazwa pliku

- Tytuł konwencjonalny: `feat: Dodaj autentykację użytkowników` / `fix: Zapobiegaj podwójnemu submitowi`
- Typ: `feat` | `fix` | `refactor`
- Nazwa pliku: `docs/plans/YYYY-MM-DD-NNN-<type>-<opisowa-nazwa>-plan.md`

**Procedura NNN (numeracja GLOBALNA, nie per-dzień):**
1. `Glob docs/plans/*-plan.md`
2. Wyciągnij najwyższy istniejący numer NNN ze WSZYSTKICH plików (niezależnie od daty)
3. NNN = najwyższy + 1, zero-padded do 3 cyfr
4. Przykład: istnieją `...-001-...`, `...-002-...`, `...-003-...` → nowy plan dostaje `004`

Opisowa nazwa: 3-5 słów kebab-case, po angielsku (zgodnie z istniejącymi planami). Zakazane: spacje, dwukropki, nazwy typu "new-feature".

### 3.2 Interesariusze (Standardowa/Głęboka)

Rozważ krótko: kogo dotyka zmiana (użytkownicy, developerzy, operacje). Praca cross-cutting → zanotuj dotknięte strony w "Wpływ systemowy".

### 3.3 Rozbij pracę na Implementation Units

Każdy unit = jedna znacząca zmiana, lądowalna jako atomowy commit.

**Liczba unitów wg głębokości:** Lekka 2-4 | Standardowa 3-6 | Głęboka 4-8 (grupuj w fazy, gdy poprawia czytelność).

Dobry unit: skupiony na jednym komponencie/zachowaniu/seamie, dotyka małego klastra plików, uporządkowany wg zależności, wykonywalny bez pre-pisania kodu, z checkboxem `- [ ]`.

Zły unit: micro-krok 2-5 min | obejmuje wiele niepowiązanych problemów | tak niejasny, że implementator musi sam wymyślić plan.

### 3.4 Definicja każdego unitu — wymagane pola

- **Cel** — co osiąga
- **Wymagania** — które R# realizuje
- **Zależności** — co musi istnieć wcześniej
- **Pliki** — DOKŁADNE ścieżki: Stwórz / Modyfikuj / Test
- **Podejście** — kluczowe decyzje, przepływ danych, granice
- **Notatka wykonawcza** — opcjonalna; tylko przy niestandardowej postawie (test-first, characterization-first)
- **Wzorce do naśladowania** — istniejący kod/konwencje
- **Scenariusze testowe** — konkretne zachowania i edge cases; typy: `[Unit]` dla testów kodu, `[E2E]` dla weryfikacji w przeglądarce przez `/agent-browser`
- **Weryfikacja** — oczekiwane wyniki (nie skrypty komend)

**Reguły twarde:**
- Każdy feature-bearing unit MUSI mieć ścieżkę pliku testowego w **Pliki**
- Unit modyfikujący UI lub ścieżkę użytkownika MUSI mieć ≥1 scenariusz `[E2E]` (format: otwórz URL, kliknij X, sprawdź Y)
- Nie rozwijaj unitów w substepy RED/GREEN/REFACTOR

**Przykład wypełnionego unitu (wzór):**

```markdown
- [ ] **Unit 2: Endpoint eksportu PDF**

**Cel:** Serwer generuje PDF raportu na żądanie.

**Wymagania:** R1, R2

**Zależności:** Unit 1 (model danych raportu)

**Pliki:**
- Stwórz: `src/app/api/reports/[id]/pdf/route.ts`
- Modyfikuj: `src/lib/reportData.ts`
- Test (unit): `tests/int/report-pdf.int.spec.ts`

**Podejście:**
- Render synchroniczny w route handlerze; raporty małe, kolejka to zbędna złożoność (zob. źródło).

**Wzorce do naśladowania:**
- `src/app/api/seed/route.ts` — struktura route handlera w tym repo

**Scenariusze testowe:**
- [Unit] Żądanie z poprawnym id zwraca 200 i content-type application/pdf
- [Unit] Nieistniejący raport zwraca 404 w formacie { data, error }
- [E2E] Otwórz /raporty/123, kliknij "Pobierz PDF", sprawdź że pobrany plik nazywa się raport-2026-07.pdf

**Weryfikacja:**
- Testy integracyjne przechodzą; pobrany PDF zawiera te same wartości co widok.
```

### 3.5 Niewiadome planistyczne vs implementacyjne

Ważne, ale jeszcze niepoznawalne → zapisz JAWNIE w "Odroczone do implementacji". Nie udawaj rozstrzygnięcia. Typowe odroczenia: dokładne nazwy metod/helperów, finalne szczegóły zapytań SQL, zachowanie runtime zależne od test failures, refaktory mogące stać się zbędnymi.

## FAZA 4: Napisz plan

Jedna filozofia na wszystkich głębokościach — zmienia się ilość szczegółów, nie granica plan/wykonanie.

**Sekcje wg głębokości:**
- **Lekka:** core template minus sekcje opcjonalne, które nic nie wnoszą
- **Standardowa:** pełny core template; ryzyka, odroczone pytania, wpływ systemowy gdy relewantne
- **Głęboka:** core template + sekcje rozszerzone (niżej), tylko te które genuinely pomagają — nie jako boilerplate

### 4.1 Core Plan Template

```markdown
---
title: [Tytuł planu]
type: [feat|fix|refactor]
status: active
date: YYYY-MM-DD
origin: docs/dev-brainstorms/YYYY-MM-DD-<topic>-requirements.md  # gdy planujesz z requirements doc
---

# [Tytuł planu]

## Przegląd

[Co się zmienia i dlaczego]

## Ujęcie problemu

[Problem użytkownika/biznesowy i kontekst. Odwołaj do źródła gdy jest.]

## Śledzenie wymagań

- R1. [Wymaganie lub kryterium sukcesu które plan musi spełnić]
- R2. [Wymaganie lub kryterium sukcesu które plan musi spełnić]

## Granice scope'u

- [Explicite non-goal lub wykluczenie]

## Kontekst i research

### Relevantny kod i wzorce

- [Istniejący plik, klasa, komponent lub wzorzec do naśladowania]

### Wiedza instytucjonalna

- [Relevantny insight z docs/solutions/]

### Referencje zewnętrzne

- [Zewnętrzne docs lub best-practice, jeśli użyte]

## Kluczowe decyzje techniczne

- [Decyzja]: [Uzasadnienie]

## Otwarte pytania

### Rozwiązane podczas planowania

- [Pytanie]: [Rozwiązanie]

### Odroczone do implementacji

- [Pytanie lub niewiadoma]: [Dlaczego świadomie odroczone]

## Implementation Units

- [ ] **Unit 1: [Nazwa]**

**Cel:** [Co osiąga]

**Wymagania:** [R1, R2]

**Zależności:** [Brak / Unit N / zewnętrzny prerequisite]

**Pliki:**
- Stwórz: `ścieżka/do/nowego_pliku`
- Modyfikuj: `ścieżka/do/istniejącego_pliku`
- Test (unit): `ścieżka/do/pliku_testowego`
- Test (e2e): `Scenariusz: [flow do weryfikacji przez /agent-browser]`

**Podejście:**
- [Kluczowa decyzja designu lub sekwencjonowania]

**Notatka wykonawcza:** [Opcjonalny sygnał test-first / characterization-first]

**Wzorce do naśladowania:**
- [Istniejący plik, klasa lub wzorzec]

**Scenariusze testowe:**
- [Unit] [Konkretny scenariusz z oczekiwanym zachowaniem]
- [Unit] [Edge case lub ścieżka awarii]
- [E2E] [Flow: otwórz URL, kliknij X, sprawdź Y]

**Weryfikacja:**
- [Wynik prawdziwy gdy unit ukończony]

## Wpływ systemowy

- **Graf interakcji:** [Dotknięte callbacki, middleware, observery, entry pointy]
- **Propagacja błędów:** [Jak awarie podróżują między warstwami]
- **Ryzyka cyklu życia stanu:** [Częściowy zapis, cache, duplikaty, cleanup]
- **Parytet surface API:** [Inne interfejsy wymagające tej samej zmiany]
- **Pokrycie integracyjne:** [Scenariusze cross-layer nieudowadnialne unit testami]

## Ryzyka i zależności

- [Materialny risk, zależność lub problem sekwencjonowania]

## Dokumentacja / Notatki operacyjne

- [Docs, rollout, monitoring, support gdy relewantne]

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/...-requirements.md](ścieżka)
- Powiązany kod: [ścieżka lub symbol]
- Powiązane PR/issues: #[numer]
- Zewnętrzne docs: [url]
```

### 4.1b Sekcje rozszerzone (tylko Głęboka, tylko gdy pomagają)

`## Rozważane alternatywy` (podejście: dlaczego odrzucone) | `## Metryki sukcesu` | `## Zależności / Wymagania wstępne` | `## Analiza ryzyk i mitygacja` | `## Fazowe dostarczanie` (Faza 1/2: co i dlaczego w tej kolejności) | `## Plan dokumentacji` | `## Notatki operacyjne / rolloutowe`

### 4.2 Zasady pisania planu

- Ścieżki + referencje do klas/komponentów zamiast kruchych numerów linii
- Diagramy mermaid TYLKO gdy proza byłaby trudna do prześledzenia: ERD dla zmian modelu danych, sekwencja dla interakcji multi-service, stany dla cyklu życia, flowchart dla złożonych rozgałęzień
- Nie udawaj, że pytanie wykonawcze jest rozstrzygnięte, żeby plan wyglądał na kompletny

## FAZA 5: Review, zapis, handoff

### 5.1 Gate przed zapisem — wszystkie punkty muszą przejść

- [ ] Plan nie wymyśla zachowań produktu (te definiuje brainstorm/źródło)
- [ ] Każda główna decyzja ugruntowana w źródle lub researchu
- [ ] Każdy unit: konkretny, uporządkowany wg zależności, gotowy do implementacji
- [ ] Każdy feature-bearing unit ma ścieżkę pliku testowego
- [ ] Unity UI mają scenariusze `[E2E]`
- [ ] Sygnał postawy wykonawczej (jeśli był) przeniesiony w `Notatkach wykonawczych`
- [ ] Scenariusze testowe konkretne, ale nie są kodem testowym
- [ ] Odroczone elementy jawne, nie ukryte jako fałszywa pewność
- [ ] GDY jest źródło: przeskanowano KAŻDĄ sekcję źródła — podejście pasuje do intencji, scope i kryteria zachowane, blokery rozwiązane/założone/odesłane, nic cicho nie pominięto

Punkt FAIL → popraw plan PRZED zapisem.

### 5.2 Zapisz plik

**WYMAGANE: zapis na dysk przed prezentowaniem opcji.**

1. Upewnij się, że `docs/plans/` istnieje.
2. Write → `docs/plans/YYYY-MM-DD-NNN-<type>-<nazwa>-plan.md`
3. Potwierdź: `Plan zapisany do docs/plans/<nazwa-pliku>`

**Tryb pipeline:** wywołany z automatycznego workflow lub kontekstu `disable-model-invocation` → pomiń pytania interaktywne, podejmij wybory automatycznie, zapisz plan.

### 5.3 Handoff

AskUserQuestion: "Plan gotowy w `docs/plans/<nazwa>`. Co dalej?"

Opcje:
1. **Uruchom `/dev-docs`** (Rekomendowane) — podział na zadania
2. **Uruchom `/dev-docs-execute`** — od razu implementacja
3. **Otwórz plan w edytorze** — review pliku
4. **Gotowe na teraz**

Wykonanie: `/dev-docs` i `/dev-docs-execute` uruchamiaj przez Skill tool ze ścieżką planu jako argumentem. "Otwórz" → mechanizm platformy. Wolny tekst → potraktuj jako prośbę o rewizję, zastosuj, wróć do opcji.

## Anty-wzorce — NIGDY

- Nie koduj, nie uruchamiaj testów, nie buduj — to `/dev-docs-execute`.
- Nie szukaj requirements w `docs/brainstorms/` — poprawna ścieżka to `docs/dev-brainstorms/`.
- Nie numeruj NNN per-dzień — numeracja jest globalna w `docs/plans/`.
- Nie renumeruj R# przejętych ze źródła.
- Nie pomijaj cicho sekcji dokumentu źródłowego.
- Nie zadawaj userowi >5 pytań planistycznych — rozstrzygaj sam z uzasadnieniem.
- Nie wypełniaj wszystkich sekcji opcjonalnych jako boilerplate.
- Nie wstawiaj kodu implementacji, komend git ani receptur testowych do planu.

## Subagenci

| Agent | Faza | Warunek | Wejście | Wyjście |
|---|---|---|---|---|
| `repo-research-analyst` | 1.1 | zawsze | podsumowanie kontekstu | wzorce, konwencje, pliki |
| `learnings-researcher` | 1.1 | zawsze | podsumowanie kontekstu | insighty z docs/solutions/ |
| `best-practices-researcher` | 1.3 | decyzja RESEARCH (tabela 1.2) | podsumowanie kontekstu | best practices |
| `framework-docs-researcher` | 1.3 | decyzja RESEARCH | kontekst + nazwy frameworków | docs, ograniczenia wersji |
| `spec-flow-analyzer` | 1.5 | Standardowa/Głęboka lub niejasny flow | kontekst + research | edge cases, luki flow |

Agenci 1.1 i 1.3 zawsze parami równolegle. Porażka/pusty wynik agenta → odnotuj i kontynuuj bez niego.
