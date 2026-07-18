# Meridian v2 cutover runbook

> Preserve Meridian v1 (Markdown delivery files) on branch `meridian-v1-old`; continue Meridian 2.0 (SQLite delivery store) on `main`.

## Pre-flight checklist

- [x] `python3 .agent/scripts/bootstrap_meridian_db.py .` succeeds
- [x] `python3 .agent/scripts/migrate_md_to_sqlite.py .` reports expected counts
- [x] `python3 .agent/scripts/validate_meridian.py .` passes (DB mode)
- [x] `python3 .agent/scripts/generate_board.py .` updates `board.json`
- [x] `app-desktop/` removed — use VS Code extension (`app-visual-studio/`) for IDE visibility
- [ ] Extension smoke: Board + Deliverables on dogfood `docs/` at repo root

## 1. Tag or branch v1 lineage

From the last commit **before** Meridian 2.0 SQLite implementation:

**Branch:** `meridian-v1-old` → `70149ee` (`feat(kit): add PO discovery lane with /discover workflow`)

```bash
git branch meridian-v1-old 70149ee
git push -u origin meridian-v1-old
```

Record the SHA in `docs/decisions/YYYY-MM-DD.json`.

## 2. Announce on main

- README lineage section points to `meridian-v1-old` for Markdown protocol reference
- Dogfood `docs/` lives at repository root (not `app-desktop/docs/`)
- New delivery work uses SQLite when `.meridian/meridian.db` exists
- Legacy `docs/us/*.md` may remain as read-only archive — do not delete without manager approval

## 3. Kit write path

When `meridian.db` exists:

- `/create-us` → `python3 .agent/scripts/meridian_db_cli.py create-us ...`
- `/sync-board` → `python3 .agent/scripts/generate_board.py <package-root>`
- Phase docs (`00`–`11`) → still Markdown Write tool

## 4. Rollback

```bash
git checkout meridian-v1-old
# or restore docs/us from branch and remove .meridian/meridian.db
```

## 5. Do not

- Force-push `main` without explicit manager approval
- Commit `meridian.db` to git (gitignored)
- Auto-delete `docs/us/` after migration

## Manager sign-off

| Step | Owner | Date |
| ---- | ----- | ---- |
| Migration verified | done | 2026-07-18 |
| Branch `meridian-v1-old` created (`70149ee`) | done | 2026-07-18 |
| Branch pushed to origin | done | 2026-07-18 |
| `app-desktop/` removed; docs at repo root | done | 2026-07-18 |
| Team notified | pending | |
