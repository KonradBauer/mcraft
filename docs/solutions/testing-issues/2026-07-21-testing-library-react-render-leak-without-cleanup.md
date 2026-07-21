---
title: "@testing-library/react - render() kumuluje się w DOM między testami bez afterEach(cleanup)"
date: 2026-07-21
category: testing-issues
severity: medium
stack:
  - Vitest
  - React
  - "@testing-library/react"
tags:
  - testing-library
  - vitest
  - jsdom
  - render-leak
status: verified
last_verified: 2026-07-21
---

# @testing-library/react - render() kumuluje się w DOM między testami bez afterEach(cleanup)

## Symptomy

- Nowy plik testowy (`tests/int/SubpageLayout.int.spec.tsx`) z 4 testami, każdy wołający `render(<SubpageLayout ... />)`.
- Testy 1-2 przechodziły, testy 3-4 failowały z `TestingLibraryElementError: Found multiple elements with the role "heading" and name "Zakres"` (lub `"Realizacje"`) mimo że każdy `it()` renderował komponent tylko raz.
- Błąd pokazywał w DOM WIELE nakładających się kopii tego samego komponentu (np. 4x `<h2>Zakres</h2>` przy 4. teście w kolejności).

## Root Cause

`@testing-library/react`'s `render()` domyślnie NIE czyści DOM między wywołaniami - odpowiedzialność za to (`cleanup()`, wywoływane zwykle w `afterEach`) leży po stronie test runnera/frameworka. Jest zwykle rejestrowane automatycznie przez `@testing-library/react/vitest` (setup entry) lub globalny plik setup, ale w tym repo `vitest.setup.ts` zawierał tylko `import 'dotenv/config'` - bez żadnego globalnego cleanupu. Każde kolejne `render()` w tym samym pliku testowym (jeden `describe` blok, ta sama instancja `document`) dopisywało nowy komponent do istniejącego DOM zamiast go zastępować.

## Rozwiązanie

Dodaj jawny `afterEach(cleanup)` w pliku testowym (lub globalnie w `vitest.setup.ts`, jeśli testów komponentów będzie więcej):

```typescript
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

afterEach(cleanup)

describe('SubpageLayout', () => {
  it('...', () => {
    render(<SubpageLayout {...props} />)
    // ...
  })
})
```

Dodatkowo: przy wielu instancjach tego samego tekstu w DOM (np. nawigacja mobilna + desktopowa renderują ten sam link dwa razy) używaj precyzyjniejszych selektorów niż `getByText` - np. `getByRole('heading', { name: '...' })`, żeby ograniczyć się do faktycznych nagłówków sekcji zamiast dowolnego tekstu w linkach/przyciskach nawigacji.

## Komendy diagnostyczne

```bash
# Uruchom pojedynczy plik testowy i sprawdź czy błąd "multiple elements" pojawia się dopiero od N-tego testu
pnpm exec vitest run tests/int/TwojKomponent.int.spec.tsx --config ./vitest.config.mts
```

## Zapobieganie

- Każdy nowy plik testowy w tym repo używający `render()` z `@testing-library/react` MUSI zawierać `afterEach(cleanup)`, dopóki `vitest.setup.ts` nie zostanie rozszerzony o globalny cleanup.
- Rozważ dodanie `afterEach(cleanup)` globalnie w `vitest.setup.ts`, jeśli komponentowych testów przybędzie - oszczędzi to powtarzania w każdym pliku.
- Preferuj `getByRole` z `name` nad `getByText` przy tekstach, które mogą wystąpić w wielu miejscach layoutu (nagłówki sekcji vs. linki nawigacyjne o tej samej treści).

## Powiązane

- `tests/int/SubpageLayout.int.spec.tsx` - pierwszy test komponentowy w tym repo
- `vitest.setup.ts` - globalny setup, obecnie bez cleanupu

## Kontekst

Projekt MCRAFT (Next.js 16 + Payload CMS 3.x), zadanie `podstrony-uslug-sekcje` (docs/completed/podstrony-uslug-sekcje/). Vitest 4.0.18, @testing-library/react 16.3.0, jsdom environment. `@testing-library/jest-dom` NIE jest zainstalowany w tym projekcie - matchery ograniczone do `toBeTruthy()`/`toBeNull()` zamiast `toBeInTheDocument()`.
