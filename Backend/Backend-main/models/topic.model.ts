import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  order: { type: Number, required: true }, // for sorting
},
{ timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;