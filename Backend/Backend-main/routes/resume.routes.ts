import express from "express";
import { analyzeResume } from "../controllers/resume.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";

const router = express.Router();

// POST /api/resume/analyze  — body: { resumeText: string }
router.post("/analyze", protect, analyzeResume);

export default router;
