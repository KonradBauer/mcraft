---
title: "feat: Portfolio realizacje - karty i podstrony dla Meble Premium i Konstrukcje Stalowe"
type: feat
status: active
date: 2026-06-29
origin: docs/dev-brainstorms/2026-06-29-realizacje-podstrony-requirements.md
---

# feat: Portfolio realizacje - karty i podstrony

## Przegląd

Sekcja "Realizacje" w `SubpageLayout` renderuje płaskie zdjęcia z pola `galleryImages` ServicePage. Kolekcja `Portfolio` istnieje w adminie lecz nie jest podpięta do frontendu. Ten plan podpina Portfolio: karty w siatce na stronach obszarów + dedykowana podstrona każdej realizacji.

## Ujęcie problemu

Michał zarządza realizacjami w adminie (kolekcja `portfolio-projects`), ale na frontendzie nie są widoczne. Użytkownik strony nie może przeglądać konkretnych realizacji - brak tytułu, opisu ani galerii per projekt.

Źródło: `docs/dev-brainstorms/2026-06-29-realizacje-podstrony-requirements.md`

## Śledzenie wymagań

- R1. Sekcja "Realizacje" wyświetla karty z Portfolio (thumbnail + tytuł), sort wg `order`, filtr wg `servicePage`
- R2. Karta klikalny → dedykowana podstrona realizacji
- R3. Podstrona realizacji: tytuł + opis + galeria zdjęć
- R4. Styl spójny z design systemem (topbar, footer, czcionki, kolory jak w `SubpageLayout`)
- R5. Admin: dodawanie/edycja/usuwanie realizacji działa przez Payload admin (już istnieje, wymaga pola `slug`)
- R6. Portfolio collection posiada pole `slug`
- R7. Wspólny kod dla Meble Premium i Konstrukcje Stalowe

## Granice scope'u

- Nadzór Spawalniczy - out of scope
- Brak lightboxa - zdjęcia renderowane statycznie
- Brak paginacji w siatce
- Pole `galleryImages` w ServicePage - zostaje w schemacie, usunięte z renderowania

## Kontekst i research

### Relevantny kod i wzorce

- `src/collections/Portfolio.ts` - kolekcja z polami: title, servicePage (rel), description, thumbnail, images[], order
- `src/collections/ServicePage.ts` - pole `slug` jako identyfikator URL
- `src/lib/servicePageData.ts` - wzorzec `toSubpageLayoutProps()` + helper `resolveMediaUrl()`
- `src/app/(frontend)/meble-premium/page.tsx` i `konstrukcje-stalowe/page.tsx` - identyczny wzorzec: `getPayload` → `payload.find` → `<SubpageLayout {...props} />`
- `src/components/mcraft/SubpageLayout.tsx` - obecne props: `eyebrow`, `title`, `description`, `items[]`, `mainImageUrl`, `galleryImages[]`, `ctaLabel`
- `src/components/mcraft/ImageWithSkeleton.tsx` - komponent obrazu z skeleton, przyjmuje `src`, `alt`, `sizes`, `className`
- `src/components/mcraft/ImageSlot.tsx` - placeholder dla brakujących zdjęć
- `export const dynamic = 'force-dynamic'` - wymagane na wszystkich stronach frontendu
- `src/payload-types.ts` - regenerowany przez `pnpm generate:types` po zmianach schematu

### Wzorzec pobierania Portfolio

ServicePage jest polem relationship (ID) w Portfolio. Optymalny pattern: najpierw pobierz ServicePage (już to robimy), użyj jego `id` jako filtr dla Portfolio:

```
payload.find({ collection: 'portfolio-projects', where: { servicePage: { equals: servicePageId } }, sort: 'order', depth: 1, limit: 100 })
```

### Kluczowe decyzje

