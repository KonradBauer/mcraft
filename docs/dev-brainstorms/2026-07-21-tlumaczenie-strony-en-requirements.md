---
date: 2026-07-21
topic: tlumaczenie-strony-en
---

# Angielska wersja jezykowa strony

## Problem
Firma dziala w przemysle (spawanie, konstrukcje, meble premium) - segment gdzie profesjonalna firma "wypada" miec wersje angielska strony. Nie ma konkretnego, powtarzajacego sie triggera (np. zagraniczni klienci masowo pytajacy o oferte) ani pilnej potrzeby SEO - to decyzja wizerunkowa, standard dla firmy dzialajacej w przemysle/eksporcie.

Punkt wyjscia pytania brzmial "czy da sie to ogarnac AI" - po eksploracji odpowiedz brzmi nie: user swiadomie wybral tlumaczenie reczne (klient/tlumacz wpisuje tekst sam), zero automatycznego tlumaczenia AI w produkcie.

## Wymagania
- R1. Uzytkownik widzi widoczny przelacznik PL/EN w nawigacji (desktop i mobile), dostepny z kazdej strony serwisu.
- R2. Po przelaczeniu na EN, cala tresc serwisu (strona glowna, 3 podstrony uslugowe, polityka prywatnosci) wyswietla sie po angielsku - zarowno tekst zakodowany w komponentach, jak i tresc z CMS.
- R3. Klient moze wpisac angielskie tlumaczenie dla kazdego przetlumaczalnego pola tekstowego w panelu CMS (Payload admin), niezaleznie od polskiej wersji tego samego pola.
- R4. Jesli dane pole nie ma jeszcze wpisanego tlumaczenia EN, strona pokazuje polski tekst tego pola jako fallback (nigdy pusty fragment).
- R5. Wybor jezyka jest zapamietywany miedzy odwiedzinami, URL strony pozostaje bez zmian niezaleznie od wybranego jezyka (bez prefiksow typu `/en/...`).
- R6. Meta dane strony (tytul karty przegladarki, opis w wynikach wyszukiwania/social media) przelaczaja sie razem z reszta tresci.
- R7. Architektura danych pozwala w przyszlosci dodac kolejny jezyk (np. niemiecki) bez przebudowy struktury pol w CMS.

## Kryteria sukcesu
- Odwiedzajacy moze przelaczyc cala strone na EN jednym kliknieciem widocznego przelacznika, z kazdego miejsca w serwisie.
- Zadne miejsce na stronie w trybie EN nie zostaje puste - zawsze widac albo tlumaczenie, albo polski fallback.
- Klient moze samodzielnie, bez pomocy dewelopera, wpisac/edytowac angielska wersje dowolnego tekstu w panelu admina.
- Dodanie kolejnego jezyka w przyszlosci nie wymaga zmiany struktury kolekcji/pol w Payload - tylko dodania nowego locale w konfiguracji.

## Granice scope'u
- Zero automatycznego tlumaczenia przez AI - zadnego przycisku "generuj szkic", zadnej integracji z API tlumaczeniowym. Swiadomie odrzucone po eksploracji.
- Panel administracyjny Payload (etykiety pol, menu, komunikaty systemowe) pozostaje wylacznie po polsku - tlumaczymy tylko tresc widoczna na froncie strony.
- Brak osobnych, indeksowalnych URL-i per jezyk (np. `/en/...`) w tej fazie - wybor jezyka nie zmienia adresu.
- Brak dedykowanego etapu "wstepnego tlumaczenia" przy wdrozeniu - serwis startuje z samym mechanizmem, tresc EN uzupelnia sie stopniowo przez fallback do PL.
- Tylko PL+EN w tej fazie. Architektura ma byc gotowa na kolejne jezyki, ale samo ich dodanie to osobny temat.

## Kluczowe decyzje
- **Tlumaczenia CMS przez natywna lokalizacje Payload** (`localization` config w `payload.config.ts` + `localized: true` per pole tekstowe), nie reczne dublowanie pol (np. `titleEn`, `titleDe`). Powod: skaluje sie czysto do kolejnych jezykow bez przebudowy schematu kolekcji - dokladnie to, czego wymaga R7.
- **Statyczne teksty w komponentach przez lekki wlasny slownik PL/EN**, nie biblioteka i18n (next-intl/i18next). Powod: strona ma 4 podstrony i nie potrzebuje pluralizacji ani formatowania dat/liczb specyficznego per jezyk - pelna biblioteka i18n dodalaby zaleznosc i zlozonosc bez realnej korzysci przy tej skali.
- **Wybor jezyka trzymany w cookie/localStorage, czytany po stronie serwera (SSR)**, nie w URL. Zgodne z R5 - adres strony ma zostac bez zmian niezaleznie od jezyka.
- Pola strukturalne (slug, kolejnosc, ikony, zdjecia) NIE staja sie `localized` - wspolne dla wszystkich jezykow. Localized tylko pola z tekstem widocznym dla uzytkownika (title, description, richText content itd.).

## Otwarte pytania

### Odroczone do planowania
- [Dotyczy R3][Techniczne] Dokladna lista pol we wszystkich kolekcjach/globalach Payload do oznaczenia jako `localized: true` (ServicePage, HeroSection, AboutSection, CvModal, BioModal, StatTile, Portfolio).
- [Dotyczy R5][Techniczne] Mechanizm odczytu wybranego jezyka w SSR (nazwa cookie, middleware/layout, unikniecie flashu zlego jezyka przy pierwszym renderze).
- [Dotyczy R4][Wymaga researchu] Czy Payload's wbudowany `fallback` w konfiguracji lokalizacji pokrywa R4 automatycznie, czy trzeba to reczne obsluzyc w mapperach danych (np. `servicePageData.ts`, `toSubpageLayoutProps`).
- [Dotyczy R2][Techniczne] Struktura slownika statycznych stringow w komponentach (jeden globalny plik vs plik per komponent) i sposob jego wstrzykniecia do server components.
- [Dotyczy R1][Techniczne] Miejsce i wyglad przelacznika PL/EN w istniejacej nawigacji (desktop nav, MobileNav, SubpageLayout topbar) - dopasowanie do istniejacego design systemu.

## Nastepne kroki
→ /dev-plan
