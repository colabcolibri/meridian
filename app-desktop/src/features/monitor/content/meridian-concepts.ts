import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import { phaseLabelForDocId } from "@/domain/meridian/doc-refs"

export type ConceptBlock = {
  id: string
  title: string
  summary: string
  bullets?: string[]
}

export const meridianIntro = {
  title: "O que é o Meridian",
  paragraphs: [
    "Meridian é uma forma de organizar projetos de software: você documenta o que vai fazer antes de pedir código, e o código implementa o que está escrito.",
    "Funciona com ou sem agentes de IA. A IA pode escrever e revisar, mas quem decide escopo, prioridades e o que está pronto de verdade é você.",
    "Tudo fica em arquivos Markdown na pasta docs/ do projeto — não depende de ferramenta externa nem de login em SaaS.",
  ],
}

export const appIntro = {
  title: "O que este app faz",
  paragraphs: [
    "Este app abre a pasta docs/ do seu projeto e mostra o que já está documentado: progresso, entregas planejadas e status de cada tarefa.",
    "É um painel de leitura. A fonte de verdade continua sendo os arquivos que você edita no Cursor (ou em qualquer editor).",
  ],
}

export const monitorTabsGuide = [
  {
    label: "Configuração",
    hint: "Lista os 12 documentos base (escopo, arquitetura, versões…) e se cada um já foi aprovado.",
  },
  {
    label: "Entregas",
    hint: "Mostra os grandes blocos do produto (épicos) e quantas tarefas já terminaram em cada um.",
  },
  {
    label: "Quadro",
    hint: "Visão tipo kanban: pendente, em andamento, concluída — uma coluna por status.",
  },
]

export const corePrinciples: ConceptBlock[] = [
  {
    id: "docs-first",
    title: "Documento antes de código",
    summary:
      "Nada entra em desenvolvimento sem estar escrito. Nada está pronto se o documento não reflete a realidade.",
  },
  {
    id: "human-manager",
    title: "Você manda, a IA executa",
    summary:
      "Agentes implementam e sugerem. Você aprova escopo, versões e critérios de aceite.",
  },
  {
    id: "audit-status",
    title: "Pronto só com evidência",
    summary:
      "Compilar ou parecer ok não basta. Cada item precisa de critérios de aceite verificáveis nos arquivos.",
  },
  {
    id: "derived-board",
    title: "Quadro gerado automaticamente",
    summary:
      "O arquivo kanban/board.json é montado a partir das tarefas. Não edite o quadro à mão como fonte principal.",
  },
]

const phaseDocDescriptions: Record<string, string> = {
  "00_scope": "O que é o projeto, para quem, o que entra e o que fica de fora.",
  "01_tech_stack": "Linguagens, frameworks e ferramentas escolhidas.",
  "02_security": "Riscos, dados sensíveis e como proteger.",
  "03_user_types": "Perfis de quem usa o produto e o que cada um precisa.",
  "04_epics": "Grandes funcionalidades do produto (ex.: login, relatórios).",
  "05_principles": "Regras de código e qualidade do time.",
  "06_versions": "Releases planejadas e ordem de entrega.",
  "07_architecture": "Como o sistema é dividido em partes e como se conectam.",
  "08_database": "Tabelas, dados e migrações.",
  "09_api_contracts": "Como serviços e front-end conversam entre si.",
  "10_environments": "Onde roda (local, staging, produção) e variáveis.",
  "11_decisions": "Registro de decisões importantes — só acrescenta, não apaga.",
}

export const phaseDocuments = PHASE_DOC_IDS.map((id) => ({
  id,
  phase: phaseLabelForDocId(id),
  description: phaseDocDescriptions[id] ?? "",
}))

export const workflowConcepts: ConceptBlock[] = [
  {
    id: "epics",
    title: "Épicos",
    summary:
      "Agrupam funcionalidades grandes. Ex.: “autenticação”, “painel de monitoramento”.",
    bullets: [
      "Ficam no arquivo 04_epics.md.",
      "Podem estar ativos, pausados ou concluídos.",
    ],
  },
  {
    id: "versions",
    title: "Versões",
    summary: "Releases do produto — o que vai na v1, v2, etc.",
    bullets: [
      "Ficam no arquivo 06_versions.md.",
      "Precisam estar aprovadas antes de criar tarefas detalhadas.",
    ],
  },
  {
    id: "user-stories",
    title: "Tarefas (user stories)",
    summary: "Pedacinhos de trabalho com critério claro de “terminou quando…”.",
    bullets: [
      "Um arquivo por tarefa em docs/us/ (ex.: US-001.md).",
      "Status: ✅ feita · 🔶 parcial · ❌ pendente · 🧊 congelada.",
    ],
  },
  {
    id: "kanban",
    title: "Quadro kanban",
    summary: "Resumo visual do andamento de todas as tarefas.",
    bullets: [
      "Gerado a partir dos arquivos de tarefa — não edite o JSON manualmente.",
      "Inconsistências aparecem como alertas neste app.",
    ],
  },
]

export const dependencyOrder = [
  "Defina escopo e quem usa o produto antes de planejar entregas.",
  "Aprove épicos e versões antes de criar tarefas.",
  "Documente arquitetura e segurança antes de codar a estrutura.",
  "Registre decisões importantes em 11_decisions.md.",
]
