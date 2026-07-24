# Ukryta podstrona MK Gym (/mk-gym) — Plan

**Branch:** `feature/mk-gym-strona`
**Ostatnia aktualizacja:** 2026-07-24

## Cele i zakres

Dodajemy nową podstronę `/mk-gym`, strukturalnie i wizualnie identyczną z `/meble-premium`, ale niedostępną z żadnego miejsca we froncie MCRAFT - jedyny sposób trafienia na nią to bezpośredni URL z zewnętrznej strony. Treść (zakres, opcjonalne sekcje, realizacje) zarządzana jest z panelu admina, tłumaczalna PL/EN tym samym mechanizmem co pozostałe podstrony usługowe. Rozszerzamy istniejące kolekcje Payload (`ServicePage`, `Portfolio`) zamiast tworzyć nową kolekcję.

Granice scope'u:
- Brak jakichkolwiek zmian we froncie MCRAFT poza samą stroną `/mk-gym` - żadnego kafelka, wpisu w menu ani w `NavRealizacjeDropdown`.
- Brak wykluczenia z `sitemap.xml` i brak meta `noindex` - jedynym mechanizmem ukrycia jest brak linkowania (deeplink-only).
- Brak dodatkowego uwierzytelniania/hasła dostępu do `/mk-gym`.
- Brak nowej, samodzielnej kolekcji Payload.

## Fazy

### Faza 1 — Kolekcje Payload + seed początkowego rekordu MK Gym

Cel: `ServicePage` i `Portfolio` obsługują obszar `mk-gym`; istnieje jeden początkowy dokument `ServicePage` (slug `mk-gym`) gotowy do wyświetlenia i dalszej edycji przez panel.

Kryteria akceptacji:
- `Portfolio.filterOptions` dopuszcza relację do `ServicePage` ze slug `mk-gym`.
- Skrypt seedujący tworzy dokładnie jeden dokument `ServicePage` (slug `mk-gym`, placeholder treść PL+EN), idempotentnie.

### Faza 2 — Strona /mk-gym (mirror meble-premium)

Cel: `/mk-gym` renderuje treść z CMS w layoucie identycznym z `/meble-premium`, w obu locale.

Kryteria akceptacji:
- `generateMetadata` zwraca różny `title` dla `pl` i `en`.
- Strona renderuje `FALLBACK` gdy rekord CMS nie istnieje.
- Strona główna i nawigacja pozostają bez zmian (brak kafelka, brak linku do `/mk-gym`).
- Topbar na `/mk-gym` pokazuje logo z `public/mk-gym-logo.png` w miejscu napisu "MCRAFT"; pozostałe podstrony nadal pokazują "MCRAFT" (regresja).
- Topbar na `/mk-gym` nie ma standardowej nawigacji podstrony (`#about`, `#areas`, dropdown realizacji, `#contact`) - zamiast niej jeden link powrotu na `https://mkcraft.com.pl` (desktop i mobile). Language switcher (translacja) pozostaje. Klik w logo prowadzi na `https://mkcraft.com.pl`. Pozostałe podstrony zachowują dotychczasową nawigację (regresja).
- Logo na białym tle, 3x większe niż bazowy rozmiar wordmarku. Favicon `/mk-gym` własny (nie site-wide `/favicon.png`). Tytuł karty przeglądarki dokładnie "MK Gym" (bez sufiksu "| MCRAFT"). Brak pełnoekranowego loading screena MCRAFT na `/mk-gym` i jego pod-trasach; pozostałe strony bez zmian.

### Faza 3 — Szczegóły realizacji dla MK Gym (/mk-gym/realizacje/[slug])

Cel: dynamiczna trasa szczegółów realizacji obsługuje obszar `mk-gym` tak samo jak pozostałe dwa obszary portfolio, bez ujawniania go w współdzielonej nawigacji.

Kryteria akceptacji:
- `serviceSlug='mk-gym'` z poprawnym slug realizacji renderuje treść.
- Gate `PORTFOLIO_PAGES` nadal blokuje nieznane obszary (regresja).
- `NAV_LINKS` w tym pliku i `NavRealizacjeDropdown.tsx` pozostają niezmienione.

## Kryteria akceptacji całości

- Wejście na `/mk-gym` pokazuje treść zarządzaną z panelu admina, w layoucie identycznym jak `/meble-premium`, w obu locale (pl/en).
- Żaden link na stronie głównej ani w nawigacji nie prowadzi do `/mk-gym`.
- Redaktor w panelu admina może dodać/edytować zakres, dodatkowe sekcje i realizacje dla MK Gym oraz ich tłumaczenie angielskie, bez zmian w kodzie.
- `/mk-gym/realizacje/[slug]` działa analogicznie do pozostałych obszarów portfolio.

## Źródła
- Requirements doc: [docs/dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md](../../dev-brainstorms/2026-07-24-mk-gym-hidden-section-requirements.md)
- Plan techniczny: [docs/plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md](../../plans/2026-07-24-006-feat-mk-gym-hidden-page-plan.md)
