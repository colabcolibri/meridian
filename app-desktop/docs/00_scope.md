---
title: Scope
status: approved
version: 1.0
updated: 2026-06-02
depends_on: []
blocks: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
---

# 00 — Scope

## Name and description

Meridian Desktop is the local visual monitoring app for projects using the Meridian protocol. At the kit repository root: `../../README.md` (monorepo onboarding), `../../.agent/MERIDIAN.md` (master protocol for agents), and `../../.agent/rules/MERIDIAN.md` (always-on rules for agents).

The app does not replace the protocol. It opens the project's **`docs/`** folder, reads phase documents (00–08 and 11), delivery folders (`epics/`, `versions/`, `sprints/`, `us/`), and `board.json`, and gives the process manager visibility.

The first delivery is a local Vite app in `app-desktop/`. Later, an extension in `app-visual-studio/` may operate on real files inside the editor.

At the kit repository root, `README.md` (GitHub onboarding) and `.agent/` (agents, skills with `references/`, workflows, `always_on` rules, scripts) form the agent kit, in an Antigravity-style layout adapted to Meridian. Client projects copy only `.agent/`. The desktop app is a separate visual layer that monitors a Meridian folder.

## Problem it solves

Software projects with AI agents often move to code before minimum documentation, acceptance criteria, and recorded decisions exist. That creates rework, misalignment, hard-to-audit sprints, lost context, and agents running without clear direction.

Meridian Desktop helps monitor that gap. It is not the source of truth: the monitored project folder remains the source of truth.

## Who it is for

- Anyone who wants to run software development with AI agents without losing control, clarity, or consistency.
- Devs, founders, product managers, tech leads, designers, operators, and others who need to manage a digital project without a heavy toolchain.
- People using coding agents who want to stay process managers instead of letting agents run indefinitely without visibility.

## In initial scope

- Local Vite app with React, TypeScript, and shadcn/ui inside `app-desktop/`.
- Dashboard for phase documents of a Meridian folder.
- Visualization of dependencies between documents.
- `draft`, `review`, and `approved` states.
- Visual blocking rules between documents.
- Maturity order: foundation (00–03) → principles (04) → architecture (05) → detail (06–08) → backlog (`epics/`, `versions/`, `sprints/`) → user stories.
- Base structure for user stories and `board.json`.
- Recognition of `.agent/` (including `meridian-routing`) as the agent kit; kit monorepo also has root `README.md`.
- Opening the `docs/` folder via File System Access (v1) and real file reads.

## Out of initial scope

- Full Visual Studio/VS Code extension.
- Real disk writes from the browser without a local bridge.
- Remote backend, authentication, multi-user, and cloud sync.
- Complex mesh of automatic agents.
- Autonomous agents doing work without human review, documentation, or flow records.
- Integration with GitHub, Linear, Jira, or other external systems.
- CSV export of the board, reserved for the future extension.

## Known constraints

- The Vite app must run simply on desktop with `pnpm`.
- The UI must use shadcn/ui as a base.
- The app must look professional, dense enough for real use, and not like a marketing landing page.
- The Meridian flow must be followed in the app's own development.
- The product must favor control, visibility, and consistency with AI agents, not speed without governance.

## Assumptions

- The first version may use local data in TypeScript or `localStorage`.
- Real file writes will come in a later step, likely via VS Code extension or a desktop/local layer.
- Initial documentation may start in `review` when it is already enough to guide work.

## Identified risks

- The app becomes only a pretty view without enforcing real Meridian rules.
- Writing code before closing minimum Phase 0 documents.
- Building a generic UI without density and utility for documentation management.
- Coupling the Vite solution too early to the future VS Code extension architecture.
- Looking like an agent automation tool without management, when the correct positioning is pragmatic coordination of AI-assisted development.
