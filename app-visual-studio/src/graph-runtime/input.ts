/** Pointer interaction — pan, zoom, drag (no layout restart on click). */
export const GRAPH_RUNTIME_INPUT = `
  const DRAG_THRESHOLD = 5;
  const DBLCLICK_MS = 400;

  let draggingNode = null;
  let panning = false;
  let pointerDownNode = null;
  let lastPointer = { x: 0, y: 0 };
  let pointerDown = { x: 0, y: 0 };
  let lastClick = { node: null, time: 0 };
  let hovered = null;

  function hitTest(sx, sy) {
    const w = screenToWorld(sx, sy);
    let found = null;
    let best = Infinity;
    for (const n of nodes) {
      const dx = n.x - w.x;
      const dy = n.y - w.y;
      const d = dx * dx + dy * dy;
      const r = n.r + 4;
      if (d < r * r && d < best) {
        best = d;
        found = n;
      }
    }
    return found;
  }

  function openNode(n) {
    if (!vscode || !n) return;
    if (payload.kind === "delivery") vscode.postMessage({ type: "openStory", id: n.id });
    else vscode.postMessage({ type: "openFile", path: n.id });
  }

  function bindInput() {
    canvas.addEventListener("pointerdown", (ev) => {
      canvas.setPointerCapture(ev.pointerId);
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      pointerDown = { x: sx, y: sy };
      lastPointer = { x: sx, y: sy };
      pointerDownNode = hitTest(sx, sy);
      draggingNode = null;
      panning = !pointerDownNode;
    });

    canvas.addEventListener("pointermove", (ev) => {
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const moved = Math.hypot(sx - pointerDown.x, sy - pointerDown.y);

      if (pointerDownNode && !draggingNode && moved >= DRAG_THRESHOLD) {
        draggingNode = pointerDownNode;
        draggingNode.pinned = true;
        draggingNode.vx = 0;
        draggingNode.vy = 0;
        panning = false;
      }

      if (draggingNode) {
        const w = screenToWorld(sx, sy);
        draggingNode.x = w.x;
        draggingNode.y = w.y;
        draggingNode.vx = 0;
        draggingNode.vy = 0;
      } else if (panning) {
        transform.x += sx - lastPointer.x;
        transform.y += sy - lastPointer.y;
      }

      hovered = hitTest(sx, sy);
      lastPointer = { x: sx, y: sy };
      canvas.style.cursor = hovered ? "pointer" : panning ? "grabbing" : "grab";
    });

    canvas.addEventListener("pointerup", (ev) => {
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const moved = Math.hypot(sx - pointerDown.x, sy - pointerDown.y);
      const hit = hitTest(sx, sy);

      if (!draggingNode && hit && moved < DRAG_THRESHOLD) {
        const now = Date.now();
        if (lastClick.node === hit && now - lastClick.time < DBLCLICK_MS) {
          openNode(hit);
          lastClick = { node: null, time: 0 };
        } else {
          lastClick = { node: hit, time: now };
        }
      }

      if (draggingNode) {
        draggingNode.pinned = true;
        draggingNode.vx = 0;
        draggingNode.vy = 0;
      }

      draggingNode = null;
      pointerDownNode = null;
      panning = false;
      canvas.style.cursor = "grab";
    });

    canvas.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const before = screenToWorld(sx, sy);
      const factor = ev.deltaY < 0 ? 1.1 : 0.9;
      transform.scale = Math.min(4, Math.max(0.12, transform.scale * factor));
      const after = screenToWorld(sx, sy);
      transform.x += (after.x - before.x) * transform.scale;
      transform.y += (after.y - before.y) * transform.scale;
    }, { passive: false });
  }
`.trim()
