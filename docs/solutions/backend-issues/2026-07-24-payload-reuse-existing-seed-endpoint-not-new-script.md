---
title: "Sprawdź czy istnieje już mechanizm seedowania kolekcji, zanim napiszesz nowy skrypt"
date: 2026-07-24
category: backend-issues
severity: medium
stack:
  - Payload
  - Next.js
tags:
  - payload
  - seed
  - local-api
  - overrideAccess
status: verified
last_verified: 2026-07-24
---

# Sprawdź czy istnieje już mechanizm seedowania kolekcji, zanim napiszesz nowy skrypt

## Symptomy

- Plan zakładał utworzenie nowego jednorazowego skryptu `scripts/seed-mk-gym.ts` (wzorowanego na `scripts/seed-tiles.ts`), żeby utworzyć początkowy dokument `ServicePage` (kolekcja ma `access.create: () => false`, więc nie da się tego zrobić przez panel/REST).
- Dopiero research repo ujawnił istniejący, już działający endpoint `src/app/api/seed/route.ts` z tablicą `PAGES`, który dokładnie to samo robi (idempotentny `GET` - tworzy/aktualizuje) DLA TEJ SAMEJ kolekcji, dla pozostałych 3 rekordów (`meble-premium`, `konstrukcje-stalowe`, `nadzor-spawalniczy`).
- Endpoint ma też `DELETE`, który usuwa WSZYSTKIE dokumenty `ServicePage` spoza allowlisty `PAGES` - gdyby nowy skrypt utworzył rekord `mk-gym` osobno (bez dopisania go do `PAGES`), pierwsze wywołanie `DELETE /api/seed` przez kogokolwiek skasowałoby go po cichu.

## Root Cause

Brak sprawdzenia istniejących mechanizmów seedowania danej kolekcji przed zaplanowaniem nowego skryptu. Plan techniczny opierał się na ogólnym wzorcu z `scripts/seed-*.ts` (używanym dla innych kolekcji jak `stat-tiles`), zakładając że to jedyny sposób seedowania w repo - bez zgrepowania samej kolekcji `service-pages` pod kątem istniejących miejsc, które ją tworzą/aktualizują.

## Rozwiązanie

Przed napisaniem nowego skryptu seedującego jakąkolwiek kolekcję:

```bash
# znajdź WSZYSTKIE miejsca, które tworzą/aktualizują dokumenty tej kolekcji
grep -rn "collection: 'service-pages'" src/ scripts/
```

W tym przypadku: dopisanie wpisu do istniejącej tablicy `PAGES` w `src/app/api/seed/route.ts`, zamiast nowego skryptu:

```ts
const PAGES = [
  // ...istniejące wpisy...
  {
    slug: 'mk-gym',
    title: 'MK Gym',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'MK Gym',
    scopeItems: [],
  },
]
```

Ten endpoint już implementuje idempotencję (`find` → `create` jeśli brak, inaczej `update`) i `overrideAccess: true`, więc omija `access.create: () => false` bez dodatkowego kodu.

## Komendy diagnostyczne

```bash
# znajdź istniejące mechanizmy seedowania/tworzenia danej kolekcji
grep -rn "collection: '<slug-kolekcji>'" src/ scripts/
```

## Zapobieganie

- Zanim zaplanujesz nowy skrypt seedujący/migracyjny dla kolekcji Payload, zgrepuj repo pod kątem istniejących miejsc operujących na tej kolekcji (`payload.create`, `payload.update`, dedykowane `/api/seed`-podobne route'y) - w tym projekcie taki mechanizm już istniał i obsługiwał dokładnie ten sam problem (idempotentny upsert + ochrona przed przypadkowym `DELETE`).
- Jeśli endpoint/skrypt ma logikę "usuń wszystko spoza allowlisty" (`DELETE` w tym przypadku), każdy nowy rekord tej kolekcji tworzony OMIJAJĄC tę allowlistę jest podatny na ciche skasowanie przy następnym wywołaniu.

## Powiązane

- docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md (wzorzec skryptu seed, gdy faktycznie trzeba nowy)

## Kontekst

Projekt MCRAFT, Payload CMS 3.x. Odkryte podczas dodawania obszaru "MK Gym" do kolekcji `ServicePage` (branch `feature/mk-gym-strona`).
