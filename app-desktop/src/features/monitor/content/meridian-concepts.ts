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

export const meridianIntro = {
  title: "Guia para quem nunca viu o Meridian",
  paragraphs: [
    "Meridian é um jeito de organizar projetos de software usando arquivos Markdown na pasta docs/. Você escreve o que vai fazer, aprova, e só então pede código — manualmente ou com agentes de IA no Cursor.",
    "Não é um Jira, não é um Notion e não exige login. A fonte de verdade são os arquivos no seu repositório. Este app só lê essa pasta e mostra o progresso de forma visual.",
    "Se você nunca viu isso antes, leia as seções abaixo na ordem. Em dez minutos você entende o fluxo inteiro.",
  ],
}

export const folderStructure = {
  title: "O que tem dentro de docs/",
  intro: [
    "Todo projeto Meridian tem uma pasta docs/ na raiz. É ela que você abre neste app. Dentro dela existem quatro tipos principais de conteúdo:",
  ],
  items: [
    {
      path: "docs/*.md",
      label: "12 documentos de fase",
      description:
        "Arquivos numerados de 00_scope.md até 11_decisions.md. O 04_epics.md é o índice dos épicos; os demais definem escopo, stack, versões, arquitetura…",
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
        "Um arquivo por tarefa de desenvolvimento. Só existem depois que o índice 04_epics e 06_versions estão aprovados.",
    },
    {
      path: "docs/kanban/board.json",
      label: "Quadro kanban (gerado)",
      description:
        "Resumo automático do status de todas as user stories. Nunca edite à mão — ele é montado a partir dos arquivos em docs/us/.",
    },
  ],
}

export const journeyPhases: JourneyPhase[] = [
  {
    id: "fase-0",
    label: "Fase 0 — Fundação",
    subtitle: "Entender o projeto antes de planejar entregas",
    purpose:
      "Responde: o que estamos construindo, com qual tecnologia, para quem, com quais riscos de segurança. Tudo sequencial — um documento libera o próximo.",
    documents: [
      "11_decisions.md — log de decisões (começa no dia 1, nunca para)",
      "00_scope.md — problema, escopo, o que entra e o que fica de fora",
      "01_tech_stack.md — linguagens, frameworks, ferramentas",
      "02_security.md — ameaças, dados sensíveis, regras",
      "03_user_types.md — perfis de quem usa o produto",
    ],
  },
  {
    id: "fase-1",
    label: "Fase 1 — Planejamento",
    subtitle: "Definir entregas grandes e releases",
    purpose:
      "Agora que o projeto está claro, você define os blocos de produto (épicos) e quando cada release sai (versões). Só com os dois aprovados você pode criar user stories.",
    documents: [
      "04_epics.md — índice aprovado do catálogo de épicos",
      "05_principles.md — regras de código e qualidade",
      "06_versions.md — índice aprovado de releases e sprints",
    ],
    note: "04_epics.md e 06_versions.md precisam estar approved antes de criar US. Detalhes: docs/epics/, docs/versions/, docs/sprints/.",
  },
  {
    id: "fase-2",
    label: "Fase 2 — Arquitetura",
    subtitle: "Como o sistema é dividido",
    purpose:
      "Descreve módulos, apps, integrações e limites. Só avança depois que escopo, usuários, princípios e versões estão aprovados.",
    documents: ["07_architecture.md"],
  },
  {
    id: "fase-3",
    label: "Fase 3 — Detalhamento técnico",
    subtitle: "Banco, APIs e ambientes",
    purpose:
      "Detalha dados, contratos entre serviços e onde o sistema roda (local, staging, produção).",
    documents: ["08_database.md", "09_api_contracts.md", "10_environments.md"],
  },
  {
    id: "execucao",
    label: "Fase 4 — Execução",
    subtitle: "Onde o código acontece de verdade",
    purpose:
      "Com a documentação base aprovada, você cria user stories em docs/us/, implementa, marca status nos arquivos e o quadro kanban reflete o andamento.",
    documents: [
      "docs/versions/v0.md, v1.md… — um arquivo por release",
      "docs/sprints/v1-S1.md… — sprints dentro da versão",
      "docs/epics/EPIC-01.md… — capacidades de produto",
      "docs/us/US-0001.md, US-0002.md… — uma tarefa por arquivo",
      "docs/kanban/board.json — visão consolidada (gerada)",
    ],
  },
]

