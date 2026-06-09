import * as crypto from "node:crypto"

import { planningPayloadForListViews, type PlanningPayload } from "./planning-payload.js"
import {
  FILTER_CHIP_SCRIPT,
  PAGINATION_SCRIPT,
  PLANNING_WEBVIEW_STYLES,
  planningWebviewShell,
} from "./webview-common.js"

export function epicsWebviewHtml(payload: PlanningPayload): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const dataJson = JSON.stringify(planningPayloadForListViews(payload))
  const body = `
  <div class="toolbar">
    <div class="toolbar-row">
      <span class="toolbar-label">Version</span>
      <button type="button" class="chip" id="version-all">All</button>
      <button type="button" class="chip" id="version-none">None</button>
      <div id="version-chips" class="chip-group"></div>
      <span class="count" id="summary"></span>
    </div>
  </div>
  <div class="main" id="list"></div>
  <div class="pager" id="pager"></div>`
  const script = `
    const vscode = acquireVsCodeApi();
    const payload = ${dataJson};
    ${FILTER_CHIP_SCRIPT}
    ${PAGINATION_SCRIPT}
    const STATE_VERSION = 5;
    const saved = vscode.getState() || {};
    let selectedVersions = new Set(
      saved.stateVersion === STATE_VERSION && saved.selectedVersions
        ? saved.selectedVersions
        : payload.defaultVersions,
    );
    let pageSize = saved.stateVersion === STATE_VERSION
      ? normalizePageSize(saved.pageSize)
      : DEFAULT_PAGE_SIZE;
    let currentPage = saved.stateVersion === STATE_VERSION && saved.currentPage
      ? saved.currentPage
      : 1;

    function versionItems() {
      return payload.versions.map((v) => ({
        id: v.id,
        label: v.id,
        title: (selectedVersions.has(v.id) ? "Hide" : "Show") + " " + v.id + " — " + v.title,
      }));
    }

    function storiesInVersions() {
      if (selectedVersions.size === 0) return [];
      return payload.stories.filter((s) => selectedVersions.has(s.version));
    }

    function epicsInScope(scoped) {
      const ids = new Set(scoped.map((s) => s.epic));
      return payload.epics.filter((e) => ids.has(e.id));
    }

    function filteredEpics() {
      const scoped = storiesInVersions();
      const inScope = new Set(epicsInScope(scoped).map((e) => e.id));
      return payload.epics.filter((e) => inScope.has(e.id));
    }

    function renderToolbar() {
      const vItems = versionItems();
      const noVer = selectedVersions.size === 0;
      const allVer = vItems.length > 0 && vItems.every((v) => selectedVersions.has(v.id));
      wireAllNone(
        document.getElementById("version-all"),
        document.getElementById("version-none"),
        allVer,
        noVer,
        false,
        () => { selectedVersions = new Set(vItems.map((v) => v.id)); currentPage = 1; persist(); renderAll(); },
        () => { selectedVersions = new Set(); currentPage = 1; persist(); renderAll(); },
      );
      renderChipGroup(document.getElementById("version-chips"), vItems, selectedVersions, false, (id) => {
        if (selectedVersions.has(id)) selectedVersions.delete(id);
        else selectedVersions.add(id);
        currentPage = 1;
        persist();
        renderAll();
      });

      const scoped = storiesInVersions();
      const epics = epicsInScope(scoped);
      document.getElementById("summary").textContent =
        noVer ? "0 epics" : epics.length + " epic(s) · " + scoped.length + " stories";
    }

    function renderList() {
      const root = document.getElementById("list");
      if (selectedVersions.size === 0) {
        root.innerHTML = '<p class="empty">No versions selected</p>';
        renderPager(document.getElementById("pager"), 0, 1, pageSize, () => {}, () => {});
        return;
      }
      const scoped = storiesInVersions();
      const all = filteredEpics();
      const paged = pageSlice(all, currentPage, pageSize);
      currentPage = paged.page;
      root.innerHTML = "";
      if (!all.length) {
        root.innerHTML = '<p class="empty">No epics for selected versions</p>';
      } else {
        for (const epic of paged.slice) {
          const epicStories = scoped.filter((s) => s.epic === epic.id);
          const p = progress(epicStories);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "row-btn";
          btn.innerHTML =
            '<span class="row-id">' + esc(epic.id) + '</span>' +
            '<span class="row-title">' + esc(epic.title) + '</span>' +
            '<div class="progress-wrap"><div class="progress-bar"><div class="progress-fill' +
            (p.pct === 100 ? " done" : "") + '" style="width:' + p.pct + '%"></div></div>' +
            '<span class="progress-text">' + p.done + "/" + p.total + "</span></div>";
          btn.onclick = () => vscode.postMessage({ type: "openEpic", id: epic.id });
          root.appendChild(btn);
        }
      }
      currentPage = renderPager(
        document.getElementById("pager"),
        all.length,
        currentPage,
        pageSize,
        (p) => { currentPage = p; persist(); renderList(); },
        (size) => { pageSize = size; currentPage = 1; persist(); renderAll(); },
      );
    }

    function persist() {
      vscode.setState({
        stateVersion: STATE_VERSION,
        selectedVersions: [...selectedVersions],
        pageSize,
        currentPage,
      });
    }
    function renderAll() {
      renderToolbar();
      renderList();
    }
    renderAll();
  `
  return planningWebviewShell(nonce, PLANNING_WEBVIEW_STYLES, body, script)
}
