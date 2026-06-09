import * as vscode from "vscode"

import { MERIDIAN_COMMAND_CATALOG } from "./command-catalog.js"

export type CommandTreeItem = {
  id: string
  label: string
  description?: string
  commandId: string
  icon?: string
}

const ROOT_ITEMS: CommandTreeItem[] = [
  {
    id: "help",
    label: "Command help",
    description: "Extension commands (Board, Validate…)",
    commandId: "meridian.openHelp",
    icon: "$(question)",
  },
  {
    id: "agents-help",
    label: "Agents & commands",
    description: "Kit groups, steps, and slash commands",
    commandId: "meridian.openAgentsHelp",
    icon: "$(book)",
  },
  ...MERIDIAN_COMMAND_CATALOG.filter(
    (c) => c.id !== "deliverables" && c.id !== "agents-help",
  ).map((c) => ({
    id: c.id,
    label: c.title,
    description: c.summary,
    commandId: c.commandId,
    icon: c.icon,
  })),
]

export class MeridianCommandsProvider implements vscode.TreeDataProvider<CommandTreeItem> {
  static readonly viewId = "meridian.commands"

  private readonly emitter = new vscode.EventEmitter<void>()

  readonly onDidChangeTreeData = this.emitter.event

  refresh(): void {
    this.emitter.fire()
  }

  getTreeItem(element: CommandTreeItem): vscode.TreeItem {
    const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None)
    item.description = element.description
    if (element.icon?.startsWith("$(")) {
      item.iconPath = new vscode.ThemeIcon(element.icon.slice(2, -1))
    }
    item.command = {
      command: element.commandId,
      title: element.label,
    }
    item.tooltip =
      element.id === "help"
        ? "Extension command reference (webview tab)"
        : element.id === "agents-help"
          ? "Kit agents-help.md in a webview tab (same pattern as Command help)"
          : `${element.label} — Command Palette: ${element.commandId}`
    return item
  }

  getChildren(): CommandTreeItem[] {
    return ROOT_ITEMS
  }
}
