import * as vscode from "vscode"

import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { buildWelcomeChecklist, welcomeWebviewHtml } from "./welcome-webview-html.js"

/** First-value onboarding tab — checklist, not a second orchestration engine. */
export class WelcomeEditorPanel {
  static readonly viewType = "meridian.welcome"

  private panel: vscode.WebviewPanel | undefined

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly getWorkspace: () => MeridianWorkspaceInfo | null,
  ) {}

  show(column: vscode.ViewColumn = vscode.ViewColumn.One): void {
    if (this.panel) {
      this.panel.reveal(column, true)
      this.render()
      return
    }

    this.panel = vscode.window.createWebviewPanel(
      WelcomeEditorPanel.viewType,
      "Meridian — welcome",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri],
      },
    )

    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, "media", "meridian-mark.svg")
    this.panel.webview.onDidReceiveMessage((msg: { type?: string; commandId?: string }) => {
      if (msg.type === "runCommand" && msg.commandId) {
        void vscode.commands.executeCommand(msg.commandId)
      }
    })
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })
    this.render()
  }

  refresh(): void {
    this.render()
  }

  private render(): void {
    if (!this.panel) {
      return
    }
    const info = this.getWorkspace()
    const label = info?.projectName ?? info?.projectRoot ?? "No folder open"
    const items = buildWelcomeChecklist(info)
    this.panel.webview.html = welcomeWebviewHtml(items, label)
  }
}
