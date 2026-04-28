import mongoose from "mongoose";

const prepQuestionSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    category: {
      type: String,
      enum: ["aptitude", "communication", "dsa", "sql", "lld", "hld"],
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "coding", "theory"],
      default: "theory",
    },
    question: { type: String, required: true },
    options: [{ type: String }],         // MCQ choices (A/B/C/D)
    answer: { type: String, default: "" }, // correct option text or short answer
    solution: { type: String, default: "" }, // full explanation (markdown)
    solutionCode: { type: String, default: "" }, // code snippet for coding Qs
    solutionLanguage: {
      type: String,
      enum: ["python", "java", "cpp", "javascript", "c", ""],
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

prepQuestionSchema.index({ company: 1, category: 1, isPublished: 1 });

const PrepQuestion = mongoose.model("PrepQuestion", prepQuestionSchema);
export default PrepQuestion;
