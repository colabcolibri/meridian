import * as fs from "node:fs"
import * as path from "node:path"

import * as vscode from "vscode"

import { boardKanbanHtml, buildBoardPayload, emptyBoardHtml } from "./board-webview-html.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"
import { loadPlanningPayload } from "./planning-payload.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

type BoardMessage =
  | { type: "openStory"; id: string }
  | { type: "selectProject"; id: string }

/** Kanban in an editor tab (WebviewPanel), not the sidebar. */
export class BoardEditorPanel {
  static readonly viewType = "meridian.board"

  private panel: vscode.WebviewPanel | undefined

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly getWorkspace: () => MeridianWorkspaceInfo | null,
    private readonly onSelectProject?: (id: string) => Promise<void>,
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
      } else if (msg.type === "selectProject") {
        void this.onSelectProject?.(msg.id)
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
    const payload = loadPlanningPayload(info.docsRoot, info.packageRoot)
    const board = buildBoardPayload(payload.stories, payload.epics, payload.versions)
    const viewPayload = {
      ...board,
      context: buildWebviewProjectContext(info),
    }
    this.panel.webview.html = boardKanbanHtml(viewPayload)
    this.panel.title = formatMeridianPanelTitle("Board", info, payload.stories.length)
  }

  private async openStory(id: string): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    const filePath = path.join(info.docsRoot, "us", `${id}.md`)
    if (!fs.existsSync(filePath)) {
      void vscode.window.showInformationMessage(
        `${id} lives in SQLite only. Run: python3 .agent/scripts/meridian_db_cli.py show ${id} --full`,
      )
      return
    }
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
