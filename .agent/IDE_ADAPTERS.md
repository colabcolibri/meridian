# IDE adapters (Meridian kit)

The kit source lives in **`.agent/`** (committed). Cursor and Claude Code do not index it the same way — run the sync script after clone or kit changes to build **local** adapter folders (gitignored).

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh   # once
./.agent/scripts/sync_cursor_kit.sh
```

Always edit in `.agent/` first; then run the script (also syncs `app-desktop/docs/templates/` in this kit repo).

## What gets generated

| Adapter | Path | Contents |
| ------- | ---- | -------- |
| **Cursor** | `.cursor/` | rules, skills, agents, slash commands, template registry |
| **Claude Code** | `.claude/` | agents, slash commands |

Both adapters symlink workflows from `.agent/workflows/` as slash commands and agents from `.agent/agents/`.

### Cursor mapping

| Cursor | Canonical source |
| ------ | ------------------ |
| `.cursor/rules/meridian.mdc` | `.agent/rules/meridian.mdc` |
| `.cursor/skills/` | `.agent/skills/` |
| `.cursor/agents/` | `.agent/agents/` |
| `.cursor/commands/` | `.agent/workflows/` |
| `.cursor/references/templates/` | `.agent/references/templates/` |

### Claude Code mapping

| Claude Code | Canonical source |
| ----------- | ------------------ |
| `.claude/commands/` | `.agent/workflows/` |
| `.claude/agents/` | `.agent/agents/` |

Claude Code does not mirror skills, rules, or templates — invoke workflows and agents directly; they read `.agent/skills/` and templates from the repo when needed.

## Git

`.cursor/` and `.claude/` are in `.gitignore` — local symlinks, not versioned duplicates. Do not commit them.

## Native `.agent/` IDEs

Antigravity, ag-kit, and other tools that index `.agent/` directly need no adapter — workflows, agents, and skills work from the committed folder.
