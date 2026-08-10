import jwt from "jsonwebtoken";
import { getWorkspacesForUser, getWorkspaceForUser, addWorkspaceMember, getWorkspaceMembership, createWorkspace } from "../../db/repositories/workspace.repository.js";
import { JWT_SECRET } from "../../config/env.js";
import makeError from "../../utils/makeError.js";

export type WorkspaceRole = "owner" | "editor" | "viewer";
export const getMyWorkspaces = (userId: string) => getWorkspacesForUser(userId);
export const getWorkspace = async (workspaceId: string, userId: string) => {
  const workspace = await getWorkspaceForUser(workspaceId, userId);
  if (!workspace) throw makeError("Workspace not found", 404);
  return workspace;
};
export const createWorkspaceWithOwner = async (name: string, ownerId: string) => {
  const workspace = await createWorkspace(name, ownerId);
  await addWorkspaceMember(workspace.id, ownerId, "owner");
  return { ...workspace, my_role: "owner" as const };
};
export const requireWorkspaceMember = async (workspaceId: string, userId: string) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (!membership) throw makeError("Forbidden: not a workspace member", 403);
  return membership as { workspace_id: string; user_id: string; role: WorkspaceRole };
};
export const requireWorkspaceEditor = async (workspaceId: string, userId: string) => {
  const membership = await requireWorkspaceMember(workspaceId, userId);
  if (membership.role !== "owner" && membership.role !== "editor") throw makeError("Forbidden: edit permission required", 403);
  return membership;
};
export const requireWorkspaceOwner = async (workspaceId: string, userId: string) => {
  const membership = await requireWorkspaceMember(workspaceId, userId);
  if (membership.role !== "owner") throw makeError("Forbidden: workspace owner permission required", 403);
  return membership;
};
export const createWorkspaceInvite = async (workspaceId: string, role: Exclude<WorkspaceRole, "owner">, inviterId: string) => {
  await requireWorkspaceOwner(workspaceId, inviterId);
  const token = jwt.sign({ type: "workspace-invite", workspaceId, role }, JWT_SECRET, { expiresIn: "7d" });
  return { token, role, expiresIn: "7d" };
};
export const redeemWorkspaceInvite = async (token: string, userId: string) => {
  let payload: jwt.JwtPayload;
  try { payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; }
  catch { throw makeError("Invalid or expired invite", 400); }
  if (payload.type !== "workspace-invite" || typeof payload.workspaceId !== "string" || (payload.role !== "editor" && payload.role !== "viewer")) throw makeError("Invalid or expired invite", 400);
  await addWorkspaceMember(payload.workspaceId, userId, payload.role);
  return getWorkspace(payload.workspaceId, userId);
};
