import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    coverImageUrl: { type: String, default: null },
    tags: [{ type: String }],
    category: { type: String, default: "Programming" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    language: { type: String, default: "English" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    totalEnrollments: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    estimatedDuration: { type: String, default: "0 hours" },
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
    color: { type: String, default: "from-blue-500 to-cyan-500" },
    icon: { type: String, default: "Code2" },
  },
  { timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
