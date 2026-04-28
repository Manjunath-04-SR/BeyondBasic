import express from "express";
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  publishCourse,
} from "../controllers/course.controller.ts";

import { validate } from "../middlewares/validate.middleware.ts";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.validator.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);

router.post(
  "/",
  protect,
  restrictTo("instructor", "admin"),
  validate(createCourseSchema),
  createCourse,
);

router.patch("/:id", protect, validate(updateCourseSchema), updateCourse);

router.patch(
  "/:id/publish",
  protect,
  restrictTo("instructor", "admin"),
  publishCourse,
);

router.delete("/:id", protect, restrictTo("admin"), deleteCourse);

export default router;
