import express from "express";
import {
  getExams,
  getExamById,
  submitExam,
  getMyResult,
  getAllExamsAdmin,
  createExam,
  updateExam,
  deleteExam,
  getQuestionsAdmin,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/mock.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

// ── Public / optional auth ────────────────────────────────────────────────────
router.get("/",    optionalAuth, getExams);
router.get("/:id", optionalAuth, getExamById);

// ── Authenticated ──────────────────────────────────────────────────────────────
router.post("/:id/submit",    protect, submitExam);
router.get( "/:id/my-result", protect, getMyResult);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get(   "/admin/all",              protect, restrictTo("admin"), getAllExamsAdmin);
router.post(  "/",                       protect, restrictTo("admin"), createExam);
router.patch( "/:id",                    protect, restrictTo("admin"), updateExam);
router.delete("/:id",                    protect, restrictTo("admin"), deleteExam);
router.get(   "/:id/questions",          protect, restrictTo("admin"), getQuestionsAdmin);
router.post(  "/:id/questions",          protect, restrictTo("admin"), addQuestion);
router.patch( "/questions/:qid",         protect, restrictTo("admin"), updateQuestion);
router.delete("/questions/:qid",         protect, restrictTo("admin"), deleteQuestion);

export default router;
