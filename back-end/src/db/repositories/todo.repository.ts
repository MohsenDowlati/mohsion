import { query } from "../../config/postgres.js";
import {
  CREATE_TASK,
  DELETE_TASK,
  GET_TASKS_BY_LIST,
  GET_TASKS_BY_WORKSPACE,
  GET_TASK_WITH_WORKSPACE,
  UPDATE_TASK,
} from "../queries/todo.queries.js";

export const createTask = async (
  listId: string,
  title: string,
  description: string | null,
  position: number,
  completed: boolean,
  priority: string,
  createdBy: string
) => {
  const result = await query(CREATE_TASK, [listId, title, description, position, completed, priority, createdBy]);
  return result.rows[0];
};

export const getTasksByList = async (listId: string) => {
  const result = await query(GET_TASKS_BY_LIST, [listId]);
  return result.rows;
};

export const getTasksByWorkspace = async (workspaceId: string) => {
  const result = await query(GET_TASKS_BY_WORKSPACE, [workspaceId]);
  return result.rows;
};

export const updateTask = async (
  id: string,
  listId?: string,
  title?: string,
  description?: string | null,
  position?: number,
  completed?: boolean,
  priority?: string
) => {
  const result = await query(UPDATE_TASK, [
    id,
    listId ?? null,
    title ?? null,
    description ?? null,
    position ?? null,
    completed ?? null,
    priority ?? null
  ]);
  return result.rows[0] ?? null;
};

export const deleteTask = async (id: string) => {
  const result = await query(DELETE_TASK, [id]);
  return result.rows[0] ?? null;
};

export const getTaskWithWorkspace = async (taskId: string) => {
  const result = await query(GET_TASK_WITH_WORKSPACE, [taskId]);
  return result.rows[0] ?? null;
};
