# Meridian v2 cutover runbook

> Preserve Meridian v1 (Markdown delivery files) on branch `meridian-v1-old`; continue Meridian 2.0 (SQLite delivery store) on `main`.

## Pre-flight checklist

- [ ] `python3 .agent/scripts/bootstrap_meridian_db.py app-desktop` succeeds
- [ ] `python3 .agent/scripts/migrate_md_to_sqlite.py app-desktop` reports expected counts
- [ ] `python3 .agent/scripts/validate_meridian.py app-desktop` passes (DB mode)
- [ ] `python3 .agent/scripts/generate_board.py app-desktop` updates `board.json`
- [ ] `cd app-desktop && pnpm build` exits 0
- [ ] Monitor loads Board/Deliverables from SQLite in `pnpm dev` (dogfood path)

## 1. Tag or branch v1 lineage

From the last commit **before** Meridian 2.0 SQLite merge (or current `main` if you want the full history including planning):

```bash
# Option A — branch (recommended)
git branch meridian-v1-old <commit-sha-before-v2>
git push -u origin meridian-v1-old

# Option B — tag
git tag meridian-v1-final <commit-sha-before-v2>
git push origin meridian-v1-final
```

Record the SHA in `docs/decisions/YYYY-MM-DD.json`.

## 2. Announce on main

- README lineage section points to `meridian-v1-old` for Markdown protocol reference
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
| Migration verified | | |
| Branch `meridian-v1-old` pushed | | |
| Team notified | | |
