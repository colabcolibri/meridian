# Contribuindo com o Meridian

Obrigado por considerar contribuir. Este repositório é **experimental** — APIs, UX e convenções podem mudar enquanto o protocolo amadurece.

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [Licença de Uso Meridian](LICENSE) (uso gratuito; venda do Software proibida sem autorização).

## Antes de começar

1. Leia [`meridian.md`](meridian.md) para entender o conceito.
2. Leia [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md) se for alterar comportamento de agentes.
3. Confirme que sua mudança respeita a regra central: **`docs/` do projeto alvo é a fonte de verdade** (no kit, `app-desktop/docs/`).

## Onde editar

| O que você quer mudar | Onde editar |
| ------------------- | ----------- |
| Agents, skills, workflows, rules | **`.agent/`** (fonte canônica) |
| Adapter Cursor (symlinks locais) | Rode `./.agent/scripts/sync_cursor_kit.sh` — **não** commite `.cursor/` |
| App desktop (UI, parser, validações) | `app-desktop/src/` |
| Documentação de produto do app | `app-desktop/docs/` |
| Decisões arquiteturais | Append em `app-desktop/docs/11_decisions.md` |

## Ambiente local

### Kit + validação

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
```

### App desktop

```bash
cd app-desktop
pnpm install
pnpm dev        # http://localhost:5173
pnpm lint
pnpm test
pnpm build
```

### Cursor (opcional)

Após clone ou ao adicionar item novo em `.agent/`:

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh
```

## Fluxo de contribuição

1. Abra uma issue descrevendo o problema ou a proposta (opcional, mas recomendado para mudanças grandes).
2. Crie um branch a partir de `main`.
3. Faça alterações focadas — evite misturar refatoração ampla com feature ou fix.
4. Rode validação e testes antes do PR.
5. Abra pull request com:
   - **O quê** mudou
   - **Por quê** (problema ou objetivo)
   - **Como testar**
   - Screenshots se houver mudança visual

## Convenções

- **Commits:** mensagens claras em português ou inglês (seja consistente no PR).
- **Documentação:** precede código de produto quando a mudança altera protocolo ou governança.
- **User stories:** só após `04_epics.md` e `06_versions.md` `approved` (ver `.agent/MERIDIAN.md`).
- **Decisões:** mudanças de escopo, stack ou arquitetura → append em `11_decisions.md`.
- **`.cursor/`:** nunca commitar — está no `.gitignore`.

## O que não aceitamos (por enquanto)

- Segredos, tokens ou `.env` com valores reais.
- Commits de `node_modules/`, `dist/` ou builds.
- Mudanças que quebrem o princípio “documentação antes de código” sem justificativa registrada.
- Features de automação autônoma sem revisão humana (fora do escopo do Meridian).

## Dúvidas

Abra uma issue com a tag `question` ou descreva o contexto no PR.
