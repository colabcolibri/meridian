---
name: init-project
description: Initializes a project with Meridian docs, SQLite delivery DB and minimum governance.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Init project (Meridian)

> Creates `docs/` governance before product code. **All** phase docs `00`–`08` + `11` are created in Mode A; Mode B creates structure then hands off to `/document-project`.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/init-interview-guide.md` | **Mandatory** — interview gate |
| `references/doc-templates.md` | **Mandatory** — index + depth bar |
| `.agent/references/templates/phase-docs/*.md` | **Mandatory** — one per doc you Write |
| `.agent/references/templates/as-is-inventory-template.md` | Mode B pointer only |
| `references/gitignore-baseline.md` | Before first commit |
| `.agent/references/templates/INDEX.md` | Protocol |

## When to trigger

- New project with Meridian intent
- `.agent/` exists but `docs/` missing
- Incomplete structure (repair gaps only)
- Workflow `/init-meridian`

**Brownfield documentation body:** use skill `document-existing-project` (`/document-project`) — not full Mode B inside this skill in one turn unless manager insists.

---

## Interview gate (both modes)

1. Read `init-interview-guide.md`.
2. If context thin → run question bank (Mode A or B); do not Write `00_scope` with invented facts.
3. Pass gate or list **Open questions** in `00_scope`.

---

## Mode A — New project

### Procedure

1. Confirm target folder and authorization.
2. Create tree:

```txt
docs/
  README.md
  00_scope.md … 08_environments.md
  11_decisions.md
  decisions/
  discovery/          # optional empty; /discover may fill
```

3. Read `doc-templates.md` + **every** `phase-docs/0X-*.md` for docs `00`–`08`.
4. Write each phase doc with **depth bar** content from interview answers (not heading-only stubs).
5. `09_design_system.md` — stub only if UI product; skip for API/CLI-only.
6. `11_decisions.md` stub + `docs/decisions/YYYY-MM-DD.json` — “Project started with Meridian”.
7. Bootstrap: `meridian_delivery.py bootstrap` or `bootstrap_meridian_db.py <packageRoot>`.
8. `.gitignore` per `gitignore-baseline.md`.
9. **Do not** create US, epics, versions, product code.

### Recommended before init

`/discover` when product idea is still fuzzy → `docs/discovery/product-brief.md`.

---

## Mode B — Existing codebase

### Procedure

1. **Interview gate** — code read per `init-interview-guide.md` Mode B (inferences first).
2. Create same `docs/` tree as Mode A if missing (files may be minimal stubs **only** if `/document-project` runs immediately after in same session).
3. Bootstrap `.meridian/meridian.db` + `delivery.json`.
4. First decision JSON entry.
5. **Stop** — tell manager to run **`/document-project`** for inventory + populated phase docs.

Do **not** in Mode B init alone:

- Create epics, versions, sprints, US
- Mark docs `approved`
- Fill retroactive ✅ US

### Same session exception

If manager explicitly requests full init in one turn: run `document-existing-project` procedure after step 3.

---

## Multi-product manifest (when applicable)

If multiple `docs/` folders with Meridian fingerprint:

1. Read `projects-manifest-template.md`.
2. Propose `.meridian/projects.json`.
3. Set `default` after manager confirms.

---

## Checkpoints

| # | Check |
| - | ----------- |
| 1 | `docs/` `00`–`08`, `11` exist + `.meridian/` bootstrapped |
| 2 | Mode A: no empty `##` without TBD + reason |
| 3 | `.env*` in `.gitignore` |
| 4 | No product code / no US rows |
| 5 | Mode B: output points to `/document-project` unless same-session doc run |

## Prohibitions

| Forbidden | Allowed |
| -------- | --------- |
| `approved` without human | `draft` |
| Create US / epics | Empty SQLite schema |
| Heading-only phase docs (Mode A) | Full drafts per phase-docs |
| Replace root README (Mode B) | `docs/README.md` alongside |

## Output

```txt
Meridian initialized:
Mode: new project | existing codebase
Interview: complete | assumptions listed
Created: [paths]
Phase docs depth: ok | thin — run /document-project or /audit-docs
Bootstrap: meridian.db + delivery.json
Assumptions requiring human review:
Next: /document-project (Mode B) | /audit-docs | approve 00→04 | /discover
```
