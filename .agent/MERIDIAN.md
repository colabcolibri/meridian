# Meridian — Protocolo de Desenvolvimento Orientado por Documentação para Agentes de IA

> Defina o meridiano antes de escrever o código.
> Ele é o que mantém pessoas, agentes de IA, decisões e entregas alinhados.

Este é o protocolo master para agentes.
O `meridian.md` da raiz explica o projeto como um todo; este arquivo define como
agentes devem trabalhar.

---

## 1. O que é Meridian

Meridian é um protocolo pragmático de desenvolvimento orientado por documentação,
criado para a nova era de trabalho com agentes de IA.

Ele não é uma ferramenta específica, não depende de uma extensão, não exige um SaaS
e não presume que o projeto será desenvolvido dentro de um sistema de gestão próprio.
Meridian é antes de tudo uma estrutura de trabalho: um conjunto de documentos,
dependências, regras de maturidade e artefatos gerados que permite conduzir
desenvolvimento de software com clareza.

A ideia central é simples:

**a documentação é o projeto.**

O código existe para implementar o que está documentado. Agentes de IA podem acelerar
execução, sugerir alternativas, preencher rascunhos e implementar tarefas, mas eles
não substituem direção, contexto, critérios de aceite e decisões registradas.

Meridian existe para que uma pessoa continue sendo manager do processo enquanto
usa agentes de IA de forma produtiva, auditável e consistente.

---

## 2. Para quem é

Meridian é para qualquer pessoa ou grupo que queira desenvolver software com agentes
de IA sem perder controle do processo.

Isso inclui:

- devs trabalhando sozinhos;
- founders construindo um produto;
- product managers conduzindo um projeto digital;
- designers ou operadores que precisam transformar uma ideia em sistema;
- tech leads estruturando trabalho para um time;
- times de qualquer tamanho que queiram um fluxo simples e auditável;
- pessoas usando agentes de código e querendo manter visibilidade do que está sendo feito.

Meridian não é apenas para times pequenos.
Meridian também não é uma malha complexa de agentes.

Ele é um fluxo mínimo, explícito e suficiente para desenvolvimento consistente.

---

## 3. O problema que Meridian resolve

Agentes de IA tornam fácil produzir código rapidamente. Isso é útil, mas também cria
um novo risco: agentes podem trabalhar muito, por muito tempo, sem que o projeto esteja
realmente mais claro.

Sem um fluxo explícito, é comum acontecer:

- código antes de escopo;
- features antes de arquitetura;
- banco antes de entender tipos de usuário;
- implementação antes de critérios de aceite;
- decisões importantes perdidas no chat;
- agentes criando arquivos sem uma fonte de verdade;
- user stories sem dependências claras;
- status marcado como concluído só porque compilou;
- documentação defasada em relação ao código;
- retrabalho porque a direção mudou sem registro.

Meridian resolve isso exigindo que o agente trabalhe dentro de um protocolo.

Antes de escrever código, o agente deve entender o projeto.
Antes de executar uma sprint, o agente deve saber quais documentos estão aprovados.
Antes de criar user stories, epics e versões precisam estar definidos.
Antes de marcar algo como concluído, o aceite precisa estar comprovado.

O objetivo não é "software rápido" a qualquer custo.
O objetivo é desenvolvimento consistente.

---

## 4. Princípios centrais

### 4.1 A documentação precede o código

Nada entra em desenvolvimento sem estar documentado.
Nada está done se a documentação não reflete o estado real.

### 4.2 A pessoa é manager do processo

Agentes de IA executam, sugerem, verificam e implementam.
A pessoa decide direção, aprova maturidade, aceita mudanças relevantes e controla
o que entra no fluxo.

### 4.3 Agentes trabalham com contexto explícito

Um agente não deve depender de memória de conversa quando a decisão deveria estar
no projeto. Decisões, escopo, constraints, arquitetura e critérios de aceite devem
estar nos arquivos Meridian.

### 4.4 Simplicidade é parte do produto

Meridian deve evitar burocracia desnecessária. O fluxo existe para dar clareza, não
para criar 1001 agentes, 1001 documentos ou um processo pesado.

### 4.5 Status precisa ser auditável

Um item não está concluído porque "parece pronto" ou porque "compilou".
Status deve refletir evidência.

### 4.6 O board é derivado, não editado manualmente

O board canônico é `docs/kanban/board.json`.
Ele é gerado a partir dos frontmatters das user stories.
Ele nunca deve ser editado manualmente como fonte primária.

