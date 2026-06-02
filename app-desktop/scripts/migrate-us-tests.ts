#!/usr/bin/env npx tsx
/**
 * Migra US antigas para tests/tests_status + seção Testes (Planejado/Executado).
 * Uso: npx tsx scripts/migrate-us-tests.ts
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

function oldLineHasEvidence(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed || /^-\s*`[^`]+`\s*$/.test(trimmed)) return false
  if (/^-\s*\[x\]/i.test(trimmed)) return true
  if (/^-\s*(Manual:|Dogfooding|Grep:)/i.test(trimmed)) return true
  if (/passou|passaram|validado|\sok\b|—/i.test(trimmed)) return true
  if (/pnpm\s+(test|build).*(passou|passaram|ok)/i.test(trimmed)) return true
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
  if (extractMarkdownSubsection(oldTestsBody, "Planejado")) {
    const planned = extractMarkdownSubsection(oldTestsBody, "Planejado")
    const plannedLines = planned.split("\n").filter((l) => /^-\s*\[/.test(l.trim()))
    const allChecked =
      plannedLines.length > 0 && plannedLines.every((l) => /^-\s*\[x\]/i.test(l.trim()))
    const executado = extractMarkdownSubsection(oldTestsBody, "Executado")
    const hasExec = executado
      .split("\n")
      .some(
        (l) =>
          l.trim() &&
          !/^_\(?pendente\)?_\s*$/i.test(l.trim()) &&
          !/^_\([^)]*\)_/.test(l.trim()),
      )
    return {
      section: `## Testes\n\n> Na **criação**: preencher **Planejado**. Ao **fechar** (\`complete-user-story\`): marcar \`[x]\` e registrar em **Executado**.\n\n${oldTestsBody.replace(/^## Testes\s*\n?/, "")}`,
      testsStatus: allChecked && hasExec ? "done" : "pending",
    }
  }

  const oldLines = oldTestsBody
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") && !l.startsWith("#"))

  const planned: string[] = []
  const executado: string[] = []

  for (const line of oldLines) {
    if (/^-\s*Teste manual ou automatizado/i.test(line)) continue
    const text = normalizeOldTestLine(line)
    const type = inferTestType(text)
    const done = oldLineHasEvidence(line)
    planned.push(
      `- [${done ? "x" : " "}] **${type}** — ${text.replace(/^Manual:\s*/i, "")}`,
    )
    if (done) {
      executado.push(`- ${text}`)
    }
  }

  if (planned.length === 0) {
    planned.push("- [ ] **manual** — descrever verificação")
  }

  const allDone = planned.every((l) => /^-\s*\[x\]/i.test(l)) && executado.length > 0

  const section = `## Testes

> Na **criação**: preencher **Planejado**. Ao **fechar** (\`complete-user-story\`): marcar \`[x]\` e registrar em **Executado**.

### Planejado

${planned.join("\n")}

### Executado

${allDone ? executado.join("\n") : "_(pendente)_"}
`

  return { section, testsStatus: allDone ? "done" : "pending" }
}

function replaceTestsSection(body: string, newTestsSection: string): string {
  const start = body.search(/^## Testes\s*$/m)
  if (start === -1) {
    const insertBefore = body.search(/^## Fora de escopo/m)
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

  const oldTests = extractMarkdownSection(body, "Testes")
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
