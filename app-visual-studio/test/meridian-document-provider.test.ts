import assert from "node:assert/strict"
import * as path from "node:path"
import { describe, it } from "node:test"

import {
  buildMeridianDeliveryUriParts,
  clearMeridianDeliveryCache,
  meridianDeliveryCacheKey,
  parseMeridianDeliveryUriPath,
  primeMeridianDeliveryContent,
  readMeridianDeliveryContent,
  relativePathFromMeridianUriPath,
} from "../src/meridian-delivery-uri.js"

describe("meridian delivery uri", () => {
  const packageRoot = path.resolve("/tmp/meridian-copy")

  it("round-trips package root via path hex (safe when path is lowercased)", () => {
    const parts = buildMeridianDeliveryUriParts(packageRoot, "us/US-0042.md")
    assert.equal(parts.scheme, "meridian")
    assert.match(parts.path, /^\/r\/[0-9a-f]+\/us\/US-0042\.md$/i)

    const loweredHexPath = parts.path.replace(
      /^(\/r\/[0-9a-f]+)(\/.*)$/i,
      (_, hex, rest) => `${hex.toLowerCase()}${rest}`,
    )
    const parsed = parseMeridianDeliveryUriPath(loweredHexPath)
    assert.deepEqual(parsed, {
      packageRoot,
      relativePath: "us/US-0042.md",
    })
    assert.equal(
      relativePathFromMeridianUriPath(loweredHexPath),
      "us/US-0042.md",
    )
  })

  it("stores and reads primed markdown cache", () => {
    clearMeridianDeliveryCache()
    const parts = buildMeridianDeliveryUriParts(packageRoot, "epics/EPIC-01.md")
    const key = meridianDeliveryCacheKey(parts)
    primeMeridianDeliveryContent(key, "# EPIC-01\n\nBody from cache")
    assert.equal(readMeridianDeliveryContent(key), "# EPIC-01\n\nBody from cache")
  })
})
