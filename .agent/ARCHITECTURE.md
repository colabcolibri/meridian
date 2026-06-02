# Meridian agent architecture

> Estrutura de agents, skills, workflows, rules e scripts — padrão Antigravity adaptado ao protocolo Meridian.

---

## Purpose

| Camada | Arquivo | Público |
| ------ | ------- | ------- |
| Repositório | `README.md` | Humanos (GitHub, onboarding) |
| Protocolo produto | `meridian.md` | Humanos + cópia em projetos clientes |
| Kit portátil | `.agent/` | Antigravity, ag-kit, qualquer IDE |
| Adapter Cursor | `.cursor/` (local, gitignored) | Cursor IDE (symlinks → `.agent/`) |
| Regras always ativas | `.agent/rules/meridian.mdc` + `.agent/rules/MERIDIAN.md` | Agentes |
| Protocolo master | `.agent/MERIDIAN.md` | Governança completa |
| Operação | `.agent/agents`, `skills`, `workflows` | Personas e procedimentos |

O app desktop (`app-desktop/`) monitora pastas Meridian; não é fonte de verdade.

### Por que `.agent` e `.cursor`?

- **`.agent/`** — convenção Antigravity; copiável para projetos e outras ferramentas.
- **`.cursor/`** — adapter **local** (symlinks gerados; **não commitar**).

**Edite em `.agent/`** e rode `./.agent/scripts/sync_cursor_kit.sh` para recriar symlinks em `.cursor/` (obrigatório após clone no Cursor).

---

## Directory structure

```txt
.agent/                    # fonte canônica (Antigravity / distribuição)
  MERIDIAN.md
  rules/MERIDIAN.md
  agents/
  skills/
  workflows/
  scripts/
    validate_meridian.py
    sync_cursor_kit.sh

.cursor/                   # adapter Cursor (local, gitignored — sync_cursor_kit.sh)
  rules/meridian.mdc       # alwaysApply
  skills/
  agents/
  commands/                # workflows como slash commands
```

---

## Rule priority

```txt
P0  .agent/rules/MERIDIAN.md
P1  .agent/MERIDIAN.md + .agent/agents/{agent}.md
P2  .agent/skills/{skill}/SKILL.md (+ references sob demanda)
```

Workflows orquestram agents; não substituem o protocolo master.

---

## Agents

| Agent | Purpose | Skills |
| ----- | ------- | ------ |
| `process-manager` | Governança, status, gates | init-project, update-decisions-log, generate-board-json, meridian-routing |
| `scope-architect` | `00_scope.md` | init-project, update-decisions-log, meridian-routing |
| `documentation-strategist` | Docs de fase `01`–`05`, `08`–`10`, `docs/epics/` | init-project, create-epic, create-user-story, update-decisions-log, meridian-routing |
| `security-steward` | `02_security.md` | security-review, update-decisions-log, meridian-routing |
| `architecture-guardian` | `05_architecture.md` | security-review, update-decisions-log, meridian-routing |
| `sprint-planner` | `docs/versions/`, `docs/sprints/` | create-version, create-sprint, create-user-story, … |
| `board-keeper` | US + `board.json` | create-user-story, complete-user-story, generate-board-json, update-decisions-log, meridian-routing |

Cada agent inclui: fases 0/-1, missão, proibições, formato de saída, delegação.

---

## Skills

| Skill | References |
| ----- | ---------- |
| `init-project` | `doc-templates.md`, `gitignore-baseline.md` |
| `create-epic` | `epic-template.md` |
| `create-version` | `version-template.md` |
| `create-sprint` | `sprint-template.md` |
| `create-user-story` | `us-template.md` |
| `complete-user-story` | `implementation-template.md` |
| `generate-board-json` | `board-schema.md` |
| `update-decisions-log` | `decision-template.md`, `decision-schema.md` |
| `security-review` | `checklists.md` |
| `meridian-routing` | — (matriz inline) |

Ver `.agent/skills/doc.md` para criar novas skills.

---

## Workflows

| Workflow | Agent | Modo |
| -------- | ----- | ---- |
| `init-meridian` | process-manager | init, sem código |
| `status` | process-manager | leitura |
| `plan-sprint` | sprint-planner | planejamento |
| `create-version` | sprint-planner | criar release em `docs/versions/` |
| `create-us` | board-keeper | criar US |
| `complete-us` | board-keeper | fechar US pós-implementação |
| `create-epic` | documentation-strategist | criar epic em `docs/epics/` |
| `architecture` | architecture-guardian | doc 07 |
| `security-pass` | security-steward | doc 02 |
| `sync-board` | board-keeper | derivar JSON |
| `daily-with-ai` | process-manager | roteiro diário manager + IA |

Todos suportam `$ARGUMENTS` e seção de regras críticas.

---

## Scripts

```bash
python .agent/scripts/validate_meridian.py <project-root>
```

---

## Authority

1. User instruction
2. `.agent/MERIDIAN.md`
3. `.agent/rules/MERIDIAN.md`
4. Workflows
5. Agents
6. Skills

---

## Diferença vs Antigravity kit

| Antigravity | Meridian |
| ----------- | -------- |
| `README.md` + `rules/GEMINI.md` | `README.md` + `meridian.md` + `rules/MERIDIAN.md` |
| 37 skills de código/stack | 10 skills de governança documental |
| `intelligent-routing` (domínios técnicos) | `meridian-routing` (fases docs/US) |
| Plan files `{task-slug}.md` | `docs/` fase `00`–`11` + US |
| Agents longos para implementação | Agents para documentação e gates antes de código |
