# Templates — guia humano

Contratos fixos para epics, versions, sprints e user stories. **Fonte canônica do kit:** [`.agent/references/templates/`](../../.agent/references/templates/INDEX.md).

Agents e workflows **devem** ler o template completo antes de criar ou editar artefatos em `docs/`.

---

## Fluxo

```txt
/create-us     → writing-guide.md + us-template.md  (Why/Where/Approach; ready: false)
/refine-us     → writing-guide.md + refine-checklist.md  (Approach explicativo; ready: true)
implementar    → bloqueado se ready ≠ true
/complete-us   → implementation-template.md
/sync-board    → board-schema.md
```

Detalhe: [lifecycle.md](../../.agent/references/templates/lifecycle.md) no kit.

---

## Arquivos nesta pasta

| Arquivo                                                  | Uso                                       |
| -------------------------------------------------------- | ----------------------------------------- |
| [us-template.md](us-template.md)                         | Criar US (`/create-us`)                   |
| [epic-template.md](epic-template.md)                     | Criar epic (`/create-epic`)               |
| [version-template.md](version-template.md)               | Criar release (`/create-version`)         |
| [sprint-template.md](sprint-template.md)                 | Criar sprint (`/plan-sprint`)             |
| [implementation-template.md](implementation-template.md) | Fechar US (`/complete-us`)                |
| [refine-checklist.md](refine-checklist.md)               | Refinar US (`/refine-us`)                 |
| [section-contracts.md](section-contracts.md)             | Contrato fixo de seções (`##` / `###`)    |
| [writing-guide.md](writing-guide.md)                     | **Como escrever** epic, version, US       |
| [lifecycle.md](lifecycle.md)                             | Ordem create → refine → implement → close |

Symlinks apontam para `.agent/` — uma única fonte de verdade.

---

## Campo `ready` (user story)

```yaml
ready: false   # padrão em /create-us
ready: true    # só após /refine-us passar no checklist
```

Implementação de código exige `ready: true` e Context com **Why this story**, **Where it fits**, **Approach** (bullets explicativos).

Validar: `python3 ../../.agent/scripts/validate_meridian.py app-desktop`