---

## 5. Como usar este arquivo

Este `meridian.md` é um iniciador universal.

Use-o assim:

1. Coloque este arquivo na raiz de um novo projeto.
2. Peça a um agente de IA para ler este arquivo integralmente.
3. O agente deve criar a estrutura `/docs`.
4. O agente deve iniciar o log de decisões.
5. O agente deve seguir a ordem de documentos, dependências e aprovações.
6. O agente só deve escrever código quando a documentação exigida para aquela etapa existir.

Este arquivo não obriga o uso de um app de gestão Meridian.

Um app, extensão ou painel pode monitorar a pasta do projeto e visualizar a estrutura,
mas o protocolo funciona apenas com arquivos Markdown e JSON.

---

## 6. Instrução obrigatória para agentes de IA

Se você é um agente de IA lendo este arquivo, siga estas regras:

1. Não comece escrevendo código.
2. Primeiro verifique se existe uma pasta `docs/`.
3. Se `docs/` não existir, crie a estrutura Meridian.
4. Registre decisões relevantes em `docs/decisions/YYYY-MM-DD.json` antes de tomar mudanças cross-cutting.
5. Crie `docs/00_scope.md` e mantenha-o como primeira fonte de verdade do projeto.
6. Não avance documentos dependentes para além de `draft` se seus predecessores não estiverem `approved`.
7. Não crie user stories antes de `05_architecture.md` estar `approved` (gate de entrega).
8. Não edite `docs/kanban/board.json` como fonte primária; gere-o a partir dos US.
9. Sempre registre decisões que mudam escopo, stack, arquitetura, segurança, versão ou critérios.
10. Se um documento `approved` precisar mudar, registre a decisão e volte o documento para `review`.
11. Se uma US estiver `🔶`, o aceite deve conter `Falta:`.
12. Se uma US depende de outra, ela só pode sair de `❌` quando todas as dependências estiverem `✅`.
13. Antes de implementar, identifique qual US, versão e epic justificam a mudança.
14. Antes de finalizar, atualize os documentos afetados e rode as validações aplicáveis.

Se o usuário pedir velocidade sem documentação mínima, explique o risco e proponha o
menor conjunto de documentos necessário para avançar com segurança.

---

## 7. Estrutura de pastas

Ao iniciar um projeto Meridian, crie a estrutura do projeto em `docs/`.
Opcionalmente, mantenha uma pasta `.agent/` no mesmo nível de `meridian.md`
quando quiser dar agentes, skills, workflows, rules e scripts especializados para IA.

```txt
/README.md          # opcional no repo do kit; convenção Git
/meridian.md

/.agent
  MERIDIAN.md
  ARCHITECTURE.md
  agents/
  skills/
    doc.md
  workflows/
  rules/
    MERIDIAN.md    # trigger: always_on
  scripts/
  .shared/

/docs
  README.md
  00_scope.md
  01_tech_stack.md
  02_security.md
  03_user_types.md
  04_principles.md
  05_architecture.md
  06_database.md
  07_api_contracts.md
  08_environments.md
  11_decisions.md

  /decisions
    YYYY-MM-DD.json

  /decisions
    YYYY-MM-DD.md

  /versions
    vX.md

  /sprints
    vX-SY.md

  /epics
    EPIC-XX.md

  /us
    US-XXXX.md

  /kanban
    board.json
```

### 7.1 Sobre `.agent/` e `.cursor/`

`.agent/` contém a camada operacional portátil para agentes de IA (padrão Antigravity).

Ela é opcional para projetos simples, mas recomendada quando agentes serão usados
com frequência. A função dela é manter instruções especializadas fora do protocolo
principal, sem perder governança.

**Cursor IDE:** o Cursor não indexa `.agent/` nativamente. Use `.cursor/` como adapter **local**:

- Edite o kit em `.agent/` (fonte versionada).
- Rode `./.agent/scripts/sync_cursor_kit.sh` após clone ou ao adicionar skill/agent/workflow.
- **Não commitar `.cursor/`** — symlinks locais (`.gitignore` na raiz do kit).
- Regra always-on: `.agent/rules/meridian.mdc` → espelhada em `.cursor/rules/meridian.mdc`.
- Slash commands: `.cursor/commands/` espelha `.agent/workflows/`.

Estrutura recomendada:

- `agents/`: papéis/personas de agentes;
- `skills/`: pacotes de conhecimento com `SKILL.md`;
- `workflows/`: procedimentos acionáveis;
- `rules/MERIDIAN.md`: regras globais sempre ativas (`trigger: always_on`);
- `scripts/`: validações e automações locais;
- `.shared/`: recursos compartilhados.

