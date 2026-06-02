# Template — Implementação técnica (preencher ao concluir)

> **Criação da US:** placeholder ou plano preliminar opcional.  
> **Fechamento (`✅`):** substituir pelo registro real do que foi entregue.

## Placeholder na criação (status `❌`)

```md
## Implementação técnica

### Arquivos

_(preencher ao concluir a implementação)_

### Backend

_(preencher quando aplicável)_

### Frontend

_(preencher quando aplicável)_

### Scripts / Docs

_(preencher quando aplicável)_
```

## Registro ao concluir (status `✅`)

```md
## Implementação técnica

### Arquivos

- `src/features/monitor/VersionFilterBar.tsx` — barra de filtro compartilhada
- `src/context/MonitorVersionFilterContext.tsx` — estado de versão entre abas
- `src/features/monitor/MonitorDashboard.tsx` — wiring do provider

### Backend

- _n/a_

### Frontend

- Contexto React compartilhado entre abas Entregas e Quadro.
- Versão selecionada persiste ao trocar de aba.
- Default: versão `active`; fallback última versão com US na pasta.

### Scripts / Docs

- _n/a_
```

## Regras

| Regra | Detalhe |
| ----- | ------- |
| Paths | Relativos à raiz do app ou repo; incluir pasta |
| Uma linha por arquivo | O que mudou naquele arquivo |
| Camadas vazias | `_n/a_` — não omitir o heading |
| Plano vs entrega | Na conclusão, remover bullets que descrevem intenção não implementada |
| Decisões globais | Registrar em `docs/decisions/YYYY-MM-DD.json`; local da US fica aqui |
| Git | Commit/PR opcional em `## Notas`; a US é o índice legível |

## Anti-padrões (bloqueiam `✅`)

- `_(preencher quando aplicável)_` ainda presente
- Só "Sem alteração funcional" sem listar arquivos quando houve mudança
- Aceite `[x]` sem correspondência em Implementação técnica ou Testes
- Lista genérica sem paths ("componentes do monitor atualizados")
