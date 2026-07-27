import type { GraphModel } from "./domain/graph-model.js"
import { toMermaidFlowchart } from "./domain/graph-model.js"
import { meridianMermaidThemeScriptBody } from "./meridian-mermaid/theme.js"
import {
  PROJECT_CONTEXT_SCRIPT,
  PROJECT_CONTEXT_STYLES,
  projectContextToolbarHtml,
  type WebviewProjectContext,
} from "./webview-project-context.js"

export type GraphWebviewKind = "delivery" | "import"

export type GraphWebviewPayload = {
  kind: GraphWebviewKind
  title: string
  model: GraphModel
  versions?: string[]
  sprints?: string[]
  initialVersion?: string
  initialSprint?: string
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

export function graphWebviewHtml(
  payload: GraphWebviewPayload,
  context: WebviewProjectContext,
  assets: { mermaidScriptSrc: string; cspSource: string },
): string {
  const mermaid = toMermaidFlowchart(payload.model, "LR")
  const nonce = Buffer.from(`${payload.kind}-${Date.now()}`).toString("base64url").slice(0, 16)
  const dataJson = JSON.stringify({
    kind: payload.kind,
    model: payload.model,
    versions: payload.versions ?? [],
    sprints: payload.sprints ?? [],
    initialVersion: payload.initialVersion ?? "All",
    initialSprint: payload.initialSprint ?? "All",
    mermaid,
  }).replace(/</g, "\\u003c")

  const versionOptions = ["All", ...(payload.versions ?? [])]
    .map(
      (v) =>
        `<option value="${escapeHtml(v)}"${v === (payload.initialVersion ?? "All") ? " selected" : ""}>${escapeHtml(v)}</option>`,
    )
    .join("")
  const sprintOptions = ["All", ...(payload.sprints ?? [])]
    .map(
      (s) =>
        `<option value="${escapeHtml(s)}"${s === (payload.initialSprint ?? "All") ? " selected" : ""}>${escapeHtml(s)}</option>`,
    )
    .join("")

  const filtersHtml =
    payload.kind === "delivery"
      ? `<label>Version <select id="versionFilter">${versionOptions}</select></label>
         <label>Sprint <select id="sprintFilter">${sprintOptions}</select></label>
         <button type="button" id="applyFilters">Apply filters</button>`
      : `<span class="meta">${escapeHtml(payload.metaLine ?? "")}</span>
         <button type="button" id="pickScope">Change scope</button>`

  const errorHtml = payload.error
    ? `<p class="error">${escapeHtml(payload.error)}</p>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${assets.cspSource} data:; style-src ${assets.cspSource} 'unsafe-inline'; script-src ${assets.cspSource} 'nonce-${nonce}';"/>
  <style>
    ${PROJECT_CONTEXT_STYLES}
    body { margin:0; font-family:var(--vscode-font-family); color:var(--vscode-foreground);
      background:var(--vscode-editor-background); display:flex; flex-direction:column; height:100vh; overflow:hidden; }
    .toolbar { flex-shrink:0; padding:8px 12px; border-bottom:1px solid var(--vscode-panel-border);
      display:flex; flex-wrap:wrap; gap:8px; align-items:center; background:var(--vscode-sideBar-background); }
    .toolbar label { display:flex; gap:4px; align-items:center; font-size:12px; }
    select, button { font:inherit; }
    .meta { font-size:12px; color:var(--vscode-descriptionForeground); }
    .error { color:var(--vscode-errorForeground); padding:12px; }
    .canvas-wrap { flex:1; min-height:0; overflow:auto; padding:12px; }
    .hint { font-size:11px; color:var(--vscode-descriptionForeground); padding:0 12px 8px; }
    .node-list { font-size:12px; padding:0 12px 12px; max-height:160px; overflow:auto; border-top:1px solid var(--vscode-panel-border); }
    .node-list button { display:block; width:100%; text-align:left; margin:2px 0; background:transparent;
      border:1px solid var(--vscode-panel-border); color:inherit; padding:4px 8px; cursor:pointer; border-radius:4px; }
    .node-list button:hover { background:var(--vscode-list-hoverBackground); }
  </style>
</head>
<body>
  ${projectContextToolbarHtml(context)}
  <div class="toolbar">
    <strong>${escapeHtml(payload.title)}</strong>
    ${filtersHtml}
  </div>
  ${errorHtml}
  <p class="hint">Click a node id below to open it. Graph uses Mermaid flowchart from the current model.</p>
  <div class="canvas-wrap"><div id="diagram" class="mermaid">${escapeHtml(mermaid)}</div></div>
  <div class="node-list" id="nodeList"></div>
  <script nonce="${nonce}">window.__GRAPH_PAYLOAD__ = ${dataJson};</script>
  <script nonce="${nonce}">${PROJECT_CONTEXT_SCRIPT}</script>
  <script nonce="${nonce}">${meridianMermaidThemeScriptBody}</script>
  <script src="${assets.mermaidScriptSrc}"></script>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const payload = window.__GRAPH_PAYLOAD__;
    const list = document.getElementById("nodeList");
    function renderNodeList(model) {
      list.innerHTML = "";
      for (const n of model.nodes) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = n.id + " — " + n.label;
        btn.onclick = () => {
          if (payload.kind === "delivery") {
            vscode.postMessage({ type: "openStory", id: n.id });
          } else {
            vscode.postMessage({ type: "openFile", path: n.id });
          }
        };
        list.appendChild(btn);
      }
    }
    renderNodeList(payload.model);
    async function renderMermaid() {
      if (typeof mermaid === "undefined") return;
      mermaid.initialize(meridianMermaidTheme());
      const el = document.getElementById("diagram");
      try {
        const { svg } = await mermaid.render("g" + Date.now(), payload.mermaid);
        el.innerHTML = svg;
      } catch (err) {
        el.textContent = "Mermaid render failed: " + String(err);
      }
    }
    renderMermaid();
    const apply = document.getElementById("applyFilters");
    if (apply) {
      apply.onclick = () => {
        vscode.postMessage({
          type: "applyFilters",
          version: document.getElementById("versionFilter").value,
          sprint: document.getElementById("sprintFilter").value,
        });
      };
    }
    const pick = document.getElementById("pickScope");
    if (pick) {
      pick.onclick = () => vscode.postMessage({ type: "pickScope" });
    }
  </script>
</body>
</html>`
}
