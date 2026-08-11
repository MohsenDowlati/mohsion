import { Socket } from "socket.io";
import { registerWorkspaceHandlers } from "./workspace.handler.js";
import { registerListHandlers } from "./list.handler.js";
import { registerTaskHandlers } from "./todo.handler.js";
import {registerSocketRateLimit} from "../../middleware/registerSocketRateLimit.middleware.js";

export function registerConnectionHandler(socket: Socket) {
  registerSocketRateLimit(socket);
  registerWorkspaceHandlers(socket);
  registerListHandlers(socket);
  registerTaskHandlers(socket);
}