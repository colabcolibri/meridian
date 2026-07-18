# Phase doc template — `00_scope.md`

**Agent:** `product-owner` (content) + `technical-writer` (structure)  
**Blocks:** `01`, `04`, `05`  
**Depth bar:** every `##` has ≥2 sentences or ≥2 substantive bullets; no empty sections.

## Frontmatter

```yaml
---
title: Scope
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Name and description** | Product name + 2–4 sentences: what it is, where it runs | Concrete noun, not “the app” |
| **Problem it solves** | Before/after for users; why now | States pain, not feature list |
| **Who it is for** | Primary users; optional secondary | Roles named; matches `03_user_types` later |
| **In initial scope** | Bullet list of v1 capabilities | Observable outcomes, not tech tasks |
| **Out of initial scope** | Explicit deferrals | Non-empty; prevents creep |
| **Known constraints** | Tech, team, legal, timeline | Real limits or `None documented` |
| **Assumptions** | What you guessed | Labeled; weak guesses → Open questions |
| **Open questions** | Unresolved interview items | Empty only if manager confirmed all |

## Mode B extra

Add **Current product state** — paragraph + bullets from high-confidence inventory rows (what already ships).

## Anti-patterns

- Pasting epic bodies or US text
- “TBD” without an open question
- In scope = folder list without user value
