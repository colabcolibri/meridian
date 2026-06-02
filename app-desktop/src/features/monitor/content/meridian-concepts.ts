import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import { phaseLabelForDocId } from "@/domain/meridian/doc-refs"

export type ConceptBlock = {
  id: string
  title: string
  summary: string
  bullets?: string[]
}

export type JourneyPhase = {
  id: string
  label: string
  subtitle: string
  purpose: string
  documents: string[]
  note?: string
}

export type GuideSubsection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export type DailyWorkflowStep = {
  id: string
  title: string
  when: string
  actions: string[]
  commands?: string[]
  tip?: string
}

export type SlashCommandHint = {
  command: string
  when: string
  example?: string
}

export type AnatomyGuide = {
  title: string
  intro: string
  fields: { field: string; meaning: string }[]
  exampleTitle: string
  exampleBody: string
}

export const meridianIntro = {
  title: "Guia para quem nunca viu o Meridian",
  paragraphs: [
    "Meridian é um jeito de organizar projetos de software usando arquivos Markdown na pasta docs/. Você escreve o que vai fazer, aprova, e só então pede código — manualmente ou com agentes de IA no Cursor.",
    "Não é um Jira, não é um Notion e não exige login. A fonte de verdade são os arquivos no seu repositório. Este app só lê essa pasta e mostra o progresso de forma visual.",
    "Use esta aba para entender a estrutura. Depois vá em Guia de uso (passos e comandos) e abra a pasta docs/ neste app.",
  ],
}

export type UsageGuideSection = {
  id: string
  title: string
  subtitle: string
  defaultOpen?: boolean
  steps: DailyWorkflowStep[]
}

export const usageGuideIntro = {
  title: "Guia de uso",
  lead: "Roteiro prático para trabalhar no projeto com IA — abra a seção que combina com sua situação agora.",
  paragraphs: [
    "Meridian apoia você: mostra o que falta, sugere o próximo passo e registra progresso nos arquivos. Você aprova; a IA executa dentro do que está documentado.",
    "Conceitos (pastas, fases, status) ficam em Comece aqui. Aqui só entram ações, comandos e o que conferir antes de avançar.",
  ],
}

/** Atalho: qual seção abrir conforme a situação atual. */
export const usageSituations = [
  {
    situation: "Projeto ainda sem pasta docs/",
    section: "Primeira vez",
    command: "/init-meridian",
  },
  {
    situation: "Docs de fase incompletos ou em draft",
    section: "Documentar",
    command: "/status",
  },
  {
    situation: "Arquitetura ok, mas falta épico, versão ou US",
    section: "Montar backlog",
    command: "/create-us",
  },
  {
    situation: "US escolhida — hora de codar",
    section: "Implementar US",
    command: undefined,
  },
  {
    situation: "Código pronto — falta registrar nos arquivos",
    section: "Fechar US",
    command: "/complete-us",
  },
]

export const gettingStartedSteps: DailyWorkflowStep[] = [
  {
    id: "open-cursor",
    title: "Abrir o repositório no Cursor",
    when: "Qualquer sessão de trabalho.",
    actions: [
      "Abra a pasta raiz do projeto (onde ficam .agent/ ou .cursor/ e, depois, docs/).",
      "Não abra só docs/ no Cursor — agents e scripts ficam na raiz.",
    ],
  },
  {
    id: "init-meridian",
    title: "Criar estrutura Meridian (se docs/ não existir)",
    when: "Repositório novo ou sem documentos de fase (00–08 e 11).",
    actions: [
      "No chat, rode /init-meridian — o workflow cria docs/, governança e board.json vazio.",
      "A IA pode fazer até 3 perguntas se algo estiver ambíguo; você confirma o que for necessário.",
      "Revise o que foi gerado antes de seguir — ainda sem código de produto.",
    ],
    commands: ["/init-meridian"],
    tip: "Se docs/ já existe no git, pule para o próximo passo.",
  },
  {
    id: "open-docs-app",
    title: "Abrir docs/ neste app",
    when: "Para ver progresso visual enquanto trabalha no Cursor.",
    actions: [
      "Use o botão Abrir pasta docs (abaixo ou no topo do app).",
      "Selecione a pasta docs/ do repositório.",
      "Aba Configuração: veja qual doc está bloqueado, em draft ou approved.",
    ],
  },
  {
    id: "first-status",
    title: "Saber por onde continuar",
    when: "Após abrir o projeto ou ao retomar depois de dias.",
    actions: [
      "Rode /status — relatório de bloqueios, docs pendentes e próxima ação sugerida.",
      "Opcional: python3 .agent/scripts/validate_meridian.py <pasta-do-projeto> na raiz.",
    ],
    commands: ["/status"],
  },
]

