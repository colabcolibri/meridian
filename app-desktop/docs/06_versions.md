---
title: Versões
status: approved
version: 2.0
updated: 2026-06-02
depends_on: [00_scope.md, 03_user_types.md]
blocks: [07_architecture.md, 08_database.md]
---

# 06 — Versões (índice)

Releases e sprints do produto. Este documento é o **índice de fase** — confirma que o catálogo existe e está aprovado.

Detalhes de cada release: **`docs/versions/`** · Sprints: **`docs/sprints/`**

## Catálogo de releases

| Versão | Nome                 | Status   | Foco                                                           |
| ------ | -------------------- | -------- | -------------------------------------------------------------- |
| v0     | Foundation           | complete | Setup técnico, kit `.agent/`, shell do monitor (3 abas, mock). |
| v1     | Folder Monitor MVP   | complete | Abrir pasta Meridian, ler `.md`, 3 abas reais, validações.     |
| v2     | Visual Studio Bridge | planned  | Extensão VSCode e escrita em disco.                            |

## Sprints

| Sprint | Versão | Status   | Título                            |
| ------ | ------ | -------- | --------------------------------- |
| v0-S1  | v0     | complete | Fundação técnica e kit            |
| v0-S2  | v0     | complete | Shell do monitor (3 visões)       |
| v1-S1  | v1     | complete | Leitura real da pasta             |
| v1-S2  | v1     | complete | Experiência do monitor (UX)       |
| v1-S3  | v1     | complete | Polish Entregas + Quadro          |
| v1-S4  | v1     | complete | Layout visual do monitor          |
| v1-S5  | v1     | complete | Polish Configuração e ferramentas |

## Regras

- IDs de versão: `v0`, `v1`, `v2`… (arquivo `docs/versions/vX.md` = `id: vX`).
- IDs de sprint: `v1-S1`, `v2-S1`… (arquivo `docs/sprints/{id}.md`).
- `v0` é fundação técnica — nunca vender como produto final.
- User stories referenciam **`version: vX`** no frontmatter — referência por ID, sem repetir o plano da versão.
- User stories só podem ser criadas quando **`04_epics.md` e `06_versions.md` estão `approved`**.
- Novo release → `/create-version` ou skill `create-version`.
- Nova sprint → `/plan-sprint` ou skill `create-sprint` (atualiza `docs/sprints/`).
