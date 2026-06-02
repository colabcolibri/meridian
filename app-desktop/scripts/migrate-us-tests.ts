#!/usr/bin/env npx tsx
/**
 * Migrates legacy user stories to tests/tests_status + Tests section (Planned/Executed).
 * Usage: npx tsx scripts/migrate-us-tests.ts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { stringify } from "yaml"

import {
  extractMarkdownSection,
  extractMarkdownSubsection,
} from "../src/domain/meridian/story-body.ts"
import {
  parseFrontmatterRecord,
  splitMarkdown,
} from "../src/domain/meridian/frontmatter.ts"

const docsUs = resolve(import.meta.dirname, "../docs/us")

const PLANNED_HEADINGS = ["Planned", "Planejado"]
const EXECUTED_HEADINGS = ["Executed", "Executado"]
const TESTS_HEADINGS = ["Tests", "Testes"]

function extractSubsection(body: string, headings: string[]): string {
  for (const heading of headings) {
    const value = extractMarkdownSubsection(body, heading)
    if (value) return value
  }
  return ""
}

function extractTestsSection(body: string): string {
  for (const heading of TESTS_HEADINGS) {
    const value = extractMarkdownSection(body, heading)
    if (value || body.includes(`## ${heading}`)) {
      return value
    }
  }
  return ""
}

function oldLineHasEvidence(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed || /^-\s*`[^`]+`\s*$/.test(trimmed)) return false
  if (/^-\s*\[x\]/i.test(trimmed)) return true
  if (/^-\s*(Manual:|Dogfooding|Grep:)/i.test(trimmed)) return true
  if (/passed|validated|\sok\b|—/i.test(trimmed)) return true
  if (/pnpm\s+(test|build).*(passed|ok)/i.test(trimmed)) return true
  return false
}

function inferTestType(line: string): string {
  if (/Manual:/i.test(line)) return "manual"
  if (/Grep:/i.test(line)) return "grep"
  if (/Dogfooding/i.test(line)) return "dogfooding"
  if (/format:check|lint/i.test(line)) return "lint"
  if (/validate_meridian|validate/i.test(line)) return "validate"
  if (/pnpm test|vitest/i.test(line)) return "automated"
  if (/build/i.test(line)) return "build"
  return "manual"
}

function normalizeOldTestLine(line: string): string {
  return line.replace(/^-\s*/, "").trim()
}

function buildTestsSection(oldTestsBody: string): {
  section: string
  testsStatus: "done" | "pending"
} {
  const plannedSub = extractSubsection(oldTestsBody, PLANNED_HEADINGS)
  if (plannedSub) {
    const plannedLines = plannedSub.split("\n").filter((l) => /^-\s*\[/.test(l.trim()))
    const allChecked =
      plannedLines.length > 0 && plannedLines.every((l) => /^-\s*\[x\]/i.test(l.trim()))
    const executedSub = extractSubsection(oldTestsBody, EXECUTED_HEADINGS)
    const hasExec = executedSub
      .split("\n")
      .some(
        (l) =>
          l.trim() &&
          !/^_\(?pending\)?_\s*$/i.test(l.trim()) &&
          !/^_\([^)]*\)_/.test(l.trim()),
      )
    const bodyWithoutHeading = oldTestsBody.replace(/^## (Tests|Testes)\s*\n?/, "")
    return {
      section: `## Tests

> On **creation**: fill in **Planned**. On **close** (\`complete-user-story\`): mark \`[x]\` and record in **Executed**.

${bodyWithoutHeading}`,
      testsStatus: allChecked && hasExec ? "done" : "pending",
    }
  }

  const oldLines = oldTestsBody
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") && !l.startsWith("#"))

  const planned: string[] = []
  const executed: string[] = []

  for (const line of oldLines) {
    if (/^-\s*(Manual or automated test|Teste manual ou automatizado)/i.test(line)) {
      continue
    }
    const text = normalizeOldTestLine(line)
    const type = inferTestType(text)
    const done = oldLineHasEvidence(line)
    planned.push(
      `- [${done ? "x" : " "}] **${type}** — ${text.replace(/^Manual:\s*/i, "")}`,
    )
    if (done) {
      executed.push(`- ${text}`)
    }
  }

  if (planned.length === 0) {
    planned.push("- [ ] **manual** — describe verification")
  }

  const allDone = planned.every((l) => /^-\s*\[x\]/i.test(l)) && executed.length > 0

  const section = `## Tests

> On **creation**: fill in **Planned**. On **close** (\`complete-user-story\`): mark \`[x]\` and record in **Executed**.

### Planned

${planned.join("\n")}

### Executed

${allDone ? executed.join("\n") : "_(pending)_"}
`

  return { section, testsStatus: allDone ? "done" : "pending" }
}

function replaceTestsSection(body: string, newTestsSection: string): string {
  const start = body.search(/^## (Tests|Testes)\s*$/m)
  if (start === -1) {
    const insertBefore = body.search(/^## Out of scope/m)
    if (insertBefore === -1) {
      return `${body}\n\n${newTestsSection}\n`
    }
    return `${body.slice(0, insertBefore)}${newTestsSection}\n\n${body.slice(insertBefore)}`
  }
  const afterHeading = body.indexOf("\n", start)
  const rest = body.slice(afterHeading + 1)
  const nextSection = rest.search(/^## /m)
  const tail = nextSection === -1 ? "" : rest.slice(nextSection)
  const before = body.slice(0, start).trimEnd()
  return `${before}\n\n${newTestsSection}\n\n${tail.trim()}`.trim() + "\n"
}

for (const filename of readdirSync(docsUs).filter((f) => /^US-\d{4}\.md$/.test(f))) {
  const path = resolve(docsUs, filename)
  const raw = readFileSync(path, "utf8")
  const { frontmatter, body } = splitMarkdown(raw)
  if (!frontmatter) continue

  const record = parseFrontmatterRecord(frontmatter)
  delete record.tests
  delete record.tests_status

  const oldTests = extractTestsSection(body)
  const { section: newTestsSection, testsStatus } = buildTestsSection(oldTests)
  const newBody = replaceTestsSection(body, newTestsSection)

  const updated = {
    ...record,
    tests: "required",
    tests_status: testsStatus,
  }

  const fm = stringify(updated).trim()
  writeFileSync(path, `---\n${fm}\n---\n\n${newBody}`, "utf8")
  console.log(`${filename} → tests_status: ${testsStatus}`)
}
