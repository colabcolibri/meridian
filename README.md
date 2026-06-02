<p align="center">
  <img src="assets/logo-mark.svg" alt="Meridian" width="64" height="64" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental" />
</p>

> **Projeto experimental** — Meridian está em desenvolvimento ativo. O protocolo e o kit `.agent/` já são utilizáveis, mas convenções, UX e integrações podem mudar sem aviso prévio. Não recomendado para produção crítica. Veja [roadmap](#roadmap).

# Meridian

**Defina o meridiano antes de escrever o código.**

Meridian é um protocolo de desenvolvimento orientado por documentação para quem trabalha com agentes de IA e quer **permanecer manager do processo** — com escopo explícito, critérios de aceite, decisões registradas e um board derivado da fonte de verdade em `docs/`.

Este repositório empacota:

- o **kit operacional** para agentes (`.agent/`, `meridian.md`);
- o **app desktop** de monitoramento visual (`app-desktop/`).

Para o conceito completo do protocolo, leia [`meridian.md`](meridian.md).

## Início rápido

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Se usar Cursor (symlinks locais — não vêm do Git):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

# App de monitoramento (Chrome ou Edge):
cd app-desktop
pnpm install
pnpm dev
```

Abra `http://localhost:5173`, escolha a pasta `docs/` de um projeto Meridian e acompanhe documentos, entregas e quadro.

## O que é / o que não é

| É | Não é |
| - | ----- |
| Protocolo + kit de agents, skills e workflows | SaaS ou plataforma fechada |
| Governança mínima: docs → versões → US → código | Malha de agentes autônomos sem revisão |
| App local que **lê** sua pasta `docs/` | Substituto de Jira, Linear ou GitHub Projects |
| Compatível com Cursor (adapter) e Antigravity (`.agent/` nativo) | Dependente de uma extensão específica |

## O que há neste repositório

| Caminho | Descrição |
| ------- | --------- |
| `README.md` | Este arquivo — home do repositório no GitHub |
| `meridian.md` | Protocolo e produto (copiável para projetos cliente) |
| `.agent/` | Kit canônico: agents, skills, workflows, rules, scripts |
| `.cursor/` | Adapter **local** para Cursor (symlinks → `.agent/`, **gitignored**) |
| `app-desktop/` | Monitor visual (Vite + React) |
| `assets/` | Logo, ícone e preview para GitHub |
| `app-visual-studio/` | Extensão VS Code — **planejada** (v2) |

## Instalação do kit em um projeto

Copie para a raiz do projeto alvo:

```txt
meridian.md
.agent/
```

Se o time usa **Cursor**, após clone ou pull com mudanças no kit:

```bash
./.agent/scripts/sync_cursor_kit.sh
```

Commitar **só `.agent/`** e `meridian.md`. A pasta `.cursor/` fica no `.gitignore` — cada dev gera symlinks localmente.

## `.agent` e `.cursor`

O Meridian mantém **duas pastas** com papéis diferentes. Não renomeie `.agent/` para `.cursor/`.

| Ferramenta | O que o IDE indexa |
| ---------- | ------------------ |
| Antigravity, ag-kit, outros | `.agent/` |
| Cursor | `.cursor/rules`, `.cursor/skills`, `.cursor/agents`, `.cursor/commands` |

- **Edite sempre em `.agent/`** (agents, skills, workflows, rules).
- **`.cursor/`** espelha o kit via symlinks locais — gerada pelo script, **não vai para o Git**.

```txt
.cursor/skills/init-project       →  .agent/skills/init-project
.cursor/agents/process-manager.md →  .agent/agents/process-manager.md
.cursor/commands/status.md        →  .agent/workflows/status.md
```

Rode `./.agent/scripts/sync_cursor_kit.sh` ao clonar, ao adicionar item novo em `.agent/` ou para recriar links quebrados. Detalhes: [`.agent/CURSOR_ADAPTER.md`](.agent/CURSOR_ADAPTER.md).

## Uso com agentes

Slash commands:

- **Cursor:** `.cursor/commands/` (ex.: `/status`, `/init-meridian`)
- **Antigravity:** `.agent/workflows/`

### Agents (7)

| Agent | Quando usar |
| ----- | ----------- |
| `process-manager` | Governança, status, fase do projeto |
| `scope-architect` | `00_scope.md`, limites in/out |
| `documentation-strategist` | Documentos de fase `00–08` e `11` |
| `security-steward` | `02_security.md`, threat model |
| `architecture-guardian` | `05_architecture.md` |
| `sprint-planner` | `docs/versions/`, `docs/sprints/` |
| `board-keeper` | User stories, `board.json` |

### Skills (10)

| Skill | Descrição |
| ----- | --------- |
| `init-project` | Estrutura mínima `docs/` |
| `create-epic` | Epic em `docs/epics/` |
| `create-version` | Release em `docs/versions/` |
| `create-sprint` | Sprint em `docs/sprints/` |
| `create-user-story` | US após `05_architecture` approved |
| `complete-user-story` | Fecha US — implementação técnica, aceite, status |
| `generate-board-json` | Regenera `docs/kanban/board.json` |
| `update-decisions-log` | Prepend em `docs/decisions/YYYY-MM-DD.json` |
| `security-review` | Checklist de segurança |
| `meridian-routing` | Roteamento automático de agents |

### Workflows (11)

| Comando | Descrição |
| ------- | --------- |
| `/init-meridian` | Iniciar projeto com estrutura mínima |
| `/status` | Saúde do projeto e bloqueios |
| `/plan-sprint` | Planejar sprint |
| `/create-version` | Criar release |
| `/create-epic` | Criar epic |
| `/create-us` | Criar user story |
| `/complete-us` | Fechar US após implementação |
| `/architecture` | Criar ou revisar arquitetura |
| `/security-pass` | Revisar segurança |
| `/sync-board` | Regenerar `board.json` |
| `/daily-with-ai` | Roteiro diário manager + IA no Cursor |

## Roadmap

| Versão | Nome | Status | Foco |
| ------ | ---- | ------ | ---- |
| v0 | Foundation | concluída | Kit `.agent/`, shell do monitor |
| v1 | Folder Monitor MVP | concluída | Leitura real de `docs/`, validações |
| v2 | Visual Studio Bridge | planejada | Extensão VS Code, escrita em disco |

Detalhes em [`app-desktop/docs/README.md`](app-desktop/docs/README.md).

## Hierarquia de autoridade

1. Instrução do usuário
2. `.agent/MERIDIAN.md` (protocolo master)
3. `.agent/rules/MERIDIAN.md` (sempre ativo)
4. Workflows → Agents → Skills

## Documentação

- Conceito e produto: [`meridian.md`](meridian.md)
- Protocolo para agentes: [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)
- Arquitetura do kit: [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md)
- Adapter Cursor: [`.agent/CURSOR_ADAPTER.md`](.agent/CURSOR_ADAPTER.md)
- Como criar skills: [`.agent/skills/doc.md`](.agent/skills/doc.md)

## Validação e testes

```bash
python3 .agent/scripts/validate_meridian.py app-desktop

cd app-desktop
pnpm lint
pnpm test
pnpm build
```

## Contribuir

Leia [`CONTRIBUTING.md`](CONTRIBUTING.md). Para vulnerabilidades, veja [`SECURITY.md`](SECURITY.md).

## Licença

[PolyForm Noncommercial License 1.0.0](LICENSE) — uso, modificação e redistribuição **gratuitos** para fins **não comerciais** (inclui proibir venda do kit). Reconhecida pelo GitHub; não é open source no sentido OSI. Copyright (c) 2026 colabcolibri.
