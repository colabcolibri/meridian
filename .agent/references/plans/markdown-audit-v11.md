# Audit markdown v11 — review completo para estrutura SQLite

> **Status:** aberto — jul/2026  
> **Gatilho:** onda A marcou skills como ✅, mas dezenas de `.md` ainda descrevem delivery como arquivos `docs/us/*.md`, `app-desktop`, `/sync-board`, ou “US file”.  
> **Objetivo:** um agente ou humano consegue seguir **qualquer** markdown do kit sem ambiguidade v1 vs v11.

---

## 1. Veredito honesto

| O que dissemos | Realidade |
| -------------- | --------- |
| Onda A ✅ — skills/workflows SQLite | **Parcial:** write paths nos skills principais; **não** revisão linha a linha de templates, agents, `start-here`, `lifecycle`, `rules/`, `docs/` |
| Onda C ✅ — sem `docs/templates/` | **OK** no repo; grep ainda encontra `docs/templates/README.md` em índices antigos — confirmar zero cópia no git |
| Onda D/E ✅ — scripts | **OK** tecnicamente; docs ainda citam shims sem explicar `migrate/` / `test/` |

**Conclusão:** falta **onda G** — revisão sistemática de **todo** markdown operacional (~107 arquivos `.md` no kit + dogfood).

---

## 2. Modelo alvo (uma frase por camada)

```txt
Phase docs     → docs/00–11, discovery/, architecture/, decisions/*.json  (Markdown Write)
Delivery       → .meridian/meridian.db                                    (CLI / form upsert)
Board UI       → leitura SQLite via meridian_db_export --format planning
Templates      → .agent/references/templates/                               (forma do body_markdown)
Protocolo      → .agent/MERIDIAN.md, rules/, agents/, skills/, workflows/
```

**Regra de ouro para revisores:** se o texto diz “crie/edite/leia `docs/us/US-XXXX.md`” como caminho **primário** → **P0 bug**. Menção a v1 em “não faça” ou “branch meridian-v1-old” → **P2 OK**.

---

## 3. Scan automático (baseline jul/2026)

Padrões legados em `**/*.md` (exceto changelog e cutover):

| Padrão | Arquivos afetados (aprox.) | Severidade |
| ------ | -------------------------- | ---------- |
| `docs/us/`, `docs/epics/`, `docs/versions/`, `docs/sprints/` | ~28 | P0–P1 |
| `app-desktop` como produto ativo | ~18 | P0–P1 |
| `sync-board`, `generate-board`, `board.json` como fluxo | ~12 | P1 (maioria histórico) |
| “US file”, “must match filename” | ~5 | P0 |
| `validate_meridian.py app-desktop` | ~6 | P1 |

---

## 4. P0 — corrige antes de confiar nos agentes

Arquivos que **instruem comportamento errado hoje**:

| Arquivo | Problema | Correção |
| ------- | -------- | -------- |
| `.agent/rules/MERIDIAN.md` § TIER 1 | `docs/versions/`, `docs/sprints/` como artefato | → `.meridian/meridian.db` + skills `create-*` |
| `.agent/references/templates/lifecycle.md` | “Board sync”, “US **file** is the contract” | → refresh automático no DB; “US **row**” |
| `.agent/references/start-here.md` | `must match filename`; `docs/versions/` | → id no SQLite; `versions` table |
| `.agent/references/instruction-surfaces.md` | P0 inteiro sobre `app-desktop` UI | → reescrever para `app-visual-studio` + extensão |
| `.agent/references/scrum-meridian-map.md` | `docs/sprints/vX-SY.md`; “multiple US **files**” | → `sprints` table; US rows |
| `.agent/references/templates/as-is-inventory-template.md` | “Create `docs/epics/`, `docs/versions/v0.md`” | → upsert SQLite ou nota v1-only |
| `.agent/references/templates/projects-manifest-template.md` | `us/US-XXXX.md exists` | → `user_stories` row ou legacy check |
| `.agent/skills/create-sprint/references/sprint-template.md` | `version` in `docs/versions/` | → FK `versions.id` no DB |
| `.agent/skills/create-version/references/version-template.md` | sprint “file in docs/sprints/” | → `sprints` table |
| `.agent/skills/create-user-story/SKILL.md` | description: “adding work to **docs/us**” | → SQLite `user_stories` |
| `.agent/skills/complete-user-story/references/implementation-template.md` | `feat(app-desktop):` | → `feat(extension):` ou `feat(kit):` |
| `docs/README.md` | Desktop monitor, `app-desktop/docs/`, `meridian-concepts.ts` | → dogfood repo root + extensão VS Code |
| `docs/04_principles.md` | tokens em `app-desktop/src/...` | → remover ou `app-visual-studio` |
| `.github/pull_request_template.md` | lint/test `app-desktop/` | → `app-visual-studio/` + `validate . --sqlite-only` |
| `SECURITY.md` | Vite `app-desktop/` | → extensão + kit scripts |
| `.agent/rules/AGENTS.md` | dogfood `app-desktop/docs/` | → repo root `docs/` |

