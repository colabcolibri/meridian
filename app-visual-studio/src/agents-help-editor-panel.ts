import * as fs from "node:fs/promises"
import { statSync } from "node:fs"

import * as vscode from "vscode"

import {
  agentsHelpLoadingHtml,
  agentsHelpWebviewHtml,
} from "./agents-help-webview-html.js"
import { emptyPanelHtml } from "./docs-open-panel.js"
import { KIT_REFERENCES, kitReferencePath } from "./kit-references.js"

type HtmlCache = { path: string; mtimeMs: number; html: string }

/** Help tab — agents & slash commands from kit references/agents-help.md */
export class AgentsHelpEditorPanel {
  static readonly viewType = "meridian.agentsHelp"

  private panel: vscode.WebviewPanel | undefined
  private htmlCache: HtmlCache | null = null
  private loadGeneration = 0

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly getWorkspace: () => MeridianWorkspaceInfo | null,
  ) {}

  show(column: vscode.ViewColumn = vscode.ViewColumn.One): void {
    if (this.panel) {
      this.panel.reveal(column, true)
      void this.refresh()
      return
    }

    this.panel = vscode.window.createWebviewPanel(
      AgentsHelpEditorPanel.viewType,
      "Meridian Agents Help",
      column,
      {
        enableScripts: false,
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri],
      },
    )

    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, "media", "meridian-mark.svg")
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })

    void this.refresh()
  }

  async refresh(): Promise<void> {
    if (!this.panel) {
      return
    }

    const generation = ++this.loadGeneration
    this.panel.webview.html = agentsHelpLoadingHtml()

    const info = this.getWorkspace()
    if (!info) {
      this.panel.webview.html = emptyPanelHtml(
        "Meridian: open a workspace with .agent/MERIDIAN.md.",
      )
      return
    }

    const filePath = kitReferencePath(info, KIT_REFERENCES.agentsHelp)
    const sourceLabel = ".agent/references/agents-help.md"

    try {
      const mtimeMs = statSync(filePath).mtimeMs
      if (
        this.htmlCache?.path === filePath &&
        this.htmlCache.mtimeMs === mtimeMs
      ) {
        if (generation === this.loadGeneration && this.panel) {
          this.panel.webview.html = this.htmlCache.html
          this.panel.title = "Meridian Agents Help"
        }
        return
      }

      const markdown = await fs.readFile(filePath, "utf8")
      if (generation !== this.loadGeneration || !this.panel) {
        return
      }

      const html = agentsHelpWebviewHtml(markdown, sourceLabel)
      this.htmlCache = { path: filePath, mtimeMs, html }
      this.panel.webview.html = html
      this.panel.title = "Meridian Agents Help"
    } catch {
      if (generation === this.loadGeneration && this.panel) {
        this.panel.webview.html = emptyPanelHtml(
          `Could not read ${sourceLabel} at project root.`,
        )
      }
    }
  }
}
