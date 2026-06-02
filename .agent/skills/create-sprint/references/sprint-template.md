# Template de sprint

```md
---
id: v1-S1
version: v1
title: Nome curto da sprint
status: planned
done_when: "Condição objetiva de encerramento da sprint."
stories: [US-0023, US-0024]
---

# v1-S1 — Nome curto da sprint

Sprint da versão **v1**.

| US      | Status | MoSCoW | Depende de | Epic    | Descrição |
| ------- | ------ | ------ | ---------- | ------- | --------- |
| US-0023 | ❌     | Must   | —          | EPIC-03 | …         |
```

## Regras

- `id` deve coincidir com o nome do arquivo (`v1-S1.md`).
- `version` deve existir em `docs/versions/`.
- `stories` no frontmatter é a lista canônica para validação; tabela no corpo é opcional (legibilidade).
