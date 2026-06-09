import { DocsOpenPanel, type BuiltHtml } from "./docs-open-panel.js"
import { epicsWebviewHtml } from "./epics-webview-html.js"
import { loadPlanningPayload } from "./planning-payload.js"
import { sprintsWebviewHtml } from "./sprints-webview-html.js"
import { versionsWebviewHtml } from "./versions-webview-html.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export class VersionsEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.versions"
  protected readonly defaultTitle = "Meridian Versions"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see versions."

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const payload = loadPlanningPayload(info.docsRoot)
    return {
      html: versionsWebviewHtml(payload),
      title: `Meridian Versions (${payload.versions.length})`,
    }
  }
}

export class SprintsEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.sprints"
  protected readonly defaultTitle = "Meridian Sprints"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see sprints."

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const payload = loadPlanningPayload(info.docsRoot)
    return {
      html: sprintsWebviewHtml(payload),
      title: `Meridian Sprints (${payload.sprints.length})`,
    }
  }
}

export class EpicsEditorPanel extends DocsOpenPanel {
  protected readonly viewType = "meridian.epics"
  protected readonly defaultTitle = "Meridian Epics"
  protected readonly emptyMessage =
    "Open a Meridian workspace with a docs/ folder to see epics."

  protected buildHtml(info: MeridianWorkspaceInfo): BuiltHtml {
    const payload = loadPlanningPayload(info.docsRoot)
    return {
      html: epicsWebviewHtml(payload),
      title: `Meridian Epics (${payload.epics.length})`,
    }
  }
}
