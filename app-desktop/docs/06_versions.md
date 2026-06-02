---
title: Versões
status: approved
version: 1.1
updated: 2026-06-02
depends_on: [00_scope.md, 03_user_types.md]
blocks: [07_architecture.md, 08_database.md]
---

# 06 — Versões

| Versão | Nome                 | Foco                                                                 |
| ------ | -------------------- | -------------------------------------------------------------------- |
| v0     | Foundation           | Setup técnico, kit `.agent/`, shell do monitor (3 abas, mock).       |
| v1     | Folder Monitor MVP   | Abrir pasta Meridian, ler `.md`, 3 abas com dados reais, validações. |
| v2     | Visual Studio Bridge | Extensão VSCode e escrita em disco.                                  |

## v0 — Foundation

**Objetivo:** fundação técnica e documental do app desktop e do kit Meridian na raiz.

**Critério de Done:** `pnpm dev` / `pnpm build` ok; monitor com 3 abas; `docs/` e US governam o trabalho.

**Estimativa:** 2 sprints (S1 + S2).

### Incluído nesta versão

- App Vite, React, TypeScript, Tailwind, shadcn/ui.
- Kit `.agent/` (agents, skills, workflows, rules).
- Monitor: Configuração inicial, Épicos, Kanban (dados mock alinhados a `app-desktop/docs`).
- User stories US-001 a US-008.

### Explicitamente fora

- Leitura real de pasta no browser → v1 (US-009+).
- Escrita em Markdown pelo app → v2.
- Backend, auth, multiusuário.

### Checklist go-live v0

#### Produto

- [x] App abre em tela útil (3 abas), sem landing page.
- [x] Diferencia protocolo, app desktop e pasta monitorada (texto + CTA Abrir pasta desabilitado até v1).

#### Segurança

- [x] Nenhum segredo exigido ou persistido.

#### Infra

- [x] `pnpm dev` funciona.
- [x] `pnpm build` funciona.

## v0-S1 — Fundação técnica e kit

**Done quando:** repositório, app Vite, Git/qualidade local e kit `.agent/` operacionais.

**Status:** ✅

| US     | Status | MoSCoW | Depende de | Descrição resumida                     |
| ------ | ------ | ------ | ---------- | -------------------------------------- |
| US-001 | ✅     | Must   | —          | Abrir app localmente                   |
| US-002 | ✅     | Must   | US-001     | Ver docs de fase (lista real da pasta) |
| US-003 | ✅     | Must   | US-001     | Git e qualidade local                  |
| US-004 | ✅     | Must   | US-001     | Separar protocolo e app desktop        |
| US-005 | ✅     | Must   | US-004     | Skills em `.agent/`                    |
| US-006 | ✅     | Must   | US-005     | Camada `.agent` organizada             |
| US-007 | ✅     | Must   | US-006     | Kit padrão Antigravity                 |

## v0-S2 — Shell do monitor (3 visões)

**Done quando:** UI do produto reflete Config / Épicos / Kanban sem tabela confusa status+fluxo.

**Status:** ✅

| US     | Status | MoSCoW | Depende de | Descrição resumida              |
| ------ | ------ | ------ | ---------- | ------------------------------- |
| US-008 | ✅     | Must   | US-002     | Três abas do monitor de produto |

## v1 — Folder Monitor MVP

**Objetivo:** gerenciar o projeto **pelos mesmos arquivos** que agentes editam (`docs/`, `docs/us/`, `board.json`).

**Critério de Done:** usuário abre a pasta `docs/` do projeto (ex.: `app-desktop/docs/`); as 3 abas refletem os `.md` sem mock nem `data.ts` como fonte.

**Estimativa:** 1–2 sprints.

### Incluído

- File System Access (ou bridge) para escolher pasta.
- Parser de frontmatter para docs de fase, `04_epics.md` e `docs/us/`.
- Validações alinhadas ao protocolo e `validate_meridian.py`.

### Fora

- Edição de US/docs pelo browser.
- Tasks/Bug/Spike como artefatos separados (permanecem dentro da US ou no chat).

## v1-S1 — Leitura real da pasta

**Done quando:** US-009 a US-014 concluídas; mock removido (US-015).

**Status:** ✅

| US     | Status | MoSCoW | Depende de     | Epic    | Descrição resumida                      |
| ------ | ------ | ------ | -------------- | ------- | --------------------------------------- |
| US-009 | ✅     | Must   | US-008         | EPIC-02 | Abrir pasta Meridian no app             |
| US-010 | ✅     | Must   | US-009         | EPIC-02 | Parser Markdown + frontmatter           |
| US-011 | ✅     | Must   | US-010         | EPIC-02 | Config inicial lê `docs/00–11` reais    |
| US-017 | ✅     | Must   | US-009         | EPIC-02 | Ler cada `docs/00–11/*.md` no app       |
| US-012 | ✅     | Must   | US-010         | EPIC-04 | Aba Épicos lê `04_epics.md`             |
| US-013 | ✅     | Must   | US-010         | EPIC-04 | Kanban lê `docs/us` + `board.json`      |
| US-014 | ✅     | Must   | US-011, US-013 | EPIC-03 | Validações de protocolo na UI           |
| US-015 | ✅     | Should | US-014         | EPIC-03 | Invocar `validate_meridian.py` na pasta |
| US-016 | ✅     | Should | US-011–013     | EPIC-02 | Remover `data.ts` como fonte de verdade |

**Status v1:** ✅ (go-live v1-S1 em 2026-06-02)

### Checklist go-live v1

#### Produto

- [x] Abrir pasta `docs/` via File System Access (US-009).
- [x] Três abas com dados reais da pasta aberta (US-011, US-012, US-013).
- [x] Ler cada doc 00–11 inline (US-017).
- [x] Validações de protocolo na UI (US-014); mock removido (US-016).

#### Qualidade

- [x] `pnpm test` e `pnpm build` passam.
- [x] `validate_meridian.py app-desktop` passa (dev: botão Validar pasta).

#### Documentação

- [x] `07_architecture.md` approved (pasta monitorada = `docs/`).
- [x] `board.json` derivado de `docs/us/`.

## Próximo marco — v2

Planejar extensão VSCode / escrita em disco (EPIC-05). Ver `04_epics.md` e US futuras em `06_versions` quando `04_epics` e esta seção forem atualizados para v2.
