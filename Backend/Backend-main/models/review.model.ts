import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
{
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }

},
{ timestamps: true }
);

reviewSchema.index({ student: 1, course: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;