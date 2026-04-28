import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: "Subtopic" },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedSubtopics: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subtopic" },
    ],
    lastAccessedSubtopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtopic",
      default: null,
    },
    progress: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    notes: [noteSchema],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtopic" }],
  },
  { timestamps: true },
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
