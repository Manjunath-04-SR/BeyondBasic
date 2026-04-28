import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },
    avatar: { type: String },
    bio: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
