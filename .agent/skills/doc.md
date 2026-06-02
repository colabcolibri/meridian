# Meridian skills

> Guia para criar e usar skills no kit `.agent/`.

---

## Visão geral

Skills empacotam conhecimento especializado com **progressive disclosure**: o agente lê metadados (`name`, `description`) e só carrega o corpo quando a solicitação combina com a descrição.

Isso evita inflar o contexto com todo o protocolo Meridian em toda mensagem.

---

## Estrutura de pasta

```txt
.agent/skills/nome-da-skill/
  SKILL.md          # obrigatório — índice + procedimento
  references/       # opcional — templates, checklists longos
  scripts/          # opcional — automação
  assets/           # opcional — imagens, exemplos binários
```

| Escopo | Caminho |
| ------ | ------- |
| Workspace (projeto Meridian) | `<raiz-do-projeto>/.agent/skills/` |
| Kit Meridian (este repo) | `meridian/.agent/skills/` |

---

## Frontmatter de `SKILL.md`

```yaml
---
name: minha-skill
description: Uma linha clara com gatilhos. Use when...
allowed-tools: Read, Glob, Grep   # opcional — skills só leitura
---
```

Regras:

- `name` em kebab-case, igual ao nome da pasta.
- `description` é o principal gatilho de descoberta pelo agente.
- Corpo do arquivo = **índice**; detalhes longos vão para `references/`.

---

## Tabela "quando ler" (padrão obrigatório)

Todo `SKILL.md` com references deve incluir:

```markdown
| Arquivo | Quando ler |
| ------- | ---------- |
| `references/foo.md` | Ao criar X |
```

---

## Agents vs skills

| Camada | Função |
| ------ | ------ |
| **Agent** | Persona, fases, proibições, formato de saída, lista de skills |
| **Skill** | Procedimento repetível, templates, checklists, scripts |

O agent referencia skills no frontmatter:

```yaml
skills: init-project, update-decisions-log
```

---

## Scripts

Scripts ficam em `.agent/skills/<skill>/scripts/` ou `.agent/scripts/` global.

Exemplo global deste kit:

```bash
python .agent/scripts/validate_meridian.py /caminho/do/projeto
```

Agents e skills podem invocar scripts quando o procedimento exigir validação objetiva.

---

## Exemplo mínimo

```markdown
---
name: exemplo
description: Faz X no fluxo Meridian. Use when user asks for X.
allowed-tools: Read, Glob, Grep
---

# Exemplo

## Quando acionar
- ...

## Procedimento
1. ...

## Referências
| Arquivo | Quando ler |
| ------- | ---------- |
| `references/template.md` | Ao gerar arquivo Y |
```

---

## Skills oficiais do kit Meridian

| Skill | Pasta |
| ----- | ----- |
| `init-project` | `init-project/` |
| `create-user-story` | `create-user-story/` |
| `generate-board-json` | `generate-board-json/` |
| `update-decisions-log` | `update-decisions-log/` |
| `security-review` | `security-review/` |
| `meridian-routing` | `meridian-routing/` |

Ao adicionar uma skill nova, atualize `.agent/ARCHITECTURE.md` e o `README.md` da raiz.
