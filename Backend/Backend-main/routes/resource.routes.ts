import express from "express";
import {
  getResources,
  getResourceBySlug,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

router.get("/", getResources);
router.get("/:slug", getResourceBySlug);

router.post("/", protect, restrictTo("admin"), createResource);
router.patch("/:id", protect, restrictTo("admin"), updateResource);
router.delete("/:id", protect, restrictTo("admin"), deleteResource);

export default router;
