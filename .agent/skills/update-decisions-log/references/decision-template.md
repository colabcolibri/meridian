# Template de decisão

Inserir **no início** de `entries` em `docs/decisions/YYYY-MM-DD.json`.
Se o arquivo do dia não existir, criar:

```json
{
  "date": "YYYY-MM-DD",
  "entries": []
}
```

Nova entrada (prepend — primeiro item do array):

```json
{
  "time": "HH:MM",
  "title": "Título objetivo da decisão",
  "affected_document": "caminho/do/doc.md",
  "what_changed": "descrição factual do delta",
  "why_changed": "contexto, restrição ou aprendizado que motivou",
  "impact": "lista; marcar docs que voltam para review",
  "responsible": "manager ou papel"
}
```

## Quando usar

- Escopo, stack, segurança, usuários, epics, versões, arquitetura, banco, API, ambientes, aceite, governança de agents.

## Proibido

- Editar ou apagar entradas antigas.
- Append no final de `entries` (ordem correta: **novo no início**).
- Entrada vaga ("ajustado escopo") sem impacto listado.

## Após decisão que altera doc `approved`

1. Prepend em `docs/decisions/YYYY-MM-DD.json`.
2. Alterar `status` do doc afetado para `review`.
3. Informar o manager qual reaprovação é necessária.
