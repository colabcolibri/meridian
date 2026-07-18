# Audit markdown v11 — review completo para estrutura SQLite

> **Status:** em execução — jul/2026  
> **Última atualização:** H1 ✅ · G1 ✅ · G2 ✅ · G3/G5 ✅ · G4/G6 ✅ (guardrail)
> **Gatilho:** onda A marcou skills como ✅, mas dezenas de `.md` ainda descreviam delivery como arquivos `docs/us/*.md`, `app-desktop`, `/sync-board`, ou “US file”.  
> **Objetivo:** um agente ou humano consegue seguir **qualquer** markdown do kit sem ambiguidade v1 vs v11.

**Progresso rápido:**

| Onda | Status | Notas |
| ---- | ------ | ----- |
| **G1** | ✅ | rules, lifecycle, start-here, instruction-surfaces, docs/README |
| **H1** | ✅ | 9 agentes Scrum, `/design-pass`, routing v2, workflows |
| **H2** | ⏳ | gate `--h2-ready` + `agent-aliases-h2.md` — delete 6 legacy files |
| **G2** | ✅ | templates P0 + writing-guide |
| **G3** | ✅ | MERIDIAN, usage-guide, agents/workflows H1 |
| **G5** | ✅ | PR template, SECURITY, README |
| **G4** | ✅ | `docs/01_tech_stack.md` → extension + SQLite |
| **G6** | ✅ | `validate_kit_markdown_v11` + `--strict-kit-md` no CI |

**Skills novas:** seguir `.agent/skills/doc.md` + padrão create-skill (description 3ª pessoa com WHAT/WHEN, tabela selective reading, corpo &lt;500 linhas, detalhes em `references/`).

---

## 1. Veredito honesto

| O que dissemos | Realidade |
| -------------- | --------- |
| Onda A ✅ — skills/workflows SQLite | **Parcial:** write paths nos skills principais; templates P0 em G2 |
| Onda H1 ✅ — roster Scrum | **OK** — 9 agentes, aliases legacy, validator atualizado |
| Onda C ✅ — sem `docs/templates/` | **OK** no repo |
| Onda D/E ✅ — scripts | **OK** |

**Conclusão:** onda **G** quase fechada — checklist §7 (skills secundários) + **H2** delete legacy.

---

## 2. Modelo alvo (uma frase por camada)

```txt
Phase docs     → docs/00–11, discovery/, architecture/, decisions/*.json  (Markdown Write)
Delivery       → .meridian/meridian.db                                    (CLI / form upsert)
Board UI       → leitura SQLite via meridian_db_export --format planning
Templates      → .agent/references/templates/                               (forma do body_markdown)
Protocolo      → .agent/MERIDIAN.md, rules/, agents/, skills/, workflows/
```

**Regra de ouro para revisores:** se o texto diz “crie/edite/leia `docs/us/US-XXXX.md`” como caminho **primário** → **P0 bug**. Menção a v1 em “não faça”, “legacy”, ou “branch meridian-v1-old” → **P2 OK**.

---

## 3. Scan automático (baseline jul/2026)

| Padrão | Arquivos afetados (aprox.) | Severidade | Progresso |
| ------ | -------------------------- | ---------- | --------- |
| `docs/us/`, `docs/epics/`, … como write path | ~28 → ~12 | P0–P1 | G2/G3 em curso |
| `app-desktop` como produto ativo | ~18 → ~2 | P0–P1 | G4/G5 ✅ (histórico OK) |
| `sync-board`, `board.json` | ~12 | P1 | maioria histórico |
| “US file”, “must match filename” | ~5 → ~2 | P0 | sprint-template ✅ |
| `validate_meridian.py app-desktop` | ~6 → ~1 | P1 | AGENTS.md ✅ |

---

## 4. P0 — corrige antes de confiar nos agentes

