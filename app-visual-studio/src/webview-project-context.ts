import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export type WebviewProjectEntry = {
  id: string
  name: string
  docs: string
  usCount: number
  isActive: boolean
}

export type WebviewProjectContext = {
  projectId: string
  projectName: string
  docsPath: string
  usCount: number
  multiProject: boolean
  projects: WebviewProjectEntry[]
}

export function buildWebviewProjectContext(info: MeridianWorkspaceInfo): WebviewProjectContext {
  const active = info.projects.find((p) => p.isActive) ?? info.projects[0]
  const docsPath = active?.docs ?? "docs"
  return {
    projectId: info.projectId,
    projectName: info.projectName,
    docsPath,
    usCount: info.usCount,
    multiProject: info.projects.length > 1,
    projects: info.projects.map((p) => ({
      id: p.id,
      name: p.name,
      docs: p.docs,
      usCount: p.usCount,
      isActive: p.isActive,
    })),
  }
}

export type MeridianPanelKind = "Board" | "Versions" | "Sprints" | "Epics" | "Architecture" | "Decisions"

export function formatMeridianPanelTitle(
  kind: MeridianPanelKind,
  info: MeridianWorkspaceInfo,
  count?: number,
): string {
  const suffix = count !== undefined ? ` (${count})` : ""
  const ctx = buildWebviewProjectContext(info)
  const label = ctx.multiProject ? ctx.projectName : ctx.docsPath
  return `${kind} — ${label}${suffix}`
}

export const PROJECT_CONTEXT_STYLES = `
    .project-row { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 8px; margin-bottom: 2px; }
    .project-select {
      font: inherit;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
      max-width: 200px;
    }
    .project-name {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 0;
    }
    .project-path {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
`

export function projectContextToolbarHtml(context: WebviewProjectContext): string {
  const picker = context.multiProject
    ? `<select class="project-select" id="project-select" title="Active Meridian product"></select>`
    : `<span class="project-name" id="project-name"></span>`
  return `
  <div class="toolbar-row project-row">
    <span class="toolbar-label">Project</span>
    ${picker}
    <span class="project-path" id="project-path" title="docs/ path"></span>
    <span class="count" id="project-us"></span>
  </div>`
}

export const PROJECT_CONTEXT_SCRIPT = `
    function wireProjectContext(ctx) {
      const pathEl = document.getElementById("project-path");
      const usEl = document.getElementById("project-us");
      if (pathEl) {
        pathEl.textContent = ctx.docsPath;
        pathEl.title = ctx.docsPath;
      }
      if (usEl) {
        usEl.textContent = ctx.usCount + " US";
      }
      const sel = document.getElementById("project-select");
      if (sel && ctx.multiProject) {
        sel.innerHTML = "";
        for (const p of ctx.projects) {
          const opt = document.createElement("option");
          opt.value = p.id;
          opt.textContent = p.name + " (" + p.docs + ")";
          if (p.isActive) opt.selected = true;
          sel.appendChild(opt);
        }
        sel.onchange = () => {
          if (sel.value && sel.value !== ctx.projectId) {
            vscode.postMessage({ type: "selectProject", id: sel.value });
          }
        };
        return;
      }
      const nameEl = document.getElementById("project-name");
      if (nameEl) {
        nameEl.textContent = ctx.projectName;
        nameEl.title = ctx.docsPath;
      }
    }
`
