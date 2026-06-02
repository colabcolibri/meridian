---
title: Log de Decisões
status: approved
version: 2.1
updated: 2026-06-02
depends_on: []
blocks: []
---

# 11 — Log de Decisões

Decisões vivem em **`docs/decisions/YYYY-MM-DD.json`** — um arquivo JSON por dia calendário.

## Formato

```json
{
  "date": "2026-06-02",
  "entries": [
    {
      "time": "17:30",
      "title": "Título objetivo",
      "affected_document": "caminho/do/doc.md",
      "what_changed": "descrição factual",
      "why_changed": "contexto e motivação",
      "impact": "docs afetados; marcar review",
      "responsible": "papel ou pessoa"
    }
  ]
}
```

- `date` deve coincidir com o nome do arquivo
- `entries`: mais recente no **início** do array (prepend no mesmo dia)
- Novo dia → novo arquivo `YYYY-MM-DD.json`

## Onde ver

Aba **Decisões** neste app — lista por data com detalhe estruturado de cada entrada.
