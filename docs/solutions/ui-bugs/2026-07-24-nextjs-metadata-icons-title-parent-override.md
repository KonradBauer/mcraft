---
title: "Jawne icons/title w root layout.tsx przykrywają konwencje plikowe i szablony w segmentach potomnych"
date: 2026-07-24
category: ui-bugs
severity: low
stack:
  - Next.js
tags:
  - metadata-api
  - favicon
  - title-template
  - app-router
status: verified
last_verified: 2026-07-24
---

# Jawne icons/title w root layout.tsx przykrywają konwencje plikowe i szablony w segmentach potomnych

## Symptomy

- Dodanie pliku `icon.png` w folderze route'u (`src/app/(frontend)/mk-gym/icon.png`) - zgodnie z konwencją plikową Next.js App Router - NIE zmieniło favicona na stronie `/mk-gym`. `curl` pokazywał wciąż `<link rel="icon" href="/favicon.png"/>` (site-wide favicon z root layoutu).
- `title: dict.meta.mkGym.title` (plain string `"MK Gym"`) w `generateMetadata` strony potomnej renderował się jako `"MK Gym | MCRAFT"` zamiast samego `"MK Gym"`, mimo że strona nie ustawiała żadnego `template`.

## Root Cause

Root `layout.tsx` miał jawnie zadeklarowane w swoim `generateMetadata`:
```ts
icons: { icon: '/favicon.png' },
title: { default: dict.meta.site.title, template: '%s | MCRAFT' },
```
Jawna wartość `icons`/`title.template` w metadata rodzica ma pierwszeństwo nad konwencją plikową (`icon.png` w segmencie potomnym) oraz automatycznie opakowuje `title` potomka w swój `template`, chyba że potomek jawnie to nadpisze. Sama obecność pliku `icon.png` w folderze route'u nie wystarcza, gdy gdziekolwiek wyżej w drzewie layoutów `icons` jest ustawione explicite.

## Rozwiązanie

W `generateMetadata` strony potomnej trzeba jawnie nadpisać oba pola:

```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: dict.meta.mkGym.title },  // pomija template rodzica całkowicie
    icons: { icon: '/mk-gym-favicon.png' },       // nadpisuje icons rodzica
    // ...
  }
}
```

`title: { absolute: '...' }` to jedyny sposób pominięcia `template` rodzica - plain string zawsze dziedziczy szablon najbliższego przodka, który go zdefiniował.

Dla `icons`: prościej trzymać plik w `public/` i referencjonować go jawnie (`/mk-gym-favicon.png`), niż polegać na konwencji plikowej `icon.png` w folderze route'u, skoro rodzic i tak ją przykrywa - unika niejednoznaczności co faktycznie determinuje finalny `<link rel="icon">`.

## Komendy diagnostyczne

```bash
curl -s http://localhost:3000/<route> | grep -o '<link rel="icon"[^>]*>'
curl -s http://localhost:3000/<route> | grep -o '<title>[^<]*</title>'
```

## Zapobieganie

- Gdy strona potomna ma pokazywać INNY favicon/title niż reszta strony, a root layout ma jawne `icons`/`title.template` - nie polegaj na konwencji plikowej (`icon.png`, `opengraph-image.tsx` itp.) w segmencie potomnym, zadeklaruj `icons`/`title` jawnie w `generateMetadata` tego segmentu.
- `title: { absolute: '...' }` zamiast plain string, gdy segment ma pokazywać tytuł BEZ szablonu odziedziczonego z rodzica.

## Powiązane

- https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title

## Kontekst

Next.js 16.2.6 App Router, projekt MCRAFT. Odkryte przy dopracowywaniu brandingu ukrytej podstrony `/mk-gym` tak, żeby sprawiała wrażenie osobnej strony (branch `feature/mk-gym-strona`).
