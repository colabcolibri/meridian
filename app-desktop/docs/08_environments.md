---
title: Ambientes
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [01_tech_stack.md, 05_architecture.md]
blocks: []
---

# 08 — Ambientes

## Como rodar localmente

### Pré-requisitos

- Node.js compatível com Vite.
- pnpm.
- Python 3 (para `validate_meridian.py` no dev e no terminal).

### Setup inicial

```bash
pnpm install
pnpm prepare
```

### Comandos do dia a dia

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
python3 ../.agent/scripts/validate_meridian.py .
```

### Validar governança Meridian

Na raiz do repositório (ou em `app-desktop/`):

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
```

No app (`pnpm dev`), use o botão **Validar pasta** — chama o mesmo script via API local (`/api/meridian/validate`).

## Variáveis de ambiente

v0 não exige variáveis de ambiente.

| Variável | Descrição                      | Obrigatória | Exemplo |
| -------- | ------------------------------ | ----------: | ------- |
| —        | Nenhuma variável exigida em v0 |         Não | —       |

## Arquivos protegidos

- `.env`
- `.env.*`
- `node_modules/`
- `dist/`
- caches e logs locais

`.env.example` deve ser versionado como contrato de configuração.

## Ambientes disponíveis

| Ambiente | Propósito            | Branch   | Deploy automático |
| -------- | -------------------- | -------- | ----------------- |
| local    | desenvolvimento Vite | qualquer | não               |

## Diferenças entre ambientes

Ainda não há ambientes remotos na v0.
