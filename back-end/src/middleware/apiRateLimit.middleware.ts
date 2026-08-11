import type { Request, Response, NextFunction } from "express";
import { apiRateLimiter } from "../config/rateLimiter.js";

export async function apiRateLimit(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const key = req.user
        ? `user:${req.user.id}`
        : `ip:${req.ip}`;

    try {
        const result = await apiRateLimiter.consume(key);

        res.setHeader("X-RateLimit-Limit", "100");
        res.setHeader("X-RateLimit-Remaining", result.remainingPoints);
        res.setHeader(
            "X-RateLimit-Reset",
            Math.ceil((Date.now() + result.msBeforeNext) / 1000),
        );

        next();
    } catch (error: unknown) {
        const rateLimitResult = error as { msBeforeNext?: number };

        if (!rateLimitResult.msBeforeNext) {
            next(error);
            return;
        }

        const retryAfter = Math.ceil(rateLimitResult.msBeforeNext / 1000);

        res.setHeader("Retry-After", retryAfter);
        res.status(429).json({
            message: "Too many requests. Please try again later.",
            retryAfter,
        });
    }
}