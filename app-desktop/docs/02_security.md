---
title: Security
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [00_scope.md, 01_tech_stack.md]
blocks: [03_user_types.md, 04_principles.md]
---

# 02 — Security

## Authentication model

There will be no authentication in the first local Vite version.

## Authorization model

There will be no profiles with technical permissions in the first version. The app will be used locally by a single operator.

## Data protection

- No sensitive data should be required in the first version.
- Documentation content may contain project information and should be treated as local user data.
- Future integrations with disk writes must avoid remote content transmission without explicit action.

## Input validation

- Meridian structure validations must occur in the frontend domain layer.
- Required frontmatter fields must be validated before a US or document is considered valid.
- Status `🔶` must require `Missing:` in acceptance.

## Rate limiting

Out of scope for the first local version.

## Audit and logs

- The first version should represent the log in `docs/decisions/` (stub `11_decisions.md` with rules only).
- In the future, editing an `approved` document should suggest or record a decision.

## Secrets management

- `.env`, `.env.*`, and local secret files do not go in Git.
- `.env.example` goes in Git as a configuration contract.
- v0 does not require environment variables.
- No secrets should be saved in `localStorage`.

## Compliance

No specific regulatory compliance in the first version. The product should avoid collecting unnecessary personal data.

## OWASP Top 10

Initial risk is low because there is no remote backend. Still:

- Validate rendered data to avoid injection in future previews.
- Do not execute Markdown content as code.
- Do not persist secrets in `localStorage`.
