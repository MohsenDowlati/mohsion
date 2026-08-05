import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      name: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};