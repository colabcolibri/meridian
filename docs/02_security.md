---
title: Security
status: approved
version: 1.2
updated: 2026-07-18
depends_on: [00_scope.md, 01_tech_stack.md]
blocks: [03_user_types.md, 04_principles.md]
---

# 02 — Security

## Authentication model

No authentication in the local harness or extension. Single operator on the machine.

## Authorization model

No role-based permissions in the product. The human manager directs agents; agents follow kit rules and US gates (`ready`, `Record`, architecture `approved`).

## Data protection

- No sensitive credentials required for the harness itself.
- Phase docs and SQLite delivery may contain project information — treat as local workspace data.
- VS Code extension performs **local disk writes only** under resolved `docs/` (phase docs, `decisions/`) and `.meridian/meridian.db` — no network calls, no telemetry.

## VS Code extension (`app-visual-studio/`)

| Control | Rule |
| ------- | ---- |
| Write scope (phase) | `docs/00`–`11`, `docs/discovery/`, `docs/architecture/`, `docs/inventory/` |
| Write scope (delivery) | `.meridian/meridian.db` via `meridian_delivery.py` — not legacy `docs/us/`, `docs/epics/`, etc. |
| Path traversal | Reject writes outside project root + resolved workspace paths |
| Kit (`.agent/`) | Read for detection; do not modify kit files from extension commands |
| Scripts | Spawn `python3` with explicit script path under `.agent/scripts/`; pass project root as argv — no shell injection from UI input |
| Network | No HTTP/HTTPS from extension code |
| Secrets | Do not read or write `.env`; do not store tokens in extension `globalState` |
| Agent safety | Extension does not auto-commit; manager runs Git separately |

Disk writes from the extension must mirror what agents do in Cursor: phase Markdown + JSON decisions + SQLite delivery; evidence before `status: ✅`.

## Input validation

- Meridian structure validations run in kit Python (`validate_meridian.py`, section contracts).
- Required US fields validated before `ready: true` and before `status: ✅`.
- Status `🔶` must include `Missing:` in acceptance.

## Rate limiting

Out of scope — local-only product.

## Audit and logs

- Decisions: append-only SQLite `decisions` table via `prepend-decision`.
- Editing an `approved` phase doc should trigger `update-decisions-log` and set doc `status: review`.

## Secrets management

- `.env`, `.env.*`, and local secret files do not go in Git.
- `.env.example` may go in Git as a configuration contract.
- No secrets in `localStorage` or extension `globalState`.

## Compliance

No specific regulatory compliance in the first version. Avoid collecting unnecessary personal data.

## OWASP Top 10

Initial risk is low because there is no remote backend. Still:

- Validate rendered data to avoid injection in webview previews.
- Do not execute Markdown content as code.
- Do not persist secrets in browser or extension storage.
