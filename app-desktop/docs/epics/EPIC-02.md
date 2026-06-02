---
id: EPIC-02
title: Monitor de Configuração Inicial
status: complete
versions: [v0, v1]
profiles: [Manager do Processo, Operador Local]
outcome: "Manager abre docs/, vê progresso dos 12 documentos de fase e lê cada .md inline no app."
---

# EPIC-02 — Monitor de Configuração Inicial

## Capacidade

Aba **Configuração**: progresso dos documentos de fase (00–08 e 11), estado legível por etapa, leitura inline de cada `.md` (frontmatter + corpo) e sincronização com a pasta monitorada.

## Resultado esperado

Ao abrir `app-desktop/docs/` no app, o manager vê quais docs estão draft/review/approved, dependências entre fases e consegue ler qualquer documento sem sair do monitor.

## Fora deste epic

- Kanban e filtro por epic (EPIC-04).
- Validações de protocolo automatizadas (EPIC-03).
- Escrita de markdown pelo app (EPIC-05 / v2).
