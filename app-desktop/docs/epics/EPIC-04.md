---
id: EPIC-04
title: Kanban and User Stories
status: active
versions: [v1, v2, v5]
profiles: [Process Manager, Local Operator, Future VSCode User]
outcome: "Manager sees epics, US by status, and derived board.json — without editing JSON manually."
---

# EPIC-04 — Kanban and User Stories

## Capability

**Deliverables** and **Board** tabs: epics read from `docs/epics/`, user stories from `docs/us/`, kanban derived from frontmatter, filter by epic.

## Expected outcome

Each US references an epic by ID (`epic: EPIC-XX`); the app groups US by epic and shows status columns without duplicating the epic definition inside the US.

## Out of scope for this epic

- Create/edit US via the browser (EPIC-05 / v4).
- Define new epics (skill `create-epic` + `docs/epics/`).

## Current focus (v2)

Monitor kanban polish: doc badges, lean columns, index loader (US-0073–0076 ✅), stale-board warning (US-0051 — Should, open). Extension status commands land in v5 with EPIC-08.
