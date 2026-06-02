---
id: EPIC-01
title: Estrutura do Projeto
status: complete
versions: [v0]
profiles: [Manager do Processo, Operador Local]
outcome: "Repositório com kit Meridian, app Vite e docs/ governando o trabalho — pronto para dogfooding."
---

# EPIC-01 — Estrutura do Projeto

## Capacidade

Fundação do repositório e do app Vite: separação clara entre protocolo (`meridian.md`, `.agent/`) e produto (`app-desktop/`), qualidade local (Git, lint, hooks) e kit operacional para agentes de IA.

## Resultado esperado

Manager consegue clonar o repo, rodar `pnpm dev`, abrir a pasta `docs/` no monitor e ver documentos + US alinhados ao protocolo Meridian.

## Fora deste epic

- Leitura real de pasta no browser (EPIC-02).
- Validações visíveis de protocolo (EPIC-03).
- Extensão VS Code (EPIC-05).
