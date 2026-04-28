import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["company-paper", "dsa-note", "cs-fundamental", "blog"],
      required: true,
    },
    description: { type: String, default: "" },
    content: { type: String, default: "" }, // markdown
    coverColor: { type: String, default: "from-blue-500 to-blue-700" },
    tags: [{ type: String }],
    category: { type: String, default: "" }, // e.g. "Arrays", "Operating Systems"
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    fileUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    company: { type: String, default: "" }, // for company-papers
    readTime: { type: Number, default: 5 },
    authorName: { type: String, default: "BeyondBasic Team" },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resourceSchema.index({ type: 1, isPublished: 1, order: 1 });
resourceSchema.index({ slug: 1 });

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
