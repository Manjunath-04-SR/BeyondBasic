import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  input:       { type: String, default: "" },
  output:      { type: String, default: "" },
  explanation: { type: String, default: "" },
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
  input:          { type: String, default: "" },
  expectedOutput: { type: String, default: "" },
  isHidden:       { type: Boolean, default: false },
}, { _id: false });

const starterCodeSchema = new mongoose.Schema({
  python:     { type: String, default: "# Write your solution here\n" },
  javascript: { type: String, default: "// Write your solution here\n" },
  cpp:        { type: String, default: "// Write your solution here\n" },
  java:       { type: String, default: "// Write your solution here\n" },
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  frequency:   { type: Number, default: 3, min: 1, max: 5 },
  description: { type: String, required: true },
  examples:    [exampleSchema],
  testCases:   [testCaseSchema],
  starterCode: { type: starterCodeSchema, default: () => ({}) },
  topicTag:    { type: String, required: true },
  course:      { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  leetcodeUrl: { type: String, default: "" },
  isPublished: { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);