**Artefato morto (remover do git se reaparecer):**

- `.agent/skills/generate-board-json/` — skill removida; não deve existir
- `docs/templates/` — espelho removido na onda C

---

## 5. P1 — desatualizado mas não quebra sempre

| Arquivo | Ação |
| ------- | ---- |
| `.agent/MERIDIAN.md` | “app-desktop monitor” → extensão |
| `.agent/references/usage-guide.md` | remover “app-desktop UI” de instruction surfaces |
| `.agent/references/templates/writing-guide.md` | anti-pattern `docs/epics/EPIC-04.md`; build `app-desktop` |
| `.agent/agents/process-manager.md` | `app-desktop/docs/` → `packageRoot` genérico |
| `README.md` | link `docs/versions/` (pasta não existe no v11) |
| `docs/01_tech_stack.md` | menções app-desktop como opção |
| `docs/06_database.md` | OK na maior parte; revisar tom “markdown file” vs body column |
| Skills `create-epic/version` | notas “do not create docs/*.md” — OK; padronizar wording |

---

## 6. P2 — manter (contexto legado / proibição)

| Arquivo | Por quê |
| ------- | ------- |
| `MERIDIAN_V2_CUTOVER.md` | histórico de migração |
| `README.md` branch `meridian-v1-old` | linhagem |
| `sqlite-delivery-operations.md` | lista o que **não** Write |
| `board-schema.md` | shape SQLite + nota pre-v11 |
| `board-keeper.md` proibições | anti-patterns |
| `migrate/archive/README.md` | migração v1 |
| `kit-improvement-plan.md` | diário de ondas |
| `app-visual-studio/CHANGELOG.md` | changelog — não reescrever |

---

## 7. Inventário — checklist arquivo a arquivo

Marque `[x]` quando o arquivo estiver **v11-operacional** (sem P0; P1 aceito ou corrigido).

### 7.1 Protocolo raiz `.agent/`

- [ ] `MERIDIAN.md`
- [ ] `ARCHITECTURE.md`
- [ ] `IDE_ADAPTERS.md`
- [ ] `KIT_README.md`
- [ ] `DISTRIBUTION.md`

### 7.2 Rules

- [x] `rules/MERIDIAN.md` — G1
- [ ] `rules/AGENTS.md` — **P0**

### 7.3 References (guias)

- [x] `references/start-here.md` — G1
- [ ] `references/usage-guide.md`
- [ ] `references/agents-help.md`
- [ ] `references/commit-after-us-close.md`
- [x] `references/instruction-surfaces.md` — G1
- [ ] `references/scrum-meridian-map.md` — **P0**
- [ ] `references/scrum-guide-complete.md` (verificar menções delivery path)

### 7.4 References/templates (registry)

- [ ] `templates/INDEX.md`
- [ ] `templates/TEMPLATE_SOURCES.md`
- [x] `templates/lifecycle.md` — G1
- [ ] `templates/writing-guide.md`
- [ ] `templates/section-contracts.md`
- [ ] `templates/sqlite-delivery-operations.md`
- [ ] `templates/board-schema.md`
- [ ] `templates/doc-templates.md`
- [ ] `templates/us-template.md`
- [ ] `templates/epic-template.md`
- [ ] `templates/version-template.md`
- [ ] `templates/sprint-template.md`
- [ ] `templates/review-checklist.md`
- [ ] `templates/refine-checklist.md`
- [ ] `templates/implement-gate-checklist.md`
- [ ] `templates/implementation-template.md`
- [ ] `templates/decision-template.md`
- [ ] `templates/decision-schema.md`
- [ ] `templates/discovery-folder-guide.md`
- [ ] `templates/as-is-inventory-template.md` — **P0**
- [ ] `templates/projects-manifest-template.md` — **P0**
- [ ] `templates/architecture-folder-guide.md`
- [ ] `templates/code-quality-at-us-time.md`

### 7.5 Agents (8)

- [ ] `agents/board-keeper.md`
- [ ] `agents/process-manager.md`
- [ ] `agents/sprint-planner.md`
- [ ] `agents/documentation-strategist.md`
- [ ] `agents/architecture-guardian.md`
- [ ] `agents/security-steward.md`
- [ ] `agents/scope-architect.md`
- [ ] `agents/product-owner.md`

### 7.6 Workflows (17)

- [ ] `workflows/init-meridian.md`
- [ ] `workflows/discover.md`
- [ ] `workflows/status.md`
- [ ] `workflows/create-epic.md`
- [ ] `workflows/create-version.md`
- [ ] `workflows/plan-sprint.md`
- [ ] `workflows/create-us.md`
- [ ] `workflows/review-us.md`
- [ ] `workflows/refine-us.md`
- [ ] `workflows/implement-us.md`
- [ ] `workflows/complete-us.md`
- [ ] `workflows/complete-sprint.md`
- [ ] `workflows/architecture.md`
- [ ] `workflows/security-pass.md`
- [ ] `workflows/daily-with-ai.md`
- [ ] `workflows/agents-help.md`
- [ ] `workflows/update-decisions-log.md`

### 7.7 Skills — SKILL.md (16)

- [ ] `skills/create-user-story/SKILL.md` — **P0 description**
- [ ] `skills/create-epic/SKILL.md`
- [ ] `skills/create-version/SKILL.md`
- [ ] `skills/create-sprint/SKILL.md`
- [ ] `skills/review-user-story/SKILL.md`
- [ ] `skills/refine-user-story/SKILL.md`
- [ ] `skills/implement-user-story/SKILL.md`
- [ ] `skills/complete-user-story/SKILL.md`
- [ ] `skills/complete-sprint/SKILL.md`
- [ ] `skills/init-project/SKILL.md`
- [ ] `skills/discover-product/SKILL.md`
- [ ] `skills/meridian-routing/SKILL.md`
- [ ] `skills/security-review/SKILL.md`
- [ ] `skills/update-decisions-log/SKILL.md`
- [ ] `skills/doc.md`

### 7.8 Skills — references/ (cópias locais)

- [ ] `create-user-story/references/us-template.md`
- [ ] `create-epic/references/epic-template.md`
- [ ] `create-version/references/version-template.md` — **P0**
- [ ] `create-sprint/references/sprint-template.md` — **P0**
- [ ] `review-user-story/references/review-checklist.md`
- [ ] `refine-user-story/references/refine-checklist.md`
- [ ] `implement-user-story/references/implement-gate-checklist.md`
- [ ] `complete-user-story/references/implementation-template.md` — **P0**
- [ ] `init-project/references/doc-templates.md`
- [ ] `init-project/references/gitignore-baseline.md`
- [ ] `update-decisions-log/references/*`
- [ ] `discover-product/references/*`
- [ ] `security-review/references/*`

### 7.9 Scripts docs

- [ ] `scripts/README.md`
- [ ] `scripts/migrate/archive/README.md`

### 7.10 Dogfood `docs/` (repo root)

- [x] `docs/README.md` — G1
- [ ] `docs/00_scope.md`
- [ ] `docs/01_tech_stack.md`
- [ ] `docs/02_security.md`
- [ ] `docs/03_user_types.md`
- [ ] `docs/04_principles.md` — **P0**
- [ ] `docs/05_architecture.md`
- [ ] `docs/06_database.md`
- [ ] `docs/07_api_contracts.md`
- [ ] `docs/08_environments.md`
- [ ] `docs/11_decisions.md`
- [ ] `docs/scrum-guide-complete.md`
- [ ] `docs/09_design_system.md` — stub H1 (created G1)

### 7.11 Repo root / CI / extensão

- [ ] `README.md`
- [ ] `AGENTS.md` (symlink → rules)
- [ ] `CONTRIBUTING.md`
- [ ] `SECURITY.md` — **P0**
- [ ] `.github/pull_request_template.md` — **P0**
- [ ] `app-visual-studio/README.md`
- [ ] `MERIDIAN_V2_CUTOVER.md` (P2 — só conferir)

---

## 8. Ondas de execução (onda G)

```txt
G1 — P0 bloqueantes (rules, lifecycle, start-here, instruction-surfaces, docs/README)
G2 — Templates registry + as-is + projects-manifest + sprint/version skill refs
G3 — Agents + workflows (passagem única; grep após cada pasta)
G4 — Dogfood docs/00–11 alinhados ao produto real (extensão, não desktop)
G5 — Repo root, CI, SECURITY, PR template
G6 — Guardrail: script ou job CI que falha se P0 patterns aparecem fora de allowlist
```

**Estimativa:** G1–G3 ≈ 1 sessão focada; G4–G5 ≈ 1 sessão; G6 ≈ meia sessão.

**Ordem dentro de cada arquivo:**

1. Abrir checklist §7
2. Buscar: `docs/us`, `docs/epics`, `app-desktop`, `sync-board`, `US file`, `filename`
3. Substituir por vocabulário SQLite (tabela, `meridian_db_cli`, `body_markdown`)
4. Manter bloco `> v11:` no topo se arquivo mistura exemplos históricos
5. Rodar `validate_meridian.py . --sqlite-only`

---

## 9. Guardrail proposto (G6)

Adicionar em `validate_meridian.py` ou script `validate_kit_markdown_v11.py`:

**Falhar** se em `.agent/{references,agents,skills,workflows,rules}/**/*.md`:

```regex
(?<!legacy: )(Write|Create|Edit|Open|Glob).{0,40}docs/(us|epics|versions|sprints)/
must match filename
/sync-board
generate-board-json
```

**Allowlist:** `sqlite-delivery-operations.md`, `board-schema.md`, `kit-improvement-plan.md`, `markdown-audit-v11.md`, `MERIDIAN_V2_CUTOVER.md`, `migrate/archive/*`, linhas com `never`, `do not`, `legacy`, `v1-old`.

---

## 10. Vocabulário v11 (cola para revisores)

| Evitar (v1) | Usar (v11) |
| ----------- | ---------- |
| `docs/us/US-XXXX.md` | `user_stories` row / `meridian_db_cli show US-XXXX` |
| `docs/epics/EPIC-XX.md` | `epics` table / `create-epic` |
| `docs/versions/vX.md` | `versions` table / `create-version` |
| `docs/sprints/vX-SY.md` | `sprints` table / `create-sprint` |
| `board.json` | `meridian_db_export --format planning` |
| `/sync-board` | _(removido — board refresh no save)_ |
| `app-desktop` monitor | `app-visual-studio` extension |
| US file / filename | US id / `body_markdown` column |
| `validate_meridian.py app-desktop` | `validate_meridian.py . --sqlite-only` |

---

## 11. Critério de “pronto” (onda G)

- [ ] Checklist §7 — 100% `[x]`
- [ ] Zero P0 no grep com allowlist
- [ ] `instruction-surfaces.md` descreve só superfícies que existem
- [ ] Novo agente em projeto limpo: `/create-us` → só SQLite, sem menção a `docs/us/` exceto proibição
- [ ] Guardrail G6 no CI (warning → error após 1 sprint)
- [ ] Vocabulário de agentes alinhado com **`agent-roster-and-workflow-v11.md`** (onda H)

---

## 12. Onda H — agentes e workflow (paralelo a G)

Não substitui G — complementa. Ver plano completo: **[`agent-roster-and-workflow-v11.md`](./agent-roster-and-workflow-v11.md)**.

| Novo agente | Papel | Workflow principal |
| ----------- | ----- | ------------------ |
| `implementation-specialist` | Código de produto pós-gate | `/implement-us` (hoje em `process-manager`) |
| `design-steward` | `docs/09_design_system.md` + refinamento UI | `/design-pass` (novo) |

Ao marcar §7 agents/workflows, aplicar também checklist H1 do roster plan.

---

*Maintainer: após cada sub-onda G/H, marcar checkboxes aqui e atualizar `kit-improvement-plan.md`.*
