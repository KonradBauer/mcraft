---
name: expert
description: "Summon your installed expert agent. Type /expert to load the agent. If multiple agents are installed in ~/.claude/agents/, you'll be asked which one. Trigger on 'summon the agent', 'load my expert'."
argument-hint: "{agent-name (optional)}"
allowed-tools:
  - Read
  - Bash
  - Glob
---
<objective>
Load an installed expert agent into the current Claude Code session. The agent takes over the conversation — after loading, the user is talking directly to the agent, not to the default assistant.

**Flow:** Find installed agent(s) → Load agent into session → Agent greets the user
</objective>

<execution_context>
@~/.claude/skills/expert/workflows/expert.md
</execution_context>

<context>
Agent: $ARGUMENTS (optional — with exactly one agent installed, just type /expert)
</context>

<process>
Pass $ARGUMENTS (if provided) to the workflow. The workflow handles discovery, validation, marker setup, and context injection.

1. If `$ARGUMENTS` is provided → resolve to an agent folder and load it.
2. If no arguments and exactly one agent is installed → load that single agent.
3. If no arguments and multiple agents are installed → list them and ask the user to pick.
4. If no agents are installed → show install instructions and STOP.
5. Once loaded, the current session adopts the agent's identity; the agent's Startup section runs immediately.
</process>