| Arquivo | Problema | Status |
| ------- | -------- | ------ |
| `.agent/rules/MERIDIAN.md` § TIER 1 | paths v1 | ✅ G1 |
| `.agent/references/templates/lifecycle.md` | US file | ✅ G1 |
| `.agent/references/start-here.md` | filename | ✅ G1 |
| `.agent/references/instruction-surfaces.md` | app-desktop | ✅ G1 |
| `.agent/references/scrum-meridian-map.md` | docs/sprints | ✅ G2 |
| `.agent/references/templates/as-is-inventory-template.md` | docs/epics, versions | ✅ G2 |
| `.agent/references/templates/projects-manifest-template.md` | us/US-XXXX.md only | ✅ G2 |
| `create-sprint/.../sprint-template.md` | docs/versions | ✅ G2 |
| `create-version/.../version-template.md` | docs/sprints | ✅ G2 |
| `create-user-story/SKILL.md` | description docs/us | ✅ G2 |
| `complete-user-story/.../implementation-template.md` | feat(app-desktop) | ✅ G2 |
| `docs/README.md` | app-desktop | ✅ G1 |
| `docs/04_principles.md` | tokens app-desktop | ✅ G4 parcial |
| `.github/pull_request_template.md` | app-desktop | ✅ G5 |
| `SECURITY.md` | app-desktop | ✅ G5 |
| `README.md` | link docs/versions | ✅ G5 |
| `.agent/rules/AGENTS.md` | app-desktop dogfood | ✅ G2 |
| `.agent/skills/generate-board-json/` | skill morta | ✅ removida |

---

## 5. P1 — desatualizado mas não quebra sempre

| Arquivo | Ação | Status |
| ------- | ---- | ------ |
| `.agent/MERIDIAN.md` | extensão vs monitor | ✅ G3 |
| `.agent/references/usage-guide.md` | app-desktop UI | ✅ G3 |
| `.agent/references/templates/writing-guide.md` | anti-pattern paths | ✅ G2 |
| `README.md` | link docs/versions | ✅ G5 |
| Skills `create-epic/version` | padronizar wording | ✅ G2 |

---

## 6. P2 — manter (contexto legado / proibição)

| Arquivo | Por quê |
| ------- | ------- |
| `MERIDIAN_V2_CUTOVER.md` | histórico |
| `sqlite-delivery-operations.md` | lista o que **não** Write |
| `board-keeper.md` / legacy agents | anti-patterns + alias H1 |
| `kit-improvement-plan.md` | diário de ondas |

---

## 7. Inventário — checklist arquivo a arquivo

Marque `[x]` quando **v11-operacional** (sem P0; P1 aceito ou corrigido).

### 7.1 Protocolo raiz `.agent/`

- [x] `MERIDIAN.md` — G3 (§9 agents, phase table)
- [x] `ARCHITECTURE.md` — H1
- [ ] `IDE_ADAPTERS.md`
- [ ] `KIT_README.md`
- [ ] `DISTRIBUTION.md`

### 7.2 Rules

- [x] `rules/MERIDIAN.md` — G1 + H1 classifier
- [x] `rules/AGENTS.md` — G2
- [x] `rules/meridian.mdc` — H1 (`/design-pass`)

### 7.3 References (guias)

- [x] `references/start-here.md` — G1
- [x] `references/usage-guide.md` — G3
- [x] `references/agents-help.md` — H1
- [ ] `references/commit-after-us-close.md`
- [x] `references/instruction-surfaces.md` — G1
- [x] `references/scrum-meridian-map.md` — G2 + H1 roles
- [ ] `references/scrum-guide-complete.md`

### 7.4 References/templates (registry)

- [x] `templates/INDEX.md` — H1 + G2
- [ ] `templates/TEMPLATE_SOURCES.md`
- [x] `templates/lifecycle.md` — G1
- [ ] `templates/writing-guide.md`
- [ ] `templates/section-contracts.md`
- [ ] `templates/sqlite-delivery-operations.md`
- [ ] `templates/board-schema.md`
- [ ] `templates/doc-templates.md`
- [ ] `templates/us-template.md`
- [ ] `templates/epic-template.md`
- [x] `templates/version-template.md` — G2 (symlink → skill ref)
- [x] `templates/sprint-template.md` — G2
- [x] `templates/review-checklist.md` — H1
- [ ] `templates/refine-checklist.md`
- [ ] `templates/implement-gate-checklist.md`
- [x] `templates/implementation-template.md` — G2
- [ ] `templates/decision-template.md`
- [ ] `templates/decision-schema.md`
- [x] `templates/discovery-folder-guide.md` — H1
- [x] `templates/as-is-inventory-template.md` — G2
- [x] `templates/projects-manifest-template.md` — G2
- [x] `templates/architecture-folder-guide.md` — H1
- [ ] `templates/code-quality-at-us-time.md`