- **Slug Portfolio - ręczny**: zmiana tytułu nie łamie URL-i. Pole wymagane, unikalne.
- **URL pattern - dynamic route `[serviceSlug]/realizacje/[slug]`**: jeden plik zamiast dwóch identycznych. Handler sprawdza allowlist i zwraca `notFound()` dla nieobsługiwanych slugów.
- **`galleryImages` zostaje w schemacie ServicePage**: usuwanie pola = ryzyko migracji danych. Wystarczy usunąć je z `SubpageLayoutProps` i renderowania.
- **Topbar i footer**: skopiować markup z `SubpageLayout` do nowego komponentu `RealizacjaPage`. Dwie instancje uzasadniają późniejszą ekstrakcję do `PageShell`, ale nie wymuszają jej teraz.
- **`PORTFOLIO_PAGES` allowlist**: stała array `['meble-premium', 'konstrukcje-stalowe']` w pliku route'u do sprawdzania dostępu.

## Otwarte pytania

### Rozwiązane podczas planowania

- **Slug Portfolio - ręczny czy auto**: ręczny (stabilność URL ponad wygodę)
- **URL pattern**: jeden dynamic route z allowlistą
- **galleryImages**: zostaje w schemacie, usunięte z SubpageLayout props

### Odroczone do implementacji

- Dokładna nazwa stałej/helperów w nowych plikach
- Czy implementator zdecyduje się wyekstrahować `PageShell` (topbar + footer) - decyzja po zobaczeniu rozmiaru duplikacji

## Implementation Units

---

- [x] **Unit 1: Dodaj pole `slug` do Portfolio collection**

**Cel:** Portfolio items mają stabilny URL slug zarządzany przez admina.

**Wymagania:** R5, R6

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/collections/Portfolio.ts`
- Regeneruj: `src/payload-types.ts` (komenda: `pnpm generate:types`)

**Podejście:**
- Dodaj pole `slug` (type: `text`, required: true, unique: true) do listy pól `Portfolio`
- Umieść je zaraz po `title`
- Label: `Slug URL (unikalny identyfikator, np. stol-loftowy-debowy)`
- Admin description: `Używany w adresie URL. Małe litery, myślniki zamiast spacji. Nie zmieniaj po opublikowaniu.`
- Po edycji kolekcji uruchom `pnpm generate:types` żeby zaktualizować `payload-types.ts`

**Wzorce do naśladowania:**
- `src/collections/ServicePage.ts` - pole `slug` z `unique: true` i ostrzeżeniem w description

**Scenariusze testowe:**
- [E2E] W adminie Payload: utwórz realizację bez slug → walidacja blokuje zapis
- [E2E] Dwie realizacje z tym samym slugiem → unikalność blokuje drugą
- [E2E] Realizacja z slugiem zapisuje się poprawnie

**Weryfikacja:**
- `pnpm generate:types` kończy się bez błędów
- Typ `PortfolioProject` w `payload-types.ts` zawiera pole `slug: string`

---

- [x] **Unit 2: Aktualizacja `SubpageLayout` - zamień `galleryImages` na karty realizacji**

**Cel:** Sekcja "Realizacje" renderuje klikalny grid kart Portfolio zamiast płaskich zdjęć.

**Wymagania:** R1, R2, R4

**Zależności:** Brak (nie wymaga Unit 1 do samej zmiany komponentu)

**Pliki:**
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx`

**Podejście:**
- Usuń z `SubpageLayoutProps`: `galleryImages?: { url: string; alt?: string | null }[]`
- Dodaj do `SubpageLayoutProps`: `realizacje?: { href: string; title: string; thumbnailUrl: string | null }[]`
- W sekcji "Realizacje" (`mt-[18px]`): zamień grid obrazów na grid kart
- Karta: `<Link href={item.href}>` owijający:
  - `<div className="relative w-full h-[220px]">` z `ImageWithSkeleton` (lub `ImageSlot` gdy brak thumbnail)
  - Tytuł realizacji jako nakładka lub pod zdjęciem
