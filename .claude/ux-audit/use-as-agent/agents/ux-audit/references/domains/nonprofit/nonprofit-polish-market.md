---
type: knowledge
purpose: "Polish market context and localization for nonprofit projects"
---
<!-- Nonprofit: Polish Market & Localization — loaded with nonprofit domain -->

# Nonprofit: Polish Market & Localization

Domain knowledge for Polish nonprofit UX specifics — regulations, donor behavior, payment platforms, and compliance workflows.
Part of: references/domains/nonprofit/
Depends on: shared/localization-pl.md (for general Polish payment hierarchy, trust signals, formatting, tone)

---

## Polish Nonprofit Ecosystem & Capacity

**OPP vs non-OPP distinction:**
- OPP (Organizacja Pozytku Publicznego) = eligible to receive 1.5% PIT tax allocation. Requires appearing on the official Wykaz OPP published by NIW-CRSO and fulfilling annual reporting obligations.
- Non-OPP organizations cannot receive 1.5% PIT. Their donation UX omits the entire 1.5% flow and focuses on direct giving only.
- **UX rule:** Always confirm OPP status in discovery. It determines whether the 1.5% PIT module exists at all.

**Digital maturity reality:**
- ~70% of Polish NGOs operate on annual budgets under 100,000 PLN with 0-2 paid staff
- Default platform: WordPress with plugins or simple static sites with embedded donation widgets
- Recommend turnkey tools (Wplacam embed, payment operator plugins) over custom builds
- Treat ngo.pl/Klon/Jawor patterns as the baseline for what most Polish NGOs can realistically implement
- Only recommend "enterprise-grade UX" when the organization demonstrably has capacity

**CMS implication:** WordPress dominance means wireframes must account for plugin-based donation forms (Wplacam iframe, FaniMani plugin) rather than custom components. Design within widget constraints.

---

## Online Donation Platforms & Payment Integration

### Platform Comparison

| Platform | Model | Fees | Recurring | Best For |
|---|---|---|---|---|
| **Wplacam (ngo.pl)** | iframe embed on NGO site; PayU as operator | 1.6% one-off, 2.2% recurring | Yes | "Donate on our site" with low overhead; sector standard |
| **Siepomaga** | External campaign page (redirect) | 6% to Fundacja Siepomaga | Limited | Specific beneficiary stories, urgent medical fundraising |
| **Zrzutka.pl** | External campaign page | 0% mandatory; default 20% voluntary tip | No | Peer-to-peer campaigns, viral sharing |
| **Patronite** | External patronage page | 6.5% + VAT (~8%) + operator | Yes (core feature) | Monthly community/creator-style support |
| **FaniMani / Skarbonki** | WordPress plugin; affiliate shopping | 1.49% (Skarbonki fast payment) | No | Passive fundraising without direct asks |
| **Donateo** | Terminals, e-skarbonka, embedded | Varies | No | Impulse micro-donations at events/retail |
| **Direct (Przelewy24/PayU)** | Redirect from NGO site | Contract-dependent; NGO programs available | Depends on integration | Organizations with technical capacity |

**PayU Dobro** offers preferential NGO rates (~1% vs standard 1.5-2.5%). Przelewy24 and TPay also offer NGO pricing — advise clients to inquire directly.

### Platform Decision Logic

- Primary product = specific beneficiary / urgent medical → Siepomaga (or Zrzutka for peer-to-peer reach)
- Goal = "donate on our site" with professional baseline → Wplacam
- Goal = recurring monthly with community identity → Patronite
- Goal = passive fundraising without direct asks → FaniMani
- Goal = event/retail impulse giving → Donateo + BLIK

### Integration Patterns

**Embedded (iframe):** Wplacam. Best trust continuity, limited styling. **Redirect:** Przelewy24, PayU. Domain handoff — requires trust bridge. **External page:** Siepomaga, Zrzutka, Patronite. Full domain change, highest trust gap.