export const documentWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "doc-pick",
    title: "Escolher um doc por conversa",
    when: "Antes de backlog ou código — amadurecer docs/ na aba Configuração.",
    actions: [
      "Veja na Configuração qual doc está desbloqueado e em draft ou review.",
      "Trabalhe um arquivo por vez — ex.: docs/02_security.md, docs/05_architecture.md.",
      "Cite o caminho completo no chat; peça rascunho, lacunas ou revisão — sem implementar produto.",
    ],
    commands: ["/status"],
  },
  {
    id: "doc-commands",
    title: "Usar comandos especializados quando couber",
    when: "Doc alvo identificado.",
    actions: [
      "/architecture — redigir ou revisar 05_architecture.md.",
      "/security-pass — redigir ou revisar 02_security.md.",
      "Mudança de escopo ou stack → prepend em docs/decisions/YYYY-MM-DD.json (nunca apague entradas).",
    ],
    commands: ["/architecture", "/security-pass"],
  },
  {
    id: "doc-approve",
    title: "Você aprova no frontmatter",
    when: "Conteúdo revisado por você — a IA não marca approved sozinha.",
    actions: [
      "Altere status: draft → review → approved no YAML do arquivo.",
      "Confira se o próximo doc da sequência desbloqueou na Configuração.",
      "Gate para backlog: 05_architecture.md com status approved.",
    ],
  },
]

export const backlogWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "backlog-gate",
    title: "Confirmar que pode criar US",
    when: "Antes de /create-epic ou /create-us.",
    actions: [
      "05_architecture.md precisa estar approved (aba Configuração ou /status).",
      "Se não estiver, volte à seção Documentar.",
    ],
    commands: ["/status"],
  },
  {
    id: "backlog-structure",
    title: "Criar épico, versão e sprint",
    when: "Arquitetura aprovada; falta planejar entregas.",
    actions: [
      "Ordem usual: épico (capacidade de produto) → versão (release) → sprint (fatia de tempo).",
      "Um comando por conversa quando possível.",
    ],
    commands: ["/create-epic", "/create-version", "/plan-sprint"],
  },
  {
    id: "backlog-us",
    title: "Criar user stories executáveis",
    when: "Epic e version já existem em docs/epics/ e docs/versions/.",
    actions: [
      "/create-us — aceite com checkboxes verificáveis, epic e version no frontmatter.",
      "Confira na aba Entregas (cobertura) e Quadro (posição e deps).",
      "Depois de criar ou alterar US: /sync-board.",
    ],
    commands: ["/create-us", "/sync-board"],
  },
]

