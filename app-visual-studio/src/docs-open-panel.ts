import * as vscode from "vscode"

import { openDeliveryDocument } from "./open-delivery-document.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export type DocsOpenMessage =
  | { type: "openVersion"; id: string }
  | { type: "openEpic"; id: string }
  | { type: "openSprint"; id: string }
  | { type: "openStory"; id: string }
  | { type: "selectProject"; id: string }

export type BuiltHtml = { html: string; title: string }

export abstract class DocsOpenPanel {
  protected panel: vscode.WebviewPanel | undefined

  constructor(
    protected readonly extensionUri: vscode.Uri,
    protected readonly getWorkspace: () => MeridianWorkspaceInfo | null,
    protected readonly onSelectProject?: (id: string) => Promise<void>,
    protected readonly onDeliverySaved?: () => void,
  ) {}

  protected abstract readonly viewType: string
  protected abstract readonly defaultTitle: string
  protected abstract readonly emptyMessage: string
  protected abstract buildHtml(info: MeridianWorkspaceInfo): BuiltHtml

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
    this.panel.webview.onDidReceiveMessage((msg: DocsOpenMessage) => {
      void this.handleMessage(msg)
    })
    this.panel.onDidDispose(() => {
      this.panel = undefined
    })

    this.refresh()
  }

  refresh(): void {
    if (!this.panel) {
      return
    }
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      this.panel.webview.html = emptyPanelHtml(this.emptyMessage)
      this.panel.title = this.defaultTitle
      return
    }
    const built = this.buildHtml(info)
    this.panel.webview.html = built.html
    this.panel.title = built.title
  }

  private async handleMessage(msg: DocsOpenMessage): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    if (msg.type === "openVersion") {
      await openDeliveryDocument(
        this.extensionUri,
        info,
        `versions/${msg.id}.md`,
        this.onDeliverySaved,
      )
    } else if (msg.type === "openEpic") {
      await openDeliveryDocument(
        this.extensionUri,
        info,
        `epics/${msg.id}.md`,
        this.onDeliverySaved,
      )
    } else if (msg.type === "openSprint") {
      await openDeliveryDocument(
        this.extensionUri,
        info,
        `sprints/${msg.id}.md`,
        this.onDeliverySaved,
      )
    } else if (msg.type === "openStory") {
      await openDeliveryDocument(
        this.extensionUri,
        info,
        `us/${msg.id}.md`,
        this.onDeliverySaved,
      )
    } else if (msg.type === "selectProject") {
      await this.onSelectProject?.(msg.id)
    }
  }
}

export function emptyPanelHtml(message: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>body{font-family:var(--vscode-font-family);color:var(--vscode-descriptionForeground);
    background:var(--vscode-editor-background);padding:16px;}</style></head>
    <body><p>${message.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p></body></html>`
}
