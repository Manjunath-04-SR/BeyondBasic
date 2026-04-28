import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentByCourse,
  markSubtopicComplete,
  saveNote,
  toggleBookmark,
} from "../controllers/enrollment.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.use(protect);

router.post("/", enrollInCourse);
router.get("/", getMyEnrollments);
router.get("/course/:courseSlug", getEnrollmentByCourse);
router.post("/course/:courseSlug/complete/:subtopicId", markSubtopicComplete);
router.post("/course/:courseSlug/note", saveNote);
router.post("/course/:courseSlug/bookmark/:subtopicId", toggleBookmark);

export default router;
