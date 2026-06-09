---
id: EPIC-02
title: Initial Setup Monitor
status: complete
versions: [v0, v1, v2.01]
profiles: [Process Manager, Local Operator]
outcome: "Manager opens docs/, sees progress of the 12 phase documents, and reads each .md inline in the app."
---

# EPIC-02 — Initial Setup Monitor

## Capability

**Setup** tab: progress of phase documents (00–08 and 11), readable state per step, inline reading of each `.md` (frontmatter + body), and sync with the monitored folder.

## Expected outcome

When opening `app-desktop/docs/` in the app, the manager sees which docs are draft/review/approved, dependencies between phases, and can read any document without leaving the monitor.

## v2.01 extension (folder transport)

US-0087 added the **dev HTTP path** (`vite-file-server.ts`, `http-folder-access.ts`, `meridian.localFolderPath`) so reopening `docs/` after F5 does not require the File System Access picker. Setup tab and inline reading behavior are unchanged; only how the folder is opened in local dev differs. See `docs/05_architecture.md` § Desktop app.

## Out of scope for this epic

- Kanban and epic filter (EPIC-04).
- Automated protocol validations (EPIC-03).
- Markdown writes by the app (EPIC-05 / v2).
