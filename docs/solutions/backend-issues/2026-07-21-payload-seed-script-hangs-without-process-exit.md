---
title: "Skrypt seed przez Payload Local API wisi w nieskończoność bez process.exit(0)"
date: 2026-07-21
category: backend-issues
severity: low
stack:
  - Payload
  - MongoDB
  - Node.js
tags:
  - payload
  - local-api
  - seed-script
  - tsx
status: verified
last_verified: 2026-07-21
---

# Skrypt seed przez Payload Local API wisi w nieskończoność bez process.exit(0)

## Symptomy

- Jednorazowy skrypt (`scripts/seed-service-sections.ts`, wzorowany na `scripts/seed-tiles.ts`) łączący się z bazą przez `getPayload({ config })` i wykonujący `payload.update()`, uruchomiony przez `node script.ts --import=tsx/esm`, nigdy się nie kończył mimo że cała logika (włącznie z `console.log` z wynikiem) wykonała się poprawnie.
- Uruchomienie w Bash z timeoutem 60s kończyło się automatycznym przeniesieniem procesu w tło zamiast normalnego zakończenia.
- Output w pliku logu był poprawny i kompletny - problem nie leżał w logice skryptu, tylko w tym że proces nie kończył działania.

## Root Cause

Payload Local API (`getPayload`) utrzymuje otwarte połączenie do MongoDB (via `@payloadcms/db-mongodb`). Otwarte połączenie sieciowe trzyma Node.js event loop aktywny, więc proces nigdy nie kończy się naturalnie po zakończeniu `async function main()` - Node.js czeka, aż WSZYSTKIE handle'y (w tym otwarte sockety DB) zostaną zamknięte, zanim pozwoli procesowi zakończyć się samoistnie.

## Rozwiązanie

Zakończ proces jawnie po wykonaniu operacji, dokładnie jak robi to istniejący wzorzec w repo (`scripts/seed-tiles.ts`):

```typescript
async function main() {
  const payload = await getPayload({ config: await config })
  // ... operacje na danych ...
  console.log('Gotowe.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

Bez `process.exit(0)` na końcu `main()` (i `process.exit(1)` w `.catch()` dla obsługi błędów) proces wisi w nieskończoność niezależnie od tego, czy logika zakończyła się sukcesem.

## Komendy diagnostyczne

```bash
# Jeśli proces wisi mimo poprawnego console.log - sprawdź czy jest process.exit()
grep -n "process.exit" scripts/twoj-skrypt.ts

# Uruchomienie z krótkim timeoutem żeby szybko zauważyć problem
NODE_OPTIONS="--use-system-ca --no-deprecation --import=tsx/esm" timeout 15 node scripts/twoj-skrypt.ts
```

## Zapobieganie

- Każdy nowy jednorazowy skrypt w `scripts/` łączący się z Payload przez Local API (`getPayload`) MUSI kończyć się `process.exit(0)` w happy path i `process.exit(1)` w catch - to nie jest opcjonalne, bez tego proces wisi zawsze.
- Wzorzec do kopiowania: `scripts/seed-tiles.ts`, `scripts/seed-cv.ts`, `scripts/seed-service-sections.ts`.

## Powiązane

- `scripts/seed-tiles.ts` - pierwotny wzorzec w repo
- `scripts/seed-service-sections.ts` - nowy skrypt zgodny z wzorcem

## Kontekst

Projekt MCRAFT (Next.js 16 + Payload CMS 3.x + MongoDB), zadanie `podstrony-uslug-sekcje` (docs/completed/podstrony-uslug-sekcje/). Windows, tsx 4.21.0, Payload 3.85.1.
