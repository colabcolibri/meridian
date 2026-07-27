import * as path from "node:path"

import * as vscode from "vscode"

import { DocsOpenPanel, emptyPanelHtml, type BuiltHtml } from "./docs-open-panel.js"
import { graphWebviewHtml } from "./graph-webview-html.js"
import type { GraphModel } from "./domain/graph-model.js"
import type { FileTypeLegendEntry } from "./domain/graph-file-type.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import {
  formatImportGraphScopeLabel,
  resolveImportGraphScope,
} from "./resolve-import-graph-scope.js"
import { runImportGraph } from "./run-import-graph.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"

type ImportGraphMessage = { type: "openFile"; path: string } | { type: "selectProject"; id: string }

export class ImportGraphPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.importGraph"
  protected readonly defaultTitle = "Meridian Import Graph"
  protected readonly emptyMessage =
    "Open a Meridian workspace to see the code import graph for the active project."

  private lastError: string | undefined
  private lastModel: GraphModel = { nodes: [], edges: [] }
  private lastMeta = ""
  private lastScope = ""
  private lastLegend: FileTypeLegendEntry[] = []

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

    this.refresh()
  }

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    this.compute(info)
    if (this.lastError) {
      return { html: emptyPanelHtml(this.lastError), title: this.defaultTitle }
    }
    const context = buildWebviewProjectContext(info)
    const webview = this.panel!.webview
    return {
      html: graphWebviewHtml(
        {
          kind: "import",
          title: "Code import graph",
          model: this.lastModel,
          metaLine: this.lastMeta,
          fileTypeLegend: this.lastLegend,
        },
        context,
        { cspSource: webview.cspSource },
      ),
      title: formatMeridianPanelTitle("Import Graph", info, this.lastModel.nodes.length),
    }
  }

  private compute(info: MeridianWorkspaceInfo): void {
    const scope = resolveImportGraphScope(info)
    this.lastScope = scope
    const result = runImportGraph(info.projectRoot, scope)
    if (!result.ok) {
      this.lastError = result.error
      this.lastModel = { nodes: [], edges: [] }
      this.lastMeta = ""
      this.lastLegend = []
      return
    }
    this.lastError = undefined
    this.lastModel = result.model
    this.lastLegend = result.fileTypeLegend
    const label = formatImportGraphScopeLabel(info)
    this.lastMeta = `${label} · ${result.model.nodes.length} files · ${result.model.edges.length} imports`
  }

  private async handleImportMessage(msg: ImportGraphMessage): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    if (msg.type === "openFile") {
      const scope = this.lastScope || resolveImportGraphScope(info)
      const abs = path.isAbsolute(msg.path) ? msg.path : path.join(scope, msg.path)
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
