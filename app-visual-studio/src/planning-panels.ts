import { DocsOpenPanel, emptyPanelHtml, type BuiltHtml } from "./docs-open-panel.js"
import { epicsWebviewHtml } from "./epics-webview-html.js"
import { loadPlanningPayloadDetailed } from "./planning-payload.js"
import { sprintsWebviewHtml } from "./sprints-webview-html.js"
import { versionsWebviewHtml } from "./versions-webview-html.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { buildWebviewProjectContext, formatMeridianPanelTitle } from "./webview-project-context.js"

export class VersionsEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.versions"
  protected readonly defaultTitle = "Meridian Versions"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see versions."

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const loaded = loadPlanningPayloadDetailed(info.docsRoot, info.packageRoot)
    if (!loaded.ok) {
      return { html: emptyPanelHtml(loaded.error), title: this.defaultTitle }
    }
    const context = buildWebviewProjectContext(info)
    return {
      html: versionsWebviewHtml(loaded.payload, context),
      title: formatMeridianPanelTitle("Versions", info, loaded.payload.versions.length),
    }
  }
}

export class SprintsEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.sprints"
  protected readonly defaultTitle = "Meridian Sprints"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see sprints."

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const loaded = loadPlanningPayloadDetailed(info.docsRoot, info.packageRoot)
    if (!loaded.ok) {
      return { html: emptyPanelHtml(loaded.error), title: this.defaultTitle }
    }
    const context = buildWebviewProjectContext(info)
    return {
      html: sprintsWebviewHtml(loaded.payload, context),
      title: formatMeridianPanelTitle("Sprints", info, loaded.payload.sprints.length),
    }
  }
}

export class EpicsEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.epics"
  protected readonly defaultTitle = "Meridian Epics"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see epics."

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const loaded = loadPlanningPayloadDetailed(info.docsRoot, info.packageRoot)
    if (!loaded.ok) {
      return { html: emptyPanelHtml(loaded.error), title: this.defaultTitle }
    }
    const context = buildWebviewProjectContext(info)
    return {
      html: epicsWebviewHtml(loaded.payload, context),
      title: formatMeridianPanelTitle("Epics", info, loaded.payload.epics.length),
    }
  }
}
