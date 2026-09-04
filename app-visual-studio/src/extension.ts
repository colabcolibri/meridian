import * as vscode from "vscode"

import { ArchitectureDiagramEditorPanel } from "./architecture-diagram-panel.js"
import { BoardEditorPanel } from "./board-editor-panel.js"
import { DeliveryGraphPanel } from "./delivery-graph-panel.js"
import { ImportGraphPanel } from "./import-graph-panel.js"
import {
  DecisionsEditorPanel,
  EpicsEditorPanel,
  SprintsEditorPanel,
  VersionsEditorPanel,
} from "./planning-panels.js"
import { HelpEditorPanel } from "./help-editor-panel.js"
import { KitReferenceEditorPanel } from "./kit-reference-editor-panel.js"
import {
  AGENTS_HELP_PANEL,
  HOW_TO_USE_PANEL,
  START_HERE_PANEL,
  USAGE_GUIDE_PANEL,
} from "./kit-reference-panels.js"
import { MeridianCommandsProvider } from "./commands-sidebar.js"
import { formatStatusTooltip, type MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { MeridianContext } from "./meridian-context.js"
import {
  installBundledKit,
  kitInstalledAt,
  uninstallInstalledKit,
  workspaceProjectRoot,
} from "./kit-installer.js"
import { openLocalHtmlBoard } from "./open-local-html-board.js"
import { runMeridianDoctor } from "./doctor-runner.js"
import { WelcomeEditorPanel } from "./welcome-editor-panel.js"
import { resolveValidateTarget, runValidateMeridian } from "./validate-runner.js"
import {
  MERIDIAN_DOCUMENT_SCHEME,
  MeridianDocumentProvider,
} from "./meridian-document-provider.js"

let meridianContext: MeridianContext | undefined
let boardEditor: BoardEditorPanel | undefined
let versionsEditor: VersionsEditorPanel | undefined
let sprintsEditor: SprintsEditorPanel | undefined
let epicsEditor: EpicsEditorPanel | undefined
let decisionsEditor: DecisionsEditorPanel | undefined
let architectureDiagramEditor: ArchitectureDiagramEditorPanel | undefined
let deliveryGraphEditor: DeliveryGraphPanel | undefined
let importGraphEditor: ImportGraphPanel | undefined
let helpEditor: HelpEditorPanel | undefined
let howToUseEditor: KitReferenceEditorPanel | undefined
let startHereEditor: KitReferenceEditorPanel | undefined
let usageGuideEditor: KitReferenceEditorPanel | undefined
let agentsHelpEditor: KitReferenceEditorPanel | undefined
let welcomeEditor: WelcomeEditorPanel | undefined
let commandsProvider: MeridianCommandsProvider | undefined
let outputGeneral: vscode.OutputChannel | undefined
let outputValidate: vscode.OutputChannel | undefined
let outputDoctor: vscode.OutputChannel | undefined
let outputTools: vscode.OutputChannel | undefined

function openBoardTab(): void {
  boardEditor?.show(vscode.ViewColumn.One)
}

function openVersionsTab(): void {
  versionsEditor?.show(vscode.ViewColumn.One)
}

function openSprintsTab(): void {
  sprintsEditor?.show(vscode.ViewColumn.One)
}

function openEpicsTab(): void {
  epicsEditor?.show(vscode.ViewColumn.One)
}

function openDecisionsTab(): void {
  decisionsEditor?.show(vscode.ViewColumn.One)
}

function openArchitectureDiagramTab(): void {
  architectureDiagramEditor?.show(vscode.ViewColumn.One)
}

function openDeliveryGraphTab(): void {
  deliveryGraphEditor?.show(vscode.ViewColumn.One)
}

function openImportGraphTab(): void {
  importGraphEditor?.show(vscode.ViewColumn.One)
}

function openHelpTab(): void {
  helpEditor?.show(vscode.ViewColumn.One)
}

async function openHowToUseTab(): Promise<void> {
  await meridianContext?.refresh()
  howToUseEditor?.show(vscode.ViewColumn.One)
}

async function openStartHereTab(): Promise<void> {
  await meridianContext?.refresh()
  startHereEditor?.show(vscode.ViewColumn.One)
}

async function openUsageGuideTab(): Promise<void> {
  await meridianContext?.refresh()
  usageGuideEditor?.show(vscode.ViewColumn.One)
}

async function openAgentsHelpTab(): Promise<void> {
  await meridianContext?.refresh()
  agentsHelpEditor?.show(vscode.ViewColumn.One)
}

function refreshAllPanels(): void {
  boardEditor?.refresh()
  versionsEditor?.refresh()
  sprintsEditor?.refresh()
  epicsEditor?.refresh()
  decisionsEditor?.refresh()
  architectureDiagramEditor?.refresh()
  deliveryGraphEditor?.refresh()
  importGraphEditor?.refresh()
  startHereEditor?.refresh()
  howToUseEditor?.refresh()
  usageGuideEditor?.refresh()
  agentsHelpEditor?.refresh()
  welcomeEditor?.refresh()
  commandsProvider?.refresh()
}

function appendToolOutput(title: string, body: string): void {
  const ch = outputTools ?? outputGeneral
  const line = `\n── ${title} ${new Date().toLocaleTimeString()} ──\n${body}\n`
  ch?.appendLine(line)
  ch?.show(true)
}

async function requireWorkspace(): Promise<MeridianWorkspaceInfo | null> {
  await meridianContext?.refresh()
  const info = meridianContext?.workspace
  if (!info?.docsExists) {
    if (info && !info.docsExists) {
      void vscode.window.showWarningMessage(
        "Meridian: kit installed — run /init-meridian in chat or create docs/ to use the board.",
      )
    } else {
      void vscode.window.showWarningMessage(
        "Meridian: install the harness in this workspace first (status bar or Meridian: Install Harness).",
      )
    }
    appendToolOutput("Workspace", "Meridian kit or docs/ not ready.")
    return null
  }
  return info
}

async function uninstallKit(): Promise<void> {
  const root = workspaceProjectRoot(vscode.workspace.workspaceFolders)
  if (!root) {
    void vscode.window.showWarningMessage("Meridian: open a workspace folder first.")
    return
  }

  if (!kitInstalledAt(root)) {
    void vscode.window.showWarningMessage("Meridian: no .agent/ harness installed in this workspace.")
    return
  }

  const scope = await vscode.window.showQuickPick(
    [
      {
        label: "$(eraser) Remove IDE adapters only",
        description: "Safe",
        detail: "Removes .cursor/, .claude/, Codex, .opencode/ Meridian links. Keeps .agent/.",
        value: "adapters" as const,
      },
      {
        label: "$(trash) Full removal",
        description: "Adapters + .agent/ + gitignore entries",
        detail: "docs/ and .meridian/ (delivery SQLite) are NEVER deleted — remove manually if desired.",
        value: "all" as const,
      },
    ],
    { placeHolder: "Meridian: what should be removed?" },
  )
  if (!scope) {
    return
  }

  const confirm = await vscode.window.showWarningMessage(
    scope.value === "all"
      ? "Remove the Meridian harness completely from this workspace?"
      : "Remove Meridian IDE adapters from this workspace?",
    "Remove",
    "Cancel",
  )
  if (confirm !== "Remove") {
    return
  }

  const result = uninstallInstalledKit(root, { scope: scope.value })
  appendToolOutput("Remove harness", result.message)
  if (result.ok) {
    void vscode.window.showInformationMessage(`Meridian: ${result.message}`)
    await meridianContext?.refresh()
    refreshAllPanels()
  } else {
    void vscode.window.showErrorMessage(`Meridian: ${result.message}`)
  }
}

async function installKit(force = false): Promise<void> {
  const root = workspaceProjectRoot(vscode.workspace.workspaceFolders)
  if (!root) {
    void vscode.window.showWarningMessage("Meridian: open a workspace folder first.")
    return
  }

  if (!force && kitInstalledAt(root)) {
    const upgrade = await vscode.window.showWarningMessage(
      "Meridian: .agent/ already exists. Replace with the bundled kit version?",
      "Upgrade harness",
      "Cancel",
    )
    if (upgrade !== "Upgrade harness") {
      return
    }
    force = true
  }

  const result = installBundledKit(root, meridianContext!.extensionPath, { force })
  appendToolOutput(force ? "Upgrade harness" : "Install harness", result.message)
  if (result.ok) {
    void vscode.window.showInformationMessage(`Meridian: ${result.message}`)
    await meridianContext?.refresh()
    refreshAllPanels()
  } else {
    void vscode.window.showErrorMessage(`Meridian: ${result.message}`)
  }
}

async function openWelcomeTab(): Promise<void> {
  await meridianContext?.refresh()
  welcomeEditor?.show(vscode.ViewColumn.One)
}

const WELCOME_OFFERED_KEY = "meridian.welcomeOfferedPaths"

async function offerWelcomeIfNeeded(context: vscode.ExtensionContext): Promise<void> {
  const root = workspaceProjectRoot(vscode.workspace.workspaceFolders)
  if (!root) {
    return
  }
  const offered = context.globalState.get<string[]>(WELCOME_OFFERED_KEY) ?? []
  if (offered.includes(root)) {
    return
  }
  await context.globalState.update(WELCOME_OFFERED_KEY, [...offered, root])
  const pick = await vscode.window.showInformationMessage(
    "Meridian: open the first-value onboarding checklist?",
    "Open welcome",
    "Later",
  )
  if (pick === "Open welcome") {
    await openWelcomeTab()
  }
}

async function runDoctor(): Promise<void> {
  const root = workspaceProjectRoot(vscode.workspace.workspaceFolders)
  if (!root) {
    void vscode.window.showWarningMessage("Meridian: open a workspace folder first.")
    return
  }
  outputDoctor?.clear()
  outputDoctor?.appendLine(`meridian_doctor.py ${root}`)
  outputDoctor?.show(true)

  const { code, output } = await runMeridianDoctor(root)
  outputDoctor?.appendLine(output)
  outputDoctor?.appendLine(`\nExit code: ${code}`)

  if (code === 0) {
    void vscode.window.showInformationMessage("Meridian: doctor — healthy (see Output › Meridian Doctor).")
  } else {
    void vscode.window.showErrorMessage("Meridian: doctor found issues — see Output › Meridian Doctor.")
  }
}

async function validateProject(): Promise<void> {
  const info = await requireWorkspace()
  if (!info) {
    return
  }
  const target = resolveValidateTarget(info)
  outputValidate?.clear()
  outputValidate?.appendLine(`validate_meridian.py ${target}`)
  outputValidate?.appendLine(`cwd: ${info.projectRoot}\n`)
  outputValidate?.show(true)

  const { code, output } = await runValidateMeridian(info.projectRoot, target)
  outputValidate?.appendLine(output)
  outputValidate?.appendLine(`\nExit code: ${code}`)

  if (code === 0) {
    void vscode.window.showInformationMessage("Meridian: validation passed.")
  } else {
    void vscode.window.showErrorMessage("Meridian: validation failed — see Output › Meridian Validate.")
  }
}

async function showStatus(): Promise<void> {
  await meridianContext?.refresh()
  const info = meridianContext?.workspace
  if (!info) {
    const root = workspaceProjectRoot(vscode.workspace.workspaceFolders)
    appendToolOutput(
      "Workspace status",
      root
        ? "No Meridian kit in workspace. Use Meridian: Install Harness."
        : "No workspace folder open.",
    )
    return
  }
  appendToolOutput("Workspace status", formatStatusTooltip(info))
}

export function activate(context: vscode.ExtensionContext): void {
  commandsProvider = new MeridianCommandsProvider()
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(MeridianCommandsProvider.viewId, commandsProvider),
    vscode.commands.registerCommand("meridian.refreshCommands", () => commandsProvider?.refresh()),
  )

  outputGeneral = vscode.window.createOutputChannel("Meridian")
  outputValidate = vscode.window.createOutputChannel("Meridian Validate")
  outputDoctor = vscode.window.createOutputChannel("Meridian Doctor")
  outputTools = vscode.window.createOutputChannel("Meridian Tools")
  context.subscriptions.push(outputGeneral, outputValidate, outputDoctor, outputTools)

  const deliveryDocProvider = new MeridianDocumentProvider()
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      MERIDIAN_DOCUMENT_SCHEME,
      deliveryDocProvider,
    ),
  )

  const getWorkspace = () => meridianContext?.workspace ?? null
  const onSelectProject = (id: string) =>
    meridianContext?.selectActiveProjectById(id) ?? Promise.resolve()

  meridianContext = new MeridianContext(context, outputGeneral, refreshAllPanels)

  boardEditor = new BoardEditorPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  versionsEditor = new VersionsEditorPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  sprintsEditor = new SprintsEditorPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  epicsEditor = new EpicsEditorPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  decisionsEditor = new DecisionsEditorPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  architectureDiagramEditor = new ArchitectureDiagramEditorPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  deliveryGraphEditor = new DeliveryGraphPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  importGraphEditor = new ImportGraphPanel(
    context.extensionUri,
    getWorkspace,
    onSelectProject,
    refreshAllPanels,
  )
  helpEditor = new HelpEditorPanel(context.extensionUri)
  howToUseEditor = new KitReferenceEditorPanel(
    HOW_TO_USE_PANEL,
    context.extensionUri,
    getWorkspace,
  )
  startHereEditor = new KitReferenceEditorPanel(
    START_HERE_PANEL,
    context.extensionUri,
    getWorkspace,
  )
  usageGuideEditor = new KitReferenceEditorPanel(
    USAGE_GUIDE_PANEL,
    context.extensionUri,
    getWorkspace,
  )
  agentsHelpEditor = new KitReferenceEditorPanel(
    AGENTS_HELP_PANEL,
    context.extensionUri,
    getWorkspace,
  )
  welcomeEditor = new WelcomeEditorPanel(context.extensionUri, getWorkspace)
  meridianContext.registerListeners()
  void meridianContext.refresh().then(() => offerWelcomeIfNeeded(context))

  context.subscriptions.push(
    vscode.commands.registerCommand("meridian.openBoard", openBoardTab),
    vscode.commands.registerCommand("meridian.openLocalHtmlBoard", () =>
      openLocalHtmlBoard(meridianContext?.workspace ?? null, context.extensionPath),
    ),
    vscode.commands.registerCommand("meridian.openVersions", openVersionsTab),
    vscode.commands.registerCommand("meridian.openDeliverables", openVersionsTab),
    vscode.commands.registerCommand("meridian.openSprints", openSprintsTab),
    vscode.commands.registerCommand("meridian.openEpics", openEpicsTab),
    vscode.commands.registerCommand("meridian.openDecisions", openDecisionsTab),
    vscode.commands.registerCommand(
      "meridian.openArchitectureDiagram",
      openArchitectureDiagramTab,
    ),
    vscode.commands.registerCommand("meridian.openDeliveryGraph", openDeliveryGraphTab),
    vscode.commands.registerCommand("meridian.openImportGraph", openImportGraphTab),
    vscode.commands.registerCommand("meridian.openHelp", openHelpTab),
    vscode.commands.registerCommand("meridian.openHowToUse", openHowToUseTab),
    vscode.commands.registerCommand("meridian.openStartHere", openStartHereTab),
    vscode.commands.registerCommand("meridian.openUsageGuide", openUsageGuideTab),
    vscode.commands.registerCommand("meridian.openAgentsHelp", openAgentsHelpTab),
    vscode.commands.registerCommand("meridian.openWelcome", openWelcomeTab),
    vscode.commands.registerCommand("meridian.doctor", runDoctor),
    vscode.commands.registerCommand("meridian.installKit", () => installKit(false)),
    vscode.commands.registerCommand("meridian.upgradeKit", () => installKit(true)),
    vscode.commands.registerCommand("meridian.uninstallKit", () => uninstallKit()),
    vscode.commands.registerCommand("meridian.validateProject", validateProject),
    vscode.commands.registerCommand("meridian.showStatus", showStatus),
    vscode.commands.registerCommand("meridian.selectActiveProject", () =>
      meridianContext?.selectActiveProject(),
    ),
  )
}

export function deactivate(): void {
  meridianContext?.dispose()
  meridianContext = undefined
  boardEditor = undefined
  versionsEditor = undefined
  sprintsEditor = undefined
  epicsEditor = undefined
  decisionsEditor = undefined
  architectureDiagramEditor = undefined
  deliveryGraphEditor = undefined
  importGraphEditor = undefined
  helpEditor = undefined
  howToUseEditor = undefined
  startHereEditor = undefined
  usageGuideEditor = undefined
  agentsHelpEditor = undefined
  welcomeEditor = undefined
  commandsProvider = undefined
}
