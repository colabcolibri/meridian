import * as path from "node:path"

import * as vscode from "vscode"

import { architectureDiagramWebviewHtml } from "./architecture-diagram-webview-html.js"
import { DocsOpenPanel, type BuiltHtml } from "./docs-open-panel.js"
import { loadArchitectureDiagramsPayload } from "./load-architecture-diagrams.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { openWorkspaceDoc } from "./open-workspace-doc.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"

export type ArchitectureDiagramMessage =
  | { type: "openDoc"; path: string }
  | { type: "openDiagramSource"; path: string }
  | { type: "selectProject"; id: string }

export class ArchitectureDiagramEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.architectureDiagram"
  protected readonly defaultTitle = "Meridian Architecture"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see architecture diagrams."

  show(column: vscode.ViewColumn = vscode.ViewColumn.One): void {
    if (this.panel) {
      this.panel.reveal(column, true)
      this.refresh()
      return
    }

    this.panel = vscode.window.createWebviewPanel(this.viewType, this.defaultTitle, column, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [this.extensionUri],
    })

    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, "media", "meridian-mark.svg")
    this.panel.webview.onDidReceiveMessage((msg: ArchitectureDiagramMessage) => {
      void this.handleArchitectureMessage(msg)
    })
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })

    this.refresh()
  }

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const payload = loadArchitectureDiagramsPayload(info.docsRoot)
    const context = buildWebviewProjectContext(info)
    const validCount = payload.diagrams.filter((d) => d.mermaid && !d.error).length
    const webview = this.panel!.webview
    const mermaidScriptSrc = webview
      .asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", "mermaid.min.js"))
      .toString()
    return {
      html: architectureDiagramWebviewHtml(payload, context, {
        mermaidScriptSrc,
        cspSource: webview.cspSource,
      }),
      title: formatMeridianPanelTitle("Architecture", info, validCount),
    }
  }

  private async handleArchitectureMessage(msg: ArchitectureDiagramMessage): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    if (msg.type === "openDoc") {
      await openWorkspaceDoc(info, msg.path)
    } else if (msg.type === "openDiagramSource") {
      const filePath = path.join(info.docsRoot, msg.path)
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath))
      await vscode.window.showTextDocument(doc, { preview: false })
    } else if (msg.type === "selectProject") {
      await this.onSelectProject?.(msg.id)
    }
  }
}
