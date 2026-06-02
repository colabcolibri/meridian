import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { ProductVersion, UserStory } from "@/domain/meridian/types"
import {
  allVersionsSelected,
  resolveDefaultSelectedVersions,
  versionIdsFromCatalog,
} from "@/features/monitor/version-filter"

type MonitorVersionFilterContextValue = {
  versionIds: string[]
  selectedVersionIds: ReadonlySet<string>
  allSelected: boolean
  toggleVersion: (versionId: string) => void
  selectAllVersions: () => void
  deselectAllVersions: () => void
}

const MonitorVersionFilterContext =
  createContext<MonitorVersionFilterContextValue | null>(null)

export function MonitorVersionFilterProvider({
  versions,
  stories,
  children,
}: {
  versions: ProductVersion[]
  stories: UserStory[]
  children: ReactNode
}) {
  const versionIds = useMemo(() => versionIdsFromCatalog(versions), [versions])
  const [selectedVersionIds, setSelectedVersionIds] = useState<Set<string>>(
    () => new Set(resolveDefaultSelectedVersions(versions, stories)),
  )

  useEffect(() => {
    if (versionIds.length === 0) {
      setSelectedVersionIds(new Set())
      return
    }

    setSelectedVersionIds((previous) => {
      const pruned = new Set(
        [...previous].filter((versionId) => versionIds.includes(versionId)),
      )

      if (pruned.size > 0) {
        return pruned
      }

      return new Set(resolveDefaultSelectedVersions(versions, stories))
    })
  }, [versionIds, versions, stories])

  const toggleVersion = useCallback((versionId: string) => {
    setSelectedVersionIds((previous) => {
      const next = new Set(previous)

      if (next.has(versionId)) {
        next.delete(versionId)
        return next
      }

      next.add(versionId)
      return next
    })
  }, [])

  const selectAllVersions = useCallback(() => {
    setSelectedVersionIds(new Set(versionIds))
  }, [versionIds])

  const deselectAllVersions = useCallback(() => {
    setSelectedVersionIds(new Set())
  }, [])

  const value = useMemo(
    () => ({
      versionIds,
      selectedVersionIds,
      allSelected: allVersionsSelected(versionIds, selectedVersionIds),
      toggleVersion,
      selectAllVersions,
      deselectAllVersions,
    }),
    [
      deselectAllVersions,
      selectedVersionIds,
      selectAllVersions,
      toggleVersion,
      versionIds,
    ],
  )

  return (
    <MonitorVersionFilterContext.Provider value={value}>
      {children}
    </MonitorVersionFilterContext.Provider>
  )
}

export function useMonitorVersionFilter() {
  const context = useContext(MonitorVersionFilterContext)

  if (!context) {
    throw new Error(
      "useMonitorVersionFilter must be used within MonitorVersionFilterProvider",
    )
  }

  return context
}
