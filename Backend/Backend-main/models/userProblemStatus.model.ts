import mongoose from "mongoose";

const userProblemStatusSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  problem:  { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  status:   { type: String, enum: ["solved", "attempted"], default: "attempted" },
  language: { type: String, default: "python" },
  lastCode: { type: String, default: "" },
  solvedAt: { type: Date },
}, { timestamps: true });

userProblemStatusSchema.index({ user: 1, problem: 1 }, { unique: true });

export default mongoose.model("UserProblemStatus", userProblemStatusSchema);
