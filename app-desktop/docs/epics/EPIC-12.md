---
id: EPIC-12
title: Kit distribution
status: complete
versions: [v2.02, v2.05]
profiles: [Process Manager]
outcome: "Manager installs and upgrades Meridian protocol in any external repo from a standalone kit package — without the monorepo."
---

# EPIC-12 — Kit distribution

## Capability

Today the Meridian kit (`.agent/`) ships inside the monorepo. A manager who wants only the protocol — agents, skills, workflows, validator — must clone the full repository or copy folders manually. US-0006 and US-0007 deferred an installer for external projects; that gap remains open while dogfooding spreads to repos that are not `meridian`.

This epic delivers **standalone kit distribution**: a buildable tarball without `app-desktop/`, install scripts that replace `.agent/` on upgrade, and **surgical** sync of IDE adapters (`.cursor/`, `.claude/`, Codex `.agents/skills/` + `.codex/`) so Meridian symlinks stay current without deleting user-owned rules, skills, or other files in those trees.

## Expected outcome

A Process Manager downloads or builds `meridian-kit-VERSION.tar.gz`, runs the install script in any project, and gets working slash commands and kit scripts. Re-install with `--force` upgrades the kit; orphan Meridian symlinks disappear; custom `.cursor/rules/` files survive. Documented in `.agent/KIT_README.md` and `IDE_ADAPTERS.md`.

## Out of scope for this epic

- npm/`npx` global CLI — optional follow-up after bash flow is validated in the field (see US-0100 boundaries).
- VS Code extension `.vsix` bundling inside the kit tarball (EPIC-05 / v4 remains separate).
- Auto-scaffolding full `docs/` — `/init-meridian` stays the bootstrap for documentation.
- Windows native installer — bash + WSL/Git Bash documentation only.

## Notes

- Follows Meridian rule: **new capability → new epic**; does not reopen EPIC-01 (`complete`, v0 foundation).
- Relates to deferred installer note in US-0006/US-0007 without changing those closed stories.
