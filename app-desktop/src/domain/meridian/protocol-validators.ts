import type { BoardEntry } from "@/domain/meridian/board-types"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { validateStoryBody } from "@/domain/meridian/story-body"
import type {
  Epic,
  PhaseDocument,
  ProductVersion,
  Sprint,
  UserStory,
} from "@/domain/meridian/types"
import { getSetupStepState } from "@/domain/meridian/validators"

export function collectDocumentProtocolIssues(
  documents: PhaseDocument[],
): MonitorIssue[] {
  const issues: MonitorIssue[] = []

  for (const document of documents) {
    if (getSetupStepState(document, documents) === "alert") {
      issues.push({
        file: `${document.id}.md`,
        message: "Documento approved enquanto dependências ainda não estão approved.",
        severity: "error",
        scope: "doc",
        targetId: document.id,
      })
    }
  }

  return issues
}

export function collectStoryProtocolIssues(
  stories: UserStory[],
  storyBodies: Map<string, string>,
): MonitorIssue[] {
  const issues: MonitorIssue[] = []

  for (const story of stories) {
    const body = storyBodies.get(story.id) ?? ""
    const messages = validateStoryBody(story, body)

    for (const message of messages) {
      const isError =
        story.status === "🔶" ||
        story.status === "✅" ||
        message.includes("tests_status: done") ||
        message.includes("tests: none") ||
        message.includes("tests: required")
      issues.push({
        file: `us/${story.id}.md`,
        message,
        severity: isError ? "error" : "warning",
        scope: "us",
        targetId: story.id,
      })
    }
  }

  return issues
}

export function compareBoardWithStories(
  stories: UserStory[],
  board: BoardEntry[],
): MonitorIssue[] {
  const issues: MonitorIssue[] = []
  const storyById = new Map(stories.map((story) => [story.id, story]))
  const boardById = new Map(board.map((entry) => [entry.id, entry]))

  for (const story of stories) {
    const entry = boardById.get(story.id)
    if (!entry) {
      issues.push({
        file: "kanban/board.json",
        message: `${story.id} existe em us/ mas não no board.json.`,
        severity: "warning",
        scope: "board",
        targetId: story.id,
      })
      continue
    }

    if (entry.status !== story.status) {
      issues.push({
        file: "kanban/board.json",
        message: `${story.id}: status no board (${entry.status}) difere do arquivo (${story.status}).`,
        severity: "error",
        scope: "board",
        targetId: story.id,
      })
    }

    if (entry.epic !== story.epic) {
      issues.push({
        file: "kanban/board.json",
        message: `${story.id}: epic no board (${entry.epic}) difere do arquivo (${story.epic}).`,
        severity: "error",
        scope: "board",
        targetId: story.id,
      })
    }

    if (entry.tests !== story.tests) {
      issues.push({
        file: "kanban/board.json",
        message: `${story.id}: tests no board (${entry.tests}) difere do arquivo (${story.tests}).`,
        severity: "error",
        scope: "board",
        targetId: story.id,
      })
    }

    if (entry.tests_status !== story.testsStatus) {
      issues.push({
        file: "kanban/board.json",
        message: `${story.id}: tests_status no board (${entry.tests_status}) difere do arquivo (${story.testsStatus}).`,
        severity: "error",
        scope: "board",
        targetId: story.id,
      })
    }
  }

  for (const entry of board) {
    if (!storyById.has(entry.id)) {
      issues.push({
        file: "kanban/board.json",
        message: `${entry.id} está no board.json sem arquivo em us/.`,
        severity: "warning",
        scope: "board",
        targetId: entry.id,
      })
    }
  }

  return issues
}

export function collectEpicProtocolIssues(
  stories: UserStory[],
  epics: Epic[],
): MonitorIssue[] {
  const epicIds = new Set(epics.map((epic) => epic.id))
  const issues: MonitorIssue[] = []

  for (const story of stories) {
    if (!epicIds.has(story.epic)) {
      issues.push({
        file: `us/${story.id}.md`,
        message: `epic "${story.epic}" não existe em docs/epics/.`,
        severity: "error",
        scope: "us",
        targetId: story.id,
      })
    }
  }

  return issues
}

