# Meridian v2 — cutover e lineage

> Você está no branch **`meridian-v1-old`** (arquivo histórico v1).  
> **Trabalho atual:** branch [`main`](https://github.com/colabcolibri/meridian/tree/main).

## O que mudou (resumo)

| Aspecto | v1 (`meridian-v1-old`) | v2+ (`main`, jul/2026) |
| ------- | ---------------------- | ---------------------- |
| User stories | `docs/us/US-XXXX.md` | `.meridian/meridian.db` → `user_stories` |
| Epics / versions / sprints | `docs/epics/`, `versions/`, `sprints/` | Mesmas entidades no SQLite |
| Kanban | `docs/kanban/board.json` (derivado) + `/sync-board` | Board lê DB direto — **sem** `board.json` (v11) |
| IDE | `app-desktop/` (browser monitor) | `app-visual-studio/` (extensão VS Code) |
| Phase docs | `docs/00`–`11` Markdown | Igual — continuam em Markdown |

## Migrar dados v1 → v2

No checkout de **`main`** (não neste branch):

```bash
git checkout main
python3 .agent/scripts/bootstrap_meridian_db.py .
python3 .agent/scripts/migrate_md_to_sqlite.py .    # importa árvore Markdown legada
python3 .agent/scripts/verify_md_sqlite_parity.py .
python3 .agent/scripts/validate_meridian.py . --sqlite-only
```

Importar a partir deste branch:

```bash
git show meridian-v1-old:docs/us/US-0001.md   # exemplo — ou checkout temporário da pasta docs/
```

## Por que este branch existe

- Referência reproduzível do protocolo Markdown v1
- Base para `migrate_md_to_sqlite.py` e testes de paridade
- Não recebe features novas — apenas notas de lineage quando necessário

## Links

- README atualizado: [`main` README](https://github.com/colabcolibri/meridian/blob/main/README.md)
- Plano do kit: [kit-improvement-plan.md](https://github.com/colabcolibri/meridian/blob/main/.agent/references/plans/kit-improvement-plan.md) (só em `main`)
- Operações SQLite: [sqlite-delivery-operations.md](https://github.com/colabcolibri/meridian/blob/main/.agent/references/templates/sqlite-delivery-operations.md)
