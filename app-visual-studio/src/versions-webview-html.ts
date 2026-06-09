import * as crypto from "node:crypto"

import { planningPayloadForVersionsView, type PlanningPayload } from "./planning-payload.js"
import {
  FILTER_CHIP_SCRIPT,
  PAGINATION_SCRIPT,
  PLANNING_WEBVIEW_STYLES,
  planningWebviewShell,
} from "./webview-common.js"

export function versionsWebviewHtml(payload: PlanningPayload): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const sorted = planningPayloadForVersionsView(payload)
  const dataJson = JSON.stringify(sorted)
  const body = `
  <div class="main" id="list"></div>
  <div class="pager" id="pager"></div>`
  const script = `
    const vscode = acquireVsCodeApi();
    const payload = ${dataJson};
    ${FILTER_CHIP_SCRIPT}
    ${PAGINATION_SCRIPT}
    const STATE_VERSION = 5;
    const saved = vscode.getState() || {};
    let expanded = new Set(
      saved.stateVersion === STATE_VERSION && saved.expanded
        ? saved.expanded
        : payload.versions.slice(0, 1).map((v) => v.id),
    );
    let pageSize = saved.stateVersion === STATE_VERSION
      ? normalizePageSize(saved.pageSize)
      : DEFAULT_PAGE_SIZE;
    let currentPage = saved.stateVersion === STATE_VERSION && saved.currentPage
      ? saved.currentPage
      : 1;

    function persist() {
      vscode.setState({
        stateVersion: STATE_VERSION,
        expanded: [...expanded],
        pageSize,
        currentPage,
      });
    }

    function renderList() {
      const root = document.getElementById("list");
      const all = payload.versions;
      const paged = pageSlice(all, currentPage, pageSize);
      currentPage = paged.page;
      root.innerHTML = "";
      for (const version of paged.slice) {
        const open = expanded.has(version.id);
        const scoped = payload.stories.filter((s) => s.version === version.id);
        const p = progress(scoped);
        const block = document.createElement("div");
        block.className = "block" + (open ? " open" : "");

        const head = document.createElement("div");
        head.className = "block-head";
        const acc = document.createElement("button");
        acc.type = "button";
        acc.className = "acc-btn";
        acc.textContent = open ? "▼" : "▶";
        acc.onclick = () => {
          if (expanded.has(version.id)) expanded.delete(version.id);
          else expanded.add(version.id);
          persist();
          renderList();
        };
        const idBtn = document.createElement("button");
        idBtn.type = "button";
        idBtn.className = "link-btn row-id";
        idBtn.textContent = version.id;
        idBtn.onclick = () => vscode.postMessage({ type: "openVersion", id: version.id });
        const title = document.createElement("span");
        title.className = "row-title";
        title.textContent = version.title;
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = version.status;
        const prog = document.createElement("span");
        prog.className = "progress-text";
        prog.textContent = p.done + "/" + p.total;
        head.append(acc, idBtn, title, badge, prog);
        block.appendChild(head);

        if (open) {
          const bodyEl = document.createElement("div");
          bodyEl.className = "block-body";
          const sprintCount = payload.sprints.filter((s) => s.version === version.id).length;
          const epicIds = new Set(scoped.map((s) => s.epic));
          bodyEl.innerHTML =
            '<p class="meta-line">' +
            sprintCount +
            " sprint(s) · " +
            epicIds.size +
            " epic(s) with stories</p>" +
            '<p class="meta-line">Open the version file for full release notes.</p>';
          block.appendChild(bodyEl);
        }
        root.appendChild(block);
      }
      currentPage = renderPager(
        document.getElementById("pager"),
        all.length,
        currentPage,
        pageSize,
        (p) => { currentPage = p; persist(); renderList(); },
        (size) => { pageSize = size; currentPage = 1; persist(); renderList(); },
      );
    }
    renderList();
  `
  return planningWebviewShell(nonce, PLANNING_WEBVIEW_STYLES, body, script)
}
