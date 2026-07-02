---
name: cwv
description: "Audyt i naprawa Core Web Vitals (LCP, INP, CLS). Mierzy field data (CrUX przez PageSpeed Insights) i lab data (Lighthouse), diagnozuje przyczyny per metryka, naprawia wg playbooków i weryfikuje przed/po. Używaj przy: core web vitals, cwv, lighthouse, pagespeed, LCP, CLS, INP, wolna strona, page speed, wydajność ładowania."
argument-hint: "[URL lub ścieżka strony, np. https://example.com albo /podstrona] [opcjonalnie: audit|fix]"
---

# CWV — audyt i naprawa Core Web Vitals

Dwie fazy: **AUDYT** (pomiar → diagnoza → raport) i **NAPRAWA** (fix wg playbooków → re-pomiar → tabela przed/po). Domyślnie audyt; `fix` w argumencie lub istniejący świeży raport → przejdź do naprawy.

## Progi (Google, stan 2026 — INP zastąpił FID w 2024)

| Metryka | Dobry | Wymaga poprawy | Słaby |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| TTFB (diagnostyczny) | ≤ 800 ms | — | — |
| FCP (diagnostyczny) | ≤ 1.8 s | — | — |

Ocena "przechodzi" = 75. percentyl field data w zielonym. Lab data służy diagnozie, field data ocenie.

## Twarde reguły

