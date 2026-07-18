import * as vscode from "vscode"

import { parseDeliveryRelativePath } from "./delivery-path.js"
import { buildDeliveryViewerHtml, type DeliveryViewerMode } from "./delivery-viewer-html.js"
import { loadDeliveryMarkdownFromSqlite } from "./load-delivery-markdown.js"
import { clearMeridianDeliveryCache } from "./meridian-document-provider.js"
import {
  deliveryEntityLabel,
  parseDeliveryMarkdown,
} from "./parse-delivery-markdown.js"
import { saveDeliveryMarkdownToSqlite } from "./save-delivery-markdown.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

type ViewerMessage =
  | { type: "edit" }
  | { type: "cancel"; dirty: boolean }
  | { type: "save"; markdown: string }

export class DeliveryViewerPanel {
  static readonly viewType = "meridian.delivery"

  private static readonly panels = new Map<string, DeliveryViewerPanel>()

  private panel: vscode.WebviewPanel | undefined
  private savedMarkdown = ""
  private draftMarkdown = ""
  private mode: DeliveryViewerMode = "view"
  private saveError?: string
  private saveOk = false

  private constructor(
    private readonly panelKey: string,
    private readonly extensionUri: vscode.Uri,
    private readonly info: MeridianWorkspaceInfo,
    private readonly relativePath: string,
    private readonly onSaved?: () => void,
  ) {}

  static show(
    extensionUri: vscode.Uri,
    info: MeridianWorkspaceInfo,
    relativePath: string,
    onSaved?: () => void,
  ): void {
    const key = `${info.packageRoot}|${relativePath}`
    const existing = DeliveryViewerPanel.panels.get(key)
    if (existing) {
      existing.reveal()
      return
    }
    const viewer = new DeliveryViewerPanel(key, extensionUri, info, relativePath, onSaved)
    DeliveryViewerPanel.panels.set(key, viewer)
    viewer.create()
  }

  private create(): void {
    const parsed = parseDeliveryRelativePath(this.relativePath)
    if (!parsed) {
      void vscode.window.showErrorMessage(`Meridian: invalid delivery path ${this.relativePath}`)
      return
    }

    const markdown = loadDeliveryMarkdownFromSqlite(this.info.packageRoot, this.relativePath)
    if (!markdown) {
      void vscode.window.showErrorMessage(
        `Meridian: ${this.relativePath} not found in SQLite (.meridian/meridian.db)`,
      )
      DeliveryViewerPanel.panels.delete(this.panelKey)
      return
    }

    this.savedMarkdown = markdown
    this.draftMarkdown = markdown
    this.mode = "view"
    this.saveError = undefined
    this.saveOk = false

    const { frontmatter, body } = parseDeliveryMarkdown(markdown)
    const title = frontmatter.title || frontmatter.id || parsed.id

    this.panel = vscode.window.createWebviewPanel(
      DeliveryViewerPanel.viewType,
      title,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri],
      },
    )

    this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, "media", "meridian-mark.svg")
    this.panel.webview.onDidReceiveMessage((msg: ViewerMessage) => {
      void this.handleMessage(msg)
    })
    this.panel.onDidDispose(() => {
      DeliveryViewerPanel.panels.delete(this.panelKey)
      this.panel = undefined
    })

    this.render()
  }

  private reveal(): void {
    this.panel?.reveal(vscode.ViewColumn.Beside, true)
    this.reloadFromSqlite()
    this.mode = "view"
    this.saveError = undefined
    this.saveOk = false
    this.render()
  }

  private reloadFromSqlite(): void {
    const markdown = loadDeliveryMarkdownFromSqlite(this.info.packageRoot, this.relativePath)
    if (markdown) {
      this.savedMarkdown = markdown
      this.draftMarkdown = markdown
    }
  }

  private render(): void {
    if (!this.panel) {
      return
    }
    const parsed = parseDeliveryRelativePath(this.relativePath)
    if (!parsed) {
      return
    }
    const { frontmatter, body } = parseDeliveryMarkdown(this.savedMarkdown)
    const title = frontmatter.title || frontmatter.id || parsed.id
    this.panel.title = title
    this.panel.webview.html = buildDeliveryViewerHtml({
      relativePath: this.relativePath,
      entityLabel: deliveryEntityLabel(parsed.folder),
      folder: parsed.folder,
      frontmatter,
      bodyMarkdown: body,
      fullMarkdown: this.mode === "edit" ? this.draftMarkdown : this.savedMarkdown,
      mode: this.mode,
      saveError: this.saveError,
      saveOk: this.saveOk,
    })
  }

  private async handleMessage(msg: ViewerMessage): Promise<void> {
    if (msg.type === "edit") {
      this.draftMarkdown = this.savedMarkdown
      this.mode = "edit"
      this.saveError = undefined
      this.saveOk = false
      this.render()
      return
    }

    if (msg.type === "cancel") {
      if (msg.dirty) {
        const choice = await vscode.window.showWarningMessage(
          "Discard unsaved changes?",
          { modal: true },
          "Discard",
        )
        if (choice !== "Discard") {
          return
        }
      }
      this.mode = "view"
      this.draftMarkdown = this.savedMarkdown
      this.saveError = undefined
      this.saveOk = false
      this.render()
      return
    }

    if (msg.type === "save") {
      const result = saveDeliveryMarkdownToSqlite(
        this.info.packageRoot,
        this.relativePath,
        msg.markdown,
      )
      if (!result.ok) {
        this.draftMarkdown = msg.markdown
        this.mode = "edit"
        this.saveError = result.error
        this.saveOk = false
        this.render()
        void vscode.window.showErrorMessage(`Meridian: ${result.error}`)
        return
      }

      clearMeridianDeliveryCache()
      this.reloadFromSqlite()
      this.mode = "view"
      this.saveError = undefined
      this.saveOk = true
      this.render()
      this.onSaved?.()
      void vscode.window.showInformationMessage(`Meridian: saved ${result.id} to SQLite.`)
    }
  }
}