Skills oficiais do kit (ver `.agent/skills/doc.md`):

- `init-project`
- `create-epic`
- `create-version`
- `create-sprint`
- `security-review`
- `create-user-story`
- `complete-user-story`
- `generate-board-json`
- `update-decisions-log`
- `meridian-routing`

Regras:

- `meridian.md` continua sendo a autoridade principal.
- `.agent/rules/` define regras globais para agentes.
- `.agent/workflows/` define procedimentos.
- `.agent/agents/` define responsabilidades.
- `.agent/skills/` detalha tarefas específicas.
- Se houver conflito entre skill e `meridian.md`, `meridian.md` vence.
- Se uma skill causar mudança relevante, registre em `docs/decisions/YYYY-MM-DD.json`.

### 7.2 Sobre `docs/README.md`

`docs/README.md` é a porta de entrada humana do projeto.
Ele deve conter:

- link para cada documento de fase;
- status atual de cada documento;
- versão atual do produto;
- próximo milestone;
- user stories ativas da versão em andamento;
- observações úteis para agentes e pessoas.

### 7.3 Sobre `docs/kanban/board.json`

`board.json` é um artefato gerado.
Ele representa uma visão consolidada dos frontmatters das user stories.

Não crie `board.csv` como arquivo mantido em paralelo.
CSV, planilhas ou outros formatos são exportações derivadas, geradas sob demanda
por ferramentas futuras.

---

## 8. Frontmatter padrão dos documentos de fase

Todo documento de fase deve começar com:

```yaml
---
title: Nome do documento
status: draft | review | approved
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

### Status dos documentos

- `draft`: documento em criação ou incompleto.
- `review`: documento completo o suficiente para validação humana.
- `approved`: documento aprovado e liberando dependentes.

### Regra de maturidade

```txt
draft -> review -> approved
          ^          |
          |----------|
     mudança relevante volta para review
```

Nenhum documento dependente deve avançar além de `draft` enquanto seus predecessores
não estiverem `approved`.

---

## 9. Mapa de dependências

```txt
11_decisions + docs/decisions/
  stub de regras; entradas em YYYY-MM-DD.md — começa no dia 1; nunca bloqueia nada

00_scope
  desbloqueia todos os outros documentos

01_tech_stack
  depende de 00_scope
  desbloqueia 02_security, 04_principles, 08_environments

02_security
  depende de 00_scope, 01_tech_stack
  desbloqueia 03_user_types, 04_principles

03_user_types
  depende de 02_security
  desbloqueia 04_principles, 05_architecture, 06_database, 07_api_contracts

04_principles
  depende de 01_tech_stack, 02_security, 03_user_types
  desbloqueia 05_architecture

05_architecture
  depende de 00_scope, 01_tech_stack, 02_security, 03_user_types, 04_principles
  desbloqueia 06_database, 07_api_contracts, 08_environments
  desbloqueia criação de user stories (epic/version nas pastas)

06_database
  depende de 03_user_types, 05_architecture
  desbloqueia 07_api_contracts

07_api_contracts
  depende de 03_user_types, 05_architecture, 06_database

08_environments
  depende de 01_tech_stack, 05_architecture
