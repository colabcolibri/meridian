import { GRAPH_RUNTIME_BOOTSTRAP } from "./bootstrap.js"
import { GRAPH_RUNTIME_INPUT } from "./input.js"
import { GRAPH_RUNTIME_LAYOUT } from "./layout.js"
import { GRAPH_RUNTIME_MODEL } from "./model.js"
import { GRAPH_RUNTIME_PHYSICS } from "./physics.js"
import { GRAPH_RUNTIME_RENDER } from "./render.js"

/** Assembles the inline webview runtime from single-responsibility modules. */
export function assembleForceGraphRuntime(): string {
  return `
(function () {
  const vscode = window.__MERIDIAN_VSCODE__ || null;
  const payload = window.__GRAPH_PAYLOAD__;
  const canvas = document.getElementById("forceGraph");
  if (!canvas || !payload) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;

  ${GRAPH_RUNTIME_MODEL}
  ${GRAPH_RUNTIME_LAYOUT}
  ${GRAPH_RUNTIME_PHYSICS}
  ${GRAPH_RUNTIME_RENDER}
  ${GRAPH_RUNTIME_INPUT}
  ${GRAPH_RUNTIME_BOOTSTRAP}
})();
`.trim()
}
