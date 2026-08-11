import { clearCached, getCached, setCached } from "./data.cache.js";
import { workspaceListCacheKey } from "./keys.js";

export const getWorkspaceListsCache = <T>(workspaceId: string) => getCached<T>(workspaceListCacheKey(workspaceId));
export const setWorkspaceListsCache = (workspaceId: string, lists: unknown) => setCached(workspaceListCacheKey(workspaceId), lists);
export const clearWorkspaceListsCache = (workspaceId: string) => clearCached(workspaceListCacheKey(workspaceId));
