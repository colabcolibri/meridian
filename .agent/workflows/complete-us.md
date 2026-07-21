---
description: Close a Meridian user story after implementation — fill technical summary, acceptance and status.
---

# /complete-us — close user story

$ARGUMENTS

---

## Critical rules

1. Use `backlog-refiner` + `@[skills/complete-user-story]`
2. **Gate:** implementation delivered; applicable tests passed; `depends_on` at `✅`
3. **Mandatory read:** `implementation-template.md` + `us-template.md` + `section-contracts.md` + target US **before** editing status
4. **Do not** mark `✅` with placeholder in `## Record`
5. Cross-cutting close gate: approved phase doc, kit/protocol, or security change → `prepend-decision` + `YYYY-MM-DD — title` in US Related decisions (skill + `date` before CLI)
6. suggested commit line in ### Executed

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: COMPLETE US

RULES:
1. backlog-refiner Phase 0 — verify US id and dependencies
2. Inspect git diff / files touched for evidence
3. Fill ## Record (Files + layers + Executed)
4. Mark Intent/Acceptance [x]; update Plan/Planned [x]; set tests_status: done
5. Set status ✅ (or 🔶 + Missing: if partial) — only ✅ if tests: none or tests_status: done
6. `update-us` (stdin heredoc) with status ✅ and filled Record
7. `prepend-decision` if protocol/architecture changed
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
