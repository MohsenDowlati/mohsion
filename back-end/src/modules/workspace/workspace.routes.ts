import {Router} from "express";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import {createInvite, createWorkspace, getMyWorkspaces, getWorkspace, redeemInvite} from "./workspace.controller.js";

export const workspaceRoutes = Router();
workspaceRoutes.use(authMiddleware);
workspaceRoutes.get("/", getMyWorkspaces);
workspaceRoutes.post("/", createWorkspace);
workspaceRoutes.post("/invites/:token/redeem", redeemInvite);
workspaceRoutes.get("/:workspaceId", getWorkspace);
workspaceRoutes.post("/:workspaceId/invites", createInvite);
