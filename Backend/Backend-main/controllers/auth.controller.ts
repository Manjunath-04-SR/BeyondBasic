import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.ts";
import { generateToken } from "../utils/generateToken.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "student",
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err: any) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Contact support." });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
// Generates a reset token and returns it in the response (no email service needed)
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        message: "If this email is registered, a reset token has been sent.",
        // Don't reveal if email exists
      });
    }

    // Generate a 6-digit OTP-style token (simple, no email needed)
    const resetToken = crypto.randomInt(100000, 999999).toString();
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // In production you'd email this. For now return it directly.
    res.json({
      message: "Password reset token generated successfully.",
      resetToken, // 6-digit code shown to user
      expiresIn: "15 minutes",
    });
  } catch (err: any) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Failed to generate reset token. Try again." });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ message: "Email, reset token, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(resetToken.trim()).digest("hex");

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token. Please request a new one." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpires = undefined as any;
    await user.save();

    const token = generateToken(user._id.toString());

    res.json({
      message: "Password reset successful! You are now logged in.",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err: any) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: "Failed to reset password. Try again." });
  }
};
