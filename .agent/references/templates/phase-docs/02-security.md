# Phase doc template — `02_security.md`

**Agent:** `security-champion` (deepen via `/security-pass`)  
**Depends on:** `00_scope`, `01_tech_stack`  
**Depth bar:** unknowns go to **Gaps / open questions**, not silent omission.

## Frontmatter

```yaml
---
title: Security
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [00_scope.md, 01_tech_stack.md]
blocks: [03_user_types.md, 04_principles.md]
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Authentication model** | How users/agents prove identity; or none | Matches code or explicit “no auth” |
| **Authorization model** | Roles, permissions, gates | Links to `03_user_types` profiles |
| **Data protection** | PII, encryption, retention | States what data exists |
| **Secrets and configuration** | `.env`, vault, CI secrets | How secrets are loaded; never commit |
| **Agent / automation safety** | If AI or scripts write disk/Git | Scope of writes; human approval |
| **Threat notes** | Top 3 risks for this product | Or “local-only harness — see gaps” |
| **Gaps / open questions** | Unknown auth, missing HTTPS, etc. | Non-empty at init unless reviewed |

## Anti-patterns

- Copy-paste OWASP essay without product specifics
- Claiming “secure” without controls
