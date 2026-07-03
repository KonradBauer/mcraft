# CWV Audit — homepage (http://157.173.96.140:9192/)
**Data:** 2026-07-02 | **Tryb:** PROD (IP, brak domeny) — field data niedostępna (PSI quota exceeded, brak API key)

## Wyniki baseline (lab, prod IP)

| Metryka | Lab mobile | Lab desktop | Status |
|---|---|---|---|
| Perf score | 64 | 96 | 🔴 / 🟢 |
| LCP | 8.5 s | 1.2 s | 🔴 / 🟢 |
| CLS | 0 | 0.002 | 🟢 / 🟢 |
| TBT (proxy INP) | 90 ms | 0 ms | 🟢 / 🟢 |
| TTFB | 210 ms | 320 ms | 🟢 / 🟢 |
| Total byte weight | 1171 KiB | 1126 KiB | ok |

Uwaga: field data (CrUX) niedostępna — PSI API zwróciło 429 quota exceeded (limit dzienny 0 bez klucza). Ocena wyłącznie na lab.

## Diagnozy

### 🔴 LCP mobile — oversized hero person photo (`hero-michal.png`)
- Dowód: `image-delivery-insight` — element LCP (`<img>` w `HomeContent.tsx:120`) pobierał wariant 828×1242 px przy realnym wyświetlanym rozmiarze ~537×805 px (DPR-adjusted). 76.9 KB / 58% requestu zmarnowane.
- Przyczyna: `<Image>` bez propu `sizes`, z intrinsic `width={390} height={620}` niezmiennym mimo CSS `max-[980px]:h-[460px]` (mobile renderuje węższy obraz niż intrinsic sugeruje next/image przy generowaniu srcset).
- Plik: `src/components/mcraft/HomeContent.tsx:120-127`
- Szacowany zysk wg Lighthouse: LCP -350 ms

### 🟡 Render-blocking CSS (Tailwind chunks)
- Dowód: `render-blocking-insight` — 2 chunki CSS (15.8 KB + 2.2 KB) blokujące render, ~771ms łącznie.
- Przyczyna: domyślne chunkowanie CSS przez Next/Turbopack.
- Nie naprawiane w tym przebiegu — wymagałoby ingerencji w build pipeline (duża zmiana wg reguł skilla, poza zakresem bez zgody usera).

### Informacyjne
- `lcp-discovery-insight`: `fetchpriority=high` nieobecny na tagu `<img>` mimo propu `priority` — ale request i tak realizowany z `priority: High` w sieci (prawdopodobnie przez auto-preload w `<head>`). Brak akcji.
- Wszystkie hero obrazy potwierdzone jako `image/webp` w response (konwersja next/image + sharp działa poprawnie).

## Naprawa zastosowana

**Fix:** dodano `sizes="(max-width: 980px) 290px, 390px"` do `<Image>` person photo (`HomeContent.tsx:120-127`), dopasowane do realnej szerokości renderowanej na mobile (aspect ratio 390/620 × wysokość 460px ≈ 289px).

**Metoda re-pomiaru:** brak dostępu do redeployu prod IP w tej sesji → kontrolowany test A/B lokalnie: `pnpm build` + `pnpm start` (production build, lokalny Mongo), Lighthouse mobile `localhost:3100`, ten sam stan CMS/DB dla obu przebiegów (git stash / stash pop na fixie), by odizolować wyłącznie efekt zmiany.

## Przed / po (local prod build, mobile lab — proxy dla prod)

| Metryka | Przed | Po |
|---|---|---|
| Perf score | 81 | 83 |
| LCP | 5.2 s | 4.7 s (-500 ms) |
| CLS | 0.009 | 0 |
| TBT | 46 ms | 33 ms |
| Waste person photo | 76.8 KB | 21.7 KB (-72%) |

Uwaga: bezwzględne liczby lokalne różnią się od prod IP (inna latencja sieci, lokalny fallback `hero-tlo.png` zamiast CMS webp), ale efekt fixu (delta) jest wiarygodny — obie strony testu na identycznym stanie poza samą zmianą.

**Wymaga weryfikacji na prod po deployu.**

## Status
- [x] LCP mobile — oversized image → naprawione, potwierdzone lokalnie
- [ ] Render-blocking CSS — nieobjęte (wymaga zgody na większą zmianę)
- [ ] Field data (CrUX) — do sprawdzenia po ~28 dniach na prod, lub przez PSI z kluczem API
