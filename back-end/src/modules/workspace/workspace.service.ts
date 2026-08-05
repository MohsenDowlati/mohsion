import { getWorkspacesForUser, addWorkspaceMember, getWorkspaceMembership, createWorkspace } from "../../db/repositories/workspace.repository.js";


export const getMyWorkspaces = async (userId: string) => {
    return getWorkspacesForUser(userId);
};

export const createWorkspaceWithOwner = async (name: string, ownerId: string) => {
  const workspace = await createWorkspace(name, ownerId);
  await addWorkspaceMember(workspace.id, ownerId, "owner");
  return workspace;
};

// TODO: debug and improve
export const addMemberToWorkspace = async (userId: string, workspaceID: string, role: string) => {
  const result = await addWorkspaceMember(workspaceID, userId, role);
  return result;
}

export const getMembers = async (ownerId: string, workspaceId: string) => {
  const members = await getWorkspaceMembership(workspaceId,ownerId);
  return members;
}
