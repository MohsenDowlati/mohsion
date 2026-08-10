import { createList, getListsByWorkspace, getListWithWorkspace, updateList, deleteList } from "../../db/repositories/list.repository.js";
import { requireWorkspaceEditor, requireWorkspaceMember } from "../workspace/workspace.service.js";
import makeError from "../../utils/makeError.js";
export const getListWorkspace = async (listId: string) => { const list = await getListWithWorkspace(listId); if (!list) throw makeError("List not found", 404); return list as { id: string; workspace_id: string }; };
export const createWorkspaceList = async (workspaceId: string, title: string, position: number, userId: string) => { await requireWorkspaceEditor(workspaceId, userId); return createList(workspaceId, title, position); };
export const getWorkspaceLists = async (workspaceId: string, userId: string) => { await requireWorkspaceMember(workspaceId, userId); return getListsByWorkspace(workspaceId); };
export const updateWorkspaceList = async (listId: string, title: string | undefined, position: number | undefined, userId: string) => { const info = await getListWorkspace(listId); await requireWorkspaceEditor(info.workspace_id, userId); const list = await updateList(listId, title, position); if (!list) throw makeError("List not found", 404); return list; };
export const removeWorkspaceList = async (listId: string, userId: string) => { const info = await getListWorkspace(listId); await requireWorkspaceEditor(info.workspace_id, userId); const list = await deleteList(listId); if (!list) throw makeError("List not found", 404); return list; };
