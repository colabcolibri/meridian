import { deriveBoardFromStories } from "@/domain/meridian/board-derive"
import { mapWithConcurrency } from "@/domain/meridian/async-batch"
import { splitMarkdown } from "@/domain/meridian/frontmatter"
import { USER_STORY_FILENAME_PATTERN } from "@/domain/meridian/user-story-id"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import {
  MeridianParseError,
  parseDecisionDayFile,
  parseEpicFile,
  parsePhaseDocument,
  parseSprintFile,
  parseUserStoryFile,
  parseVersionFile,
} from "@/domain/meridian/parser"
import { collectProtocolIssues } from "@/domain/meridian/protocol-validators"
import type {
  DecisionDay,
  Epic,
  PhaseDocument,
  ProductVersion,
  Sprint,
  UserStory,
} from "@/domain/meridian/types"

export type { MonitorIssue }

export interface MeridianProjectData {
  phaseDocuments: PhaseDocument[]
  userStories: UserStory[]
  epics: Epic[]
  versions: ProductVersion[]
  sprints: Sprint[]
  decisionDays: DecisionDay[]
  /** Derived on load from userStories — never read from kanban/board.json. */
  board: ReturnType<typeof deriveBoardFromStories>
  storyBodies: Map<string, string>
  epicBodies: Map<string, string>
  versionBodies: Map<string, string>
  issues: MonitorIssue[]
}

const USER_STORY_LOAD_CONCURRENCY = 32

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
    if (handle.kind === "file" && USER_STORY_FILENAME_PATTERN.test(name)) {
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
    message: error instanceof Error ? error.message : "Unknown error reading folder.",
    severity: "error",
    scope: "parse",
  })
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

async function listEpicFilenames(
  epicsDir: FileSystemDirectoryHandle,
): Promise<string[]> {
  const names: string[] = []
  for await (const [name, handle] of epicsDir.entries()) {
    if (handle.kind === "file" && /^EPIC-\d+\.md$/i.test(name)) {
      names.push(name)
    }
  }
  return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function loadEpics(
  docsRoot: FileSystemDirectoryHandle,
  parseIssues: MonitorIssue[],
  epicBodies: Map<string, string>,
): Promise<Epic[]> {
  const epics: Epic[] = []

  try {
    const epicsDir = await docsRoot.getDirectoryHandle("epics")
    const filenames = await listEpicFilenames(epicsDir)

    if (filenames.length === 0) {
      parseIssues.push({
        file: "epics/",
        message: "No EPIC-XX.md files found in docs/epics/.",
        severity: "error",
        scope: "parse",
      })
      return epics
    }

    const parsed = await Promise.all(
      filenames.map(async (filename) => {
        try {
          const raw = await readTextFile(epicsDir, filename)
          const epic = parseEpicFile(filename, raw)
          epicBodies.set(epic.id, splitMarkdown(raw).body)
          return epic
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`epics/${filename}`, String(error)),
          )
          return null
        }
      }),
    )

    for (const epic of parsed) {
      if (epic) {
        epics.push(epic)
      }
    }
  } catch {
    parseIssues.push({
      file: "epics/",
      message: 'Folder "epics/" not found. Create docs/epics/ with EPIC-XX.md.',
      severity: "error",
      scope: "parse",
    })
  }

  return epics
}

async function listVersionFilenames(
  versionsDir: FileSystemDirectoryHandle,
): Promise<string[]> {
  const names: string[] = []
  for await (const [name, handle] of versionsDir.entries()) {
    if (handle.kind === "file" && /^v\d+\.md$/i.test(name)) {
      names.push(name)
    }
  }
  return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function loadVersions(
  docsRoot: FileSystemDirectoryHandle,
  parseIssues: MonitorIssue[],
  versionBodies: Map<string, string>,
): Promise<ProductVersion[]> {
  const versions: ProductVersion[] = []

  try {
    const versionsDir = await docsRoot.getDirectoryHandle("versions")
    const filenames = await listVersionFilenames(versionsDir)

    if (filenames.length === 0) {
      parseIssues.push({
        file: "versions/",
        message: "No vX.md files found in docs/versions/.",
        severity: "error",
        scope: "parse",
      })
      return versions
    }

    const parsed = await Promise.all(
      filenames.map(async (filename) => {
        try {
          const raw = await readTextFile(versionsDir, filename)
          const version = parseVersionFile(filename, raw)
          versionBodies.set(version.id, splitMarkdown(raw).body)
          return version
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`versions/${filename}`, String(error)),
          )
          return null
        }
      }),
    )

    for (const version of parsed) {
      if (version) {
        versions.push(version)
      }
    }
  } catch {
    parseIssues.push({
      file: "versions/",
      message: 'Folder "versions/" not found. Create docs/versions/ with vX.md.',
      severity: "error",
      scope: "parse",
    })
  }

  return versions
}

