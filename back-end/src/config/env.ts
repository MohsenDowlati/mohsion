import dotenv from "dotenv";

dotenv.config();

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
}
  return value;
};

export const PORT = Number(process.env.PORT ?? 3000);

export const DB_HOST = required("POSTGRES_HOST", "localhost");
export const DB_PORT = Number(process.env.POSTGRES_PORT ?? 5432);
export const DB_USER = required("POSTGRES_USER", "postgres");
export const DB_PASSWORD = required("POSTGRES_PASSWORD", "postgres");
export const DB_NAME = required("POSTGRES_DB", "realtime_todo");

export const REDIS_HOST = required("REDIS_HOST", "127.0.0.1");
export const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379);

export const JWT_SECRET = required("JWT_SECRET", "dev-secret-change-me");
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";


