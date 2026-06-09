import * as vscode from "vscode"

import { fileEventTouchesBoardSync, isBoardSyncDocsPath } from "./docs-board-sync.js"
import {
  countUserStoriesInDocs,
  formatStatusTooltip,
  pickMeridianWorkspace,
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

  async refresh(): Promise<void> {
    const folders = vscode.workspace.workspaceFolders ?? []
    const picked = await pickMeridianWorkspace(folders)
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
      vscode.workspace.onDidCreateFiles((e) => this.onWorkspaceFileEvent(e.files)),
      vscode.workspace.onDidDeleteFiles((e) => this.onWorkspaceFileEvent(e.files)),
    )
  }

  private onWorkspaceFileEvent(
    files: readonly { readonly oldUri?: vscode.Uri; readonly newUri?: vscode.Uri }[],
  ): void {
    const docsRoot = this.state.info?.docsRoot
    if (!docsRoot || !fileEventTouchesBoardSync(docsRoot, files)) {
      return
    }
    this.scheduleBoardSync()
  }

  private resetDocsWatcher(): void {
    this.docsWatcher?.dispose()
    this.docsWatcher = undefined
    const docsRoot = this.state.info?.docsRoot
    if (!docsRoot) {
      return
    }
    const pattern = new vscode.RelativePattern(
      vscode.Uri.file(docsRoot),
      "{us/*.md,kanban/board.json,versions/*.md,epics/*.md,sprints/*.md}",
    )
    this.docsWatcher = vscode.workspace.createFileSystemWatcher(pattern)
    const bump = (uri: vscode.Uri) => {
      if (!isBoardSyncDocsPath(docsRoot, uri.fsPath)) {
        return
      }
      this.scheduleBoardSync()
    }
    this.docsWatcher.onDidChange(bump)
    this.docsWatcher.onDidCreate(bump)
    this.docsWatcher.onDidDelete(bump)
  }

  private scheduleBoardSync(): void {
    this.clearBoardSyncTimer()
    this.boardSyncTimer = setTimeout(() => {
      this.boardSyncTimer = undefined
      void this.syncBoardFromDocs()
    }, BOARD_SYNC_DEBOUNCE_MS)
  }

  private clearBoardSyncTimer(): void {
    if (this.boardSyncTimer !== undefined) {
      clearTimeout(this.boardSyncTimer)
      this.boardSyncTimer = undefined
    }
  }

  /** Reload board UI and US count — without re-picking workspace or resetting watchers. */
  private async syncBoardFromDocs(): Promise<void> {
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
      this.statusItem.command = undefined
      this.extensionContext.subscriptions.push(this.statusItem)
    }

    const info = this.state.info
    if (!info) {
      this.statusItem.text = "Meridian: off"
      this.statusItem.tooltip = "Not a Meridian workspace (.agent/MERIDIAN.md not found)"
      this.statusItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      )
      this.statusItem.show()
      return
    }

    this.statusItem.backgroundColor = undefined
    this.statusItem.text = info.docsExists
      ? `Meridian: ${info.usCount} US`
      : "Meridian: no docs"
    this.statusItem.tooltip = formatStatusTooltip(info)
    this.statusItem.show()
  }
}
