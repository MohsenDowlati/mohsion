import { clearCached, getCached, setCached } from "./data.cache.js";
import { userWorkspaceCacheKey, userWorkspacesCacheKey } from "./keys.js";

export const getUserWorkspacesCache = <T>(userId: string) => getCached<T>(userWorkspacesCacheKey(userId));
export const setUserWorkspacesCache = (userId: string, value: unknown) => setCached(userWorkspacesCacheKey(userId), value);
export const getUserWorkspaceCache = <T>(userId: string, workspaceId: string) => getCached<T>(userWorkspaceCacheKey(userId, workspaceId));
export const setUserWorkspaceCache = (userId: string, workspaceId: string, value: unknown) => setCached(userWorkspaceCacheKey(userId, workspaceId), value);
export const clearUserWorkspaceCaches = (userId: string, workspaceId?: string) => clearCached(
  userWorkspacesCacheKey(userId),
  ...(workspaceId ? [userWorkspaceCacheKey(userId, workspaceId)] : []),
);
