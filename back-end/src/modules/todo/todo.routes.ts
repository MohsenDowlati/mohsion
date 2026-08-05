import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getListTasks,
  getWorkspaceTasks,
  updateTask,
} from "./todo.controller.js";

export const taskRoutes = Router();

taskRoutes.use(authMiddleware);



taskRoutes.get("/workspace/:workspaceId", getWorkspaceTasks);
taskRoutes.get("/:listId", getListTasks);
taskRoutes.post("/:listId", createTask);
taskRoutes.patch("/task/:taskId", updateTask);
taskRoutes.delete("/task/:taskId", deleteTask);
