import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import UserProfile from "../models/userProfile.model.ts";
import Enrollment from "../models/enrollment.model.ts";
import Topic from "../models/topic.model.ts";
import Subtopic from "../models/subtopic.model.ts";

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getAllUsersAdmin = async (_req: any, res: Response) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const softDeleteUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isDeleted = true;
    await user.save();
    res.json({ message: "Account deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete account" });
  }
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;

    // Get or create profile (lazy init for new users)
    let profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      profile = await UserProfile.create({
        user: userId,
        problemsSolved: 0,
        currentStreak: 0,
        longestStreak: 0,
        contestRating: 0,
        codingTimeHours: 0,
        recentActivity: [],
        activityCalendar: [],
        achievements: [
          { id: "first_blood",  title: "First Blood",    description: "Solve your first problem",  achievementType: "problem", unlocked: false },
          { id: "week_warrior", title: "Week Warrior",   description: "7-day streak",              achievementType: "streak",  unlocked: false },
          { id: "problem_solver",title: "Problem Solver",description: "Solve 100 problems",        achievementType: "problem", unlocked: false },
          { id: "top_performer",title: "Top Performer",  description: "Reach top 10",              achievementType: "rank",    unlocked: false },
        ],
      });
    }

    // Compute global rank (by problemsSolved descending)
    const betterCount = await UserProfile.countDocuments({
      problemsSolved: { $gt: profile.problemsSolved },
    });
    const globalRank = betterCount + 1;

    // Get enrolled courses with computed progress
    const enrollments = await Enrollment.find({ user: userId })
      .populate("course", "title slug color icon")
      .populate("lastAccessedSubtopic", "title");

    const enrollmentDetails = await Promise.all(
      enrollments.map(async (enr: any) => {
        if (!enr.course) return null;
        // Count total subtopics for this course
        const topics = await Topic.find({ course: enr.course._id });
        const topicIds = topics.map((t) => t._id);
        const totalSubtopics = await Subtopic.countDocuments({ topic: { $in: topicIds } });

        return {
          course: {
            _id: enr.course._id,
            title: enr.course.title,
            slug: enr.course.slug,
            color: enr.course.color,
            icon: enr.course.icon,
          },
          progress: enr.progress,
          completedSubtopics: enr.completedSubtopics.length,
          totalSubtopics,
          lastLesson: enr.lastAccessedSubtopic
            ? (enr.lastAccessedSubtopic as any).title
            : null,
          enrollmentId: enr._id,
        };
      })
    );

    res.json({
      stats: {
        problemsSolved: profile.problemsSolved,
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        contestRating: profile.contestRating,
        codingTimeHours: profile.codingTimeHours,
        globalRank,
      },
      enrollments: enrollmentDetails.filter(Boolean),
      recentActivity: profile.recentActivity
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
      activityCalendar: profile.activityCalendar,
      achievements: profile.achievements,
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err.message);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
