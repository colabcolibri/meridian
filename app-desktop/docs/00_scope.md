---
title: Escopo
status: approved
version: 1.0
updated: 2026-06-02
depends_on: []
blocks: [01_tech_stack.md, 04_epics.md, 06_versions.md, 07_architecture.md]
---

# 00 — Escopo

## Nome e descrição

Meridian Desktop é o app local de monitoramento visual para projetos que usam o protocolo Meridian. Na raiz do repositório do kit: `../../README.md` (onboarding), `../../meridian.md` (protocolo/produto), `../../.agent/MERIDIAN.md` (protocolo master) e `../../.agent/rules/MERIDIAN.md` (regras sempre ativas para agentes).

O objetivo do app não é substituir o protocolo. O objetivo é abrir a pasta **`docs/`** do projeto Meridian, ler os documentos 00–11, user stories e `board.json`, e dar visibilidade ao manager do processo.

A primeira entrega é um app Vite local em `app-desktop/`. Futuramente, uma extensão em `app-visual-studio/` poderá operar arquivos reais dentro do editor.

Na raiz do repositório, `README.md`, `meridian.md` e `.agent/` (agents, skills com `references/`, workflows, rules `always_on`, scripts) formam o kit para agentes de IA, no padrão operacional Antigravity adaptado ao Meridian. O app desktop é uma camada visual separada que monitora uma pasta Meridian.

## Problema que resolve

Projetos de software com agentes de IA frequentemente avançam para código antes de terem documentação mínima, critérios de aceite e decisões registradas. Isso cria retrabalho, desalinhamento, sprints pouco auditáveis, perda de contexto e agentes executando sem direção clara.

Meridian Desktop ajuda a monitorar esse problema. Ele não é a fonte de verdade: a fonte de verdade continua sendo a pasta do projeto monitorado.

## Para quem

- Qualquer pessoa que queira conduzir desenvolvimento de software com agentes de IA sem perder controle, clareza e consistência.
- Devs, founders, product managers, tech leads, designers, operadores e pessoas de outras áreas que precisem gerenciar um projeto digital sem depender de uma estrutura pesada.
- Usuários que trabalham com agentes de código e querem permanecer como managers do processo em vez de deixar agentes executando indefinidamente sem visibilidade.
- Times de qualquer tamanho que prefiram um fluxo simples, explícito e auditável.

## Dentro do escopo inicial

- App Vite local com React, TypeScript e shadcn/ui dentro de `app-desktop/`.
- Dashboard dos documentos de fase de uma pasta Meridian.
- Visualização de dependências entre documentos.
- Estados `draft`, `review` e `approved`.
- Regras de bloqueio visual entre documentos.
- Estrutura base para user stories e `board.json`.
- Reconhecimento de `README.md`, `meridian.md` e `.agent/` (incl. `meridian-routing`) como kit para agentes.
- Abertura da pasta `docs/` via File System Access (v1) e leitura real dos arquivos.

## Fora do escopo inicial

- Extensão Visual Studio/VSCode completa.
- Escrita real em disco a partir do browser sem ponte local.
- Backend remoto, autenticação, multiusuário e sincronização em nuvem.
- Malha complexa de agentes automáticos.
- Agentes autônomos executando trabalho sem revisão humana, sem documentação e sem registro no fluxo.
- Integração com GitHub, Linear, Jira ou outros sistemas externos.
- Exportação CSV do board, reservada para a futura extensão.

## Restrições conhecidas

- O app Vite deve rodar de forma simples no desktop com `pnpm`.
- A interface visual deve usar shadcn/ui como base.
- O app deve ser profissional, denso o suficiente para uso real e sem aparência de landing page.
- O fluxo Meridian deve ser seguido no próprio desenvolvimento do app.
- O produto deve favorecer controle, visibilidade e consistência no uso de agentes de IA, não velocidade sem governança.

## Premissas

- A primeira versão pode usar dados locais em TypeScript ou `localStorage`.
- A escrita real em arquivos será tratada em uma etapa posterior, provavelmente com extensão Visual Studio/VSCode ou camada desktop/local.
- A documentação inicial pode começar em `review` quando já for suficiente para orientar o trabalho.

## Riscos identificados

- O app virar apenas uma visualização bonita sem executar regras reais do Meridian.
- Escrever código antes de fechar documentos mínimos de Fase 0.
- Criar uma UI genérica, sem densidade e utilidade para gestão de documentação.
- Acoplar cedo demais a solução Vite à futura arquitetura da extensão VSCode.
- Parecer uma ferramenta de automação por agentes sem gestão, quando o posicionamento correto é coordenação pragmática do desenvolvimento com IA.
