import * as fs from "node:fs/promises"
import { statSync } from "node:fs"

import * as vscode from "vscode"

import { emptyPanelHtml } from "./docs-open-panel.js"
import {
  kitReferenceLoadingHtml,
  kitReferenceWebviewHtml,
  type KitReferenceIntro,
} from "./kit-reference-webview-html.js"
import { kitReferencePath } from "./kit-references.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

type HtmlCache = { path: string; mtimeMs: number; html: string }

export type KitReferencePanelConfig = {
  viewType: string
  tabTitle: string
  relativeFromAgent: string
  sourceLabel: string
  intro: KitReferenceIntro
  missingKitMessage?: string
}

/** Read-only editor tab for a kit reference under `.agent/references/`. */
export class KitReferenceEditorPanel {
  private panel: vscode.WebviewPanel | undefined
  private htmlCache: HtmlCache | null = null
  private loadGeneration = 0

  constructor(
    private readonly config: KitReferencePanelConfig,
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
      this.config.viewType,
      this.config.tabTitle,
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
    this.panel.webview.html = kitReferenceLoadingHtml()

    const info = this.getWorkspace()
    if (!info) {
      this.panel.webview.html = emptyPanelHtml(
        this.config.missingKitMessage ??
          "Meridian: open a workspace, then Meridian: Install Harness.",
      )
      return
    }

    const filePath = kitReferencePath(info, this.config.relativeFromAgent)

    try {
      const mtimeMs = statSync(filePath).mtimeMs
      if (this.htmlCache?.path === filePath && this.htmlCache.mtimeMs === mtimeMs) {
        if (generation === this.loadGeneration && this.panel) {
          this.panel.webview.html = this.htmlCache.html
          this.panel.title = this.config.tabTitle
        }
        return
      }

      const markdown = await fs.readFile(filePath, "utf8")
      if (generation !== this.loadGeneration || !this.panel) {
        return
      }

      const html = kitReferenceWebviewHtml(
        markdown,
        this.config.sourceLabel,
        this.config.intro,
      )
      this.htmlCache = { path: filePath, mtimeMs, html }
      this.panel.webview.html = html
      this.panel.title = this.config.tabTitle
    } catch {
      if (generation === this.loadGeneration && this.panel) {
        this.panel.webview.html = emptyPanelHtml(
          `Could not read ${this.config.sourceLabel}. Run Meridian: Install Harness first.`,
        )
      }
    }
  }
}
