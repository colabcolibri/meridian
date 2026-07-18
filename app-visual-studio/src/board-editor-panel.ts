import * as vscode from "vscode"

import { boardKanbanHtml, buildBoardPayload, emptyBoardHtml } from "./board-webview-html.js"
import { openDeliveryDocument } from "./open-delivery-document.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"
import { loadPlanningPayloadDetailed } from "./planning-payload.js"
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
    private readonly onDeliverySaved?: () => void,
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
    const loaded = loadPlanningPayloadDetailed(info.docsRoot, info.packageRoot)
    if (!loaded.ok) {
      this.panel.webview.html = emptyBoardHtml(loaded.error)
      this.panel.title = "Meridian Board"
      return
    }
    const board = buildBoardPayload(
      loaded.payload.stories,
      loaded.payload.epics,
      loaded.payload.versions,
    )
    if (board.defaultVersions.length === 0) {
      this.panel.webview.html = emptyBoardHtml(
        "Meridian: SQLite returned stories but no matching versions. Check meridian.db integrity.",
      )
      this.panel.title = "Meridian Board"
      return
    }
    const viewPayload = {
      ...board,
      context: buildWebviewProjectContext(info),
    }
    this.panel.webview.html = boardKanbanHtml(viewPayload)
    this.panel.title = formatMeridianPanelTitle("Board", info, loaded.payload.stories.length)
  }

  private async openStory(id: string): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    await openDeliveryDocument(
      this.extensionUri,
      info,
      `us/${id}.md`,
      this.onDeliverySaved,
    )
  }
}
