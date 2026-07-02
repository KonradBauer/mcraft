# Review Patterns

Techniki dawania feedbacku i pisania komentarzy w code review.

---

## Zasady dobrego feedbacku

### Feedback powinien być:

1. **Konkretny** — plik, linia, przykład
2. **Konstruktywny** — propozycja rozwiązania, nie tylko krytyka
3. **Obiektywny** — o kodzie, nie o autorze
4. **Priorytetyzowany** — co jest blocking vs nit
5. **Zbalansowany** — też pochwały za dobre rozwiązania

### Feedback NIE powinien:

- Atakować autora ("dlaczego to zrobiłeś?")
- Być niejasny ("to jest źle")
- Narzucać preferencji stylistycznych
- Blokować merge przez drobiazgi
- Pomijać kontekstu (deadline, MVP, etc.)

---

## Filozofia review

### Istniejący kod vs nowy kod

Nie wszystkie zmiany zasługują na ten sam poziom surowości:

| Typ zmiany | Podejście | Kiedy blokuj |
|------------|-----------|--------------|
| Modyfikacja istniejącego pliku | Surowe — każda dodana złożoność wymaga uzasadnienia | Zawsze gdy komplikuje |
| Nowy izolowany moduł/komponent | Pragmatyczne — jeśli działa i jest testowalny | Tylko przy [blocking] |
| Refaktor istniejącego kodu | Najsurowsze — weryfikuj że nic nie łamie | Przy regresji lub utracie testów |

### 5-sekundowa reguła nazewnictwa

Jeśli nie rozumiesz co robi funkcja/komponent w 5 sekund od przeczytania nazwy — to zła nazwa.

- FAIL: `doStuff`, `handleData`, `process`, `Manager`
- PASS: `validateUserEmail`, `fetchUserProfile`, `transformApiResponse`

### Sygnały do ekstrakcji modułu

Rozważ ekstrakcję do osobnego modułu gdy widzisz 2+ z:
- Złożone reguły biznesowe (nie "jest długie", ale "robi za dużo rzeczy naraz")
- Wiele obowiązków w jednej funkcji/pliku
- Interakcja z zewnętrznym API lub złożony async
- Logika którą chciałbyś reużywać w innych komponentach

---

## Techniki feedbacku

### 1. Question Approach

Zamiast stwierdzać problem, zadaj pytanie. Zachęca do myślenia i jest mniej konfrontacyjne.
````markdown
❌ "To się wysypie gdy lista jest pusta."
✅ "Co się stanie gdy `items` będzie pustą tablicą?"

❌ "Brakuje error handling."
✅ "Jak powinien zachować się komponent gdy API zwróci błąd?"

❌ "To jest nieefektywne."
✅ "Czy rozważałeś wydajność przy 10k użytkowników?"
````

### 2. Suggest, Don't Command

Proponuj zamiast nakazywać. Daj autorowi wybór.
````markdown
❌ "Zmień to na async/await."
✅ "Rozważ async/await — może poprawić czytelność:
```typescript
   const data = await fetchUser(id);
```
   Co myślisz?"

❌ "Wydziel to do osobnej funkcji."
✅ "Ta logika pojawia się w 3 miejscach. Może warto
   wydzielić do `calculateTotal()`? Chętnie omówię."
````

### 3. Context + Problem + Solution

Struktura dla złożonych komentarzy:
````markdown
**Kontekst:** Widzę że client component fetchuje dane CMS w `useEffect`.

**Problem:** W tym projekcie dane z Payload przychodzą przez server
components (Local API) — fetch w useEffect traci SSR treści, dodaje
drugi render i race conditions.

**Propozycja:**
```typescript
// page.tsx (server component)
const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'stat-tiles', sort: 'order' })
return <TilesMarquee tiles={docs} />

// TilesMarquee zostaje 'use client', ale dostaje dane jako props
```

Daj znać jeśli potrzebujesz pomocy z migracją.
````

### 4. Przykłady ❌/✅

Pokaż co jest źle i jak powinno być:
````markdown
**Problem:** Mutacja props w komponencie.

❌ Obecnie:
```typescript
function UserCard({ user }: Props) {
  user.lastSeen = new Date(); // mutacja!
  return <div>{user.name}</div>;
}
```

✅ Powinno być:
```typescript
function UserCard({ user, onView }: Props) {
  useEffect(() => {
    onView(user.id); // callback do rodzica
  }, [user.id, onView]);
  return <div>{user.name}</div>;
}
```
````

---

## Severity Labels

Używaj etykiet aby jasno komunikować priorytet. **Te same etykiety używane są w raporcie końcowym.**

### 🔴 [blocking] — Blokuje merge

Musi być naprawione przed merge. Używaj dla:
- Błędów bezpieczeństwa
- Bugów powodujących crash
- Wycieków danych
- Złamania wymagań krytycznych
- Payload: publiczne read na kolekcji z danymi wrażliwymi
- Payload: mutacje w hookach bez `req` (łamią atomowość transakcji)
````markdown
🔴 [blocking] **src/app/api/inquiry/route.ts:12**
Brak walidacji inputu — body trafia prosto do payload.create.
Dodaj walidację (Zod lub field validation) na granicy API.
````
````markdown
🔴 [blocking] **src/collections/Inquiries.ts:8**
`read: () => true` na kolekcji z e-mailami klientów — dane publicznie
dostępne przez /api/inquiries. Ogranicz read do zalogowanych.
````

### 🟠 [important] — Wymaga poprawy

