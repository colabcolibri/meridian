# Meridian — repositório do kit

> **Este arquivo é a home do repositório no GitHub** (clone, pastas, Cursor, app desktop).
> Para o que é o protocolo Meridian em si — conceito, governança, fonte de verdade em `docs/` — leia [`meridian.md`](meridian.md).

Meridian é um protocolo de desenvolvimento orientado por documentação para trabalho com agentes de IA. Este repo empacota o protocolo (`.agent/`, `meridian.md`) e o app desktop (`app-desktop/`).

## O que há neste repositório

| Caminho | Descrição |
| ------- | --------- |
| `README.md` | Este arquivo — visão do repositório (padrão Git/GitHub) |
| `meridian.md` | Explicação do protocolo e do produto Meridian |
| `.agent/` | Kit canônico (Antigravity / distribuição): agents, skills, workflows, rules |
| `.cursor/` | Adapter **local** para o Cursor (symlinks → `.agent/`, **gitignored**) |
| `app-desktop/` | App visual de monitoramento (Vite) |
| `app-visual-studio/` | Extensão/editor (futuro) |

## `.agent` e `.cursor` (importante)

O Meridian mantém **duas pastas** com papéis diferentes. Não renomeie `.agent` para `.cursor`: o padrão Antigravity e o kit portátil dependem de `.agent/`.

| Ferramenta | O que o IDE indexa |
| ---------- | ------------------ |
| Antigravity, ag-kit, outros | `.agent/` |
| Cursor | `.cursor/rules`, `.cursor/skills`, `.cursor/agents`, `.cursor/commands` |

### Fonte de verdade

- **Edite sempre em `.agent/`** (agents, skills, workflows, rules).
- **`.cursor/`** espelha o kit via **symlinks locais** — gerada pelo script, **não vai para o Git**.

Exemplo:

```txt
.cursor/skills/init-project  →  .agent/skills/init-project
.cursor/agents/process-manager.md  →  .agent/agents/process-manager.md
.cursor/commands/status.md  →  .agent/workflows/status.md
.cursor/rules/meridian.mdc  →  .agent/rules/meridian.mdc
```

Alterar um arquivo em `.agent/` reflete no symlink em `.cursor/` (após rodar o script se for item novo).

### Script de vínculo (obrigatório no Cursor)

O vínculo **não** se atualiza sozinho. Rode o script quando:

- **clonar o repo** (`.cursor/` não vem do Git);
- criar **nova** skill, agent, workflow ou rule em `.agent/`;
- quiser recriar links quebrados.

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh   # uma vez
./.agent/scripts/sync_cursor_kit.sh
```

Depois, no Cursor: **Reload Window** se rules ou slash commands (`/status`, `/init-meridian`, …) não aparecerem.

| Situação | Precisa rodar o script? |
| -------- | ------------------------ |
| Editar texto de skill/agent já linkado | Não |
| Adicionar pasta/arquivo novo em `.agent/` | Sim |
| Só usar Antigravity (sem Cursor) | Não — basta `.agent/` |

Detalhes: [`.agent/CURSOR_ADAPTER.md`](.agent/CURSOR_ADAPTER.md).

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

Commitar **só `.agent/`**. A pasta `.cursor/` está no `.gitignore` — cada dev gera symlinks localmente.

## Uso com agentes

O sistema detecta o domínio e aplica o agente Meridian adequado. Slash commands:

- **Cursor:** `.cursor/commands/` (ex.: `/status`, `/init-meridian`)
- **Antigravity:** `.agent/workflows/`

### Agents (7)

| Agent | Quando usar |
| ----- | ----------- |
| `process-manager` | Governança, status, fase do projeto, o que pode avançar |
| `scope-architect` | `00_scope.md`, limites in/out, premissas e riscos |
| `documentation-strategist` | Documentos de fase `00–11`, maturidade |
| `security-steward` | `02_security.md`, threat model, segredos, OWASP |
| `architecture-guardian` | `07_architecture.md`, consistência arquitetural |
| `sprint-planner` | `06_versions.md`, sprints, sequenciamento |
| `board-keeper` | User stories, dependências, `board.json` |

### Skills (9)

| Skill | Descrição |
| ----- | --------- |
| `init-project` | Estrutura mínima `docs/` + governança |
| `create-epic` | Epic em `docs/epics/` após escopo e user types |
| `create-version` | Release em `docs/versions/` |
| `create-sprint` | Sprint em `docs/sprints/` |
| `create-user-story` | US válida após epics/versões aprovados |
| `generate-board-json` | Regenera `docs/kanban/board.json` |
| `update-decisions-log` | Append em `11_decisions.md` |
| `security-review` | Checklist de segurança Meridian |
| `meridian-routing` | Roteamento automático de agents |

### Workflows (9)

| Comando | Descrição |
| ------- | --------- |
| `/init-meridian` | Iniciar projeto com estrutura mínima |
| `/status` | Saúde do projeto e bloqueios |
| `/plan-sprint` | Planejar sprint em `docs/sprints/` |
| `/create-version` | Criar release em `docs/versions/` |
| `/create-epic` | Criar epic em `docs/epics/` |
| `/create-us` | Criar user story válida |
| `/architecture` | Criar ou revisar arquitetura |
| `/security-pass` | Revisar segurança antes de implementar |
| `/sync-board` | Regenerar `board.json` |

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

## Validação

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
```

No repo do kit (raiz), o script também avisa se `.cursor/` estiver ausente — rode `sync_cursor_kit.sh` antes.

## Desenvolvimento deste repo

```bash
cd app-desktop
npm install
npm run dev
```

## Estado atual

Kit `.agent/` (Antigravity) + adapter `.cursor/` local (symlinks via `sync_cursor_kit.sh`, gitignored). App desktop em evolução para abertura real de pastas Meridian.
