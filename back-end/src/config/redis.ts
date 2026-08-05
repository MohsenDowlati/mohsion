import {Redis} from "ioredis";
import logger from "../utils/logger.js";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
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
