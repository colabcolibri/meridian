---
id: EPIC-05
title: Meridian in the IDE
status: complete
versions: [v4]
profiles: [Future VSCode User, Process Manager]
outcome: "Manager tracks Board, epics, and versions inside VS Code/Cursor from docs/ — the visual map lives in the editor."
---

# EPIC-05 — Meridian in the IDE

## Capability

A **real, installable** editor extension (VS Code Marketplace or `.vsix`) — like Markdown preview or other daily extensions — not a monorepo-only dev script. User installs once; when a workspace has Meridian structure (`.agent/` + `docs/`), the extension activates and shows **Board** and **Deliverables** in editor tabs plus a **Commands** sidebar for validate and navigation.

## Expected outcome

1. Install **Meridian** from the marketplace (or `.vsix`) in VS Code / Cursor / compatible editors.
2. Open any Meridian project folder.
3. Use **Meridian: Open Board** and **Open Deliverables** to track US, epics, and versions — no separate browser app required for day-to-day work.

Writing and `board.json` regeneration: **Meridian: Sync Board** (US-0095) or agents (`/sync-board`). The extension is **read-first** in v4; **Validate Project** runs kit Python. v4 closed with US-0089–US-0098 (EPIC-05).

## Out of scope for this epic

- Autonomous agent routing (stays in `.agent/`).
- Drag-and-drop kanban status edits.
- Remote backend / multi-user.
- Replacing the browser monitor entirely (it stays as optional/demo).

## Deferred to v5+

- Command palette: Sync Board and New US wired to disk (stubs today).
- `generate_board.py` invoked from extension (agents already handle sync).
- Marketplace listing with production publisher id.
