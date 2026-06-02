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
- Vite desktop app (`app-desktop/`) — local folder reading via File System Access API

Out of immediate scope: cloud integrations, multi-user authentication, VS Code extension (planned).

## Best practices for kit users

- **Never** commit `.env` or credentials — baseline is in `.agent/skills/init-project/references/gitignore-baseline.md`.
- The desktop app reads **local** files you authorize in the browser; it does not send data to Meridian servers (there is no backend).
- Review agent-generated content before merge — the kit guides governance but does not replace human review.
- Keep dependencies updated (`pnpm audit` in `app-desktop/`).

## Responsible disclosure

We ask for reasonable time to investigate and fix before public disclosure. We appreciate constructive reports.
