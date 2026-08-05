---
name: complete-user-story
description: Closes a Meridian user story in SQLite after implementation — fills Record, acceptance, status. Use when marking US done or after /implement-us.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Complete user story (Meridian)

> **v11:** persist with `patch-record` (preferred) or `update-us` (full heredoc) — never `docs/us/*.md`.  
> **Forbidden:** helper `.py` scripts to batch-close or generate US markdown.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before closing |
| `.agent/references/templates/section-contracts.md` | Section contract — Plan **unchanged** on close |
| `references/implementation-template.md` | **Mandatory** for `## Record` shape only |
| `.agent/references/commit-after-us-close.md` | Suggested commit only |
| `../create-user-story/references/us-template.md` | Full structure when full `update-us` is required |

## Delivery commands

**Preferred (close):**

```bash
python3 .agent/scripts/meridian_delivery.py show US-0115 --full   # mandatory first
python3 .agent/scripts/meridian_delivery.py patch-record US-0115 <<'EOF'
---
status: ✅
tests_status: done
---
## Record

### Files

- `path/to/file.ts` — what changed

### Backend

- _n/a_

### Frontend

- _n/a_

### Scripts / Docs

- _n/a_

### Executed

- `pnpm test` — passed
- **suggested commit:** `feat(scope): summary (US-0115)`

## Intent

### Acceptance

- [x] criterion one
- [x] criterion two
EOF
```

**Full replace (only when Intent/Plan/frontmatter must change beyond close):**

```bash
python3 .agent/scripts/meridian_delivery.py show US-0115 --full
# edit the printed markdown in place — keep Intent/Plan/Approach unless deliberately changing scope
python3 .agent/scripts/meridian_delivery.py update-us US-0115 <<'EOF'
(entire US markdown from show --full + your edits)
EOF
```

```bash
python3 .agent/scripts/meridian_delivery.py set-summary US-0115 --text "4-8 sentence summary"
python3 .agent/scripts/meridian_delivery.py lifecycle-eligible US-0115
```

## Preconditions

| Check | Requirement |
| ----------- | --------- |
| US row | exists (`show US-XXXX --full` **before** any write) |
| Dependencies | all `depends_on` at `✅` |
| Evidence | tests/build passed |
| Record | real paths, not placeholders |
| Plan | Approach from `/refine-us` preserved — do not rebuild from `implementation-template.md` alone |

## Procedure

1. **`show --full` (mandatory)** — load existing markdown; never close from template memory.
2. Read `implementation-template.md` for Record **shape** only.
3. Inspect `git diff` / test output; fill `## Record` with real paths.
4. Mark acceptance `[x]`; `tests_status: done` when required; mark Planned `[x]` where done.
5. **Persist:** `patch-record` with frontmatter + `## Record` + `### Acceptance` patch — **or** `update-us` with the **entire** document from step 1 (Intent/Plan/Approach unchanged unless scope changed).
6. **Never:** one-shot `.py` scripts, batch-close generators, or `update-us` with only `## Record` (replaces full body and wipes refine).
7. **Before close:** approved phase doc / kit / security change → `prepend-decision` + cite in Plan **Related decisions**.
8. **Lifecycle cascade:** `lifecycle-eligible US-XXXX`; ask manager before sprint/epic/version close.

## Output

```txt
US completed:
ID: US-XXXX
Status:
Persist path: patch-record | update-us
Implementation summary:
Files touched:
Decisions logged: yes | no
Suggested commit:
Lifecycle cascade:
  Sprint eligible: none | vX-SY → ask close?
  Epic eligible: none | EPIC-XX → ask close?
  Version eligible: none | vX → ask complete?
Next (human): commit per commit-after-us-close.md
```