```

Entrega (pastas — fonte de verdade, sem índice markdown):

```txt
docs/epics/EPIC-XX.md
docs/versions/vX.md
docs/sprints/vX-SY.md
docs/us/US-XXXX.md
docs/kanban/board.json   # derivado das US
```

User stories só podem ser criadas quando:

```txt
05_architecture = approved
epic referenciado existe em docs/epics/
version referenciada existe em docs/versions/
```

---

## 10. Fluxo de trabalho por fases

### Fase 0 — Fundação

Sempre sequencial.

1. `11_decisions.md`
2. `00_scope.md`
3. `01_tech_stack.md`
4. `02_security.md`
5. `03_user_types.md`

A segurança vem antes da arquitetura.
Tipos de usuário vêm antes de princípios e arquitetura.
Releases, épicos e sprints vêm depois da arquitetura (eixo de entrega).

### Fase 1 — Princípios

- `04_principles.md`

Convenções de código e qualidade — orientam implementação e arquitetura.

### Fase 2 — Arquitetura

- `05_architecture.md`

A arquitetura reflete escopo, stack, segurança, usuários e princípios.

### Fase 3 — Detalhamento técnico

- `06_database.md`
- `07_api_contracts.md`
- `08_environments.md`

Banco vem antes de contratos completos de API.
Ambientes documentam setup, comandos, variáveis e diferenças entre local/dev/staging/prod.

### Backlog de entrega (pastas)

- `docs/epics/EPIC-XX.md` — capacidades de produto
- `docs/versions/vX.md` — releases
- `docs/sprints/vX-SY.md` — fatias de tempo

Só criar user stories depois de `05_architecture.md` approved.
Cada US referencia epic e version que já existem nas pastas.

### Execução

- arquivos individuais de US em `docs/us/`;
- sprints em `docs/sprints/`;
- código;
- checklist de go-live;
- atualização contínua de decisões.

---

## 11. Conteúdo obrigatório de cada documento

### 11.1 `00_scope.md` — Escopo

Deve responder:

- Qual é o nome do projeto?
- O que o projeto faz?
- Qual problema resolve?
- Para quem resolve?
- O que está dentro do escopo?
- O que está fora do escopo?
- Quais restrições existem?
- Quais premissas estão sendo assumidas?
- Quais riscos já são conhecidos?

Regra para agentes:

Não trate escopo como lista genérica. Escreva limites concretos.
O que está fora do escopo é tão importante quanto o que está dentro.

### 11.2 `01_tech_stack.md` — Tech Stack

Deve cobrir:

- frontend;
- backend;
- banco de dados;
- infra;
- CI/CD;
- containers;
- DX;
- linting;
- formatação;
- testes;
- justificativa de cada escolha;
- alternativas descartadas.

Regra para agentes:

Não escolha tecnologia só por familiaridade. Explique por que a escolha serve ao projeto.

### 11.3 `02_security.md` — Segurança

Deve cobrir:

- modelo de ameaça mínimo;
- autenticação;
- autorização;
- proteção de dados;
- validação de inputs e outputs;
- rate limiting;
- auditoria e logs;
- gestão de segredos;
- segurança de dependências;
- segurança no uso de agentes de IA;
- conformidade;
- OWASP Top 10 no contexto do projeto;
- riscos aceitos e fora de escopo.

O documento deve ser prático. Não basta listar "usar HTTPS" ou "validar inputs".
O agente deve explicar como a segurança se aplica ao projeto específico.

#### 11.3.1 Modelo de ameaça mínimo

Inclua:

- atores internos e externos;
- perfis de usuário com acesso ao sistema;
- dados sensíveis;
- superfícies de ataque;
- integrações externas;
- operações destrutivas;
- impacto de vazamento, alteração indevida ou indisponibilidade.

Perguntas obrigatórias:

- Quem pode tentar acessar dados indevidamente?
- Que dados não podem vazar?
- Que ações precisam de autorização forte?
- Que partes do sistema recebem input não confiável?
- Quais integrações externas ampliam risco?
- O que acontece se um agente de IA receber contexto sensível por engano?

#### 11.3.2 Gestão de segredos

Defina:

- quais arquivos de ambiente existem;
- quais arquivos nunca entram no Git;
- se `.env.example` é obrigatório;
- como secrets são carregados;
- como secrets são rotacionados;
- onde secrets não podem aparecer.

Regras obrigatórias:

- `.env` e `.env.*` não entram no Git.
- `.env.example` deve ser versionado sem valores reais.
- Secrets não devem aparecer em logs.
- Secrets não devem ser colados em prompts para agentes de IA.
- Tokens, cookies, headers de autorização e chaves privadas são dados sensíveis.

#### 11.3.3 Segurança de agentes de IA

Quando agentes de IA participarem do desenvolvimento, documente:

- quais arquivos podem ser compartilhados com agentes;
- quais arquivos não devem ser enviados a serviços externos;
- quais comandos exigem confirmação humana;
- como lidar com comandos destrutivos;
- como registrar decisões sugeridas por agentes;
- como validar código gerado por agentes.

Regras obrigatórias para agentes:

- Não executar comando destrutivo sem autorização explícita.
- Não exfiltrar `.env`, secrets, chaves, tokens ou dados privados.
- Não reduzir segurança para "fazer funcionar" sem registrar decisão.
- Não criar bypass de autenticação/autorização sem marcar como risco crítico.
- Não marcar segurança como concluída sem evidência.

#### 11.3.4 Autenticação e autorização

Defina:

- se o sistema é público, autenticado ou híbrido;
- estratégia de sessão, JWT, OAuth, SSO ou outro modelo;
- expiração, renovação e revogação;
- perfis autorizados por ação;
- modelo RBAC, ABAC ou custom;
- isolamento multi-tenant quando aplicável.

Regra:

Autenticação responde "quem é".
Autorização responde "o que pode fazer".
Não misture as duas.

#### 11.3.5 Proteção de dados

Classifique:

- dados públicos;
- dados internos;
- dados sensíveis;
- PII;
- dados financeiros;
- dados de saúde;
- dados legais/regulatórios;
- credenciais e secrets.

Para cada categoria, defina:

- armazenamento;
- acesso;
- criptografia;
- retenção;
- logs;
- backup;
- exclusão.

#### 11.3.6 Validação e injeção

Defina:

- onde inputs são validados;
- quais schemas são usados;
- quem sanitiza output;
- como evitar SQL injection, command injection, XSS e path traversal;
- como uploads são validados;
- como markdown, HTML ou conteúdo gerado por usuário é renderizado.

#### 11.3.7 Dependências e supply chain

Defina:

- gerenciador de pacotes;
- lockfile único;
- política de audit;
- atualização de dependências;
- critérios para adicionar bibliotecas;
- prevenção de pacotes abandonados ou desnecessários;
- secret scanning quando aplicável.

#### 11.3.8 Logs, auditoria e monitoramento

Defina:

- eventos que devem ser logados;
- eventos que não devem ser logados;
- retenção de logs;
- acesso aos logs;
- trilha de auditoria;
- alertas mínimos;
- proteção contra vazamento de PII e secrets.

#### 11.3.9 Checklist OWASP contextual

Para cada item do OWASP Top 10, indique:

- se é aplicável;
- onde aparece no projeto;
- risco principal;
- mitigação;
- pendência.

Não escreva apenas "não aplicável" sem justificativa.

Regra para agentes:

Segurança não é etapa final. Segurança vem antes da arquitetura.
Se a segurança estiver incompleta, arquitetura e implementação devem declarar o risco.

### 11.4 `03_user_types.md` — Tipos de usuário

Para cada perfil:

```md
## Nome do Perfil

