# Implement gate checklist — before product code

Use with `/implement-us US-XXXX` **before** any Write on product code for that story.

**Hard block:** if any required row fails → do **not** implement; report blocker and next command (`/refine-us`, `/status`, etc.).

---

## Required gates

| # | Check | Pass when |
| - | ----- | --------- |
| 1 | `05_architecture.md` | `status: approved` |
| 2 | Epic + version | `epic:` and `version:` exist in folders |
| 3 | `ready` | Frontmatter `ready: true` (set only by `/refine-us`) |
| 4 | `## Plan` | Present; not placeholder; Approach has ≥2 explanatory bullets |
| 5 | Architecture refs | Each ref in Plan resolves to a section in `05_architecture.md` |
| 6 | `depends_on` | Every listed US has `status: ✅` |
| 7 | Story status | `❌` or `🔶` (not ✅ closed; not 🧊 frozen without manager waiver) |
| 8 | Session scope | One US id cited; manager did not bundle unrelated features |

---

## After gate passes

1. Read full `docs/us/US-XXXX.md` (Intent + Plan).
2. Read every Architecture ref path/§ before coding.
3. Implement against Acceptance + Planned steps only.
4. Do **not** mark `✅` in chat — close with `/complete-us` after review.
5. Partial work → `🔶` + `Missing:` in Acceptance; no `/complete-us` yet.

---

## Block messages (use verbatim pattern)

```txt
Blocked — cannot implement US-XXXX:
Reason: ready is false (run /refine-us US-XXXX first)
```

```txt
Blocked — cannot implement US-XXXX:
Reason: depends_on US-YYYY not ✅
```
