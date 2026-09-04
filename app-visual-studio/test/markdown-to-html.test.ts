import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import * as path from "node:path"
import { test } from "node:test"

import { kitReferenceWebviewHtml } from "../src/kit-reference-webview-html.js"
import { markdownToHtml } from "../src/markdown-to-html.js"

test("markdownToHtml renders headings, table and code block", () => {
  const md = `# Title

| A | B |
| - | - |
| x | y |

\`\`\`txt
line
\`\`\`
`
  const html = markdownToHtml(md)
  assert.match(html, /<h1>Title<\/h1>/)
  assert.match(html, /<table>/)
  assert.match(html, /<th>A<\/th>/)
  assert.match(html, /<td>x<\/td>/)
  assert.match(html, /<pre><code>line<\/code><\/pre>/)
})

test("kitReferenceWebviewHtml wraps kit agents-help.md", () => {
  const mdPath = path.resolve(
    import.meta.dirname,
    "../../.agent/references/guides/agents-help.md",
  )
  const md = readFileSync(mdPath, "utf8")
  const html = kitReferenceWebviewHtml(md, ".agent/references/guides/agents-help.md", {
    title: "Meridian — agents & slash commands",
    description: "Test intro",
  })
  assert.match(html, /Meridian — agents &amp; slash commands/)
  assert.match(html, /Agent groups/)
  assert.match(html, /<table>/)
})
