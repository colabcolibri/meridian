# Phase doc template — `07_api_contracts.md`

**Agent:** `technical-writer`  
**Depth bar:** if no HTTP API, document internal contracts or `_n/a_` with reason.

## Frontmatter

```yaml
---
title: API Contracts
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [05_architecture.md, 06_database.md]
blocks: []
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **API style** | REST, GraphQL, RPC, CLI, none | Matches stack |
| **Authentication on API** | Headers, tokens — or N/A | Consistent with `02_security` |
| **Endpoints or commands** | Table: method/path or command \| purpose | Stub ok at init; paths real before `approved` |
| **Error envelope** | Shape of errors | Or reference to `04_principles` |
| **Versioning** | URL version, header — or N/A | Stated |

## Anti-patterns

- Listing endpoints that do not exist (Mode B without evidence)
