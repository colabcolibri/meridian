# `.gitignore` baseline (Meridian)

Verify or create at target project root:

```gitignore
# Secrets
.env
.env.*
!.env.example

# Dependencies
node_modules/

# Build
dist/
build/
.next/
out/

# Logs
*.log
logs/

# OS / IDE
.DS_Store
Thumbs.db
.idea/
.vscode/*
!.vscode/extensions.json
.cursor/
.claude/
.agents/skills/
.codex/
/AGENTS.md

# Test / coverage
coverage/

# Python (if applicable)
__pycache__/
.venv/

# Meridian delivery (local SQLite — never commit)
**/.meridian/meridian.db
**/.meridian/meridian.db-wal
**/.meridian/meridian.db-shm

# Legacy derived board (v11 — ignore when migrating from v1)
**/docs/kanban/board.json
```

**Nota `.meridian/`:** ignore só o **banco** (`meridian.db` e sidecars WAL). **`delivery.json`** e **`projects.json`** podem ir no git — configuração versionada, não runtime.

Rules:

- Never commit real `.env` values.
- Keep a single lockfile per stack (npm/pnpm/yarn — choose one).
- Register in `docs/decisions/YYYY-MM-DD.json` if stack requires exceptions.
