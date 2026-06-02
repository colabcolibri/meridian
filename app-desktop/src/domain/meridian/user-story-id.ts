/** US-0001 … US-99999 (4–5 digits, zero-padded). */
export const USER_STORY_ID_PATTERN = /^US-\d{4,5}$/i

export const USER_STORY_FILENAME_PATTERN = /^US-\d{4,5}\.md$/i

export function parseUserStoryNumber(id: string): number {
  const match = id.match(/^US-(\d{4,5})$/i)
  if (!match) {
    return 0
  }
  return Number.parseInt(match[1], 10)
}

export function compareUserStoryIds(a: string, b: string): number {
  return parseUserStoryNumber(a) - parseUserStoryNumber(b)
}
