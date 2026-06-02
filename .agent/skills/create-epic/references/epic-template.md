# Full epic template

```md
---
id: EPIC-XX
title: Short capability name
status: active
versions: [v1]
profiles: [Profile documented in 03_user_types.md]
outcome: "Objective sentence: when this epic is delivered at product level."
---

# EPIC-XX — Short capability name

## Capability

What the user can now do or what the product now offers.
Describe in product language, not folder or class in `src/`.

## Expected outcome

Paragraph expanding frontmatter `outcome` — how the manager knows the epic can be marked `complete`.

## Out of scope for this epic

- What belongs to another epic or version
- What is implementation detail (that goes in US)

## Notes

- Links, decisions in `docs/decisions/`, risks
```

## Epic status

| Value | Meaning |
| ----- | ----------- |
| `active` | Capability in delivery; US can be created |
| `complete` | Outcome reached; only closure or bugfix US |
| `paused` | Deliberately frozen (e.g. distant v2) |

## Relationship with user stories

- Epic = **what** and **why** (product capability).
- US = **executable slice** with verifiable acceptance.
- In US use only: `epic: EPIC-XX` — reference by ID, do not paste epic text.

## After creating

1. Validate with `python .agent/scripts/validate_meridian.py <project-root>`.
2. Only create US when `05_architecture.md` is `approved` and epic/version exist in folders.
3. New US → skill `create-user-story`.
