import * as fs from "node:fs"
import * as path from "node:path"

import * as vscode from "vscode"

import { DocsOpenPanel, emptyPanelHtml, type BuiltHtml } from "./docs-open-panel.js"
import { graphWebviewHtml } from "./graph-webview-html.js"
import type { GraphModel } from "./domain/graph-model.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { runImportGraph } from "./run-import-graph.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"

type ImportGraphMessage =
  | { type: "openFile"; path: string }
  | { type: "selectProject"; id: string }
  | { type: "pickScope" }

export class ImportGraphPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.importGraph"
  protected readonly defaultTitle = "Meridian Import Graph"
  protected readonly emptyMessage =
    "Open a Meridian workspace to compute a scoped code import graph."

  private scopeRelative: string | undefined
  private lastError: string | undefined
  private lastModel: GraphModel = { nodes: [], edges: [] }
  private lastMeta = ""

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
    this.panel.webview.onDidReceiveMessage((msg: ImportGraphMessage) => {
      void this.handleImportMessage(msg)
    })
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })

    void this.ensureScopeThenRefresh()
  }

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    if (this.lastError) {
      return { html: emptyPanelHtml(this.lastError), title: this.defaultTitle }
    }
    const context = buildWebviewProjectContext(info)
    const webview = this.panel!.webview
    const mermaidScriptSrc = webview
      .asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", "mermaid.min.js"))
      .toString()
    return {
      html: graphWebviewHtml(
        {
          kind: "import",
          title: "Code import graph",
          model: this.lastModel,
          metaLine: this.lastMeta,
        },
        context,
        { mermaidScriptSrc, cspSource: webview.cspSource },
      ),
      title: formatMeridianPanelTitle("Import Graph", info, this.lastModel.nodes.length),
    }
  }

  private async ensureScopeThenRefresh(): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      this.refresh()
      return
    }
    if (!this.scopeRelative) {
      const defaultScope = path.join(info.packageRoot, "app-visual-studio")
      const uri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri: vscode.Uri.file(
          fs.existsSync(defaultScope) ? defaultScope : info.packageRoot,
        ),
        openLabel: "Scan folder for imports",
      })
      if (!uri?.[0]) {
        this.lastError = "No scope selected — use Change scope to pick a package folder."
        this.refresh()
        return
      }
      this.scopeRelative = uri[0].fsPath
    }
    this.compute(info)
    this.refresh()
  }

  private compute(info: MeridianWorkspaceInfo): void {
    const scope = this.scopeRelative ?? path.join(info.packageRoot, "app-visual-studio")
    const result = runImportGraph(info.packageRoot, scope)
    if (!result.ok) {
      this.lastError = result.error
      this.lastModel = { nodes: [], edges: [] }
      this.lastMeta = ""
      return
    }
    this.lastError = undefined
    this.lastModel = result.model
    this.lastMeta = result.metaLine
  }

  private async handleImportMessage(msg: ImportGraphMessage): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    if (msg.type === "pickScope") {
      this.scopeRelative = undefined
      await this.ensureScopeThenRefresh()
      return
    }
    if (msg.type === "openFile") {
      const abs = path.isAbsolute(msg.path)
        ? msg.path
        : path.join(this.scopeRelative ?? info.packageRoot, msg.path)
      try {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(abs))
        await vscode.window.showTextDocument(doc, { preview: false })
      } catch (err) {
        void vscode.window.showErrorMessage(
          `Could not open ${abs}: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
      return
    }
    if (msg.type === "selectProject") {
      await this.onSelectProject?.(msg.id)
    }
  }
}
