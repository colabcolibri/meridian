import assert from "node:assert/strict"
import { test } from "node:test"

import {
  clampPage,
  DEFAULT_PAGE_SIZE,
  normalizePageSize,
  pageRange,
  pageSlice,
  totalPages,
} from "../src/domain/list-pagination.js"

test("totalPages and pageSlice default to 50-item pages", () => {
  const items = Array.from({ length: 120 }, (_, i) => i + 1)
  assert.equal(totalPages(items.length, DEFAULT_PAGE_SIZE), 3)
  assert.deepEqual(pageSlice(items, 1, DEFAULT_PAGE_SIZE).slice(0, 3), [1, 2, 3])
  assert.equal(pageSlice(items, 1, DEFAULT_PAGE_SIZE).length, 50)
  assert.equal(pageSlice(items, 3, DEFAULT_PAGE_SIZE).length, 20)
})

test("clampPage keeps page within bounds", () => {
  assert.equal(clampPage(0, 3), 1)
  assert.equal(clampPage(99, 3), 3)
})

test("pageRange reports visible window", () => {
  assert.deepEqual(pageRange(120, 2, 50), {
    from: 51,
    to: 100,
    page: 2,
    totalPages: 3,
  })
})

test("normalizePageSize falls back to default", () => {
  assert.equal(normalizePageSize(100), 100)
  assert.equal(normalizePageSize(999), DEFAULT_PAGE_SIZE)
})
