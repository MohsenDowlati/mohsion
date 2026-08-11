import { RateLimiterRedis } from "rate-limiter-flexible";
import  redis  from "./redis.js";

export const apiRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "rate-limit:api",
    points: 100,
    duration: 60,
});

export const socketEventRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "rate-limit:socket-events",
    points: 50,
    duration: 1,
    
    blockDuration: 1,
});