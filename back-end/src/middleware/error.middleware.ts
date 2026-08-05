import type { NextFunction, Request, Response } from "express";

  export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const status = Number(err?.statusCode ?? 500);
    const message = err?.message ?? "Internal Server Error";

    res.status(status).json({ message });
  };