export const implementWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "pick-us",
    title: "Escolher a US do dia",
    when: "Há US Must no Quadro com depends_on satisfeitas.",
    actions: [
      "Aba Quadro: prefira Must (❌ ou 🔶) desbloqueada.",
      "/status se não souber qual pegar.",
      "Uma US por ciclo de implementação.",
    ],
    commands: ["/status"],
  },
  {
    id: "context-us",
    title: "Pedir implementação ancorada no arquivo",
    when: "US escolhida — nova conversa ou thread focada.",
    actions: [
      "Cite o ID e o arquivo: US-0017 ou docs/us/US-0017.md.",
      "Deixe claro: implementar conforme aceite; não marcar ✅ só no chat.",
      "A IA lê US, arquitetura e dependências antes de codar.",
    ],
    tip: "Exemplo: «Implemente docs/us/US-0017.md conforme aceite. Status nos arquivos, não só aqui.»",
  },
  {
    id: "review-diff",
    title: "Você revisa antes de fechar",
    when: "Agente entregou diff.",
    actions: [
      "Revise o código no Cursor; rode build/test do projeto.",
      "Parcial → ainda não use /complete-us; peça ajuste ou marque 🔶 manualmente com Falta: no aceite.",
      "Pronto com evidência → vá à seção Fechar US.",
    ],
  },
]

export const completeUsWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "complete-gate",
    title: "Conferir pré-condições",
    when: "Antes de /complete-us — implementação já revisada por você.",
    actions: [
      "Todo depends_on da US está ✅.",
      "Aceite verificável com evidência (teste, diff, comportamento no app).",
      "Se tests: required no frontmatter — testes passaram ou estão documentados.",
    ],
    tip: "Se algo falhar, não force ✅ — use 🔶 e Falta: no aceite.",
  },
  {
    id: "complete-run",
    title: "Rodar /complete-us",
    when: "Gates ok; melhor em conversa focada só no fechamento.",
    actions: [
      "Comando: /complete-us US-XXXX (ex.: /complete-us US-0017).",
      "Sem ID, a IA pergunta qual US ou infere da sessão — confirme se inferir.",
      "Workflow usa board-keeper + skill complete-user-story.",
    ],
    commands: ["/complete-us US-XXXX"],
  },
  {
    id: "complete-what-ai-does",
    title: "O que a IA registra no arquivo",
    when: "Durante o /complete-us.",
    actions: [
      "Preenche ## Implementação técnica — paths reais, resumo por camada (sem placeholder).",
      "Marca aceite [x]; atualiza ## Testes (Planejado + Executado) se tests: required.",
      "Frontmatter: status ✅ (ou 🔶 + Falta: se parcial); tests_status: done quando couber.",
      "Decisão cross-cutting → prepend em docs/decisions/YYYY-MM-DD.json.",
    ],
  },
  {
    id: "complete-board",
    title: "Atualizar quadro e conferir",
    when: "Imediatamente após /complete-us.",
    actions: [
      "A IA roda generate-board-json; você pode confirmar com /sync-board.",
      "Aba Quadro: US na coluna certa (✅, 🔶 ou 🧪 se tests pendentes).",
      "Implementação técnica bate com o que você testou? Se não, corrija antes de seguir.",
    ],
    commands: ["/sync-board", "/status"],
  },
]

export const usageGuideSections: UsageGuideSection[] = [
  {
    id: "start",
    title: "Primeira vez",
    subtitle:
      "Repositório no Cursor, docs/ criado ou existente, pasta aberta neste app.",
    defaultOpen: true,
    steps: gettingStartedSteps,
  },
  {
    id: "document",
    title: "Documentar",
    subtitle: "Amadurecer docs/ na Configuração. Gate: 05_architecture approved.",
    steps: documentWorkflowSteps,
  },
  {
    id: "backlog",
    title: "Montar backlog",
    subtitle: "Épicos, versões, sprints e US — abas Entregas e Quadro.",
    steps: backlogWorkflowSteps,
  },
  {
    id: "implement",
    title: "Implementar US",
    subtitle: "Escolher US, pedir código ancorado no aceite, revisar diff.",
    steps: implementWorkflowSteps,
  },
  {
    id: "complete-us",
    title: "Fechar US",
    subtitle: "Registrar entrega nos arquivos — /complete-us + quadro atualizado.",
    steps: completeUsWorkflowSteps,
  },
]

