import { Socket } from "socket.io";
import {
    createWorkspaceList,
    getWorkspaceLists,
    updateWorkspaceList,
    removeWorkspaceList,
} from "../../modules/list/list.service.js";
import { getIo } from "../io.js";

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

async function assertListBelongsToWorkspaceForUser(
    workspaceId: string,
    listId: string,
    userId: string
) {
    const lists = await getWorkspaceLists(workspaceId, userId);
    const list = lists.find((item: { id: string }) => item.id === listId);

    if (!list) {
        const error = new Error("List not found in workspace");
        (error as Error & { status?: number }).status = 404;
        throw error;
    }

    return list;
}

export function registerListHandlers(socket: Socket) {
    socket.on(
        "list:get",
        async ({ workspaceId }: { workspaceId: string }, callback?: Ack) => {
            try {
                const userId = getUserId(socket);
                const lists = await getWorkspaceLists(workspaceId, userId);

                await socket.join(workspaceRoom(workspaceId));

                callback?.({ success: true, lists });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to fetch lists",
                });
            }
        }
    );

    socket.on(
        "list:create",
        async (
            {
                workspaceId,
                title,
                position,
            }: { workspaceId: string; title: string; position: number },
            callback?: Ack
        ) => {
            try {
                const userId = getUserId(socket);

                const list = await createWorkspaceList(workspaceId, title, position, userId);

                getIo().to(workspaceRoom(workspaceId)).emit("list:created", {
                    workspaceId,
                    list,
                });

                callback?.({ success: true, list });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to create list",
                });
            }
        }
    );

    socket.on(
        "list:update",
        async (
            {
                workspaceId,
                listId,
                title,
                position,
            }: {
                workspaceId: string;
                listId: string;
                title?: string;
                position?: number;
            },
            callback?: Ack
        ) => {
            try {
                const userId = getUserId(socket);

                await assertListBelongsToWorkspaceForUser(workspaceId, listId, userId);

                const list = await updateWorkspaceList(listId, title, position, userId);

                getIo().to(workspaceRoom(workspaceId)).emit("list:updated", {
                    workspaceId,
                    list,
                });

                callback?.({ success: true, list });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to update list",
                });
            }
        }
    );

    socket.on(
        "list:delete",
        async (
            { workspaceId, listId }: { workspaceId: string; listId: string },
            callback?: Ack
        ) => {
            try {
                const userId = getUserId(socket);

                await assertListBelongsToWorkspaceForUser(workspaceId, listId, userId);

                await removeWorkspaceList(listId, userId);

                getIo().to(workspaceRoom(workspaceId)).emit("list:deleted", {
                    workspaceId,
                    listId,
                });

                callback?.({ success: true, listId });
            } catch (error) {
                callback?.({
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to delete list",
                });
            }
        }
    );
}
