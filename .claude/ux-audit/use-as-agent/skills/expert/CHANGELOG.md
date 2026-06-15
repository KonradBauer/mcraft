# Changelog — `/expert` skill

All notable changes to the `/expert` skill are tracked here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0] — 2026-04-20

### Added
- Initial release of the `/expert` skill and command.
- `skills/expert/SKILL.md` — hub with frontmatter dispatch signal, usage, install paths for macOS/Linux and Windows, anti-railroad section, pointer to workflow.
- `skills/expert/workflows/expert.md` — 4-step workflow ported from `/ag:init`: discover installed agent(s) at `~/.claude/agents/`, validate `agent.md` frontmatter, ensure `.local-rules-only` marker in CWD, inject agent into session.
- `commands/expert.md` — slash-command trigger with `argument-hint: "{agent-name (optional)}"`, `allowed-tools: [Read, Bash, Glob]`, and execution_context pointer at `@~/.claude/skills/expert/workflows/expert.md`.

### Notes
- Behavior is a faithful port of `/ag:init` with two intentional drifts: portable `~/.claude/agents/` path (not an absolute dev-machine path) and flat `/expert` namespace (not `/ag:*`).
- Shipping integration (bundling the skill into `/ag:build ide` output) is deferred to the follow-up Agent-Studio project `2026-04-20-ship-expert-skill`.