export const slashCommandReference: SlashCommandHint[] = [
  { command: "/init-meridian", when: "Projeto novo — criar docs/ e governança" },
  { command: "/status", when: "Início de sessão — bloqueios e próxima ação" },
  { command: "/architecture", when: "Redigir ou revisar 05_architecture.md" },
  { command: "/security-pass", when: "Redigir ou revisar 02_security.md" },
  { command: "/create-epic", when: "Nova capacidade em docs/epics/" },
  { command: "/create-version", when: "Novo release em docs/versions/" },
  { command: "/plan-sprint", when: "Fatia de tempo em docs/sprints/" },
  { command: "/create-us", when: "Nova tarefa em docs/us/ (gates ok)" },
  {
    command: "/complete-us",
    when: "Fechar US — implementação técnica, aceite, status, board",
    example: "/complete-us US-0017",
  },
  { command: "/sync-board", when: "Regenerar docs/kanban/board.json após mudar US" },
  {
    command: "/daily-with-ai",
    when: "Atalho: loop completo da sessão (quem já conhece o fluxo)",
  },
]

export const usageAntiPatterns = [
  "Pedir código sem US ou sem 05_architecture approved.",
  "Marcar ✅ no chat sem /complete-us nos arquivos.",
  "Editar board.json à mão — use /sync-board.",
  "Misturar documentar, backlog e implementar na mesma conversa.",
  "Pular /complete-us e editar status na mão sem Implementação técnica.",
  "approved em doc de fase sem você ter lido o conteúdo.",
]

export const validateProjectHint = {
  title: "Validar estrutura Meridian",
  command: "python3 .agent/scripts/validate_meridian.py <pasta-do-projeto>",
  note: "Rode na raiz do repositório alvo. Corrija erros antes de criar US ou marcar docs approved.",
}

export const folderStructure = {
  title: "O que tem dentro de docs/",
  intro: [
    "Todo projeto Meridian tem uma pasta docs/ na raiz — é ela que você abre neste app. O conteúdo se divide em documentos de fase na raiz de docs/ e pastas de entrega:",
  ],
  items: [
    {
      path: "docs/*.md",
      label: "10 documentos de fase",
      description:
        "Arquivos 00–08 e 11: fundação (00–03), princípios (04), arquitetura (05), detalhe (06–08). Entrega fica nas pastas epics/, versions/, sprints/ e us/.",
    },
    {
      path: "docs/epics/EPIC-XX.md",
      label: "Épicos (capacidades de produto)",
      description:
        "Um arquivo por épico, com frontmatter YAML — igual às user stories. Ex.: EPIC-02.md descreve o monitor de configuração.",
    },
    {
      path: "docs/versions/vX.md",
      label: "Versões (releases)",
      description:
        "Um arquivo por release (v0, v1, v2…). Objetivo, outcome, escopo e checklist de go-live.",
    },
    {
      path: "docs/sprints/vX-SY.md",
      label: "Sprints",
      description:
        "Fatias de tempo dentro de uma versão. Lista de US planejadas (`stories` no frontmatter).",
    },
    {
      path: "docs/us/US-XXXX.md",
      label: "User stories (tarefas)",
      description:
        "Um arquivo por tarefa de desenvolvimento. Só depois de 05_architecture approved e epic/version existirem nas pastas.",
    },
    {
      path: "docs/decisions/YYYY-MM-DD.json",
      label: "Log de decisões (JSON por dia)",
      description:
        "Um arquivo JSON por dia calendário. Array entries com time, title, affected_document, what_changed, why_changed, impact, responsible — mais recente no início.",
    },
    {
      path: "docs/kanban/board.json",
      label: "Quadro kanban (gerado)",
      description:
        "Resumo automático do status de todas as user stories. Nunca edite à mão — ele é montado a partir dos arquivos em docs/us/.",
    },
  ],
}

export const docFlowNote =
  "Dependências entre docs: 00–03 em sequência; 04_principles antes de 05_architecture; 06–08 depois de 05 (06 antes de 07). Log de decisões em docs/decisions/ desde o dia 1. Épicos, versões e US só após 05_architecture approved."

