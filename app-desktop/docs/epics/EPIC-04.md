---
id: EPIC-04
title: Kanban and User Stories
status: active
versions: [v1, v2, v3, v4]
profiles: [Process Manager, Local Operator, Future VSCode User]
outcome: "Manager sees epics, US by status, and derived board.json — without editing JSON manually."
---

# EPIC-04 — Kanban and User Stories

## Capability

**Deliverables** and **Board** tabs: epics read from `docs/epics/`, user stories from `docs/us/`, kanban derived from frontmatter, filter by epic.

## Expected outcome

Each US references an epic by ID (`epic: EPIC-XX`); the app groups US by epic and shows status columns without duplicating the epic definition inside the US.

## Out of scope for this epic

- Create/edit US via the app (EPIC-05 / v2).
- Define new epics (skill `create-epic` + docs/epics/).
