import { clearCached, getCached, setCached } from "./data.cache.js";
import { listTaskCacheKey, workspaceTaskCacheKey } from "./keys.js";

export const getListTasksCache = <T>(listId: string) => getCached<T>(listTaskCacheKey(listId));
export const setListTasksCache = (listId: string, tasks: unknown) => setCached(listTaskCacheKey(listId), tasks);
export const getWorkspaceTasksCache = <T>(workspaceId: string) => getCached<T>(workspaceTaskCacheKey(workspaceId));
export const setWorkspaceTasksCache = (workspaceId: string, tasks: unknown) => setCached(workspaceTaskCacheKey(workspaceId), tasks);
export const clearTaskCaches = (workspaceId: string, ...listIds: Array<string | undefined>) => clearCached(
  workspaceTaskCacheKey(workspaceId),
  ...[...new Set(listIds.filter((id): id is string => Boolean(id)))].map(listTaskCacheKey),
);
