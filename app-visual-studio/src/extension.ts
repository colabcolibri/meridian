import * as vscode from "vscode"

import { BoardEditorPanel } from "./board-editor-panel.js"
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
  workspaceProjectRoot,
} from "./kit-installer.js"
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
let helpEditor: HelpEditorPanel | undefined
let howToUseEditor: KitReferenceEditorPanel | undefined
let startHereEditor: KitReferenceEditorPanel | undefined
let usageGuideEditor: KitReferenceEditorPanel | undefined
let agentsHelpEditor: KitReferenceEditorPanel | undefined
let commandsProvider: MeridianCommandsProvider | undefined
let outputGeneral: vscode.OutputChannel | undefined
let outputValidate: vscode.OutputChannel | undefined
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
  startHereEditor?.refresh()
  howToUseEditor?.refresh()
  usageGuideEditor?.refresh()
  agentsHelpEditor?.refresh()
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
  outputTools = vscode.window.createOutputChannel("Meridian Tools")
  context.subscriptions.push(outputGeneral, outputValidate, outputTools)

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
  meridianContext.registerListeners()
  void meridianContext.refresh()

  context.subscriptions.push(
    vscode.commands.registerCommand("meridian.openBoard", openBoardTab),
    vscode.commands.registerCommand("meridian.openVersions", openVersionsTab),
    vscode.commands.registerCommand("meridian.openDeliverables", openVersionsTab),
    vscode.commands.registerCommand("meridian.openSprints", openSprintsTab),
    vscode.commands.registerCommand("meridian.openEpics", openEpicsTab),
    vscode.commands.registerCommand("meridian.openDecisions", openDecisionsTab),
    vscode.commands.registerCommand("meridian.openHelp", openHelpTab),
    vscode.commands.registerCommand("meridian.openHowToUse", openHowToUseTab),
    vscode.commands.registerCommand("meridian.openStartHere", openStartHereTab),
    vscode.commands.registerCommand("meridian.openUsageGuide", openUsageGuideTab),
    vscode.commands.registerCommand("meridian.openAgentsHelp", openAgentsHelpTab),
    vscode.commands.registerCommand("meridian.installKit", () => installKit(false)),
    vscode.commands.registerCommand("meridian.upgradeKit", () => installKit(true)),
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
  helpEditor = undefined
  howToUseEditor = undefined
  startHereEditor = undefined
  usageGuideEditor = undefined
  agentsHelpEditor = undefined
  commandsProvider = undefined
}
