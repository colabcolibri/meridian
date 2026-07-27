import assert from "node:assert/strict"
import { test } from "node:test"

import { toMermaidFlowchart } from "../src/domain/graph-model.js"
import { graphWebviewHtml } from "../src/graph-webview-html.js"
import {
  buildDeliveryGraph,
  filterStoriesForDeliveryGraph,
  listDeliveryFilterOptions,
} from "../src/load-delivery-graph.js"
import type { UserStory } from "../src/domain/types.js"
import { buildWebviewProjectContext } from "../src/webview-project-context.js"
import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"

function story(partial: Partial<UserStory> & Pick<UserStory, "id" | "title">): UserStory {
  return {
    epic: "EPIC-01",
    version: "v1",
    sprint: null,
    status: "❌",
    moscow: "Must",
    dependsOn: [],
    doneWhen: "done",
    tests: "required",
    testsStatus: "pending",
    ready: false,
    ...partial,
  }
}

test("buildDeliveryGraph maps dependsOn to edges and keeps isolates", () => {
  const stories = [
    story({ id: "US-0002", title: "B", dependsOn: [] }),
    story({ id: "US-0001", title: "A", dependsOn: ["US-0002"] }),
  ]
  const graph = buildDeliveryGraph(stories)
  assert.equal(graph.nodes.length, 2)
  assert.deepEqual(graph.edges, [{ from: "US-0001", to: "US-0002" }])
})

test("filterStoriesForDeliveryGraph limits version and sprint", () => {
  const stories = [
    story({ id: "US-0001", title: "A", version: "v1", sprint: "v1-S1" }),
    story({ id: "US-0002", title: "B", version: "v2", sprint: "v2-S1" }),
  ]
  const filtered = filterStoriesForDeliveryGraph(stories, {
    versions: new Set(["v1"]),
    sprints: new Set(["v1-S1"]),
  })
  assert.deepEqual(
    filtered.map((s) => s.id),
    ["US-0001"],
  )
})

test("listDeliveryFilterOptions lists distinct versions and sprints", () => {
  const stories = [
    story({ id: "US-0001", title: "A", version: "v2", sprint: "v2-S1" }),
    story({ id: "US-0002", title: "B", version: "v1", sprint: null }),
  ]
  const opts = listDeliveryFilterOptions(stories)
  assert.deepEqual(opts.versions, ["v1", "v2"])
  assert.deepEqual(opts.sprints, ["__none__", "v2-S1"])
})

test("toMermaidFlowchart emits flowchart with sanitized ids", () => {
  const mermaid = toMermaidFlowchart({
    nodes: [{ id: "US-0001", label: "A" }],
    edges: [],
  })
  assert.match(mermaid, /flowchart LR/)
  assert.match(mermaid, /US_0001/)
})

function workspace(): MeridianWorkspaceInfo {
  return {
    projectRoot: "/p",
    docsRoot: "/p/docs",
    packageRoot: "/p",
    projectId: "meridian",
    projectName: "meridian",
    projects: [],
    kitDetected: true,
    docsExists: true,
    usCount: 1,
  }
}

test("graphWebviewHtml uses force canvas and board-style filter sheet", () => {
  const html = graphWebviewHtml(
    {
      kind: "delivery",
      title: "Delivery dependency graph",
      model: { nodes: [{ id: "US-0001", label: "A", status: "❌" }], edges: [] },
      stories: [
        {
          id: "US-0001",
          title: "A",
          version: "v1",
          sprint: null,
          epic: "EPIC-01",
          status: "❌",
          dependsOn: [],
        },
      ],
      epics: [{ id: "EPIC-01", title: "Epic" }],
      versions: ["v1"],
    },
    buildWebviewProjectContext(workspace()),
    { cspSource: "vscode-webview:" },
  )
  assert.match(html, /id="forceGraph"/)
  assert.match(html, /__MERIDIAN_VSCODE__/)
  assert.match(html, /id="open-filters"/)
  assert.match(html, /filter-sheet/)
  assert.match(html, /id="epic-chips"/)
  assert.match(html, /duplo clique/)
  assert.doesNotMatch(html, /mermaid\.min\.js/)
  assert.doesNotMatch(html, /node-list/)
  assert.doesNotMatch(html, /versionFilter/)
})
