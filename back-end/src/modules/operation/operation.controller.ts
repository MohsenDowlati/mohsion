import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as operationService from "./operation.service.js";

const operationSchema = z.object({
  operation: z.any(),
});

export const createOperation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const body = operationSchema.parse(req.body);
  if (typeof req.params.taskId !== "string") {
        throw new Error("invalid ID");
    }
  const data = await operationService.appendOperation(req.params.taskId, body.operation, userId);
  res.status(201).json(data);
});

export const getTaskOperations = asyncHandler(async (req: Request, res: Response) => {
  if (typeof req.params.taskId !== "string") {
      throw new Error("invalid ID");
  }
  const data = await operationService.getTaskOperations(req.params.taskId);
  res.json(data);
});