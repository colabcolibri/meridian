# Schema `docs/kanban/board.json`

Array ordenado por `id` crescente (`US-0001`, `US-0002`, ...).

```json
[
  {
    "id": "US-0001",
    "title": "Título curto",
    "epic": "EPIC-01",
    "version": "v1",
    "status": "❌",
    "moscow": "Must",
    "depends_on": [],
    "done_when": "Condição objetiva.",
    "tests": "required",
    "tests_status": "pending"
  }
]
```

## Campos obrigatórios

| Campo | Fonte |
| ----- | ----- |
| Todos | Frontmatter YAML de `docs/us/US-XXXX.md` |

## Validações

- ID único, formato `US-XXXX` (4 dígitos)
- Epic existe em `docs/epics/EPIC-XX.md`
- Versão existe em `docs/versions/vX.md`
- Cada `depends_on` referencia US existente
- `done_when` não vazio
- Se `status` é `🔶`, aceite contém `Falta:`
- `tests`: `required` ou `none`
- `tests_status`: `pending`, `done` ou `n/a` (`n/a` só com `tests: none`)
- `status: ✅` com `tests: required` exige `tests_status: done`

## Divergências comuns

| Problema | Ação |
| -------- | ---- |
| US no disco, ausente no board | Regenerar |
| Entrada no board sem arquivo | Remover entrada |
| Epic/versão inválidos | Bloquear export; reportar |
| `tests` / `tests_status` desatualizados | Regenerar board |
