import { Redis } from "ioredis";
import { REDIS_URL } from "./env.js";
import logger from "../utils/logger.js";

const redis = new Redis(REDIS_URL, {
  connectTimeout: 10_000,
  maxRetriesPerRequest: 3,
});

redis.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

redis.on("ready", () => {
  logger.info("Redis ready");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

redis.on("end", () => {
  logger.warn("Redis connection closed");
});

export default redis;
