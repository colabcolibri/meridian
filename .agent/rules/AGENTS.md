# Meridian protocol

This repository uses the [Meridian](https://github.com/colabcolibri/meridian) protocol. The kit source of truth is `.agent/`; product docs live under `docs/` of the **active Meridian product** (monorepos: see `.meridian/projects.json`).

## How to invoke (you type workflows, not agents)

```txt
YOU  →  /create-us  or  $workflow-create-us     (workflow)
         ↓
Agent (@backlog-refiner, …)                          (routed by workflow — override with @name if needed)
         ↓
Skill (create-user-story, …)                      (loaded by agent — rarely typed by human)
         ↓
docs/                                             (source of truth)
```

| IDE | You invoke | Adapter (local, gitignored) |
| --- | ---------- | ----------------------------- |
| **Cursor** | `/status`, `/create-us`, … | `.cursor/commands/` ← `.agent/workflows/` |
| **Claude Code** | same slash commands | `.claude/commands/` ← workflows |
| **Codex** | `$workflow-status`, `$workflow-create-us`, … | `.agents/skills/workflow-*/` ← workflows |
| **Antigravity / .agent-native** | read `.agent/workflows/` directly | none — `.agent/` only |

After **Install Harness** or clone: run `./.agent/scripts/sync_cursor_kit.sh` to refresh adapters.

## Human guides (read in order)

1. `.agent/references/start-here.md` — concepts, phases, gates
2. `.agent/references/usage-guide.md` — day-to-day situations
3. `.agent/references/agents-help.md` — agents, slash commands, steps 1–17

## Required reading (agents)

1. `.agent/MERIDIAN.md` — master protocol
2. `.agent/rules/MERIDIAN.md` — P0 rules
3. Agent in `.agent/agents/` per the request
4. Skills in `.agent/skills/` (or `.agents/skills/` after Codex sync)
5. Creating/closing epic, version, sprint, or US → `.agent/references/templates/INDEX.md` + full template + `section-contracts.md` **before** Write

**Priority:** P0 rules > P1 agent + MERIDIAN.md > P2 skills.

**Routing:** skill `meridian-routing` or specialized agents. Announce `🤖 Applying knowledge from @[agent-name]...` before specialized work.

## Short rules

- Documentation precedes product code.
- Do not create US before `05_architecture` `approved`.
- `docs/kanban/board.json` is **deprecated** in v11 — use SQLite `board_snapshots` / planning export.
- Never `✅` without evidence; never `🔶` without `Missing:` in acceptance.
- Never `✅` without filled `## Record` on the US (skill `complete-user-story`).
- Product code for a US requires `ready: true` — run `/implement-us US-XXXX` before coding.
- Decisions: prepend via `meridian_delivery.py prepend-decision` (SQLite). Before CLI run `date +"%Y-%m-%d"` and `date +"%H:%M"` — use `/update-decisions-log`.
- Structural contract: `.agent/references/templates/section-contracts.md` (validator + monitor).

## Validate (optional)

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
```

Monorepo dogfood: `python3 .agent/scripts/validate_meridian.py . --sqlite-only --strict-kit-md`
