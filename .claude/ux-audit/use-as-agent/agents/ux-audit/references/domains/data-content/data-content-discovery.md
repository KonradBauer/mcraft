---
type: knowledge
purpose: "Discovery questions and research framework for data content projects"
domain: data-content
topic: discovery
description: Data Content domain discovery — must-ask questions, key assumptions, and common project shapes for data-heavy reports and dashboards.
---
# Data Content: Discovery

Domain knowledge for data-heavy reports, dashboards, and data stories.
Part of: references/domains/data-content/

---

## Must-Ask Discovery Questions

1. **Jaki typ raportu?** Annual report / whitepaper / benchmark / survey results / financial (IR) / ESG-sustainability / dashboard / infographic / data story
2. **Kto jest glownym czytelnikiem?** Executive / analyst / general public / journalist / stakeholder / knowledge worker / auditor
3. **Skad pochodza dane?** Wlasne badania / dane zewnetrzne / mix (wplywa na sekcje metodologii i wiarygodnosci)
4. **Ile danych / jaki wolumen?** 5 kluczowych metryk vs 200 tabel — determinuje gestosc informacji i potrzebe progressive disclosure
5. **Czy raport jest jednorazowy czy cykliczny?** Cykliczny = priorytet reuse szablonow i spojnosci miedzy edycjami
6. **Jaki format docelowy?** Web / PDF / prezentacja — opcjonalne; agent moze rekomendowac po discovery na podstawie typu i odbiorcy
7. **Czy czytelnik ma podazac za narracja, czy sam eksplorowac dane?** Story-First (scrollytelling, guided narrative) / Tool-First (dashboard, filtry, eksploracja) / Hybrid — wyzwala dobor archetypu
8. **Czy raport bedzie osadzany/cytowany w innych miejscach?** Deep-linking, embeddable charts, live vs archived embeds (OWID model)
9. **Czy sa wymogi compliance/regulacyjne?** GRI, SASB, IFRS S1/S2 — wyzwala wzorce ESG, materiality matrix, auditor-friendly navigation

---

## Key Assumptions per Report Type

- **Annual report** — Chapter-based navigation, Executive + Stakeholder readers, web+PDF dual publishing, cykliczny, KPI tiles + trend context, CEO/Board narrative
- **Whitepaper** — Executive Summary front-load, Analyst + Knowledge Worker readers, PDF primary, jednorazowy lub seria, gated landing page pattern
- **Benchmark / survey** — Tool-First or Hybrid, Analyst + Journalist readers, interactive filters + demographic slicers, methodology prominent, web primary
- **ESG / sustainability** — GRI/SASB index navigation, Auditor + Stakeholder readers, materiality matrix, compliance-driven structure, web+PDF, cykliczny
- **Dashboard** — Tool-First, Analyst readers, entity selectors + time sliders, embed/share/download affordances, web only, live data
- **Financial (IR)** — KPI tiles + segment breakdown, Executive + Analyst readers, quarterly trend charts, downloads center, web+PDF, cykliczny
- **Data story / infographic** — Story-First (scrollytelling), General Public + Journalist readers, mobile-first, web primary, jednorazowy

---

## Common Project Shapes

- **Korporacyjny raport roczny** — Chapter-based web + PDF, cykliczny, Executive + Stakeholder, web highlights + gated full PDF, KPI tiles + mixed media
- **Publiczny raport danych (think tank / NGO)** — Hybrid narrative + exploration, General Public + Journalist, OWID-style topic pages, embeddable charts, open access
- **B2B whitepaper z landing page** — PDF primary + teaser web landing, gated, Analyst + Knowledge Worker, 3-5 key findings cards, minimalist lead form
- **ESG / sustainability report** — Compliance-driven, dual web+PDF, Auditor + Stakeholder, interactive materiality matrix, GRI/SASB index, cykliczny
- **Interaktywny data story (redakcyjny)** — Scrollytelling, General Public + Journalist, mobile-first, Story-First archetype, jednorazowy, embeddable

---

## Unique Constraints

- **Dual publishing (web+PDF)** — wiekszosc raportow wymaga obu formatow; web dla zaangazowania, PDF dla audytu/archiwizacji/regulacji. Projektuj web-first, potem adaptuj do PDF.
- **Methodology prominence** — dane bez zrodla tracza wiarygodnosc. Kazdy raport potrzebuje sekcji metodologii (collapsible w web, appendix w PDF).
- **Chart re-authoring per format** — ten sam wykres nie moze byc po prostu przeskalowany. Web = interaktywny (hover, filtry), PDF = statyczny z direct labels, slajdy = uproszczony z jednym akcentem kolorystycznym.
- **Embeddability** — raporty cytowane w mediach potrzebuja stabilnych linkow i embed-ready chartow. Rozroznij live embeds (aktualizowane) vs archived (nigdy sie nie zmienia).
- **Accessibility for data** — tabele jako semantic HTML (nigdy obrazki tabel), aria-labels na chartach, alt-text opisujacy trend/insight a nie "wykres slupkowy".
- **Cyklicznosc** — raporty cykliczne wymagaja spojnych szablonow miedzy edycjami; czytelnik oczekuje tej samej struktury co rok.

### Default Assumptions

If no info provided: annual report type, Executive + Stakeholder readers, web+PDF dual format, cykliczny (roczny), Chapter-based navigation, Story-First with exploration breakouts, no compliance requirements, Polish language, desktop-first traffic.
