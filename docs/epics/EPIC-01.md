---
id: EPIC-01
title: Project Structure
status: complete
versions: [v0]
profiles: [Process Manager, Local Operator]
outcome: "Repository with Meridian kit, Vite app, and docs/ governing work — ready for dogfooding."
---

# EPIC-01 — Project Structure

## Capability

Repository and Vite app foundation: clear separation between protocol (`.agent/`, root `README.md` for the kit repo) and product (`app-desktop/`), local quality (Git, lint, hooks), and operational kit for AI agents.

## Expected outcome

Manager can clone the repo, run `pnpm dev`, open the `docs/` folder in the monitor, and see documents + US aligned with the Meridian protocol.

## Out of scope for this epic

- Real folder reading in the browser (EPIC-02).
- Visible protocol validations (EPIC-03).
- VS Code extension (EPIC-05).
