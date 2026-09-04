# Meridian protocol

This repository uses the [Meridian](https://github.com/colabcolibri/meridian) protocol. The kit source of truth is `.agent/`; product docs live under `docs/` of the **active Meridian product** (monorepos: see `.meridian/projects.json`).

## How to invoke

```txt
YOU  →  /us-create  or  @story-maker     (skill slash or agent)
     →  docs/                             (source of truth)
```

| IDE | You invoke | Adapter (local, gitignored) |
| --- | ---------- | ----------------------------- |
| **Cursor** | `/us-create`, `@story-maker`, … | `.cursor/skills/` + `.cursor/agents/` ← `.agent/` |
| **Claude Code** | same | `.claude/agents/` ← agents |
| **Codex** | skills in chat | `.agents/skills/` ← `.agent/skills/` |
| **OpenCode** | skills + agents | `.opencode/skills/`, `.opencode/agents/` |
| **Antigravity / .agent-native** | read `.agent/skills/` directly | none |

After **Install Harness** or clone: run `./.agent/scripts/sync_kit.sh` to refresh adapters.

## Human guides (read in order)

0. `.agent/references/INDEX.md` — map of the references tree
1. `.agent/references/guides/how-to-use.md` — extension vs chat entry
2. `.agent/references/guides/start-here.md` — concepts, phases, gates
3. `.agent/references/guides/usage-guide.md` — day-to-day situations
4. `.agent/references/guides/agents-help.md` — agents, slash commands, steps 1–17

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
- Inspect delivery via `meridian_delivery.py`; frontmatter ≠ SQL (`sprint`→`sprint_id`, `version`→`version_id`, `epic`→`epic_id`).
- Never `✅` without evidence; never `🔶` without `Missing:` in acceptance.
- Never `✅` without filled `## Record` on the US (skill `us-complete`).
- Product code for a US requires `ready: true` — run `/implement-us US-XXXX` before coding.
- Decisions: prepend via `meridian_delivery.py prepend-decision` (SQLite). Before CLI run `date +"%Y-%m-%d"` and `date +"%H:%M"` — use `/update-decisions-log`.
- Structural contract: `.agent/references/templates/section-contracts.md` (validator + monitor).

## Validate (optional)

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
```

Monorepo dogfood: `python3 .agent/scripts/validate_meridian.py . --sqlite-only --strict-kit-md`
