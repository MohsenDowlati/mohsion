import { createList, getListsByWorkspace, updateList, deleteList} from "../../db/repositories/list.repository.js";
import { getWorkspaceMembership } from "../../db/repositories/workspace.repository.js";
import makeError from "../../utils/makeError.js";



export const ensureWorkspaceMember = async (workspaceId: string, userId: string) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (!membership) throw makeError("Forbidden: not a workspace member", 403);
  return membership;
};
export const createWorkspaceList = async (
  workspaceId: string,
  title: string,
  position: number,
  userId: string
) => {
  await ensureWorkspaceMember(workspaceId, userId);
  return createList(workspaceId, title, position);
};

export const getWorkspaceLists = async (workspaceId: string, userId: string) => {
  await ensureWorkspaceMember(workspaceId, userId);
  return getListsByWorkspace(workspaceId);
};

export const updateWorkspaceList = async (
  listId: string,
  title: string | undefined,
  position: number | undefined
) => {
  const list = await updateList(listId, title, position);
  if (!list) throw makeError("List not found", 404);
  return list;
};

export const removeWorkspaceList = async (listId: string) => {
  const list = await deleteList(listId);
  if (!list) throw makeError("List not found", 404);
  return list;
};