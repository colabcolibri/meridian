import * as vscode from "vscode"

import { buildDeliveryFormHtml } from "./delivery-form-html.js"
import { parseDeliveryRelativePath } from "./delivery-path.js"
import { buildDeliveryViewerHtml } from "./delivery-viewer-html.js"
import type { DeliveryFormPayload } from "./delivery-form-schema.js"
import { deliveryEntityLabel, parseDeliveryMarkdown } from "./parse-delivery-markdown.js"
import { loadDeliveryMarkdownFromSqlite } from "./load-delivery-markdown.js"
import {
  loadDeliveryFormFromSqlite,
  saveDeliveryFormToSqlite,
} from "./load-delivery-form.js"
import { clearMeridianDeliveryCache } from "./meridian-document-provider.js"
import { saveDeliveryMarkdownToSqlite } from "./save-delivery-markdown.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

type ViewerMessage =
  | { type: "edit" }
  | { type: "view" }
  | { type: "saveForm"; payload: DeliveryFormPayload }
  | { type: "saveRaw"; markdown: string }
  | { type: "toggleAdvanced" }

export class DeliveryViewerPanel {
  static readonly viewType = "meridian.delivery"

  private static readonly panels = new Map<string, DeliveryViewerPanel>()

  private panel: vscode.WebviewPanel | undefined
  private savedMarkdown = ""
  private formState: DeliveryFormPayload | null = null
  private formLoadError: string | undefined
  private mode: "view" | "form" = "view"
  private showAdvanced = false
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

  private extensionPath(): string {
    return this.extensionUri.fsPath
  }

  private loadFormState(): void {
    const loaded = loadDeliveryFormFromSqlite(
      this.info.packageRoot,
      this.relativePath,
      this.extensionPath(),
    )
    if (loaded.ok) {
      this.formState = loaded.payload
      this.formLoadError = undefined
    } else {
      this.formState = null
      this.formLoadError = loaded.error
    }
  }

  private create(): void {
    const parsed = parseDeliveryRelativePath(this.relativePath)
    if (!parsed) {
      void vscode.window.showErrorMessage(`Meridian: invalid delivery path ${this.relativePath}`)
      return
    }

    const markdown = loadDeliveryMarkdownFromSqlite(
      this.info.packageRoot,
      this.relativePath,
      this.extensionPath(),
    )
    if (!markdown) {
      void vscode.window.showErrorMessage(
        `Meridian: ${this.relativePath} not found in SQLite (.meridian/meridian.db)`,
      )
      DeliveryViewerPanel.panels.delete(this.panelKey)
      return
    }

    this.savedMarkdown = markdown
    this.loadFormState()
    this.mode = "view"
    this.showAdvanced = false
    this.saveError = undefined
    this.saveOk = false

    const { frontmatter } = parseDeliveryMarkdown(markdown)
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
    this.showAdvanced = false
    this.saveError = undefined
    this.saveOk = false
    this.render()
  }

  private reloadFromSqlite(): void {
    const markdown = loadDeliveryMarkdownFromSqlite(
      this.info.packageRoot,
      this.relativePath,
      this.extensionPath(),
    )
    if (markdown) {
      this.savedMarkdown = markdown
    }
    this.loadFormState()
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
    const displayFrontmatter = { ...frontmatter }
    if (
      parsed.folder === "us" &&
      this.formState?.frontmatter.sprint &&
      !displayFrontmatter.sprint
    ) {
      displayFrontmatter.sprint = this.formState.frontmatter.sprint
    }
    const title = displayFrontmatter.title || displayFrontmatter.id || parsed.id
    this.panel.title = title

    if (this.mode === "form" && this.formState) {
      this.panel.webview.html = buildDeliveryFormHtml({
        relativePath: this.relativePath,
        entityLabel: deliveryEntityLabel(parsed.folder),
        folder: parsed.folder,
        form: this.formState,
        saveError: this.saveError,
        saveOk: this.saveOk,
        showAdvanced: this.showAdvanced,
        rawMarkdown: this.savedMarkdown,
      })
      return
    }

    this.panel.webview.html = buildDeliveryViewerHtml({
      relativePath: this.relativePath,
      entityLabel: deliveryEntityLabel(parsed.folder),
      folder: parsed.folder,
      frontmatter: displayFrontmatter,
      bodyMarkdown: body,
      saveError: this.saveError,
      saveOk: this.saveOk,
    })
  }

  private async handleMessage(msg: ViewerMessage): Promise<void> {
    if (msg.type === "edit") {
      this.loadFormState()
      if (!this.formState) {
        void vscode.window.showErrorMessage(
          `Meridian: could not load structured form — ${this.formLoadError ?? "unknown error"}`,
        )
        return
      }
      this.mode = "form"
      this.saveError = undefined
      this.saveOk = false
      this.render()
      return
    }

    if (msg.type === "view") {
      this.mode = "view"
      this.saveError = undefined
      this.saveOk = false
      this.render()
      return
    }

    if (msg.type === "toggleAdvanced") {
      this.showAdvanced = !this.showAdvanced
      this.render()
      return
    }

    if (msg.type === "saveForm") {
      const result = saveDeliveryFormToSqlite(
        this.info.packageRoot,
        this.relativePath,
        msg.payload,
        this.extensionPath(),
      )
      if (!result.ok) {
        this.formState = msg.payload
        this.saveError = result.error
        this.saveOk = false
        this.render()
        void vscode.window.showErrorMessage(`Meridian: ${result.error}`)
        return
      }
      this.afterSave(result.id)
      return
    }

    if (msg.type === "saveRaw") {
      const confirm = await vscode.window.showWarningMessage(
        "Save raw markdown? This bypasses form validation.",
        { modal: true },
        "Save raw",
      )
      if (confirm !== "Save raw") {
        return
      }
      const result = saveDeliveryMarkdownToSqlite(
        this.info.packageRoot,
        this.relativePath,
        msg.markdown,
        this.extensionPath(),
      )
      if (!result.ok) {
        this.saveError = result.error
        this.saveOk = false
        this.render()
        void vscode.window.showErrorMessage(`Meridian: ${result.error}`)
        return
      }
      this.afterSave(result.id)
    }
  }

  private afterSave(id: string): void {
    clearMeridianDeliveryCache()
    this.reloadFromSqlite()
    this.mode = "view"
    this.showAdvanced = false
    this.saveError = undefined
    this.saveOk = true
    this.render()
    this.onSaved?.()
    void vscode.window.showInformationMessage(`Meridian: saved ${id} to SQLite.`)
  }
}
