# Template de decisão

```md
## YYYY-MM-DD — Título objetivo da decisão

**Documento afetado:** caminho/do/doc.md
**O que mudou:** descrição factual do delta
**Por que mudou:** contexto, restrição ou aprendizado que motivou
**Impacto em outros docs:** lista; marcar docs que voltam para `review`
**Responsável:** manager ou papel
```

## Quando usar

- Escopo, stack, segurança, usuários, epics, versões, arquitetura, banco, API, ambientes, aceite, governança de agents.

## Proibido

- Editar ou apagar entradas antigas.
- Entrada vaga ("ajustado escopo") sem impacto listado.

## Após decisão que altera doc `approved`

1. Append neste arquivo.
2. Alterar `status` do doc afetado para `review`.
3. Informar o manager qual reaprovação é necessária.
