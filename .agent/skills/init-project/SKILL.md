---
name: init-project
description: Initializes a project with Meridian docs, decision log, board JSON and minimum governance. Use when starting a new project or repairing a missing Meridian structure.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Init project (Meridian)

> Creates minimum structure in `docs/` for governance before any product code.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before creating phase docs or pointing manager to templates |
| `references/doc-templates.md` | **Mandatory** before creating phase files and first decision |
| `references/gitignore-baseline.md` | Before `npm install` or first commit |

## When to trigger

- New project with Meridian intent
- `.agent/` exists but `docs/` missing
- Incomplete or corrupted structure
- Agent tried to implement without document base

## Phase 0 — context check

1. Read `.agent/MERIDIAN.md` if it exists.
2. Confirm target folder and user authorization to create files.
3. If project intent missing → maximum **3 questions** (problem, user, constraints).

## Procedure

1. Check if `docs/` exists.
2. If absent, create tree:

```txt
docs/
  README.md
  00_scope.md … 11_decisions.md
  decisions/
  epics/
  versions/
  sprints/
  us/
  templates/          # symlinks to kit delivery templates (recommended)
  kanban/board.json
```

3. Apply frontmatter from `references/doc-templates.md` on each doc (`status: draft`, except initial decision).
4. `11_decisions.md` (stub) + `docs/decisions/YYYY-MM-DD.json` with entry "Project started with Meridian".
5. `00_scope.md`: draft with explicit assumptions if needed.
6. `board.json`: `[]`
7. Validate `.gitignore` with `references/gitignore-baseline.md`.
8. **Do not** create US, app, API, database or migrations.

## Checkpoints

| # | Check |
| - | ----------- |
| 1 | `docs/`, `decisions/`, `epics/`, `versions/`, `us/`, `sprints/`, `board.json`, `11_decisions`, `00_scope` exist |
| 2 | `.env*` protected in `.gitignore` |
| 3 | No product code created |

## Prohibitions

| Forbidden | Allowed |
| -------- | --------- |
| Mark phase docs as `approved` without human | `draft` + assumptions |
| Create US | Empty `us/` structure |
| Implement features | Docs + initial decision |

## Output

```txt
Meridian initialized:
Created:
Pending:
Blocked:
Assumptions:
Next human decision:
```
