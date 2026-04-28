import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    activityType: {
      type: String,
      enum: ["solved", "completed", "badge", "attempted", "enrolled"],
      default: "solved",
    },
  },
  { timestamps: true },
);

const calendarDaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // "YYYY-MM-DD"
    level: { type: Number, default: 0, min: 0, max: 3 }, // 0=none, 1=light, 2=medium, 3=heavy
  },
  { _id: false },
);

const achievementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    achievementType: { type: String, default: "general" },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date },
  },
  { _id: false },
);

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    problemsSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    contestRating: { type: Number, default: 0 },
    codingTimeHours: { type: Number, default: 0 },
    recentActivity: [activitySchema],
    activityCalendar: [calendarDaySchema],
    achievements: [achievementSchema],
  },
  { timestamps: true },
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
