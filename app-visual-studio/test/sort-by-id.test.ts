import assert from "node:assert/strict"
import { test } from "node:test"

import { sortByIdAsc } from "../src/domain/sort-by-id.js"

test("sortByIdAsc orders version ids numerically", () => {
  const items = sortByIdAsc([
    { id: "v10" },
    { id: "v2" },
    { id: "v2.01" },
    { id: "v1" },
    { id: "v0" },
  ])
  assert.deepEqual(
    items.map((i) => i.id),
    ["v0", "v1", "v2", "v2.01", "v10"],
  )
})

test("sortByIdAsc orders sprint ids within version", () => {
  const items = sortByIdAsc([
    { id: "v4-S10" },
    { id: "v4-S2" },
    { id: "v1-S3" },
    { id: "v0-S1" },
  ])
  assert.deepEqual(
    items.map((i) => i.id),
    ["v0-S1", "v1-S3", "v4-S2", "v4-S10"],
  )
})
