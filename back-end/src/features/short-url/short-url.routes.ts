import { Router } from "express";
import { redirectShortLink } from "./short-url.controller.js";

const router = Router();

router.get("/:code", redirectShortLink);

export default router;
