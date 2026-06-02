---
title: Log de Decisões
status: approved
version: 1.0
updated: 2026-06-02
depends_on: []
blocks: []
---

# 11 — Log de Decisões

## 2026-06-02 — Meridian começa seguindo seu próprio fluxo

**Documento afetado:** 00_scope.md
**O que mudou:** O projeto será desenvolvido usando a própria estrutura Meridian desde o início.
**Por que mudou:** O produto precisa provar seu fluxo de documentação viva enquanto é construído.
**Impacto em outros docs:** Criação da pasta `app-desktop/docs` e dos documentos de Fase 0 do app desktop.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Primeiro app será Vite antes da extensão

**Documento afetado:** 01_tech_stack.md
**O que mudou:** A primeira entrega será um app Vite local com React, TypeScript e shadcn/ui.
**Por que mudou:** Um app Vite permite validar a experiência, regras de documentação e estrutura visual antes de investir na extensão VSCode.
**Impacto em outros docs:** 00_scope.md, 01_tech_stack.md, 04_epics.md, 06_versions.md e 07_architecture.md.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Board canônico será JSON

**Documento afetado:** meridian.md
**O que mudou:** O board gerado pelo Meridian passa a ter `board.json` como formato canônico. CSV deixa de fazer parte da estrutura base.
**Por que mudou:** O app Vite e a futura extensão precisam operar sobre uma estrutura rica e estável; exportações como CSV devem ser derivadas sob demanda, não mantidas como fonte paralela.
**Impacto em outros docs:** README.md, 06_versions.md e futura documentação de arquitetura.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Meridian prioriza desenvolvimento consistente

**Documento afetado:** 00_scope.md
**O que mudou:** O posicionamento foi ampliado para qualquer pessoa, dev, time ou área que queira conduzir desenvolvimento com um fluxo pragmático baseado em SDD.
**Por que mudou:** Meridian não deve ser tratado como ferramenta apenas para times pequenos nem como uma malha de agentes. O produto existe para dar visibilidade, controle e consistência ao manager do processo.
**Impacto em outros docs:** 03_user_types.md, 04_epics.md, 06_versions.md e meridian.md.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Meridian é um fluxo para desenvolvimento com agentes de IA

**Documento afetado:** 00_scope.md
**O que mudou:** O escopo passou a declarar explicitamente que Meridian é feito para a nova era de trabalho com agentes de IA.
**Por que mudou:** O ponto central do produto é permitir que pessoas gerenciem desenvolvimento com agentes mantendo contexto, controle, visibilidade e consistência.
**Impacto em outros docs:** 03_user_types.md, 05_principles.md e futuras telas do app Vite.
**Responsável:** Produto/Engenharia

## 2026-06-02 — shadcn deve ser instalado pelo CLI oficial

**Documento afetado:** 01_tech_stack.md
**O que mudou:** A base visual deve usar o instalador oficial do shadcn para gerar componentes.
**Por que mudou:** O projeto deve seguir o fluxo esperado da biblioteca e evitar componentes shadcn recriados manualmente.
**Impacto em outros docs:** 05_principles.md e implementação do app Vite.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Git e qualidade local entram na fundação

**Documento afetado:** 01_tech_stack.md
**O que mudou:** O projeto passou a usar Git desde a fundação, `.gitignore` para proteger arquivos locais, Prettier, Husky e lint-staged.
**Por que mudou:** O fluxo Meridian exige consistência e governança antes de acelerar implementação com agentes de IA.
**Impacto em outros docs:** 02_security.md, 05_principles.md e 10_environments.md.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Protocolo e app desktop foram separados

**Documento afetado:** 00_scope.md
**O que mudou:** `meridian.md` passou a ser o protocolo universal para agentes de IA, enquanto o app Vite e sua documentação foram separados em `app-desktop/`.
**Por que mudou:** O protocolo precisa ser copiável para qualquer projeto, e o app desktop deve ser apenas uma camada visual que abre e monitora uma pasta Meridian.
**Impacto em outros docs:** README.md, 06_versions.md e tela inicial do app.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Skills para agentes entram no protocolo

**Documento afetado:** meridian.md
**O que mudou:** Foi criada a pasta raiz `skills/` com instruções auxiliares para agentes e a seção de segurança do protocolo foi aprofundada.
**Por que mudou:** Meridian precisa separar gestão visual do app e orientação operacional para agentes. Skills ajudam agentes a executar tarefas recorrentes sem inflar a home do app ou depender de uma ferramenta visual.
**Impacto em outros docs:** 00_scope.md, 06_versions.md e futuras validações do app desktop.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Camada operacional de agentes usa `.agent`

**Documento afetado:** meridian.md
**O que mudou:** A estrutura de agentes foi organizada em `.agent/`, com subpastas para agents, skills, workflows, rules e scripts.
**Por que mudou:** Meridian precisa de uma camada operacional reutilizável para agentes, separada do app visual e mais estruturada que skills soltas na raiz.
**Impacto em outros docs:** 00_scope.md, 06_versions.md, skills/README.md e futuras validações do app desktop.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Pasta `skills/` foi removida