- Fallback gdy `realizacje` pusta lub undefined: zachowaj trzy `<ImageSlot>` placeholdery (lub usuń - decyzja implementatora)
- Grid: `grid-cols-3`, breakpoints jak były

**Wzorce do naśladowania:**
- Obecny grid w `SubpageLayout.tsx` linie 102-114
- `ImageWithSkeleton` z `sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw"`

**Scenariusze testowe:**
- [E2E] Strona `/meble-premium` z realizacjami - grid pokazuje karty z tytułami
- [E2E] Kliknięcie karty przenosi na właściwy URL realizacji
- [E2E] Strona bez realizacji w Portfolio - sekcja Realizacje renderuje się bez błędów
- [E2E] Responsywność: 2 kolumny na ≤980px, 1 kolumna na ≤560px

**Weryfikacja:**
- `pnpm lint` bez błędów
- TypeScript bez błędów na `SubpageLayoutProps`

---

- [x] **Unit 3: Aktualizacja `servicePageData.ts` i stron obszarów**

**Cel:** Strony Meble Premium i Konstrukcje Stalowe pobierają Portfolio items i przekazują je do `SubpageLayout`.

**Wymagania:** R1, R7

**Zależności:** Unit 1 (slug w types), Unit 2 (nowe props SubpageLayout)

**Pliki:**
- Modyfikuj: `src/lib/servicePageData.ts`
- Modyfikuj: `src/app/(frontend)/meble-premium/page.tsx`
- Modyfikuj: `src/app/(frontend)/konstrukcje-stalowe/page.tsx`

**Podejście:**

W `servicePageData.ts`:
- Dodaj helper `toRealizacjeProps(items: PortfolioProject[], serviceSlug: string)` zwracający `{ href: string; title: string; thumbnailUrl: string | null }[]`
- `href = /${serviceSlug}/realizacje/${item.slug}`
- `thumbnailUrl` przez istniejący wzorzec `resolveMediaUrl(item.thumbnail)`

W `meble-premium/page.tsx` i `konstrukcje-stalowe/page.tsx`:
- Po pobraniu ServicePage, jeśli `docs[0]` istnieje: pobierz Portfolio items przez `payload.find({ collection: 'portfolio-projects', where: { servicePage: { equals: docs[0].id } }, sort: 'order', depth: 1, limit: 100 })`
- Przekaż wynik do `toRealizacjeProps()` i dodaj `realizacje` do propsów SubpageLayout

Wzorzec importu PortfolioProject z `@/payload-types` - sprawdzić dokładną nazwę po `pnpm generate:types`.

**Wzorce do naśladowania:**
- `src/lib/servicePageData.ts` - `toSubpageLayoutProps` + `resolveMediaUrl`
- `src/app/(frontend)/meble-premium/page.tsx` - `getPayload` → `payload.find` pattern

**Scenariusze testowe:**
- [E2E] `/meble-premium` z 2 realizacjami w Portfolio → 2 karty widoczne
- [E2E] `/konstrukcje-stalowe` bez realizacji → sekcja Realizacje bez crash

**Weryfikacja:**
- Obie strony renderują się bez błędów TypeScript
- Realizacje przypisane do złego servicePage nie pojawiają się na stronie

---

- [x] **Unit 4: Podstrona realizacji - dynamic route**

**Cel:** Każda realizacja ma własną stronę z tytułem, opisem i galerią zdjęć.

**Wymagania:** R2, R3, R4, R7

**Zależności:** Unit 1, Unit 3

**Pliki:**
- Stwórz: `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx`

**Podejście:**

```
export const dynamic = 'force-dynamic'
```

Allowlist check na początku:
```
const PORTFOLIO_PAGES = ['meble-premium', 'konstrukcje-stalowe']
if (!PORTFOLIO_PAGES.includes(params.serviceSlug)) notFound()
```

