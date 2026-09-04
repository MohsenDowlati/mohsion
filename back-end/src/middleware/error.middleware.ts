import type { NextFunction, Request, Response } from "express";
import {
  ShortLinkDisabledError,
  ShortLinkExpiredError,
  ShortLinkNotFoundError
} from "../features/short-url/short-url.errors.js";

  export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof ShortLinkNotFoundError) {
      return res.status(404).json({
        error: err.code,
        message: err.message,
      });
    }

    if (err instanceof ShortLinkExpiredError) {
      return res.status(410).json({
        error: err.code,
        message: err.message,
      });
    }

    if (err instanceof ShortLinkDisabledError) {
      return res.status(410).json({
        error: err.code,
        message: err.message,
      });
    }

    console.error(err);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  };
