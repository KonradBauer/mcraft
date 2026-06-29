---
date: 2026-06-29
topic: realizacje-podstrony
---

# Realizacje - podstrony dla Meble Premium i Konstrukcje Stalowe

## Problem

Sekcja "Realizacje" w `SubpageLayout` renderuje płaskie zdjęcia z pola `galleryImages` ServicePage - bez interakcji, bez opisu per realizacja. `Portfolio` collection istnieje w adminie ale nie jest podpięty do frontendu. Użytkownik nie może eksplorować konkretnych realizacji.

## Wymagania

- R1. Sekcja "Realizacje" na podstronach obszarów wyświetla kafelki z kolekcji `Portfolio` (thumbnail + tytuł), posortowane wg pola `order`, filtrowane po przypisanym `servicePage`.
- R2. Każdy kafelek realizacji jest klikalny i prowadzi do dedykowanej podstrony realizacji.
- R3. Podstrona realizacji zawiera: tytuł, opis, galerię zdjęć (z pola `images` w Portfolio).
- R4. Styl podstrony realizacji spójny z istniejącym design systemem (czcionki, kolory, topbar, footer jak w `SubpageLayout`).
- R5. `Portfolio` collection w adminie umożliwia dodawanie, edytowanie i usuwanie realizacji dla obszarów Meble Premium i Konstrukcje Stalowe.
- R6. `Portfolio` collection wymaga pola `slug` do budowania URL podstrony.
- R7. Mechanizm działa dla Meble Premium i Konstrukcje Stalowe (wspólny kod). Nadzór Spawalniczy - out of scope.

## Kryteria sukcesu

- Wejście na `/meble-premium` pokazuje kafelki realizacji z Portfolio (nie stare `galleryImages`).
- Kliknięcie kafelka przenosi na podstronę z galerią i opisem tej realizacji.
- Admin może dodać nową realizację i pojawi się ona na stronie po odświeżeniu.

## Granice scope'u

- Nadzór Spawalniczy - osobny mechanizm, osobny brainstorm.
- Brak lightboxa wewnątrz podstrony realizacji - zdjęcia renderowane statycznie.
- Brak paginacji w sekcji Realizacje (na razie).
- Pole `galleryImages` w ServicePage można usunąć lub zostawić jako legacy - decyzja planowania.

## Kluczowe decyzje

- **Osobna podstrona (nie modal):** lepsza dla SEO, możliwość linkowania do konkretnej realizacji.
- **Wspólny mechanizm dla Meble Premium + Konstrukcje Stalowe:** DRY, nie trzeba duplikować kodu.
- **Treść podstrony realizacji:** tytuł + opis + galeria (bez dodatkowych pól jak rok/materiały).

## Otwarte pytania

### Do rozwiązania przed planowaniem

*(brak)*

### Odroczone do planowania

- [Dotyczy R6][Techniczne] Slug Portfolio - pole ręczne w adminie czy auto-generowane z tytułu (np. przez Payload `slugField` hook)?
- [Dotyczy R2][Techniczne] URL pattern - dwa osobne routes (`/meble-premium/realizacje/[slug]`, `/konstrukcje-stalowe/realizacje/[slug]`) czy jeden dynamic route (`/(frontend)/[serviceSlug]/realizacje/[slug]`)?
- [Dotyczy R1][Techniczne] Co z istniejącym polem `galleryImages` w ServicePage - usunąć, zostawić, czy zignorować w SubpageLayout?

## Następne kroki

`→ /dev-plan` do planowania technicznego implementacji
