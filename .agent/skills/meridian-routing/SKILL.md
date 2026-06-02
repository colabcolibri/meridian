---
name: meridian-routing
description: Automatic Meridian agent selection and task routing. Analyzes requests and picks process-manager, scope-architect, documentation-strategist, security-steward, architecture-guardian, sprint-planner, or board-keeper without explicit user mentions.
allowed-tools: Read, Glob, Grep
version: 1.0.0
---

# Meridian intelligent routing

> O agente age como **manager do processo Meridian**, não como implementador genérico.

## Princípio

Antes de responder, classifique o pedido e selecione o agent Meridian correto. Informe qual expertise está ativa.

## Matriz de seleção

| Intenção | Palavras-chave | Agent(s) | Auto? |
| -------- | -------------- | -------- | ----- |
| Iniciar / estrutura | "iniciar", "setup", "criar docs", "init meridian" | `process-manager` | sim |
| Status / governança | "status", "fase", "bloqueio", "pode avançar" | `process-manager` | sim |
| Fluxo diário com IA | "como usar ia", "dia a dia", "rotina cursor", `/daily-with-ai` | `process-manager` | sim |
| Escopo | "escopo", "scope", "in scope", "out of scope", `00_scope` | `scope-architect` | sim |
| Documentos de fase | "tech stack", "princípio", "ambiente", `01_`–`05_`, `08`–`10` | `documentation-strategist` | sim |
| Epic (capacidade) | "criar epic", "novo epic", `/create-epic`, `docs/epics/`, `EPIC-` | `documentation-strategist` + skill `create-epic` | sim |
| Segurança | "security", "OWASP", "secrets", "threat", `02_security` | `security-steward` | sim |
| Arquitetura | "architecture", "arquitetura", `05_architecture` | `architecture-guardian` | sim |
| Versão / sprint | "versão", "sprint", "roadmap", `/create-version`, `docs/versions/`, `docs/sprints/` | `sprint-planner` + skill `create-version` / `create-sprint` | sim |
| Decisões / log | "decisão", "decisions", "log de decisões", `docs/decisions/` | skill `update-decisions-log` | sim |
| User story / board | "user story", "US-", "kanban", "board.json", "aceite" | `board-keeper` | sim |
| Fechar US | "concluir US", "marcar done", "implementação técnica", `/complete-us`, "fechar story" | `board-keeper` + `complete-user-story` | sim |
| US + planejamento | "planejar sprint" + "criar US" | `sprint-planner` + `board-keeper` | sim |
| Implementar código | "implementar", "build", "criar API", "componente" | `process-manager` primeiro; ao terminar → `complete-user-story` | **bloquear** se docs imaturos |

## Fluxo de decisão

```txt
1. É pergunta conceitual? → Responder sem alterar arquivos
2. É slash command? → Abrir .agent/workflows/{cmd}.md
3. É código? → process-manager valida maturidade → depois agent de domínio técnico (fora do kit) só se docs OK
4. Caso contrário → uma linha da matriz acima
```

## Formato de resposta (obrigatório)

```markdown
🤖 **Aplicando conhecimento de `@[agent-name]`...**

[resposta]
```

Múltiplos agents:

```markdown
🤖 **Aplicando conhecimento de `@[scope-architect]` + `@[documentation-strategist]`...**
```

## Regras

1. **Análise silenciosa** — não narre "estou analisando" por parágrafos.
2. **Override do usuário** — `@agent` vence roteamento automático.
3. **Código sem docs** — `process-manager` reporta bloqueio; não invente MVP em código.
4. **Decisões** — qualquer mudança relevante dispara `update-decisions-log`.

## Detecção de complexidade

| Complexidade | Sinais | Ação |
| ------------ | ------ | ---- |
| Simples | Um doc, um domínio | Um agent |
| Moderada | Dois domínios (ex.: segurança + arquitetura) | Dois agents em sequência |
| Alta | "Construir produto inteiro" sem docs | `process-manager` + perguntas (máx. 3) + `/init-meridian` |

## Perguntas gate (quando vago)

Antes de criar estrutura ou US:

1. Qual problema e para quem?
2. O que é obrigatório agora vs depois?
3. Qual versão/epic alvo?

Depois prossiga com o agent selecionado.
