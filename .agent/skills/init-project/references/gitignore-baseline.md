# Baseline `.gitignore` (Meridian)

Verificar ou criar na raiz do projeto alvo:

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

# Test / coverage
coverage/

# Python (se aplicável)
__pycache__/
.venv/
```

Regras:

- Nunca commitar valores reais de `.env`.
- Manter um único lockfile por stack (npm/pnpm/yarn — escolher um).
- Registrar em `docs/decisions/YYYY-MM-DD.json` se a stack exigir exceções.
