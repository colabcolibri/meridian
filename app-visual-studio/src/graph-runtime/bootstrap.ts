/** Viewport, loop, and public API. */
export const GRAPH_RUNTIME_BOOTSTRAP = `
  const transform = { x: 0, y: 0, scale: 1 };
  let fitted = false;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(320, rect.width);
    height = Math.max(240, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function screenToWorld(sx, sy) {
    return {
      x: (sx - transform.x) / transform.scale,
      y: (sy - transform.y) / transform.scale,
    };
  }

  function fitView() {
    if (!nodes.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x - n.r);
      maxX = Math.max(maxX, n.x + n.r);
      minY = Math.min(minY, n.y - n.r);
      maxY = Math.max(maxY, n.y + n.r + 14);
    }
    const pad = 48;
    const gw = maxX - minX || 1;
    const gh = maxY - minY || 1;
    const scale = Math.min((width - pad * 2) / gw, (height - pad * 2) / gh, 2.5);
    transform.scale = Math.max(0.15, scale);
    transform.x = width / 2 - ((minX + maxX) / 2) * transform.scale;
    transform.y = height / 2 - ((minY + maxY) / 2) * transform.scale;
  }

  function loop() {
    if (simRunning) tick();
    else if (!fitted) { fitView(); fitted = true; }
    draw();
    requestAnimationFrame(loop);
  }

  function initialLayout(model) {
    applyModel(model);
    seedPositions();
    fitted = false;
    startSimulation(1);
  }

  function relayout() {
    replotModel({ nodes: nodes.map((n) => ({ id: n.id, label: n.label, status: n.status })), edges: edges.map((e) => ({ from: e.from.id, to: e.to.id })) });
  }

  function replotModel(model) {
    applyModel(model || { nodes: [], edges: [] });
    for (const n of nodes) {
      n.pinned = false;
      n.vx = 0;
      n.vy = 0;
    }
    hovered = null;
    draggingNode = null;
    pointerDownNode = null;
    seedPositions();
    fitted = false;
    if (nodes.length) {
      startSimulation(1);
    } else {
      stopSimulation();
      fitView();
      fitted = true;
    }
  }

  function reloadModel(model) {
    replotModel(model);
  }

  document.getElementById("fitView")?.addEventListener("click", () => fitView());
  document.getElementById("resetSim")?.addEventListener("click", () => relayout());

  window.__MERIDIAN_FORCE_GRAPH__ = { reload: reloadModel, replot: replotModel, relayout, fitView };

  bindInput();
  if (payload.kind !== "delivery" || !Array.isArray(payload.stories)) {
    initialLayout(payload.model || { nodes: [], edges: [] });
  }
  window.addEventListener("resize", () => { resize(); if (!simRunning) fitView(); });
  resize();
  if (!nodes.length) fitView();
  loop();
`.trim()