Pobieranie danych:
1. Pobierz ServicePage (`where: { slug: { equals: params.serviceSlug } }`) → tytuł obszaru jako eyebrow
2. Pobierz PortfolioProject (`where: { slug: { equals: params.slug } }, depth: 2`)
3. Jeśli nie znaleziono lub `portfolioItem.servicePage.slug !== params.serviceSlug` → `notFound()`

Struktura strony (jako komponent `RealizacjaPage` lub inline):
- Topbar (identyczny markup jak w `SubpageLayout`)
- Header: eyebrow = nazwa obszaru, h1 = tytuł realizacji
- Body: opis (jeśli istnieje) + grid zdjęć z `item.images[]` (3 kolumny → 2 → 1)
- Link powrotu: `← Wróć do ${servicePageTitle}` → `/${params.serviceSlug}`
- CTA section (identyczna jak w `SubpageLayout`)
- Footer (identyczny markup jak w `SubpageLayout`)

Metadata: `title: \`${realizacja.title} - MCRAFT\``

**Wzorce do naśladowania:**
- `src/components/mcraft/SubpageLayout.tsx` - cały markup topbar + footer
- `src/app/(frontend)/meble-premium/page.tsx` - wzorzec `force-dynamic` + `getPayload`
- `src/components/mcraft/ImageWithSkeleton.tsx` - renderowanie zdjęć

**Scenariusze testowe:**
- [E2E] `/meble-premium/realizacje/stol-loftowy` → strona z tytułem, opisem, zdjęciami
- [E2E] `/nadzor-spawalniczy/realizacje/cokolwiek` → 404
- [E2E] `/meble-premium/realizacje/nieistniejacy-slug` → 404
- [E2E] `/konstrukcje-stalowe/realizacje/[slug-z-meble]` → 404 (cross-service guard)
- [E2E] Link powrotu wraca na `/meble-premium`
- [E2E] Responsywność: grid zdjęć na mobile

**Weryfikacja:**
- `pnpm build` bez błędów typów (lub `pnpm lint`)
- `notFound()` działa dla niedozwolonych serviceSlug
- Zdjęcia ładują się z `ImageWithSkeleton`

## Wpływ systemowy

- **Zmiana schematu**: Dodanie `slug` do Portfolio zmienia kolekcję MongoDB. Istniejące dokumenty Portfolio (jeśli są) nie będą miały slug - admin będzie musiał je uzupełnić przed opublikowaniem.
- **SubpageLayoutProps**: Usunięcie `galleryImages` to breaking change. Unit 3 musi być wykonany razem z Unit 2 (lub fallback na undefined w props).
- **`toSubpageLayoutProps` w servicePageData**: Zwracany obiekt traci `galleryImages`. TypeScript wymusi aktualizację.
- **Dynamic route `[serviceSlug]`**: Nie koliduje z istniejącymi routes (meble-premium, konstrukcje-stalowe, nadzor-spawalniczy są statyczne i mają wyższy priorytet w Next.js).

## Ryzyka i zależności

- **Brak slug w istniejących Portfolio docs**: Jeśli w bazie są już dokumenty Portfolio bez slug, będą niedostępne przez URL. Admin musi je uzupełnić.
- **`pnpm generate:types` wymagane przed Unit 3**: Bez aktualizacji typów TypeScript nie skompiluje importu `PortfolioProject`.
- **Sekwencja**: Unit 1 → (Unit 2 równolegle) → Unit 3 → Unit 4. Unit 3 i 4 zależą od zaktualizowanych typów.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-06-29-realizacje-podstrony-requirements.md](../dev-brainstorms/2026-06-29-realizacje-podstrony-requirements.md)
- Kolekcja Portfolio: `src/collections/Portfolio.ts`
- SubpageLayout: `src/components/mcraft/SubpageLayout.tsx`
- Helper danych: `src/lib/servicePageData.ts`
- Wzorzec stron: `src/app/(frontend)/meble-premium/page.tsx`
