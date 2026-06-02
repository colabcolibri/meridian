import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="font-heading text-2xl font-semibold text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-xl font-semibold text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-lg font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className={cn(typeScale.body, "text-foreground")}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className={cn(typeScale.body, "list-disc space-y-1 pl-5 text-foreground")}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className={cn(typeScale.body, "list-decimal space-y-1 pl-5 text-foreground")}>
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      className="font-medium text-meridian underline-offset-2 hover:underline"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-meridian-border pl-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-3 font-mono text-sm leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className)
    if (isBlock) {
      return <code className={className}>{children}</code>
    }
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    )
  },
  table: ({ children }) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[280px] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-border last:border-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-medium text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 align-top text-foreground">{children}</td>
  ),
  hr: () => <hr className="my-6 border-border" />,
}

export function MarkdownContent({ body }: { body: string }) {
  return (
    <div className="space-y-4 break-words">
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {body}
      </ReactMarkdown>
    </div>
  )
}