export const journeyPhases: JourneyPhase[] = [
  {
    id: "fase-0",
    label: "Fase 0 — Fundação",
    subtitle: "Entender o projeto",
    purpose:
      "Responde: o que estamos construindo, com qual tecnologia, para quem, com quais riscos. Sequencial — um documento libera o próximo.",
    documents: [
      "11_decisions.md — regras do log (stub)",
      "docs/decisions/YYYY-MM-DD.json — log estruturado por dia",
      "00_scope.md — problema, escopo, o que entra e o que fica de fora",
      "01_tech_stack.md — linguagens, frameworks, ferramentas",
      "02_security.md — ameaças, dados sensíveis, regras",
      "03_user_types.md — perfis de quem usa o produto",
    ],
  },
  {
    id: "fase-1",
    label: "Fase 1 — Princípios",
    subtitle: "Regras de código e qualidade",
    purpose:
      "Convenções que orientam implementação e revisão — antes de desenhar módulos e limites do sistema.",
    documents: ["04_principles.md — convenções de código e qualidade"],
  },
  {
    id: "fase-2",
    label: "Fase 2 — Arquitetura",
    subtitle: "Como o sistema é dividido",
    purpose:
      "Apps, módulos, integrações e limites — com base em escopo, stack, segurança, usuários e princípios.",
    documents: ["05_architecture.md"],
  },
  {
    id: "fase-3",
    label: "Fase 3 — Detalhe técnico",
    subtitle: "Banco, APIs e ambientes",
    purpose:
      "Detalha dados, contratos entre serviços e onde o sistema roda (local, staging, produção).",
    documents: ["06_database.md", "07_api_contracts.md", "08_environments.md"],
  },
  {
    id: "fase-4",
    label: "Fase 4 — Backlog de entrega",
    subtitle: "Releases, épicos, sprints e US",
    purpose:
      "Só depois da arquitetura: fatiar o sistema em releases, capacidades de produto e tarefas executáveis.",
    documents: [
      "docs/epics/EPIC-XX.md — capacidade de produto (outcome)",
      "docs/versions/vX.md — objetivo e escopo de cada release",
      "docs/sprints/vX-SY.md — fatias de tempo dentro da versão",
    ],
    note: "Ordem usual de criação: épico → versão → sprint → US. Gate de US: 05_architecture approved + epic/version existem nas pastas.",
  },
  {
    id: "execucao",
    label: "Execução",
    subtitle: "Implementar e refletir nos arquivos",
    purpose:
      "Implementar user stories, marcar status no frontmatter e deixar o quadro kanban derivar o andamento.",
    documents: [
      "docs/us/US-0001.md… — uma tarefa por arquivo",
      "docs/kanban/board.json — visão consolidada (gerada)",
    ],
  },
]

