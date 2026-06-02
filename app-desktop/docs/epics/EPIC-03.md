---
id: EPIC-03
title: Meridian Validations
status: complete
versions: [v1]
profiles: [Process Manager, Local Operator, Future VSCode User]
outcome: "Protocol violations appear in the app and in validate_meridian.py before marking a US as done."
---

# EPIC-03 — Meridian Validations

## Capability

Make protocol rules visible and auditable: dependencies between phase docs, US `🔶` without `Missing:`, references to nonexistent epics, board vs file divergence.

## Expected outcome

Manager sees actionable alerts in the monitor; developer/agent runs `validate_meridian.py` and gets a clear error list before commit.

## Out of scope for this epic

- Doc editing UI (EPIC-05).
- Autofix of board or docs (future).
