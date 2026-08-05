import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { deleteWorkspaceList, getWorkspaceLists, createWorkspaceList, updateWorkspaceList } from "./list.controller.js";

export const listRoutes = Router();
listRoutes.use(authMiddleware);

listRoutes.get("/workspace/:workspaceId", getWorkspaceLists);
listRoutes.post("/workspace/:workspaceId", createWorkspaceList);
listRoutes.patch("/:listId", updateWorkspaceList);
listRoutes.delete("/:listId", deleteWorkspaceList);
