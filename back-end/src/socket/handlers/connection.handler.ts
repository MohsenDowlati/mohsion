import type { Socket } from "socket.io";
import { registerTodoEvents } from "./todo.handler.js";

export const registerConnectionHandler = (socket: Socket) => {
  registerTodoEvents(socket);
};