import express from "express";
import {
  getCompanies,
  getCompanyBySlug,
  getCompanyPrepContent,
  createCompany,
  updateCompany,
  deleteCompany,
  createPrepContent,
  updatePrepContent,
  deletePrepContent,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/company.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

// Public
router.get("/", getCompanies);
router.get("/:slug/prep", getCompanyPrepContent);
router.get("/:slug/questions", getQuestions);
router.get("/:slug", getCompanyBySlug);

// Admin — questions (specific routes before :id wildcards)
router.patch("/questions/:qId", protect, restrictTo("admin"), updateQuestion);
router.delete("/questions/:qId", protect, restrictTo("admin"), deleteQuestion);

// Admin — prep content
router.patch("/prep/:contentId", protect, restrictTo("admin"), updatePrepContent);
router.delete("/prep/:contentId", protect, restrictTo("admin"), deletePrepContent);

// Admin — company + sub-resources
router.post("/", protect, restrictTo("admin"), createCompany);
router.post("/:id/prep", protect, restrictTo("admin"), createPrepContent);
router.post("/:id/questions", protect, restrictTo("admin"), createQuestion);
router.patch("/:id", protect, restrictTo("admin"), updateCompany);
router.delete("/:id", protect, restrictTo("admin"), deleteCompany);

export default router;
