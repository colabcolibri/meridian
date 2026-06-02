---
title: Versões
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [00_scope.md, 03_user_types.md]
blocks: [07_architecture.md, 08_database.md]
---

# 06 — Versões

| Versão | Nome                 | Foco                                                                                |
| ------ | -------------------- | ----------------------------------------------------------------------------------- |
| v0     | Foundation           | Setup técnico, shadcn/ui, estrutura base e separação entre protocolo e app desktop. |
| v1     | Folder Monitor MVP   | Abrir/monitorar pasta Meridian, documentos, dependências, validações e board JSON.  |
| v2     | Visual Studio Bridge | Preparação para extensão Visual Studio/VSCode e operação real de arquivos.          |

## v0 — Foundation

**Objetivo:** criar a fundação técnica e documental do app desktop que monitora projetos Meridian.

**Critério de Done:** o app Vite em `app-desktop/` roda com `pnpm dev`, renderiza uma tela base profissional com shadcn/ui e deixa claro que monitora uma pasta Meridian.

**Estimativa:** 1 sprint.

### Incluído nesta versão

- Estrutura Vite com React e TypeScript.
- Tailwind CSS e shadcn/ui.
- Layout principal do app.
- Dados iniciais simulando uma pasta Meridian monitorada.
- Documentação `app-desktop/docs` inicial.
- `meridian.md` universal preservado na raiz do repositório.

### Explicitamente fora

- Escrita real em arquivos Markdown pelo browser → v2.
- Extensão Visual Studio/VSCode → v2.
- Backend, autenticação e banco de dados → backlog sem previsão.
- Board completo editável → v1.

### Riscos

- Setup visual consumir tempo demais antes das regras de produto → mitigar usando shadcn/ui incrementalmente.
- v0 virar MVP disfarçado → manter v0 técnico.

### Checklist go-live

#### Produto

- [ ] App abre em tela útil, sem landing page.
- [ ] A tela diferencia protocolo, app desktop e pasta monitorada.

#### Segurança

- [ ] Nenhum segredo é exigido ou persistido.

#### Infra

- [ ] `pnpm dev` funciona.
- [ ] `pnpm build` funciona.

## v0-S1 — Fundação Vite

**Done quando:** o app Vite existe, roda localmente, usa shadcn/ui e mostra uma visão inicial de uma pasta Meridian monitorada.
**Status:** ❌

| US     | Status | MoSCoW | Depende de | Descrição                                                          | Aceite                                                      | Fora de escopo          |
| ------ | ------ | ------ | ---------- | ------------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------- |
| US-001 | ✅     | Must   | —          | Como Manager do Processo, quero abrir o app Meridian localmente    | App roda com `pnpm dev` e renderiza layout inicial          | Escrita em disco        |
| US-002 | ✅     | Must   | US-001     | Como Manager do Processo, quero ver os docs de fase e status       | Lista de docs exibe dependências e bloqueios básicos        | Edição real de Markdown |
| US-003 | ✅     | Must   | US-001     | Como Manager do Processo, quero Git e qualidade local configurados | Git, gitignore, Prettier, Husky e lint-staged configurados  | CI remoto               |
| US-004 | ✅     | Must   | US-001     | Como Manager do Processo, quero separar protocolo e app desktop    | `meridian.md` fica na raiz e app Vite em `app-desktop/`     | Abertura real de pasta  |
| US-005 | ✅     | Must   | US-004     | Como Manager do Processo, quero skills auxiliares para agentes     | `.agent/skills` criado e segurança aprofundada no protocolo | UI de skills            |
| US-006 | ✅     | Must   | US-005     | Como Manager do Processo, quero camada `.agent` organizada         | Agents, skills, workflows, rules e scripts em `.agent/`     | CLI de instalação       |
