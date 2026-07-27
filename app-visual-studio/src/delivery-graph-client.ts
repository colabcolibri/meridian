/** Client-side delivery graph filters + model rebuild (pairs with force-graph runtime). */
export const DELIVERY_GRAPH_CLIENT = `
(function () {
  const payload = window.__GRAPH_PAYLOAD__;
  if (!payload || payload.kind !== "delivery" || !Array.isArray(payload.stories)) return;
  if (!window.MeridianFilterSheet) return;

  const vscode = window.__MERIDIAN_VSCODE__ || null;
  const saved = vscode?.getState?.() || {};
  const SPRINT_NONE = window.MeridianFilterSheet.SPRINT_NONE;

  function sprintKey(story) {
    return story.sprint || SPRINT_NONE;
  }

  function sprintLabel(key) {
    return key === SPRINT_NONE ? "Sem sprint" : key;
  }

  function storiesInVersionScope(stories, versions) {
    return stories.filter((s) => versions.has(s.version));
  }

  function sprintIdsInScope(stories, versions) {
    const ids = new Set(storiesInVersionScope(stories, versions).map(sprintKey));
    return [...ids].sort((a, b) => {
      if (a === SPRINT_NONE) return 1;
      if (b === SPRINT_NONE) return -1;
      return a.localeCompare(b, undefined, { numeric: true });
    });
  }

  function epicIdsInScope(stories, versions) {
    const ids = new Set(storiesInVersionScope(stories, versions).map((s) => s.epic));
    return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  function versionItems() {
    return (payload.versions || []).map((id) => ({
      id,
      label: id,
      title: id,
    }));
  }

  function sprintItems(selected) {
    return sprintIdsInScope(payload.stories, selected.version).map((id) => ({
      id,
      label: sprintLabel(id),
      title: sprintLabel(id),
    }));
  }

  function epicItems(selected) {
    const byId = new Map((payload.epics || []).map((e) => [e.id, e]));
    return epicIdsInScope(payload.stories, selected.version).map((id) => {
      const epic = byId.get(id);
      return {
        id,
        label: id,
        title: epic?.title || id,
      };
    });
  }

  function filterStories(selected) {
    const versions = selected.version;
    const sprints = selected.sprint;
    const epics = selected.epic;
    if (!versions.size || !sprints.size || !epics.size) return [];
    return payload.stories.filter((s) => {
      if (!versions.has(s.version)) return false;
      if (!sprints.has(sprintKey(s))) return false;
      if (!epics.has(s.epic)) return false;
      return true;
    });
  }

  function buildGraph(stories) {
    const scopedIds = new Set(stories.map((s) => s.id));
    const nodes = stories.map((s) => ({
      id: s.id,
      label: s.title,
      status: s.status || "",
    }));
    const edges = [];
    const seen = new Set();
    for (const story of stories) {
      for (const dep of story.dependsOn || []) {
        if (!scopedIds.has(dep)) continue;
        const key = story.id + "->" + dep;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push({ from: story.id, to: dep });
      }
    }
    nodes.sort((a, b) => a.id.localeCompare(b.id));
    edges.sort((a, b) => (a.from + a.to).localeCompare(b.from + b.to));
    return { nodes, edges };
  }

  function renderSummary(selected) {
    const el = document.getElementById("filter-summary");
    if (!el) return;
    const scoped = filterStories(selected);
    el.textContent =
      scoped.length +
      " US · " +
      selected.version.size +
      " versão(ões) · " +
      selected.sprint.size +
      " sprint(s) · " +
      selected.epic.size +
      " épico(s)";
  }

  const defaultVersions =
    saved.selectedVersions ||
    payload.defaultVersions ||
    (payload.versions || []);
  const defaultVersionSet = new Set(defaultVersions);
  const defaultSprints =
    saved.selectedSprints || sprintIdsInScope(payload.stories, defaultVersionSet);
  const defaultEpics =
    saved.selectedEpics || epicIdsInScope(payload.stories, defaultVersionSet);

  try {
    window.MeridianFilterSheet.mount({
    columns: [
      {
        key: "version",
        label: "Versão",
        listId: "version-chips",
        allId: "version-all",
        noneId: "version-none",
        defaultSelected: defaultVersions,
        items: versionItems,
      },
      {
        key: "sprint",
        label: "Sprint",
        listId: "sprint-chips",
        allId: "sprint-all",
        noneId: "sprint-none",
        defaultSelected: defaultSprints,
        items: sprintItems,
      },
      {
        key: "epic",
        label: "Épico",
        listId: "epic-chips",
        allId: "epic-all",
        noneId: "epic-none",
        defaultSelected: defaultEpics,
        items: epicItems,
      },
    ],
    renderSummary,
    onChange(selected) {
      const model = buildGraph(filterStories(selected));
      window.__MERIDIAN_FORCE_GRAPH__?.replot(model);
      const empty = document.querySelector(".empty-overlay");
      if (empty) empty.hidden = model.nodes.length > 0;
    },
    persist(plain) {
      vscode?.setState?.({
        selectedVersions: plain.version,
        selectedSprints: plain.sprint,
        selectedEpics: plain.epic,
      });
    },
  });
  } catch (err) {
    console.error("Delivery graph filters failed to mount", err);
  }
})();
`.trim()
