# Playbooki napraw per metryka CWV

Przyczyny posortowane od najczęstszych. Dla każdej: jak potwierdzić (dowód) i jak naprawić. Fixe konkretyzuj pod stack projektu (wykryty w CLAUDE.md/package.json).

---

## LCP (Largest Contentful Paint) — cel ≤ 2.5 s

Najpierw ustal ELEMENT LCP: Lighthouse audit `lcp-element` (lub PSI → lighthouseResult.audits["largest-contentful-paint-element"]). Dalsza diagnoza zależy od typu elementu.

### LCP = obraz

1. **Obraz ładowany leniwie / bez priorytetu**
   - Dowód: audit `prioritize-lcp-image`; w kodzie `loading="lazy"` na hero lub brak priorytetu
   - Fix: Next.js → `<Image priority>`; HTML → `fetchpriority="high"` + usuń `loading="lazy"` z elementu LCP; rozważ `<link rel="preload" as="image">`
2. **Obraz za duży / zły format**
   - Dowód: audits `uses-responsive-images`, `modern-image-formats`, `uses-optimized-images` (savings w KB)
   - Fix: WebP/AVIF; poprawny `sizes` na fill/responsive images (nie domyślne 100vw dla mniejszych slotów); przeskaluj źródło do realnych wymiarów renderowania
3. **Obraz z wolnego źródła** (CMS bez cache, zewnętrzny host)
   - Dowód: waterfall — długi czas do pierwszego bajta obrazu
   - Fix: cache headers na endpoint mediów; CDN; w Next: upewnij się że optymalizacja obrazów działa dla tej ścieżki (localPatterns/remotePatterns)
4. **Obraz w tle CSS** (background-image nie jest priorytetyzowany)
   - Fix: zamień na `<img>`/`<Image>` z priority, pozycjonowany absolutnie, jeśli to element LCP

### LCP = tekst/blok

5. **Wolny TTFB ciągnie wszystko** (TTFB > 800 ms)
   - Dowód: audit `server-response-time`; field TTFB
   - Fix: patrz sekcja TTFB niżej
6. **Render-blocking CSS/JS**
   - Dowód: audit `render-blocking-resources` (lista plików + savings)
   - Fix: usuń nieużywane style z krytycznej ścieżki; defer zewnętrznych skryptów; font-display (niżej)
7. **Web fonty blokują render tekstu**
   - Dowód: audit `font-display`; FOIT w filmstrip
   - Fix: `font-display: swap` (next/font robi to domyślnie — sprawdź `display: 'swap'`); preload kluczowego fontu; subset (np. latin-ext zamiast pełnego)
8. **Client-side rendering treści LCP** (spinner/skeleton jako pierwszy paint, treść po hydracji i fetchu)
   - Dowód: element LCP pojawia się późno w filmstrip; treść fetchowana w useEffect
   - Fix: przenieś fetch do server component / SSR; treść LCP musi być w initial HTML

### TTFB (składowa LCP)

9. **Zimny start / brak cache odpowiedzi**
   - Fix: cache na poziomie odpowiedzi (ISR/revalidate — UWAGA: tylko za zgodą usera, jeśli projekt ma force-dynamic z powodu builda bez dostępu do CMS; alternatywa: cache w warstwie proxy/CDN przed appką)
10. **Wolne zapytania do bazy/CMS na ścieżce renderu**
    - Dowód: profiluj czas renderu strony (logi serwera); N+1 w kodzie strony
    - Fix: batch zapytań (Promise.all — wzorzec: wszystkie findGlobal/find równolegle, nie sekwencyjnie), świadomy depth/populate, limit
11. **Brak kompresji / HTTP1**
    - Dowód: nagłówki odpowiedzi (curl -I): brak content-encoding br/gzip
    - Fix: włącz kompresję na proxy (Coolify/nginx/traefik zwykle mają — sprawdź konfig)

---

## INP (Interaction to Next Paint) — cel ≤ 200 ms
(w lab proxy: TBT — Total Blocking Time; INP mierzalny tylko w field/RUM)

