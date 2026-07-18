---
title: User Types
status: approved
version: 1.1
updated: 2026-07-18
depends_on: [02_security.md]
blocks: [04_principles.md, 05_architecture.md, 06_database.md, 07_api_contracts.md]
---

# 03 — User Types

## Meridian manager (human)

- **Description:** person responsible for conducting the development flow with AI agents — scope, priorities, approvals, and commits. May be a developer, founder, product lead, designer, or tech lead.
- **Origin:** local workspace (Cursor, Claude Code, or VS Code with Meridian Harness).
- **Permissions:** approve phase docs (`00`–`11`), run slash workflows, set sprint scope, mark US `ready` / `✅`, commit to Git, direct agents with `@` mentions.
- **Restrictions:** does not skip harness gates (`05_architecture` approved, `ready: true` before code, `Record` before `✅`); does not delegate unreviewed scope to agents.
- **Session:** no authenticated session.
- **Visible data:** phase docs, `.meridian/meridian.db` planning export, Git history, validator output.
- **Edge cases:** project without `docs/`, architecture not approved, agents suggesting code before `ready`, unrecorded cross-cutting decisions.

## Extension operator (same human, IDE board)

- **Description:** person using the **Meridian Harness** extension webviews (Board, Epics, Versions, Sprints) inside VS Code or Cursor.
- **Origin:** extension install + workspace with kit (`.agent/`) and `docs/`.
- **Permissions:** view planning data from SQLite, open phase docs, run kit commands exposed by the extension, edit delivery via forms that call `meridian_db_export.py --write-form`.
- **Restrictions:** no remote sync; delivery writes go through kit scripts (not hand-edited `docs/us/*.md` in v11).
- **Session:** no authenticated session.
- **Visible data:** workspace files, planning export, validator status.
- **Edge cases:** missing `meridian.db` (run `bootstrap_meridian_db.py`), stale webview after external CLI edits (refresh board).

## AI agent (kit actor)

- **Description:** IDE agent following `.agent/` rules, specialized agents, skills, and workflows — not an end-user persona with login.
- **Origin:** invoked by manager via chat or slash command.
- **Permissions:** read phase docs and US rows; write delivery via `meridian_delivery.py` when skill allows; product code only after `/implement-us` gate.
- **Restrictions:** no autonomous commits; no `✅` without evidence; routing via `meridian-routing` (v11 slugs; legacy chat aliases redirect).
- **Visible data:** same workspace as manager, minus secrets.
- **Edge cases:** wrong agent for task, legacy v1 paths in prompt, attempting Write on `docs/us/` when SQLite active.
