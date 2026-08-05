import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { createOperation, getTaskOperations } from "./operation.controller.js";


const router = Router();
router.use(authMiddleware);


router.get("/task/:taskId/operations", getTaskOperations);
router.post("/task/:taskId/operations", createOperation);

export default router;