export function collectVersionProtocolIssues(
  stories: UserStory[],
  epics: Epic[],
  versions: ProductVersion[],
  sprints: Sprint[],
): MonitorIssue[] {
  const versionIds = new Set(versions.map((version) => version.id))
  const storyIds = new Set(stories.map((story) => story.id))
  const issues: MonitorIssue[] = []

  for (const story of stories) {
    if (versionIds.size > 0 && !versionIds.has(story.version)) {
      issues.push({
        file: `us/${story.id}.md`,
        message: `version "${story.version}" não existe em docs/versions/.`,
        severity: "error",
        scope: "us",
        targetId: story.id,
      })
    }
  }

  for (const epic of epics) {
    for (const versionRef of epic.versions) {
      if (versionIds.size > 0 && !versionIds.has(versionRef)) {
        issues.push({
          file: `epics/${epic.id}.md`,
          message: `versions referencia "${versionRef}" inexistente em docs/versions/.`,
          severity: "error",
          scope: "doc",
          targetId: epic.id,
        })
      }
    }
  }

  for (const sprint of sprints) {
    if (versionIds.size > 0 && !versionIds.has(sprint.versionId)) {
      issues.push({
        file: `sprints/${sprint.id}.md`,
        message: `version "${sprint.versionId}" não existe em docs/versions/.`,
        severity: "error",
        scope: "doc",
        targetId: sprint.id,
      })
    }

    for (const storyId of sprint.storyIds) {
      if (!storyIds.has(storyId)) {
        issues.push({
          file: `sprints/${sprint.id}.md`,
          message: `stories referencia "${storyId}" sem arquivo em docs/us/.`,
          severity: "warning",
          scope: "doc",
          targetId: sprint.id,
        })
      }
    }
  }

  return issues
}

export function collectDeliveryGateIssues(
  phaseDocuments: PhaseDocument[],
  userStories: UserStory[],
): MonitorIssue[] {
  if (userStories.length === 0) {
    return []
  }

  const architecture = phaseDocuments.find((doc) => doc.id === "05_architecture")
  if (architecture?.status !== "approved") {
    return [
      {
        file: "05_architecture.md",
        message:
          "User stories existem mas 05_architecture não está approved (gate de entrega).",
        severity: "error",
        scope: "doc",
        targetId: "05_architecture",
      },
    ]
  }

  return []
}

export function collectProtocolIssues(input: {
  phaseDocuments: PhaseDocument[]
  userStories: UserStory[]
  epics: Epic[]
  versions: ProductVersion[]
  sprints: Sprint[]
  storyBodies: Map<string, string>
  board: BoardEntry[] | null
}): MonitorIssue[] {
  return [
    ...collectDocumentProtocolIssues(input.phaseDocuments),
    ...collectDeliveryGateIssues(input.phaseDocuments, input.userStories),
    ...collectStoryProtocolIssues(input.userStories, input.storyBodies),
    ...collectEpicProtocolIssues(input.userStories, input.epics),
    ...collectVersionProtocolIssues(
      input.userStories,
      input.epics,
      input.versions,
      input.sprints,
    ),
    ...(input.board
      ? compareBoardWithStories(input.userStories, input.board)
      : [
          {
            file: "kanban/board.json",
            message: "board.json não encontrado ou inválido.",
            severity: "warning" as const,
            scope: "board" as const,
          },
        ]),
  ]
}

export function countIssuesBySeverity(issues: MonitorIssue[]) {
  const errors = issues.filter((issue) => issue.severity === "error").length
  const warnings = issues.filter((issue) => issue.severity === "warning").length
  return { errors, warnings, total: issues.length }
}

export function issuesForTarget(issues: MonitorIssue[], targetId: string) {
  return issues.filter((issue) => issue.targetId === targetId)
}
