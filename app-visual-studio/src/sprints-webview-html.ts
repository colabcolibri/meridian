import * as crypto from "node:crypto"

import {
  planningPayloadForListViews,
  type PlanningPayload,
} from "./planning-payload.js"
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

export function sprintsWebviewHtml(
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

    function filteredSprints() {
      if (selectedVersions.size === 0) return [];
      return payload.sprints.filter((s) => selectedVersions.has(s.version));
    }

    function renderToolbar() {
      const items = versionItems();
      const allOn = items.length > 0 && items.every((v) => selectedVersions.has(v.id));
      const noneOn = selectedVersions.size === 0;
      wireAllNone(
        document.getElementById("version-all"),
        document.getElementById("version-none"),
        allOn,
        noneOn,
        false,
        () => { selectedVersions = new Set(items.map((v) => v.id)); currentPage = 1; persist(); renderAll(); },
        () => { selectedVersions = new Set(); currentPage = 1; persist(); renderAll(); },
      );
      renderChipGroup(document.getElementById("version-chips"), items, selectedVersions, false, (id) => {
        if (selectedVersions.has(id)) selectedVersions.delete(id);
        else selectedVersions.add(id);
        currentPage = 1;
        persist();
        renderAll();
      });
      const visible = filteredSprints().length;
      document.getElementById("summary").textContent = noneOn
        ? "0 sprints"
        : visible + " sprint(s)";
    }

    function renderList() {
      const root = document.getElementById("list");
      if (selectedVersions.size === 0) {
        root.innerHTML = '<p class="empty">No versions selected — choose All or pick versions</p>';
        renderPager(document.getElementById("pager"), 0, 1, pageSize, () => {}, () => {});
        return;
      }
      const all = filteredSprints();
      const paged = pageSlice(all, currentPage, pageSize);
      currentPage = paged.page;
      root.innerHTML = "";
      if (!all.length) {
        root.innerHTML = '<p class="empty">No sprints for selected versions</p>';
      } else {
        for (const sp of paged.slice) {
          const open = expanded.has(sp.id);
          const scoped = storiesForIds(sp.storyIds, payload.stories);
          const p = progress(scoped);
          const block = document.createElement("div");
          block.className = "block" + (open ? " open" : "");

          const head = document.createElement("div");
          head.className = "block-head";
          const toggle = () => {
            if (expanded.has(sp.id)) expanded.delete(sp.id);
            else expanded.add(sp.id);
            persist();
            renderList();
          };
          head.append(
            makeAccordionHead(open, toggle),
            makeIdLink(sp.id, () => vscode.postMessage({ type: "openSprint", id: sp.id })),
          );
          const title = document.createElement("span");
          title.className = "row-title";
          title.textContent = sp.title;
          head.append(title, makeBadge(sp.version), makeBadge(sp.status), makeHeadProgress(scoped));
          block.appendChild(head);

          if (open) {
            const bodyEl = document.createElement("div");
            bodyEl.className = "block-body";
            appendDetailLine(bodyEl, "Goal:", sp.goal);
            appendDetailLine(bodyEl, "Done when:", sp.doneWhen);
            appendProgressBar(bodyEl, p.done, p.total);
            const storiesSection = appendSection(bodyEl, "User stories (sprint order = priority)");
            appendStoryRows(
              storiesSection,
              sp.storyIds,
              payload.stories,
              "No stories: in frontmatter — add stories: [US-…] via /plan-sprint",
            );
            const hint = document.createElement("p");
            hint.className = "meta-line";
            hint.textContent = "Open sprint file for scope table and retrospective.";
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
