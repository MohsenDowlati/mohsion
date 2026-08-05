import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";


const credentialsSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(6),
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = credentialsSchema.parse(req.body);
  const result = await authService.register(body.name, body.password);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = credentialsSchema.parse(req.body);
  const result = await authService.login(body.name, body.password);
  res.json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await authService.me(userId);
  res.json(user);
});