import * as path from "node:path"

import * as vscode from "vscode"

import { boardKanbanHtml, buildBoardPayload, emptyBoardHtml } from "./board-webview-html.js"
import { loadEpicSummaries } from "./load-epics.js"
import { loadUserStoriesFromDocs } from "./load-stories.js"
import { loadVersionSummaries } from "./load-versions.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

type BoardMessage = { type: "openStory"; id: string }

/** Kanban in an editor tab (WebviewPanel), not the sidebar. */
export class BoardEditorPanel {
  static readonly viewType = "meridian.board"

  private panel: vscode.WebviewPanel | undefined

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly getWorkspace: () => MeridianWorkspaceInfo | null,
  ) {}

  show(column: vscode.ViewColumn = vscode.ViewColumn.One): void {
    if (this.panel) {
      this.panel.reveal(column, true)
      this.refresh()
      return
    }

    this.panel = vscode.window.createWebviewPanel(
      BoardEditorPanel.viewType,
      "Meridian Board",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri],
      },
    )

    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, "media", "meridian-mark.svg")
    this.panel.webview.onDidReceiveMessage((msg: BoardMessage) => {
      if (msg.type === "openStory") {
        void this.openStory(msg.id)
      }
    })
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })

    this.refresh()
  }

  refresh(): void {
    if (!this.panel) {
      return
    }
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      this.panel.webview.html = emptyBoardHtml(
        "Open a Meridian workspace with a docs/ folder to see the board.",
      )
      this.panel.title = "Meridian Board"
      return
    }
    const stories = loadUserStoriesFromDocs(info.docsRoot)
    const epics = loadEpicSummaries(info.docsRoot)
    const versions = loadVersionSummaries(info.docsRoot)
    const payload = buildBoardPayload(stories, epics, versions)
    this.panel.webview.html = boardKanbanHtml(payload)
    this.panel.title = `Meridian Board (${stories.length})`
  }

  private async openStory(id: string): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    const filePath = path.join(info.docsRoot, "us", `${id}.md`)
    try {
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath))
      await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: false,
      })
    } catch {
      void vscode.window.showErrorMessage(`Meridian: could not open ${id}.md`)
    }
  }
}
