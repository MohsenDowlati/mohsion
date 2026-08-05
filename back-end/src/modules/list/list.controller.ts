import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as listService from "./list.service.js";

const listSchema = z.object({
  title: z.string().min(1),
  position: z.number().int().nonnegative().default(0),
});

const updateListSchema = z.object({
    title: z.string().min(1).optional(),
    position: z.number().int().nonnegative().optional(),
});

export const getWorkspaceLists = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { workspaceId } = req.params;

    if (typeof workspaceId !== "string") {
        throw new Error("invalid ID");
    }
    const data = await listService.getWorkspaceLists(workspaceId, userId);
    res.json(data);
});
    
export const createWorkspaceList = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { workspaceId } = req.params;
    const body = listSchema.parse(req.body);

    if (typeof workspaceId !== "string") {
        throw new Error("invalid ID");
    }

    const data = await listService.createWorkspaceList(workspaceId, body.title, body.position, userId);
    res.status(201).json(data);
});
    
export const updateWorkspaceList = asyncHandler(async (req: Request, res: Response) => {
    const body = updateListSchema.parse(req.body);
    if (typeof req.params.listId !== "string") {
        throw new Error("invalid ID");
    }
    const data = await listService.updateWorkspaceList(req.params.listId, body.title, body.position);
    res.json(data);
});
    
export const deleteWorkspaceList = asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.params.listId !== "string") {
        throw new Error("invalid ID");
    }
    const data = await listService.removeWorkspaceList(req.params.listId);
    res.json(data);
});