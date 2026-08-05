import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as todoService from "./todo.service.js";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  position: z.number().int().nonnegative().default(0),
  priority: z.string().min(1),
});

const updateTaskSchema = z.object({
  list_id: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  position: z.number().int().nonnegative().optional(),
  completed: z.boolean().optional(),
  priority: z.string().min(1).optional(),
});

export const getListTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  if (typeof req.params.listId !== "string") {
      throw new Error("invalid ID");
  }
  const data = await todoService.getListTasks(req.params.listId, userId);
  res.json(data);
});

export const getWorkspaceTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  if (typeof req.params.workspaceId !== "string") {
      throw new Error("invalid ID");
  }
  const data = await todoService.getWorkspaceTasks(req.params.workspaceId, userId);
  res.json(data);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const body = taskSchema.parse(req.body);
  if (typeof req.params.listId !== "string") {
      throw new Error("invalid ID");
  }
  const data = await todoService.createListTask(
    req.params.listId,
    body.title,
    body.description ?? null,
    body.position,
    body.priority,
    userId
  );
  res.status(201).json(data);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const body = updateTaskSchema.parse(req.body);
  if (typeof req.params.taskId !== "string") {
      throw new Error("invalid ID");
  }
  const data = await todoService.updateListTask(req.params.taskId, body);
  res.json(data);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  if (typeof req.params.taskId !== "string") {
      throw new Error("invalid ID");
  }
  const data = await todoService.removeTask(req.params.taskId);
  res.json(data);
});
