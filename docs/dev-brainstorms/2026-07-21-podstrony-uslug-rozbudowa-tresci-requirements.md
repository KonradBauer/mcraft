---
date: 2026-07-21
topic: podstrony-uslug-rozbudowa-tresci
---

# Rozbudowa treści na podstronach usług (Nadzór Spawalniczy, Konstrukcje Stalowe, Meble Premium)

## Problem

Klient (MCRAFT) zgłosił, że sekcje na podstronach usług Konstrukcje Stalowe i Meble Premium wyglądają "ubogo" - dziś mają tylko ZAKRES i REALIZACJE. Klient chce więcej przestrzeni na treść odpowiadającą z góry na pytania klientów (dla kogo jest usługa, jak przygotować zapytanie itd.), a przede wszystkim chce móc samodzielnie w panelu admina dodawać takie sekcje bez proszenia dewelopera o kod. Dodatkowo chce ujednolicić wygląd ZAKRES (dziś inny na Nadzorze niż na pozostałych dwóch podstronach) i uprościć kafelki ZAKRES tak, by opis pojawiał się tylko po kliknięciu (screenshot dołączony przez klienta wprost pokazuje przekreślony na czerwono opis pod tytułem kafelka jako element "do usunięcia" z widoku karty).

## Wymagania

- R1. Na każdej z 3 podstron usług istnieje opcjonalna sekcja "Dla kogo?" (tytuł + wypunktowana lista), renderowana jako pierwsza sekcja treści; gdy pusta - nie jest wyświetlana.
- R2. Sekcja ZAKRES jest renderowana jako pionowy stos kafelków (1 kolumna) z ikoną i tytułem - bez tekstu opisu widocznego bezpośrednio na karcie.
- R3. Kliknięcie w kafelek ZAKRES, który ma ustawiony opis, otwiera modal z pełną treścią opisu. Kafelki bez ustawionego opisu nie są klikalne (brak pustego modala).
- R4. Admin może samodzielnie w panelu admina dodawać, edytować, usuwać i porządkować dowolną liczbę dodatkowych sekcji (tytuł + wypunktowana lista) renderowanych między ZAKRES a REALIZACJE - bez udziału dewelopera.
- R5. Sekcja REALIZACJE pozostaje zawsze na samym końcu strony i istnieje wyłącznie na Konstrukcje Stalowe i Meble Premium. Nadzór Spawalniczy nadal nie ma sekcji REALIZACJE.
- R6. Kolejność sekcji, wygląd kafelków ZAKRES i zachowanie modali są identyczne na wszystkich 3 podstronach usług.
- R7. Istniejąca treść pozycji ZAKRES (tytuły) jest zachowana bez utraty danych po wdrożeniu zmiany.
- R8. Sekcje "Dla kogo?" oraz "Jak przygotować zapytanie?" dla Konstrukcje Stalowe są od razu wypełnione treścią przekazaną przez klienta w dokumencie (nie czekają na ręczne uzupełnienie).
- R9. Kafelki ZAKRES na Konstrukcje Stalowe i Meble Premium, które nie miały wcześniej przypisanej ikony, otrzymują domyślną ikonę placeholder zamiast pustego miejsca.

## Kryteria sukcesu

- Wejście na każdą z 3 podstron pokazuje sekcje w kolejności: DLA KOGO (jeśli wypełnione) → ZAKRES (kafelki w 1 kolumnie, tylko ikona + tytuł) → dodatkowe sekcje (0..N, w kolejności ustalonej w adminie) → REALIZACJE (tylko Konstrukcje Stalowe i Meble Premium).
- Kafelek ZAKRES bez opisu nie reaguje na kliknięcie; kafelek z opisem otwiera modal z pełną treścią.
- Admin dodaje nową sekcję "tytuł + lista" w panelu admina, zapisuje i widzi ją na stronie po odświeżeniu - bez zmian w kodzie.
- Strona Konstrukcje Stalowe po wdrożeniu zawiera od razu treść "Dla kogo?" i "Jak przygotować zapytanie?" zgodną z przykładem klienta.
- Żadna istniejąca pozycja ZAKRES nie znika ani nie traci tytułu po migracji.
- Nadzór Spawalniczy nadal nie wyświetla sekcji Realizacje.

