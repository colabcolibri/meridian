---
trigger: always_on
---

# MERIDIAN.md — regras globais do kit

> Define como o agente se comporta em workspaces que usam Meridian.

---

## CRITICAL: protocolo agent + skill (comece aqui)

> **OBRIGATÓRIO:** Leia o agent adequado e suas skills ANTES de alterar estrutura, docs ou código do projeto.

### 1. Carregamento modular de skills

Agent ativado → confira frontmatter `skills:` → leia `SKILL.md` (índice) → leia só arquivos relevantes em `references/`.

- **Leitura seletiva:** NÃO leia todos os arquivos da pasta da skill. Leia `SKILL.md` primeiro; depois só o que a solicitação exige.
- **Prioridade de regras:** P0 (`rules/MERIDIAN.md`) > P1 (`.agent/MERIDIAN.md` + agent `.md`) > P2 (`SKILL.md`).

### 2. Protocolo de enforcement

1. **Quando um agent for ativado:** leia rules → frontmatter → `SKILL.md` → aplique tudo.
2. **Proibido:** pular agent/skill e ir direto para implementação.

---

## Classificador de pedido (passo 1)

Antes de qualquer ação, classifique:

| Tipo | Gatilhos | Resultado |
| ---- | -------- | --------- |
| **PERGUNTA** | "o que é", "como funciona", "explique" | Resposta textual; não altere docs |
| **STATUS** | "status", "onde estamos", "bloqueios" | `process-manager` + `/status` |
| **DOC / FASE** | "escopo", "epic", "versão", "arquitetura", `00_`–`11_` | Agent de documentação conforme matriz |
| **US / BOARD** | "user story", "US-", "kanban", "board" | `board-keeper` ou `sprint-planner` |
| **FECHAR US** | "concluir US", "marcar done", "implementação técnica", `/complete-us` | `board-keeper` + `complete-user-story` |
| **SEGURANÇA** | "security", "OWASP", "secrets", `02_security` | `security-steward` |
| **INICIAR PROJETO** | "iniciar", "setup meridian", "criar docs" | `process-manager` + `init-project` |
| **CÓDIGO** | "implementar", "criar app", "fix", "refactor" | Verificar maturidade dos docs ANTES |
| **SLASH** | `/init-meridian`, `/create-epic`, `/create-us`, `/complete-us`, `/daily-with-ai`, etc. | Fluxo do workflow correspondente |

> Para roteamento automático de agents, siga `@[skills/meridian-routing]`.

---

## Roteamento automático (passo 2)

1. **Analise (silencioso):** domínio Meridian (governança, escopo, doc, segurança, arquitetura, sprint, board).
2. **Selecione o(s) agent(s).**
3. **Informe o usuário:**

```markdown
🤖 **Aplicando conhecimento de `@[agent-name]`...**

[resposta especializada]
```

4. **Respeite override:** se o usuário citar `@scope-architect`, use esse agent.

### Checklist antes de código ou US

| Passo | Verificação | Se falhar |
| ----- | ----------- | --------- |
| 1 | Agent correto para o domínio? | Pare; reclassifique o pedido |
| 2 | Leu `.agent/agents/{agent}.md`? | Pare; abra o agent |
| 3 | Anunciou `🤖 Aplicando...`? | Adicione antes da resposta |
| 4 | Carregou skills do frontmatter? | Leia cada `SKILL.md` listado |
| 5 | Docs exigidos existem e estão na maturidade certa? | Bloqueie; reporte ao manager |

**Violações:**

- Código sem docs mínimos = **falha de protocolo**
- US sem `05_architecture` approved = **falha de protocolo**
- `✅` sem evidência = **falha de protocolo**
- `✅` sem `## Implementação técnica` preenchida = **falha de protocolo**

---

## TIER 0: regras universais (sempre ativas)

### Fonte de verdade

- `docs/` é a fonte de verdade do **projeto alvo** (não confundir com `app-desktop/docs/` deste repo, salvo contexto explícito).
- `docs/kanban/board.json` é **derivado** de `docs/us/*.md`.
- Leia `.agent/MERIDIAN.md` (ou `meridian.md`) antes de mudar estrutura do projeto.

### Documentação precede código

Não escreva código de produto até existirem os docs exigidos pela fase atual (ver `.agent/MERIDIAN.md`).

### Maturidade

- Não marque `approved` sem confirmação humana ou autorização explícita.
- Não crie US antes de `05_architecture.md` estar `approved`.
- Não edite entradas antigas em `docs/decisions/`; novas entradas vão **no início** de `entries`.

### Aceite e status

- Nunca `✅` sem evidência objetiva.
- Nunca `🔶` sem `Falta:` nos critérios de aceite.

### Segurança e Git

- Proteja `.env`, `.env.*`, logs, builds, `node_modules`, caches.
- Não exponha segredos; não execute comandos destrutivos sem aprovação.
- Mudanças de segurança exigem decisão em `docs/decisions/YYYY-MM-DD.json`.

### Manager humano

A pessoa é manager do processo. Agentes reportam bloqueios, próximo passo e decisões pendentes — não substituem julgamento.

---

## TIER 1: quando escrever ou alterar artefatos

| Artefato | Agent primário | Skill |
| -------- | -------------- | ----- |
| Estrutura `docs/` | `process-manager` | `init-project` |
| `00_scope.md` | `scope-architect` | `init-project` |
| `01`–`08`, `11` (fase) | `documentation-strategist` | `update-decisions-log` |
| `02_security.md` | `security-steward` | `security-review` |
| `05_architecture.md` | `architecture-guardian` | `security-review` |
| `docs/versions/`, `docs/sprints/` | `sprint-planner` | `create-user-story` |
| `docs/us/*.md` (criar) | `board-keeper` | `create-user-story` |
| `docs/us/*.md` (fechar) | `board-keeper` | `complete-user-story` |
| `board.json` | `board-keeper` | `generate-board-json` |
| `11_decisions.md` (stub) + `docs/decisions/` | qualquer agent relevante | `update-decisions-log` |

---

## Mapa do kit (leitura de sessão)

| Recurso | Caminho |
| ------- | ------- |
| Protocolo master | `.agent/MERIDIAN.md` |
| Arquitetura do kit | `.agent/ARCHITECTURE.md` |
| Agents | `.agent/agents/` |
| Skills | `.agent/skills/` |
| Workflows | `.agent/workflows/` |
| Validação | `python .agent/scripts/validate_meridian.py <pasta-projeto>` |

---

## Referência rápida

- **Governança:** `process-manager`
- **Escopo:** `scope-architect`
- **Docs de fase:** `documentation-strategist`
- **Segurança:** `security-steward`
- **Arquitetura:** `architecture-guardian`
- **Versões/sprints:** `sprint-planner`
- **US/board:** `board-keeper`
- **Roteamento:** `meridian-routing`
