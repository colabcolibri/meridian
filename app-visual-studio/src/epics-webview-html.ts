import * as crypto from "node:crypto"

import { planningPayloadForListViews, type PlanningPayload } from "./planning-payload.js"
import {
  FILTER_CHIP_SCRIPT,
  PAGINATION_SCRIPT,
  PLANNING_DETAIL_SCRIPT,
  PLANNING_WEBVIEW_STYLES,
  planningWebviewShell,
} from "./webview-common.js"
import {
  PROJECT_CONTEXT_SCRIPT,
  PROJECT_CONTEXT_STYLES,
  projectContextToolbarHtml,
  type WebviewProjectContext,
} from "./webview-project-context.js"

export function epicsWebviewHtml(
  payload: PlanningPayload,
  context: WebviewProjectContext,
): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const dataJson = JSON.stringify(planningPayloadForListViews(payload))
  const contextJson = JSON.stringify(context)
  const body = `
  <div class="toolbar">
    ${projectContextToolbarHtml(context)}
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
    const projectContext = ${contextJson};
    ${PROJECT_CONTEXT_SCRIPT}
    wireProjectContext(projectContext);
    ${FILTER_CHIP_SCRIPT}
    ${PAGINATION_SCRIPT}
    ${PLANNING_DETAIL_SCRIPT}
    const STATE_VERSION = 6;
    const saved = vscode.getState() || {};
    let selectedVersions = new Set(
      saved.stateVersion === STATE_VERSION && saved.selectedVersions
        ? saved.selectedVersions
        : payload.defaultVersions,
    );
    let expanded = new Set(
      saved.stateVersion === STATE_VERSION && saved.expanded
        ? saved.expanded
        : [],
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
          const open = expanded.has(epic.id);
          const epicStories = scoped.filter((s) => s.epic === epic.id);
          const p = progress(epicStories);
          const block = document.createElement("div");
          block.className = "block" + (open ? " open" : "");

          const head = document.createElement("div");
          head.className = "block-head";
          const toggle = () => {
            if (expanded.has(epic.id)) expanded.delete(epic.id);
            else expanded.add(epic.id);
            persist();
            renderList();
          };
          head.append(
            makeAccordionHead(open, toggle),
            makeIdLink(epic.id, () => vscode.postMessage({ type: "openEpic", id: epic.id })),
          );
          const title = document.createElement("span");
          title.className = "row-title";
          title.textContent = epic.title;
          const wrap = document.createElement("div");
          wrap.className = "progress-wrap";
          const bar = document.createElement("div");
          bar.className = "progress-bar";
          const fill = document.createElement("div");
          fill.className = "progress-fill" + (p.pct === 100 ? " done" : "");
          fill.style.width = p.pct + "%";
          bar.appendChild(fill);
          const progText = document.createElement("span");
          progText.className = "progress-text";
          progText.textContent = p.done + "/" + p.total;
          wrap.append(bar, progText);
          head.append(title, makeBadge(epic.status), wrap);
          block.appendChild(head);

          if (open) {
            const bodyEl = document.createElement("div");
            bodyEl.className = "block-body";
            appendDetailLine(bodyEl, "Outcome:", epic.outcome);
            const versionsInFilter = epic.versions.filter((v) => selectedVersions.has(v));
            if (versionsInFilter.length) {
              appendDetailLine(bodyEl, "Versions:", versionsInFilter.join(", "));
            }
            appendProgressBar(bodyEl, p.done, p.total);
            const storiesSection = appendSection(bodyEl, "User stories in selected versions");
            const storyIds = epicStories.map((s) => s.id);
            appendStoryRows(
              storiesSection,
              storyIds,
              payload.stories,
              "No stories for this epic in the selected versions.",
            );
            const hint = document.createElement("p");
            hint.className = "meta-line";
            hint.textContent = "Open epic file for capability, expected outcome, and out of scope.";
            bodyEl.appendChild(hint);
            block.appendChild(bodyEl);
          }
          root.appendChild(block);
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
        expanded: [...expanded],
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
  return planningWebviewShell(nonce, PLANNING_WEBVIEW_STYLES + PROJECT_CONTEXT_STYLES, body, script)
}
