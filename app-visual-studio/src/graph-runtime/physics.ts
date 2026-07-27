/** Force simulation — spatial grid repulsion for large graphs; stops when stable. */
export const GRAPH_RUNTIME_PHYSICS = `
  let simAlpha = 0;
  let simRunning = false;
  let simTicks = 0;

  function startSimulation(alpha) {
    simAlpha = alpha == null ? 1 : alpha;
    simRunning = nodes.length > 0;
    simTicks = 0;
  }

  function stopSimulation() {
    simRunning = false;
    simAlpha = 0;
    simTicks = 0;
    for (const n of nodes) {
      n.vx = 0;
      n.vy = 0;
    }
  }

  function layoutProfile() {
    if (payload.kind === "delivery") {
      return { linkDist: 118, linkStr: 0.038, centerStr: 0.0004, repulseScale: 1.45, undirected: true };
    }
    // Import: weak center pull + strong repulsion so hubs do not collapse into a hairball.
    return { linkDist: 175, linkStr: 0.028, centerStr: 0.00003, repulseScale: 2.35, undirected: false };
  }

  function importRepulseBase(count) {
    if (count > 400) return 7200;
    if (count > 150) return 5800;
    if (count > 80) return 4800;
    return 4200;
  }

  function importCollisionGap(count) {
    if (count > 400) return 38;
    if (count > 150) return 32;
    if (count > 80) return 26;
    return 20;
  }

  function applyPairRepulsion(a, b, alpha, repulse, gap, pushScale) {
    if (a.pinned && b.pinned) return;
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.hypot(dx, dy) || 0.001;
    const collide = a.r + b.r + gap;
    if (dist < collide) {
      const push = ((collide - dist) / dist) * pushScale * alpha;
      const px = dx * push;
      const py = dy * push;
      if (!a.pinned) { a.vx -= px; a.vy -= py; }
      if (!b.pinned) { b.vx += px; b.vy += py; }
    }
    const softened = dist * dist + 900;
    const force = (repulse * alpha) / softened;
    dx = (dx / dist) * force;
    dy = (dy / dist) * force;
    if (!a.pinned) { a.vx -= dx; a.vy -= dy; }
    if (!b.pinned) { b.vx += dx; b.vy += dy; }
  }

  function applyRepulsionGrid(alpha, repulse, gap, cellSize, pushScale) {
    const grid = new Map();
    for (const n of nodes) {
      const cx = Math.floor(n.x / cellSize);
      const cy = Math.floor(n.y / cellSize);
      const key = cx + "," + cy;
      let bucket = grid.get(key);
      if (!bucket) { bucket = []; grid.set(key, bucket); }
      bucket.push(n);
    }
    for (const n of nodes) {
      const cx = Math.floor(n.x / cellSize);
      const cy = Math.floor(n.y / cellSize);
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const bucket = grid.get((cx + ox) + "," + (cy + oy));
          if (!bucket) continue;
          for (const other of bucket) {
            if (other === n) continue;
            applyPairRepulsion(n, other, alpha, repulse, gap, pushScale);
          }
        }
      }
    }
  }

  function tick() {
    if (!simRunning) return;
    simTicks++;
    const alpha = simAlpha;
    const count = nodes.length;
    const isImport = payload.kind === "import";
    const profile = layoutProfile();
    const linkDist = count > 100 ? profile.linkDist + (isImport ? 45 : 35) : count > 40 ? profile.linkDist + (isImport ? 28 : 18) : profile.linkDist;
    const gap = isImport ? importCollisionGap(count) : (count > 100 ? 26 : count > 40 ? 20 : 16);
    const repulse = (isImport ? importRepulseBase(count) : (count > 120 ? 3000 : count > 40 ? 4000 : 4800)) * profile.repulseScale;
    const linkStr = profile.linkStr;
    const centerStr = profile.centerStr;
    const undirected = profile.undirected === true;
    const pushScale = isImport ? 2.1 : 1.4;
    const damping = count > 500 ? 0.86 : 0.9;
    const maxV = count > 500 ? 8 : 12;
    const useGrid = count > 80;

    if (useGrid) {
      const cell = isImport ? Math.max(72, linkDist * 0.85) : Math.max(48, linkDist * 1.1);
      applyRepulsionGrid(alpha, repulse, gap, cell, pushScale);
    } else {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          applyPairRepulsion(nodes[i], nodes[j], alpha, repulse, gap, pushScale);
        }
      }
    }

    for (const e of edges) {
      const a = e.from;
      const b = e.to;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      let str = undirected ? linkStr * 0.55 : linkStr;
      if (isImport) {
        const hub = Math.log2((a.deg || 1) + (b.deg || 1) + 1);
        str /= Math.max(1.2, hub * 0.55);
      }
      const force = (dist - linkDist) * str * alpha;
      dx = (dx / dist) * force;
      dy = (dy / dist) * force;
      if (!a.pinned) { a.vx += dx; a.vy += dy; }
      if (!b.pinned) { b.vx -= dx; b.vy -= dy; }
    }

    let energy = 0;
    for (const n of nodes) {
      if (n.pinned) continue;
      n.vx += -n.x * centerStr * alpha;
      n.vy += -n.y * centerStr * alpha;
      n.vx *= damping;
      n.vy *= damping;
      const v = Math.hypot(n.vx, n.vy);
      if (v > maxV) {
        n.vx = (n.vx / v) * maxV;
        n.vy = (n.vy / v) * maxV;
      }
      n.x += n.vx;
      n.y += n.vy;
      energy += v;
    }

    const decay = count > 300 ? (isImport ? 0.972 : 0.965) : 0.978;
    simAlpha *= decay;
    const maxTicks = isImport
      ? (count > 500 ? 200 : count > 200 ? 240 : 280)
      : (count > 500 ? 90 : count > 200 ? 140 : 220);
    if (simTicks >= maxTicks || simAlpha < 0.012 || (simAlpha < 0.35 && energy / Math.max(count, 1) < 0.04)) {
      stopSimulation();
    }
  }
`.trim()
