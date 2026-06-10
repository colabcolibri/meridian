import * as vscode from "vscode"

import {
  findKitRoot,
  matchProjectForWorkspacePath,
  resolveMeridianProjects,
} from "./resolve-meridian-projects.js"
import {
  resolveMeridianWorkspaceFromPaths,
  type MeridianWorkspaceInfo,
} from "./meridian-workspace.js"

const WORKSPACE_STATE_KEY = "meridian.activeProjectId"

function workspaceStateKey(kitRoot: string): string {
  return `${WORKSPACE_STATE_KEY}:${kitRoot}`
}

function readConfiguredActiveId(): string | undefined {
  const cfg = vscode.workspace.getConfiguration("meridian").get<string>("activeProject")
  return cfg?.trim() || undefined
}

export async function pickMeridianWorkspace(
  folders: readonly vscode.WorkspaceFolder[],
  extensionContext?: vscode.ExtensionContext,
): Promise<{ folder: vscode.WorkspaceFolder; info: MeridianWorkspaceInfo } | null> {
  for (const folder of folders) {
    const kitRoot = findKitRoot(folder.uri.fsPath)
    if (!kitRoot) {
      continue
    }
    const stored = extensionContext?.workspaceState.get<string>(
      workspaceStateKey(kitRoot),
    )
    let info = resolveMeridianWorkspaceFromPaths(folder.uri.fsPath, stored)
    if (!info) {
      continue
    }

    const needsPicker =
      info.projects.length > 1 &&
      !stored &&
      !readConfiguredActiveId() &&
      !matchProjectForWorkspacePath(
        resolveMeridianProjects(kitRoot),
        kitRoot,
        folder.uri.fsPath,
      )

    if (needsPicker && extensionContext) {
      const picked = await vscode.window.showQuickPick(
        info.projects.map((p) => ({
          label: p.name,
          description: p.docs,
          detail: `${p.usCount} US · ${p.source}`,
          id: p.id,
        })),
        {
          title: "Meridian — select active project",
          placeHolder: "Multiple docs/ folders found — which product?",
        },
      )
      if (!picked) {
        continue
      }
      await extensionContext.workspaceState.update(
        workspaceStateKey(kitRoot),
        picked.id,
      )
      info = resolveMeridianWorkspaceFromPaths(folder.uri.fsPath, picked.id)!
    }

    return { folder, info }
  }
  return null
}

export async function selectActiveMeridianProject(
  extensionContext: vscode.ExtensionContext,
  current: MeridianWorkspaceInfo | null,
): Promise<MeridianWorkspaceInfo | null> {
  if (!current || current.projects.length < 2) {
    void vscode.window.showInformationMessage(
      current?.projects.length === 1
        ? "Meridian: only one project in this workspace."
        : "Meridian: no projects to switch.",
    )
    return current
  }

  const picked = await vscode.window.showQuickPick(
    current.projects.map((p) => ({
      label: p.name,
      description: p.docs,
      detail: p.isActive ? "active" : `${p.usCount} US`,
      id: p.id,
    })),
    { title: "Meridian — active project", placeHolder: current.projectName },
  )
  if (!picked || picked.id === current.projectId) {
    return current
  }

  await extensionContext.workspaceState.update(
    workspaceStateKey(current.projectRoot),
    picked.id,
  )

  const folder = vscode.workspace.workspaceFolders?.[0]
  if (!folder) {
    return current
  }
  return resolveMeridianWorkspaceFromPaths(folder.uri.fsPath, picked.id)
}
