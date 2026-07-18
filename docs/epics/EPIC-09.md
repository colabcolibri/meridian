---
id: EPIC-09
title: Export and GitHub Bridge
status: paused
versions: [v6]
profiles: [Process Manager, Local Operator]
outcome: "Manager exports board data and sees lightweight Git context beside Meridian docs."
---

# EPIC-09 — Export and GitHub Bridge

## Capability

Derived exports (CSV, markdown sprint report) from `docs/us/` and `board.json`. Optional read-only GitHub metadata (linked repo, recent activity on `docs/`) in monitor or extension — no issue sync, no write to GitHub.

## Expected outcome

Manager exports kanban to CSV for stakeholders; optionally links a GitHub repo and sees last commit touching `docs/us/` without leaving Meridian.

## Out of scope for this epic

- Bi-directional GitHub Issues / Linear / Jira sync.
- Remote backend or OAuth multi-tenant.
- CSV as source of truth (export is derived only).

## Notes

- CSV export reserved since `00_scope.md` out-of-initial-scope.
- GitHub integration stays read-only per product positioning (control in Git files, not SaaS).
