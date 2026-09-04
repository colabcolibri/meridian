import assert from "node:assert/strict"
import { test } from "node:test"

import { structureMarkdownHtml } from "../src/markdown-structure.js"

const SAMPLE = `<h1>US-0001 — Title</h1>
<p><strong>As</strong> manager, <strong>I want</strong> x, <strong>so that</strong> y.</p>
<h2>Intent</h2>
<h3>Acceptance</h3>
<ul><li>one</li></ul>
<h3>Why</h3>
<p>Because slice.</p>
<h3>Where</h3>
<p>After US-0000.</p>
<h2>Plan</h2>
<h3>Approach</h3>
<ul><li>step</li></ul>
<h3>Planned</h3>
<ul><li>test</li></ul>`

test("structureMarkdownHtml wraps preamble, lanes, and fields", () => {
  const html = structureMarkdownHtml(SAMPLE)
  assert.match(html, /class="md-preamble"/)
  assert.match(html, /data-lane="intent"/)
  assert.match(html, /data-lane="plan"/)
  assert.match(html, /data-field="why"/)
  assert.match(html, /data-field="where"/)
  assert.match(html, /class="md-field-title"/)
  assert.doesNotMatch(html, /<h2>Intent<\/h2>/)
  assert.match(html, /<h2 class="md-lane-title"/)
})

test("structureMarkdownHtml leaves flat html unchanged when no h2", () => {
  const flat = "<p>hello</p><h3>Only</h3>"
  assert.equal(structureMarkdownHtml(flat), flat)
})
