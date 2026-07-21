---
title: "Payload defaultValue aplikuje się mimo pola ukrytego przez admin.condition"
date: 2026-07-21
category: backend-issues
severity: low
stack:
  - Payload
  - MongoDB
tags:
  - payload
  - admin-condition
  - default-value
  - local-api
status: verified
last_verified: 2026-07-21
---

# Payload defaultValue aplikuje się mimo pola ukrytego przez admin.condition

## Symptomy

- Pole `select` w `array` field (`ServicePage.scopeItems.icon`) miało `admin.condition: (data) => data?.slug === 'nadzor-spawalniczy'` - ukryte w panelu admina dla wszystkich innych dokumentów tej kolekcji.
- Plan zakładał, że dokumenty utworzone podczas gdy pole było ukryte NIE będą miały wartości `icon` w bazie (będą `undefined`/`null`), więc trzeba będzie napisać skrypt backfillujący `icon: 'ShieldCheck'` dla wszystkich istniejących wierszy.
- Po usunięciu `admin.condition` i sprawdzeniu bazy (przez Payload Local API, nie panel admina): wszystkie wiersze `scopeItems` na `konstrukcje-stalowe` i `meble-premium` MIAŁY już `icon: "ShieldCheck"` zapisane, mimo że pole nigdy nie było widoczne w UI dla tych dokumentów.

## Root Cause

`admin.condition` to WYŁĄCZNIE reguła widoczności w panelu admina (React admin UI) - nie ma żadnego wpływu na walidację czy domyślne wartości pola po stronie API/bazy danych. `defaultValue` pola jest aplikowany przez Payload przy tworzeniu/aktualizacji dokumentu zawsze, gdy pole nie jest jawnie podane w danych - niezależnie od tego, czy dane przyszły przez formularz admina, Local API (`payload.create`/`payload.update`), czy REST/GraphQL. Dokumenty w tym przypadku zostały utworzone przez `payload.create()` w `src/app/api/seed/route.ts`, który nie podawał `icon` w ogóle dla `konstrukcje-stalowe`/`meble-premium` - Payload sam uzupełnił `defaultValue: 'ShieldCheck'`.

## Rozwiązanie

Przed pisaniem skryptu backfillującego dane dla pola, które było ukryte przez `admin.condition`, ZAWSZE najpierw sprawdź rzeczywisty stan w bazie zamiast zakładać brak danych:

```typescript
// Szybka diagnostyka przez Payload Local API (np. jednorazowy skrypt uruchamiany przez tsx)
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const payload = await getPayload({ config: await config })
const { docs } = await payload.find({
  collection: 'service-pages',
  where: { slug: { in: ['konstrukcje-stalowe', 'meble-premium'] } },
})
for (const doc of docs) {
  for (const item of doc.scopeItems ?? []) {
    console.log(item.text, item.icon) // sprawdź czy defaultValue już tam jest
  }
}
process.exit(0)
```

W tym przypadku backfill okazał się całkowicie zbędny - `defaultValue` pola rozwiązał problem sam, zanim jeszcze zaczęto pisać kod naprawczy.

## Komendy diagnostyczne

```bash
# Uruchomienie jednorazowego skryptu diagnostycznego (Windows, z korporacyjnym proxy SSL)
NODE_OPTIONS="--use-system-ca --no-deprecation --import=tsx/esm" node scripts/diagnostyka.ts
```

## Zapobieganie

- `admin.condition` traktuj wyłącznie jako kontrolę widoczności UI, nigdy jako gwarancję że pole jest puste w bazie dla dokumentów utworzonych "podczas gdy było ukryte".
- Przed jakimkolwiek backfillem danych - zweryfikuj rzeczywisty stan bazy programowo (Local API), nie zakładaj na podstawie historii UI.
- Jeśli pole ma `defaultValue`, ukrycie go przez `admin.condition` nie zapobiega jego ustawieniu - tylko ukrywa możliwość jego RĘCZNEJ zmiany przez admina.

## Powiązane

- `src/collections/ServicePage.ts` - pole `scopeItems.icon`
- `src/app/api/seed/route.ts` - źródło dokumentów, które dostały `defaultValue`

## Kontekst

Projekt MCRAFT (Next.js 16 + Payload CMS 3.x + MongoDB), zadanie `podstrony-uslug-sekcje` (docs/completed/podstrony-uslug-sekcje/). Payload 3.85.1.
