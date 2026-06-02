---
name: complete-user-story
description: Closes a Meridian user story after implementation — fills Technical implementation, acceptance, status and board. Use when marking US done, completing US-XXXX, or after implementing a user story.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Complete user story (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `references/implementation-template.md` | When filling `## Technical implementation` |
| `../create-user-story/references/us-template.md` | Full US structure |

## When to trigger

- Code (or product docs) implementation finished for a US.
- Manager asks to mark US as `✅`.
- Workflow `/complete-us` or explicit post-implementation closure.

**Do not** use on US creation — use `create-user-story`.

## Preconditions (hard gate)

| Check | Requirement |
| ----------- | --------- |
| US exists | `docs/us/US-XXXX.md` |
| Dependencies | Every `depends_on` with status `✅` |
| Evidence | Applicable build/lint/test passed |
| Acceptance | Criteria proven (mark `[x]`) |

If anything fails → **do not** mark `✅`; use `🔶` with `Missing:` in acceptance.

## Procedure

1. Read `docs/us/US-XXXX.md` and identify scope (acceptance + `done_when`).
2. Inspect what was delivered: `git diff`, changed files, test output.
3. Replace `## Technical implementation` with the **real record** (see `references/implementation-template.md`):
   - paths relative to repo (not bare filenames);
   - summary per layer (Backend, Frontend, Scripts, Docs);
   - remove placeholders `_(fill in...)_` and prior plans that do not match code.
4. In `## Tests`:
   - mark `[x]` on **all** **Planned** items;
   - fill **Executed** with command/check + result (date optional);
   - update frontmatter `tests_status: done` (when `tests: required`).
5. Mark acceptance `[x]` with objective evidence.
6. Update frontmatter `status: ✅` (or `🔶` if partial + `Missing:`). Only mark `✅` if `tests: none` **or** `tests_status: done`.
7. Invoke `generate-board-json`.
8. If relevant cross-cutting change → `update-decisions-log` (local US decisions stay in Technical implementation).

## Validations before marking `✅`

- `## Technical implementation` filled — not placeholder, not plan only.
- `### Files` section lists real paths touched (or `_n/a_` with explicit justification).
- Every verifiable acceptance item is `[x]` or has `Missing:` with status `🔶`.
- `depends_on` satisfied.
- If `tests: required`: `tests_status: done`, all **Planned** `[x]`, **Executed** filled.

## Output

```txt
US completed:
File:
Status:
Implementation summary: (1 line)
Files touched: (count)
Tests run:
Board updated:
Decisions logged: yes | no
Open items:
```
