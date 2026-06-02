---
description: Daily workflow for managers using AI agents with Meridian — orient, implement, close US.
---

# /daily-with-ai — fluxo diário com IA

$ARGUMENTS

---

## Regras críticas

1. Manager humano aprova; agentes executam dentro de `docs/`.
2. Uma US por ciclo de implementação quando possível.
3. Código só com docs mínimos: `05_architecture` approved; epic/version nas pastas; depois US.
4. Fechamento sempre com `complete-user-story` ou `/complete-us` — nunca ✅ só no chat.
5. `board.json` é derivado — use `/sync-board` após mudar US.

---

## Para quem é

Pessoa que já leu **Comece aqui** e **Guia de uso** no app (três fases: documentar → backlog → executar).

---

## Loop diário

### 1. Orientar

```txt
Agent: process-manager
Skill: meridian-routing (opcional)
Comando: /status
App: aba Configuração + **Decisões** (log) + Quadro
```

- Identificar bloqueios (docs draft, deps de US).
- Escolher próxima US Must desbloqueada.

### 2. Contextualizar

```txt
Citar: US-XXXX ou docs/us/US-XXXX.md
Prompt: "Implemente US-XXXX conforme aceite. Não marque ✅ sem evidência."
```

- Citar ID da US sempre.
- Para docs de fase: citar arquivo (`05_architecture.md`) + agent adequado.

### 3. Implementar

- Agente lê US, arquitetura, dependências antes de codar.
- Manager revisa diff.
- Parcial → `🔶` + `Falta:` no aceite da US.

### 4. Fechar

```txt
Agent: board-keeper
Skill: complete-user-story
Comando: /complete-us US-XXXX
Depois: /sync-board
```

- Preencher `## Implementação técnica` (arquivos + camadas).
- Aceite `[x]`, status `✅`, testes documentados.
- Decisão cross-cutting → skill `update-decisions-log` (`docs/decisions/YYYY-MM-DD.json`).

### 5. Revisar

- App: aba Quadro — US na coluna certa?
- Implementação técnica coerente com o que foi testado?

---

## Comandos do dia a dia

| Comando | Uso |
| ------- | --- |
| `/status` | Início de sessão |
| `/create-us` | Nova tarefa (gates ok) |
| `/complete-us` | Fechar US pós-implementação |
| `/sync-board` | Regenerar kanban JSON |
| `/plan-sprint` | Fatia de trabalho na versão |
| `/create-epic` | Nova capacidade de produto |
| `/architecture` | Doc 05 antes de mudança estrutural |
| `/security-pass` | Doc 02 antes de feature sensível |

---

## Anti-padrões

- Código sem US ou sem docs de fase mínimos.
- ✅ no chat sem atualizar `docs/us/US-XXXX.md`.
- Editar `board.json` à mão.
- Conversa única com muitas features misturadas.
- `approved` em doc de fase sem leitura humana.

---

## Saída esperada

```txt
Sessão:
US trabalhada:
Status final:
Board atualizado: yes | no
Bloqueios restantes:
Próxima US sugerida:
```

---

## Referências

| Recurso | Caminho |
| ------- | ------- |
| Protocolo master | `.agent/MERIDIAN.md` |
| Fechar US | `.agent/workflows/complete-us.md` |
| App — guias | abas **Comece aqui** e **Guia de uso** / `meridian-concepts.ts` |
| Fluxo resumido | `.agent/references/daily-ai-workflow.md` |
