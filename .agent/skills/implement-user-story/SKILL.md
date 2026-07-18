---
name: implement-user-story
description: Gates implementation of a Meridian user story — verifies ready true, Plan, deps and architecture refs before product code. Use with /implement-us US-XXXX before coding.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Implement user story (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `references/implement-gate-checklist.md` | **Mandatory** — gate before code |
| `.agent/references/templates/code-quality-at-us-time.md` | **Mandatory** — DRY, SRP during coding |
| Target US (`show --full`) | Full Intent + Plan from SQLite |
| `depends_on` US rows | Dependency status in DB |
| `docs/05_architecture.md` | Sections cited in Architecture refs |
| `docs/architecture/*.md` | When US cites detail files directly |
| `docs/04_principles.md` | DRY, SRP, layer table — mandatory this session |
| `../refine-user-story/references/refine-checklist.md` | When sending user back to refine |

## When to trigger

- Manager asks to implement, build, fix, or refactor for a US.
- Workflow `/implement-us US-XXXX`.
- After `/refine-us` when starting a coding session.

**Do not** use to close a US — use `complete-user-story` / `/complete-us`.

## Gate CLI (run first)

```bash
python3 .agent/scripts/meridian_db_cli.py implement-gate US-XXXX
python3 .agent/scripts/meridian_db_cli.py implement-gate US-XXXX --json
```

Exit `0` = pass; exit `1` = blocked (see checklist output).

Load US body:

```bash
python3 .agent/scripts/meridian_db_cli.py show US-XXXX --full
```

## Hard gate (block product code if any fail)

| Check | Requirement |
| ----------- | --------- |
| Architecture | `05_architecture.md` `approved` |
| US row | Exists in SQLite |
| `ready` | `ready: true` |
| Plan | Approach with ≥2 bullets; not placeholder |
| Dependencies | All `depends_on` at `✅` (`implement-gate` / `check_story_dependencies_satisfied`) |
| Status | `❌` or `🔶` (not ✅; not 🧊` without manager waiver) |

If `ready` is not `true` → **stop**; output blocker; recommend `/refine-us US-XXXX`.

## Procedure

1. Run `implement-gate US-XXXX`; if blocked → stop.
2. Read `implement-gate-checklist.md`, `code-quality-at-us-time.md`, `show --full` output, `04_principles`, dependency US summaries, architecture sections.
3. Report pass/fail per automated check + manual rows (session scope, principles read).
4. If **passed** → implement per Acceptance and Planned with **DRY + SRP**.
5. One US per session; cite `US-XXXX` in responses.
6. After delivery → manager reviews diff → `/complete-us` (do not self-close without evidence).

## Output

### Gate blocked

```txt
Implement blocked:
US:
Reason:
Checklist failures:
Next: /refine-us US-XXXX | /status | fix depends_on
```

### Gate passed

```txt
Implement gate passed:
US:
Architecture refs read:
DRY / SRP applied:
Acceptance focus:
Planned tests:
Proceeding with implementation (one US session).
After code: manager review → /complete-us US-XXXX
```
