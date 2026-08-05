import { query } from "../../config/postgres.js";
import { CREATE_USER, GET_USER_BY_ID, GET_USER_BY_NAME } from "../queries/user.queries.js";

export const createUser = async (name: string, passwordHash: string) => {
    
    const result = await query(CREATE_USER, [name, passwordHash]);
    return result.rows[0];
  };

  export const getUserByName = async (name: string) => {
    const result = await query(GET_USER_BY_NAME, [name]);
    return result.rows[0] ?? null;
  };

  export const getUserById = async (id: string) => {
    const result = await query(GET_USER_BY_ID, [id]);
    return result.rows[0] ?? null;
  };