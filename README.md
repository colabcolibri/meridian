# Meridian

> Protocolo de desenvolvimento orientado por documentação para trabalho com agentes de IA.

Meridian permite que uma pessoa gerencie o processo enquanto agentes executam com contexto explícito, documentação viva, decisões registradas, user stories auditáveis e board derivado da fonte de verdade.

## O que há neste repositório

| Caminho | Descrição |
| ------- | --------- |
| `README.md` | Este arquivo — visão do repositório (padrão Git/GitHub) |
| `meridian.md` | Explicação do protocolo e do produto Meridian |
| `.agent/` | Kit operacional: agents, skills, workflows, rules, scripts |
| `app-desktop/` | App visual de monitoramento (Vite) |
| `app-visual-studio/` | Extensão/editor (futuro) |

## Instalação do kit em um projeto

Copie para a raiz do projeto alvo:

```txt
meridian.md
.agent/
```

Ou use o fluxo do seu time para distribuir o kit.

## Uso com agentes

O sistema detecta o domínio e aplica o agente Meridian adequado. Você também pode invocar workflows com slash commands (quando o IDE indexar `.agent/workflows/`).

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
- Como criar skills: [`.agent/skills/doc.md`](.agent/skills/doc.md)

## Validação

```bash
python .agent/scripts/validate_meridian.py .
```

## Desenvolvimento deste repo

```bash
cd app-desktop
npm install
npm run dev
```

## Estado atual

Fundação do kit `.agent/` alinhada ao padrão Antigravity (rules, routing, skills com references, agents operacionais, workflows com contexto). App desktop em evolução para abertura real de pastas Meridian.
