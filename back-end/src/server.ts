import http from "http";
import app from "./app.js";
import { PORT } from "./config/env.js";
import { setupSocket } from "./socket/index.js";
import logger from "./utils/logger.js";
import {pool} from "./config/postgres.js"

const server = http.createServer(app);
setupSocket(server);

 try {
    await pool.query("SELECT 1");
    logger.success("DB connected");

    server.listen(3000, () => {
      logger.info(`Server running on http://localhost:${PORT}`)
    });
  } catch (err) {
    logger.error("DB connection failed:", err);
    process.exit(1);
  }