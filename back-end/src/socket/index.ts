import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerConnectionHandler } from "./handlers/connection.handler.js";
import { setIo } from "./io.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, { cors: { origin: "http://localhost:5000", credentials: true } });
  io.use((socket, next) => { try { const token = socket.handshake.auth?.token; if (!token) return next(new Error("Authentication required")); socket.data.user = jwt.verify(token, JWT_SECRET); next(); } catch { next(new Error("Invalid token")); } });
  setIo(io); io.on("connection", registerConnectionHandler); return io;
};
