---
id: EPIC-13
title: Multi-product Meridian repos
status: complete
versions: [v2.03]
profiles: [Process Manager, Future VSCode User]
outcome: "Manager runs several independent Meridian products in one repository — each with its own docs/ tree — with kit manifest, discovery, and an active project in the IDE."
---

# EPIC-13 — Multi-product Meridian repos

## Capability

Monorepos and multi-package repositories rarely keep a single `docs/` at the root. A manager may have `docs/` for the main app, `apps/mobile/docs` for a client, and `sistema-phomenta/docs` for another product — while sharing one `.agent/` kit at the repository root. Folders named `docs-extra` or other variants are not Meridian products and must not pollute the picker.

Today the VS Code extension hard-coded dogfood paths (`docs`, `app-desktop/docs`) and picked the first match. Agents had no shared contract for declaring which `docs/` tree is active. That breaks real customer layouts such as `apps/*/docs` and single-package repos where the product lives in a named folder at the root.

This epic introduces **A + B**: an optional `.meridian/projects.json` manifest (ids, names, default, exclude) merged with **discovery** of every folder named exactly `docs` that passes the Meridian fingerprint (`00_scope.md` or `us/US-*.md`). The extension exposes **Select Active Project**; validate and board target the active package folder, not always the Git root.

## Expected outcome

A Process Manager opens a monorepo with two or more Meridian `docs/` trees, sees both in **Show Workspace Status**, selects the active product once, and uses Board / Validate against the correct `docs/` path. Kit documentation and `/status` describe the same manifest and discovery rules. `docs-extra` never appears unless misnamed as `docs`.

## Out of scope for this epic

- Merging multiple `docs/` boards into one kanban.
- Auto-creating `.meridian/projects.json` on every install (proposed at `/init-meridian` when N>1 — human approves).
- Desktop monitor multi-project home screen (extension + kit protocol first).
- Per-package `.agent/` copies — kit stays at repo root unless a future story says otherwise.

## Notes

- Follows Meridian rule: **new capability → new epic**; does not reopen EPIC-12 (`complete`, kit tarball) or EPIC-05 (`complete`, v4 IDE tabs).
- US-0101 closes this epic in v2.03-S1.
