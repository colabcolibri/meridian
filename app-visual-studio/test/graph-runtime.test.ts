import assert from "node:assert/strict"
import { test } from "node:test"

import { assembleForceGraphRuntime } from "../src/graph-runtime/assemble.js"

test("assembleForceGraphRuntime does not restart sim on pointerdown", () => {
  const runtime = assembleForceGraphRuntime()
  assert.doesNotMatch(runtime, /wakeSim/)
  assert.match(runtime, /DRAG_THRESHOLD/)
  assert.match(runtime, /function replotModel/)
  assert.match(runtime, /replot: replotModel/)
  assert.doesNotMatch(runtime, /restorePositions\(prev\)/)
})

test("assembleForceGraphRuntime splits responsibilities into modules", () => {
  const runtime = assembleForceGraphRuntime()
  assert.match(runtime, /function applyModel/)
  assert.match(runtime, /function tick\(/)
  assert.match(runtime, /function draw\(/)
  assert.match(runtime, /function bindInput/)
  assert.match(runtime, /function seedPositions/)
  assert.match(runtime, /payload\.kind === "delivery"/)
  assert.doesNotMatch(runtime, /Math\.cos\(angle\) \* ring/)
  assert.match(runtime, /function relayout/)
  assert.match(runtime, /applyRepulsionGrid/)
  assert.match(runtime, /simTicks/)
})
