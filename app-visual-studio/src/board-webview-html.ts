import * as crypto from "node:crypto"

import type { EpicSummary } from "./load-epics.js"
import type { VersionSummary } from "./load-versions.js"
import type { UserStory } from "./domain/types.js"
import { compactStoryNarrative } from "./domain/story-narrative.js"
import {
  allSelectedVersionIds,
} from "./domain/version-filter.js"
import { PAGINATION_SCRIPT } from "./webview-common.js"
import {
  PROJECT_CONTEXT_SCRIPT,
  PROJECT_CONTEXT_STYLES,
  projectContextToolbarHtml,
  type WebviewProjectContext,
} from "./webview-project-context.js"

export type BoardWebviewPayload = {
  stories: UserStory[]
  epics: EpicSummary[]
  versions: VersionSummary[]
  defaultVersions: string[]
  context: WebviewProjectContext
  loadWarning?: string | null
}

export function buildBoardPayload(
  stories: UserStory[],
  epics: EpicSummary[],
  versions: VersionSummary[],
): BoardWebviewPayload {
  const storyVersionIds = new Set(stories.map((s) => s.version))
  const filteredVersions = versions.filter((v) => storyVersionIds.has(v.id))
  return {
    stories,
    epics,
    versions: filteredVersions,
    defaultVersions: allSelectedVersionIds(filteredVersions.map((v) => v.id)),
  }
}

