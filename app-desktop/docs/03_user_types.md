---
title: Tipos de Usuário
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [02_security.md]
blocks: [04_principles.md, 05_architecture.md, 06_database.md, 07_api_contracts.md]
---

# 03 — Tipos de Usuário

## Manager do Processo

- **Descrição:** pessoa responsável por conduzir o fluxo de desenvolvimento com agentes de IA, mantendo visibilidade, consistência e decisões documentadas. Pode ser dev, founder, product manager, designer, tech lead ou alguém de outra área.
- **Origem:** acesso direto ao app local.
- **Permissões:** visualizar documentos, entender bloqueios, revisar maturidade, acompanhar US, consultar templates, decidir próximos passos e orientar agentes de IA com contexto documentado.
- **Restrições:** não delega o processo a agentes autônomos sem registro, revisão, critérios explícitos e documentação atualizada.
- **Sessão:** sem sessão autenticada.
- **Dados visíveis:** todos os dados carregados localmente no app.
- **Casos de borda:** projeto sem documentação, excesso de documentos sem aprovação, agente sugerindo mudanças fora do fluxo, agentes trabalhando sem aceite claro, decisões não registradas.

## Operador Local

- **Descrição:** pessoa usando o app Vite localmente para organizar e validar a documentação Meridian de um projeto.
- **Origem:** acesso direto ao app local.
- **Permissões:** visualizar documentos, simular mudanças de status, ver bloqueios, consultar templates e operar user stories locais.
- **Restrições:** não sincroniza dados remotamente e não escreve arquivos reais na primeira versão.
- **Sessão:** sem sessão autenticada.
- **Dados visíveis:** todos os dados carregados localmente no app.
- **Casos de borda:** projeto sem `/docs`, documentos incompletos, dependências não aprovadas, US com frontmatter inválido.

## Futuro Usuário VSCode

- **Descrição:** pessoa usando a futura extensão dentro do VSCode para criar e manter arquivos reais do Meridian.
- **Origem:** instalação da extensão.
- **Permissões:** inicializar templates, editar documentos, gerar kanban, receber alertas e registrar decisões.
- **Restrições:** respeita permissões do workspace local.
- **Sessão:** sem sessão obrigatória prevista.
- **Dados visíveis:** arquivos do workspace aberto no VSCode.
- **Casos de borda:** workspace sem permissão de escrita, arquivos modificados fora da extensão, conflitos com Git e documentos aprovados editados manualmente.
