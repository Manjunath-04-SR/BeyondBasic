const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { _id: false }
);

const ExampleSchema = new mongoose.Schema(
  {
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    explanation: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    languagesSupported: {
      type: [String],
      default: ["JavaScript", "Python","Java", "C++"]
    },

    constraints: {
      type: [String],
      default: []
    },

    examples: {
      type: [ExampleSchema],
       default: []
    },

    publicTestCases: {
      type: [TestCaseSchema],
      default: []
    },

    privateTestCases: {
      type: [TestCaseSchema],
      default: []
    },

    tags: {
      type: [String],
      default: []
    },

    totalSubmissions: {
      type: Number,
      default: 0
    },

    totalAccepted: {
      type: Number,
      default: 0
    },

    acceptanceRate: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Question", QuestionSchema);