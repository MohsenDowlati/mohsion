import type { Socket } from "socket.io";

export const registerTodoEvents = (socket: Socket) => {
  socket.on("workspace:join", (workspaceId: string) => {
    socket.join(`workspace:${workspaceId}`);
  });
  socket.on("workspace:leave", (workspaceId: string) => {
    socket.leave(`workspace:${workspaceId}`);
  });
};