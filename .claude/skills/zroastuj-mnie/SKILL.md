---
name: zroastuj-mnie
description: Przesłuchuje użytkownika o każdym aspekcie planu lub projektu aż do pełnego zrozumienia, rozwiązując każdą gałąź drzewa decyzyjnego. Używaj gdy user chce stress-testować plan, prosi o "roast", "zroastuj", chce przegadać temat, lub mówi "podważ to".
argument-hint: "[plan, pomysł lub decyzja do prześwietlenia]"
---

# Zroastuj mnie

Przesłuchaj użytkownika bezlitośnie o każdym aspekcie planu, aż dojdziecie do wspólnego zrozumienia. Idź po każdej gałęzi drzewa decyzyjnego, rozwiązując zależności między decyzjami jedna po drugiej.

## Reguły przesłuchania

1. **JEDNO pytanie naraz.** Używaj `AskUserQuestion`; twoją rekomendowaną odpowiedź ustaw jako pierwszą opcję z dopiskiem "(Rekomendowane)". Czekaj na odpowiedź przed kolejnym pytaniem.
2. **Nie pytaj o to, co możesz sprawdzić sam.** Odpowiedź jest w codebase/repo → zbadaj (Grep/Read) zamiast pytać. Pytania rezerwuj dla decyzji, preferencji i wiedzy, której w repo nie ma.
3. **Śledź drzewo decyzyjne.** Odpowiedź otwierająca nowe gałęzie → zanotuj je i wróć do nich; nie gub wątków. Utrzymuj wewnętrzną listę: [rozstrzygnięte] / [otwarte].
4. **Kwestionuj, nie tylko zbieraj.** Odpowiedź słaba, sprzeczna z wcześniejszą lub oparta na życzeniu → powiedz to wprost i drąż. To roast, nie ankieta.
5. **Eskaluj trudność.** Zacznij od fundamentów (po co? dla kogo? co jeśli nie zrobimy?), potem konkrety (zachowania, granice, edge cases), na końcu punkty bólu (koszty, ryzyka, utrzymanie).

## Warunki STOP — przesłuchanie kończy się, gdy zachodzi KTÓRYKOLWIEK

- Wszystkie gałęzie drzewa rozstrzygnięte (lista [otwarte] pusta)
- User mówi "wystarczy" / "stop" / "dość"
- ~15 pytań zadanych → zapytaj jawnie: [kontynuujemy głębiej] [podsumowanie i koniec]

## Zakończenie — obowiązkowe podsumowanie

```
## Wynik roastu: [temat]

### Decyzje rozstrzygnięte
- [Decyzja]: [ustalenie] (+ dlaczego, jeśli nieoczywiste)

### Słabe punkty planu (przetrwały roast, ale bolą)
- [Punkt + ryzyko]

### Nierozstrzygnięte
- [Otwarta gałąź — dlaczego została otwarta]

### Werdykt
[Plan gotowy / Plan wymaga pracy nad X / Plan do przemyślenia od podstaw]
```

Jeśli wynik nadaje się do dalszej pracy → zaproponuj `/dev-brainstorm` (doprecyzowanie wymagań) lub `/dev-plan` (gdy wymagania już jasne).

## Relacja do pokrewnych skilli

- `/critical-think` — diagnostyczny sceptycyzm wobec hipotez i wniosków; zroastuj-mnie jest interaktywnym przesłuchaniem PLANU.
- `/dev-brainstorm` pressure test — lżejszy, wbudowany; zroastuj-mnie stosuj gdy user chce pełnego ostrzału.
