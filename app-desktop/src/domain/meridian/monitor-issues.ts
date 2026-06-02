export type MonitorIssueSeverity = "error" | "warning"
export type MonitorIssueScope = "parse" | "doc" | "us" | "board"

export interface MonitorIssue {
  file: string
  message: string
  severity: MonitorIssueSeverity
  scope: MonitorIssueScope
  targetId?: string
}
