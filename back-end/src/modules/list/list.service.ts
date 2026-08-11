import { createList, getListsByWorkspace, getListWithWorkspace, updateList, deleteList } from "../../db/repositories/list.repository.js";
import { requireWorkspaceEditor, requireWorkspaceMember } from "../workspace/workspace.service.js";
import makeError from "../../utils/makeError.js";
import { clearWorkspaceListsCache, getWorkspaceListsCache, setWorkspaceListsCache } from "../../cache/list.cache.js";
import { clearTaskCaches } from "../../cache/todo.cache.js";

export const getListWorkspace = async (listId: string) => { const list = await getListWithWorkspace(listId); if (!list) throw makeError("List not found", 404); return list as { id: string; workspace_id: string }; };
export const createWorkspaceList = async (workspaceId: string, title: string, position: number, userId: string) => { await requireWorkspaceEditor(workspaceId, userId); const list = await createList(workspaceId, title, position); await clearWorkspaceListsCache(workspaceId); return list; };
export const getWorkspaceLists = async (workspaceId: string, userId: string) => { await requireWorkspaceMember(workspaceId, userId); const cached = await getWorkspaceListsCache<Awaited<ReturnType<typeof getListsByWorkspace>>>(workspaceId); if (cached) return cached; const lists = await getListsByWorkspace(workspaceId); await setWorkspaceListsCache(workspaceId, lists); return lists; };
export const updateWorkspaceList = async (listId: string, title: string | undefined, position: number | undefined, userId: string) => { const info = await getListWorkspace(listId); await requireWorkspaceEditor(info.workspace_id, userId); const list = await updateList(listId, title, position); if (!list) throw makeError("List not found", 404); await clearWorkspaceListsCache(info.workspace_id); return list; };
export const removeWorkspaceList = async (listId: string, userId: string) => { const info = await getListWorkspace(listId); await requireWorkspaceEditor(info.workspace_id, userId); const list = await deleteList(listId); if (!list) throw makeError("List not found", 404); await Promise.all([clearWorkspaceListsCache(info.workspace_id), clearTaskCaches(info.workspace_id, listId)]); return list; };
