# Common Issues

> **[WARSTWA PROJEKTOWA]** Plik wygenerowany dla projektu mcraft. Przy portowaniu warsztatu: zregeneruj przykłady pod stack docelowego projektu; sekcje React 19, Error handling, Race Conditions i TypeScript są uniwersalne.

Częste błędy w projekcie Next.js 16 + React 19 + Payload CMS 3 + Tailwind v4 z przykładami.

---

## Payload CMS

### 1. Publiczne read na wrażliwych danych

**Problem:** `read: () => true` skopiowane bezrefleksyjnie na kolekcję z danymi, które nie powinny być publiczne.
```typescript
// ❌ Źle — dane klientów publicznie czytelne przez REST API
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: { read: () => true }, // /api/inquiries dostępne dla każdego!
  fields: [{ name: 'email', type: 'email' }, { name: 'message', type: 'textarea' }],
}
```
```typescript
// ✅ Dobrze — read tylko dla zalogowanych
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // formularz publiczny może tworzyć
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [/* ... */],
}
```

### 2. Brak `req` w zagnieżdżonych operacjach hooka

**Problem:** operacja Local API w hooku bez `req` wypada z transakcji — przy błędzie częściowy zapis.
```typescript
// ❌ Źle — poza transakcją
hooks: {
  afterChange: [async ({ doc }) => {
    await payload.update({ collection: 'stats', id: doc.statId, data: { count: 1 } })
  }],
}
```
```typescript
// ✅ Dobrze — req przekazany, operacja w tej samej transakcji
hooks: {
  afterChange: [async ({ doc, req }) => {
    await req.payload.update({
      collection: 'stats',
      id: doc.statId,
      data: { count: 1 },
      req,
    })
  }],
}
```

### 3. Nieskończona pętla hooków

**Problem:** afterChange robi update tej samej kolekcji → hook odpala się ponownie → pętla.
```typescript
// ❌ Źle — update wywołuje ten sam hook
afterChange: [async ({ doc, req }) => {
  await req.payload.update({ collection: 'pages', id: doc.id, data: { slug: slugify(doc.title) }, req })
}]
```
```typescript
// ✅ Dobrze — flaga w req.context przerywa pętlę
afterChange: [async ({ doc, req, context }) => {
  if (context.skipSlugSync) return
  await req.payload.update({
    collection: 'pages',
    id: doc.id,
    data: { slug: slugify(doc.title) },
    context: { skipSlugSync: true },
    req,
  })
}]
```

### 4. Ręczna edycja payload-types.ts / brak regeneracji

**Problem:** zmiana schematu bez `pnpm generate:types` → typy kłamią; ręczna edycja → nadpisana przy następnej generacji.
```
// ✅ Procedura po KAŻDEJ zmianie w collections/globals:
pnpm generate:types
// i commit wygenerowanego src/payload-types.ts razem ze schematem
```

### 5. Upload staticDir w public/

**Problem:** pliki upload w `public/` — katalog jest kopiowany przy budowie obrazu Docker jako root i nadpisywany przy każdym deployu. Efekt na prod: "There was a problem while uploading the file" + utrata plików po redeployu.
```typescript
// ❌ Źle
upload: { staticDir: './public/media' }
```
```typescript
// ✅ Dobrze — dedykowany katalog + volume
upload: { staticDir: './documents-media' }
// + docker-compose.yml: volumes: - documents-media:/app/documents-media
// + Dockerfile/entrypoint: mkdir -p + chown nextjs:nodejs
```

### 6. Pole relacji bez obsługi obu kształtów

**Problem:** przy `depth: 0` relacja to string (id), przy `depth: 1+` — obiekt. Kod zakładający jedno crashuje.
```typescript
// ❌ Źle — crash gdy field to string
const url = doc.thumbnail.url

// ✅ Dobrze — helper obsługujący oba kształty (wzorzec projektu: src/lib/mediaUrl.ts)
export function mediaUrl(field: string | Media | null | undefined): string | null {
  if (!field || typeof field === 'string') return null
  return field.url ?? null
}
```

---

## Next.js App Router

### 1. Usunięcie force-dynamic / dodanie revalidate

**Problem:** strony tego projektu MUSZĄ być `force-dynamic` — build w Dockerze nie ma dostępu do MongoDB; SSG/ISR wywali build lub zamrozi treść.
```typescript
// ❌ Źle — build spróbuje prerenderować bez bazy
export const revalidate = 3600

// ✅ Dobrze — konwencja projektu
export const dynamic = 'force-dynamic'
```

### 2. Fetch danych CMS przez HTTP zamiast Local API

**Problem:** server component robi fetch do własnego REST API — zbędny hop sieciowy, problemy z auth i URL w SSR.
```typescript
// ❌ Źle
const res = await fetch('http://localhost:3000/api/service-pages')

// ✅ Dobrze — Payload Local API bezpośrednio
const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'service-pages', depth: 1, limit: 10 })
```

