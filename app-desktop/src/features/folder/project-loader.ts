import type { BoardEntry } from "@/domain/meridian/board-types"
import { splitMarkdown } from "@/domain/meridian/frontmatter"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import {
  MeridianParseError,
  parseEpicsFromMarkdown,
  parsePhaseDocument,
  parseUserStoryFile,
} from "@/domain/meridian/parser"
import { collectProtocolIssues } from "@/domain/meridian/protocol-validators"
import type { Epic, PhaseDocument, UserStory } from "@/domain/meridian/types"

export type { MonitorIssue }

export interface MeridianProjectData {
  phaseDocuments: PhaseDocument[]
  userStories: UserStory[]
  epics: Epic[]
  board: BoardEntry[] | null
  issues: MonitorIssue[]
}

async function readTextFile(
  directory: FileSystemDirectoryHandle,
  filename: string,
): Promise<string> {
  const fileHandle = await directory.getFileHandle(filename)
  const file = await fileHandle.getFile()
  return file.text()
}

async function listUserStoryFilenames(
  usDir: FileSystemDirectoryHandle,
): Promise<string[]> {
  const names: string[] = []
  for await (const [name, handle] of usDir.entries()) {
    if (handle.kind === "file" && /^US-\d+\.md$/i.test(name)) {
      names.push(name)
    }
  }
  return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function recordParseIssue(issues: MonitorIssue[], error: unknown) {
  if (error instanceof MeridianParseError) {
    issues.push({
      file: error.file,
      message: error.message.replace(`${error.file}: `, ""),
      severity: "error",
      scope: "parse",
    })
    return
  }
  issues.push({
    file: ".",
    message: error instanceof Error ? error.message : "Erro desconhecido ao ler pasta.",
    severity: "error",
    scope: "parse",
  })
}

function parseBoardJson(raw: string): BoardEntry[] {
  const parsed = JSON.parse(raw) as unknown
  if (!Array.isArray(parsed)) {
    throw new Error("board.json deve ser um array.")
  }
  return parsed as BoardEntry[]
}

async function loadPhaseDocuments(
  docsRoot: FileSystemDirectoryHandle,
  parseIssues: MonitorIssue[],
): Promise<PhaseDocument[]> {
  const results = await Promise.all(
    PHASE_DOC_IDS.map(async (docId) => {
      const filename = `${docId}.md`
      try {
        const raw = await readTextFile(docsRoot, filename)
        return parsePhaseDocument(docId, raw)
      } catch (error) {
        recordParseIssue(
          parseIssues,
          error instanceof MeridianParseError
            ? error
            : new MeridianParseError(filename, String(error)),
        )
        return null
      }
    }),
  )

  return results.filter((doc): doc is PhaseDocument => doc !== null)
}

async function loadUserStories(
  docsRoot: FileSystemDirectoryHandle,
  parseIssues: MonitorIssue[],
  storyBodies: Map<string, string>,
): Promise<UserStory[]> {
  const userStories: UserStory[] = []

  try {
    const usDir = await docsRoot.getDirectoryHandle("us")
    const filenames = await listUserStoryFilenames(usDir)

    const stories = await Promise.all(
      filenames.map(async (filename) => {
        try {
          const raw = await readTextFile(usDir, filename)
          const story = parseUserStoryFile(filename, raw)
          storyBodies.set(story.id, splitMarkdown(raw).body)
          return story
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`us/${filename}`, String(error)),
          )
          return null
        }
      }),
    )

    for (const story of stories) {
      if (story) {
        userStories.push(story)
      }
    }
  } catch {
    parseIssues.push({
      file: "us/",
      message: 'Pasta "us/" não encontrada.',
      severity: "error",
      scope: "parse",
    })
  }

  return userStories
}

/** Carrega fases, US, épicos e board a partir da pasta docs/ aberta (raiz do handle). */
export async function loadMeridianProject(
  docsRoot: FileSystemDirectoryHandle,
): Promise<MeridianProjectData> {
  const parseIssues: MonitorIssue[] = []
  const storyBodies = new Map<string, string>()

  const [phaseDocuments, userStories] = await Promise.all([
    loadPhaseDocuments(docsRoot, parseIssues),
    loadUserStories(docsRoot, parseIssues, storyBodies),
  ])

  let epics: Epic[] = []
  try {
    const raw = await readTextFile(docsRoot, "04_epics.md")
    epics = parseEpicsFromMarkdown(raw)
  } catch (error) {
    recordParseIssue(
      parseIssues,
      error instanceof MeridianParseError
        ? error
        : new MeridianParseError("04_epics.md", String(error)),
    )
  }

  let board: BoardEntry[] | null = null
  try {
    const kanbanDir = await docsRoot.getDirectoryHandle("kanban")
    const raw = await readTextFile(kanbanDir, "board.json")
    board = parseBoardJson(raw)
  } catch (error) {
    parseIssues.push({
      file: "kanban/board.json",
      message: error instanceof Error ? error.message : "Falha ao ler board.json",
      severity: "warning",
      scope: "parse",
    })
  }

  phaseDocuments.sort((a, b) => a.id.localeCompare(b.id))

  const protocolIssues = collectProtocolIssues({
    phaseDocuments,
    userStories,
    storyBodies,
    board,
  })

  return {
    phaseDocuments,
    userStories,
    epics,
    board,
    issues: [...parseIssues, ...protocolIssues],
  }
}