**Trust bridge (mandatory for redirect/external):** Pre-handoff message explaining redirect, show NGO legal identity and donation purpose, warn that bank statement may show operator name instead of NGO, provide NGO-branded confirmation email after completion.

### BLIK for Nonprofit Donations

BLIK flow: select BLIK, enter 6-digit code from banking app, confirm in app. No redirect with PayU/Przelewy24 BLIK integration — inline code entry, under 30 seconds. BLIK OneClick (registered): one-tap recurring without code — growing but not universal.

**Design rule:** BLIK must be first payment option on any Polish nonprofit donation form. For 55+ donors, keep traditional przelew visible as fallback.

---

## OPP & 1.5% PIT Mechanism

### How It Works

Any Polish taxpayer filing PIT can designate 1.5% of their tax due to any OPP on the official list. The taxpayer pays nothing extra — the 1.5% comes from tax already owed. This is the single most important messaging point: "It costs you nothing. The state gives YOUR tax to the cause YOU choose."

The taxpayer enters two fields in their PIT form:
1. **KRS number** of the chosen OPP (required)
2. **Cel szczegolowy** — free text, up to 80 characters (optional; used for subaccount tracking, e.g., supporting a specific child/program)

**Twoj e-PIT auto-fill:** Pre-fills previous year's OPP if still eligible. ~90% participation, ~5-10% switching rate. Existing OPPs: retention game. New/small OPPs: must drive "default disruption" — actively convince people to change.

### Scale

Total transferred (PIT 2024): ~2.28 billion PLN from ~16.3 million taxpayers (~140 PLN average). Top 20 OPPs receive disproportionate share; long tail under 10,000 PLN. For most OPPs, 1.5% eclipses year-round donations.

### Campaign Calendar

| Period | Donor Mindset | Site Behavior |
|---|---|---|
| **Mid-Feb to Apr 30** (peak filing) | "I'm filing now, make it easy" | Site-wide banner + sticky PIT module; KRS copy button; shortest instructions |
| **Last 2 weeks of April** | Last-minute filers; urgency | Countdown: "Only X days left to designate your 1.5%" |
| **May-Sep** | Low PIT intent | Shift hero to year-round giving; keep 1.5% in nav/footer |
| **Oct-Dec** | Pre-season | Collect emails; publish impact report; "remember us in spring" |

PIT filing deadline: April 30. Twoj e-PIT opens: mid-February. If taxpayer does nothing, Twoj e-PIT auto-accepts on April 30 — meaning people who want to CHANGE their OPP must act before deadline.

### 1.5% PIT Landing Page Pattern

```
HERO: "Przekaz 1,5% podatku" — large, above fold

BLOCK 1 — ESSENTIAL DATA (most prominent)
  KRS: [number] [COPY BUTTON]
  Cel szczegolowy: [text] [COPY BUTTON]

BLOCK 2 — HOW TO (collapsible, 3 steps)
  Step 1: Zaloguj sie do Twoj e-PIT (podatki.gov.pl)
  Step 2: Wpisz nasz KRS: [number]
  Step 3: Zatwierdz zeznanie
  [Simple diagram or annotated screenshot]

BLOCK 3 — WHY US (brief impact)
  "W [year] dzieki 1,5% podatku [concrete impact statement]"

BLOCK 4 — TRUST (footer-level)
  Official Wykaz OPP link, OPP status confirmation
```

**Content tone:** Procedural and minimal. PIT users are in task mode, not emotional giving mode.

**KRS shareability:** Include a "Share KRS" button generating pre-formatted message: "Przekaz 1,5% podatku na [Org Name]. KRS: [number]. Wpisz w Twoj e-PIT!" Optimize page for "[org name] 1.5%" and KRS number searches.

**QR code pattern:** Generate QR linking to Twoj e-PIT — effective for offline-to-online conversion (posters, events, printed materials).

