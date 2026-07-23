---
title: "Niezmigrowane pola lokalizowane w Payload traca tresc PL przy pierwszym zapisie pod innym locale"
date: 2026-07-23
category: backend-issues
severity: critical
stack:
  - Payload
  - MongoDB
tags:
  - localization
  - i18n
  - data-loss
  - migration
status: verified
last_verified: 2026-07-23
---

# Niezmigrowane pola lokalizowane w Payload traca tresc PL przy pierwszym zapisie pod innym locale

## Symptomy

- User: "slug tez ma byc tlumaczony bo w panelu admina zawsze jest ustawiony polski mimo roznego locale" - pole `slug` w kolekcji `Portfolio` nie mialo `localized: true`, wiec bylo dzielone (shared) miedzy wszystkimi locale.
- User: "dodawanie angielskiej wersji contentu ma nigdy nie ingerowac w polski content bo przy zmianie jednej realizacji po dodaniu angielskiej wersji usunelo mi wszystko z polskiej wersji" - po zwyklej edycji + zapisie pod locale `en` (bez zadnych specjalnych przyciskow typu "copy to locale"), cala polska tresc dokumentu (title/description/slug) znikala.
- Zero bledu, zero ostrzezenia w UI Payload - dane po prostu przestawaly istniec pod `locale=pl`.

## Root Cause

Pole oznaczone `localized: true` w Payload przechowuje wartosc w bazie jako mape `{ pl: ..., en: ... }`. Gdy do kolekcji/globala DOPIERO dodano `localized: true` (schema change), istniejace dokumenty w MongoDB nadal maja PLASKA wartosc (`title: "tekst"`, nie `title: { pl: "tekst" }`).

Payload **czyta** taki plaski dokument poprawnie pod kazdym locale (dziala jak domyslny fallback) - to maskuje problem i tworzy falszywe poczucie bezpieczenstwa. Ale przy **zapisie** (`payload.update` / edycja w adminie) pod konkretnym locale (np. `en`), Payload nadpisuje CALA strukture pola nowa mapa lokalizacji zbudowana wylacznie z aktualnie zapisywanego locale - plaska (polska) wartosc nie jest migrowana ani zachowywana, po prostu znika.

Odtworzone empirycznie (Local API, izolowana testowa baza):
```
// dokument PRZED zapisem (legacy, plaski):
{ title: "Tytul PL", slug: "stary-slug", description: "opis PL" }

// payload.update({ locale: 'en', data: { title: 'EN title' } })

// dokument PO zapisie:
{ title: { en: "EN title" }, slug: { en: "stary-slug" }, description: { en: {...opis PL jako lexical...} } }
// bucket `pl` nie istnieje NIGDZIE - dane PL bezpowrotnie stracone dla title/slug/description
```

Ten sam mechanizm dotyczy tez tablic z zagniezdzonym polem `localized` (np. `images[].alt` w Portfolio) - jesli wiersz tablicy nie zachowa oryginalnego `id` przy zapisie, jego zlokalizowany subfield tez zostaje utracony (nie jest to jednak przyczyna tego konkretnego incydentu - `BulkImageUpload.tsx` poprawnie zachowuje `id` istniejacych wierszy).

## Rozwiazanie

1. Dodaj `localized: true` do brakujacego pola w konfiguracji kolekcji (`src/collections/Portfolio.ts`):
```typescript
{
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  localized: true, // <- dodane
}
```

2. **Zanim ktokolwiek zapisze dowolny dokument tej kolekcji pod innym locale niz domyslny**, zmigruj WSZYSTKIE istniejace dokumenty do formatu `{ pl: wartosc }`. Projekt ma gotowy, idempotentny skrypt `scripts/migrate-localize-content.ts` + `scripts/lib/localize-migration-helpers.ts` (uzywany juz wczesniej przy pierwszym wprowadzeniu i18n) - trzeba tylko dopisac nowe pole do odpowiedniej funkcji `migrateXxx`:
```typescript
export function migratePortfolio(doc: Doc): boolean {
  let changed = false
  if (localizeField(doc, 'title')) changed = true
  if (localizeField(doc, 'slug')) changed = true // <- dodane
  if (localizeField(doc, 'description')) changed = true
  if (localizeArrayField(doc, 'images', ['alt'])) changed = true
  return changed
}
```

3. Uruchom migracje **na produkcyjnej bazie** (nie tylko lokalnie!). Jesli kontener appki to standalone build bez `pnpm`/`scripts/` (typowe dla Next.js `output: 'standalone'`), odpal logike migracyjna bezposrednio w kontenerze bazy przez `mongosh` jako czysty JS (port bez zaleznosci od Payload/node_modules) - patrz `command.md` w repo dla gotowego, wklejalnego skryptu.

## Komendy diagnostyczne

Sprawdz surowy ksztalt dokumentu w MongoDB (czy pole jest plaskie czy juz `{pl: ...}`):
```javascript
db.getCollection('portfolio-projects').find({}, { title: 1, slug: 1 }).toArray()
```

Test lokalny na izolowanej bazie (bez ryzyka dla realnych danych) - buduj `buildConfig` z osobnym `DATABASE_URL` wskazujacym na scratch baze, wstaw dokument z plaskimi polami, wykonaj `payload.update({ locale: 'en', ... })`, sprawdz `payload.findByID({ locale: 'pl' })` po zapisie.

## Zapobieganie

- Kazda zmiana `localized: true` na istniejacym polu w schemacie Payload MUSI byc parowana z krokiem migracyjnym w tym samym PR/deploy - nigdy nie traktuj tego jako czysto kosmetycznej zmiany configu.
- Checklist wdrozeniowy i18n musi zawierac jawny krok "uruchom migracje na PRODUKCYJNEJ bazie" (nie tylko "zweryfikuj lokalnie") - w tym projekcie ten krok zostal pominiety mimo ze skrypt migracyjny i backup istnialy.
- Po kazdym dodaniu `localized: true` do pola: przed pierwszym zapisem pod nie-domyslnym locale, zweryfikuj przez `db.collection.find()` ze docelowe dokumenty juz maja ksztalt `{ pl: ... }`.

## Powiazane

- `scripts/migrate-localize-content.ts`, `scripts/lib/localize-migration-helpers.ts` - istniejacy mechanizm migracyjny (uzyty pierwotnie przy Fazie 1-8 wdrozenia i18n, `docs/active/i18n-english-locale/`)
- `scripts/backup-before-i18n-migration.ts` - backup przed migracja (uzyty tylko lokalnie, nie przed wdrozeniem na produkcje)
- `command.md` (root repo) - gotowy skrypt `mongosh` do recznego odpalenia migracji na produkcyjnej bazie bez dostepu do `pnpm`/`node_modules` appki

## Kontekst

Payload 3.85.1, MongoDB (mongoose adapter), `localization: { locales: ['pl','en'], defaultLocale: 'pl', fallback: true }`. Produkcja: Docker Compose (`mcraft-app-1` + `mcraft-mongo-1`), appka jako standalone Next.js build bez surowych zrodel/`node_modules` dev-dependencies. Incydent wystapil na produkcyjnej bazie, ktora nigdy nie przeszla przez skrypt migracyjny mimo ze schema i18n (fields `localized: true`) zostala juz wdrozona przez merge do `main`.