export const epicsVersionsStories: GuideSubsection[] = [
  {
    title: "Épico — o bloco grande de produto",
    paragraphs: [
      "Um épico agrupa uma capacidade inteira do produto. Exemplo: EPIC-02 “Monitor de Configuração Inicial” engloba abrir pasta, ler documentos de fase e pastas de entrega, mostrar progresso.",
      "Cada épico é um arquivo em docs/epics/EPIC-XX.md: frontmatter com id, title, status, versions, profiles e outcome (done no nível produto); corpo com Capacidade, Resultado esperado e Fora deste epic.",
      "Não há índice markdown duplicado — a pasta docs/epics/ é a fonte de verdade. Crie épicos só depois de 05_architecture approved.",
    ],
    bullets: [
      "Status do épico: active, complete ou paused (diferente de draft/review/approved dos docs de fase).",
      "User stories referenciam o epic só pelo ID no frontmatter (`epic: EPIC-02`) — não copiam texto do epic.",
      "Na aba Entregas deste app você vê outcome, perfis e quantas US já terminaram.",
    ],
  },
  {
    title: "Versão — o release (v0, v1, v2…)",
    paragraphs: [
      "Versão é um pacote de go-live: o que entra junto quando fechamos um marco. Exemplo: v1 = abrir pasta real e ler markdown.",
      "Cada versão é um arquivo em docs/versions/vX.md — fonte de verdade, sem índice duplicado.",
      "Sprints (v1-S1, v1-S2…) ficam em docs/sprints/ — organizam o tempo dentro da versão, com lista de US no frontmatter.",
    ],
    bullets: [
      "User stories referenciam só `version: v1` — não repetem o plano do release.",
      "Epics referenciam `versions: [v0, v1]` — em quais releases a capacidade participa.",
      "IA planeja releases com /create-version; sprints com /plan-sprint.",
    ],
  },
  {
    title: "User story — a tarefa executável",
    paragraphs: [
      "A user story (US) é a unidade de trabalho que alguém (ou um agente) implementa. Formato: “Como [persona], quero [ação], para que [benefício]”.",
      "Cada US é um arquivo em docs/us/ (ex.: US-0017.md). No topo vai frontmatter YAML; o corpo traz aceite e detalhes — sem repetir a definição do epic.",
    ],
    bullets: [
      "Lista de aceite: checkboxes verificáveis — não marque ✅ sem evidência.",
      "depends_on: outras US que precisam terminar antes.",
      "done_when: frase curta que resume quando a US está realmente pronta.",
      "moscow: Must / Should / Could / Won't — prioridade dentro da versão.",
      "Implementação técnica e ✅: preenchidos com /complete-us após você revisar o código — não marque done só no chat.",
      "Seção Testes: Planejado (checkboxes) + Executado (evidência) quando tests: required no frontmatter.",
    ],
  },
]

export const epicAnatomy = {
  title: "Exemplo: como ler um epic",
  intro:
    "Abra docs/epics/EPIC-XX.md. O epic define o quê e o por quê da capacidade; user stories só referenciam o ID (`epic: EPIC-XX`) — nunca colam descrição ou outcome do epic.",
  fields: [
    { field: "id", meaning: "Identificador permanente (EPIC-02)" },
    { field: "title", meaning: "Nome curto da capacidade" },
    {
      field: "status",
      meaning: "active · complete · paused — ciclo de vida do epic, não da US",
    },
    { field: "versions", meaning: "Releases onde o epic entra (v0, v1…)" },
    {
      field: "profiles",
      meaning: "Tipos de usuário de 03_user_types.md que se beneficiam",
    },
    {
      field: "outcome",
      meaning: "Done do epic no nível produto — quando marcar complete",
    },
    {
      field: "Capacidade",
      meaning: "Corpo: o que o usuário passa a conseguir",
    },
    {
      field: "Fora deste epic",
      meaning: "Corpo: limites explícitos — evita escopo creep",
    },
  ],
  exampleTitle: "EPIC-02 — Monitor de Configuração Inicial",
  exampleBody:
    "Outcome: manager abre docs/, vê progresso dos 10 documentos de fase (00–08 e 11) e lê cada .md inline. US-0017 e US-0018 referenciam epic: EPIC-02 sem repetir esse texto.",
}

export const versionAnatomy = {
  title: "Exemplo: como ler uma versão",
  intro:
    "Abra docs/versions/v1.md. A versão define o release; US e sprints só referenciam o ID (`version: v1`).",
  fields: [
    { field: "id", meaning: "Identificador do release (v0, v1, v2…)" },
    { field: "title", meaning: "Nome curto (ex.: Folder Monitor MVP)" },
    {
      field: "status",
      meaning: "planned · active · complete — ciclo do release",
    },
    {
      field: "outcome",
      meaning: "Done do release no nível produto",
    },
    { field: "Objetivo", meaning: "Corpo: o que este go-live entrega" },
    { field: "Explicitamente fora", meaning: "Corpo: o que fica para versões futuras" },
  ],
  exampleTitle: "v1 — Folder Monitor MVP",
  exampleBody:
    "Outcome: usuário abre docs/, abas refletem .md reais. US-0009 a US-0022 usam version: v1. Sprints v1-S1 e v1-S2 em docs/sprints/.",
}

