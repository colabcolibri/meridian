---
description: Close a Meridian user story after implementation — fill technical summary, acceptance and status.
---

# /complete-us — close user story

$ARGUMENTS

---

## Critical rules

1. Use `backlog-refiner` + `@[skills/complete-user-story]`
2. **Gate:** implementation delivered; applicable tests passed; `depends_on` at `✅`
3. **Mandatory read:** `implementation-template.md` + `section-contracts.md` + **`show US-XXXX --full`** before any write
4. **Do not** mark `✅` with placeholder in `## Record`; CLI rejects batch-close boilerplate
5. **Prefer `patch-record`** — merges Record + Acceptance; **Plan/Approach unchanged** (see `section-contracts.md`)
6. **Forbidden:** helper `.py` to batch-close or generate US markdown
7. Cross-cutting close gate: approved phase doc, kit/protocol, or security change → `prepend-decision` + `YYYY-MM-DD — title` in US Related decisions
8. suggested commit line in ### Executed

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: COMPLETE US

RULES:
1. backlog-refiner Phase 0 — verify US id and dependencies
2. `show US-XXXX --full` — mandatory; edit in place, do not rebuild from template alone
3. Inspect git diff / files touched for evidence
4. Fill ## Record (Files + layers + Executed)
5. Mark Intent/Acceptance [x]; update Plan/Planned [x]; set tests_status: done
6. Set status ✅ (or 🔶 + Missing: if partial)
7. `patch-record` (preferred) OR `update-us` with **entire** markdown from step 2
8. `prepend-decision` if protocol/architecture changed
9. Lifecycle cascade — `lifecycle-eligible US-XXXX`; ask manager; on yes run complete-sprint / complete-epic
```

---

## Output

```txt
US completed:
ID: US-XXXX
Status:
Implementation summary:
Files touched:
Tests run:
Decisions logged:
Suggested commit:
Lifecycle cascade:
  Sprint eligible: …
  Epic eligible: …
  Version eligible: …
Next (human): commit per commit-after-us-close.md
Open items:
```

---

## Examples

| Request | Result |
| ------ | --------- |
| `/complete-us US-0034` | US-0034 with technical implementation + ✅ + board |
| `/complete-us` without id | Ask which US or infer from implementation session |
| Partial implementation | Status 🔶 + explicit Missing:; do not force ✅ |
