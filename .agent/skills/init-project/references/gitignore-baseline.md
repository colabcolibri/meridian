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

# Meridian 2.0 — local SQLite per product package (not kit root)
**/.meridian/meridian.db
```

Rules:

- Never commit real `.env` values.
- Keep a single lockfile per stack (npm/pnpm/yarn — choose one).
- Register in `docs/decisions/YYYY-MM-DD.json` if stack requires exceptions.
