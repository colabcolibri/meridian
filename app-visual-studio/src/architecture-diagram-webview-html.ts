import * as crypto from "node:crypto"

import type {
  ArchitectureDiagramWebviewAssets,
  ArchitectureDiagramsPayload,
} from "./domain/architecture-diagram.js"
import { meridianMermaidThemeScriptBody } from "./meridian-mermaid/theme.js"
import {
  PROJECT_CONTEXT_SCRIPT,
  PROJECT_CONTEXT_STYLES,
  projectContextToolbarHtml,
  type WebviewProjectContext,
} from "./webview-project-context.js"

const DIAGRAM_WEBVIEW_STYLES = `
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
      overflow: hidden;
    }
    .toolbar {
      flex-shrink: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .diagram-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .diagram-toolbar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .zoom-toolbar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      width: 100%;
      padding-top: 2px;
      border-top: 1px solid var(--vscode-panel-border);
    }
    .zoom-toolbar-label {
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      margin-right: 2px;
    }
    .diagram-select {
      font: inherit;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
      min-width: 180px;
      max-width: min(420px, 100%);
      flex: 1;
    }
    .chip {
      font: inherit;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
      cursor: pointer;
      white-space: nowrap;
    }
    .chip:hover { border-color: var(--vscode-focusBorder); }
    .chip:disabled { opacity: 0.45; cursor: default; pointer-events: none; }
    .chip.on {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: var(--vscode-button-background);
    }
    .zoom-group {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }
    .zoom-label {
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      min-width: 36px;
      text-align: center;
    }
    .diagram-stage {
      flex: 1;
      min-height: 0;
      position: relative;
      overflow: hidden;
      width: 100%;
    }
    .diagram-viewport {
      position: absolute;
      inset: 0;
      overflow: hidden;
      background: var(--vscode-editor-background);
      cursor: grab;
      touch-action: none;
    }
    .diagram-viewport.dragging { cursor: grabbing; }
    .diagram-canvas {
      transform-origin: 0 0;
      will-change: transform;
      display: block;
      width: max-content;
      height: max-content;
    }
    #diagramHost {
      display: block;
      line-height: 0;
    }
    #diagramHost svg.meridian-diagram,
    #diagramHost svg {
      display: block;
      max-width: none;
      height: auto;
    }
    .meridian-diagram .node rect,
    .meridian-diagram .node polygon,
    .meridian-diagram .label rect {
      rx: 6;
      ry: 6;
    }
    .meridian-diagram .edgePath path {
      stroke-width: 1.5px;
    }
    .diagram-meta {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 4;
      flex-shrink: 0;
      border-top: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
      padding: 8px 12px 12px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.45;
      display: none;
    }
    .diagram-meta.visible { display: block; }
    .diagram-meta h2 {
      margin: 0 0 4px;
      font-size: 12px;
      color: var(--vscode-foreground);
    }
    .diagram-meta p { margin: 0 0 6px; }
    .render-error {
      color: var(--vscode-errorForeground);
      padding: 16px;
      text-align: center;
      font-size: 12px;
      white-space: pre-wrap;
    }
    .empty-state {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
      line-height: 1.5;
    }
    .parse-error {
      color: var(--vscode-errorForeground);
      font-size: 11px;
      margin-top: 8px;
    }
    .viewport-hint {
      position: absolute;
      left: 10px;
      bottom: 8px;
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      opacity: 0.85;
      pointer-events: none;
      user-select: none;
      z-index: 2;
    }
`