- **Descrição:** quem é esse usuário
- **Origem:** como entra no sistema
- **Permissões:** ações permitidas
- **Restrições:** ações proibidas
- **Sessão:** expiração, renovação, logout
- **Dados visíveis:** entidades e campos acessíveis
- **Casos de borda:** inativo, convite expirado, downgrade, acesso simultâneo
```

Regra para agentes:

Não avance para banco, API ou autorização antes de entender os perfis.

### 11.5 `docs/epics/` — Épicos (capacidades de produto)

Cada épico vive em **`docs/epics/EPIC-XX.md`** (pasta flat, um arquivo por epic),
no mesmo espírito de `docs/us/US-XXXX.md`. Não há índice markdown duplicado.

Formato de cada epic (`docs/epics/EPIC-XX.md`):

```yaml
---
id: EPIC-XX
title: Nome curto
status: active | complete | paused
versions: [v0, v1]
profiles: [Perfil A, Perfil B]
outcome: "Done do epic no nível produto — frase objetiva."
---

# EPIC-XX — Nome

## Capacidade

O que o usuário passa a conseguir (linguagem de produto).

## Resultado esperado

Como o manager sabe que o epic pode ir para `complete`.

## Fora deste epic

Limites — o que pertence a outro epic ou versão.
```

Regras:

- IDs permanentes: `EPIC-01`, `EPIC-02`, … (nunca reutilizar).
- Nome do arquivo deve coincidir com `id` (`EPIC-01.md` → `id: EPIC-01`).
- `outcome` é obrigatório no frontmatter (done no nível produto, não implementação).
- Não crie subpastas dentro de `docs/epics/`.
- Só criar épicos e user stories depois de `05_architecture.md` `approved`.
- User stories **referenciam** o epic (`epic: EPIC-XX`) — não repetem descrição, `outcome` nem escopo do epic.

Regra para agentes:

Epic não é módulo técnico. Epic é capacidade de produto. Novo epic → skill `create-epic`.

### 11.6 `04_principles.md` — Princípios de código

Deve definir:

- onde vivem componentes;
- onde vivem validações;
- onde vivem tipos;
- onde vivem constantes;
- onde vivem queries;
- padrão de camadas;
- nomenclatura;
- branches;
- commits;
- tratamento de erros;
- padrão de API;
- padrões de formatação e lint.

Regra para agentes:

Use este documento para evitar que cada agente invente uma estrutura diferente.

### 11.7 `docs/versions/` e `docs/sprints/` — Releases e sprints

Cada versão vive em **`docs/versions/vX.md`**; sprints em **`docs/sprints/vX-SY.md`**.
Não há índice markdown duplicado — a pasta é a fonte de verdade.

Formato de cada versão (`docs/versions/vX.md`):

```yaml
---
id: v1
title: Nome curto do release
status: planned | active | complete
outcome: "Done do release no nível produto."
---

