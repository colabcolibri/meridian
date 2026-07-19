import * as crypto from "node:crypto"

import type { DecisionsPayload } from "./load-decisions.js"
import {
  PAGINATION_SCRIPT,
  PLANNING_WEBVIEW_STYLES,
  planningWebviewShell,
} from "./webview-common.js"
import {
  PROJECT_CONTEXT_SCRIPT,
  PROJECT_CONTEXT_STYLES,
  projectContextToolbarHtml,
  type WebviewProjectContext,
} from "./webview-project-context.js"

const DECISIONS_WEBVIEW_STYLES = `
    .entry {
      border-top: 1px solid var(--vscode-panel-border);
      padding: 10px 0;
    }
    .entry:first-child { border-top: none; padding-top: 4px; }
    .entry-head {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 6px;
    }
    .entry-time {
      font-size: 11px;
      font-weight: 600;
      color: var(--vscode-descriptionForeground);
      min-width: 40px;
    }
    .entry-title {
      flex: 1;
      font-size: 12px;
      font-weight: 600;
      min-width: 0;
    }
    .doc-link {
      font-size: 11px;
      padding: 0;
      border: none;
      background: none;
      color: var(--vscode-textLink-foreground);
      cursor: pointer;
      text-align: left;
      word-break: break-all;
    }
    .doc-link:hover { text-decoration: underline; }
    .empty-state {
      padding: 24px 12px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
      line-height: 1.5;
    }
`

export function decisionsWebviewHtml(
  payload: DecisionsPayload,
  context: WebviewProjectContext,
): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const dataJson = JSON.stringify(payload)
  const contextJson = JSON.stringify(context)
  const body = `
  <div class="toolbar">
    ${projectContextToolbarHtml(context)}
    <div class="toolbar-row">
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
    ${PAGINATION_SCRIPT}
    const STATE_VERSION = 1;
    const saved = vscode.getState() || {};
    let expanded = new Set(
      saved.stateVersion === STATE_VERSION && saved.expanded
        ? saved.expanded
        : payload.dates.slice(0, 1).map((d) => d.date),
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

    function appendField(parent, label, value) {
      if (!value) return;
      const line = document.createElement("p");
      line.className = "detail-line";
      const lbl = document.createElement("span");
      lbl.className = "detail-label";
      lbl.textContent = label;
      line.append(lbl, document.createTextNode(value));
      parent.appendChild(line);
    }

    function renderList() {
      const root = document.getElementById("list");
      const summary = document.getElementById("summary");
      const all = payload.dates;
      summary.textContent =
        payload.totalEntries +
        " decision(s) across " +
        all.length +
        " day(s) — read-only; use /update-decisions-log to append.";

      if (!all.length) {
        root.innerHTML =
          '<div class="empty-state">No decisions in SQLite yet.<br/>Use <strong>/update-decisions-log</strong> in chat to record scope or architecture changes.</div>';
        document.getElementById("pager").innerHTML = "";
        return;
      }

      const paged = pageSlice(all, currentPage, pageSize);
      currentPage = paged.page;
      root.innerHTML = "";

      for (const day of paged.slice) {
        const open = expanded.has(day.date);
        const block = document.createElement("div");
        block.className = "block" + (open ? " open" : "");

        const head = document.createElement("div");
        head.className = "block-head";
        const toggle = () => {
          if (expanded.has(day.date)) expanded.delete(day.date);
          else expanded.add(day.date);
          persist();
          renderList();
        };
        const acc = document.createElement("button");
        acc.type = "button";
        acc.className = "acc-btn";
        acc.setAttribute("aria-expanded", open ? "true" : "false");
        acc.textContent = open ? "▼" : "▶";
        acc.addEventListener("click", toggle);
        head.appendChild(acc);

        const dateLabel = document.createElement("span");
        dateLabel.className = "row-id";
        dateLabel.style.cursor = "pointer";
        dateLabel.textContent = day.date;
        dateLabel.addEventListener("click", toggle);
        head.appendChild(dateLabel);

        const countBadge = document.createElement("span");
        countBadge.className = "badge";
        countBadge.textContent = day.count + " entr" + (day.count === 1 ? "y" : "ies");
        head.appendChild(countBadge);
        block.appendChild(head);

        if (open) {
          const bodyEl = document.createElement("div");
          bodyEl.className = "block-body";
          for (const entry of day.entries) {
            const entryEl = document.createElement("div");
            entryEl.className = "entry";

            const entryHead = document.createElement("div");
            entryHead.className = "entry-head";
            const time = document.createElement("span");
            time.className = "entry-time";
            time.textContent = entry.time || "—";
            entryHead.appendChild(time);
            const title = document.createElement("span");
            title.className = "entry-title";
            title.textContent = entry.title || "(untitled)";
            entryHead.appendChild(title);
            entryEl.appendChild(entryHead);

            if (entry.affected_document) {
              const docBtn = document.createElement("button");
              docBtn.type = "button";
              docBtn.className = "doc-link";
              docBtn.textContent = entry.affected_document;
              docBtn.addEventListener("click", () => {
                vscode.postMessage({ type: "openDoc", path: entry.affected_document });
              });
              entryEl.appendChild(docBtn);
            }

            appendField(entryEl, "What changed:", entry.what_changed);
            appendField(entryEl, "Why:", entry.why_changed);
            appendField(entryEl, "Impact:", entry.impact);
            appendField(entryEl, "Responsible:", entry.responsible);
            bodyEl.appendChild(entryEl);
          }
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
  return planningWebviewShell(
    nonce,
    PLANNING_WEBVIEW_STYLES + PROJECT_CONTEXT_STYLES + DECISIONS_WEBVIEW_STYLES,
    body,
    script,
  )
}