### 7.5 Agents (v11 roster — 9 + legacy aliases)

- [x] Todos os 9 agentes v11 + legacy deprecated — **H1**

### 7.6 Workflows (18)

- [x] Todos workflows operacionais — **H1** (incl. `design-pass.md`)
- [ ] Revisar `discover.md`, `update-decisions-log.md` (grep residual)

### 7.7 Skills — SKILL.md (17)

- [x] `skills/create-user-story/SKILL.md` — G2
- [x] `skills/meridian-routing/SKILL.md` — H1
- [x] `skills/design-system/SKILL.md` — H1 + create-skill pattern
- [x] `skills/discover-product/SKILL.md` — H1
- [x] `skills/create-epic/SKILL.md` — v11 note OK
- [x] `skills/create-version/SKILL.md` — G2
- [x] `skills/create-sprint/SKILL.md` — G2
- [x] `skills/complete-sprint/SKILL.md` — v11 OK
- [x] `skills/implement-user-story/SKILL.md` — v11 OK
- [x] `skills/init-project/SKILL.md` — v11 OK
- [ ] `skills/review-user-story/SKILL.md`
- [ ] `skills/refine-user-story/SKILL.md`
- [ ] `skills/implement-user-story/SKILL.md`
- [ ] `skills/complete-user-story/SKILL.md`
- [ ] `skills/complete-sprint/SKILL.md`
- [ ] `skills/init-project/SKILL.md`
- [ ] `skills/security-review/SKILL.md`
- [ ] `skills/update-decisions-log/SKILL.md`
- [ ] `skills/doc.md`

### 7.8 Skills — references/

- [x] `create-version/references/version-template.md` — G2
- [x] `create-sprint/references/sprint-template.md` — G2
- [x] `complete-user-story/references/implementation-template.md` — G2
- [x] `review-user-story/references/review-checklist.md` — H1
- [x] `discover-product/references/*` — H1
- [ ] demais refs (grep §3)

### 7.9 Scripts docs

- [x] `scripts/README.md` — H2 `--h2-ready` documented
- [ ] `scripts/migrate/archive/README.md` (P2 OK)

### 7.10 Dogfood `docs/`

- [x] `docs/README.md` — G1
- [x] `docs/00_scope.md` — histórico `app-desktop` removido OK
- [x] `docs/01_tech_stack.md` — G4 extension + SQLite
- [x] `docs/05_architecture.md` — seção removed monitor OK
- [ ] `docs/02_security.md` … `docs/08_environments.md` (grep §3 se necessário)
- [x] `docs/04_principles.md` — G4 parcial (app-desktop → extension)
- [x] `templates/writing-guide.md` — G2
- [x] `docs/09_design_system.md` — stub G1

### 7.11 Repo root / CI / extensão

- [ ] `README.md` — G5 parcial (versions link ✅)
- [x] `SECURITY.md` — G5
- [x] `.github/pull_request_template.md` — G5

---

## 8. Ondas de execução (onda G)

```txt
G1 — P0 bloqueantes          ✅
H1 — roster Scrum              ✅
G2 — Templates + skill refs    🔄 (esta sessão)
G3 — Agents/workflows grep     🔄 (maioria H1)
G5 — Repo root, CI, SECURITY          🔄
G4 — Dogfood docs/00–11               ✅
G6 — Guardrail CI grep               ✅
```

**Ordem por arquivo:** checklist §7 → grep P0 patterns → substituir vocabulário §10 → `validate_meridian.py . --sqlite-only`

