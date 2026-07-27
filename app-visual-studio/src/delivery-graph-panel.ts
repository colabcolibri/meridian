import * as vscode from "vscode"

import { DocsOpenPanel, emptyPanelHtml, type BuiltHtml } from "./docs-open-panel.js"
import { buildDeliveryGraph, listDeliveryFilterOptions } from "./load-delivery-graph.js"
import { graphWebviewHtml } from "./graph-webview-html.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { loadPlanningPayloadDetailed } from "./planning-payload.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"

type DeliveryGraphMessage =
  | { type: "openStory"; id: string }
  | { type: "selectProject"; id: string }
  | { type: "applyFilters"; version: string; sprint: string }

export class DeliveryGraphPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.deliveryGraph"
  protected readonly defaultTitle = "Meridian Delivery Graph"
  protected readonly emptyMessage =
    "Open a Meridian workspace with SQLite delivery to see the US dependency graph."

  private filterVersion = "All"
  private filterSprint = "All"

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
    this.panel.webview.onDidReceiveMessage((msg: DeliveryGraphMessage) => {
      void this.handleDeliveryMessage(msg)
    })
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })

    this.refresh()
  }

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const loaded = loadPlanningPayloadDetailed(info.docsRoot, info.packageRoot)
    if (!loaded.ok) {
      return { html: emptyPanelHtml(loaded.error), title: this.defaultTitle }
    }
    const { versions, sprints } = listDeliveryFilterOptions(loaded.payload.stories)
    const activeVersion =
      loaded.payload.versions.find((v) => v.status === "active")?.id ??
      this.filterVersion
    if (this.filterVersion === "All" && activeVersion && activeVersion !== "All") {
      this.filterVersion = activeVersion
    }
    const model = buildDeliveryGraph(loaded.payload.stories, {
      version: this.filterVersion,
      sprint: this.filterSprint,
    })
    const context = buildWebviewProjectContext(info)
    const webview = this.panel!.webview
    const mermaidScriptSrc = webview
      .asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", "mermaid.min.js"))
      .toString()
    return {
      html: graphWebviewHtml(
        {
          kind: "delivery",
          title: "Delivery dependency graph",
          model,
          versions,
          sprints,
          initialVersion: this.filterVersion,
          initialSprint: this.filterSprint,
        },
        context,
        { mermaidScriptSrc, cspSource: webview.cspSource },
      ),
      title: formatMeridianPanelTitle("Delivery Graph", info, model.nodes.length),
    }
  }

  private async handleDeliveryMessage(msg: DeliveryGraphMessage): Promise<void> {
    if (msg.type === "applyFilters") {
      this.filterVersion = msg.version || "All"
      this.filterSprint = msg.sprint || "All"
      this.refresh()
      return
    }
    if (msg.type === "openStory") {
      const info = this.getWorkspace()
      if (!info?.docsExists) {
        return
      }
      const { openDeliveryDocument } = await import("./open-delivery-document.js")
      await openDeliveryDocument(
        this.extensionUri,
        info,
        `us/${msg.id}.md`,
        this.onDeliverySaved,
      )
      return
    }
    if (msg.type === "selectProject") {
      await this.onSelectProject?.(msg.id)
    }
  }
}
