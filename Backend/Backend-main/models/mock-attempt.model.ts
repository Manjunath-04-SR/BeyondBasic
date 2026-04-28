import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema(
  {
    correct: { type: Number, default: 0 },
    total:   { type: Number, default: 0 },
  },
  { _id: false },
);

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "MockQuestion", required: true },
    selected: { type: Number, default: -1 }, // -1 = skipped
  },
  { _id: false },
);

const mockAttemptSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
    exam:  { type: mongoose.Schema.Types.ObjectId, ref: "MockExam", required: true },
    answers: [answerSchema],
    score:   { type: Number, default: 0 },  // total correct
    total:   { type: Number, default: 0 },  // total questions
    sectionScores: {
      aptitude:      { type: sectionScoreSchema, default: () => ({}) },
      communication: { type: sectionScoreSchema, default: () => ({}) },
      coding:        { type: sectionScoreSchema, default: () => ({}) },
      sql:           { type: sectionScoreSchema, default: () => ({}) },
    },
    timeTaken:   { type: Number, default: 0 }, // seconds
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// One attempt per user per exam
mockAttemptSchema.index({ user: 1, exam: 1 }, { unique: true });

export default mongoose.model("MockAttempt", mockAttemptSchema);
