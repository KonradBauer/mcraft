<purpose>
Workflow for the `/expert` command. Discovers an installed expert agent, validates its structure, and injects it into the current Claude Code session. After loading, the agent takes over the conversation.
</purpose>

<required_reading>
(none — this workflow is self-contained)
</required_reading>

<process>
<step name="Step 1 — Discover installed agent(s)">
The agents directory is `~/.claude/agents/` — the user-global location Claude Code reads.

**Fast path (argument provided):**

1. If `$ARGUMENTS` is provided, first try a direct folder match:
   ```bash
   test -f "$HOME/.claude/agents/$ARGUMENTS/agent.md" && echo "FOUND"
   ```
2. If FOUND → set `AGENT_DIR` and `AGENT_NAME`, skip to Step 2.

**Slow path (no direct match or no argument):**

3. List every valid agent folder (those containing `agent.md`):
   ```bash
   for d in ~/.claude/agents/*/; do [ -f "$d/agent.md" ] && basename "$d"; done
   ```

4. Resolve based on `$ARGUMENTS` and the listing:

   | Condition | Action |
   |-----------|--------|
   | **No arguments + exactly one agent** | Use it. Proceed to Step 2. |
   | **No arguments + multiple agents** | Present the list and ask the user to pick. STOP. |
   | **No arguments + zero agents** | Respond: "No expert agent installed. Copy an agent folder into `~/.claude/agents/` and try again." STOP. |
   | **Exact match** (case-insensitive) | Use it. |
   | **Single substring match** | Use it. |
   | **Multiple substring matches** | Present matching names and ask the user to pick. STOP. |
   | **No match** | List all available agents and STOP. |

5. Set variables:
   - `AGENT_DIR` = `~/.claude/agents/{matched}/` (resolve the tilde with `$HOME`)
   - `AGENT_NAME` = the matched folder name
</step>

<step name="Step 2 — Validate the agent">
1. Confirm `agent.md` exists in `AGENT_DIR`.
   - If not: "No `agent.md` found in `{AGENT_DIR}`. This folder is not a valid expert agent." STOP.

2. Read the YAML frontmatter of `agent.md` and extract the `name:` field — the agent's display name. If no `name:` field, fall back to `AGENT_NAME`.

3. Announce:
   > Loading **{display name}** from `{AGENT_DIR}`...
</step>

<step name="Step 3 — Ensure local-rules-only marker">
The expert agent uses its own communication conventions, not any global framework rules that may be injected by hooks. Opt out with a marker file in the current working directory.

If `{CWD}/.local-rules-only` does not exist, create it with this content:
```
# This directory is an expert agent workspace.
# Global communication rules do not apply here — the loaded agent uses its own conventions.
# Hook: ~/.claude/hooks/inject-communication-rules.sh walks up from cwd looking for this
# marker and skips injection when found.
```

Silent operation — no user prompt, no output to the user.
</step>

<step name="Step 4 — Inject agent into session">
1. Read the full content of `{AGENT_DIR}/agent.md`.

2. Inject the content silently into the session context — do **not** print it to the user.

3. Display a single confirmation line:

   > **{display name}** loaded from `{AGENT_DIR}` — project files will write to `{CWD}`.

4. Immediately follow the agent's Startup section. When the agent references files from its own directory (`references/`, tools, scripts), resolve those paths under `{AGENT_DIR}`. When the agent creates deliverables or project outputs, write them to `{CWD}`.
</step>
</process>
