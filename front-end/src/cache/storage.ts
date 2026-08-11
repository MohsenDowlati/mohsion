import type { List } from "@/features/lists/listSlice"
import type { Task } from "@/features/tasks/taskSlice"
import type { Workspace } from "@/types/workspace"
import { cacheKeys } from "./keys"

const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

type CacheEntry<T> = { cachedAt: number; data: T }

export type WorkspaceBoardCache = {
  workspace: Workspace
  lists: List[]
  tasks: Task[]
}

function readEntry<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry = JSON.parse(raw) as Partial<CacheEntry<T>>
    if (
      typeof entry.cachedAt !== "number" ||
      Date.now() - entry.cachedAt > CACHE_MAX_AGE_MS ||
      entry.data === undefined
    ) {
      localStorage.removeItem(key)
      return null
    }
    return entry.data
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

function writeEntry<T>(key: string, data: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ cachedAt: Date.now(), data } satisfies CacheEntry<T>)
    )
  } catch {
    // The network remains authoritative if browser storage is unavailable.
  }
}

export const frontendCache = {
  readWorkspaces: (userId: string) =>
    readEntry<Workspace[]>(cacheKeys.workspaces(userId)),

  writeWorkspaces: (userId: string, workspaces: Workspace[]) =>
    writeEntry(cacheKeys.workspaces(userId), workspaces),

  readWorkspaceBoard(userId: string, workspaceId: string) {
    const board = readEntry<WorkspaceBoardCache>(
      cacheKeys.workspaceBoard(userId, workspaceId)
    )
    return board?.workspace.id === workspaceId &&
      Array.isArray(board.lists) &&
      Array.isArray(board.tasks)
      ? board
      : null
  },

  writeWorkspaceBoard(
    userId: string,
    workspaceId: string,
    board: WorkspaceBoardCache
  ) {
    writeEntry(cacheKeys.workspaceBoard(userId, workspaceId), board)
  },

  clearUser(userId: string) {
    if (typeof window === "undefined") return
    const prefix = cacheKeys.userPrefix(userId)
    const keys: string[] = []
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      if (key?.startsWith(prefix)) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
  },
}