# v1 — Nome

## Objetivo
## Critério de Done
## Incluído nesta versão
## Explicitamente fora
## Checklist go-live
## Sprints
```

Formato de cada sprint (`docs/sprints/v1-S1.md`):

```yaml
---
id: v1-S1
version: v1
title: Nome da sprint
status: planned | active | complete
done_when: "Condição objetiva."
stories: [US-0001, US-0002]
---

# v1-S1 — Nome

(tabela opcional de US no corpo)
```

Regras:

- IDs de versão: `v0`, `v1`, `v2`… (`v0.md` → `id: v0`). `v0` é fundação técnica — não vender como produto.
- IDs de sprint: `v1-S1`, `v2-S1`…
- User stories referenciam **`version: vX`** — não repetem plano da versão.
- Epics referenciam **`versions: [v0, v1]`** — releases onde a capacidade entra.
- Gate de US: `05_architecture.md` = `approved` + epic/version existem nas pastas.
- Novo release → skill `create-version` ou `/create-version`.
- Nova sprint → skill `create-sprint` ou `/plan-sprint`.

### 11.8 `05_architecture.md` — Arquitetura

Deve cobrir:

- tipo de arquitetura;
- diagrama de componentes;
- fluxo de dados;
- estrutura do frontend;
- estrutura do backend;
- estratégia de estado;
- estratégia de fetch/cache;
- estratégia de formulários;
- integrações externas;
- logging e observabilidade.

Regra para agentes:

Arquitetura deve explicar decisões, não apenas listar pastas.

### 11.9 `06_database.md` — Banco de dados

Deve cobrir:

- diagrama ER;
- tabelas/collections;
- campos;
- tipos;
- nullable;
- defaults;
- índices;
- relacionamentos;
- auditoria;
- soft delete;
- campos sensíveis;
- migrations;
- seeds.

Campos de auditoria recomendados:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
deleted_at TIMESTAMPTZ NULL
created_by UUID REFERENCES users(id)
```

### 11.10 `07_api_contracts.md` — Contratos de API

Para cada endpoint:

```md
## METHOD /path

- **Autenticação:** obrigatória | pública
- **Permissão mínima:** perfil
- **Versão:** disponível a partir de vX

### Request

### Response — Sucesso

### Response — Erros
```

Regra:

Contrato de API completo depende do banco quando o endpoint retorna dados persistidos.

### 11.11 `08_environments.md` — Ambientes

Deve cobrir:

- pré-requisitos;
- setup local;
- comandos do dia a dia;
- variáveis de ambiente;
- arquivos protegidos;
- ambientes disponíveis;
- diferenças entre ambientes.

Regra:

`.env` e `.env.*` não devem entrar no Git.
Use `.env.example` como contrato versionado.

### 11.12 `11_decisions.md` + `docs/decisions/` — Log de decisões

Começa no dia 1.
`11_decisions.md` é stub com regras; o log vive em **`docs/decisions/YYYY-MM-DD.json`** — um arquivo por dia.

Novas entradas vão **no início** do array `entries` (prepend no mesmo dia).
Nunca edite uma entrada antiga; registre uma nova decisão acima das anteriores.

Formato do arquivo diário:

```json
{
  "date": "2026-06-02",
  "entries": [
    {
      "time": "17:30",
      "title": "Título objetivo",
      "affected_document": "caminho/do/doc.md",
      "what_changed": "descrição objetiva",
      "why_changed": "contexto e motivação",
      "impact": "lista de docs afetados",
      "responsible": "pessoa ou papel"
    }
  ]
}
```

Regras:

- `date` deve coincidir com o nome do arquivo (`2026-06-02.json`).
- `time` usa formato `HH:MM` (24h).
- Novo dia calendário → novo arquivo JSON.
- Mesmo dia → prepend em `entries[0]`.

Arquivamento: quando um dia acumular dezenas de entradas, mantenha o arquivo do dia;
dias antigos permanecem como histórico imutável na pasta.

---

## 12. User stories

Cada US é um arquivo individual em:

```txt
docs/us/US-XXXX.md
```

