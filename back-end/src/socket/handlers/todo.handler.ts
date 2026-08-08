import { Socket } from "socket.io";
import {
  createListTask,
  getListTasks,
  getWorkspaceTasks,
  updateListTask,
  removeTask,
} from "../../modules/todo/todo.service.js";
import { getWorkspaceLists } from "../../modules/list/list.service.js";
import { appendOperation, getTaskOperations } from "../../modules/operation/operation.service.js";
import { getIo } from "../io.js";

type Ack = (payload: { success: boolean; [key: string]: unknown }) => void;

type UpdateTaskPayload = {
  list_id?: string;
  title?: string;
  description?: string | null;
  position?: number;
  completed?: boolean;
  priority?: string;
};

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

async function assertListInWorkspaceForUser(
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

async function assertTaskInWorkspaceForUser(
    workspaceId: string,
    taskId: string,
    userId: string
) {
  const tasks = await getWorkspaceTasks(workspaceId, userId);
  const task = tasks.find((item: { id: string }) => item.id === taskId);

  if (!task) {
    const error = new Error("Task not found in workspace");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  return task;
}

export function registerTaskHandlers(socket: Socket) {
  socket.on(
      "task:get-by-list",
      async ({ listId }: { listId: string }, callback?: Ack) => {
        try {
          const userId = getUserId(socket);
          const tasks = await getListTasks(listId, userId);

          callback?.({ success: true, tasks });
        } catch (error) {
          callback?.({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch list tasks",
          });
        }
      }
  );

  socket.on(
      "task:get-by-workspace",
      async ({ workspaceId }: { workspaceId: string }, callback?: Ack) => {
        try {
          const userId = getUserId(socket);
          const tasks = await getWorkspaceTasks(workspaceId, userId);

          await socket.join(workspaceRoom(workspaceId));

          callback?.({ success: true, tasks });
        } catch (error) {
          callback?.({
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to fetch workspace tasks",
          });
        }
      }
  );

  socket.on(
      "task:create",
      async (
          {
            workspaceId,
            listId,
            title,
            description,
            position,
            priority,
          }: {
            workspaceId: string;
            listId: string;
            title: string;
            description: string | null;
            position: number;
            priority: string;
          },
          callback?: Ack
      ) => {
        try {
          const userId = getUserId(socket);

          await assertListInWorkspaceForUser(workspaceId, listId, userId);

          const task = await createListTask(
              listId,
              title,
              description,
              position,
              priority,
              userId
          );

          await appendOperation(task.id, { type: "create", taskId: task.id }, userId);

          getIo().to(workspaceRoom(workspaceId)).emit("task:created", {
            workspaceId,
            task,
          });

          callback?.({ success: true, task });
        } catch (error) {
          callback?.({
            success: false,
            error: error instanceof Error ? error.message : "Failed to create task",
          });
        }
      }
  );

  socket.on(
      "task:update",
      async (
          {
            workspaceId,
            taskId,
            data,
          }: {
            workspaceId: string;
            taskId: string;
            data: UpdateTaskPayload;
          },
          callback?: Ack
      ) => {
        try {
          const userId = getUserId(socket);

          await assertTaskInWorkspaceForUser(workspaceId, taskId, userId);

          if (data.list_id) {
            await assertListInWorkspaceForUser(workspaceId, data.list_id, userId);
          }

          const task = await updateListTask(taskId, data);

          await appendOperation(taskId, { type: "update", taskId, data }, userId);

          getIo().to(workspaceRoom(workspaceId)).emit("task:updated", {
            workspaceId,
            task,
          });

          callback?.({ success: true, task });
        } catch (error) {
          callback?.({
            success: false,
            error: error instanceof Error ? error.message : "Failed to update task",
          });
        }
      }
  );

  socket.on(
      "task:move",
      async (
          {
            workspaceId,
            taskId,
            list_id,
            position,
          }: {
            workspaceId: string;
            taskId: string;
            list_id: string;
            position: number;
          },
          callback?: Ack
      ) => {
        try {
          const userId = getUserId(socket);

          await assertTaskInWorkspaceForUser(workspaceId, taskId, userId);
          await assertListInWorkspaceForUser(workspaceId, list_id, userId);

          const task = await updateListTask(taskId, {
            list_id,
            position,
          });

          await appendOperation(
              taskId,
              { type: "move", taskId, list_id, position },
              userId
          );

          getIo().to(workspaceRoom(workspaceId)).emit("task:moved", {
            workspaceId,
            task,
          });

          callback?.({ success: true, task });
        } catch (error) {
          callback?.({
            success: false,
            error: error instanceof Error ? error.message : "Failed to move task",
          });
        }
      }
  );

  socket.on(
      "task:delete",
      async (
          { workspaceId, taskId }: { workspaceId: string; taskId: string },
          callback?: Ack
      ) => {
        try {
          const userId = getUserId(socket);

          await assertTaskInWorkspaceForUser(workspaceId, taskId, userId);

          await removeTask(taskId);

          await appendOperation(taskId, { type: "delete", taskId }, userId);

          getIo().to(workspaceRoom(workspaceId)).emit("task:deleted", {
            workspaceId,
            taskId,
          });

          callback?.({ success: true, taskId });
        } catch (error) {
          callback?.({
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete task",
          });
        }
      }
  );

  socket.on(
      "task:operations",
      async (
          { workspaceId, taskId }: { workspaceId: string; taskId: string },
          callback?: Ack
      ) => {
        try {
          const userId = getUserId(socket);

          await assertTaskInWorkspaceForUser(workspaceId, taskId, userId);

          const operations = await getTaskOperations(taskId);

          callback?.({ success: true, operations });
        } catch (error) {
          callback?.({
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to fetch task operations",
          });
        }
      }
  );
}
