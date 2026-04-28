import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.model.ts";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyondbasic";

const ADMIN_EMAIL    = "admin@beyondbasic.com";
const ADMIN_USERNAME = "superadmin";
const ADMIN_PASSWORD = "Admin@1234";

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("Existing user promoted to admin:", ADMIN_EMAIL);
    } else {
      console.log("Admin already exists:", ADMIN_EMAIL);
    }
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    username: ADMIN_USERNAME,
    email:    ADMIN_EMAIL,
    password: hashed,
    role:     "admin",
  });

  console.log("\n✅ Admin seeded successfully!");
  console.log("─────────────────────────────");
  console.log("  Email   :", ADMIN_EMAIL);
  console.log("  Password:", ADMIN_PASSWORD);
  console.log("─────────────────────────────\n");

  await mongoose.disconnect();
}

seedAdmin().catch(err => { console.error(err); process.exit(1); });
