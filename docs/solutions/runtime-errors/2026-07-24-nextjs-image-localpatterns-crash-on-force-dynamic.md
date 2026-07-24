---
title: "next/image z lokalnym plikiem daje runtime 500 na force-dynamic, niewidoczne w pnpm build"
date: 2026-07-24
category: runtime-errors
severity: medium
stack:
  - Next.js
  - React
tags:
  - next-image
  - images-localpatterns
  - force-dynamic
  - next16
status: verified
last_verified: 2026-07-24
---

# next/image z lokalnym plikiem daje runtime 500 na force-dynamic, niewidoczne w pnpm build

## Symptomy

- Strona `/mk-gym` (route z `export const dynamic = 'force-dynamic'`) renderowała się poprawnie w `pnpm build` (statyczna analiza + typecheck przechodziły bez błędu), ale przy realnym request na uruchomionym `pnpm dev`/produkcyjnym serwerze zwracała HTTP 500.
- Log dev servera:
  ```
  ⨯ Error: Invalid src prop (/mk-gym-logo.png) on `next/image` does not match `images.localPatterns` configured in your `next.config.js`
  See more info: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns
  ```
- HTML odpowiedzi miało `<html id="__next_error__">` i `<meta name="next-error" content="not-found"/>`, mimo że kod strony nigdzie nie wywoływał `notFound()` - mylący ślad, bo wygląda jak routing 404, a to nieobsłużony wyjątek renderowania.

## Root Cause

Next.js 16 wprowadza wymóg jawnej konfiguracji `images.localPatterns` w `next.config.ts` dla obrazków z `next/image`, których źródło jest lokalnym plikiem statycznym spoza standardowego przepływu CMS/importu (np. plik w `public/` referencjonowany jako string `src="/plik.png"`). Bez tego wpisu walidacja `next/image` rzuca wyjątek w trakcie renderowania.

`pnpm build` tego NIE wykrywa dla stron z `dynamic = 'force-dynamic'`, ponieważ build statycznie analizuje strukturę tras, ale nie renderuje treści takich stron (są server-rendered on demand) - błąd ujawnia się dopiero przy faktycznym request-time renderze.

## Rozwiązanie

Dla jednorazowego, małego obrazka (logo, ikona) prostsze niż dodawanie konfiguracji jest użycie zwykłego `<img>`:

```tsx
{logoImageUrl ? (
  // eslint-disable-next-line @next/next/no-img-element -- next/image requires images.localPatterns config for this one-off logo
  <img src={logoImageUrl} alt="MK Gym" className="h-[102px] w-auto" />
) : (
  <span>MCRAFT</span>
)}
```

Alternatywa (jeśli optymalizacja obrazu faktycznie potrzebna): dodać w `next.config.ts`:
```ts
images: {
  localPatterns: [{ pathname: '/mk-gym-logo.png' }],
}
```
ale to dodatkowa konfiguracja dla jednego obrazka - nieuzasadniona złożoność przy małym, statycznym logo.

## Komendy diagnostyczne

```bash
# build NIE łapie tego błędu dla stron force-dynamic:
pnpm build   # przechodzi zielono mimo błędu

# trzeba faktycznie odpalić i odpytać stronę:
pnpm dev
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/mk-gym   # 500
```

## Zapobieganie

- Dla stron `force-dynamic`, `pnpm build` (typecheck + statyczna analiza) nie jest wystarczającym dowodem poprawności - trzeba faktycznie odpalić dev server i sprawdzić request (curl/e2e), zanim zgłosi się fazę jako ukończoną.
- Przy dodawaniu `next/image` z lokalnym plikiem spoza CMS/public assets już skonfigurowanych w projekcie, sprawdź najpierw czy `images.localPatterns`/`images.remotePatterns` w `next.config.ts` już to pokrywa - jeśli nie i obrazek jest jednorazowy/mały, zwykły `<img>` jest bezpieczniejszym domyślnym wyborem.

## Powiązane

- https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns

## Kontekst

Next.js 16.2.6 (Turbopack), projekt MCRAFT. Zauważone podczas dodawania własnego logo na ukrytej podstronie `/mk-gym` (branch `feature/mk-gym-strona`).
