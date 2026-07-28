import * as fs from "node:fs"
import * as path from "node:path"

import * as vscode from "vscode"

import { fileEventTouchesArchitectureDiagrams, fileEventTouchesMeridianDb } from "./docs-board-sync.js"
import { clearMeridianDeliveryCache } from "./meridian-document-provider.js"
import {
  pickMeridianWorkspace,
  selectActiveMeridianProject,
  switchActiveMeridianProjectById,
} from "./meridian-workspace-picker.js"
import {
  countUserStoriesInDocs,
  formatStatusTooltip,
  type MeridianWorkspaceInfo,
} from "./meridian-workspace.js"

export type MeridianContextState = {
  info: MeridianWorkspaceInfo | null
}

const BOARD_SYNC_DEBOUNCE_MS = 400

export class MeridianContext {
  private statusItem: vscode.StatusBarItem | undefined
  private state: MeridianContextState = { info: null }
  private lastWarnedDocsRoot: string | null = null
  private docsWatcher: vscode.FileSystemWatcher | undefined
  private boardSyncTimer: ReturnType<typeof setTimeout> | undefined

  constructor(
    private readonly extensionContext: vscode.ExtensionContext,
    private readonly output?: vscode.OutputChannel,
    private readonly onWorkspaceChanged?: () => void,
  ) {}

  get workspace(): MeridianWorkspaceInfo | null {
    return this.state.info
  }

  get isReady(): boolean {
    return this.state.info?.docsExists === true
  }

  get extensionPath(): string {
    return this.extensionContext.extensionPath
  }

  async refresh(): Promise<void> {
    const folders = vscode.workspace.workspaceFolders ?? []
    const picked = await pickMeridianWorkspace(folders, this.extensionContext)
    this.state.info = picked?.info ?? null
    await this.applyContextKeys()
    this.updateStatusBar()
    this.logState("refresh")
    this.resetDocsWatcher()
    this.onWorkspaceChanged?.()
    if (picked?.info && !picked.info.docsExists) {
      if (this.lastWarnedDocsRoot !== picked.info.docsRoot) {
        this.lastWarnedDocsRoot = picked.info.docsRoot
        void vscode.window.showWarningMessage(
          `Meridian: kit detected but docs/ is missing at ${picked.info.docsRoot}`,
        )
      }
    } else {
      this.lastWarnedDocsRoot = null
    }
  }

  async selectActiveProject(): Promise<void> {
    const next = await selectActiveMeridianProject(
      this.extensionContext,
      this.state.info,
    )
    if (next) {
      this.applyActiveProject(next)
    }
  }

  async selectActiveProjectById(id: string): Promise<void> {
    const current = this.state.info
    if (!current) {
      return
    }
    const next = await switchActiveMeridianProjectById(
      this.extensionContext,
      current,
      id,
    )
    if (next) {
      this.applyActiveProject(next)
    }
  }

  private applyActiveProject(next: MeridianWorkspaceInfo): void {
    if (next.projectId === this.state.info?.projectId) {
      return
    }
    this.state.info = next
    this.updateStatusBar()
    this.resetDocsWatcher()
    this.onWorkspaceChanged?.()
    const active = next.projects.find((p) => p.isActive)
    void vscode.window.showInformationMessage(
      `Meridian: active project — ${next.projectName} (${active?.docs ?? next.docsRoot})`,
    )
  }

  async requireReady(commandLabel: string): Promise<MeridianWorkspaceInfo | null> {
    await this.refresh()
    if (!this.state.info) {
      void vscode.window.showErrorMessage(
        `Meridian: ${commandLabel} — open a workspace with .agent/MERIDIAN.md (kit) and a docs/ folder.`,
      )
      return null
    }
    if (!this.state.info.docsExists) {
      void vscode.window.showErrorMessage(
        `Meridian: ${commandLabel} — docs/ not found at ${this.state.info.docsRoot}.`,
      )
      return null
    }
    return this.state.info
  }

  dispose(): void {
    this.clearBoardSyncTimer()
    this.statusItem?.dispose()
    this.docsWatcher?.dispose()
  }

  registerListeners(): void {
    this.extensionContext.subscriptions.push(
      vscode.workspace.onDidChangeWorkspaceFolders(() => void this.refresh()),
      vscode.workspace.onDidRenameFiles((e) => this.onWorkspaceFileEvent(e.files)),
      vscode.workspace.onDidCreateFiles((e) =>
        this.onWorkspaceFileEvent(e.files.map((uri) => ({ newUri: uri }))),
      ),
      vscode.workspace.onDidDeleteFiles((e) =>
        this.onWorkspaceFileEvent(e.files.map((uri) => ({ oldUri: uri }))),
      ),
    )
  }

