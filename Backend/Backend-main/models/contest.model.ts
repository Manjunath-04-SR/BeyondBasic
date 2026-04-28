import mongoose from "mongoose";

const contestProblemSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    points:  { type: Number, default: 100 },
    order:   { type: Number, default: 0 },
  },
  { _id: false },
);

const contestSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    startTime:   { type: Date, required: true },
    endTime:     { type: Date, required: true },
    problems:    [contestProblemSchema],
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    banner:      { type: String, default: "from-blue-600 to-indigo-700" },
    isPublished: { type: Boolean, default: false },
    totalRegistrations: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Virtual status
contestSchema.virtual("status").get(function (this: any) {
  const now = new Date();
  if (now < this.startTime) return "upcoming";
  if (now <= this.endTime)  return "ongoing";
  return "ended";
});

contestSchema.set("toJSON",   { virtuals: true });
contestSchema.set("toObject", { virtuals: true });

contestSchema.index({ startTime: -1 });
contestSchema.index({ slug: 1 });

export default mongoose.model("Contest", contestSchema);
