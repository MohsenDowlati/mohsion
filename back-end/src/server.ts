import http from "http";
import app from "./app.js";
import { PORT } from "./config/env.js";
import { setupSocket } from "./socket/index.js";
import logger from "./utils/logger.js";
import { pool } from "./config/postgres.js";
import redis from "./config/redis.js";

const server = http.createServer(app);
setupSocket(server);

try {
  await Promise.all([
    pool.query("SELECT 1"),
    redis.ping(),
  ]);
  logger.success("DB connected");
  logger.success("Redis connected");

  server.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  logger.error("Service connection failed:", err);
  process.exit(1);
}