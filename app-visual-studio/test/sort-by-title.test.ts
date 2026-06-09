import assert from "node:assert/strict"
import { test } from "node:test"

import {
  sortByTitleAsc,
  sortStoriesByTitle,
} from "../src/domain/sort-by-title.js"

test("sortByTitleAsc orders by title, id as tie-break", () => {
  const items = sortByTitleAsc([
    { id: "v2", title: "Beta release" },
    { id: "v1", title: "Alpha release" },
    { id: "v3", title: "Alpha release" },
  ])
  assert.deepEqual(
    items.map((i) => i.id),
    ["v1", "v3", "v2"],
  )
})

test("sortByTitleAsc ignores case when grouping titles", () => {
  const items = sortByTitleAsc([
    { id: "b", title: "Beta" },
    { id: "a", title: "alpha" },
    { id: "c", title: "Alpha" },
  ])
  assert.equal(items[items.length - 1].id, "b")
})

test("sortStoriesByTitle sorts kanban cards by story title", () => {
  const sorted = sortStoriesByTitle([
    { id: "US-0002", title: "Zebra" },
    { id: "US-0001", title: "Alpha" },
  ])
  assert.deepEqual(
    sorted.map((s) => s.id),
    ["US-0001", "US-0002"],
  )
})
