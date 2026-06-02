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
| `.cursor/` | Adapter para o **Cursor** (symlinks → `.agent/`, ver abaixo) |
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
- **`.cursor/`** espelha o kit via **symlinks** — não é cópia duplicada do conteúdo.

Exemplo:

```txt
.cursor/skills/init-project  →  .agent/skills/init-project
.cursor/agents/process-manager.md  →  .agent/agents/process-manager.md
.cursor/commands/status.md  →  .agent/workflows/status.md
```

Alterar um arquivo em `.agent/` reflete na hora no caminho linkado em `.cursor/`.

Exceção: `.cursor/rules/meridian.mdc` é arquivo real (formato Cursor com `alwaysApply: true`), não symlink de `.agent/rules/MERIDIAN.md`.

### Script de vínculo (não é automático)

O vínculo **não** se atualiza sozinho ao salvar arquivos. Rode o script quando:

- clonar o repo e ainda não existir `.cursor/`;
- criar **nova** skill, agent ou workflow em `.agent/`;
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

Detalhes: [`.cursor/README.md`](.cursor/README.md).

## Instalação do kit em um projeto

Copie para a raiz do projeto alvo:

```txt
meridian.md
.agent/
```

Se o time usa **Cursor**:

```bash
./.agent/scripts/sync_cursor_kit.sh
```

Commitar `.agent/` e `.cursor/` (com symlinks) ou rodar o script após cada clone — conforme a política do time.

Não coloque `.agent/` nem `.cursor/` no `.gitignore` se quiser que o IDE indexe rules e commands.

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

### Skills (6)

| Skill | Descrição |
| ----- | --------- |
| `init-project` | Estrutura mínima `docs/` + governança |
| `create-user-story` | US válida após epics/versões aprovados |
| `generate-board-json` | Regenera `docs/kanban/board.json` |
| `update-decisions-log` | Append em `11_decisions.md` |
| `security-review` | Checklist de segurança Meridian |
| `meridian-routing` | Roteamento automático de agents |

### Workflows (7)

| Comando | Descrição |
| ------- | --------- |
| `/init-meridian` | Iniciar projeto com estrutura mínima |
| `/status` | Saúde do projeto e bloqueios |
| `/plan-sprint` | Planejar versão/sprint sem código |
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
- Adapter Cursor: [`.cursor/README.md`](.cursor/README.md)
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

Kit `.agent/` (Antigravity) + adapter `.cursor/` (symlinks via `sync_cursor_kit.sh`). App desktop em evolução para abertura real de pastas Meridian.
