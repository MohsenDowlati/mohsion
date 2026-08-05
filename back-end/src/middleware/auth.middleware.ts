import type { NextFunction, Request, Response } from "express";
  import jwt from "jsonwebtoken";
  import { JWT_SECRET } from "../config/env.js";

  type JwtPayload = {
    id: string;
    name: string;
  };

  export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
        
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: missing token" });
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      req.user = {
        id: decoded.id,
        name: decoded.name,
      };

      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
  };