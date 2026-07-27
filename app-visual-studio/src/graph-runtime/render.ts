/** Canvas rendering — grid, edges, nodes. */
export const GRAPH_RUNTIME_RENDER = `
  function statusColor(status) {
    if (status === "✅") return getComputedStyle(document.documentElement).getPropertyValue("--fg-done").trim() || "#22c55e";
    if (status === "🔶") return getComputedStyle(document.documentElement).getPropertyValue("--fg-partial").trim() || "#f59e0b";
    if (status === "🧊") return getComputedStyle(document.documentElement).getPropertyValue("--fg-frozen").trim() || "#60a5fa";
    if (status === "🚫") return getComputedStyle(document.documentElement).getPropertyValue("--fg-deprecated").trim() || "#f87171";
    if (status === "❌") return getComputedStyle(document.documentElement).getPropertyValue("--fg-open").trim() || "#fb923c";
    return getComputedStyle(document.documentElement).getPropertyValue("--fg-muted").trim() || "#94a3b8";
  }

  function neighborsOf(node) {
    if (!node) return new Set();
    const set = new Set([node]);
    for (const e of edges) {
      if (e.from === node) set.add(e.to);
      if (e.to === node) set.add(e.from);
    }
    return set;
  }

  function drawGrid() {
    const step = 20 * transform.scale;
    if (step < 6) return;
    const ox = transform.x % step;
    const oy = transform.y % step;
    ctx.save();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--fg-grid").trim() || "#334155";
    ctx.globalAlpha = 0.45;
    const dot = Math.max(0.8, 1.2 / transform.scale);
    for (let x = ox; x < width; x += step) {
      for (let y = oy; y < height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, dot, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawEdge(e, dimmed) {
    const a = e.from;
    const b = e.to;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const x1 = a.x + ux * a.r;
    const y1 = a.y + uy * a.r;
    const x2 = b.x - ux * b.r;
    const y2 = b.y - uy * b.r;
    const edgeColor = getComputedStyle(document.documentElement).getPropertyValue("--fg-edge").trim() || "#475569";
    ctx.strokeStyle = edgeColor;
    ctx.fillStyle = edgeColor;
    ctx.lineWidth = 1.2 / transform.scale;
    ctx.globalAlpha = dimmed ? 0.12 : 0.55;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const ah = 7 / transform.scale;
    const ax = x2 - ux * ah;
    const ay = y2 - uy * ah;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(ax - uy * ah * 0.45, ay + ux * ah * 0.45);
    ctx.lineTo(ax + uy * ah * 0.45, ay - ux * ah * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function nodeFill(n) {
    if (payload.kind === "import" && n.color) return n.color;
    if (payload.kind === "delivery") return statusColor(n.status);
    return getComputedStyle(document.documentElement).getPropertyValue("--fg-node").trim() || "#38bdf8";
  }

  function drawImportLegend() {
    const legend = payload.fileTypeLegend || [];
    if (!legend.length || payload.kind !== "import") return;
    const pad = 10;
    const rowH = 14;
    const boxW = 118;
    const boxH = pad * 2 + legend.length * rowH;
    const x = width - boxW - 12;
    const y = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();
    ctx.font = "10px var(--vscode-font-family)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let i = 0; i < legend.length; i++) {
      const item = legend[i];
      const rowY = y + pad + i * rowH + rowH / 2;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(x + 12, rowY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "var(--fg-label)";
      const label = item.type + " (" + item.count + ")";
      ctx.fillText(label, x + 22, rowY);
    }
    ctx.restore();
  }

  function drawDeliveryLegend() {
    if (payload.kind !== "delivery") return;
    const items = [
      { label: "Open", color: statusColor("❌") },
      { label: "Partial", color: statusColor("🔶") },
      { label: "Done", color: statusColor("✅") },
      { label: "Frozen", color: statusColor("🧊") },
      { label: "Deprecated", color: statusColor("🚫") },
    ];
    const pad = 10;
    const rowH = 14;
    const boxW = 128;
    const boxH = pad * 2 + items.length * rowH;
    const x = width - boxW - 12;
    const y = 12;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();
    ctx.font = "10px var(--vscode-font-family)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rowY = y + pad + i * rowH + rowH / 2;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(x + 12, rowY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "var(--fg-label)";
      ctx.fillText(item.label, x + 22, rowY);
    }
    ctx.restore();
  }

  function worldBounds() {
    const pad = 40 / transform.scale;
    return {
      minX: (-transform.x) / transform.scale - pad,
      minY: (-transform.y) / transform.scale - pad,
      maxX: (width - transform.x) / transform.scale + pad,
      maxY: (height - transform.y) / transform.scale + pad,
    };
  }

  function nodeVisible(n, bounds) {
    return n.x + n.r >= bounds.minX && n.x - n.r <= bounds.maxX &&
      n.y + n.r >= bounds.minY && n.y - n.r <= bounds.maxY;
  }

  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    const focus = neighborsOf(hovered);
    const hasFocus = hovered && focus.size > 1;
    const cull = nodes.length > 180;
    const bounds = cull ? worldBounds() : null;

    for (const e of edges) {
      if (cull && bounds && !nodeVisible(e.from, bounds) && !nodeVisible(e.to, bounds)) continue;
      const dimmed = hasFocus && !focus.has(e.from) && !focus.has(e.to);
      drawEdge(e, dimmed);
    }

    for (const n of nodes) {
      if (cull && bounds && !nodeVisible(n, bounds) && n !== hovered && n !== draggingNode) continue;
      const active = n === hovered || n === draggingNode;
      const dimmed = hasFocus && !focus.has(n);
      const fill = nodeFill(n);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.globalAlpha = dimmed ? 0.18 : active ? 1 : 0.92;
      ctx.fill();
      ctx.strokeStyle = active ? "var(--fg-highlight)" : "rgba(255,255,255,0.15)";
      ctx.lineWidth = (active ? 2.2 : 1) / transform.scale;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (!dimmed && (active || transform.scale > 0.55)) {
        ctx.fillStyle = "var(--fg-label)";
        ctx.font = Math.max(9, 11 / transform.scale) + "px var(--vscode-font-family)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const shortId = n.id.split("/").pop() || n.id;
        const label = active
          ? (n.label || shortId)
          : (shortId.length > 14 ? shortId.slice(0, 12) + "…" : shortId);
        ctx.fillText(label, n.x, n.y + n.r + 3);
      }
    }
    ctx.restore();
    drawImportLegend();
    drawDeliveryLegend();

    const stats = document.getElementById("graphStats");
    if (stats) stats.textContent = nodes.length + " nodes · " + edges.length + " links";
  }
`.trim()