  private onWorkspaceFileEvent(
    files: readonly { readonly oldUri?: vscode.Uri; readonly newUri?: vscode.Uri }[],
  ): void {
    const info = this.state.info
    if (!info) {
      return
    }
    if (fileEventTouchesMeridianDb(info.packageRoot, files)) {
      this.schedulePlanningRefresh()
      return
    }
    if (info.docsExists && fileEventTouchesArchitectureDiagrams(info.docsRoot, files)) {
      this.onWorkspaceChanged?.()
    }
  }

  private resetDocsWatcher(): void {
    this.docsWatcher?.dispose()
    this.docsWatcher = undefined
    const info = this.state.info
    if (!info) {
      return
    }
    const dbPath = path.join(info.packageRoot, ".meridian", "meridian.db")
    if (!fs.existsSync(dbPath)) {
      return
    }
    const meridianDir = path.dirname(dbPath)
    const dbPattern = new vscode.RelativePattern(vscode.Uri.file(meridianDir), "meridian.db")
    this.docsWatcher = vscode.workspace.createFileSystemWatcher(dbPattern)
    const bumpDb = () => {
      clearMeridianDeliveryCache()
      this.schedulePlanningRefresh()
    }
    this.docsWatcher.onDidChange(bumpDb)
    this.docsWatcher.onDidCreate(bumpDb)
    this.docsWatcher.onDidDelete(bumpDb)
  }

  private schedulePlanningRefresh(): void {
    this.clearBoardSyncTimer()
    this.boardSyncTimer = setTimeout(() => {
      this.boardSyncTimer = undefined
      void this.refreshPlanningPanels()
    }, BOARD_SYNC_DEBOUNCE_MS)
  }

  private clearBoardSyncTimer(): void {
    if (this.boardSyncTimer !== undefined) {
      clearTimeout(this.boardSyncTimer)
      this.boardSyncTimer = undefined
    }
  }

  /** Reload planning panels and US count when meridian.db changes. */
  private async refreshPlanningPanels(): Promise<void> {
    const info = this.state.info
    if (!info?.docsExists) {
      return
    }
    info.usCount = countUserStoriesInDocs(info.docsRoot)
    this.updateStatusBar()
    this.logState("board-sync")
    this.onWorkspaceChanged?.()
  }

  private async applyContextKeys(): Promise<void> {
    const active = this.state.info !== null
    const ready = this.state.info?.docsExists === true
    await vscode.commands.executeCommand("setContext", "meridian.isActive", active)
    await vscode.commands.executeCommand("setContext", "meridian.isReady", ready)
  }

  private logState(kind: "refresh" | "board-sync"): void {
    if (!this.output) {
      return
    }
    const info = this.state.info
    if (!info) {
      this.output.appendLine(
        `[${kind}] No Meridian workspace in ${vscode.workspace.workspaceFolders?.map((f) => f.uri.fsPath).join(", ") ?? "(none)"}`,
      )
      return
    }
    this.output.appendLine(`[${kind}] ${formatStatusTooltip(info).replace(/\n/g, " · ")}`)
  }

  private updateStatusBar(): void {
    if (!this.statusItem) {
      this.statusItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100,
      )
      this.extensionContext.subscriptions.push(this.statusItem)
    }

    const info = this.state.info
    const folder = vscode.workspace.workspaceFolders?.[0]

    if (!folder) {
      this.statusItem.command = undefined
      this.statusItem.text = "Meridian: no folder"
      this.statusItem.tooltip = "Open a workspace folder to install the Meridian harness"
      this.statusItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      )
      this.statusItem.show()
      return
    }

    if (!info) {
      this.statusItem.command = "meridian.installKit"
      this.statusItem.text = "Meridian: install harness"
      this.statusItem.tooltip =
        "Install bundled Meridian kit (.agent/ — agents, skills, workflows) into this workspace"
      this.statusItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      )
      this.statusItem.show()
      return
    }

    this.statusItem.backgroundColor = undefined
    this.statusItem.command =
      info.projects.length > 1 ? "meridian.selectActiveProject" : undefined
    const projectLabel =
      info.projects.length > 1 ? `${info.projectName} · ` : ""
    this.statusItem.text = info.docsExists
      ? `Meridian: ${projectLabel}${info.usCount} US`
      : "Meridian: no docs"
    this.statusItem.tooltip = formatStatusTooltip(info)
    this.statusItem.show()
  }
}
