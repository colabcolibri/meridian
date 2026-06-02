# Schema `docs/kanban/board.json`

Array ordenado por `id` crescente (`US-001`, `US-002`, ...).

```json
[
  {
    "id": "US-001",
    "title": "Título curto",
    "epic": "EPIC-01",
    "version": "v1",
    "status": "❌",
    "moscow": "Must",
    "depends_on": [],
    "done_when": "Condição objetiva."
  }
]
```

## Campos obrigatórios

| Campo | Fonte |
| ----- | ----- |
| Todos | Frontmatter YAML de `docs/us/US-XXX.md` |

## Validações

- ID único, formato `US-\d+`
- Epic existe em `04_epics.md`
- Versão existe em `06_versions.md`
- Cada `depends_on` referencia US existente
- `done_when` não vazio
- Se `status` é `🔶`, aceite contém `Falta:`

## Divergências comuns

| Problema | Ação |
| -------- | ---- |
| US no disco, ausente no board | Regenerar |
| Entrada no board sem arquivo | Remover entrada |
| Epic/versão inválidos | Bloquear export; reportar |