Powinno być naprawione, ale można dyskutować. Używaj dla:
- Problemów wydajnościowych
- Błędnego użycia frameworka
- Brakujących edge cases
- Problemów z dostępnością
````markdown
🟠 [important] **src/lib/servicePageData.ts:23**
N+1 query — payload.find w pętli po projectIds.
Jedno zapytanie z `where: { id: { in: projectIds } }`.
````
````markdown
🟠 [important] **src/components/mcraft/Tiles.tsx:12**
useEffect do fetchowania danych CMS w client component —
przenieś fetch do server component i przekaż jako props.
````

### 🟡 [nit] — Drobiazg

Nice-to-have, nie blokuje. Używaj dla:
- Lepszego nazewnictwa
- Drobnych usprawnień
- Stylistyki (jeśli nie łapie linter)
- Brakujących typów
- Przestarzałych wzorców
````markdown
🟡 [nit] **src/utils/format.ts:12**
`data` → `userData` dla jasności? Nie blokuje.
````
````markdown
🟡 [nit] **src/components/Input.tsx:5**
`forwardRef` jest zbędny w React 19 — ref to zwykły prop.
````

### 🔵 [suggestion] — Propozycja

Alternatywne podejście do rozważenia:
````markdown
🔵 [suggestion] **src/hooks/useAuth.ts**
Rozważ `useActionState()` z React 19 zamiast
manualnego zarządzania loading/error state.
````
````markdown
🔵 [suggestion] **src/app/globals.css**
W Tailwind 4 możesz użyć `field-sizing: content`
zamiast JS hacka do auto-growing textarea.
````

### 💡 [learning] — Edukacyjne

Wyjaśnienie bez wymaganej akcji:
````markdown
💡 [learning] **src/app/(frontend)/page.tsx:15**
FYI: `depth: 1` w payload.find populuje relacje o jeden poziom —
głębsze depth kosztuje dodatkowe zapytania; dobieraj do realnej potrzeby.
````

### 🎉 [praise] — Pochwała

Doceniaj dobre rozwiązania:
````markdown
🎉 [praise] **src/components/DataTable.tsx**
Świetne użycie `useOptimistic()` — UX jest znacznie lepszy!
````
````markdown
🎉 [praise] **src/lib/mediaUrl.ts**
Czysty helper obsługujący oba kształty pola relacji (string | Media).
Dobra ochrona przed crashem przy depth: 0.
````

---

## Obsługa trudnych sytuacji

### Gdy autor się nie zgadza

1. **Zrozum perspektywę**
````markdown
   "Pomóż mi zrozumieć — co Cię skłoniło do tego podejścia?"
````

2. **Uznaj dobre argumenty**
````markdown
   "Masz rację co do X, nie wziąłem tego pod uwagę."
````

3. **Dostarcz dane**
````markdown
   "Obawiam się o wydajność. Możemy dodać benchmark?"
````

4. **Eskaluj jeśli trzeba**
````markdown
   "Poprośmy [tech lead] o opinię w tej kwestii."
````

5. **Wiedz kiedy odpuścić**
   Jeśli działa i nie jest [blocking] — approve.
   Perfekcja jest wrogiem postępu.

### Gdy kod wymaga dużych zmian
````markdown
## Ogólna uwaga

Widzę że implementacja działa, ale mam obawy
o skalowalność tego podejścia. Zanim przejdziemy
do szczegółowego review, czy możemy porozmawiać
o architekturze? Chętnie omówię na call.

Główne kwestie:
1. [kwestia 1]
2. [kwestia 2]

Nie chcę blokować niepotrzebnie — może mój kontekst
jest niepełny. Daj znać co myślisz.
````

### Gdy deadline goni
````markdown
## Uwagi do review

Biorąc pod uwagę deadline, oznaczyłem:
- 🔴 [blocking] — musi być przed release
- 🟡 [nit] + [tech-debt] — do naprawy po release

Możemy merge po naprawieniu [blocking], resztę
dodajmy do backlogu jako tech debt.
````

---

## Struktura komentarza review

### Dla pojedynczego problemu
````markdown
🟠 [important] **ścieżka/plik.tsx:linia**

[Krótki opis problemu]

[Opcjonalnie: dlaczego to problem]

[Propozycja rozwiązania / przykład kodu]
````

### Dla podsumowania PR
````markdown
## Review: [nazwa PR/fazy]

### Ogólnie
[1-2 zdania oceny]

### Co mi się podoba
- [pozytyw 1]
- [pozytyw 2]

### Do poprawy
[lista problemów z severity labels]

### Pytania
- [pytanie 1]
- [pytanie 2]

### Decyzja
✅ Approve / ⚠️ Request changes / 💬 Comment
````

---

## Anti-patterns w review

### Unikaj:

| ❌ Anti-pattern | ✅ Zamiast tego |
|-----------------|-----------------|
| Ghosting (request changes i zniknięcie) | Bądź dostępny na follow-up |
| Rubber stamping (LGTM bez review) | Przejrzyj naprawdę |
| Bike shedding (debata o [nit]) | Skup się na [blocking]/[important] |
| Scope creep ("a może jeszcze...") | Trzymaj się zakresu PR |
| Perfectionism (blokowanie przez [nit]) | Approve z sugestiami |
| Inconsistency (różne standardy) | Te same zasady dla wszystkich |

---

## Timing

- **Odpowiadaj szybko** — najlepiej w ciągu 24h
- **Review w blokach** — max 60 min, potem przerwa
- **Limit rozmiaru PR** — 200-400 linii optymalnie
- **Nie reviewuj gdy zmęczony** — jakość spada