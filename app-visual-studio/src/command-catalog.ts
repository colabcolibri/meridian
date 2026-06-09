export type CommandHelpEntry = {
  id: string
  title: string
  commandId: string
  paletteTitle: string
  group: "views" | "governance" | "kit" | "planned"
  summary: string
  details: string[]
  outputChannel?: string
  icon?: string
  status: "shipped" | "stub"
}

export const COMMAND_HELP_GROUPS: { id: CommandHelpEntry["group"]; label: string }[] = [
  { id: "views", label: "Views (editor tabs)" },
  { id: "governance", label: "Governance & diagnostics" },
  { id: "kit", label: "Kit (agents & slash commands)" },
  { id: "planned", label: "Planned (v5)" },
]

export const MERIDIAN_COMMAND_CATALOG: CommandHelpEntry[] = [
  {
    id: "board",
    title: "Open Board",
    commandId: "meridian.openBoard",
    paletteTitle: "Meridian: Open Board",
    group: "views",
    summary: "Kanban read-only a partir de docs/us/*.md",
    details: [
      "Colunas Todo, Partial, Tests, Done e Frozen (toggle).",
      "Filtros de versão e épico (All / None / chips). Abre com All em ambos.",
      "Paginação independente por coluna (Show 25/50/100 no toolbar).",
      "Clique no card abre docs/us/US-XXXX.md ao lado.",
    ],
    icon: "$(layout)",
    status: "shipped",
  },
  {
    id: "versions",
    title: "Open Versions",
    commandId: "meridian.openVersions",
    paletteTitle: "Meridian: Open Versions",
    group: "views",
    summary: "Lista todas as releases em docs/versions/",
    details: [
      "Acordeão por versão com progresso (US done/total).",
      "Sem filtro de versão — mostra o catálogo completo.",
      "Paginação no rodapé (Show 25/50/100).",
      "Clique no id abre o .md da versão.",
    ],
    icon: "$(versions)",
    status: "shipped",
  },
  {
    id: "sprints",
    title: "Open Sprints",
    commandId: "meridian.openSprints",
    paletteTitle: "Meridian: Open Sprints",
    group: "views",
    summary: "Lista sprints em docs/sprints/ filtrados por versão",
    details: [
      "Filtro All / None / chips (mesmo padrão do Board).",
      "Abre com All versões selecionadas; ordenação por id (v4-S1, v4-S2…).",
      "Paginação no rodapé.",
    ],
    icon: "$(run-all)",
    status: "shipped",
  },
  {
    id: "epics",
    title: "Open Epics",
    commandId: "meridian.openEpics",
    paletteTitle: "Meridian: Open Epics",
    group: "views",
    summary: "Lista epics com stories no escopo das versões selecionadas",
    details: [
      "Filtro de versão only (All / None / chips).",
      "Barra de progresso por epic (US ✅ / total).",
      "Paginação no rodapé.",
    ],
    icon: "$(layers)",
    status: "shipped",
  },
  {
    id: "deliverables",
    title: "Open Deliverables",
    commandId: "meridian.openDeliverables",
    paletteTitle: "Meridian: Open Deliverables",
    group: "views",
    summary: "Alias para Open Versions (compatibilidade v4)",
    details: ["Mesma aba e comportamento que Open Versions."],
    icon: "$(list-tree)",
    status: "shipped",
  },
  {
    id: "validate",
    title: "Validate project",
    commandId: "meridian.validateProject",
    paletteTitle: "Meridian: Validate Project",
    group: "governance",
    summary: "Roda validate_meridian.py no project root",
    details: [
      "Equivalente a python3 .agent/scripts/validate_meridian.py <pasta-do-projeto>.",
      "Verifica estrutura docs/, US, board.json, contratos de templates, etc.",
      "Notificação pass/fail; log completo no Output.",
    ],
    outputChannel: "Meridian Validate",
    icon: "$(checklist)",
    status: "shipped",
  },
  {
    id: "sync",
    title: "Sync board",
    commandId: "meridian.syncBoard",
    paletteTitle: "Meridian: Sync Board",
    group: "governance",
    summary: "Regenera docs/kanban/board.json a partir do frontmatter das US",
    details: [
      "O Board **lê docs/us/** direto — sync não é obrigatório para ver o kanban.",
      "Necessário para validate, CI e ferramentas que consomem board.json.",
      "Atualiza painéis abertos após gravar.",
    ],
    outputChannel: "Meridian Tools",
    icon: "$(sync)",
    status: "shipped",
  },
  {
    id: "status",
    title: "Workspace status",
    commandId: "meridian.showStatus",
    paletteTitle: "Meridian: Show Workspace Status",
    group: "governance",
    summary: "Mostra detecção do kit e caminhos do workspace",
    details: [
      "Project root (onde está .agent/MERIDIAN.md).",
      "Caminho resolvido de docs/ (monorepo: app-desktop/docs).",
      "Contagem de US parseáveis em docs/us/.",
    ],
    outputChannel: "Meridian Tools",
    icon: "$(info)",
    status: "shipped",
  },
  {
    id: "agents-help",
    title: "Open Agents Help",
    commandId: "meridian.openAgentsHelp",
    paletteTitle: "Meridian: Open Agents Help",
    group: "kit",
    summary: "Aba de referência — grupos de agentes, slash commands e passos 1–17",
    details: [
      "Mesmo padrão do Command Help: aba webview read-only no editor.",
      "Lê .agent/references/agents-help.md do project root em tempo real.",
      "Complementa Command Help (comandos da extensão) e o slash /agents-help no Cursor.",
    ],
    icon: "$(book)",
    status: "shipped",
  },
  {
    id: "new-us",
    title: "New user story",
    commandId: "meridian.newUserStory",
    paletteTitle: "Meridian: New User Story",
    group: "planned",
    summary: "Wizard de criação de US — previsto para v5",
    details: [
      "Hoje: mensagem no Output com instrução para usar /create-us no Cursor.",
      "v5: formulário guiado alinhado ao kit Meridian.",
    ],
    outputChannel: "Meridian Tools",
    icon: "$(add)",
    status: "stub",
  },
]
