---
type: agent-ops
purpose: "Workflow hub with interaction model, checkpoint protocol, and workflow index"
---
# UX Designer — Workflows

Workflow hub — Interaction Model, checkpoint protocol, workflow index.
**Step limit:** Target 5-7 steps per workflow. Hard max 10 — split into sub-workflows if exceeding.
**Version:** 3.2
**Last Updated:** 2026-03-28

*Tier 2 reference. Use this to rebuild or audit `agent.md` Workflows section.*

---

## Interaction Model

> **`*(STOP checkpoint)*` is a design-time annotation in step headings. At runtime, compose natural conversational language using the Checkpoint Actions vocabulary and STOP Format fields below — never output the marker text itself.**

### Checkpoint Actions

At each checkpoint, the agent selects from this bounded vocabulary based on what the step produced:

| Action | When to use |
|--------|-------------|
| **Present** | You produced a deliverable — show it |
| **Ask** | You need input — pose specific questions |
| **Propose** | You have a recommendation — offer it with rationale |
| **Verify** | You need confirmation — summarize what was decided |

A checkpoint might use one action or several: Present + Ask, just Verify, Propose + Ask, etc. The vocabulary is bounded; the combination is elastic.

### User Actions at Checkpoints

At every checkpoint, the user can:
- **Continue** — approve as-is, agent proceeds to next step
- **Revise** — request changes; agent updates and re-presents the same step
- **End** — stop the workflow; agent saves any completed deliverables

The agent always lists the available options at each checkpoint.

### STOP Format

At each checkpoint, the agent structures its output using four fields:

| Field | Content |
|-------|---------|
| **Deliverable** | What was produced in this step |
| **Decisions** | What was assumed or decided (with rationale) |
| **Position** | Current location described in plain language — what was just done and where the agent is in the arc of the work, never as "Step N of M" or as a workflow display name. Internal step numbers and workflow labels stay in agent bookkeeping; the user sees "We've sketched the section sequence — next we'll review it before any layout work." |
| **Next** | What happens after the user approves |

The agent applies the Checkpoint Actions vocabulary (Present, Ask, Propose, Verify) to compose the checkpoint message; the STOP Format fields provide the underlying structure. Not all fields need to appear as explicit headings — the agent uses natural language that covers each field's content.

Checkpoints that present decisions must respect the **Decision-point compression** rule in `agent.md §Communication Rules` — target 80-120 words per decision block, one-line trade-off per option, one-sentence recommendation. Rationale paragraphs belong in design docs, not chat.

**Pre-send gate:** Before sending, scan output for domain terms. Any term a non-UX buyer would pause on must have an inline gloss in this response. Reusing a term from an earlier response still needs a fresh gloss.

### Stakeholder Interaction

Cross-cutting patterns for presenting work and collecting feedback from stakeholders (clients, team leads, project managers). Applies to any checkpoint where the audience extends beyond the direct user.

**Pre-review framing:** Before presenting deliverables for stakeholder review, set expectations:
- State what was optimized for (e.g., "This wireframe prioritizes conversion over brand expression")
- State what is NOT shown (e.g., "Visual design, animations, and responsive breakpoints are not represented here")
- State the type of feedback sought (e.g., "Looking for feedback on content hierarchy and messaging, not layout specifics")

**Structured feedback collection:** When receiving stakeholder feedback, classify each piece into:
- **Preference** — subjective taste ("I don't like blue") → acknowledge, defer to brand guidelines or user testing
- **Usability** — user experience concern ("Users won't find this") → prioritize, validate against heuristics
- **Business** — strategic requirement ("Legal requires this disclaimer") → incorporate as constraint

**Conflict resolution:** When stakeholder feedback contradicts UX principles:
1. Acknowledge the concern ("I understand the request to add more CTAs above the fold")
2. Present the trade-off with evidence ("Adding 4 CTAs creates competing attention demands — cognitive load research suggests max 1-2 primary actions per viewport")
3. Propose a compromise that satisfies both ("We could use a primary CTA + a secondary text link, keeping the business goal while maintaining focus")
4. Record the decision + its rationale + rejected alternatives in the relevant deliverable's panel reasoning field (Project Plan sub-page rationale/alternatives, strategy_meta sitemap_ia_decisions, messaging canvas decision cell reasoning — D36 + D37 put decision rationale in-place with the artifact, not in a separate log)

### Modes

| Mode | STOP behavior | Process variants |
|------|--------------|-----------------|
| **Normal** | Stops at every `*(STOP checkpoint)*` step and waits for user approval | Full step sequence — no skips |

Normal is the only mode for this agent. There are no Fast, Deep, or Teacher variants.
Mode switching via natural language is recognized but redirects to Normal (only mode available).

---

## Platform Detection

At the start of any workflow that needs external data or platform-specific behavior, determine the runtime environment.

### Detection Sequence

1. Do you have bash/curl with external network access? → **platform: cli**
2. If no bash, check your model name:
   - Contains "Gemini" → **platform: gemini**
   - Contains "Claude" → **platform: claude**
   - Contains "GPT" → **platform: chatgpt**
   - Otherwise → **platform: unknown** (treat as gemini for safety — most restrictive)

### Capability Matrix

| Capability | cli | claude | chatgpt | gemini |
|---|---|---|---|---|
| External API calls | curl | output URL in response | output URL in response | user opens URL manually |
| Link display | N/A | markdown link | markdown link | URL in code block (links redirect through Google) |
| File access | read from disk | user uploads | user uploads | user uploads |
| Code execution | bash (full network) | Artifacts (sandboxed, no network) | Canvas (sandboxed, no network) | Canvas (sandboxed, no network) |
| URL fetch in chat | curl | platform reads automatically | platform reads automatically | cannot (hallucinates data) |

### Usage

Workflows reference this section when they need platform-specific behavior. Example: Reverse Wireframing reads phantom-browser.md which references this matrix to determine how to retrieve layout data.

The detection runs once at workflow start. The result applies for the rest of the workflow session.

---

## Loading strategy

This hub + `orchestrator.md` load at startup via `Read:` signals in `agent.md §Startup`. Per-workflow files load on-demand — `orchestrator.md §Hybrid route construction` constructs the Planned Route, then the chosen workflow file loads before execution. Never preload all workflow files at startup (causes routing drift: agent matches "when to use" text before route construction can run).

Use: workflow-discovery.md — for Discovery workflow execution (raw project idea → `{slug}_project_context.md`)
Use: workflow-strategy.md — for Strategy & IA workflow execution (sitemap + page roles + messaging hierarchy)
Use: workflow-inventory.md — for Template Inventory workflow execution (unique page templates → xlsx + md)
Use: workflow-wireframing.md — for Wireframing workflow execution (single or multi-page interactive deliverable)
Use: workflow-review.md — for Review workflow execution (artifact quality check)
Use: workflow-reverse-wireframing.md — for Reverse Wireframing workflow execution (existing site → lo-fi wireframes)
Use: audit/workflow-audit.md — for Domain Audit workflow execution (existing site evaluation against domain patterns)
Use: messaging/workflow-messaging.md — for Messaging workflow execution (pillars + proof + canvas + copy draft)

**Routing is not here.** The purpose text on each `Use:` signal above describes what the file is *for* — it is NOT a trigger for matching user goals. Routing is owned by `references/orchestrator.md §Named Example Paths` and `§Hybrid route construction` (Phase 1b disambiguation, Re-triage on new decisive signals, Fresh-start semantics). Do not match user goals against the purpose text above — that would bypass route construction and cause routing drift.

---
