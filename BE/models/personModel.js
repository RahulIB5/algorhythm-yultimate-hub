import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    uniqueUserId: { type: String, unique: true }, // e.g. "PLR2025-0012"
    passwordHash: String,
    roles: [String], // ["player","coach","volunteer","admin"]
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Person", personSchema);
