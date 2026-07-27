/** Graph model loading — node/edge graph from payload model. */
export const GRAPH_RUNTIME_MODEL = `
  let nodes = [];
  let nodeById = new Map();
  let edges = [];

  function nodeRadius(degree) {
    return Math.min(9, Math.max(4, 4 + Math.min(degree, 8) * 0.45));
  }

  function applyModel(model) {
    nodes = (model.nodes || []).map((n) => ({
      id: n.id,
      label: n.label || n.id,
      status: n.status || "",
      fileType: n.fileType || "",
      color: n.color || "",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 5,
      pinned: false,
    }));
    nodeById = new Map(nodes.map((n) => [n.id, n]));
    edges = (model.edges || [])
      .filter((e) => nodeById.has(e.from) && nodeById.has(e.to))
      .map((e) => ({ from: nodeById.get(e.from), to: nodeById.get(e.to) }));
    const degree = new Map();
    for (const n of nodes) degree.set(n.id, 0);
    for (const e of edges) {
      degree.set(e.from.id, (degree.get(e.from.id) || 0) + 1);
      degree.set(e.to.id, (degree.get(e.to.id) || 0) + 1);
    }
    for (const n of nodes) {
      const deg = degree.get(n.id) || 0;
      n.deg = deg;
      n.r = nodeRadius(deg);
    }
  }

  function snapshotPositions() {
    const snap = new Map();
    for (const n of nodes) snap.set(n.id, { x: n.x, y: n.y });
    return snap;
  }

  function restorePositions(snap) {
    let restored = 0;
    for (const n of nodes) {
      const pos = snap.get(n.id);
      if (!pos) continue;
      n.x = pos.x;
      n.y = pos.y;
      n.vx = 0;
      n.vy = 0;
      restored++;
    }
    return restored;
  }
`.trim()
