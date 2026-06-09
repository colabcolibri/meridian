# IDE adapters (Meridian kit)

The kit source lives in **`.agent/`** (committed). How you wire it depends on your IDE.

## Quick reference

| IDE | Adapter folder | Sync needed? | Install flag |
| --- | -------------- | ------------ | ------------ |
| **Cursor** | `.cursor/` | Yes | default, or `--cursor-only` |
| **Claude Code** | `.claude/` | Yes | default, or `--claude-only` |
| **Antigravity / ag-kit** | _(none)_ | No | `--no-sync` |
| **Other `.agent` indexers** | _(none)_ | No | `--no-sync` |

**Antigravity and similar tools read `.agent/` directly** — workflows, agents, and skills work without `.cursor/` or `.claude/`. Only install `.agent/`:

```bash
./install.sh --no-sync /path/to/project
```

## Sync script (Cursor + Claude)

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh   # once
./.agent/scripts/sync_cursor_kit.sh
```

### Surgical sync policy

- Never deletes `.cursor/` or `.claude/` wholesale
- Creates/replaces **Meridian symlinks** (targets containing `.agent/`)
- Removes **orphan** Meridian symlinks when a workflow/agent/skill was removed from the kit
- **Never touches** real files or symlinks pointing outside `.agent/`

Options: `--cursor-only`, `--claude-only`, `--no-prune`, `--dry-run`

## Install kit into another project

```bash
chmod +x /path/to/meridian/.agent/scripts/install-meridian-kit.sh
/path/to/meridian/.agent/scripts/install-meridian-kit.sh /path/to/my-project
```

Or from a project that already has `.agent/`:

```bash
./.agent/scripts/install-meridian-kit.sh .          # refresh copy + sync adapters
./.agent/scripts/install-meridian-kit.sh --force .  # overwrite .agent from source
./.agent/scripts/install-meridian-kit.sh --no-sync . # .agent only (Antigravity)
```

Set `MERIDIAN_KIT_SRC=/path/to/meridian/.agent` when the installer script is not run from the kit repo.

## Distribution (kit only — no app-desktop)

Build a release tarball:

```bash
# From meridian monorepo root
chmod +x .agent/scripts/package-kit.sh
KIT_VERSION=1.0.0 ./.agent/scripts/package-kit.sh
# → dist/meridian-kit-1.0.0.tar.gz
```

**Tarball contents:** `README.md`, `LICENSE`, `VERSION`, `install.sh`, `.agent/`  
**Not included:** `app-desktop/`, `app-visual-studio/`, extension VSIX.

**User install:**

```bash
tar -xzf meridian-kit-1.0.0.tar.gz
cd meridian-kit-1.0.0
./install.sh /path/to/my-project
```

**Future channels:** GitHub Releases (`kit-v*` + `extension-v*` tags with `.tar.gz` and `.vsix` assets). See [DISTRIBUTION.md](DISTRIBUTION.md).

Always edit in `.agent/` first; then run sync (also mirrors `app-desktop/docs/templates/` in the Meridian monorepo).

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

Claude Code does not mirror skills, rules, or templates — workflows and agents read `.agent/skills/` and templates from the repo when needed.

## Git

`.cursor/` and `.claude/` are in `.gitignore` — local symlinks, not versioned duplicates. Do not commit them.

## Native `.agent/` IDEs

Antigravity, ag-kit, and other tools that index `.agent/` directly need **no adapter** — use `--no-sync` on install and skip `sync_cursor_kit.sh`. Workflows, agents, and skills work from the committed folder.

See also: `.agent/KIT_README.md` (distribution package README).
