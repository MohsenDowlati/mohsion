import { query } from "../../config/postgres.js";
import { CREATE_WORKSPACE, ADD_WORKSPACE_MEMBER, GET_WORKSPACES_FOR_USER, GET_WORKSPACE_MEMBERSHIP } from "../queries/workspace.queries.js";

export const createWorkspace = async (name: string, ownerId: string) => {
    const result = await query(CREATE_WORKSPACE, [name, ownerId]);
    return result.rows[0];
  };

  export const addWorkspaceMember = async (workspaceId: string, userId: string, role: string) => {
    const result = await query(ADD_WORKSPACE_MEMBER, [workspaceId, userId, role]);
    return result.rows[0] ?? null;
  };

  export const getWorkspacesForUser = async (userId: string) => {
    const result = await query(GET_WORKSPACES_FOR_USER, [userId]);
    return result.rows;
  };

  export const getWorkspaceMembership = async (workspaceId: string, userId: string) => {
    const result = await query(GET_WORKSPACE_MEMBERSHIP, [workspaceId, userId]);
    return result.rows[0] ?? null;
  };