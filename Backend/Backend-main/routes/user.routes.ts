import express from "express";
import {
  getProfile,
  updateProfile,
  softDeleteUser,
  getDashboardStats,
  getAllUsersAdmin,
} from "../controllers/user.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { authorize } from "../middlewares/role.middleware.ts";
import User from "../models/user.model.ts";

const router = express.Router();

// Admin routes — before wildcard routes
router.get("/admin/all", protect, authorize("admin"), getAllUsersAdmin);

router.patch("/block/:id", protect, authorize("admin"), async (req: any, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  user.isBlocked = true;
  await user.save();
  res.json({ message: "User blocked" });
});

router.patch("/unblock/:id", protect, authorize("admin"), async (req: any, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  user.isBlocked = false;
  await user.save();
  res.json({ message: "User unblocked" });
});

router.patch("/role/:id", protect, authorize("admin"), async (req: any, res) => {
  const { role } = req.body;
  if (!["student", "admin", "instructor"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Role updated", user });
});

router.get("/profile",        protect, getProfile);
router.put("/profile",        protect, updateProfile);
router.get("/dashboard-stats",protect, getDashboardStats);
router.delete("/delete",      protect, softDeleteUser);

export default router;
