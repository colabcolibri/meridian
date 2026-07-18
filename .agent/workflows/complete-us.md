---
description: Close a Meridian user story after implementation — fill Record, acceptance and status in SQLite.
---

# /complete-us — close user story

$ARGUMENTS

---

## Critical rules

1. Use `backlog-refiner` + `@[skills/complete-user-story]`
2. **Mandatory read:** `sqlite-delivery-operations.md` + `implementation-template.md` + `section-contracts.md`
3. **Gate:** implementation delivered; tests passed; `depends_on` at `✅`
4. **Do not** mark `✅` with placeholder in `## Record`
5. **CLI (v11):** `show US-XXXX --full` → edit body → `update-us --from-file` or `--write-form` — never `docs/us/*.md`
6. `update-decisions-log` only if cross-cutting — run `date` before Write
7. **suggested commit** in `### Executed` — human commits per `commit-after-us-close.md`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: COMPLETE US

RULES:
1. meridian_delivery.py show US-XXXX --full
2. Inspect git diff / test output for evidence
3. Fill ## Record (Files + layers + Executed + suggested commit)
4. Mark Acceptance [x]; Planned [x]; tests_status: done when required
5. status ✅ (or 🔶 + Missing:)
6. update-us or --write-form
7. validate_meridian.py . --sqlite-only when kit changed
```

---

## Output

```txt
US completed:
ID: US-XXXX
Status:
SQLite saved: yes | no
Implementation summary:
Files touched:
Tests run:
Decisions logged:
Suggested commit:
Next (human): commit per commit-after-us-close.md
Open items:
```

---

## Examples

| Request | Result |
| ------ | --------- |
| `/complete-us US-0034` | US-0034 Record + ✅ in SQLite |
| `/complete-us` without id | Ask which US or infer from session |
| Partial implementation | 🔶 + Missing:; do not force ✅ |