---

## 9. Guardrail (G6) — implementado

Função `validate_kit_markdown_v11()` em `validate_meridian.py`:

| Padrão | Severidade |
| ------ | ---------- |
| `validate_meridian.py app-desktop` | erro com `--strict-kit-md` |
| `/sync-board`, `generate-board-json`, `must match filename` | idem |
| `Write/Create/… docs/(us\|epics\|versions\|sprints)/` como caminho primário | idem |
| `app-desktop` sem contexto legacy/negado | idem |

**Flags:** default = WARN; `--strict-kit-md` = ERROR (usado no CI).

**Allowlist:** `references/plans/*`, `agent-aliases-h2.md`, templates históricos, agentes deprecated H1, linhas com `never` / `do not` / `removed` / `→` (markdown bold ignorado).

```bash
python3 .agent/scripts/validate_meridian.py . --strict-kit-md
```

---

## 10. Vocabulário v11 (cola para revisores)

| Evitar (v1) | Usar (v11) |
| ----------- | ---------- |
| `docs/us/US-XXXX.md` | `user_stories` row / `meridian_db_cli show US-XXXX` |
| `process-manager` + código | `scrum-master` + `developer` |
| `board-keeper` | `backlog-refiner` |
| `architecture-guardian` | `technical-architect` |
| `security-steward` | `security-champion` |
| `documentation-strategist` | `technical-writer` |
| `scope-architect` | `product-owner` |
| `implementation-specialist` / `design-steward` | `developer` / `design-system-owner` |
| `docs/epics/EPIC-XX.md` | `epics` table / `create-epic` |
| `docs/versions/vX.md` | `versions` table / `create-version` |
| `docs/sprints/vX-SY.md` | `sprints` table / `create-sprint` |
| `board.json` | `meridian_db_export --format planning` |
| `/sync-board` | _(removido)_ |
| `app-desktop` monitor | `app-visual-studio` extension |
| US file / filename | US id / `body_markdown` column |
| `validate_meridian.py app-desktop` | `validate_meridian.py . --sqlite-only` |

---

## 11. Critério de “pronto” (onda G)

- [ ] Checklist §7 — 100% `[x]`
- [ ] Zero P0 no grep com allowlist
- [x] Vocabulário de agentes alinhado com **`agent-roster-and-workflow-v11.md`** (H1 ✅)
- [x] Guardrail G6 no CI (`--strict-kit-md`)
- [ ] Novo agente: `/create-us` → só SQLite

---

## 12. Onda H — agentes e workflow

**H1 ✅ concluída.** Ver [`agent-roster-and-workflow-v11.md`](./agent-roster-and-workflow-v11.md).

| Agente | Papel | Workflow principal |
| ------ | ----- | ------------------ |
| `developer` | Development Team — incremento | `/implement-us` |
| `design-system-owner` | Enabler UI | `/design-pass` |
| `scrum-master` | Facilitação processo | `/status`, `/daily-with-ai` |
| `backlog-refiner` | Backlog refinement | `/create-us` … `/complete-us` |
| `product-owner` | Discovery + scope + epic | `/discover`, `/create-epic` |

**H2 pendente:** remover 6 arquivos legacy — gate `validate_meridian.py . --h2-ready` + `agent-aliases-h2.md`.

---

## 13. H2 — remoção de agentes deprecated

| Item | Detalhe |
| ---- | ------- |
| Contrato | `references/agent-aliases-h2.md` |
| Gate CLI | `python3 .agent/scripts/validate_meridian.py . --h2-ready` |
| Manter após delete | `meridian-routing` § Legacy aliases (chat routing) |
| Quebra | `@process-manager` no IDE picklist — usar `@scrum-master` |
| Não quebra | workflows, `REQUIRED_AGENTS`, `sync_cursor_kit` prune |

- [ ] `--h2-ready` sem erros de refs operacionais
- [ ] 6 arquivos `agents/*` legacy deletados
- [ ] `sync_cursor_kit.sh` executado
- [ ] `--h2-ready` com zero legacy files

