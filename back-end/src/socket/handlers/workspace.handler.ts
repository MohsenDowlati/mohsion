import { Socket } from "socket.io";
import { createWorkspaceWithOwner, getMyWorkspaces, requireWorkspaceMember } from "../../modules/workspace/workspace.service.js";
type Ack = (payload: { success: boolean; [key: string]: unknown }) => void;
const room = (workspaceId: string) => `workspace:${workspaceId}`;
const getUserId = (socket: Socket) => { const id = socket.data.user?.id; if (!id) throw new Error("Unauthenticated socket"); return id as string; };
export function registerWorkspaceHandlers(socket: Socket) {
  socket.on("workspace:list", async (_payload, callback?: Ack) => { try { callback?.({ success: true, workspaces: await getMyWorkspaces(getUserId(socket)) }); } catch (error) { callback?.({ success: false, error: error instanceof Error ? error.message : "Failed" }); } });
  socket.on("workspace:create", async ({ name }: { name: string }, callback?: Ack) => { try { const workspace = await createWorkspaceWithOwner(name, getUserId(socket)); await socket.join(room(workspace.id)); callback?.({ success: true, workspace }); } catch (error) { callback?.({ success: false, error: error instanceof Error ? error.message : "Failed" }); } });
  socket.on("workspace:join", async ({ workspaceId }: { workspaceId: string }, callback?: Ack) => { try { await requireWorkspaceMember(workspaceId, getUserId(socket)); await socket.join(room(workspaceId)); callback?.({ success: true, workspaceId }); } catch (error) { callback?.({ success: false, error: error instanceof Error ? error.message : "Failed" }); } });
  socket.on("workspace:leave", async ({ workspaceId }: { workspaceId: string }) => { await socket.leave(room(workspaceId)); });
}
