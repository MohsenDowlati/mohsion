import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerConnectionHandler } from "./handlers/connection.handler.js";
import { setIo } from "./io.js";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  setIo(io);

  io.on("connection", (socket) => {
    registerConnectionHandler(socket);
  });

  return io;
};