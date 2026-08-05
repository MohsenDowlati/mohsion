import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { login, me, register } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, me);