A pasta é flat.
Não crie subpastas por epic.

Cada US referencia um epic em `docs/epics/` via frontmatter `epic: EPIC-XX`.
O epic referenciado deve existir como arquivo em `docs/epics/`.

### 12.1 Regra de criação

US só podem ser criadas após:

```txt
05_architecture.md = approved
epic referenciado em docs/epics/
version referenciada em docs/versions/
```

### 12.2 Política de IDs

- IDs são permanentes.
- IDs nunca são reutilizados.
- Formato fixo: **`US-XXXX`** — quatro dígitos com zero à esquerda (`US-0001`, `US-0017`, `US-0123`).
- Nome do arquivo deve coincidir com `id` (`US-0001.md` → `id: US-0001`).
- Buracos são aceitáveis.
- Próximo ID = maior número existente + 1, sempre com 4 dígitos.

### 12.3 Frontmatter de US

```yaml
---
id: US-XXXX
title: Título curto
epic: EPIC-XX
version: v1
status: ✅ | 🔶 | ❌ | 🧊
moscow: Must | Should | Could | Won't
depends_on: [US-YYYY]
done_when: "Condição objetiva e mensurável."
tests: required | none
tests_status: pending | done | n/a
---
```

### 12.4 Corpo de US

```md
# US-XXXX — Título curto

**Como** [tipo de usuário],
**quero** [ação],
**para que** [benefício].

## Aceite

- Condição objetiva
- Condição objetiva
- **Falta:** obrigatório quando status = 🔶

## Implementação técnica

> **Criação:** placeholder ou plano preliminar opcional.  
> **Fechamento (`✅`):** registro real — arquivos tocados, resumo por camada. Skill `complete-user-story`.

### Arquivos

### Backend

### Frontend

### Scripts / Docs

## Testes

> **Criação:** preencher **Planejado**. **Fechamento:** marcar `[x]` e registrar em **Executado**; então `tests_status: done`.

### Planejado

- [ ] **automated** — `pnpm test` — descrever escopo
- [ ] **manual** — passos e resultado esperado

### Executado

_(pendente)_

## Fora de escopo desta story

## Notas
```

### 12.5 Status de US

| Símbolo | Nome         | Significado                        |
| ------- | ------------ | ---------------------------------- |
| ✅      | Concluída    | Entregue e aceite comprovado       |
| 🔶      | Em andamento | Parcial; precisa declarar `Falta:` |
| ❌      | Pendente     | Ainda não existe para o usuário    |
| 🧊      | Congelada    | Won't do nesta versão              |

Regras:

- `✅` exige aceite comprovado e, se `tests: required`, `tests_status: done` com **Planejado** `[x]` e **Executado** preenchido.
- `🔶` exige `Falta:` no aceite.
- `❌` não deve esconder trabalho parcial.
- `🧊` exige decisão deliberada, não esquecimento.

**Campos de teste (frontmatter):**

| Campo | Valores | Uso |
| ----- | ------- | --- |
| `tests` | `required` / `none` | US precisa de verificação antes de fechar? |
| `tests_status` | `pending` / `done` / `n/a` | `n/a` só com `tests: none` |

**Coluna derivada no monitor:** `🧪` quando `tests: required` e `tests_status: pending` (não gravar emoji no YAML).

---

## 13. Board JSON

O board canônico é:

```txt
docs/kanban/board.json
```

Ele é gerado a partir dos frontmatters dos arquivos `docs/us/US-XXXX.md`.

Estrutura:

```json
[
  {
    "id": "US-0001",
    "title": "Título curto",
    "epic": "EPIC-01",
    "version": "v1",
    "status": "❌",
    "moscow": "Must",
    "depends_on": ["US-0002"],
    "done_when": "Condição objetiva de conclusão."
  }
]
```

Regras para agentes:

- Não edite `board.json` como fonte primária.
- Atualize US primeiro.
- Gere `board.json` depois.
- Se houver divergência entre US e board, a US vence.
- CSV é exportação futura, não fonte de verdade.

---

## 14. Agentes de IA dentro do fluxo Meridian

Meridian assume que agentes de IA serão usados.
Mas agentes devem trabalhar com governança.

### 14.1 O agente pode

- criar rascunhos de documentos;
- sugerir decisões;
- apontar riscos;
- criar user stories após desbloqueio;
- implementar US aprovadas;
- rodar testes;
- atualizar documentação afetada;
- gerar `board.json`;
- sugerir próximos passos.

### 14.2 O agente não deve

