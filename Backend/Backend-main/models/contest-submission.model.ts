import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    input:          { type: String, default: "" },
    expectedOutput: { type: String, default: "" },
    actualOutput:   { type: String, default: "" },
    passed:         { type: Boolean, default: false },
    stderr:         { type: String, default: "" },
  },
  { _id: false },
);

const contestSubmissionSchema = new mongoose.Schema(
  {
    contest:  { type: mongoose.Schema.Types.ObjectId, ref: "Contest",  required: true },
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
    problem:  { type: mongoose.Schema.Types.ObjectId, ref: "Problem",  required: true },
    code:     { type: String, required: true },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: ["accepted", "wrong_answer", "runtime_error", "compile_error", "pending"],
      default: "pending",
    },
    score:         { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },
    timeFromStart: { type: Number, default: 0 }, // seconds from contest start
    testResults:   [testResultSchema],
  },
  { timestamps: true },
);

contestSubmissionSchema.index({ contest: 1, user: 1, problem: 1 });
contestSubmissionSchema.index({ contest: 1, status: 1 });

export default mongoose.model("ContestSubmission", contestSubmissionSchema);
