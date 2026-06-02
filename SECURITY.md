# Política de segurança

## Status do projeto

Meridian é um **projeto experimental** em desenvolvimento ativo. Não há programa formal de bug bounty nem SLA de resposta garantido.

## Versões suportadas

| Versão | Suporte |
| ------ | ------- |
| `main` | Recebe correções de segurança conforme capacidade do maintainer |
| Tags de release | Melhor esforço — preferir sempre a última tag |

## Reportar uma vulnerabilidade

**Não abra issue pública** para vulnerabilidades de segurança.

Envie um reporte privado via [GitHub Security Advisories](https://github.com/colabcolibri/meridian/security/advisories/new) (ajuste a URL após publicar o repositório) ou abra uma issue genérica pedindo contato privado se Advisories ainda não estiver disponível.

Inclua:

- Descrição do problema
- Passos para reproduzir
- Impacto estimado
- Versão/commit afetado (se souber)

## Escopo

Este repositório inclui:

- Kit de agentes (`.agent/`)
- App desktop Vite (`app-desktop/`) — leitura local de pastas via File System Access API

Fora de escopo imediato: integrações cloud, autenticação multiusuário, extensão VS Code (planejada).

## Boas práticas para quem usa o kit

- **Nunca** commite `.env` ou credenciais — o baseline está em `.agent/skills/init-project/references/gitignore-baseline.md`.
- O app desktop lê arquivos **locais** que você autoriza no navegador; não envia dados para servidores Meridian (não há backend).
- Revise conteúdo gerado por agentes antes de merge — o kit orienta governança, mas não substitui revisão humana.
- Mantenha dependências atualizadas (`pnpm audit` em `app-desktop/`).

## Divulgação responsável

Pedimos tempo razoável para investigar e corrigir antes de divulgação pública. Agradecemos reports construtivos.
