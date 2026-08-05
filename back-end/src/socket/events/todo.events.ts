import { getIo } from "../io.js";

export const emitWorkspaceEvent = (workspaceId: string, event: string, payload: unknown) => {
  const io = getIo();
  io.to(`workspace:${workspaceId}`).emit(event, payload);
};


  
// TaskCreated
// TaskUpdated
// TaskDeleted
// TaskMoved
// TaskCompleted
// UserTyping
// UserJoined
// UserLeft