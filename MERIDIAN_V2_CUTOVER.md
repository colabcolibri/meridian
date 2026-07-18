# Meridian v2 cutover runbook

> Preserve Meridian v1 (Markdown delivery files) on branch `meridian-v1-old`; continue Meridian 2.0+ (SQLite delivery store) on `main`.

## Pre-flight checklist

- [x] `python3 .agent/scripts/bootstrap_meridian_db.py .` succeeds
- [x] `python3 .agent/scripts/migrate_md_to_sqlite.py .` reports expected counts
- [x] `python3 .agent/scripts/validate_meridian.py . --sqlite-only` passes
- [x] `app-desktop/` removed — use VS Code extension (`app-visual-studio/`) for IDE visibility
- [x] v11: `board.json` and `/sync-board` removed — board reads `.meridian/meridian.db` only
- [ ] Extension smoke: Board + Deliverables on dogfood at repo root

## 1. Tag or branch v1 lineage

**Branch:** `meridian-v1-old` — last v1 tip before SQLite on `main` (see `git log meridian-v1-old`).

```bash
git checkout meridian-v1-old   # read-only archive
git checkout main              # current work
```

Lineage docs on v1 branch: [MERIDIAN_V2_CUTOVER.md on meridian-v1-old](https://github.com/colabcolibri/meridian/blob/meridian-v1-old/MERIDIAN_V2_CUTOVER.md).

## 2. Announce on main

- README lineage section points to `meridian-v1-old` for Markdown protocol reference
- Dogfood `docs/` lives at repository root (phase docs only)
- Delivery: `.meridian/meridian.db` (gitignored)
- No `docs/kanban/board.json` in v11 — kanban is a SQLite read in the extension

## 3. Kit write path (v11)

When `meridian.db` exists:

- `/create-us` → `meridian_delivery.py create-us` or `meridian_db_export.py --write-form`
- `/refine-us` → `update-us` + `set-ready`
- `/implement-us` → `meridian_delivery.py implement-gate US-XXXX` then code
- `/complete-us` → `update-us` with Record + status
- Phase docs (`00`–`11`) → still Markdown

## 4. Rollback

```bash
git checkout meridian-v1-old
# or restore docs/us from branch and remove .meridian/meridian.db
```

## 5. Do not

- Force-push `main` without explicit manager approval
- Commit `meridian.db` to git (gitignored)
- Auto-delete `docs/us/` after migration without manager approval
- Recreate `docs/kanban/board.json` as source of truth (v11)

## Manager sign-off

| Step | Owner | Date |
| ---- | ----- | ---- |
| Migration verified | done | 2026-07-18 |
| Branch `meridian-v1-old` created and pushed | done | 2026-07-18 |
| v11 board.json removed | done | 2026-07-18 |
| Team notified | pending | |
