import redis from "../config/redis.js";
import logger from "../utils/logger.js";

const TTL_SECONDS = 60;

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    if (value === null) return null;
    try { return JSON.parse(value) as T; }
    catch { await redis.del(key); return null; }
  } catch (error) {
    logger.warn(`Cache read failed for ${key}`, error);
    return null;
  }
}

export async function setCached(
    key: string,
    value: unknown,
    ttl: number = TTL_SECONDS
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    logger.warn(`Cache write failed for ${key}`, error);
  }
}

export async function clearCached(...keys: string[]): Promise<void> {
  if (!keys.length) return;
  try { await redis.del(...keys); }
  catch (error) { logger.warn(`Cache invalidation failed for ${keys.join(", ")}`, error); }
}
