import assert from "node:assert/strict"
import { test } from "node:test"

import { toMermaidFlowchart } from "../src/domain/graph-model.js"
import {
  buildDeliveryGraph,
  filterStoriesForDeliveryGraph,
  listDeliveryFilterOptions,
} from "../src/load-delivery-graph.js"
import type { UserStory } from "../src/domain/types.js"

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
  const filtered = filterStoriesForDeliveryGraph(stories, { version: "v1", sprint: "v1-S1" })
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
  assert.deepEqual(opts.sprints, ["v2-S1"])
})

test("toMermaidFlowchart emits flowchart with sanitized ids", () => {
  const mermaid = toMermaidFlowchart({
    nodes: [{ id: "US-0001", label: "A" }],
    edges: [],
  })
  assert.match(mermaid, /flowchart LR/)
  assert.match(mermaid, /US_0001/)
})
