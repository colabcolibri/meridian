---
description: Daily workflow for managers using AI agents with Meridian — orient, implement, close US.
---

# /daily-with-ai — daily AI workflow

$ARGUMENTS

---

## Critical rules

1. Human manager approves; agents execute within `docs/`.
2. One US per implementation cycle when possible.
3. Code only with minimum docs: `05_architecture` approved; epic/version in folders; then US.
4. Always close with `complete-user-story` or `/complete-us` — never ✅ in chat only.
5. `board.json` is derived — use `/sync-board` after changing US.

---

## Who it is for

People who have already read **Start here** and **Usage guide** in the app (three phases: document → backlog → execute).

---

## Daily loop

### 1. Orient

```txt
Agent: process-manager
Skill: meridian-routing (optional)
Command: /status
App: Settings tab + **Decisions** (log) + Board
```

- Identify blockers (draft docs, US deps).
- Choose next unblocked Must US.

### 2. Contextualize

```txt
Cite: US-XXXX or docs/us/US-XXXX.md
Prompt: "Implement US-XXXX per acceptance. Do not mark ✅ without evidence."
```

- Always cite US ID.
- For phase docs: cite file (`05_architecture.md`) + appropriate agent.

### 3. Implement

- Agent reads US, architecture, dependencies before coding.
- Manager reviews diff.
- Partial → `🔶` + `Missing:` in US acceptance.

### 4. Close

```txt
Agent: board-keeper
Skill: complete-user-story
Command: /complete-us US-XXXX
Then: /sync-board
```

- Fill `## Technical implementation` (files + layers).
- Acceptance `[x]`, status `✅`, tests documented.
- Cross-cutting decision → skill `update-decisions-log` (`docs/decisions/YYYY-MM-DD.json`).

### 5. Review

- App: Board tab — US in correct column?
- Technical implementation consistent with what was tested?

---

## Day-to-day commands

| Command | Use |
| ------- | --- |
| `/status` | Session start |
| `/create-us` | New task (gates OK) |
| `/complete-us` | Close US after implementation |
| `/sync-board` | Regenerate kanban JSON |
| `/plan-sprint` | Work slice in version |
| `/create-epic` | New product capability |
| `/architecture` | Doc 05 before structural change |
| `/security-pass` | Doc 02 before sensitive feature |

---

## Anti-patterns

- Code without US or minimum phase docs.
- ✅ in chat without updating `docs/us/US-XXXX.md`.
- Editing `board.json` by hand.
- Single conversation mixing many features.
- `approved` on phase doc without human review.

---

## Expected output

```txt
Session:
US worked:
Final status:
Board updated: yes | no
Remaining blockers:
Suggested next US:
```

---

## References

| Resource | Path |
| ------- | ------- |
| Master protocol | `.agent/MERIDIAN.md` |
| Close US | `.agent/workflows/complete-us.md` |
| App — guides | **Start here** and **Usage guide** tabs / `meridian-concepts.ts` |
| Human guides | `.agent/references/start-here.md` · `.agent/references/usage-guide.md` (cheat sheet: Daily loop section) |
