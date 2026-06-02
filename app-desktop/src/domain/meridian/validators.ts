import type { PhaseDocument, UserStory } from "./types"

export function isDocumentBlocked(document: PhaseDocument, documents: PhaseDocument[]) {
  return document.dependsOn.some((dependencyId) => {
    const dependency = documents.find((item) => item.id === dependencyId)
    return dependency?.status !== "approved"
  })
}

export function getApprovedCount(documents: PhaseDocument[]) {
  return documents.filter((document) => document.status === "approved").length
}

export function getBlockedCount(documents: PhaseDocument[]) {
  return documents.filter((document) => isDocumentBlocked(document, documents)).length
}

export function canStartStory(story: UserStory, stories: UserStory[]) {
  return story.dependsOn.every((dependencyId) => {
    const dependency = stories.find((item) => item.id === dependencyId)
    return dependency?.status === "✅"
  })
}
