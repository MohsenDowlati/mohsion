import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { createWorkspace, getMyWorkspaces, addMember } from "./workspace.controller.js";


export const workspaceRoutes = Router();
workspaceRoutes.use(authMiddleware);

workspaceRoutes.get("/", getMyWorkspaces);
workspaceRoutes.post("/", createWorkspace);
// TODO: remove members
workspaceRoutes.post("/membership", addMember);