- começar pelo código sem documentação mínima;
- inventar escopo sem registrar premissas;
- criar US antes de epics e versões aprovados;
- marcar algo como `✅` sem evidência;
- editar decisões antigas;
- esconder bloqueios;
- transformar Meridian em uma rede complexa de agentes autônomos;
- agir indefinidamente sem devolver visibilidade ao manager do processo.
- ler, copiar ou expor secrets sem necessidade explícita;
- enviar dados sensíveis para serviços externos sem autorização;
- executar comandos destrutivos sem confirmação;
- enfraquecer autenticação, autorização ou validação para acelerar entrega;
- tratar código gerado como confiável sem revisão.

### 14.3 Como o agente deve responder quando faltar documentação

Se o usuário pedir implementação e a documentação mínima não existir, o agente deve dizer:

1. qual documento falta;
2. por que ele bloqueia a implementação;
3. qual é o menor conteúdo necessário para avançar;
4. se pode criar um rascunho para revisão.

O agente deve preferir progresso documentado a velocidade sem direção.

---

## 15. Checklist de bootstrap para agente

Ao receber um projeto novo com este arquivo, execute:

1. Ler `meridian.md` inteiro.
2. Verificar se existe `docs/`.
3. Se não existir, criar estrutura base.
4. Criar `docs/11_decisions.md` (stub) e `docs/decisions/YYYY-MM-DD.json`.
5. Registrar a decisão inicial em JSON: "Projeto iniciado com Meridian".
6. Criar `docs/00_scope.md` em `draft`.
7. Perguntar ou inferir com cuidado o escopo inicial.
8. Promover `00_scope.md` para `review` apenas quando estiver completo.
9. Só promover para `approved` quando houver confirmação humana ou autorização explícita.
10. Criar os demais documentos respeitando dependências.
11. Criar `docs/kanban/board.json` como array vazio.
12. Se existir ou for desejado, criar `.agent/` com agents, skills, workflows, rules e scripts.
13. Garantir `.gitignore` mínimo antes de qualquer segredo ou dependência local.
14. Não criar US até `05_architecture` estar `approved` e epic/version existirem nas pastas.
15. Antes de escrever código, identificar versão, epic e US.
16. Após implementar, atualizar US, docs afetados e board.

---

## 16. Checklist antes de código

Antes de qualquer implementação, confirme:

- Existe `00_scope.md`?
- O escopo relevante está aprovado?
- A stack está definida?
- Segurança foi documentada com ameaças, segredos, dados e permissões?
- Tipos de usuário existem?
- Existe epic relacionado?
- Existe versão relacionada?
- Existe US relacionada?
- Dependências da US estão concluídas?
- Critério de aceite está claro?
- Testes ou validações esperadas estão definidos?
- `.env`, secrets, builds e dependências locais estão protegidos no Git?
- O agente precisa de alguma skill específica antes de executar?

Se a resposta for "não" para algum item essencial, documente antes.

---

## 17. Checklist de done

Uma entrega só está done quando:

- código foi implementado;
- build/lint/test aplicável passou;
- aceite foi validado;
- `## Implementação técnica` da US preenchida com arquivos alterados/criados e resumo do que foi feito (sem placeholder);
- documentação afetada foi atualizada;
- decisões relevantes foram registradas;
- US foi atualizada (aceite, status, implementação, testes);
- `board.json` foi regenerado;
- nada ficou `🔶` sem `Falta:`.

---

## 18. Meridian e ferramentas de gestão

Meridian pode ser usado sem ferramenta.

Um sistema de gestão Meridian pode abrir uma pasta de projeto e monitorar:

- documentos de fase;
- status;
- dependências;
- bloqueios;
- decisões;
- user stories;
- board JSON;
- inconsistências.

Mas a ferramenta não é a fonte de verdade.

A fonte de verdade é a pasta do projeto.

Isso permite que qualquer pessoa use Meridian apenas com arquivos, e que ferramentas
visuais sejam camadas opcionais por cima do protocolo.

---

## 19. Frase operacional

Quando houver dúvida, aplique esta regra:

> Se não está documentado, não está pronto para ser implementado.
> Se foi implementado, precisa estar refletido na documentação.
> Se um agente trabalhou, o manager do processo precisa conseguir auditar o que mudou.

---

## 20. Versão deste protocolo

Meridian Protocol Version: 1.0

Este arquivo é feito para ser copiado para qualquer projeto como iniciador de trabalho
com agentes de IA e desenvolvimento consistente.