### 3. Client component tam, gdzie wystarczy server

**Problem:** `'use client'` na całej stronie dla jednego przycisku — cała treść wypada z SSR i puchnie bundle.
```typescript
// ❌ Źle — cała sekcja kliencka
'use client'
export function AboutSection({ data }) { /* 200 linii statycznej treści + 1 przycisk */ }

// ✅ Dobrze — wzorzec projektu: server component + interaktywna wyspa
// AboutSection (server) renderuje treść, <ModalTrigger> (client) obsługuje klik
```

### 4. Obraz fill bez sizes

**Problem:** `next/image fill` bez `sizes` = przeglądarka pobiera obraz w 100vw nawet dla miniatury.
```tsx
// ❌ Źle
<Image src={url} alt={title} fill className="object-cover" />

// ✅ Dobrze — sizes odpowiada siatce (3 kolumny → 33vw desktop)
<Image src={url} alt={title} fill sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw" className="object-cover" />
```

### 5. Hydration mismatch

**Problem:** wartości różne między serwerem a klientem w pierwszym renderze.
```tsx
// ❌ Źle — Date.now()/window w renderze
<span>{new Date().toLocaleString()}</span>
{typeof window !== 'undefined' && <Widget />}

// ✅ Dobrze — efekt po mount albo wartość z serwera jako prop
const [now, setNow] = useState<string | null>(null)
useEffect(() => setNow(new Date().toLocaleString()), [])
```

---

## React 19

### 1. Używanie forwardRef (przestarzałe)

```typescript
// ❌ Źle — niepotrzebne forwardRef
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => <input ref={ref} {...props} />)

// ✅ Dobrze — ref jako zwykły prop
function Input({ ref, ...props }: InputProps & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

### 2. Context.Provider (przestarzałe)

```tsx
// ❌ Źle
<ModalContext.Provider value={ctx}>{children}</ModalContext.Provider>

// ✅ Dobrze — React 19
<ModalContext value={ctx}>{children}</ModalContext>
```

### 3. Fetch w useEffect w client component

**Problem:** w tym projekcie dane CMS przychodzą z server components jako props. Fetch w useEffect = drugi render, brak SSR treści, race conditions.
```tsx
// ❌ Źle — client component sam fetchuje
'use client'
function Tiles() {
  const [tiles, setTiles] = useState([])
  useEffect(() => { fetch('/api/stat-tiles').then(r => r.json()).then(d => setTiles(d.docs)) }, [])
}

// ✅ Dobrze — server component fetchuje, client dostaje props
// page.tsx (server): const tiles = await payload.find({ collection: 'stat-tiles', sort: 'order' })
// <TilesMarquee tiles={tiles.docs} />
```

---

## Error handling

### 1. Pusty catch

```typescript
// ❌ Źle — błąd znika bez śladu
try { await syncData() } catch (e) {}

// ❌ Źle — console.log zamiast structured
try { await syncData() } catch (e) { console.log(e) }

// ✅ Dobrze — loguj z kontekstem albo re-throw
try {
  await syncData()
} catch (e) {
  payload.logger.error({ err: e, context: 'syncData' }, 'Sync failed')
  throw e // jeśli caller powinien wiedzieć
}
```

### 2. String zamiast typed error

```typescript
// ❌ Źle
throw 'coś poszło nie tak'

// ✅ Dobrze
throw new Error(`Service page not found: ${slug}`)
// lub dedykowana klasa AppError przy rozbudowanej obsłudze
```

### 3. Niespójny format odpowiedzi API

```typescript
// ✅ Konwencja projektu dla route handlers: { data, error: { code, message } }
return Response.json({ data: null, error: { code: 'NOT_FOUND', message: 'Raport nie istnieje' } }, { status: 404 })
```

---

## Race Conditions w React

### 1. useEffect bez cleanup (brak AbortController)

```typescript
// ❌ Źle — state update po odmontowaniu
useEffect(() => {
  fetch(`/api/search?q=${query}`).then(r => r.json()).then(setResults)
}, [query])

// ✅ Dobrze
useEffect(() => {
  const controller = new AbortController()
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults)
    .catch(err => { if (err.name !== 'AbortError') throw err })
  return () => controller.abort()
}, [query])
```

### 2. setTimeout/setInterval bez cleanup

```typescript
// ❌ Źle — timer żyje po odmontowaniu
useEffect(() => { setInterval(() => setCount(c => c + 1), 1000) }, [])

// ✅ Dobrze
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000)
  return () => clearInterval(id)
}, [])
```

### 3. Wiele booleanów zamiast state machine

```typescript
// ❌ Źle — 8 kombinacji, większość nieprawidłowa
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState(false)
const [isSuccess, setIsSuccess] = useState(false)

