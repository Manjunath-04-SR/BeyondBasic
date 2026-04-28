import type { Request, Response } from "express";
import slugify from "slugify";
import Contest from "../models/contest.model.ts";
import ContestSubmission from "../models/contest-submission.model.ts";
import Problem from "../models/problem.model.ts";
import { judgeSubmission } from "../utils/judge.ts";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStatus(startTime: Date, endTime: Date) {
  const now = new Date();
  if (now < startTime) return "upcoming";
  if (now <= endTime)  return "ongoing";
  return "ended";
}

// ── Public: GET /api/contest ──────────────────────────────────────────────────
export const getContests = async (_req: Request, res: Response) => {
  try {
    const contests = await Contest.find({ isPublished: true })
      .select("-registrations -problems.problem")
      .sort({ startTime: -1 });
    res.json(
      contests.map((c: any) => ({
        ...c.toObject(),
        status: getStatus(c.startTime, c.endTime),
        problemCount: c.problems.length,
      })),
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public: GET /api/contest/:slug ────────────────────────────────────────────
export const getContestBySlug = async (req: any, res: Response) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug, isPublished: true })
      .populate("problems.problem", "title slug difficulty topicTag description examples starterCode testCases");

    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const status = getStatus(contest.startTime, contest.endTime);
    const isRegistered = req.user ? contest.registrations.some((id: any) => id.equals(req.user._id)) : false;

    // Hide test cases until contest starts (except for admin)
    const isAdmin = req.user?.role === "admin";
    const problems = contest.problems.map((cp: any) => {
      const p = cp.problem?.toObject?.() || cp.problem;
      if (!isAdmin && status === "upcoming") {
        return { ...cp.toObject?.() || cp, problem: { _id: p._id, title: p.title, slug: p.slug, difficulty: p.difficulty } };
      }
      if (!isAdmin) {
        // Hide hidden test cases from problem detail during contest
        const { testCases, ...rest } = p;
        return {
          ...cp.toObject?.() || cp,
          problem: { ...rest, testCases: (testCases || []).filter((t: any) => !t.isHidden) },
        };
      }
      return cp.toObject?.() || cp;
    });

    res.json({
      ...contest.toObject(),
      status,
      isRegistered,
      problemCount: contest.problems.length,
      problems,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Auth: POST /api/contest/:slug/register ────────────────────────────────────
export const registerForContest = async (req: any, res: Response) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug, isPublished: true });
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const status = getStatus(contest.startTime, contest.endTime);
    if (status === "ended") return res.status(400).json({ message: "Contest has ended" });

    const alreadyRegistered = contest.registrations.some((id: any) => id.equals(req.user._id));
    if (alreadyRegistered) return res.status(400).json({ message: "Already registered" });

    contest.registrations.push(req.user._id);
    contest.totalRegistrations += 1;
    await contest.save();

    res.json({ message: "Registered successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Auth: POST /api/contest/:slug/submit/:problemSlug ─────────────────────────
export const submitSolution = async (req: any, res: Response) => {
  try {
    const { slug, problemSlug } = req.params;
    const { code, language } = req.body;

    if (!code || !language) return res.status(400).json({ message: "code and language are required" });

    const contest = await Contest.findOne({ slug, isPublished: true });
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const status = getStatus(contest.startTime, contest.endTime);
    if (status !== "ongoing") return res.status(400).json({ message: "Contest is not ongoing" });

    const isRegistered = contest.registrations.some((id: any) => id.equals(req.user._id));
    if (!isRegistered) return res.status(403).json({ message: "You are not registered for this contest" });

    // Find the problem in the contest and get its points
    const contestProblem = (contest.problems as any[]).find(
      (cp: any) => cp.problem?.toString() === cp.problem?.toString(),
    );

    // Get full problem with test cases
    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const cpEntry = (contest.problems as any[]).find(
      (cp: any) => cp.problem.toString() === (problem._id as any).toString(),
    );
    if (!cpEntry) return res.status(404).json({ message: "Problem not in this contest" });

    const maxPoints = cpEntry.points || 100;

    // Count previous attempts for this problem
    const prevAttempts = await ContestSubmission.countDocuments({
      contest: contest._id,
      user:    req.user._id,
      problem: problem._id,
    });

    // Check if already accepted — no more judging
    const alreadyAccepted = await ContestSubmission.findOne({
      contest: contest._id,
      user:    req.user._id,
      problem: problem._id,
      status:  "accepted",
    });
    if (alreadyAccepted) return res.status(400).json({ message: "Already accepted for this problem" });

    // Judge against all test cases
    const testCases = problem.testCases.map((tc: any) => ({
      input:          tc.input,
      expectedOutput: tc.expectedOutput,
    }));

    const timeFromStart = Math.floor((Date.now() - contest.startTime.getTime()) / 1000);

    const { status: judgeStatus, testResults } = await judgeSubmission(language, code, testCases);

    const score = judgeStatus === "accepted" ? maxPoints : 0;

    const submission = await ContestSubmission.create({
      contest:       contest._id,
      user:          req.user._id,
      problem:       problem._id,
      code,
      language,
      status:        judgeStatus,
      score,
      attemptNumber: prevAttempts + 1,
      timeFromStart,
      testResults,
    });

    res.json({
      status:      judgeStatus,
      score,
      attemptNumber: prevAttempts + 1,
      testResults: testResults.slice(0, 5), // show max 5 results to user
      submissionId: submission._id,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Auth: GET /api/contest/:slug/my-submissions ───────────────────────────────
export const getMySubmissions = async (req: any, res: Response) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug });
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const submissions = await ContestSubmission.find({
      contest: contest._id,
      user:    req.user._id,
    })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public: GET /api/contest/:slug/leaderboard ────────────────────────────────
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug, isPublished: true })
      .populate("registrations", "username email");
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const allAccepted = await ContestSubmission.find({
      contest: contest._id,
      status:  "accepted",
    }).sort({ timeFromStart: 1 });

    const allWrong = await ContestSubmission.find({
      contest: contest._id,
      status:  { $ne: "accepted" },
    });

    // Build per-user, per-problem stats
    const userMap: Record<string, {
      userId: string;
      username: string;
      totalScore: number;
      penaltyTime: number; // seconds
      problems: Record<string, { accepted: boolean; attempts: number; acceptedAt: number }>;
    }> = {};

    (contest.registrations as any[]).forEach((user: any) => {
      userMap[user._id.toString()] = {
        userId:    user._id.toString(),
        username:  user.username || user.email?.split("@")[0] || "User",
        totalScore:  0,
        penaltyTime: 0,
        problems:    {},
      };
    });

    // Count wrong attempts per user per problem
    allWrong.forEach((sub: any) => {
      const uid = sub.user.toString();
      const pid = sub.problem.toString();
      if (!userMap[uid]) return;
      if (!userMap[uid].problems[pid]) {
        userMap[uid].problems[pid] = { accepted: false, attempts: 0, acceptedAt: 0 };
      }
      userMap[uid].problems[pid].attempts++;
    });

    // Process accepted submissions (already sorted by timeFromStart ASC)
    const processed = new Set<string>(); // uid:pid
    allAccepted.forEach((sub: any) => {
      const uid  = sub.user.toString();
      const pid  = sub.problem.toString();
      const key  = `${uid}:${pid}`;
      if (!userMap[uid] || processed.has(key)) return;

      processed.add(key);
      if (!userMap[uid].problems[pid]) {
        userMap[uid].problems[pid] = { accepted: false, attempts: 0, acceptedAt: 0 };
      }
      userMap[uid].problems[pid].accepted  = true;
      userMap[uid].problems[pid].acceptedAt = sub.timeFromStart;

      const cp = (contest.problems as any[]).find((c: any) => c.problem.toString() === pid);
      userMap[uid].totalScore  += cp?.points || 0;
      // ICPC penalty: 5 min per wrong attempt
      userMap[uid].penaltyTime += sub.timeFromStart + userMap[uid].problems[pid].attempts * 300;
    });

    const leaderboard = Object.values(userMap)
      .sort((a, b) => b.totalScore - a.totalScore || a.penaltyTime - b.penaltyTime)
      .map((entry, idx) => ({
        rank:        idx + 1,
        userId:      entry.userId,
        username:    entry.username,
        totalScore:  entry.totalScore,
        penaltyTime: entry.penaltyTime,
        solvedCount: Object.values(entry.problems).filter((p) => p.accepted).length,
        problems:    entry.problems,
      }));

    res.json({ leaderboard, contestProblems: contest.problems });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: POST /api/contest ──────────────────────────────────────────────────
export const createContest = async (req: Request, res: Response) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const existing = await Contest.findOne({ slug });
    if (existing) return res.status(409).json({ message: "Contest with this title already exists" });

    const contest = await Contest.create({ ...req.body, slug });
    res.status(201).json(contest);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: PATCH /api/contest/:id ─────────────────────────────────────────────
export const updateContest = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: DELETE /api/contest/:id ────────────────────────────────────────────
export const deleteContest = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    await ContestSubmission.deleteMany({ contest: req.params.id });
    res.json({ message: "Contest deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: POST /api/contest/:id/problems ─────────────────────────────────────
// Add an existing problem to the contest
export const addProblemToContest = async (req: Request, res: Response) => {
  try {
    const { problemSlug, points = 100, order = 0 } = req.body;
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const already = (contest.problems as any[]).find(
      (cp: any) => cp.problem.toString() === (problem._id as any).toString(),
    );
    if (already) return res.status(409).json({ message: "Problem already in contest" });

    (contest.problems as any[]).push({ problem: problem._id, points, order });
    await contest.save();
    res.json(contest);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ── Admin: DELETE /api/contest/:id/problems/:problemId ────────────────────────
export const removeProblemFromContest = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    (contest.problems as any[]) = (contest.problems as any[]).filter(
      (cp: any) => cp.problem.toString() !== req.params.problemId,
    );
    await contest.save();
    res.json(contest);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: POST /api/contest/:id/create-problem ──────────────────────────────
// Create a new problem AND add it to the contest
export const createAndAddProblem = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const { points = 100, order = 0, ...problemData } = req.body;
    const slug = slugify(problemData.title, { lower: true, strict: true });
    const existing = await Problem.findOne({ slug });
    if (existing) return res.status(409).json({ message: "Problem with this title already exists" });

    const problem = await Problem.create({ ...problemData, slug });
    (contest.problems as any[]).push({ problem: problem._id, points, order });
    await contest.save();

    res.status(201).json({ problem, contest });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
