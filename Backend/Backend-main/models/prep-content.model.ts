import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, default: "" },
    type: {
      type: String,
      enum: ["article", "video", "pdf", "practice", "book"],
      default: "article",
    },
  },
  { _id: false }
);

const prepContentSchema = new mongoose.Schema(
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
    title: { type: String, required: true },
    content: { type: String, default: "" },
    resources: [resourceSchema],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

prepContentSchema.index({ company: 1, category: 1 });

const PrepContent = mongoose.model("PrepContent", prepContentSchema);
export default PrepContent;
