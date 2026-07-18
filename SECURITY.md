# Security policy

## Project status

Meridian is an **experimental project** under active development. There is no formal bug bounty program or guaranteed response SLA.

## Supported versions

| Version | Support |
| ------- | ------- |
| `main` | Security fixes as maintainer capacity allows |
| Release tags | Best effort — prefer the latest tag |

## Reporting a vulnerability

**Do not open a public issue** for security vulnerabilities.

Send a private report via [GitHub Security Advisories](https://github.com/colabcolibri/meridian/security/advisories/new) (adjust the URL after publishing the repository) or open a generic issue asking for private contact if Advisories is not yet available.

Include:

- Problem description
- Steps to reproduce
- Estimated impact
- Affected version/commit (if known)

## Scope

This repository includes:

- Agent kit (`.agent/`)
- VS Code / Cursor extension (`app-visual-studio/`) — reads local `docs/` and `.meridian/meridian.db` in the workspace

Out of immediate scope: cloud backends, multi-user authentication, hosted Meridian services.

## Best practices for kit users

- **Never** commit `.env` or credentials — baseline is in `.agent/skills/init-project/references/gitignore-baseline.md`.
- The extension reads **local** project files only; it does not send your docs to Meridian servers (there is no backend).
- Review agent-generated content before merge — the kit guides governance but does not replace human review.

## Response

Maintainers will acknowledge reports when possible and coordinate fixes on `main`. No SLA is guaranteed during the experimental phase.