export function emptyBoardHtml(message: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>body{font-family:var(--vscode-font-family);color:var(--vscode-descriptionForeground);
    background:var(--vscode-editor-background);padding:16px;}</style></head>
    <body><p>${escapeHtml(message)}</p></body></html>`
}

export function boardKanbanHtml(payload: BoardWebviewPayload): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const viewPayload = {
    ...payload,
    stories: payload.stories.map((s) => ({
      ...s,
      narrative: compactStoryNarrative(s.preamble),
    })),
  }
  const dataJson = JSON.stringify(viewPayload)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .toolbar {
      flex-shrink: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toolbar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
    .toolbar-row .chip { margin: 0 2px 2px 0; }
    .chip-group { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-left: 2px; }
    .toolbar-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--vscode-descriptionForeground);
      min-width: 52px;
    }
    .chip {
      font: inherit;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
      cursor: pointer;
    }
    .chip:hover { border-color: var(--vscode-focusBorder); }
    .chip.on {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: var(--vscode-button-background);
      font-weight: 600;
    }
    .chip.muted { opacity: 0.55; }
    .chip:disabled { opacity: 0.45; cursor: default; pointer-events: none; }
    .count {
      margin-left: auto;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }
    .board-wrap {
      flex: 1;
      overflow: auto;
      padding: 12px;
    }
    .board { display: flex; gap: 10px; align-items: flex-start; min-height: min-content; }
    .column {
      flex: 0 0 220px;
      min-width: 200px;
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 140px);
    }
    .column-header {
      padding: 8px 10px;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--vscode-panel-border);
      color: var(--vscode-descriptionForeground);
    }
    .column-body { padding: 6px; overflow-y: auto; flex: 1; min-height: 48px; }
    .column-empty {
      padding: 12px 8px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      text-align: center;
      font-style: italic;
    }
    .card {
      display: block;
      width: 100%;
      text-align: left;
      margin-bottom: 6px;
      padding: 8px;
      border: 1px solid var(--vscode-widget-border);
      border-radius: 4px;
      background: var(--vscode-input-background);
      color: inherit;
      cursor: pointer;
      font: inherit;
    }
    .card:hover { border-color: var(--vscode-focusBorder); }
    .card-id { font-weight: 600; font-size: 11px; }
    .card-title { font-size: 12px; margin-top: 4px; line-height: 1.35; }
    .card-narrative {
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      margin-top: 4px;
      line-height: 1.4;
      font-style: italic;
    }
    .card-meta { font-size: 10px; color: var(--vscode-descriptionForeground); margin-top: 4px; }
    .empty { padding: 24px; text-align: center; color: var(--vscode-descriptionForeground); }
    .column-pager {
      flex-shrink: 0;
      border-top: 1px solid var(--vscode-panel-border);
      padding: 6px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .column-pager-info {
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      min-width: 52px;
      text-align: center;
    }
    .column-pager .chip { font-size: 10px; padding: 2px 6px; min-width: 28px; }
    .pager-select {
      font: inherit;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
    }
    ${PROJECT_CONTEXT_STYLES}
  </style>
</head>
<body>
  <div class="toolbar">
    ${projectContextToolbarHtml(payload.context)}
    <div class="toolbar-row">
      <span class="toolbar-label">Version</span>
      <button type="button" class="chip" id="version-all">All</button>
      <button type="button" class="chip" id="version-none">None</button>
      <div id="version-chips" class="chip-group"></div>
    </div>
    <div class="toolbar-row">
      <span class="toolbar-label">Epic</span>
      <button type="button" class="chip" id="epic-all">All</button>
      <button type="button" class="chip" id="epic-none">None</button>
      <div id="epic-chips" class="chip-group"></div>
      <span class="count" id="summary"></span>
    </div>
    <div class="toolbar-row">
      <span class="toolbar-label">View</span>
      <select class="pager-select" id="page-size" title="Cards per column"></select>
      <button type="button" class="chip" id="frozen-toggle" aria-pressed="false">Show frozen</button>
      <button type="button" class="chip" id="deprecated-toggle" aria-pressed="false">Show deprecated</button>
      <button type="button" class="chip" id="narrative-toggle" aria-pressed="false">Show narrative</button>
    </div>
  </div>
  <div class="board-wrap"><div id="board" class="board"></div></div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const payload = ${dataJson};
    ${PROJECT_CONTEXT_SCRIPT}
    wireProjectContext(payload.context);
    ${PAGINATION_SCRIPT}
    const BOARD_STATE_VERSION = 12;
    const COLUMN_ORDER = ["backlog", "todo", "🔶", "🧪", "✅", "🧊", "🚫"];
    const ALWAYS_VISIBLE = ["backlog", "todo", "🔶", "🧪", "✅"];
    const COLUMN_HEADER_LABELS = {
      backlog: "📋 Backlog",
      todo: "📌 Todo",
      "🔶": "🔶 Partial",
      "🧪": "🧪 Tests",
      "✅": "✅ Done",
      "🧊": "🧊 Frozen",
      "🚫": "🚫 Deprecated",
    };
    function columnHeaderLabel(col) {
      return COLUMN_HEADER_LABELS[col] || col;
    }
    const COL_STORAGE_KEY = {
      backlog: "backlog",
      todo: "todo",
      "🔶": "partial",
      "🧪": "tests",
      "✅": "done",
      "🧊": "frozen",
      "🚫": "deprecated",
    };

    const saved = vscode.getState() || {};
    const freshState = saved.stateVersion !== BOARD_STATE_VERSION;
    let selectedVersions = new Set(
      !freshState && saved.selectedVersions && saved.selectedVersions.length
        ? saved.selectedVersions
        : payload.defaultVersions,
    );
    let selectedEpics = !freshState && saved.selectedEpics && saved.selectedEpics.length
      ? new Set(saved.selectedEpics)
      : null;
    let showFrozen = !!saved.showFrozen;
    let showDeprecated = !!saved.showDeprecated;
    let showNarrative = !!saved.showNarrative;
    let pageSize = freshState ? DEFAULT_PAGE_SIZE : normalizePageSize(saved.pageSize);
    let columnPages = freshState ? {} : (saved.columnPages || {});

    function ensureVersionSelection() {
      if (selectedVersions.size > 0) {
        return;
      }
      if (payload.defaultVersions && payload.defaultVersions.length) {
        selectedVersions = new Set(payload.defaultVersions);
      }
    }

    ensureVersionSelection();

    function resolveColumn(story) {
      if (story.status === "🧊") return "🧊";
      if (story.status === "🚫") return "🚫";
      if (story.status === "❌") return story.ready === true ? "todo" : "backlog";
      if (story.tests === "required" && story.testsStatus === "pending") return "🧪";
      return story.status;
    }

    function compareById(a, b) {
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    }

    function versionItems() {
      return payload.versions.map((v) => ({
        id: v.id,
        label: v.id,
        title: (selectedVersions.has(v.id) ? "Hide" : "Show") + " " + v.id + " — " + v.title,
      }));
    }

    function epicsInScope(scoped) {
      const ids = new Set(scoped.map((s) => s.epic));
      return payload.epics.filter((e) => ids.has(e.id));
    }

    function epicIdsInScope(scoped) {
      return epicsInScope(scoped).map((e) => e.id);
    }

    function storiesInVersionScope() {
      if (selectedVersions.size === 0) return [];
      return payload.stories.filter((s) => selectedVersions.has(s.version));
    }

    function ensureEpicSelection(scoped) {
      const epicIds = epicIdsInScope(scoped);
      if (selectedEpics === null || selectedEpics.size === 0) {
        selectedEpics = new Set(epicIds);
        return;
      }
      selectedEpics = new Set([...selectedEpics].filter((id) => epicIds.includes(id)));
      if (selectedEpics.size === 0 && epicIds.length) {
        selectedEpics = new Set(epicIds);
      }
    }

    function colKey(col) {
      return COL_STORAGE_KEY[col] || col;
    }

    function resetColumnPages() {
      columnPages = {};
    }

    function getColumnPage(col) {
      return columnPages[colKey(col)] || 1;
    }

    function setColumnPage(col, page) {
      columnPages[colKey(col)] = page;
    }

    function storiesForColumn(col) {
      return filteredStories()
        .filter((s) => resolveColumn(s) === col)
        .sort(compareById);
    }

    function visibleColumns() {
      return [
        ...ALWAYS_VISIBLE,
        ...(showFrozen ? ["🧊"] : []),
        ...(showDeprecated ? ["🚫"] : []),
      ];
    }

    function renderPageSizeSelect() {
      const select = document.getElementById("page-size");
      select.innerHTML = "";
      for (const n of PAGE_SIZES) {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n) + " per column";
        if (n === pageSize) opt.selected = true;
        select.appendChild(opt);
      }
      select.onchange = () => {
        pageSize = normalizePageSize(select.value);
        resetColumnPages();
        persist();
        renderAll();
      };
    }

    function renderColumnPager(container, col, total) {
      container.innerHTML = "";
      if (total === 0) {
        container.style.display = "none";
        return;
      }
      container.style.display = "";
      const pages = totalPages(total, pageSize);
      const safePage = clampPage(getColumnPage(col), pages);
      setColumnPage(col, safePage);
      const from = (safePage - 1) * pageSize + 1;
      const to = Math.min(safePage * pageSize, total);
      const label = columnHeaderLabel(col);

      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "chip";
      prev.textContent = "◀";
      prev.title = label + " — previous page";
      prev.disabled = safePage <= 1;
      prev.onclick = () => {
        setColumnPage(col, safePage - 1);
        persist();
        refreshColumn(col);
      };

      const info = document.createElement("span");
      info.className = "column-pager-info";
      info.textContent = from + "–" + to + " / " + total;

      const next = document.createElement("button");
      next.type = "button";
      next.className = "chip";
      next.textContent = "▶";
      next.title = label + " — next page";
      next.disabled = safePage >= pages;
      next.onclick = () => {
        setColumnPage(col, safePage + 1);
        persist();
        refreshColumn(col);
      };

      container.append(prev, info, next);
    }

    function fillColumnBody(body, colStories) {
      body.innerHTML = "";
      if (!colStories.length) {
        const empty = document.createElement("p");
        empty.className = "column-empty";
        empty.textContent = "—";
        body.appendChild(empty);
        return;
      }
      const showVer = selectedVersions.size !== 1;
      for (const s of colStories) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "card";
        const meta = s.epic + (showVer ? " · " + s.version : "") + " · " + s.moscow;
        const narrativeHtml =
          showNarrative && s.narrative
            ? '<div class="card-narrative">' + esc(s.narrative) + "</div>"
            : "";
        btn.innerHTML =
          '<div class="card-id">' +
          esc(s.id) +
          '</div><div class="card-title">' +
          esc(s.title) +
          "</div>" +
          narrativeHtml +
          '<div class="card-meta">' +
          esc(meta) +
          "</div>";
        btn.onclick = () => vscode.postMessage({ type: "openStory", id: s.id });
        body.appendChild(btn);
      }
    }

    function refreshColumn(col) {
      const section = document.querySelector('[data-col="' + colKey(col) + '"]');
      if (!section) {
        renderBoard();
        return;
      }
      const allInCol = storiesForColumn(col);
      const paged = pageSlice(allInCol, getColumnPage(col), pageSize);
      setColumnPage(col, paged.page);
      const head = section.querySelector(".column-header");
      head.textContent = columnHeaderLabel(col) + " (" + allInCol.length + ")";
      fillColumnBody(section.querySelector(".column-body"), paged.slice);
      renderColumnPager(section.querySelector(".column-pager"), col, allInCol.length);
    }

    function buildColumnSection(col) {
      const allInCol = storiesForColumn(col);
      const paged = pageSlice(allInCol, getColumnPage(col), pageSize);
      setColumnPage(col, paged.page);

      const section = document.createElement("section");
      section.className = "column";
      section.dataset.col = colKey(col);

      const head = document.createElement("div");
      head.className = "column-header";
      head.textContent = columnHeaderLabel(col) + " (" + allInCol.length + ")";
      section.appendChild(head);

      const body = document.createElement("div");
      body.className = "column-body";
      fillColumnBody(body, paged.slice);
      section.appendChild(body);

      const pager = document.createElement("div");
      pager.className = "column-pager";
      renderColumnPager(pager, col, allInCol.length);
      section.appendChild(pager);

      return section;
    }

    function filteredStories() {
      if (selectedVersions.size === 0 || selectedEpics.size === 0) return [];
      return payload.stories.filter(
        (s) => selectedVersions.has(s.version) && selectedEpics.has(s.epic),
      );
    }

    function wireAllNone(allBtn, noneBtn, allOn, noneOn, disabled, onAll, onNone) {
      allBtn.className = "chip" + (allOn ? " on" : "");
      allBtn.disabled = disabled || allOn;
      allBtn.onclick = onAll;
      noneBtn.className = "chip" + (noneOn ? " on" : "");
      noneBtn.disabled = disabled || noneOn;
      noneBtn.onclick = onNone;
    }

    function renderChipGroup(root, items, selected, disabled, onToggle) {
      root.innerHTML = "";
      for (const item of items) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip" + (selected.has(item.id) ? " on" : "");
        b.textContent = item.label;
        b.title = item.title || item.label;
        b.disabled = disabled;
        b.onclick = () => onToggle(item.id);
        root.appendChild(b);
      }
    }

    function renderToolbar() {
      const versionItemsList = versionItems();
      const allVersionsOn =
        versionItemsList.length > 0 && versionItemsList.every((v) => selectedVersions.has(v.id));
      const noVersionsOn = selectedVersions.size === 0;

      wireAllNone(
        document.getElementById("version-all"),
        document.getElementById("version-none"),
        allVersionsOn,
        noVersionsOn,
        false,
        () => {
          selectedVersions = new Set(versionItemsList.map((v) => v.id));
          resetColumnPages();
          persist();
          renderAll();
        },
        () => {
          selectedVersions = new Set();
          resetColumnPages();
          persist();
          renderAll();
        },
      );
      renderChipGroup(
        document.getElementById("version-chips"),
        versionItemsList,
        selectedVersions,
        false,
        (id) => {
          if (selectedVersions.has(id)) selectedVersions.delete(id);
          else selectedVersions.add(id);
          resetColumnPages();
          persist();
          renderAll();
        },
      );

      const scoped = storiesInVersionScope();
      ensureEpicSelection(scoped);
      const epicItems = epicsInScope(scoped).map((e) => ({
        id: e.id,
        label: e.id,
        title: e.title,
      }));
      const allEpicsOn =
        epicItems.length > 0 && epicItems.every((e) => selectedEpics.has(e.id));
      const noEpicsOn = selectedEpics.size === 0;

      wireAllNone(
        document.getElementById("epic-all"),
        document.getElementById("epic-none"),
        allEpicsOn,
        noEpicsOn,
        noVersionsOn,
        () => {
          selectedEpics = new Set(epicItems.map((e) => e.id));
          resetColumnPages();
          persist();
          renderAll();
        },
        () => {
          selectedEpics = new Set();
          resetColumnPages();
          persist();
          renderAll();
        },
      );
      renderChipGroup(
        document.getElementById("epic-chips"),
        epicItems,
        selectedEpics,
        noVersionsOn,
        (id) => {
          if (selectedEpics.has(id)) selectedEpics.delete(id);
          else selectedEpics.add(id);
          resetColumnPages();
          persist();
          renderAll();
        },
      );

      const toggleLabel = (on, noun, n) => {
        const base = (on ? "Hide " : "Show ") + noun;
        return n > 0 ? base + " (" + n + ")" : base;
      };

      const frozenBtn = document.getElementById("frozen-toggle");
      const frozenN = scoped.filter((s) => resolveColumn(s) === "🧊").length;
      frozenBtn.classList.toggle("on", showFrozen);
      frozenBtn.classList.toggle("muted", frozenN === 0);
      frozenBtn.setAttribute("aria-pressed", showFrozen ? "true" : "false");
      frozenBtn.textContent = toggleLabel(showFrozen, "frozen", frozenN);
      frozenBtn.onclick = () => {
        showFrozen = !showFrozen;
        persist();
        renderAll();
      };

      const deprecatedBtn = document.getElementById("deprecated-toggle");
      const deprecatedN = scoped.filter((s) => resolveColumn(s) === "🚫").length;
      deprecatedBtn.classList.toggle("on", showDeprecated);
      deprecatedBtn.classList.toggle("muted", deprecatedN === 0);
      deprecatedBtn.setAttribute("aria-pressed", showDeprecated ? "true" : "false");
      deprecatedBtn.textContent = toggleLabel(showDeprecated, "deprecated", deprecatedN);
      deprecatedBtn.onclick = () => {
        showDeprecated = !showDeprecated;
        persist();
        renderAll();
      };

      const narrativeBtn = document.getElementById("narrative-toggle");
      const narrativeN = scoped.filter((s) => s.narrative).length;
      narrativeBtn.classList.toggle("on", showNarrative);
      narrativeBtn.classList.toggle("muted", narrativeN === 0);
      narrativeBtn.setAttribute("aria-pressed", showNarrative ? "true" : "false");
      narrativeBtn.textContent = toggleLabel(showNarrative, "narrative", narrativeN);
      narrativeBtn.onclick = () => {
        showNarrative = !showNarrative;
        persist();
        renderAll();
      };

      const list = filteredStories();
      const summary = document.getElementById("summary");
      summary.textContent =
        selectedVersions.size +
        " version(s) · " +
        selectedEpics.size +
        " epic(s) · " +
        list.length +
        " stor" +
        (list.length === 1 ? "y" : "ies");

      renderPageSizeSelect();
    }

    function renderBoard() {
      const root = document.getElementById("board");
      if (selectedVersions.size === 0) {
        root.innerHTML =
          '<p class="empty">No versions selected — choose All or pick versions to show</p>';
        return;
      }
      if (selectedEpics.size === 0) {
        root.innerHTML =
          '<p class="empty">No epics selected — choose All or pick epics to show</p>';
        return;
      }

      root.innerHTML = "";
      for (const col of visibleColumns()) {
        root.appendChild(buildColumnSection(col));
      }
    }

    function esc(t) {
      const d = document.createElement("div");
      d.textContent = t;
      return d.innerHTML;
    }

    function persist() {
      vscode.setState({
        stateVersion: BOARD_STATE_VERSION,
        selectedVersions: [...selectedVersions],
        selectedEpics: selectedEpics ? [...selectedEpics] : [],
        showFrozen,
        showDeprecated,
        showNarrative,
        pageSize,
        columnPages,
      });
    }

    function renderAll() {
      renderToolbar();
      renderBoard();
    }

    renderAll();
  </script>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
