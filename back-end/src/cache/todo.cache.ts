import redis from "../config/redis.js";
import { TODO_LIST } from "./keys.js";

export const getTodosCache = async (userId: string) => {
  const data = await redis.get(TODO_LIST(userId));
  return data ? JSON.parse(data) : null;
};

export const setTodosCache = async (
  userId: string,
  todos: unknown
) => {
  await redis.set(
    TODO_LIST(userId),
    JSON.stringify(todos),
    "EX",
    60
  );
};

export const clearTodosCache = async (userId: string) => {
  await redis.del(TODO_LIST(userId));
};
