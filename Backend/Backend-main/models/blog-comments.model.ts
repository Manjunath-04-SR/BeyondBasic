import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
{
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true
  },

  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null // for replies
  },

  likes: { type: Number, default: 0 }

},
{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);