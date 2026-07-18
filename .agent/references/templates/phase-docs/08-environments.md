# Phase doc template — `08_environments.md`

**Agent:** `technical-writer`  
**Depth bar:** at least **local dev** documented; prod if applicable.

## Frontmatter

```yaml
---
title: Environments
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [01_tech_stack.md, 05_architecture.md]
blocks: []
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Local development** | Prerequisites, install, run commands | Copy-pasteable commands |
| **Environment variables** | Table: name \| purpose \| secret? | No secret values in doc |
| **Staging / production** | Hosting, deploy path — or `_n/a_` | |
| **CI/CD** | Pipeline file paths, gates (lint, test) | Cite `.github/workflows` etc. |

## Anti-patterns

- Missing local setup when README already has it — merge, don’t contradict
