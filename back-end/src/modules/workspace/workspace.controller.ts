import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as workspaceService from './workspace.service.js';

const workspaceSchema = z.object({ name: z.string().min(1) });
const memberSchema = z.object({
  workId: z.string(),
  userId: z.string(),
  role: z.string(),
});
  

export const getMyWorkspaces = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const data = await workspaceService.getMyWorkspaces(userId);
  res.json(data);
});

export const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const body = workspaceSchema.parse(req.body);
  const data = await workspaceService.createWorkspaceWithOwner(body.name, userId);
  res.status(201).json(data);
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const body = memberSchema.parse(req.body);
  const data = await workspaceService.addMemberToWorkspace(body.userId, body.workId, body.role);
  res.status(201).json(data);
})