export function architectureDiagramWebviewHtml(
  payload: ArchitectureDiagramsPayload,
  context: WebviewProjectContext,
  assets: ArchitectureDiagramWebviewAssets,
): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const dataJson = JSON.stringify(payload)
  const contextJson = JSON.stringify(context)
  const csp = [
    "default-src 'none'",
    "img-src data: blob:",
    "style-src 'unsafe-inline'",
    `font-src ${assets.cspSource}`,
    `script-src 'nonce-${nonce}' ${assets.cspSource}`,
  ].join("; ")

  const body = `
  <div class="toolbar">
    ${projectContextToolbarHtml(context)}
    <div class="diagram-toolbar">
      <div class="diagram-toolbar-row">
        <select class="diagram-select" id="diagramSelect" title="Select diagram"></select>
        <button type="button" class="chip" id="openSourceBtn" title="Open source file">Source</button>
        <button type="button" class="chip" id="openDocBtn" title="Open linked phase doc" style="display:none">Doc</button>
        <button type="button" class="chip" id="toggleMetaBtn" title="Show diagram notes">Notes</button>
      </div>
      <div class="zoom-toolbar" id="zoomToolbar" hidden>
        <span class="zoom-toolbar-label">Zoom</span>
        <button type="button" class="chip" id="fitBtn" title="Fit diagram to viewport">Fit</button>
        <button type="button" class="chip" id="zoomOutBtn" title="Zoom out (−)">−</button>
        <span class="zoom-label" id="zoomLabel">100%</span>
        <button type="button" class="chip" id="zoomInBtn" title="Zoom in (+)">+</button>
        <button type="button" class="chip" id="resetZoomBtn" title="Reset zoom to 100%">100%</button>
      </div>
    </div>
  </div>
  <div class="diagram-stage" id="stage">
    <div class="empty-state" id="emptyState"></div>
    <div class="diagram-viewport" id="diagramViewport" hidden>
      <div class="diagram-canvas" id="diagramCanvas">
        <div id="diagramHost"></div>
      </div>
      <div class="viewport-hint">Scroll or pinch to zoom · drag to pan · dbl-click fit</div>
    </div>
    <div class="diagram-meta" id="diagramMeta"></div>
  </div>
  <script src="${assets.mermaidScriptSrc}"></script>`

  const script = `
    const vscode = acquireVsCodeApi();
    const payload = ${dataJson};
    const projectContext = ${contextJson};
    ${meridianMermaidThemeScriptBody()}
    ${PROJECT_CONTEXT_SCRIPT}

    const KIND_LABELS = {
      runtime: "Runtime",
      database: "Database",
      integration: "Integration",
      security: "Security",
      flow: "Flow",
      other: "Diagram",
    };

    let activeIndex = 0;
    let metaVisible = false;
    let renderGeneration = 0;
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panStartX = 0;
    let panStartY = 0;

    const MIN_ZOOM = 0.12;
    const MAX_ZOOM = 4;

    const emptyState = document.getElementById("emptyState");
    const diagramViewport = document.getElementById("diagramViewport");
    const diagramCanvas = document.getElementById("diagramCanvas");
    const diagramHost = document.getElementById("diagramHost");
    const diagramMeta = document.getElementById("diagramMeta");
    const diagramSelect = document.getElementById("diagramSelect");
    const openSourceBtn = document.getElementById("openSourceBtn");
    const openDocBtn = document.getElementById("openDocBtn");
    const toggleMetaBtn = document.getElementById("toggleMetaBtn");
    const fitBtn = document.getElementById("fitBtn");
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const resetZoomBtn = document.getElementById("resetZoomBtn");
    const zoomLabel = document.getElementById("zoomLabel");
    const zoomToolbar = document.getElementById("zoomToolbar");

    function esc(t) {
      const d = document.createElement("div");
      d.textContent = t ?? "";
      return d.innerHTML;
    }

    function validDiagrams() {
      return payload.diagrams.filter((d) => d.mermaid && !d.error);
    }

    function activeEntry() {
      const valid = validDiagrams();
      if (!valid.length) return null;
      return valid[Math.min(activeIndex, valid.length - 1)];
    }

    function applyTransform() {
      diagramCanvas.style.transform = "translate(" + panX + "px, " + panY + "px) scale(" + zoom + ")";
      const label = Math.round(zoom * 100) + "%";
      zoomLabel.textContent = label;
    }

    function diagramContentBounds() {
      const svg = diagramHost.querySelector("svg");
      if (!svg) return null;
      try {
        const pad = 16;
        const box = svg.getBBox();
        if (box.width > 0 && box.height > 0) {
          return {
            x: box.x - pad,
            y: box.y - pad,
            width: box.width + pad * 2,
            height: box.height + pad * 2,
          };
        }
      } catch (_) {}
      const viewBox = svg.viewBox && svg.viewBox.baseVal;
      if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
        return {
          x: viewBox.x,
          y: viewBox.y,
          width: viewBox.width,
          height: viewBox.height,
        };
      }
      return null;
    }

    function tightenDiagramViewBox() {
      const svg = diagramHost.querySelector("svg");
      if (!svg) return null;
      const bounds = diagramContentBounds();
      if (!bounds) return null;
      svg.setAttribute(
        "viewBox",
        bounds.x + " " + bounds.y + " " + bounds.width + " " + bounds.height,
      );
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.style.width = bounds.width + "px";
      svg.style.height = bounds.height + "px";
      return { x: 0, y: 0, width: bounds.width, height: bounds.height };
    }

    let fitAttempts = 0;

    function fitDiagram() {
      const bounds = tightenDiagramViewBox() || diagramContentBounds();
      if (!bounds) {
        if (fitAttempts < 12) {
          fitAttempts += 1;
          requestAnimationFrame(() => fitDiagram());
        }
        return;
      }
      fitAttempts = 0;
      const vpW = diagramViewport.clientWidth;
      const vpH = diagramViewport.clientHeight;
      if (!vpW || !vpH) return;
      const pad = 32;
      const scale = Math.min(
        (vpW - pad) / bounds.width,
        (vpH - pad) / bounds.height,
      );
      zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
      panX = (vpW - bounds.width * zoom) / 2;
      panY = (vpH - bounds.height * zoom) / 2;
      applyTransform();
    }

    function setZoom(nextZoom, anchorX, anchorY) {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
      if (anchorX == null || anchorY == null) {
        zoom = clamped;
        applyTransform();
        return;
      }
      panX = anchorX - ((anchorX - panX) * clamped) / zoom;
      panY = anchorY - ((anchorY - panY) * clamped) / zoom;
      zoom = clamped;
      applyTransform();
    }

    async function renderMermaidDiagram(entry, generation) {
      if (typeof mermaid === "undefined") {
        diagramHost.innerHTML = '<p class="render-error">Meridian diagram renderer failed to load.</p>';
        return;
      }
      mermaid.initialize(meridianMermaidTheme());
      const id = "meridian-diagram-" + generation;
      try {
        const { svg } = await mermaid.render(id, entry.mermaid);
        if (generation !== renderGeneration) return;
        diagramHost.innerHTML = polishMeridianSvg(svg);
        zoom = 1;
        panX = 0;
        panY = 0;
        applyTransform();
        requestAnimationFrame(() => {
          tightenDiagramViewBox();
          requestAnimationFrame(() => fitDiagram());
        });
      } catch (err) {
        if (generation !== renderGeneration) return;
        const msg = err && err.message ? err.message : String(err);
        diagramHost.innerHTML = '<p class="render-error">Mermaid render error:\\n' + esc(msg) + "</p>";
      }
    }

    function showDiagram(entry) {
      renderGeneration += 1;
      const gen = renderGeneration;
      void renderMermaidDiagram(entry, gen);
    }

    function updateViewportInsets() {
      if (metaVisible && diagramMeta.classList.contains("visible")) {
        diagramViewport.style.bottom = diagramMeta.offsetHeight + "px";
      } else {
        diagramViewport.style.bottom = "0";
      }
    }

    function renderMeta(entry) {
      if (!metaVisible) {
        diagramMeta.classList.remove("visible");
        updateViewportInsets();
        requestAnimationFrame(() => fitDiagram());
        return;
      }
      const parts = [];
      const kind = entry.meta.kind ? KIND_LABELS[entry.meta.kind] || entry.meta.kind : null;
      parts.push("<h2>" + esc(entry.meta.title) + "</h2>");
      if (kind) {
        parts.push("<p><strong>Kind:</strong> " + esc(kind) + "</p>");
      }
      if (entry.meta.subtitle) {
        parts.push("<p>" + esc(entry.meta.subtitle) + "</p>");
      }
      parts.push("<p><strong>Source:</strong> docs/" + esc(entry.relativePath) + "</p>");
      if (entry.meta.updated) {
        parts.push("<p><strong>Updated:</strong> " + esc(entry.meta.updated) + "</p>");
      }
      parts.push("<p>Meridian diagram renderer — edit the source file and save to refresh.</p>");
      diagramMeta.innerHTML = parts.join("");
      diagramMeta.classList.add("visible");
      updateViewportInsets();
      requestAnimationFrame(() => fitDiagram());
    }

    function optionLabel(entry) {
      const kind = entry.meta.kind ? KIND_LABELS[entry.meta.kind] || entry.meta.kind : "Diagram";
      return "[" + kind + "] " + entry.meta.title + " (" + entry.fileName + ")";
    }

    function populateSelect() {
      diagramSelect.innerHTML = "";
      const valid = validDiagrams();
      if (!valid.length) {
        const opt = document.createElement("option");
        opt.textContent = "No diagrams";
        diagramSelect.appendChild(opt);
        diagramSelect.disabled = true;
        return;
      }
      diagramSelect.disabled = false;
      valid.forEach((entry, index) => {
        const opt = document.createElement("option");
        opt.value = String(index);
        opt.textContent = optionLabel(entry);
        if (index === activeIndex) opt.selected = true;
        diagramSelect.appendChild(opt);
      });
    }

    function renderAll() {
      const valid = validDiagrams();
      const errors = payload.diagrams.filter((d) => d.error || !d.mermaid);
      if (!valid.length) {
        emptyState.hidden = false;
        diagramViewport.hidden = true;
        zoomToolbar.hidden = true;
        diagramMeta.classList.remove("visible");
        let msg = "No architecture diagrams found.";
        if (!payload.diagrams.length) {
          msg += " Add .md (with one mermaid block) or .mmd files in docs/architecture/diagrams/.";
        } else if (errors.length) {
          msg += " All diagram files failed to load or render.";
        }
        emptyState.innerHTML = "<div><p>" + esc(msg) + "</p>" +
          errors.map((e) => '<p class="parse-error"><strong>' + esc(e.fileName) + ":</strong> " + esc(e.error || "empty") + "</p>").join("") +
          '<p class="hint">Use skill generate-architecture-diagram — one diagram per file (runtime, database ER, flows).</p></div>';
        openSourceBtn.disabled = true;
        return;
      }

      emptyState.hidden = true;
      diagramViewport.hidden = false;
      zoomToolbar.hidden = false;
      populateSelect();
      const entry = activeEntry();
      if (!entry) return;

      showDiagram(entry);
      renderMeta(entry);

      openSourceBtn.disabled = false;
      openSourceBtn.onclick = () => vscode.postMessage({ type: "openDiagramSource", path: entry.relativePath });
      if (entry.meta.source_doc) {
        openDocBtn.style.display = "";
        openDocBtn.onclick = () => vscode.postMessage({ type: "openDoc", path: entry.meta.source_doc });
      } else {
        openDocBtn.style.display = "none";
      }
    }

    diagramSelect.onchange = () => {
      activeIndex = Number(diagramSelect.value) || 0;
      renderAll();
    };

    toggleMetaBtn.onclick = () => {
      metaVisible = !metaVisible;
      toggleMetaBtn.classList.toggle("on", metaVisible);
      const entry = activeEntry();
      if (entry) renderMeta(entry);
    };

    function zoomBy(factor, anchorX, anchorY) {
      const ax = anchorX != null ? anchorX : diagramViewport.clientWidth / 2;
      const ay = anchorY != null ? anchorY : diagramViewport.clientHeight / 2;
      setZoom(zoom * factor, ax, ay);
    }

    fitBtn.onclick = () => fitDiagram();
    resetZoomBtn.onclick = () => {
      setZoom(1, diagramViewport.clientWidth / 2, diagramViewport.clientHeight / 2);
    };
    zoomInBtn.onclick = () => zoomBy(1.2);
    zoomOutBtn.onclick = () => zoomBy(1 / 1.2);

    function onWheel(event) {
      if (!diagramViewport || diagramViewport.hidden) return;
      const target = event.target;
      if (!diagramViewport.contains(target) && target !== diagramViewport) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = diagramViewport.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      const delta = event.deltaY;
      const factor = delta > 0 ? 0.9 : 1.1;
      zoomBy(factor, mx, my);
    }

    diagramViewport.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    window.addEventListener("keydown", (event) => {
      if (!diagramViewport || diagramViewport.hidden) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomBy(1.2);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomBy(1 / 1.2);
      } else if (event.key === "0") {
        event.preventDefault();
        fitDiagram();
      }
    });

    diagramViewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      dragging = true;
      diagramViewport.classList.add("dragging");
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      panStartX = panX;
      panStartY = panY;
      diagramViewport.setPointerCapture(event.pointerId);
    });

    diagramViewport.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      panX = panStartX + (event.clientX - dragStartX);
      panY = panStartY + (event.clientY - dragStartY);
      applyTransform();
    });

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      diagramViewport.classList.remove("dragging");
      try { diagramViewport.releasePointerCapture(event.pointerId); } catch (_) {}
    }

    diagramViewport.addEventListener("pointerup", endDrag);
    diagramViewport.addEventListener("pointercancel", endDrag);
    diagramViewport.addEventListener("dblclick", () => fitDiagram());

    const viewportResize = new ResizeObserver(() => {
      if (!diagramViewport.hidden && diagramHost.querySelector("svg")) {
        fitDiagram();
      }
    });
    viewportResize.observe(diagramViewport);

    wireProjectContext(projectContext);
    renderAll();
  `

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <style>${PROJECT_CONTEXT_STYLES}${DIAGRAM_WEBVIEW_STYLES}</style>
</head>
<body>
${body}
<script nonce="${nonce}">
${script}
</script>
</body>
</html>`
}
