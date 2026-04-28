import mongoose from "mongoose";

const mockExamSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true },
    description:  { type: String, default: "" },
    instructions: { type: String, default: "" },
    duration:     { type: Number, default: 60 }, // minutes
    banner:       { type: String, default: "from-violet-600 to-purple-700" },
    isPublished:  { type: Boolean, default: false },
    totalQuestions: { type: Number, default: 0 }, // denormalised, updated on question add/remove
    passingScore:   { type: Number, default: 60 }, // percentage
    tags:           [{ type: String }],
  },
  { timestamps: true },
);

mockExamSchema.index({ slug: 1 });

export default mongoose.model("MockExam", mockExamSchema);
