import express from "express";
import {
  getSubtopicsByTopic,
  getSubtopicById,
  getSubtopicBySlug,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
} from "../controllers/subtopic.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

router.get("/topic/:topicId", getSubtopicsByTopic);
router.get("/topic/:topicId/slug/:slug", getSubtopicBySlug);
router.get("/:id", getSubtopicById);

router.post("/", protect, restrictTo("instructor", "admin"), createSubtopic);
router.patch("/:id", protect, restrictTo("instructor", "admin"), updateSubtopic);
router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteSubtopic);

export default router;
