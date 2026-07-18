---
name: create-user-story
description: Creates a Meridian user story row in SQLite after architecture is approved. Use when adding backlog items via /create-us, writing acceptance criteria, or when the user mentions US-, user story, or kanban.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create user story (Meridian)

> **v11:** insert row in `.meridian/meridian.db` — **never** `docs/us/US-XXXX.md` when the DB exists.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/delivery-connector-schema.md` | **Mandatory** — `delivery.json` + facade |
| `.agent/references/templates/sqlite-delivery-operations.md` | **Mandatory** — sqlite driver / ER |
| `.agent/references/templates/writing-guide.md` | **Mandatory** — prose |
| `.agent/references/templates/code-quality-at-us-time.md` | **Mandatory** — DRY, SRP |
| `.agent/references/templates/INDEX.md` | Protocol |
| `references/us-template.md` | **Mandatory** — `body_markdown` shape |

## Delivery commands

```bash
# Discover parents + next id
python3 .agent/scripts/meridian_delivery.py list epics
python3 .agent/scripts/meridian_delivery.py list versions
python3 .agent/scripts/meridian_delivery.py list user_stories

# Read context
python3 .agent/scripts/meridian_delivery.py show EPIC-XX --full
python3 .agent/scripts/meridian_delivery.py show US-YYYY --full   # depends_on

# Create (pick one)
python3 .agent/scripts/meridian_delivery.py create-us --title "..." --epic EPIC-XX --version vX
python3 .agent/scripts/meridian_db_export.py . --entity us --id US-XXXX --write-form < form.json
```

Assign next `US-XXXX` = highest existing id + 1. Set `ready: false` on create.

## Preconditions (hard gate)

| Doc | Required status |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| epic/version in SQLite | rows exist for FK targets |
| Referenced epic | exists in SQLite (`meridian_delivery.py list epics`) |
| Referenced version | exists in SQLite (`meridian_delivery.py list versions`) |
| Profile in `03_user_types.md` | exists |

Frontmatter links `epic:` — **do not paste epic text** into the body. Explain **this slice** in Why / Where / Approach.

## Phase 0 — clarify before writing

If the request is vague, ask (then write):

1. Who is the user (`03_user_types.md`)?
2. What **single slice** does this US deliver — not the whole epic?
3. What exists today vs after **this US only**?
4. What does `depends_on` provide; what does this unblock? **Each `depends_on` entry must be an existing `US-XXXX` PK** already in SQLite (FK). Use `meridian_delivery.py list user_stories` or form catalog — never invent ids.
5. How will we know it is done (`done_when` + acceptance)?

Read linked epic and dependency US **for understanding** — write in your own words.

## Writing rules (mandatory)

| Section | Rule |
| ------- | ---- |
| **Why** | 2–4 sentences: problem, before/after for this slice |
| **Where** | 2–4 sentences: version, deps, next US — cite ids, not epic body |
| **Approach** | optional at create; add on refine if bullets help |
| **Acceptance** | 2–4 observable checklist items — not a copy of Approach |
| **Architecture refs** | May use `§ TBD` at create; `/refine-us` fills exact heading |
| **Out of scope** | Prevents SRP violations — what this slice does **not** touch |
| **Code quality** | Read `code-quality-at-us-time.md`; one slice = one concern |

Forbidden: telegraphic stubs, repeating acceptance under Approach, “see EPIC-XX” without explanation.

## Procedure

1. Read `writing-guide.md` + `code-quality-at-us-time.md` + `sqlite-delivery-operations.md` + `us-template.md`.
2. Read epic/version/dependency US via `meridian_delivery.py show --full` for context.
3. Next ID = highest `US-XXXX` + 1 (`meridian_delivery.py list user_stories`).
4. Compose full US body (Why / Where / Approach) per `us-template.md`.
5. Set `ready: false` — implement blocked until `/refine-us`.
6. Save via `meridian_delivery.py create-us` or `meridian_db_export.py --write-form` — **never** `docs/us/*.md` when DB exists.
7. `update-decisions-log` if acceptance model changes.

## Validations before saving

- Every `##` / `###` from template present
- Why + Where + Approach filled with real sentences (not placeholders)
- `ready: false`
- `done_when` measurable
- `depends_on`: only existing `US-XXXX` PKs (empty `[]` if none); cite ids in Why/Where to explain system links

## Output

```txt
US created:
ID: US-XXXX
Epic: EPIC-XX
Version: vX
Depends on:
Narrative complete: yes | needs refine
SQLite saved: yes | no
Open questions:
Next: /refine-us US-XXXX
```
