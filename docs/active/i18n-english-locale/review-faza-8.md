# Review — Faza 8

**Data:** 2026-07-23
**Zakres commitów:** dd1ec85^..dd1ec85 (jeden commit: "feat(i18n): przetlumacz polityke prywatnosci na EN (Faza 8/8 - koniec planu)")
**Werdykt:** ⚠️ KONTYNUUJ Z ZASTRZEŻENIAMI

## Findings

### 🔴 P1-blocking
Brak.

### 🟠 P2-important

- **`src/app/(frontend)/polityka-prywatnosci/content.pl.tsx:46-49`, `content.en.tsx:46-49`, `page.tsx:3-5,16-17`** — Strona omija ustalony wzorzec centralnego słownika i duplikuje stringi, które już tam istnieją. Każda inna zlokalizowana strona w repo (`page.tsx` home, `nadzor-spawalniczy/page.tsx`, `layout.tsx`, i kluczowo `src/app/not-found.tsx`) rozwiązuje identyczny problem ("statyczna strona informacyjna + link powrotny + stopka") przez `getDictionary(locale)` i `dict.notFound.*`. Ta strona zamiast tego ręcznie tworzy `politykaPrywatnosciPlText`/`EnText`, gdzie `copyrightSuffix` jest bajt-w-bajt duplikatem `dict.footer.copyrightSuffix` (`pl.ts:48`/`en.ts:50` vs `content.pl.tsx:48`/`content.en.tsx:48`), a `backHome` jest niemal-duplikatem `dict.notFound.backHome` z niespójnym prefiksem "- ". To dokładnie anti-pattern #9 z `coding-rules.md` (context blindness) i narusza §3 ("wyciągaj shared logic zamiast duplikować"). Uzasadnienie z planu ("treść prawna dłuższa niż UI stringi") usprawiedliwia wydzielenie 6 sekcji `<section>`, nie usprawiedliwia reimplementacji dwóch krótkich stringów UI, które już istnieją i są już podłączone przez `getDictionary`.
  **Fix:** `page.tsx` woła `getDictionary(locale)` (już importuje `getLocale`), używa `dict.footer.copyrightSuffix` bezpośrednio w stopce, i reużywa `dict.notFound.backHome` (albo dodaje jeden nowy klucz do centralnego `Dictionary` dla tego linku). `content.{pl,en}.tsx` eksportują wtedy TYLKO komponent JSX, nic więcej.

- **`src/app/(frontend)/polityka-prywatnosci/page.tsx:7-11`** — `metadata` export jest statyczny, po polsku, nigdy nie odzwierciedla locale. W przeciwieństwie do każdej siostrzanej podstrony (które używają `generateMetadata()` + `getDictionary(locale)`), odwiedzający w trybie EN dostaje polski `<title>` i opis meta na DOKŁADNIE tej stronie, którą ta faza tłumaczy. To świadoma decyzja odnotowana w kontekst.md ("poza scope tej fazy") i ten sam gap ma `not-found.tsx` — ale to nadal realna, nietestowana niespójność w deliverable tej fazy. Warto swiadomej kontynuacji (`generateMetadata()` + nowy `dict.privacyPolicy.metaTitle/metaDescription`), teraz gdy hydraulika słownika już istnieje.

### 🟡 P3-nit

- **`content.pl.tsx:1`, `content.en.tsx:1`** — stała `heading` (klasy Tailwind) zduplikowana bajt-w-bajt w obu plikach. Akceptowalne pod filozofią projektu "duplication > complexity" dla izolowanego nowego kodu.
- **`content.pl.tsx:3,46` / `content.en.tsx:3,46`** — dwa niepowiązane eksporty per plik (komponent + obiekt tekstów), narusza §3 "jeden eksport per plik". Rozwiązuje się samo jeśli naprawiony zostanie powyższy P2 (obiekt tekstów znika).
- **`page.tsx:16`** — `getLocale()` wywoływane redundantnie względem `layout.tsx`, który już to robi. Koszt pomijalny (cache per-request), zgodne z "duplication > complexity".
- **`page.tsx:17` i `page.tsx:30`** — ten sam warunek `locale === 'en'` sprawdzany dwa razy osobnymi ternary zamiast jednego lookupu `{pl:...,en:...}[locale]`. Kosmetyczne.
- **`tests/int/polityka-prywatnosci.int.spec.ts:17-27`** — wariant PL nie sprawdza (asymetrycznie względem EN) braku angielskiej treści na stronie. Niska waga — mieszanie języków jest strukturalnie niemożliwe (ternary renderuje dokładnie jeden komponent).
- **Informacyjne:** przy hipotetycznym wzroście treści prawnej ~100x, `content.*.tsx` naruszyłby regułę "plik > 300 linii = refaktoruj" — nie dotyczy obecnego stanu (49 linii/plik).

## Odchylenia od planu

Brak odchyleń w zakresie plików/testów wymaganych przez Implementation Unit 8 (wszystkie pliki z listy "Pliki:" istnieją, oba scenariusze E2E z "Scenariusze testowe:" są odzwierciedlone w `tests/e2e/polityka-prywatnosci.e2e.spec.ts`). Odkryty P2 (duplikacja słownika) to odchylenie od **konwencji ustalonej w poprzednich fazach** (nie explicite od tekstu Unit 8, który nie precyzował JAK dokładnie content.*.tsx mają dostarczać teksty linku/copyright).

## Weryfikacje E2E

E2E pominięte w tym review: wszystkie checkboxy `Weryfikacja:` Fazy 8 były już odznaczone `[x]` w `i18n-english-locale-zadania.md` (na podstawie manualnej weryfikacji w przeglądarce podczas `/dev-docs-execute`) — zgodnie z regułą tego skilla (Agent 5 tylko gdy są niezaznaczone checkboxy).

Dodatkowo: Agent 4 (pokrycie testowe) niezależnie zweryfikował netstat/curl i potwierdził, że port 3000 na tej maszynie nadal jest zajęty przez inny, niepowiązany projekt użytkownika ("KCRAFT") — testy E2E fazy nadal nie zostały uruchomione automatycznie w żadnej sesji. Ryzyko ocenione jako niskie (selektory w testach odpowiadają zweryfikowanej strukturze DOM źródeł), ale zalecane uruchomienie `pnpm test:e2e` na wolnym porcie przed uznaniem całego planu i18n za w pełni zamknięty.

## Perspektywy niedostępne

Brak — wszystkie 4 uruchomione agenty (Security, Performance, Architecture/TS, Test coverage) zwróciły kompletne wyniki. Agent 5 (E2E browser) świadomie pominięty (patrz wyżej).
