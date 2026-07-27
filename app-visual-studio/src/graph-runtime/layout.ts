/** Initial node positions — random cloud; force simulation forms organic clusters. */
export const GRAPH_RUNTIME_LAYOUT = `
  function seedPositions() {
    if (!nodes.length) return;
    const spread =
      payload.kind === "delivery"
        ? Math.max(140, Math.sqrt(nodes.length) * 52)
        : Math.max(200, Math.sqrt(nodes.length) * 72);
    for (const n of nodes) {
      const angle = Math.random() * Math.PI * 2;
      const radius = spread * Math.sqrt(Math.random());
      n.x = Math.cos(angle) * radius;
      n.y = Math.sin(angle) * radius;
      n.vx = (Math.random() - 0.5) * 4;
      n.vy = (Math.random() - 0.5) * 4;
      n.pinned = false;
    }
  }
`.trim()
