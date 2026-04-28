import mongoose from "mongoose";

const mockQuestionSchema = new mongoose.Schema(
  {
    exam:    { type: mongoose.Schema.Types.ObjectId, ref: "MockExam", required: true },
    section: {
      type: String,
      enum: ["aptitude", "communication", "coding", "sql"],
      required: true,
    },
    question:      { type: String, required: true },
    options:       { type: [String], validate: (v: string[]) => v.length === 4 },
    correctAnswer: { type: Number, min: 0, max: 3, required: true }, // index 0-3
    explanation:   { type: String, default: "" },
    difficulty:    { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true },
);

mockQuestionSchema.index({ exam: 1, section: 1, order: 1 });

export default mongoose.model("MockQuestion", mockQuestionSchema);
