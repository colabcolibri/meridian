---
id: EPIC-07
title: Native Desktop Shell
status: paused
versions: [v7]
profiles: [Process Manager, Local Operator]
outcome: "Monitor runs as a native desktop app with bundled validation and no dev-server Python bridge."
---

# EPIC-07 — Native Desktop Shell

## Capability

Tauri (or equivalent) wraps the existing Vite monitor so the manager opens `docs/` with native file access, persists the last folder, and runs `validate_meridian.py` / `generate_board.py` without the Vite dev-server API bridge.

## Expected outcome

User installs a desktop binary, selects `docs/`, validates and views board — same UX as v1 monitor, but production build no longer depends on `pnpm dev` + POST `/api/meridian/validate`.

## Out of scope for this epic

- Disk writes from the monitor (EPIC-05 / v2 extension).
- Marketplace distribution of the extension (v2/v4).
- Cloud sync or multi-user (EPIC-10 / v6 vision).

## Notes

- Architecture currently lists Tauri as pending post-v2 (`05_architecture.md`).
- Decision Tauri vs alternatives documented in US-0054 before scaffold.
