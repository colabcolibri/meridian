# Phase doc template — `03_user_types.md`

**Agent:** `technical-writer` + `product-owner` review  
**Depends on:** `02_security.md`  
**Depth bar:** ≥1 primary profile with all fields filled.

## Frontmatter

```yaml
---
title: User Types
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [02_security.md]
blocks: [04_principles.md, 05_architecture.md, 06_database.md, 07_api_contracts.md]
---
```

## Profile template (repeat per type)

```markdown
## [Profile name]

- **Description:** …
- **Origin:** how they reach the product (web, CLI, IDE, API)
- **Permissions:** what they can do
- **Restrictions:** what they cannot do
- **Session:** auth/session model or none
- **Visible data:** what they see
- **Edge cases:** errors, missing access, empty state
```

## Pass when

- Every profile in `00_scope` “Who it is for” appears here
- Permissions consistent with `02_security`
- Mode B: evidence from routes, roles, `User` models (cite paths)

## Anti-patterns

- Single generic “user” with no permissions
- Profiles that duplicate epic descriptions