1. **Ciężka hydracja / za dużo JS na starcie**
   - Dowód: audits `bootup-time`, `mainthread-work-breakdown`, `unused-javascript` (savings)
   - Fix: dynamic import ciężkich komponentów klienckich (>50KB); zawęź `'use client'` do realnych wysp; usuń nieużywane zależności z bundla
2. **Długie taski w handlerach interakcji**
   - Dowód: `mainthread-work-breakdown`; w kodzie: synchroniczna ciężka praca w onClick/onChange
   - Fix: rozbij pracę (startTransition, requestIdleCallback, debounce inputów); wynieś obliczenia poza handler; memoizuj drogie renderowanie poddrzew
3. **Third-party skrypty blokują main thread**
   - Dowód: audit `third-party-summary` (czas per domena)
   - Fix: lazy-load po interakcji/idle (next/script strategy="lazyOnload"); usuń zbędne; facade dla embedów (YouTube itd.)
4. **Re-render całego drzewa na każdą interakcję**
   - Dowód: React DevTools profiler; stan globalny zmieniany na keystroke
   - Fix: kolokacja stanu w dół; podział kontekstów; memo granic poddrzew
5. **Animacje na właściwościach layoutu**
   - Dowód: animacje width/height/top/left w CSS/JS
   - Fix: transform/opacity only; `will-change` oszczędnie

---

## CLS (Cumulative Layout Shift) — cel ≤ 0.1

Najpierw ustal PRZESUWAJĄCE SIĘ ELEMENTY: audit `layout-shift-elements` / `layout-shifts`. Wizualna weryfikacja: agent-browser — screenshot tuż po otwarciu vs po networkidle, porównaj.

1. **Obrazy/iframe bez zarezerwowanych wymiarów**
   - Dowód: audit `unsized-images`; w kodzie img bez width/height ani aspect-ratio
   - Fix: width+height albo CSS aspect-ratio; Next `<Image>` z wymiarami lub fill w kontenerze o stałych proporcjach
2. **Web fonty zmieniają metryki tekstu** (FOUT shift)
   - Dowód: shift w momencie załadowania fontu (filmstrip)
   - Fix: `size-adjust`/`fallback` w @font-face (next/font robi automatycznie — `adjustFontFallback`); preload fontu
3. **Treść wstrzykiwana nad istniejącą** (banery, komunikaty, wyniki fetchu)
   - Dowód: layout-shift-elements wskazuje kontener pojawiający się po load
   - Fix: zarezerwuj miejsce (min-height/skeleton o docelowych wymiarach); nowa treść poniżej viewportu albo overlay (position: fixed/absolute)
4. **Skeleton o innych wymiarach niż finalna treść**
   - Fix: skeleton 1:1 z docelowym layoutem (te same wysokości/proporcje)
5. **Animacje wejścia zmieniające layout**
   - Fix: animuj transform/opacity, nie height/margin; dla akordeonów grid-template-rows 0fr→1fr lub content-visibility
6. **Reklamy/embedy o nieznanej wysokości**
   - Fix: stały slot min-height wg najczęstszego rozmiaru

---

## Kolejność napraw (heurystyka największego zysku)

1. Element LCP: priorytet + rozmiar/format obrazu (zwykle największy pojedynczy zysk, mały koszt)
2. CLS: wymiary obrazów + rezerwacja miejsca (tanie, pewne)
3. TTFB: równoległość zapytań na ścieżce renderu
4. INP/TBT: dynamic import najcięższych wysp klienckich
5. Fonty: display/swap + preload + subset
6. Third-party: lazy/facade
7. Reszta wg "savings" z Lighthouse

## Opcjonalny hardening: RUM

Field data bez czekania na CrUX: pakiet `web-vitals` (attribution build) → raportowanie LCP/INP/CLS z realnych sesji do własnego endpointu/analytics. Proponuj TYLKO gdy projekt ma gdzie zbierać (analytics/endpoint) i user chce — to nowa zależność (wymaga zgody).