1. **Pomiar przed opinią.** Zero rekomendacji bez liczb z narzędzia. Kolejność zaufania: field (CrUX) > lab (Lighthouse) > inspekcja kodu.
2. **Mobile first.** Domyślna strategia pomiaru: mobile (tam CWV zwykle failuje). Desktop jako uzupełnienie.
3. **Jedna naprawa → re-pomiar.** Nie wrzucaj 5 fixów naraz — nie wiadomo, co zadziałało (jak w /bugfix).
4. **Naprawa nie może łamać konwencji projektu** (CLAUDE.md) — np. zakaz zmiany `force-dynamic` na SSG bez zgody usera, bo build może nie mieć dostępu do CMS.
5. Raporty do `docs/audits/` (gitignore'owane wg konwencji warsztatu).

## FAZA A: AUDYT

### A1. Ustal cel pomiaru

- Argument = pełny URL produkcyjny → tryb PROD (field + lab przez PSI).
- Argument = ścieżka (`/podstrona`) lub brak → wykryj URL dev (CLAUDE.md; package.json: next→:3000, vite→:5173) → tryb LOCAL (tylko lab, lokalny Lighthouse). Zaproponuj też pomiar produkcji, jeśli URL prod znany (CLAUDE.md/metadata).
- Brak argumentu → audytuj stronę główną + zapytaj czy dodać kluczowe podstrony (max 3-5 na przebieg).

### A2. Pomiar

**Tryb PROD — PageSpeed Insights API** (bez klucza, limit ~kilka zapytań/min; klucz `PSI_API_KEY` w env → dopisz `&key=`):

```bash
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<URL>&strategy=mobile&category=performance" -o psi-mobile.json
```

Wyciągnij (jq/node):
- Field: `loadingExperience.metrics` → LARGEST_CONTENTFUL_PAINT_MS, INTERACTION_TO_NEXT_PAINT, CUMULATIVE_LAYOUT_SHIFT_SCORE (percentile + category). Brak `loadingExperience` = za mało ruchu na CrUX → oceniaj po lab, odnotuj w raporcie.
- Lab: `lighthouseResult.audits` → `largest-contentful-paint`, `cumulative-layout-shift`, `total-blocking-time` (proxy INP w lab), `server-response-time`, oraz szczegóły diagnoz: `lcp-element`, `layout-shifts`/`layout-shift-elements`, `render-blocking-resources`, `unused-javascript`, `uses-responsive-images`, `prioritize-lcp-image`, `font-display`, `mainthread-work-breakdown`, `bootup-time`, `third-party-summary`.

Powtórz ze `strategy=desktop`.

**Tryb LOCAL — Lighthouse CLI** (wymaga Chrome; PSI nie dosięgnie localhost):

```bash
npx --yes lighthouse <URL> --only-categories=performance --form-factor=mobile \
  --screenEmulation.mobile --throttling-method=simulate --output=json \
  --output-path=./lh-mobile.json --chrome-flags="--headless=new" --quiet
```

Serwer dev nie działa → uruchom wg Commands z CLAUDE.md, poczekaj na ready. Lighthouse padnie (brak Chrome) → odnotuj, fallback: inspekcja kodu wg playbooków + agent-browser do obserwacji (screenshoty ładowania, layout shift wizualnie).

**Uwaga LOCAL:** dev build (HMR, brak minifikacji) zawyża metryki — traktuj wyniki RELATYWNIE (co jest największym problemem), nie absolutnie; do oceny absolutnej mierz produkcję lub `build+start` lokalnie.

### A3. Diagnoza per failująca metryka

Dla każdej metryki poza zielonym: otwórz playbook `resources/metric-playbooks.md` (sekcja metryki), przejdź listę przyczyn od góry, dla każdej sprawdź dowód w danych Lighthouse ORAZ w kodzie repo (Grep/Read). Wynik diagnozy = lista [przyczyna → dowód → plik:linia jeśli dotyczy].

### A4. Raport

Zapisz `docs/audits/YYYY-MM-DD-cwv-<host-lub-strona>.md`:

```markdown
# CWV Audit — <URL>
**Data:** RRRR-MM-DD | **Tryb:** PROD/LOCAL

## Wyniki
| Metryka | Field (p75) | Lab mobile | Lab desktop | Status |
|---|---|---|---|---|
| LCP | ... | ... | ... | 🟢/🟡/🔴 |
| INP | ... | TBT: ... | ... | 🟢/🟡/🔴 |
| CLS | ... | ... | ... | 🟢/🟡/🔴 |
| TTFB | ... | ... | ... | diag |

## Diagnozy (posortowane wg wpływu)
### 🔴 [metryka] — [przyczyna]
- Dowód: [liczba z Lighthouse / element LCP / plik:linia]
- Naprawa: [z playbooka, skonkretyzowana pod repo]
- Szacowany zysk: [z audytu Lighthouse "savings" gdy dostępny]

## Plan naprawy (kolejność)
1. [największy zysk / najmniejszy koszt najpierw]
```

Wyświetl podsumowanie + AskUserQuestion: [Napraw teraz (Faza B)] [Tylko raport — koniec] [Przekaż do /dev-plan (przy zmianach cross-cutting)].

## FAZA B: NAPRAWA

### B1. Baseline

Zachowaj wyniki z Fazy A jako baseline (już w raporcie). Brak świeżego raportu (>7 dni lub zmiany w repo od pomiaru) → powtórz Fazę A.

### B2. Pętla naprawcza (per pozycja planu, od góry)

1. Zastosuj naprawę wg playbooka — konkretny fix w kodzie, zgodny z konwencjami projektu.
2. Typecheck + testy projektu (komendy z CLAUDE.md) — fix CWV nie może psuć funkcji.
3. **Re-pomiar** tej samej metody co baseline (LOCAL: ten sam tryb lighthouse; PROD: uwaga — zmiany widać dopiero po deployu, mierz lokalnie lab jako proxy i odnotuj "wymaga weryfikacji na prod po deployu").
4. Metryka poprawiona → commit `perf(cwv): [co naprawiono]`, odhacz pozycję w raporcie, następna pozycja.
5. Metryka bez zmian/gorzej → revert fixa, odnotuj w raporcie "[przyczyna odrzucona — brak efektu]", następna hipoteza z playbooka. Max 2 nieudane próby per metryka → zostaw z adnotacją, idź dalej.
6. Duża zmiana (SSG/ISR, wymiana biblioteki, przebudowa layoutu) → NIE rób w tej pętli; zaproponuj `/dev-plan`.

### B3. Zamknięcie

Dopisz do raportu tabelę PRZED/PO (baseline vs finalne liczby, per metryka) + listę commitów. Field data na prod → przypomnij: efekt w CrUX widoczny po ~28 dniach zbierania.

Nietrywialny problem rozwiązany → zaproponuj `/dev-compound` (kategoria `performance-issues`).

## Anty-wzorce — NIGDY

- Nie rekomenduj bez pomiaru ("na oko za wolno").
- Nie deklaruj naprawy bez re-pomiaru tej samej metody.
- Nie mieszaj wielu fixów przed re-pomiarem.
- Nie porównuj lab dev-builda z field produkcji.
- Nie zmieniaj strategii renderowania (force-dynamic→SSG) ani nie dodawaj zależności bez zgody usera.
- Nie optymalizuj metryk już zielonych kosztem złożoności.

## Playbooki napraw

Szczegółowe przyczyny i fixe per metryka: `resources/metric-playbooks.md` — czytaj sekcję failującej metryki podczas A3/B2.
