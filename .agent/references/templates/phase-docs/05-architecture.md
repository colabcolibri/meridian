# Phase doc template — `05_architecture.md`

**Agent:** `technical-architect` (deepen via `/architecture`)  
**Gate:** `status: approved` required before epics/US.  
**Depth bar:** context diagram or tree; layer table; integration points named.

## Frontmatter

```yaml
---
title: Architecture
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [00_scope.md, 01_tech_stack.md, 02_security.md, 03_user_types.md, 04_principles.md]
blocks: [06_database.md, 07_api_contracts.md, 08_environments.md]
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Objective** | 1–2 sentences: what this doc covers | Scope of architecture doc |
| **System context** | mermaid or `txt` tree of repo/apps | Matches real folders (Mode B) |
| **Layers / boundaries** | Table: layer \| responsibility \| paths | Consistent with `04_principles` |
| **Integration points** | External APIs, DB, queues, extension host | Named systems or `_n/a_` |
| **Architecture detail files** | Table indexing `docs/architecture/*.md` | Empty table ok at init with note |
| **Key flows** | 1–2 sequences (login, main user journey) | Optional at init; required before `approved` |

Read `architecture-folder-guide.md` before adding detail files.

## Anti-patterns

- Approved without human sign-off
- Invented components not in repo (Mode B)
