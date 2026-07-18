---
name: complete-user-story
description: Closes a Meridian user story after implementation — fills Record, acceptance, status in SQLite. Use when marking US done, completing US-XXXX, or after implementing a user story.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Complete user story (Meridian)

> **v11:** delivery row in `.meridian/meridian.db` — update `user_stories.body_markdown` + columns via CLI. **Never** hand-edit `docs/us/*.md`.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/sqlite-delivery-operations.md` | **Mandatory** — upsert / form API |
| `.agent/references/templates/INDEX.md` | Before closing any US |
| `.agent/references/templates/section-contracts.md` | Verify all `##` / `###` still match contract |
| `references/implementation-template.md` | **Mandatory** — shape of `## Record` inside `body_markdown` |
| `.agent/references/commit-after-us-close.md` | Commit timing — suggest only on close |
| `.agent/references/scrum-meridian-map.md` | DoD vs `04_principles.md` |
| `../create-user-story/references/us-template.md` | Full section contract (not a disk path) |

## CLI (v11)

Run from **package root** (folder with `docs/` + `.meridian/meridian.db`).

```bash
# 1. Read current row (mandatory)
python3 .agent/scripts/meridian_db_cli.py show US-XXXX --full

# 2. Optional — validator before close
python3 .agent/scripts/validate_meridian.py . --sqlite-only

# 3. Persist closure (pick one)

# 3a. Markdown file with full US body (frontmatter + sections)
python3 .agent/scripts/meridian_db_cli.py update-us US-XXXX --from-file /tmp/us-close.md

# 3b. Structured form (extension / agents)
python3 .agent/scripts/meridian_db_export.py . --entity us --id US-XXXX --format form
# edit JSON → stdin:
python3 .agent/scripts/meridian_db_export.py . --entity us --id US-XXXX --write-form < form.json
```

**On save:** set `status: ✅` (or `🔶` + `Missing:`), acceptance `[x]`, filled `## Record`, `tests_status: done` when `tests: required`. Extension board refreshes when `meridian.db` changes (sync-board command removed in v11).

## When to trigger

- Implementation finished for a US.
- Manager asks to mark US as `✅`.
- Workflow `/complete-us` or explicit post-implementation closure.

**Do not** use on US creation — use `create-user-story`.

## Preconditions (hard gate)

| Check | Requirement |
| ----------- | --------- |
| US exists | `meridian_db_cli.py show US-XXXX` |
| Dependencies | Every `depends_on` with status `✅` |
| Evidence | Applicable build/lint/test passed |
| Acceptance | Criteria proven (mark `[x]`) |
| DoD | `docs/04_principles.md` satisfied |

If anything fails → **do not** mark `✅`; use `🔶` with `Missing:` in acceptance.

## Procedure

1. Run `show US-XXXX --full`; read `implementation-template.md` + `section-contracts.md`.
2. Identify scope (`done_when`, Acceptance, Plan refs).
3. Inspect delivery: `git diff`, changed files, test output.
4. Edit **markdown body** (not a new file under `docs/us/`):
   - Replace `## Record` per `implementation-template.md` (real paths, layers, Executed).
   - Mark Plan `### Planned` items `[x]`; fill `### Executed` with commands + results.
   - Add **suggested commit:** in Executed (`commit-after-us-close.md`).
5. Mark Intent/Acceptance `[x]` with evidence.
6. Set frontmatter: `status`, `tests_status` as needed.
7. Save with `update-us --from-file` or `--write-form` (step 3 above).
8. Cross-cutting change → `update-decisions-log` skill + `date` before Write.

## Validations before `status: ✅`

- `## Record` filled — not placeholder.
- `### Files` lists real paths (or `_n/a_` justified).
- Every acceptance `[x]` or `🔶` + `Missing:`.
- `depends_on` satisfied.
- `tests: required` → `tests_status: done`, Planned `[x]`, Executed filled.

## Output

```txt
US completed:
ID: US-XXXX
Status: ✅ | 🔶
SQLite saved: yes | no
Implementation summary: (1 line)
Files touched: (count)
Tests run:
Decisions logged: yes | no
Suggested commit: (line — human commits after)
Next (human): git commit per commit-after-us-close.md
Open items:
```
