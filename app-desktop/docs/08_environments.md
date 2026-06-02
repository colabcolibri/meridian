---
title: Environments
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [01_tech_stack.md, 05_architecture.md]
blocks: []
---

# 08 — Environments

## How to run locally

### Prerequisites

- Node.js compatible with Vite.
- pnpm.
- Python 3 (for `validate_meridian.py` in dev and in the terminal).

### Initial setup

```bash
pnpm install
pnpm prepare
```

### Day-to-day commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
python3 ../.agent/scripts/validate_meridian.py .
```

### Validate Meridian governance

At the repository root (or in `app-desktop/`):

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
```

In the app (`pnpm dev`), use the **Validate folder** button — it calls the same script via local API (`/api/meridian/validate`).

## Environment variables

v0 does not require environment variables.

| Variable | Description                | Required | Example |
| -------- | -------------------------- | -------: | ------- |
| —        | No variable required in v0 |       No | —       |

## Protected files

- `.env`
- `.env.*`
- `node_modules/`
- `dist/`
- local caches and logs

`.env.example` should be versioned as a configuration contract.

## Available environments

| Environment | Purpose          | Branch | Automatic deploy |
| ----------- | ---------------- | ------ | ---------------- |
| local       | Vite development | any    | no               |

## Differences between environments

There are no remote environments in v0 yet.
