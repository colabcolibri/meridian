import * as path from "node:path"

import * as vscode from "vscode"

import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export type DocsOpenMessage =
  | { type: "openVersion"; id: string }
  | { type: "openEpic"; id: string }
  | { type: "openSprint"; id: string }
  | { type: "selectProject"; id: string }

export type BuiltHtml = { html: string; title: string }

export abstract class DocsOpenPanel {
  protected panel: vscode.WebviewPanel | undefined

  constructor(
    protected readonly extensionUri: vscode.Uri,
    protected readonly getWorkspace: () => MeridianWorkspaceInfo | null,
    protected readonly onSelectProject?: (id: string) => Promise<void>,
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
      await this.openFile(path.join("versions", `${msg.id}.md`))
    } else if (msg.type === "openEpic") {
      await this.openFile(path.join("epics", `${msg.id}.md`))
    } else if (msg.type === "openSprint") {
      await this.openFile(path.join("sprints", `${msg.id}.md`))
    } else if (msg.type === "selectProject") {
      await this.onSelectProject?.(msg.id)
    }
  }

  private async openFile(relativePath: string): Promise<void> {
    const info = this.getWorkspace()
    if (!info?.docsExists) {
      return
    }
    const filePath = path.join(info.docsRoot, relativePath)
    try {
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath))
      await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: false,
      })
    } catch {
      void vscode.window.showErrorMessage(`Meridian: could not open ${relativePath}`)
    }
  }
}

export function emptyPanelHtml(message: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>body{font-family:var(--vscode-font-family);color:var(--vscode-descriptionForeground);
    background:var(--vscode-editor-background);padding:16px;}</style></head>
    <body><p>${message.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p></body></html>`
}
