import { query } from "../../config/postgres.js";
import { CREATE_OPERATION, GET_NEXT_TASK_VERSION, GET_OPERATIONS_BY_TASK } from "../queries/operation.queries.js";

export const createOperation = async (
    taskId: string,
    operation: unknown,
    userId: string
  ) => {
    const nextVersionResult = await query(GET_NEXT_TASK_VERSION, [taskId]);
    const version = Number(nextVersionResult.rows[0]?.next_version ?? 1);

    const result = await query(CREATE_OPERATION, [taskId, JSON.stringify(operation), version, userId]);
    return result.rows[0];
  };

  export const getOperationsByTask = async (taskId: string) => {
    const result = await query(GET_OPERATIONS_BY_TASK, [taskId]);
    return result.rows;
  };