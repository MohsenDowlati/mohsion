const CACHE_NAMESPACE = "realtime-todo"
const CACHE_VERSION = "v1"

export const cacheKeys = {
  userPrefix: (userId: string) =>
    `${CACHE_NAMESPACE}:${CACHE_VERSION}:user:${userId}:`,
  workspaces: (userId: string) =>
    `${CACHE_NAMESPACE}:${CACHE_VERSION}:user:${userId}:workspaces`,
  workspaceBoard: (userId: string, workspaceId: string) =>
    `${CACHE_NAMESPACE}:${CACHE_VERSION}:user:${userId}:workspace:${workspaceId}:board`,
} as const
