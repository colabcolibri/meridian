import * as vscode from "vscode"

import { helpWebviewHtml } from "./help-webview-html.js"

/** Static help tab — command reference for managers. */
export class HelpEditorPanel {
  static readonly viewType = "meridian.help"

  private panel: vscode.WebviewPanel | undefined

  constructor(private readonly extensionUri: vscode.Uri) {}

  show(column: vscode.ViewColumn = vscode.ViewColumn.One): void {
    if (this.panel) {
      this.panel.reveal(column, true)
      return
    }

    this.panel = vscode.window.createWebviewPanel(
      HelpEditorPanel.viewType,
      "Meridian Help",
      column,
      {
        enableScripts: false,
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri],
      },
    )

    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, "media", "meridian.svg")
    this.panel.webview.html = helpWebviewHtml()
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })
  }
}
