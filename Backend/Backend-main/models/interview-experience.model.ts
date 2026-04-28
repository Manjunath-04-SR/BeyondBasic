import mongoose from "mongoose";

const interviewExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, default: "Anonymous" },
    role: { type: String, required: true },
    year: { type: Number, required: true },
    experience: { type: String, required: true },
    result: {
      type: String,
      enum: ["selected", "rejected", "pending"],
      default: "pending",
    },
    rounds: [{ type: String }],
    tips: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

interviewExperienceSchema.index({ company: 1, isApproved: 1 });

const InterviewExperience = mongoose.model("InterviewExperience", interviewExperienceSchema);
export default InterviewExperience;