// ✅ Dobrze — discriminated union
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }
```

### 4. Brak guardu na wykluczające się operacje

```typescript
// ❌ Źle — 5 kliknięć = 5 równoległych requestów, ostatni wygrywa losowo
async function handleLoad() {
  setIsLoading(true)
  setData(await fetchData())
  setIsLoading(false)
}

// ✅ Dobrze — guard
const [status, setStatus] = useState<'idle' | 'loading'>('idle')
async function handleLoad() {
  if (status === 'loading') return
  setStatus('loading')
  try { setData(await fetchData()) } finally { setStatus('idle') }
}
```

---

## Performance

### 1. N+1 query w pętli

```typescript
// ❌ Źle — 100 id = 100 zapytań
for (const id of projectIds) {
  const { docs } = await payload.find({ collection: 'portfolio-projects', where: { id: { equals: id } } })
}

// ✅ Dobrze — jedno zapytanie
const { docs } = await payload.find({
  collection: 'portfolio-projects',
  where: { id: { in: projectIds } },
  limit: projectIds.length,
})
```

### 2. Brak limitu / pełna kolekcja

```typescript
// ❌ Źle — domyślny limit może nie wystarczyć albo pobiera za dużo
await payload.find({ collection: 'portfolio-projects' })

// ✅ Dobrze — jawny limit + sort + tylko potrzebna głębokość
await payload.find({ collection: 'portfolio-projects', where: { servicePage: { equals: id } }, sort: 'order', depth: 1, limit: 100 })
```

### 3. Brak lazy loading dla ciężkich komponentów klienckich

```typescript
// ❌ Źle — galeria/lightbox w initial bundle
import { RealizacjaGaleria } from '@/components/mcraft/RealizacjaGaleria'

// ✅ Dobrze — dynamic import dla komponentów > 50KB
const RealizacjaGaleria = dynamic(() => import('@/components/mcraft/RealizacjaGaleria'), {
  loading: () => <GallerySkeleton />,
})
```

---

## TypeScript

### 1. Używanie `any`

```typescript
// ❌ Źle
function render(data: any) { return data.value.nested }

// ✅ Dobrze — typ z payload-types albo unknown + guard
import type { ServicePage } from '@/payload-types'
function render(page: ServicePage) { return page.title }
```

### 2. Brak typów dla props

```typescript
// ❌ Źle
function Tile({ tile, onClick, active }) {}

// ✅ Dobrze
interface TileProps {
  tile: StatTile
  onClick?: (id: string) => void
  active?: boolean
}
function Tile({ tile, onClick, active = false }: TileProps) {}
```

### 3. Non-null assertion bez uzasadnienia

```typescript
// ❌ Źle — crash gdy brak
const page = docs.find(d => d.slug === slug)!

// ✅ Dobrze — jawna obsługa (w tym projekcie: fallback content)
const page = docs.find(d => d.slug === slug)
if (!page) return <SubpageLayout {...FALLBACK} />
```

---

## Tailwind CSS 4

### 1. Hex inline zamiast tokenu z @theme

```tsx
// ❌ Źle — kolor istnieje jako token
<div className="bg-[#0e1a17] text-[#f3ece0]" />

// ✅ Dobrze — tokeny projektu
<div className="bg-ink text-cream" />
```

> **Uwaga:** arbitrary values dla SPACINGU i BREAKPOINTÓW (`px-[56px]`, `max-[980px]:hidden`) są konwencją tego projektu — nie flaguj ich. Flaguj tylko hardcoded kolory omijające tokeny.

### 2. Przestarzałe klasy v3

```tsx
// ❌ Źle — usunięte w v4
<div className="bg-opacity-50" />

// ✅ Dobrze — slash notation
<div className="bg-black/50" />
```

### 3. Em dash w treści UI

```tsx
// ❌ Źle — konwencja projektu zakazuje em dashy w treściach
<p>Nadzór spawalniczy — kompleksowa obsługa</p>

// ✅ Dobrze
<p>Nadzór spawalniczy - kompleksowa obsługa</p>
```

---

## Testy

### 1. Test bez asercji

```typescript
// ❌ Źle — coverage rośnie, weryfikacja zero
it('creates service page', async () => {
  await payload.create({ collection: 'service-pages', data: validData })
})

// ✅ Dobrze
it('creates service page', async () => {
  const doc = await payload.create({ collection: 'service-pages', data: validData })
  expect(doc.slug).toBe(validData.slug)
})
```

### 2. Mockowanie testowanego kodu

```typescript
// ❌ Źle — test mockuje to, co ma testować
vi.mock('@/lib/servicePageData')

// ✅ Dobrze — mockuj tylko zewnętrzne serwisy; testy integracyjne tego projektu używają realnego MongoDB
```
