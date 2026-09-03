---
name: us-refine
description: Refines a Meridian user story in SQLite for implementation — deepens Approach, architecture refs and tests. Use between /create-us and coding.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Refine user story (Meridian)

> **v11:** persist with `update-us` (stdin heredoc) only.
> **Forbidden:** `.meridian/drafts/`, `us-*-refine.md`, helper `.py` for delivery. **Always** `show --full` before `update-us`; send the **entire** document (merge in place — `update-us` replaces `body_markdown`).

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/writing-guide.md` | Approach depth |
| `.agent/references/templates/code-quality-at-us-time.md` | **Mandatory** |
| `references/refine-checklist.md` | **Mandatory** |
| `references/us-template.md` | Full structure |
| Target US | `meridian_delivery.py show US-XXXX --full` |
| `docs/05_architecture.md`, `docs/04_principles.md` | Refs + DRY/SRP |

## Delivery commands

```bash
python3 .agent/scripts/meridian_delivery.py show US-0115 --full
python3 .agent/scripts/meridian_delivery.py update-us US-0115 <<'EOF'
(full US markdown)
EOF
# Do not set-ready — story-checker /review-us
```

Never Write `docs/us/`. No `generate-board-json` — upsert records `board_snapshots`.

After refine, `ready` stays **false**. Attest is `/review-us` (`story-checker`). Do **not** run `set-ready true`.

## Procedure

1. Read guides, checklist, **`show --full`**, architecture sections.
2. Deepen Why/Where if needed; **expand Approach** (≥2 bullets).
3. Exact Architecture refs; DRY/SRP pass; concrete Planned steps.
4. `update-us US-XXXX` (stdin) with **full markdown from step 1** + edits; keep `ready: false`.
5. Handoff to `story-checker` `/review-us` for DoR attest.
6. `prepend-decision` if scope changed.

## Output

```txt
US refined:
ID: US-XXXX
Ready for implementation: no (await /review-us)
Handoff: story-checker /review-us
Approach explanatory: yes | no
Architecture § exact: yes | no
Blockers:
Next: /implement-us US-XXXX
```
