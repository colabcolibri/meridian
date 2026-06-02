# Meridian — protocolo

> **Este arquivo descreve o protocolo e o produto Meridian.** Ele pode ser copiado para a raiz de qualquer projeto que adote o kit.
> **Neste repositório**, a home técnica (Git, `.cursor/`, desenvolvimento do app) fica em [`README.md`](README.md).

Meridian é um protocolo e um conjunto de ferramentas para conduzir desenvolvimento
com agentes de IA sem perder governança, visibilidade e consistência.

O objetivo não é "software rápido" a qualquer custo. O objetivo é permitir que uma
pessoa gerencie o processo enquanto agentes trabalham com contexto explícito,
documentação viva, decisões registradas, user stories auditáveis e um board derivado
da fonte de verdade.

---

## O que existe no repositório do kit (referência)

Neste monorepo há também `app-desktop/` e `app-visual-studio/` (futuro). Detalhes de clone e Cursor: [`README.md`](README.md).

Em **qualquer projeto Meridian**, a raiz costuma ter:

```txt
meridian.md          # este documento (protocolo / produto)
.agent/              # kit operacional para agentes
docs/                # fonte de verdade do projeto
```

Opcional no repo do kit no GitHub: `README.md` (convenção Git — não precisa existir em projetos cliente).

## O que este arquivo (`meridian.md`) descreve

Ele descreve:

- o conceito;
- a separação entre protocolo e apps;
- como agentes entram no processo;
- quais partes do repositório existem;
- qual é o objetivo final do sistema.

A instrução operacional completa para agentes fica em:

```txt
.agent/MERIDIAN.md
```

## `.agent/`

`.agent/` é a camada operacional para agentes de IA.

Ela contém:

- `rules/MERIDIAN.md`: regras globais sempre ativas (`trigger: always_on`);
- `.cursor/`: adapter para o Cursor IDE (gerado por `sync_cursor_kit.sh`; não substitui `.agent/`);
- `MERIDIAN.md`: protocolo master para agentes;
- `ARCHITECTURE.md`: mapa de agents, skills e workflows;
- `agents/`: personas operacionais (fases, gates, saídas);
- `skills/`: pacotes com `SKILL.md` + `references/` (progressive disclosure);
- `skills/doc.md`: guia para criar skills;
- `workflows/`: comandos `/` com `$ARGUMENTS` e contexto para agents;
- `scripts/`: validações (`validate_meridian.py`);
- `.shared/`: recursos compartilhados futuros.

Neste monorepo, onboarding técnico: [`README.md`](README.md).

O foco final do Meridian é que agentes definidos nessa camada consigam trabalhar
autonomamente dentro da estrutura Meridian, sempre com documentação, regras,
decisões e validações.

## `app-desktop/`

`app-desktop/` é o app visual inicial.

Ele não é a fonte de verdade.
Ele é uma camada de gestão visual que deve abrir uma pasta de projeto e monitorar:

- `meridian.md` ou `.agent/MERIDIAN.md`;
- `docs/`;
- documentos de fase;
- decisões;
- user stories;
- `docs/kanban/board.json`;
- inconsistências;
- bloqueios;
- status de maturidade.

## `app-visual-studio/`

Pasta futura para a extensão/app de Visual Studio ou VSCode.

Essa camada deve operar mais perto do editor e dos arquivos reais, mas ainda deve
respeitar o mesmo princípio: a pasta do projeto é a fonte de verdade.

---

## Ideia central

Meridian separa três coisas:

1. **Protocolo**
   Define como desenvolvimento com agentes deve ser conduzido.

2. **Camada de agentes**
   Define os trabalhadores, skills, workflows, regras e scripts que executam o protocolo.

3. **Apps de gestão**
   Dão visibilidade ao processo e ajudam pessoas a monitorar o que os agentes estão fazendo.

---

## Papel da pessoa

A pessoa continua sendo manager do processo.

Ela decide direção, aprova documentos, aceita entregas, prioriza versões e mantém
controle sobre o que os agentes fazem.

Agentes podem:

- planejar;
- revisar;
- escrever documentação;
- criar user stories;
- gerar board JSON;
- implementar;
- testar;
- apontar riscos;
- sincronizar estado.

Agentes não devem:

- trabalhar sem documentação mínima;
- esconder decisões;
- marcar trabalho como concluído sem evidência;
- exfiltrar segredos;
- executar comandos destrutivos sem autorização;
- substituir o julgamento do manager do processo.

---

## Fonte de verdade

Em qualquer projeto Meridian, a fonte de verdade é a pasta do projeto:

```txt
docs/
  00_scope.md
  01_tech_stack.md
  02_security.md
  ...
  11_decisions.md
  us/
  kanban/board.json
```

O app desktop e a futura extensão leem e operam essa estrutura.
Eles não devem inventar uma fonte paralela.

---

## Estado atual

Este repositório está na fundação:

- protocolo master movido para `.agent/MERIDIAN.md`;
- camada `.agent/` iniciada;
- app Vite em `app-desktop/`;
- documentação interna do app em `app-desktop/docs/`;
- Git, Prettier, ESLint, Husky e lint-staged configurados.

Próximo foco:

- kit `.agent/` alinhado ao padrão Antigravity (rules, routing, references, workflows);
- app desktop: abertura real de pasta Meridian;
- implementar no app desktop a abertura/monitoramento real de uma pasta Meridian.