export const epicsVersionsStories: GuideSubsection[] = [
  {
    title: "Épico — o bloco grande de produto",
    paragraphs: [
      "Um épico agrupa uma capacidade inteira do produto. Exemplo: EPIC-02 “Monitor de Configuração Inicial” engloba abrir pasta, ler arquivos 00–11, mostrar progresso.",
      "Cada épico é um arquivo em docs/epics/EPIC-XX.md: frontmatter com id, title, status, versions, profiles e outcome (done no nível produto); corpo com Capacidade, Resultado esperado e Fora deste epic.",
      "O arquivo 04_epics.md é só o índice de fase — tabela-resumo que confirma que o catálogo foi aprovado.",
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
      "Cada versão é um arquivo em docs/versions/vX.md (objetivo, outcome, incluído/fora, checklist). O 06_versions.md é só o índice de fase.",
      "Sprints (v1-S1, v1-S2…) ficam em docs/sprints/ — organizam o tempo dentro da versão, com lista de US no frontmatter.",
    ],
    bullets: [
      "User stories referenciam só `version: v1` — não repetem o plano do release.",
      "Epics referenciam `versions: [v0, v1]` — em quais releases a capacidade participa.",
      "IA planeja releases com /create-version; sprints com /plan-sprint ou create-sprint.",
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
    "Outcome: manager abre docs/, vê progresso dos 12 documentos e lê cada .md inline. US-0017 e US-0018 referenciam epic: EPIC-02 sem repetir esse texto.",
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
      meaning:
        "✅ concluída · 🔶 parcial (precisa campo Falta:) · ❌ pendente · 🧊 congelada",
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
    "Como manager do processo, quero abrir cada doc 00–11 dentro do app, para revisar escopo e arquitetura sem sair do monitor. Aceite: botão em cada doc, leitura via File System Access API, frontmatter + corpo visíveis.",
}

export const statusGuide = {
  title: "Status: documentos e tarefas",
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
      meaning: "Critérios de aceite comprovados nos arquivos.",
    },
    {
      emoji: "🧊",
      label: "Congelada",
      meaning: "Pausada de propósito — não entra no fluxo agora.",
    },
  ],
  kanbanNote:
    "O quadro kanban (aba Quadro) agrupa as US nessas colunas. O arquivo board.json é gerado — se você mudar status na US, regenere o board (skill generate-board-json ou comando sync-board).",
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
    hint: "Este guia. Disponível mesmo sem pasta aberta.",
  },
  {
    label: "Configuração",
    hint: "Os 12 documentos de fase (00–11), agrupados por Fase 0 a 3. Cores indicam: pronto, em andamento, bloqueado ou com alerta. Clique em um doc para ler o .md.",
  },
  {
    label: "Entregas",
    hint: "Lista os arquivos em docs/epics/ e quantas user stories de cada um já estão ✅.",
  },
  {
    label: "Quadro",
    hint: "Kanban das user stories: pendente, em andamento, concluída, congelada. Filtrável por épico.",
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
      "Compilar não basta. ✅ exige aceite verificável. 🔶 exige dizer explicitamente o que falta.",
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
    "Fundação sequencial: entenda o projeto, stack, segurança e usuários antes de qualquer planejamento de entrega.",
  "Fase 1":
    "Planejamento: épicos (blocos de produto), princípios de código e versões (releases). Desbloqueia criação de US.",
  "Fase 2": "Arquitetura: como o sistema se divide em partes e se conecta.",
  "Fase 3": "Detalhe técnico: banco de dados, contratos de API e ambientes de deploy.",
  Contínuo:
    "Registro permanente de decisões — sempre que algo relevante mudar, acrescente uma entrada (nunca apague).",
}

const phaseDocDescriptions: Record<string, string> = {
  "00_scope": "Nome, problema, escopo in/out, riscos.",
  "01_tech_stack": "Stack e justificativa das escolhas.",
  "02_security": "Ameaças, segredos, OWASP no contexto do projeto.",
  "03_user_types": "Quem usa e o que cada perfil precisa.",
  "04_epics": "Índice aprovado do catálogo de épicos (detalhes em docs/epics/).",
  "05_principles": "Convenções de código e qualidade.",
  "06_versions":
    "Índice de releases e sprints (detalhes em docs/versions/ e docs/sprints/).",
  "07_architecture": "Apps, módulos, limites.",
  "08_database": "Modelo de dados e migrações.",
  "09_api_contracts": "Contratos entre serviços.",
  "10_environments": "Local, staging, produção.",
  "11_decisions": "Log append-only de decisões.",
}

export const phaseDocuments = PHASE_DOC_IDS.map((id) => ({
  id,
  phase: phaseLabelForDocId(id),
  phaseIntro: phaseGroupIntro[phaseLabelForDocId(id)] ?? "",
  description: phaseDocDescriptions[id] ?? "",
}))

export const firstSteps = [
  "Leia este guia até o fim (você está aqui).",
  "Abra a pasta docs/ do seu projeto neste app.",
  "Vá em Configuração e veja quais documentos estão draft, review ou approved.",
  "Quando 04_epics.md e 06_versions.md estiverem approved, explore docs/epics/ e docs/us/.",
  "Use a aba Quadro para ver o andamento geral das tarefas.",
]
