---
date: 2026-07-24
topic: mk-gym-hidden-section
---

# Ukryta sekcja MK Gym pod /mk-gym

## Problem
Potrzebny jest dodatkowy obszar działalności ("MK Gym"), promowany przez zewnętrzną stronę, która linkuje bezpośrednio na `/mk-gym`. Nie ma to być część publicznej nawigacji MCRAFT - strona główna i menu mają pozostać bez zmian.

## Wymagania
- R1. Nowa podstrona dostępna pod `/mk-gym`, wizualnie i strukturalnie identyczna z `/meble-premium` (hero, zakres usług, opcjonalne dodatkowe sekcje, realizacje, sekcja CTA).
- R2. Strona nie jest linkowana z żadnego miejsca na froncie MCRAFT - brak kafelka na stronie głównej, brak wpisu w nawigacji/menu. Jedyny dostęp to bezpośredni URL z zewnętrznej strony.
- R3. W panelu admina powstaje nowy wpis obszaru działalności "MK Gym" (rozszerzenie istniejącej kolekcji Podstron usługowych) z polami zakresu usług i opcjonalnych dodatkowych sekcji, analogicznie do Mebli Premium.
- R4. Realizacje dla MK Gym są zarządzane w istniejącej kolekcji Realizacji, rozszerzonej o możliwość przypisania do obszaru MK Gym.
- R5. Wszystkie treści MK Gym (zakres, sekcje, realizacje) są tłumaczalne PL/EN w panelu admina, tym samym mechanizmem lokalizacji co pozostałe podstrony.

## Kryteria sukcesu
- Wejście na `/mk-gym` pokazuje treść zarządzaną z panelu admina, w layoucie identycznym jak `/meble-premium`.
- Żaden link na stronie głównej ani w nawigacji nie prowadzi do `/mk-gym`.
- Redaktor w panelu admina może dodać/edytować zakres, dodatkowe sekcje i realizacje dla MK Gym oraz ich tłumaczenie angielskie, bez zmian w kodzie.

## Granice scope'u
- Brak jakichkolwiek zmian we froncie MCRAFT poza dodaniem samej strony `/mk-gym` - bez kafelka, bez wpisu w menu (potwierdzone przez usera).
- Brak wykluczenia z `sitemap.xml` i brak meta `noindex` - user świadomie wybrał "tylko brak linku" jako jedyny mechanizm ukrycia, bez dodatkowych zabezpieczeń SEO.
- Brak dodatkowego uwierzytelniania/hasła dostępu do `/mk-gym` - ukrycie opiera się wyłącznie na braku linkowania (deeplink-only).

## Kluczowe decyzje
- Model danych: rozszerzenie istniejących kolekcji `ServicePage` (nowy rekord ze slug `mk-gym`) i `Portfolio` (rozszerzone `filterOptions` o `mk-gym`) zamiast nowej samodzielnej kolekcji - spójność ze wzorcem Meble Premium / Konstrukcje Stalowe, brak duplikacji pól i logiki i18n.
- Ukrycie strony: wyłącznie brak linkowania z frontendu; `sitemap.ts` i `robots.ts` pozostają bez zmian (strona i tak nie trafi do sitemap, bo nie jest tam jawnie dodana).

## Otwarte pytania

### Odroczone do planowania
- [Dotyczy R3][Techniczne] Czy wpis "MK Gym" w adminie potrzebuje własnej etykiety/grupy w sidebarze, czy wystarczy standardowy wpis w liście "Podstrony usługowe" (jak Meble Premium / Konstrukcje Stalowe).
- [Dotyczy R4][Techniczne] Aktualizacja etykiety kolekcji Portfolio ("Realizacje (Meble i Konstrukcje)") o trzeci obszar.
- [Dotyczy R1][Techniczne] Klucze słownika i18n (`dict.meta.mkGym.*`) i treść fallback - do uzupełnienia w oparciu o wzorzec `meble-premium/page.tsx`.

## Następne kroki
→ /dev-plan
