---
id: EPIC-02
title: Initial Setup Monitor
status: complete
versions: [v0, v1]
profiles: [Process Manager, Local Operator]
outcome: "Manager opens docs/, sees progress of the 12 phase documents, and reads each .md inline in the app."
---

# EPIC-02 — Initial Setup Monitor

## Capability

**Setup** tab: progress of phase documents (00–08 and 11), readable state per step, inline reading of each `.md` (frontmatter + body), and sync with the monitored folder.

## Expected outcome

When opening `app-desktop/docs/` in the app, the manager sees which docs are draft/review/approved, dependencies between phases, and can read any document without leaving the monitor.

## Out of scope for this epic

- Kanban and epic filter (EPIC-04).
- Automated protocol validations (EPIC-03).
- Markdown writes by the app (EPIC-05 / v2).
