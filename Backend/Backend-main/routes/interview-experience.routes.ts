import express from "express";
import {
  getAllExperiences,
  getExperiencesByCompany,
  submitExperience,
  approveExperience,
  deleteExperience,
  getPendingExperiences,
} from "../controllers/interview-experience.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

// Public — order matters: specific routes before wildcards
router.get("/", getAllExperiences);
router.get("/company/:slug", getExperiencesByCompany);

// Authenticated students submit
router.post("/company/:slug", protect, submitExperience);

// Admin
router.get("/pending", protect, restrictTo("admin"), getPendingExperiences);
router.patch("/:id/approve", protect, restrictTo("admin"), approveExperience);
router.delete("/:id", protect, restrictTo("admin"), deleteExperience);

export default router;
