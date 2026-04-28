import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: null },
    tags: [{ type: String }],
    authors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;