import * as vscode from "vscode"

import { MERIDIAN_COMMAND_CATALOG } from "./command-catalog.js"

export type CommandTreeItem = {
  kind: "command"
  id: string
  label: string
  description?: string
  commandId: string
  icon?: string
}

export type CategoryTreeItem = {
  kind: "category"
  id: string
  label: string
  children: CommandTreeItem[]
}

export type MeridianTreeItem = CategoryTreeItem | CommandTreeItem

const PINNED_IDS = new Set([
  "guide-how-to",
  "guide-extension-commands",
  "guide-start-here",
  "guide-usage",
  "agents-help",
  "install-kit",
  "upgrade-kit",
])

const CATEGORY_ORDER: { id: string; label: string; groups: string[] }[] = [
  {
    id: "cat-guides",
    label: "Guides — read first",
    groups: ["guides"],
  },
  {
    id: "cat-views",
    label: "Views",
    groups: ["views"],
  },
  {
    id: "cat-governance",
    label: "Governance",
    groups: ["governance"],
  },
  {
    id: "cat-kit",
    label: "Kit setup",
    groups: ["kit"],
  },
]

function catalogToCommandItem(
  c: (typeof MERIDIAN_COMMAND_CATALOG)[number],
): CommandTreeItem {
  return {
    kind: "command",
    id: c.id,
    label: c.title,
    description: c.summary,
    commandId: c.commandId,
    icon: c.icon,
  }
}

const CATEGORIES: CategoryTreeItem[] = CATEGORY_ORDER.map((cat) => ({
  kind: "category" as const,
  id: cat.id,
  label: cat.label,
  children: MERIDIAN_COMMAND_CATALOG.filter(
    (c) =>
      cat.groups.includes(c.group) &&
      c.id !== "deliverables" &&
      (cat.id !== "cat-guides" || PINNED_IDS.has(c.id)),
  ).map(catalogToCommandItem),
})).filter((cat) => cat.children.length > 0)

export class MeridianCommandsProvider implements vscode.TreeDataProvider<MeridianTreeItem> {
  static readonly viewId = "meridian.commands"

  private readonly emitter = new vscode.EventEmitter<void>()

  readonly onDidChangeTreeData = this.emitter.event

  refresh(): void {
    this.emitter.fire()
  }

  getTreeItem(element: MeridianTreeItem): vscode.TreeItem {
    if (element.kind === "category") {
      const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.Expanded)
      item.id = element.id
      item.contextValue = "meridianCategory"
      return item
    }

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
      element.id === "guide-how-to"
        ? "How extension + chat slash commands fit together"
        : `${element.label} — ${element.commandId}`
    return item
  }

  getChildren(element?: MeridianTreeItem): MeridianTreeItem[] {
    if (!element) {
      return CATEGORIES
    }
    if (element.kind === "category") {
      return element.children
    }
    return []
  }
}
