---
title: Segurança
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [00_scope.md, 01_tech_stack.md]
blocks: [03_user_types.md, 05_principles.md]
---

# 02 — Segurança

## Modelo de autenticação

Não haverá autenticação na primeira versão Vite local.

## Modelo de autorização

Não haverá perfis com permissões técnicas na primeira versão. O app será usado localmente por um único operador.

## Proteção de dados

- Nenhum dado sensível deve ser exigido na primeira versão.
- Conteúdo de documentação pode conter informações de projeto e deve ser tratado como dado local do usuário.
- Futuras integrações com escrita em disco devem evitar envio remoto de conteúdo sem ação explícita.

## Validação de inputs

- Validações de estrutura Meridian devem ocorrer na camada de domínio do frontend.
- Campos obrigatórios de frontmatter devem ser validados antes de uma US ou documento ser considerado válido.
- Status `🔶` deve exigir `Falta:` no aceite.

## Rate limiting

Fora do escopo da primeira versão local.

## Auditoria e logs

- A primeira versão deve representar o log `11_decisions.md`.
- Futuramente, edição de documento `approved` deve sugerir ou registrar decisão.

## Gestão de segredos

- `.env`, `.env.*` e arquivos locais de segredo não entram no Git.
- `.env.example` entra no Git como contrato de configuração.
- v0 não exige variáveis de ambiente.
- Nenhum segredo deve ser salvo em `localStorage`.

## Conformidade

Sem conformidade regulatória específica na primeira versão. O produto deve evitar coletar dados pessoais desnecessários.

## OWASP Top 10

O risco inicial é baixo por não haver backend remoto. Ainda assim:

- Validar dados renderizados para evitar injeção em previews futuros.
- Não executar conteúdo Markdown como código.
- Não persistir segredos em `localStorage`.
