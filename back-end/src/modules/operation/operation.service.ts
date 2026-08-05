import { getOperationsByTask, createOperation } from "../../db/repositories/operation.repository.js";

export const appendOperation = async (taskId: string, operation: unknown, userId: string) => {
  return createOperation(taskId, operation, userId);
};

export const getTaskOperations = async (taskId: string) => {
  return getOperationsByTask(taskId);
};