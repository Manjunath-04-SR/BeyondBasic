import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // markdown
  coverImageUrl: { type: String, default: null },

  subtopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subtopic",
    required: true,
    unique: true // one blog per subtopic
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  tags: [{ type: String }],

  isDraft: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  generatedByAI: { type: Boolean, default: false }
},
{ timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;