import { Socket } from "socket.io";
import { registerWorkspaceHandlers } from "./workspace.handler.js";
import { registerListHandlers } from "./list.handler.js";
import { registerTaskHandlers } from "./todo.handler.js";

export function registerConnectionHandler(socket: Socket) {
  registerWorkspaceHandlers(socket);
  registerListHandlers(socket);
  registerTaskHandlers(socket);
}