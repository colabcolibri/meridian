# Meridian protocol

This repository uses the [Meridian](https://github.com/meridian) protocol. The kit source of truth is `.agent/`; product docs live under `docs/` of the active Meridian product.

## Required reading

1. `.agent/MERIDIAN.md` — master protocol
2. `.agent/rules/MERIDIAN.md` — P0 rules
3. Agent in `.agent/agents/` per the request
4. Skills in `.agent/skills/` or invoke repo skills under `.agents/skills/`
5. Creating/closing epic, version, sprint, or US → `.agent/references/templates/INDEX.md` + full template + `section-contracts.md` **before** Write

Priority: **P0 rules > P1 agent + MERIDIAN.md > P2 skills**.

## Short rules

- `docs/` of the **active Meridian product** is the source of truth.
- Documentation precedes product code.
- Do not create US before `05_architecture` `approved`.
- `docs/kanban/board.json` is derived from `docs/us/*.md`.
- Never `✅` without evidence; never `🔶` without `Missing:` in acceptance.
- Never `✅` without filled `## Record` on the US (skill `complete-user-story`).
- `docs/decisions/YYYY-MM-DD.json`: prepend in `entries`; never edit old entries.

## Workflows (skills)

Meridian slash workflows are available as Codex skills in `.agents/skills/workflow-*/`. Invoke explicitly (for example `$workflow-create-us`, `$workflow-status`, `$workflow-init-meridian`) or let Codex match by description.

After editing `.agent/`, run `./.agent/scripts/sync_cursor_kit.sh` to refresh IDE adapters.
