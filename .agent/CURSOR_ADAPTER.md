# Cursor adapter (Meridian kit)

Cursor does **not** index `.agent/` automatically. The `.cursor/` folder mirrors the kit for the IDE — **generated locally**, outside Git.

| Cursor | Canonical source |
| ------ | ------------------ |
| `.cursor/rules/meridian.mdc` | `.agent/rules/meridian.mdc` |
| `.cursor/skills/` | `.agent/skills/` |
| `.cursor/agents/` | `.agent/agents/` |
| `.cursor/commands/` | `.agent/workflows/` |
| `.cursor/references/templates/` | `.agent/references/templates/` (writing-guide, section-contracts, lifecycle, …) |

## Regenerate (required after clone)

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh   # once
./.agent/scripts/sync_cursor_kit.sh
```

Always edit in `.agent/` first; then run the script.

## Git

`.cursor/` is in `.gitignore` — local symlinks, not a versioned duplicate.
