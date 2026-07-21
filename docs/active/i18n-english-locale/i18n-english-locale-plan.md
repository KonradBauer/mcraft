# Angielska wersja jezykowa strony (i18n) — Plan

**Branch:** `feature/i18n-english-locale`
**Ostatnia aktualizacja:** 2026-07-21

## Cele i zakres

Strona mcraft dostaje pelnoprawna wersje angielska: widoczny przelacznik PL/EN w nawigacji, tresc CMS lokalizowana natywnym mechanizmem Payload (`localization` + `localized: true`), statyczne teksty w komponentach przez lekki wlasny slownik PL/EN, wybor jezyka zapamietywany w cookie bez zmiany URL. Klient tlumaczy tresc recznie w panelu admina - zero AI. Architektura gotowa na kolejne jezyki w przyszlosci.

Granice scope'u:
- Zero automatycznego tlumaczenia AI.
- Panel admina Payload zostaje wylacznie po polsku.
- Brak osobnych URL-i per jezyk (`/en/...`).
- Brak dedykowanego etapu wstepnego tlumaczenia - fallback do PL od dnia 1, klient uzupelnia stopniowo.
- Tylko PL+EN teraz.
- Hardcodowany fallback CV/Bio w `ModalProvider.tsx` (gdy CMS pusty) zawsze po polsku, niezaleznie od wybranego jezyka.
- Brak sygnalizacji UI ze tresc to fallback PL w trybie EN.
- Bez zmian w `sitemap.ts`/`robots.ts`.

## Fazy

### Faza 1 — Payload localization: config, flagi pol, migracja danych
Wlaczyc natywna lokalizacje Payload, oznaczyc kwalifikujace sie pola jako `localized: true` we wszystkich 6 kolekcjach/globalach, zmigrowac istniejaca produkcyjna tresc PL bez utraty danych. Najwyzsze ryzyko planu - istniejace dane klienta.

### Faza 2 — Rozpoznawanie i trwalosc jezyka (cookie)
Serwerowy mechanizm odczytu wybranego jezyka (domyslnie zawsze PL, bez detekcji Accept-Language) i server action do jego zmiany.

### Faza 3 — Slownik statycznych tekstow PL/EN
Jedno zrodlo prawdy dla stringow UI, zastepujace 4-krotna duplikacje nav/stopki (HomeContent, SubpageLayout, realizacje/[slug], not-found).

### Faza 4 — Komponent przelacznika jezyka
Widoczny przelacznik PL/EN, bez kolizji z istniejacym scroll-lockiem (`ModalProvider`/`MobileNav`), zamyka otwarty modal przed przelaczeniem.

### Faza 5 — Locale w pobieraniu danych z Payload
Wszystkie 6 miejsc wywolania `payload.find`/`findGlobal` na froncie przekazuja aktualny jezyk.

### Faza 6 — Podmiana statycznych tekstow na slownik + konsolidacja duplikatow
Zastapienie hardcodowanych stringow odwolaniami do slownika; konsolidacja 4 kopii nav/stopki; Google Maps `hl` param.

### Faza 7 — Lokalizacja meta danych i JSON-LD
Tytul karty, opis, OG/Twitter card, `<html lang>` i JSON-LD schema.org przelaczaja sie z jezykiem (dane faktyczne bez zmian).

### Faza 8 — Tlumaczenie polityki prywatnosci
Statyczna strona `/polityka-prywatnosci` (bez CMS) dostaje pelna wersje EN.

## Kryteria akceptacji calosci

- Widoczny przelacznik PL/EN dziala z kazdej z 4 glownych stron serwisu.
- Zadne miejsce w trybie EN nie jest puste - zawsze widac tlumaczenie albo polski fallback.
- Klient moze samodzielnie wpisac/edytowac EN w panelu Payload, bez pomocy dewelopera.
- Zadna istniejaca produkcyjna tresc PL nie zostala utracona podczas migracji.
- Meta dane (tytul, opis, OG) i `<html lang>` przelaczaja sie razem z trescia.
- Struktura danych pozwala dodac kolejny jezyk bez przebudowy schematu.

## Zrodla
- Requirements doc: [docs/dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md](../../dev-brainstorms/2026-07-21-tlumaczenie-strony-en-requirements.md)
- Plan techniczny: [docs/plans/2026-07-21-005-feat-english-language-version-plan.md](../../plans/2026-07-21-005-feat-english-language-version-plan.md)
