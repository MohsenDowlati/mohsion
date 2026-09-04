import jwt from "jsonwebtoken";
import ms, {type StringValue } from "ms";
import {
  getWorkspacesForUser,
  getWorkspaceForUser,
  addWorkspaceMember,
  getWorkspaceMembership,
  createWorkspace,
} from "../../db/repositories/workspace.repository.js";
import {
  JWT_SECRET,
  CLIENT_APP_URL,
  INVITATION_EXPIRES_IN,
} from "../../config/env.js";
import makeError from "../../utils/makeError.js";
import {
  clearUserWorkspaceCaches,
  getUserWorkspaceCache,
  getUserWorkspacesCache,
  setUserWorkspaceCache,
  setUserWorkspacesCache,
} from "../../cache/workspace.cache.js";
import { createShortLink } from "../../features/short-url/short-url.service.js";

export type WorkspaceRole = "owner" | "editor" | "viewer";

export const getMyWorkspaces = async (userId: string) => {
  const cached = await getUserWorkspacesCache<Awaited<ReturnType<typeof getWorkspacesForUser>>>(userId);
  if (cached) return cached;
  const workspaces = await getWorkspacesForUser(userId);
  await setUserWorkspacesCache(userId, workspaces);
  return workspaces;
};

export const getWorkspace = async (workspaceId: string, userId: string) => {
  const cached = await getUserWorkspaceCache<Awaited<ReturnType<typeof getWorkspaceForUser>>>(userId, workspaceId);
  if (cached) return cached;
  const workspace = await getWorkspaceForUser(workspaceId, userId);
  if (!workspace) throw makeError("Workspace not found", 404);
  await setUserWorkspaceCache(userId, workspaceId, workspace);
  return workspace;
};

export const createWorkspaceWithOwner = async (name: string, ownerId: string) => {
  const workspace = await createWorkspace(name, ownerId);
  await addWorkspaceMember(workspace.id, ownerId, "owner");
  await clearUserWorkspaceCaches(ownerId);

  const destinationUrl = `${CLIENT_APP_URL}/workspaces/${workspace.id}`;

  const shortLink = await createShortLink({
    type: "WORKSPACE",
    destinationUrl,
    ownerId,
    workspaceId: workspace.id,
    expiresAt: null,
  });

  return {
    ...workspace,
    my_role: "owner" as const,
    short_url: shortLink.shortUrl,
  };
};

export const requireWorkspaceMember = async (workspaceId: string, userId: string) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (!membership) throw makeError("Forbidden: not a workspace member", 403);
  return membership as { workspace_id: string; user_id: string; role: WorkspaceRole };
};

export const requireWorkspaceEditor = async (workspaceId: string, userId: string) => {
  const membership = await requireWorkspaceMember(workspaceId, userId);
  if (membership.role !== "owner" && membership.role !== "editor")
    throw makeError("Forbidden: edit permission required", 403);
  return membership;
};

export const requireWorkspaceOwner = async (workspaceId: string, userId: string) => {
  const membership = await requireWorkspaceMember(workspaceId, userId);
  if (membership.role !== "owner")
    throw makeError("Forbidden: workspace owner permission required", 403);
  return membership;
};

export const createWorkspaceInvite = async (
    workspaceId: string,
    role: Exclude<WorkspaceRole, "owner">,
    inviterId: string
) => {
  await requireWorkspaceOwner(workspaceId, inviterId);

  const inviteTtl = (INVITATION_EXPIRES_IN || "7d") as StringValue;
  const expiresInMs = typeof inviteTtl === "number" ? inviteTtl : ms(inviteTtl);
  const expiresAt = new Date(Date.now() + expiresInMs);

  const token = jwt.sign(
      { type: "workspace-invite", workspaceId, role },
      JWT_SECRET,
      { expiresIn: inviteTtl }
  );

  const destinationUrl = `${CLIENT_APP_URL}/invites/redeem/${token}`;

  const shortLink = await createShortLink({
    type: "INVITATION",
    destinationUrl,
    ownerId: inviterId,
    workspaceId,
    expiresAt,
  });

  return {
    token,
    role,
    expiresIn: inviteTtl,
    expiresAt,
    short_url: shortLink.shortUrl,
  };
};

export const redeemWorkspaceInvite = async (token: string, userId: string) => {
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    throw makeError("Invalid or expired invite", 400);
  }

  if (
      payload.type !== "workspace-invite" ||
      typeof payload.workspaceId !== "string" ||
      (payload.role !== "editor" && payload.role !== "viewer")
  ) {
    throw makeError("Invalid or expired invite", 400);
  }

  const existingMembership = await getWorkspaceMembership(payload.workspaceId, userId);
  if (!existingMembership) {
    await addWorkspaceMember(payload.workspaceId, userId, payload.role);
    await clearUserWorkspaceCaches(userId, payload.workspaceId);
  }

  return getWorkspace(payload.workspaceId, userId);
};
