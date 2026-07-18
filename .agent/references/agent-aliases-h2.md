# Agent aliases e contrato H2 (remoção de legacy)

> **Status:** H2 ✅ — 6 arquivos legacy deletados; aliases permanecem em `meridian-routing` + esta tabela.  
> **Não quebra:** workflows, skills v11, `sync_cursor_kit.sh` (prune orphans), validator `REQUIRED_AGENTS`.

---

## 1. Mapa canônico (única fonte após H2)

| Slug legado (H1) | Slug v11 | Arquivo H2 |
| ---------------- | -------- | ---------- |
| `process-manager` | `scrum-master` | ~~deletado~~ |
| `board-keeper` | `backlog-refiner` | ~~deletado~~ |
| `scope-architect` | `product-owner` | ~~deletado~~ |
| `documentation-strategist` | `technical-writer` | ~~deletado~~ |
| `architecture-guardian` | `technical-architect` | ~~deletado~~ |
| `security-steward` | `security-champion` | ~~deletado~~ |

**Manter (9 agentes):** `scrum-master`, `product-owner`, `technical-writer`, `security-champion`, `technical-architect`, `design-system-owner`, `sprint-planner`, `backlog-refiner`, `developer`.

**Espelhar em:** `.agent/skills/meridian-routing/SKILL.md` § Legacy aliases — não duplicar tabela em outros arquivos operacionais.

---

## 2. O que quebra vs o que não quebra (H2)

| Ação | Após deletar legacy |
| ---- | ------------------- |
| `@scrum-master` no IDE | ✅ arquivo existe |
| `@process-manager` no IDE picklist | ❌ arquivo sumiu — usar `@scrum-master` ou texto “status do projeto” |
| Chat “como process-manager, /status” | ✅ `meridian-routing` redireciona para `scrum-master` |
| Workflows `/implement-us` | ✅ apontam para `developer` |
| `sync_cursor_kit.sh` | ✅ remove symlinks órfãos via `prune_orphans` |
| Codex `.codex/agents/*.toml` | ✅ `prune_codex_agents` remove TOMLs órfãos |
| `validate_meridian.py` | ✅ só exige `REQUIRED_AGENTS` (v11) |

---

## 3. Gate pós-H2 (verificação)

```bash
python3 .agent/scripts/validate_meridian.py . --h2-ready
python3 .agent/scripts/validate_meridian.py . --strict-kit-md
./.agent/scripts/sync_cursor_kit.sh   # após qualquer mudança em agents/
```

---

## 4. Allowlist (menções legítimas a slugs antigos)

Só estes paths podem citar slugs legados **como nome histórico**:

| Path | Motivo |
| ---- | ------ |
| `references/agent-aliases-h2.md` | este doc |
| `references/plans/agent-roster-and-workflow-v11.md` | migração |
| `references/plans/markdown-audit-v11.md` | vocabulário §10 |
| `skills/meridian-routing/SKILL.md` | tabela alias (permanente) |

**Proibido em:** workflows, skills (exceto routing), agents v11, `app-visual-studio/`, `rules/` (exceto nota única apontando para este doc).

---

## 5. Checklist H2 (maintainer) — concluído

- [x] `validate_meridian.py . --h2-ready` sem erros de refs operacionais
- [x] `app-visual-studio` help/catalog sem slugs legados como primários
- [x] Grep kit: zero slug legado em workflows/skills/agents v11 (routing allowlist OK)
- [x] Deletar 6 arquivos §1
- [x] `sync_cursor_kit.sh`
- [x] `validate_meridian.py . --h2-ready` (legacy files gone)
- [x] Atualizar `ARCHITECTURE.md` — nota H2
- [x] `agents-help.md` — picklist v11
- [x] Marcar H2 ✅ em `agent-roster-and-workflow-v11.md`
