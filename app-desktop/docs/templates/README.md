# Templates — guia humano

Contratos fixos para epics, versions, sprints, user stories, decisions e board.

**Onde editar de verdade:** [TEMPLATE_SOURCES.md](TEMPLATE_SOURCES.md) — mapa canônico (skill → registry → esta pasta).

**Índice para agents:** [INDEX.md](INDEX.md)

**Sincronizar espelhos (kit repo):**

```bash
./.agent/scripts/sync_cursor_kit.sh
```

Isso recria symlinks em `.cursor/references/templates/` e nesta pasta a partir de `.agent/references/templates/`.

---

## Fluxo US

```txt
/create-us     → writing-guide.md + us-template.md
/review-us     → review-checklist.md + writing-guide.md
/refine-us     → refine-checklist.md + writing-guide.md
/complete-us   → implementation-template.md
/sync-board    → board-schema.md
/create-epic   → epic-template.md + writing-guide.md
/create-version → version-template.md + writing-guide.md
/plan-sprint   → sprint-template.md
/init-meridian → doc-templates.md
decisions      → decision-template.md + decision-schema.md
```

Detalhe: [lifecycle.md](lifecycle.md)

---

## Arquivos nesta pasta

Todos são symlinks → `.agent/references/templates/` (registry). **Não edite aqui.**

| Arquivo                                                  | Uso                                    |
| -------------------------------------------------------- | -------------------------------------- |
| [INDEX.md](INDEX.md)                                     | Registry artifact → template → agent   |
| [TEMPLATE_SOURCES.md](TEMPLATE_SOURCES.md)               | Paths canônicos (onde editar)          |
| [writing-guide.md](writing-guide.md)                     | Prosa — Why / Where / Approach         |
| [section-contracts.md](section-contracts.md)             | Contrato fixo `##` / `###`             |
| [lifecycle.md](lifecycle.md)                             | Ordem create → review → refine → close |
| [us-template.md](us-template.md)                         | User story                             |
| [review-checklist.md](review-checklist.md)               | `/review-us`                           |
| [refine-checklist.md](refine-checklist.md)               | `/refine-us`                           |
| [implementation-template.md](implementation-template.md) | `/complete-us`                         |
| [epic-template.md](epic-template.md)                     | Epic                                   |
| [version-template.md](version-template.md)               | Release                                |
| [sprint-template.md](sprint-template.md)                 | Sprint                                 |
| [decision-template.md](decision-template.md)             | Nova decision                          |
| [decision-schema.md](decision-schema.md)                 | Schema JSON do log                     |
| [doc-templates.md](doc-templates.md)                     | Docs de fase 00–11                     |
| [board-schema.md](board-schema.md)                       | `board.json`                           |

Validar: `python3 ../../.agent/scripts/validate_meridian.py app-desktop` (`--json` para CI)
