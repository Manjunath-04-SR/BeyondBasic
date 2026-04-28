import express from "express";
import {
  getContests,
  getContestBySlug,
  registerForContest,
  submitSolution,
  getMySubmissions,
  getLeaderboard,
  createContest,
  updateContest,
  deleteContest,
  addProblemToContest,
  removeProblemFromContest,
  createAndAddProblem,
} from "../controllers/contest.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.ts";
import { restrictTo } from "../middlewares/role.middleware.ts";

const router = express.Router();

// Public (with optional auth to check registration status)
router.get("/",              optionalAuth, getContests);
router.get("/:slug",         optionalAuth, getContestBySlug);
router.get("/:slug/leaderboard", getLeaderboard);

// Authenticated
router.post("/:slug/register",               protect, registerForContest);
router.post("/:slug/submit/:problemSlug",    protect, submitSolution);
router.get( "/:slug/my-submissions",         protect, getMySubmissions);

// Admin
router.post(  "/",                           protect, restrictTo("admin"), createContest);
router.patch( "/:id",                        protect, restrictTo("admin"), updateContest);
router.delete("/:id",                        protect, restrictTo("admin"), deleteContest);
router.post(  "/:id/problems",               protect, restrictTo("admin"), addProblemToContest);
router.delete("/:id/problems/:problemId",    protect, restrictTo("admin"), removeProblemFromContest);
router.post(  "/:id/create-problem",         protect, restrictTo("admin"), createAndAddProblem);

export default router;
