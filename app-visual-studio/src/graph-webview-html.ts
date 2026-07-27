import type { FileTypeLegendEntry } from "./domain/graph-file-type.js"
import type { GraphModel } from "./domain/graph-model.js"
import { DELIVERY_GRAPH_CLIENT } from "./delivery-graph-client.js"
import { FORCE_GRAPH_RUNTIME } from "./force-graph-runtime.js"
import {
  CHIP_STYLES,
  FILTER_SHEET_RUNTIME,
  FILTER_SHEET_STYLES,
  filterSheetHtml,
  filterSheetOpenButtonHtml,
} from "./webview-filter-sheet.js"
import {
  PROJECT_CONTEXT_SCRIPT,
  PROJECT_CONTEXT_STYLES,
  projectContextToolbarHtml,
  type WebviewProjectContext,
} from "./webview-project-context.js"

export type GraphWebviewKind = "delivery" | "import"

export type DeliveryGraphStoryPayload = {
  id: string
  title: string
  version: string
  sprint: string | null
  epic: string
  status: string
  dependsOn: string[]
}

export type DeliveryGraphEpicPayload = {
  id: string
  title: string
}

export type GraphWebviewPayload = {
  kind: GraphWebviewKind
  title: string
  model: GraphModel
  stories?: DeliveryGraphStoryPayload[]
  epics?: DeliveryGraphEpicPayload[]
  versions?: string[]
  defaultVersions?: string[]
  fileTypeLegend?: FileTypeLegendEntry[]
  error?: string
  metaLine?: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const DELIVERY_FILTER_COLUMNS = [
  {
    key: "version",
    label: "Versão",
    listId: "version-chips",
    allId: "version-all",
    noneId: "version-none",
  },
  {
    key: "sprint",
    label: "Sprint",
    listId: "sprint-chips",
    allId: "sprint-all",
    noneId: "sprint-none",
  },
  {
    key: "epic",
    label: "Épico",
    listId: "epic-chips",
    allId: "epic-all",
    noneId: "epic-none",
  },
] as const

export function graphWebviewHtml(
  payload: GraphWebviewPayload,
  context: WebviewProjectContext,
  assets: { cspSource: string },
): string {
  const nonce = Buffer.from(`${payload.kind}-${Date.now()}`).toString("base64url").slice(0, 16)
  const dataJson = JSON.stringify({
    kind: payload.kind,
    model: payload.model,
    stories: payload.stories ?? [],
    epics: payload.epics ?? [],
    versions: payload.versions ?? [],
    defaultVersions: payload.defaultVersions ?? payload.versions ?? [],
    fileTypeLegend: payload.fileTypeLegend ?? [],
  }).replace(/</g, "\\u003c")

  const toolbarExtras =
    payload.kind === "delivery"
      ? filterSheetOpenButtonHtml()
      : `<span class="meta">${escapeHtml(payload.metaLine ?? "")}</span>`

  const filterSheet =
    payload.kind === "delivery" ? filterSheetHtml([...DELIVERY_FILTER_COLUMNS]) : ""

  const deliveryScripts =
    payload.kind === "delivery"
      ? `<script nonce="${nonce}">${FILTER_SHEET_RUNTIME}</script>
         <script nonce="${nonce}">${FORCE_GRAPH_RUNTIME}</script>
         <script nonce="${nonce}">${DELIVERY_GRAPH_CLIENT}</script>`
      : `<script nonce="${nonce}">${FORCE_GRAPH_RUNTIME}</script>`

  const errorHtml = payload.error
    ? `<p class="error">${escapeHtml(payload.error)}</p>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${assets.cspSource} 'unsafe-inline'; script-src ${assets.cspSource} 'nonce-${nonce}';"/>
  <style>
    ${PROJECT_CONTEXT_STYLES}
    ${CHIP_STYLES}
    ${payload.kind === "delivery" ? FILTER_SHEET_STYLES : ""}
    :root {
      --fg-node: #2dd4bf;
      --fg-edge: #64748b;
      --fg-grid: #334155;
      --fg-label: var(--vscode-foreground);
      --fg-highlight: #f8fafc;
      --fg-done: #4ade80;
      --fg-partial: #fbbf24;
      --fg-muted: #94a3b8;
      --fg-frozen: #67e8f9;
      --fg-deprecated: #f87171;
    }
    * { box-sizing: border-box; }
    html, body { margin:0; height:100%; overflow:hidden; }
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      display: flex;
      flex-direction: column;
    }
    .toolbar {
      flex-shrink: 0;
      padding: 8px 12px;
      border-bottom: 1px solid var(--vscode-panel-border);
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      background: var(--vscode-sideBar-background);
      z-index: 2;
    }
    .toolbar-title { font-weight: 600; font-size: 12px; }
    .toolbar-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      min-width: 0;
      flex: 1;
      justify-content: flex-end;
    }
    .btn {
      font: inherit;
      padding: 2px 10px;
      border: 1px solid var(--vscode-panel-border);
      background: var(--vscode-button-secondaryBackground, var(--vscode-editor-background));
      color: inherit;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn:hover { background: var(--vscode-list-hoverBackground); }
    .meta { font-size: 12px; color: var(--vscode-descriptionForeground); max-width: min(48vw, 420px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .error { color: var(--vscode-errorForeground); padding: 12px; }
    .graph-stage {
      position: relative;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.04), transparent 55%),
        var(--vscode-editor-background);
    }
    #forceGraph {
      display: block;
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
    }
    .graph-hud {
      position: absolute;
      left: 12px;
      bottom: 12px;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      pointer-events: none;
    }
    .graph-hud .btn { pointer-events: auto; font-size: 11px; }
    .graph-hint {
      position: absolute;
      right: 12px;
      bottom: 12px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      opacity: 0.85;
      pointer-events: none;
    }
    .empty-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vscode-descriptionForeground);
      font-size: 13px;
      pointer-events: none;
    }
    .empty-overlay[hidden] { display: none; }
  </style>
</head>
<body>
  ${projectContextToolbarHtml(context)}
  <div class="toolbar">
    <span class="toolbar-title">${escapeHtml(payload.title)}</span>
    <div class="toolbar-actions">${toolbarExtras}</div>
  </div>
  ${errorHtml}
  <div class="graph-stage">
    <canvas id="forceGraph" aria-label="Force-directed graph"></canvas>
    <div class="empty-overlay"${payload.model.nodes.length === 0 ? "" : " hidden"}>Nenhuma US neste filtro — abra Filtros e escolha versões, sprints ou épicos.</div>
    <div class="graph-hud">
      <span id="graphStats">0 nodes · 0 links</span>
      <button type="button" id="fitView" class="btn">Fit</button>
      <button type="button" id="resetSim" class="btn">Re-layout</button>
    </div>
    <div class="graph-hint">Pan · zoom · duplo clique no nó para abrir</div>
  </div>
  ${filterSheet}
  <script nonce="${nonce}">
    window.__MERIDIAN_VSCODE__ = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : null;
    window.__GRAPH_PAYLOAD__ = ${dataJson};
  </script>
  <script nonce="${nonce}">${PROJECT_CONTEXT_SCRIPT}</script>
  ${deliveryScripts}
</body>
</html>`
}
