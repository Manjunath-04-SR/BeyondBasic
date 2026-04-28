import express from "express";
import { compileCode } from "../controllers/compile.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";

const router = express.Router();
router.post("/", protect, compileCode);

export default router;
