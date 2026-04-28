import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "heading",
        "paragraph",
        "code",
        "info",
        "tip",
        "warning",
        "success",
        "keyPoints",
        "list",
        "image",
        "quiz",
        "divider",
        "table",
        "comparison",
      ],
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const subtopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    order: { type: Number, required: true },
    isFreePreview: { type: Boolean, default: false },
    content: [contentBlockSchema],
    estimatedReadTime: { type: Number, default: 5 },
    videoUrl: { type: String, default: null },
    summary: { type: String, default: "" },
  },
  { timestamps: true },
);

subtopicSchema.index({ topic: 1, order: 1 });
subtopicSchema.index({ topic: 1, slug: 1 }, { unique: true });

const Subtopic = mongoose.model("Subtopic", subtopicSchema);

export default Subtopic;
