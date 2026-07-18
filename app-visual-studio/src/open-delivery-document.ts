import * as vscode from "vscode"

import { DeliveryViewerPanel } from "./delivery-viewer-panel.js"
import { sqliteDbExists } from "./load-from-sqlite.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export async function openDeliveryDocument(
  extensionUri: vscode.Uri,
  info: MeridianWorkspaceInfo,
  relativePath: string,
  onSaved?: () => void,
): Promise<void> {
  const normalized = relativePath.replace(/\\/g, "/")

  if (!sqliteDbExists(info.packageRoot)) {
    void vscode.window.showErrorMessage(
      `Meridian: .meridian/meridian.db not found under ${info.packageRoot}`,
    )
    return
  }

  DeliveryViewerPanel.show(extensionUri, info, normalized, onSaved)
}
