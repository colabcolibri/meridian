# Phase doc template — `01_tech_stack.md`

**Agent:** `technical-writer`  
**Depends on:** `00_scope.md`  
**Depth bar:** each major stack area has technology + **rationale** (1–2 sentences).

## Frontmatter

```yaml
---
title: Tech Stack
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [00_scope.md]
blocks: [02_security.md, 04_principles.md, 08_environments.md]
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Runtime / language** | Primary languages, versions if known | Names real toolchain from repo or interview |
| **Application framework** | Web, mobile, extension, CLI | Matches actual `package.json` / equivalent |
| **Data layer** | DB, ORM, files, none | `_n/a_` only if truly no persistence |
| **Infrastructure / hosting** | Cloud, on-prem, local-only | Evidence or assumption labeled |
| **Dev tooling** | Package manager, bundler, test runner, CI | Paths or config files cited (Mode B) |
| **Discarded alternatives** | 1–3 choices rejected and why | Optional at init; required before `approved` |

## Mode B

Infer from `package.json`, `pyproject.toml`, `Dockerfile`, CI configs. Cite file paths in bullets.

## Anti-patterns

- Generic “we use modern stack”
- Listing libraries without saying what layer they serve