## Granice scope'u

- Nowe sekcje obsługują wyłącznie prosty typ treści: tytuł + płaska wypunktowana lista tekstowa (bez rich text, obrazków, zagnieżdżonych list, bez innych typów bloków) - świadomie prostsze podejście zamiast rozszerzalnego systemu blokowego.
- Sekcja "Dla kogo?" to pojedynczy stały slot przed ZAKRES, nie repeater wielu sekcji przed ZAKRES. Więcej sekcji przed ZAKRES w przyszłości - osobny temat.
- Brak zmian w kolekcji Portfolio i mechanice samej sekcji Realizacje (zrealizowane w osobnym brainstormie `2026-06-29-realizacje-podstrony`).
- Dodawanie/usuwanie samych kafelków ZAKRES w adminie już działa - bez zmian.
- Brak wielojęzyczności.

## Kluczowe decyzje

- **Stała kolejność sekcji** (Dla kogo? → Zakres → dodatkowe sekcje 0..N → Realizacje, jeśli dotyczy): wprost potwierdzone przez użytkownika jako intencja klienta - upraszcza model danych i eliminuje ryzyko przypadkowego "zgubienia" ZAKRES gdzieś w środku strony.
- **Kafelki ZAKRES w jednej kolumnie** (pionowy stos), nie grid 2-kolumnowy jak dziś w Nadzorze: potwierdzone wprost przez użytkownika.
- **Karta kafelka ZAKRES = tylko ikona + tytuł**, opis zawsze wyłącznie w modalu: dosłowny wymóg klienta, potwierdzony załączonym screenshotem (przekreślony opis pod tytułem).
- **Nowe sekcje tylko typu "tytuł + lista"**, bez rozszerzalnego systemu blokowego: wybór użytkownika - mniejszy koszt utrzymania, brak obecnej potrzeby innych typów treści; rozszerzenie w przyszłości to osobny temat.
- **Domyślna ikona placeholder** dla istniejących kafelków ZAKRES bez ikony: strona ma wyglądać kompletnie zaraz po wdrożeniu, klient podmienia ikony wg uznania później.
- **Layout musi być identyczny na wszystkich 3 podstronach**: wprost wymóg klienta (jedyna różnica to brak Realizacji w Nadzorze Spawalniczym).

## Zależności / Założenia

- Wymaga zmian w panelu admina Payload (nowe/odsłonięte pola na kolekcji ServicePage) i regeneracji typów (`pnpm generate:types`).
- Wymaga ujednolicenia dziś częściowo rozjechanych komponentów frontendowych obsługujących te 3 podstrony (`NadzorLayout.tsx` vs `SubpageLayout.tsx`), tak aby layout był faktycznie identyczny - konkretny sposób do ustalenia w `/dev-plan`.

## Otwarte pytania

### Do rozwiązania przed planowaniem

*(brak - kluczowe niejednoznaczności z dokumentu klienta rozstrzygnięte w trakcie brainstormu)*

### Odroczone do planowania

- [Dotyczy R1][Techniczne] Struktura pola Payload dla sekcji "Dla kogo?" - osobne stałe pole, czy pierwszy element wspólnego typu z "dodatkowymi sekcjami"?
- [Dotyczy R4][Techniczne] Model danych dla repeatera dodatkowych sekcji (array field czy Payload blocks field) i komponent RowLabel w adminie.
- [Dotyczy R6][Techniczne] Sposób ujednolicenia `NadzorLayout.tsx` i `SubpageLayout.tsx` - scalenie w jeden komponent, czy inny mechanizm współdzielenia.
- [Dotyczy R7][Techniczne] Mechanizm migracji istniejących danych `scopeItems` przy zmianie schematu pola (skrypt migracyjny Payload czy ręczna migracja w adminie).
- [Dotyczy R9][Wymaga researchu] Który z 34 dostępnych ikon (lista w `IconPickerField`) wybrać jako domyślny placeholder.

## Następne kroki

→ /dev-plan