**Critical: Do not position 1.5% PIT as competing with direct donations.** These are separate mental models — 1.5% costs the donor nothing, direct donations cost real money. Present as separate paths, never either/or.

---

## RODO/GDPR & Beneficiary Imagery

Polish nonprofit storytelling triggers dual legal regimes: RODO (GDPR) for personal data AND Art. 81 Ustawa o prawie autorskim (image dissemination rights). Both must be satisfied.

### 6-Step Consent Workflow

**Step 1 — Intake:** Collect minimal narrative. Decide if identity is required. If not, use anonymized storytelling and skip to Step 4.

**Step 2 — Risk Classification:** (A) Non-sensitive: no health/disability data. (B) Sensitive non-identifying: health data without identifiable image. (C) Sensitive + identifying: health data + face/name — highest risk, requires Art. 9 explicit consent.

**Step 3 — Consent Package** (B and C): Granular consents per channel (www, FB, IG, print, PR), content type, time limits, revocation process. Single "I agree" checkbox is inadequate. Classification C: Art. 9 explicit consent — separately signable, mentioning specific health data. **Children:** Guardian consent required regardless of age; child assent where feasible.

**Step 4 — Asset Processing:** Crop/blur when consent limited. Strip EXIF/metadata from all photos. Use initials, avoid exact locations. No geolocation in published images.

**Step 5 — Publication Controls:** Assign expiry date, content ID, consent artifact reference. Use noarchive meta tags on beneficiary pages. Track all social media post URLs in consent registry.

**Step 6 — Monitoring & Revocation:** Single inbox for revocation requests, 48-hour takedown SLA. Remove from website + social media + print distribution. Document all actions; use Google URL removal for caches.

### Alternatives When Consent Is Difficult

Risk-reduction patterns: anonymized stories (no face/identifiers), illustration/animation, composite narratives (labeled as composite), aggregate impact storytelling, beneficiary-controlled storytelling. Dignity-first: show hands not faces, quotes without photos, outcomes not suffering.

### Enforcement Context

No major UODO fine against an NGO for beneficiary imagery reported publicly. But UODO investigates on a single complaint — absence of cases reflects underreporting. Separate civil law track (Art. 24 KC): injunction, damages, published apology.

---

## Polish Donor Behavior & Giving Trends

**Seasonal patterns:**
- **Jan-Apr:** 1.5% PIT season — 62.6% of Polish donors participate. Highest traffic to OPP websites (50-70% of annual traffic for some organizations)
- **Christmas/Easter:** Emotional giving peaks; campaign-style donations
- **Year-round:** Online crowdfunding used by 39.7% of donors; Gen Z/Millennials most active

**Payment preferences by context:**
- BLIK: fastest path, dominant in 18-45 demographic; growing overall. Best for impulse/small donations
- Card payments: standard for recurring; familiar to all demographics
- Bank transfers (przelew): preferred by 55+ donors and for larger gifts
- BLIK OneClick: emerging for recurring — do not assume universal availability yet

**Giving culture:** Poland's online giving is person-to-person (individuals: 81.3% of crowdfunding value). NGOs win by making campaigns feel personal while maintaining organizational credibility.

**Donation amounts:** One-off: 50-100 PLN typical. Recurring: 20-50 PLN/month. Emergency: 200-500 PLN. Presets: 20/50/100/200 PLN one-off; 10/20/50/100 monthly. Most desired amount in position 2-3 (anchoring). Always include "inna kwota" last.

**Mobile gap:** ~65-70% mobile traffic, ~45-50% mobile conversion. Even worse for donations. Radical form simplification required.

**Tax deduction:** Donations to OPPs deductible up to 6% of income (separate from 1.5%). Most donors unaware. Post-donation message: "You can deduct this donation. Keep this confirmation for your PIT."

---

## Trust Signals & Polish Credibility Heuristics

