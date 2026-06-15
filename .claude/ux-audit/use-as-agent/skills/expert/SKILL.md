---
name: expert
description: "Summons an installed expert agent into the current Claude Code session. Trigger on '/expert', 'summon the agent', 'load my expert'. Works when the user has copied an agent folder into ~/.claude/agents/."
---

# Expert — Summon Your Agent

A lightweight skill that loads an installed expert agent into the current Claude Code session. After loading, the agent takes over the conversation and guides you through its work.

## Usage

Type `/expert` in Claude Code.

- One agent installed → it loads automatically.
- Multiple agents installed → you're asked which one to load.
- No agents installed → you see install instructions.

Type `/expert {agent-name}` to pick a specific agent when several are installed.

## Install an agent

Expert agents ship as a folder containing `agent.md` and a `references/` directory.

1. Copy the agent folder into `~/.claude/agents/`.
   - macOS / Linux: `~/.claude/agents/`
   - Windows: `C:\Users\{you}\.claude\agents\`
2. Restart Claude Code so the new agent is discovered.
3. Type `/expert` — your agent loads.

## Uninstall an agent

Delete its folder from `~/.claude/agents/`. Nothing else to clean up.

## What this skill does not do

- Does not install agents automatically — you copy the folder yourself.
- Does not build, edit, or update agents.
- Does not manage multiple simultaneous agents in one session — one agent per session.
- Does not run agent tools outside the session context the loaded agent controls.

## How it works

See `workflows/expert.md` for the full workflow.
