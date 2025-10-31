// seedCoach.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Person from "./models/personModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const addCoach = async () => {
  try {
    await connectDB();

    // 🔹 Create a bcrypt-hashed password
    const password = "coach123";
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔹 Define coach details
    const coach = {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.coach@tamui.org",
      phone: "9876543210",
      uniqueUserId: "COA-002", // this will be used for login
      passwordHash,
      roles: ["coach"],
      accountStatus: "active",
    };

    // 🔹 Check if coach already exists
    const existing = await Person.findOne({ uniqueUserId: coach.uniqueUserId });
    if (existing) {
      console.log("⚠️ Coach already exists with ID:", coach.uniqueUserId);
      process.exit();
    }

    // 🔹 Save new coach
    await Person.create(coach);
    console.log("✅ Coach added successfully!");
    console.log(`Login using:
      uniqueUserId: ${coach.uniqueUserId}
      password: ${password}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding coach:", error);
    process.exit(1);
  }
};

addCoach();