export const userStoryAnatomy = {
  title: "Exemplo: como ler uma user story",
  intro:
    "Abra qualquer arquivo em docs/us/. O topo é metadados; o corpo explica o pedido e os critérios de aceite. O campo epic deve apontar para um arquivo existente em docs/epics/.",
  fields: [
    { field: "id", meaning: "Identificador único (US-0017)" },
    { field: "title", meaning: "Nome curto da tarefa" },
    {
      field: "epic",
      meaning:
        "Referência por ID ao epic em docs/epics/ (ex.: EPIC-02) — não repita descrição do epic aqui",
    },
    {
      field: "version",
      meaning: "Release em docs/versions/ (ex.: v1) — referência por ID",
    },
    {
      field: "status",
      meaning: "✅ concluída · 🔶 parcial (Falta:) · ❌ pendente · 🧊 congelada",
    },
    {
      field: "tests",
      meaning: "required = precisa verificação · none = sem testes (tests_status: n/a)",
    },
    {
      field: "tests_status",
      meaning:
        "pending / done / n/a — coluna 🧪 no quadro quando pending + tests required",
    },
    { field: "depends_on", meaning: "US que precisam terminar antes" },
    { field: "done_when", meaning: "Frase objetiva: pronto quando…" },
    {
      field: "moscow",
      meaning: "Must = obrigatório na versão; Should/Could = desejável",
    },
  ],
  exampleTitle: "US-0017 — Ler documentos de fase em Markdown",
  exampleBody:
    "Como manager do processo, quero abrir cada documento de fase (00–08 e 11) dentro do app, para revisar escopo e arquitetura sem sair do monitor. Aceite: botão em cada doc, leitura via File System Access API, frontmatter + corpo visíveis.",
}

export const statusGuide = {
  title: "Status: documentos, entrega e tarefas",
  documentStatuses: [
    {
      label: "draft",
      meaning: "Rascunho — ainda sendo escrito ou incompleto.",
    },
    {
      label: "review",
      meaning: "Pronto para revisão humana — conteúdo completo o suficiente.",
    },
    {
      label: "approved",
      meaning: "Aprovado — libera documentos e fases que dependem dele.",
    },
  ],
  epicStatuses: [
    {
      label: "active",
      meaning: "Capacidade em andamento — US podem referenciar este epic.",
    },
    { label: "complete", meaning: "Outcome do epic atingido no nível produto." },
    { label: "paused", meaning: "Pausado de propósito — fora do fluxo atual." },
  ],
  versionStatuses: [
    { label: "planned", meaning: "Release definido, ainda não em execução." },
    { label: "active", meaning: "Versão em curso — sprints e US ativas." },
    { label: "complete", meaning: "Go-live deste release concluído." },
  ],
  storyStatuses: [
    { emoji: "❌", label: "Pendente", meaning: "Ainda não começou ou não terminou." },
    {
      emoji: "🔶",
      label: "Em andamento",
      meaning:
        "Parcialmente feita — no aceite deve existir “Falta:” explicando o que falta.",
    },
    {
      emoji: "✅",
      label: "Concluída",
      meaning: "Critérios de aceite e Testes comprovados nos arquivos.",
    },
    {
      emoji: "🧪",
      label: "Aguardando testes",
      meaning:
        "Coluna do quadro quando tests: required e tests_status: pending no YAML.",
    },
    {
      emoji: "🧊",
      label: "Congelada",
      meaning: "Pausada de propósito — não entra no fluxo agora.",
    },
  ],
  kanbanNote:
    "O quadro usa status do YAML e deriva 🧪 de tests_status: pending. board.json inclui tests e tests_status — regenere após mudar US (generate-board-json ou /sync-board).",
}

