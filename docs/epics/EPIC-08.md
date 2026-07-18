---
id: EPIC-08
title: Delivery Authoring
status: paused
versions: [v5]
profiles: [Future VSCode User, Process Manager]
outcome: "Manager authors sprints, closes US, and updates board status from the editor with guided workflows."
---

# EPIC-08 — Delivery Authoring

## Capability

VS Code extension matures beyond templates: wizards for sprints, helpers aligned with `/complete-us` and decision log prepend, and commands to change US status without hand-editing frontmatter YAML.

## Expected outcome

Manager runs **Meridian: Complete User Story**, fills acceptance evidence in guided steps, saves — board syncs and validator passes. Sprint and decision entries follow the same file protocol as agents.

## Out of scope for this epic

- Browser monitor writing files (remains read-only).
- Drag-and-drop kanban in the web UI (status changes via extension commands).
- GitHub / CSV (EPIC-09 / v5).

## Notes

- Builds on EPIC-05 (v2) commands and scripts.
- EPIC-04 kanban gains cross-links to extension actions in v4.
