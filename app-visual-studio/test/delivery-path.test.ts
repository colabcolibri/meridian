import assert from "node:assert/strict"
import { test } from "node:test"

import {
  deliveryRelativePath,
  parseDeliveryRelativePath,
} from "../src/delivery-path.js"

test("parseDeliveryRelativePath accepts standard delivery folders", () => {
  assert.deepEqual(parseDeliveryRelativePath("us/US-0125.md"), {
    folder: "us",
    id: "US-0125",
  })
  assert.deepEqual(parseDeliveryRelativePath("epics/EPIC-15.md"), {
    folder: "epics",
    id: "EPIC-15",
  })
  assert.deepEqual(parseDeliveryRelativePath("versions/v10.md"), {
    folder: "versions",
    id: "v10",
  })
  assert.deepEqual(parseDeliveryRelativePath("sprints/v10-S1.md"), {
    folder: "sprints",
    id: "v10-S1",
  })
  assert.equal(parseDeliveryRelativePath("kanban/board.json"), null)
})

test("deliveryRelativePath round-trips folder and id", () => {
  assert.equal(deliveryRelativePath("us", "US-0001"), "us/US-0001.md")
})
