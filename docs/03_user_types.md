---
title: User Types
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [02_security.md]
blocks: [04_principles.md, 05_architecture.md, 06_database.md, 07_api_contracts.md]
---

# 03 — User Types

## Process Manager

- **Description:** person responsible for conducting the development flow with AI agents, maintaining visibility, consistency, and documented decisions. May be a dev, founder, product manager, designer, tech lead, or someone from another area.
- **Origin:** direct access to the local app.
- **Permissions:** view documents, understand blockers, review maturity, track US, consult templates, decide next steps, and guide AI agents with documented context.
- **Restrictions:** does not delegate the process to autonomous agents without registration, review, explicit criteria, and updated documentation.
- **Session:** no authenticated session.
- **Visible data:** all data loaded locally in the app.
- **Edge cases:** project without documentation, excess of documents without approval, agent suggesting changes outside the flow, agents working without clear acceptance, unrecorded decisions.

## Local Operator

- **Description:** person using the local Vite app to organize and validate a project's Meridian documentation.
- **Origin:** direct access to the local app.
- **Permissions:** view documents, simulate status changes, see blockers, consult templates, and operate local user stories.
- **Restrictions:** does not sync data remotely and does not write real files in the first version.
- **Session:** no authenticated session.
- **Visible data:** all data loaded locally in the app.
- **Edge cases:** project without `/docs`, incomplete documents, unapproved dependencies, US with invalid frontmatter.

## Future VSCode User

- **Description:** person using the future extension inside VSCode to create and maintain real Meridian files.
- **Origin:** extension installation.
- **Permissions:** initialize templates, edit documents, generate kanban, receive alerts, and record decisions.
- **Restrictions:** respects local workspace permissions.
- **Session:** no mandatory session planned.
- **Visible data:** files from the workspace open in VSCode.
- **Edge cases:** workspace without write permission, files modified outside the extension, Git conflicts, and manually edited approved documents.
