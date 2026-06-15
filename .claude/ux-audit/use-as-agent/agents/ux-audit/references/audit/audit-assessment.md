---
type: knowledge
purpose: "Assessment axes for audit findings — confidence (evidence strength), impact (magnitude), decision state (user review lifecycle), and question status. Shared vocabulary referenced from workflow-audit.md."
---
Follow §Communication Rules from agent.md
# Domain Audit — Assessment Axes

Shared axis definitions for audit findings and clarifying questions. All numeric scoring decisions in the audit workflow reference this file. Per-axis labels render in project language per `html-craft.md §Project Language`.

Used by: workflow-audit.md

---

## Confidence Axis

How sure the agent is that the pattern is violated. Evidence-driven, not a guess-quality proxy.

| Tier | Key | Use when |
|------|-----|----------|
| Confirmed | `high` | Direct evidence in observed UI, site data, client materials, or prior research |
| Likely | `medium` | Strong inference from adjacent evidence; or user-flagged gap (client surfaced the problem) |
| Tentative | `low` | Best guess from partial information — e.g., client couldn't answer clarifying question; agent inferred from archetype patterns |

### Inferred-strategy rule

At finding-generation time, the agent checks whether `current-website/project_plan.html` contains a populated `#strategy-data` section. This check is the sole dispatch signal — not any audit mode set at Step 1.

**No `#strategy-data` present:** site-plan findings derive from homepage layout map + sitemap.xml + domain knowledge alone — without confirmed strategic intent (was the archetype intentional, does the audience tier match the ICP, what business constraints shaped the decisions). Such findings default to **🟡 Likely (`medium`) confidence** to signal that the agent's read is provisional.

**`#strategy-data` present:** `current-website/project_plan.html` contains confirmed strategy data (e.g. from a prior Discovery or Reverse Wireframing chain). Site-plan findings start at **🟢 Confirmed (`high`) confidence** from the start — no inference layer is needed.

**🟡 → 🟢 upgrade trigger:** the user answers a post-audit intent question (status: `answered` or `guessed`) covering the archetype / audience / constraint area the finding sits in. The agent re-renders the finding on the next interaction and upgrades confidence to `high` if the answer grounds the inference.

**Anatomy carve-out:** anatomy findings (homepage element-level — layout, hero anatomy, value-prop clarity) tag confidence per the standard axis above (direct evidence in observed UI). They are not affected by the inferred-strategy rule because they ground in actual page content rather than inferred strategy.

## Impact Axis

How much the finding matters to the buyer journey or business outcome if the pattern really is violated.

| Tier | Key | Use when |
|------|-----|----------|
| Critical | `high` | Central to the archetype's business function — pattern is core to conversion or primary decision-making |
| Significant | `medium` | Affects the journey but not the primary conversion path |
| Minor | `low` | Peripheral — nice-to-have; does not move primary outcomes |

## Axis independence

Confidence and impact are **independent**. A finding always carries both, never collapsed. Examples:
- `high` confidence + `low` impact — certain the site is wrong, but the wrongness is peripheral
- `low` confidence + `high` impact — uncertain the pattern is violated, but if it is, the stakes are material
- `medium` confidence + `medium` impact — the common case

Score both axes independently before presenting a finding.

## Decision State

User's per-finding decision lifecycle. Shell-managed (see `references/audit/audit-template.html` for the UI contract).

| State | Key | Meaning |
|-------|-----|---------|
| Pending | `pending` | Default; user has not reviewed this finding yet |
| Accepted | `accepted` | Will be addressed in the redesign brief |
| Rejected | `rejected` | Deliberately excluded; retained for justification |

Reversible: in the detail view, clicking the currently-active button resets state to `pending`.

## Question Status

Clarifying-question state — reflects how the question was resolved.

| State | Key | Meaning |
|-------|-----|---------|
| Answered | `answered` | Client provided a direct answer |
| Guessed | `guessed` | Agent proceeded with an inferred working assumption (client couldn't or didn't answer) |
| Flagged | `flagged` | Question is decision-blocking and unresolved — surfaced in the deliverable so the client addresses it |