**Documento afetado:** meridian.md
**O que mudou:** A pasta raiz `skills/` foi removida. Skills passam a existir apenas como pacotes formais em `.agent/skills/{skill}/SKILL.md`.
**Por que mudou:** A estrutura baseada em `.agent/` é mais completa e permite organizar agents, skills, workflows, rules e scripts em uma única camada operacional para agentes.
**Impacto em outros docs:** 00_scope.md, 06_versions.md, US-005.md, US-006.md, board.json e `.agent/MERIDIAN.md`.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Kit `.agent` alinhado ao padrão Antigravity

**Documento afetado:** README.md (raiz), meridian.md, `.agent/`
**O que mudou:** Criado `README.md` na raiz do repositório; `rules/MERIDIAN.md` passou a usar `trigger: always_on`; adicionados `meridian-routing`, `skills/doc.md`, `references/` nas skills, agents operacionais com fases, workflows com `$ARGUMENTS` e `ARCHITECTURE.md` atualizado.
**Por que mudou:** O kit precisa da mesma profundidade operacional do Antigravity (progressive disclosure, roteamento, gates) adaptada à governança documental Meridian, não apenas pastas vazias.
**Impacto em outros docs:** app-desktop/docs (US-007, README, 00_scope, 06_versions, 07_architecture), board.json e validação do app.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Modelo de produto do monitor e backlog v1

**Documento afetado:** 04_epics.md, 06_versions.md, docs/us/US-002.md, US-008–US-016, kanban/board.json
**O que mudou:** Epics EPIC-02/03/04 redefinidos para as três abas (Configuração inicial, Épicos, Kanban + validações). EPIC-01 marcado complete. Criadas US-008 (shell v0) e US-009–US-016 (v1-S1: pasta real, parser, abas, validações, fim do mock). US-002 reaberta como 🔶 até leitura real (US-011). Fonte de verdade permanece Markdown; app passa a ser leitor na v1, não autor. Tasks/Bug/Spike não viram artefatos — trabalho técnico fica em **Implementação técnica** dentro da US.
**Por que mudou:** Alinhar produto ao uso com agentes (dogfooding em `app-desktop/docs`) sem replicar Jira; eliminar UI confusa (duas colunas status/fluxo).
**Impacto em outros docs:** 07_architecture.md deve ir para review com parser e File System Access; README docs; agents devem citar US antes de codar v1.
**Responsável:** Manager do Processo / Produto

## 2026-06-02 — Leitura inline dos docs 00–11 (US-017)

**Documento afetado:** 04_epics.md (EPIC-02), 06_versions.md, US-017.md, US-011.md, board.json
**O que mudou:** Capacidade de **ler cada `.md` de configuração inicial** no app (botão Ler .md + painel frontmatter/conteúdo). Registrada como **US-017** no epic **EPIC-02**, não como epic separado — é parte do monitor de configuração.
**Por que mudou:** Manager precisa revisar documentos na mesma ferramenta que monitora o fluxo, sem só ver status agregado.
**Impacto em outros docs:** US-010 deve reutilizar `splitFrontmatter` / leitor; US-011 foca status da lista a partir do parser.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Pasta monitorada = `docs/` (não raiz do repositório)

**Documento afetado:** US-009, app-desktop `src/features/folder/`, monitor UI
**O que mudou:** O File System Access API abre diretamente a pasta **docs/** do projeto (`00_scope.md` na raiz do handle, `us/`, `kanban/`). Validação deixa de exigir subpasta `docs/` dentro da raiz escolhida. Loader e leitor de fase leem arquivos na raiz do handle. Mensagens de issue usam caminhos relativos à pasta docs (`04_epics.md`, `us/US-001.md`).
**Por que mudou:** Toda a estrutura Meridian que o manager edita com agentes vive em `docs/`; abrir o repositório ou `app-desktop/` era conceito errado para dogfooding.
**Impacto em outros docs:** `validate_meridian.py` em dev continua recebendo a raiz do app (`app-desktop/`), não só `docs/`. US-015 inalterada nesse ponto.
**Responsável:** Produto/Engenharia

## 2026-06-02 — Go-live v1-S1 (Folder Monitor MVP)

**Documento afetado:** 06_versions.md, 07_architecture.md, 04_epics.md (EPIC-02), docs/README.md, board.json
**O que mudou:** v1-S1 marcada concluída com checklist go-live; `07_architecture.md` → `approved` (pasta monitorada = `docs/`); EPIC-02 → `complete`; board regenerado das US.
**Por que mudou:** Fechar o marco v1 antes de planejar v2 (VSCode / escrita).
**Impacto em outros docs:** Próximo trabalho de produto entra em `06_versions` seção v2 e novas US sob EPIC-05.
**Responsável:** Produto/Engenharia