async function listSprintFilenames(
  sprintsDir: FileSystemDirectoryHandle,
): Promise<string[]> {
  const names: string[] = []
  for await (const [name, handle] of sprintsDir.entries()) {
    if (handle.kind === "file" && /^v\d+-S\d+\.md$/i.test(name)) {
      names.push(name)
    }
  }
  return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function loadSprints(
  docsRoot: FileSystemDirectoryHandle,
  parseIssues: MonitorIssue[],
): Promise<Sprint[]> {
  const sprints: Sprint[] = []

  try {
    const sprintsDir = await docsRoot.getDirectoryHandle("sprints")
    const filenames = await listSprintFilenames(sprintsDir)

    const parsed = await Promise.all(
      filenames.map(async (filename) => {
        try {
          const raw = await readTextFile(sprintsDir, filename)
          return parseSprintFile(filename, raw)
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`sprints/${filename}`, String(error)),
          )
          return null
        }
      }),
    )

    for (const sprint of parsed) {
      if (sprint) {
        sprints.push(sprint)
      }
    }
  } catch {
    parseIssues.push({
      file: "sprints/",
      message: 'Folder "sprints/" not found (optional until first sprint).',
      severity: "warning",
      scope: "parse",
    })
  }

  return sprints
}

async function listDecisionFilenames(
  decisionsDir: FileSystemDirectoryHandle,
): Promise<string[]> {
  const names: string[] = []
  for await (const [name, handle] of decisionsDir.entries()) {
    if (handle.kind === "file" && /^\d{4}-\d{2}-\d{2}\.json$/i.test(name)) {
      names.push(name)
    }
  }
  return names.sort((a, b) => b.localeCompare(a))
}

async function loadDecisions(
  docsRoot: FileSystemDirectoryHandle,
  parseIssues: MonitorIssue[],
): Promise<DecisionDay[]> {
  const decisionDays: DecisionDay[] = []

  try {
    const decisionsDir = await docsRoot.getDirectoryHandle("decisions")
    const filenames = await listDecisionFilenames(decisionsDir)

    if (filenames.length === 0) {
      parseIssues.push({
        file: "decisions/",
        message: "No YYYY-MM-DD.json files found in docs/decisions/.",
        severity: "warning",
        scope: "parse",
      })
      return decisionDays
    }

    const parsed = await Promise.all(
      filenames.map(async (filename) => {
        try {
          const raw = await readTextFile(decisionsDir, filename)
          return parseDecisionDayFile(filename, raw)
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`decisions/${filename}`, String(error)),
          )
          return null
        }
      }),
    )

    for (const day of parsed) {
      if (day) {
        decisionDays.push(day)
      }
    }
  } catch {
    parseIssues.push({
      file: "decisions/",
      message:
        'Folder "decisions/" not found. Create docs/decisions/ with YYYY-MM-DD.json.',
      severity: "error",
      scope: "parse",
    })
  }

  return decisionDays
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

    const stories = await mapWithConcurrency(
      filenames,
      USER_STORY_LOAD_CONCURRENCY,
      async (filename) => {
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
      },
    )

    for (const story of stories) {
      if (story) {
        userStories.push(story)
      }
    }
  } catch {
    parseIssues.push({
      file: "us/",
      message: 'Folder "us/" not found.',
      severity: "error",
      scope: "parse",
    })
  }

  return userStories
}

/** Loads phase docs, user stories, epics, and derived board from the opened docs/ folder. */
export async function loadMeridianProject(
  docsRoot: FileSystemDirectoryHandle,
): Promise<MeridianProjectData> {
  const parseIssues: MonitorIssue[] = []
  const storyBodies = new Map<string, string>()
  const epicBodies = new Map<string, string>()
  const versionBodies = new Map<string, string>()

  const [phaseDocuments, userStories, epics, versions, sprints, decisionDays] =
    await Promise.all([
      loadPhaseDocuments(docsRoot, parseIssues),
      loadUserStories(docsRoot, parseIssues, storyBodies),
      loadEpics(docsRoot, parseIssues, epicBodies),
      loadVersions(docsRoot, parseIssues, versionBodies),
      loadSprints(docsRoot, parseIssues),
      loadDecisions(docsRoot, parseIssues),
    ])

  const board = deriveBoardFromStories(userStories)

  phaseDocuments.sort((a, b) => a.id.localeCompare(b.id))

  const protocolIssues = collectProtocolIssues({
    phaseDocuments,
    userStories,
    epics,
    versions,
    sprints,
    storyBodies,
    epicBodies,
    versionBodies,
  })

  return {
    phaseDocuments,
    userStories,
    epics,
    versions,
    sprints,
    decisionDays,
    board,
    storyBodies,
    epicBodies,
    versionBodies,
    issues: [...parseIssues, ...protocolIssues],
  }
}
