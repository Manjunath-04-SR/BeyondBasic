import express from "express";
import {
  getTopicsByCourse,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

router.get("/course/:courseSlug", getTopicsByCourse);

router.post("/", protect, restrictTo("instructor", "admin"), createTopic);
router.patch("/:id", protect, restrictTo("instructor", "admin"), updateTopic);
router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteTopic);

export default router;
