import {
    createTask,
    deleteTask,
    updateTask,
    getTasksByList,
    getTasksByWorkspace,
  } from "../../db/repositories/todo.repository.js";
import { getListWithWorkspace } from "../../db/repositories/list.repository.js";
import { getWorkspaceMembership } from "../../db/repositories/workspace.repository.js";
import makeError from "../../utils/makeError.js";

const ensureWorkspaceMember = async (workspaceId: string, userId: string) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (!membership) throw makeError("Forbidden: not a workspace member", 403);
};

export const createListTask = async (
  listId: string,
  title: string,
  description: string | null,
  position: number,
  priority: string,
  createdBy: string
) => {
  return createTask(listId, title, description, position, false, priority, createdBy);
};

export const getListTasks = async (listId: string, userId: string) => {
  const list = await getListWithWorkspace(listId);
  if (!list) throw makeError("List not found", 404);
  await ensureWorkspaceMember(list.workspace_id, userId);
  return getTasksByList(listId);
};

export const getWorkspaceTasks = async (workspaceId: string, userId: string) => {
  await ensureWorkspaceMember(workspaceId, userId);
  return getTasksByWorkspace(workspaceId);
};

export const updateListTask = async (
  taskId: string,
  data: {
    list_id?: string | undefined;
    title?: string | undefined;
    description?: string | null | undefined;
    position?: number | undefined;
    completed?: boolean | undefined;
    priority?: string | undefined;
  }
) => {
  const task = await updateTask(
    taskId,
    data.list_id,
    data.title,
    data.description,
    data.position,
    data.completed,
    data.priority
  );
  if (!task) throw makeError("Task not found", 404);
  return task;
};

export const removeTask = async (taskId: string) => {
  const task = await deleteTask(taskId);
  if (!task) throw makeError("Task not found", 404);
  return task;
};
