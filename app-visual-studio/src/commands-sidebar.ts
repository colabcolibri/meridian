import * as vscode from "vscode"

export type CommandTreeItem = {
  id: string
  label: string
  description?: string
  commandId: string
  icon?: string
}

const ROOT_ITEMS: CommandTreeItem[] = [
  {
    id: "board",
    label: "Open Board",
    description: "Kanban — version/epic filters, empty columns",
    commandId: "meridian.openBoard",
    icon: "$(kanban)",
  },
  {
    id: "versions",
    label: "Open Versions",
    description: "All releases — no filter",
    commandId: "meridian.openVersions",
    icon: "$(versions)",
  },
  {
    id: "sprints",
    label: "Open Sprints",
    description: "Sprints — filter by version",
    commandId: "meridian.openSprints",
    icon: "$(run-all)",
  },
  {
    id: "epics",
    label: "Open Epics",
    description: "Epics — filter by version and epic",
    commandId: "meridian.openEpics",
    icon: "$(layers)",
  },
  {
    id: "validate",
    label: "Validate project",
    description: "Run validate_meridian.py → Output",
    commandId: "meridian.validateProject",
    icon: "$(checklist)",
  },
  {
    id: "sync",
    label: "Sync board",
    description: "Regenerate docs/kanban/board.json from US",
    commandId: "meridian.syncBoard",
    icon: "$(sync)",
  },
  {
    id: "status",
    label: "Workspace status",
    description: "Kit path, docs, US count",
    commandId: "meridian.showStatus",
    icon: "$(info)",
  },
  {
    id: "new-us",
    label: "New user story",
    description: "Output — coming in v5",
    commandId: "meridian.newUserStory",
    icon: "$(add)",
  },
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
    item.tooltip = `${element.label} — same as Command Palette (⇧⌘P)`
    return item
  }

  getChildren(): CommandTreeItem[] {
    return ROOT_ITEMS
  }
}
