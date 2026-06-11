import * as crypto from "node:crypto"

import { planningPayloadForVersionsView, type PlanningPayload } from "./planning-payload.js"
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

export function versionsWebviewHtml(
  payload: PlanningPayload,
  context: WebviewProjectContext,
): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const sorted = planningPayloadForVersionsView(payload)
  const dataJson = JSON.stringify(sorted)
  const contextJson = JSON.stringify(context)
  const body = `
  <div class="toolbar">
    ${projectContextToolbarHtml(context)}
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

    function epicsInVersion(versionId, scoped) {
      const ids = new Set(scoped.map((s) => s.epic));
      return payload.epics.filter((e) => ids.has(e.id));
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
        const versionSprints = payload.sprints.filter((s) => s.version === version.id);
        const block = document.createElement("div");
        block.className = "block" + (open ? " open" : "");

        const head = document.createElement("div");
        head.className = "block-head";
        const toggle = () => {
          if (expanded.has(version.id)) expanded.delete(version.id);
          else expanded.add(version.id);
          persist();
          renderList();
        };
        head.append(
          makeAccordionHead(open, toggle),
          makeIdLink(version.id, () => vscode.postMessage({ type: "openVersion", id: version.id })),
        );
        const title = document.createElement("span");
        title.className = "row-title";
        title.textContent = version.title;
        head.append(title, makeBadge(version.status), makeHeadProgress(scoped));
        block.appendChild(head);

        if (open) {
          const bodyEl = document.createElement("div");
          bodyEl.className = "block-body";
          appendDetailLine(bodyEl, "Outcome:", version.outcome);
          appendProgressBar(bodyEl, p.done, p.total);

          if (versionSprints.length) {
            const sprintSection = appendSection(bodyEl, "Sprints");
            for (const sp of versionSprints) {
              const spStories = storiesForIds(sp.storyIds, payload.stories);
              const spProgress = progress(spStories);
              appendMiniLink(
                sprintSection,
                sp.id,
                sp.status + " · " + spProgress.done + "/" + spProgress.total + " stories · " + truncate(sp.title, 80),
                () => vscode.postMessage({ type: "openSprint", id: sp.id }),
              );
            }
          }

          const versionEpics = epicsInVersion(version.id, scoped);
          if (versionEpics.length) {
            const epicSection = appendSection(bodyEl, "Epics with stories in this version");
            for (const epic of versionEpics) {
              const epicStories = scoped.filter((s) => s.epic === epic.id);
              const ep = progress(epicStories);
              appendMiniLink(
                epicSection,
                epic.id,
                epic.status + " · " + ep.done + "/" + ep.total + " · " + truncate(epic.title, 72),
                () => vscode.postMessage({ type: "openEpic", id: epic.id }),
              );
            }
          }

          const hint = document.createElement("p");
          hint.className = "meta-line";
          hint.textContent =
            versionSprints.length +
            " sprint(s) · " +
            versionEpics.length +
            " epic(s) — open version file for release notes and go-live checklist.";
          bodyEl.appendChild(hint);
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
  return planningWebviewShell(nonce, PLANNING_WEBVIEW_STYLES + PROJECT_CONTEXT_STYLES, body, script)
}
