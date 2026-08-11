// src/socket/registerSocketRateLimit.ts
import type { Socket } from "socket.io";
import { socketEventRateLimiter } from "../config/rateLimiter.js";

export function registerSocketRateLimit(socket: Socket): void {
    socket.use(async (packet, next) => {
        const [eventName] = packet;

        if (eventName === "ping") {
            return next();
        }

        const userId = socket.data.user?.id;
        const key = userId
            ? `user:${userId}`
            : `socket:${socket.id}`;

        try {
            const result = await socketEventRateLimiter.consume(key);

            socket.data.socketRateLimit = {
                remaining: result.remainingPoints,
                resetInMs: result.msBeforeNext,
            };

            next();
        } catch (error: unknown) {
            const rateLimitResult = error as { msBeforeNext?: number };

            if (!rateLimitResult.msBeforeNext) {
                console.error("Socket rate-limiter error:", error);
                return next();
            }

            const retryAfter = Math.ceil(rateLimitResult.msBeforeNext / 1000);

            const socketError = new Error("RATE_LIMITED");
            (socketError as Error & { data?: unknown }).data = {
                message: "Too many real-time events. Slow down.",
                retryAfter,
                limit: 50,
                windowSeconds: 1,
            };

            next(socketError);
        }
    });
}
