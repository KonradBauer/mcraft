---
type: knowledge
purpose: "Audience profiles and user needs for government institutional websites"
---
# Government-Institutional: Audience

Domain knowledge for government and institutional audience segments and behavior models.
Part of: references/domains/government-institutional/

---

## Audience Segments

### Citizen / Public User

**Profile:** Wide demographic range, varying digital literacy — from tech-savvy 25-year-olds to 70-year-olds who rarely use the internet.

**Needs:**
- Plain language (no bureaucratic jargon)
- Step-by-step guidance through processes
- Multilingual support (legally mandated in many jurisdictions)
- Clear indication of required documents before starting a process
- Confirmation that their submission was received

**Primary barrier:** Confusion — "I don't understand what I need to do or which form to fill out."

**Behavior:** Task-focused, low patience, high anxiety (government interactions often involve deadlines, money, or legal consequences). Will call a phone hotline if the website fails them.

---

### Professional User

**Profile:** Lawyers, accountants, compliance officers, HR specialists who use the site regularly as part of their work.

**Needs:**
- Direct access to specific regulations, forms, and databases
- Bulk operations (filing multiple applications, downloading multiple documents)
- Account features with history and saved templates
- API access for system integration
- Exact legal citations and version-dated documents

**Primary barrier:** Inefficiency — "I know exactly what I need but the site makes me click through 7 pages to get there."

**Behavior:** High frequency, expert-level familiarity with content. Bookmarks deep pages. Frustrated by interfaces designed only for first-time users.

---

### Internal Staff

**Profile:** Government employees using public-facing tools to process citizen requests, answer inquiries, and manage cases.

**Needs:**
- Admin interfaces for application review and status management
- Data entry efficiency (keyboard shortcuts, batch processing)
- Internal notes and case management
- Integration with back-office systems
- Ability to see exactly what the citizen sees (to assist over phone)

**Primary barrier:** System friction — "The internal tool is slow and requires too many clicks per case."

**Behavior:** All-day usage. Efficiency gains of even seconds per interaction compound into significant time savings across thousands of daily cases.

---

### Accessibility-Dependent User

**Profile:** Screen reader users, keyboard-only users, elderly users with vision or motor limitations, users with cognitive disabilities, users with temporary impairments.

**Needs:**
- WCAG AAA compliance (not optional — legal mandate in many jurisdictions)
- Screen reader compatibility for all content including forms and status updates
- Keyboard-only navigation for all interactions
- High contrast mode and adjustable font sizes
- Plain language and simple sentence structures
- Extended time limits on forms and sessions

**Primary barrier:** Inaccessible interfaces — "The form doesn't work with my screen reader" or "I can't read the small text."

**WCAG compliance is not a feature — it is a legal requirement.** Government sites that fail accessibility standards face lawsuits, fines, and most importantly, exclude the citizens who need services the most.

---

## Awareness Model

Traditional awareness/funnel models are **irrelevant** for government sites. Citizens don't "discover" government services — they are required to use them.

The operative model is **task urgency:**

| Urgency Level | Trigger | Behavior | Design Implication |
|---|---|---|---|
| **Deadline-driven** | "My passport expires next month" | Focused, anxious, needs fastest path | Surface deadlines, estimated processing times, expedited options |
| **Life-event triggered** | "I'm moving, what do I need to change?" | Exploratory within scope, needs checklist | Life events navigation, related services suggestions |
| **Exploratory** | "What services are available for small businesses?" | Browsing, uncertain what exists | Service catalogs, topic pages, guided discovery |
| **Crisis** | "I need emergency housing" | Extremely stressed, possibly impaired judgment | Emergency banners, simplified crisis pathways, phone numbers prominent |

---

## "Coming From X" Warnings

### Coming from B2B SaaS
Government sites have **NO conversion funnel**. There is no "sales" — citizens are required users, not voluntary customers. Never add persuasion elements. There are no upsells, no pricing tiers, no "request a demo." The closest equivalent to "conversion" is "citizen completed their task successfully."

### Coming from E-commerce
Government sites serve **ALL citizens** regardless of digital literacy. Assume the lowest common denominator for interface complexity. There is no luxury segment. There are no "power users you can ignore." Every citizen has equal right to access services. Progressive disclosure is essential — simple by default, detailed on demand.

### Coming from Media/Publishing
Government content must be **factually complete and legally accurate** even at the expense of readability. You cannot "simplify" a legal requirement into inaccuracy. Headlines cannot be clickbait. Content cannot be optimized for engagement — it must be optimized for comprehension and task completion. There are no ads, no sponsored content, no algorithmic feeds.
