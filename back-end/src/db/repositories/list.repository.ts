import { query } from "../../config/postgres.js";
import { CREATE_LIST, GET_LISTS_BY_WORKSPACE, GET_LIST_WITH_WORKSPACE, UPDATE_LIST, DELETE_LIST } from "../queries/list.queries.js";

export const createList = async (workspaceId: string, title: string, position: number) => {
    const result = await query(CREATE_LIST, [workspaceId, title, position]);
    return result.rows[0];
  };

  export const getListsByWorkspace = async (workspaceId: string) => {
    const result = await query(GET_LISTS_BY_WORKSPACE, [workspaceId]);
    return result.rows;
  };

  export const getListWithWorkspace = async (listId: string) => {
    const result = await query(GET_LIST_WITH_WORKSPACE, [listId]);
    return result.rows[0] ?? null;
  };

  export const updateList = async (id: string, title?: string, position?: number) => {
    const result = await query(UPDATE_LIST, [id, title ?? null, position ?? null]);
    return result.rows[0] ?? null;
  };

  export const deleteList = async (id: string) => {
    const result = await query(DELETE_LIST, [id]);
    return result.rows[0] ?? null;
  };