**Nonprofit-specific trust pack** (required module on every Polish NGO site):
- OPP status badge with KRS number (prominent, not footer-only)
- NIP and REGON numbers for institutional credibility
- Link to sprawozdanie finansowe and merytoryczne (via sprawozdaniaopp.niw.gov.pl)
- "We are in the official 1.5% list" link during PIT season (link to Wykaz OPP entry)
- Physical address, Polish phone number (+48), real contact person
- Clear donation confirmation/receipt policy (warn about operator name on bank statements)

**Extended trust signals:**
- NIW (Narodowy Instytut Wolnosci) partnership mentions
- Media logos from Polish outlets (TVN, Gazeta Wyborcza, Onet, WP) — logos, not just text
- Transparency page: budget breakdown, annual report, audit results
- Recognized campaign participation (WOSP, Szlachetna Paczka)

**Platform trust continuity:** When using external platforms, explain the relationship on the NGO site, disclose fees, explain why. Reduces domain-change suspicion.

**Anti-pattern:** International charity ratings (Charity Navigator, GuideStar) carry no weight with Polish donors. Generic "as seen in" badges without Polish recognition.

---

## Practical Polish Playbooks

### Playbook: 1.5% PIT Landing Page

Hero with KRS in large type + copy button. 3-step Twoj e-PIT guide (login, enter KRS, confirm). Impact block with last year's 1.5% outcomes. "Default disruption" callout for switching. Trust footer with Wykaz OPP link. KRS share button + QR code. Page live before mid-February.

### Playbook: Polish Donation Page

BLIK first, szybki przelew second, card third. Preset PLN amounts anchored to impact. Purpose selector for multi-program orgs. Trust accordion (fees, confirmation policy, RODO). Trust bridge before redirects. Post-donation: confirmation email + 6% tax deduction reminder. Recurring: amount, frequency, cancel policy, next charge date.

### Playbook: Campaign Timing

**Feb 15:** 1.5% launch (Twoj e-PIT opens), site-wide banner + landing page. **Apr 15-30:** Urgency push, "X days left." **May-Jun:** Impact reporting from 1.5% results. **Sep-Oct:** Annual report, pre-position for next PIT season. **Nov-Dec:** Christmas giving campaign, emotional storytelling, email list building.

---

## Compliance Checklists

### RODO / Image Consent (Pre-Publication)

- [ ] Risk classification assigned (A/B/C)
- [ ] Consent obtained — channel-specific, time-bounded, separately signable for Art. 9 data
- [ ] Children: guardian consent obtained; child assent where feasible
- [ ] EXIF/metadata stripped; no geolocation in published images
- [ ] Content ID assigned; expiry date set; consent artifacts stored
- [ ] Takedown owner designated; revocation SLA defined (48h recommended)
- [ ] noarchive meta tag on beneficiary story pages
- [ ] All social media post URLs logged in consent registry

### Donation Page Compliance

- [ ] Donation regulations (regulamin darowizn) published
- [ ] RODO information clause on donation form (controller, purpose, legal basis, retention, rights)
- [ ] Platform fee disclosure (Wplacam 1.6%/2.2%, Siepomaga 6%, Zrzutka tip, Patronite ~8%)
- [ ] Confirmation email includes: NGO identity, donation purpose, date, amount, receipt info
- [ ] Recurring donation: cancellation mechanism, terms, next charge date in confirmation
- [ ] Tax deduction info provided (6% of income, separate from 1.5% PIT)

### 1.5% PIT Page Compliance

- [ ] Organization confirmed on current year's Wykaz OPP
- [ ] KRS number accurate and displayed with copy button
- [ ] Cel szczegolowy instructions clear (if using subaccounts)
- [ ] Twoj e-PIT instructions reflect current year's UX (mention auto-fill + change capability)
- [ ] Link to official Wykaz OPP entry
- [ ] Bank account correctly reported to KAS
- [ ] Page live before February 15; countdown active in final 2 weeks of April