export const appIntro = {
  title: "O que cada aba deste app mostra",
  paragraphs: [
    "Depois de abrir a pasta docs/, use as abas para navegar. Elas leem os mesmos arquivos que você edita no Cursor — nada é duplicado em banco de dados.",
  ],
}

export const monitorTabsGuide = [
  {
    label: "Comece aqui",
    hint: "O que é o Meridian, pastas, fases e conceitos. Disponível sem pasta aberta.",
  },
  {
    label: "Guia de uso",
    hint: "Passo a passo com acordeões: documentar, backlog, implementar e fechar US (/complete-us).",
  },
  {
    label: "Configuração",
    hint: "Docs 00–08 e 11: fundação → princípios → arquitetura → detalhe técnico.",
  },
  {
    label: "Entregas",
    hint: "Lista os arquivos em docs/epics/ e quantas user stories de cada um já estão ✅.",
  },
  {
    label: "Quadro",
    hint: "Kanban das US: ❌, 🔶, ✅, 🧪 (testes pendentes), 🧊. Filtrável por épico.",
  },
]

export const corePrinciples: ConceptBlock[] = [
  {
    id: "docs-first",
    title: "Documento antes de código",
    summary:
      "Escopo, arquitetura e critérios de aceite vêm primeiro. Código implementa documentação — não o contrário.",
  },
  {
    id: "human-manager",
    title: "Você aprova, agentes executam",
    summary:
      "IA pode escrever e revisar, mas mudanças de escopo, status approved e ✅ só com sua validação.",
  },
  {
    id: "audit-status",
    title: "Pronto = evidência",
    summary:
      "Compilar não basta. ✅ exige aceite e testes nos arquivos — use /complete-us após revisar. 🔶 exige Falta: explícito.",
  },
  {
    id: "derived-board",
    title: "Quadro derivado",
    summary:
      "board.json vem das US. Edite docs/us/*.md, não o JSON, como fonte de verdade do status.",
  },
]

const phaseGroupIntro: Record<string, string> = {
  "Fase 0":
    "Fundação sequencial: entenda o projeto, stack, segurança e usuários antes de qualquer entrega.",
  "Fase 1": "Princípios de código — convenções antes de desenhar o sistema.",
  "Fase 2": "Arquitetura: apps, módulos, limites.",
  "Fase 3": "Detalhe técnico: banco, contratos de API e ambientes.",
  Entrega:
    "Backlog nas pastas epics/, versions/, sprints/ — só após 05_architecture approved.",
  Contínuo:
    "Registro permanente de decisões — sempre que algo relevante mudar, acrescente uma entrada (nunca apague).",
}

const phaseDocDescriptions: Record<string, string> = {
  "00_scope": "Nome, problema, escopo in/out, riscos.",
  "01_tech_stack": "Stack e justificativa das escolhas.",
  "02_security": "Ameaças, segredos, OWASP no contexto do projeto.",
  "03_user_types": "Quem usa e o que cada perfil precisa.",
  "04_principles": "Convenções de código e qualidade.",
  "05_architecture": "Apps, módulos, limites.",
  "06_database": "Modelo de dados e migrações.",
  "07_api_contracts": "Contratos entre serviços.",
  "08_environments": "Local, staging, produção.",
  "11_decisions": "Stub com regras — log em docs/decisions/YYYY-MM-DD.json.",
}

export const phaseDocuments = PHASE_DOC_IDS.map((id) => ({
  id,
  phase: phaseLabelForDocId(id),
  phaseIntro: phaseGroupIntro[phaseLabelForDocId(id)] ?? "",
  description: phaseDocDescriptions[id] ?? "",
}))

export const nextStepsAfterConcepts = {
  title: "Próximo passo",
  paragraphs: [
    "Entendeu pastas, fases e status? Vá para a aba Guia de uso — lá estão os passos, comandos (/init-meridian, /create-us, /complete-us…) e o que fazer em cada situação.",
    "Abra a pasta docs/ do seu repositório neste app para ver Configuração, Entregas e Quadro com dados reais.",
  ],
}
