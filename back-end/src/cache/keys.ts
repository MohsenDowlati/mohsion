export const workspaceRoom = (workspaceId: string) =>
    `workspace:${workspaceId}`;

export const workspacePresenceUsersKey = (workspaceId: string) =>
    `presence:workspace:${workspaceId}:users`;

export const workspaceUserSocketsKey = (
    workspaceId: string,
    userId: string,
) => `presence:workspace:${workspaceId}:user:${userId}:sockets`;

export const socketWorkspacesKey = (socketId: string) =>
    `socket:${socketId}:workspaces`;

export const socketUserKey = (socketId: string) =>
    `socket:${socketId}:user`;

export const typingKey = (
    workspaceId: string,
    taskId: string,
    userId: string,
    field = "general",
) =>
    `typing:workspace:${workspaceId}:task:${taskId}:user:${userId}:field:${field}`;

export const typingPattern = (workspaceId: string, taskId: string) =>
    `typing:workspace:${workspaceId}:task:${taskId}:user:*:field:*`;

export const editingKey = (workspaceId: string, taskId: string) =>
    `editing:workspace:${workspaceId}:task:${taskId}`;

const dataCachePrefix = "cache:v1";
export const workspaceListCacheKey = (workspaceId: string) => `${dataCachePrefix}:workspace:${workspaceId}:lists`;
export const workspaceTaskCacheKey = (workspaceId: string) => `${dataCachePrefix}:workspace:${workspaceId}:tasks`;
export const listTaskCacheKey = (listId: string) => `${dataCachePrefix}:list:${listId}:tasks`;
export const userWorkspacesCacheKey = (userId: string) => `${dataCachePrefix}:user:${userId}:workspaces`;
export const userWorkspaceCacheKey = (userId: string, workspaceId: string) => `${dataCachePrefix}:user:${userId}:workspace:${workspaceId}`;
export const shortLinkCacheKey = (code: string) => `${dataCachePrefix}:short-link:${code}`;
