import { Socket } from "socket.io";
import {
    getMyWorkspaces,
    createWorkspaceWithOwner,
    addMemberToWorkspace,
    getMembers,
} from "../../modules/workspace/workspace.service.js";

type Ack = (payload: { success: boolean; [key: string]: unknown }) => void;

function getUserId(socket: Socket): string {
    const userId = socket.data.user?.id;
    if (!userId) {
        throw new Error("Unauthenticated socket");
    }
    return userId;
}

function workspaceRoom(workspaceId: string) {
    return `workspace:${workspaceId}`;
}

export function registerWorkspaceHandlers(socket: Socket) {
    socket.on("workspace:list", async (_payload, callback?: Ack) => {
        try {
            const userId = getUserId(socket);
            const workspaces = await getMyWorkspaces(userId);
            callback?.({ success: true, workspaces });
        } catch (error) {
            callback?.({
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch workspaces",
            });
        }
    });

    socket.on(
        "workspace:create",
        async ({ name }: { name: string }, callback?: Ack) => {
            try {
                const userId = getUserId(socket);

                const workspace = await createWorkspaceWithOwner(name, userId);

                // Owner is already added by createWorkspaceWithOwner(...)
                await socket.join(workspaceRoom(workspace.id));

                callback?.({ success: true, workspace });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to create workspace",
                });
            }
        }
    );

    socket.on(
        "workspace:join",
        async ({ workspaceId }: { workspaceId: string }, callback?: Ack) => {
            try {
                const userId = getUserId(socket);

                // This also acts as a membership check according to your service
                await getMembers(userId, workspaceId);

                await socket.join(workspaceRoom(workspaceId));

                callback?.({ success: true, workspaceId });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to join workspace room",
                });
            }
        }
    );

    socket.on(
        "workspace:add-member",
        async (
            {
                workspaceId,
                memberId,
                role,
            }: { workspaceId: string; memberId: string; role: string },
            callback?: Ack
        ) => {
            try {
                const userId = getUserId(socket);

                // Uses your current service as authorization gate
                await getMembers(userId, workspaceId);

                const member = await addMemberToWorkspace(memberId, workspaceId, role);

                socket.to(workspaceRoom(workspaceId)).emit("workspace:member-added", {
                    workspaceId,
                    member,
                });

                callback?.({ success: true, member });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to add member",
                });
            }
        }
    );
}
