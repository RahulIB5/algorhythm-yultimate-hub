import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: "Cohort" },
    title: String,
    type: { type: String, enum: ["training", "workshop"] },
    scheduledStart: Date,
    scheduledEnd: Date,
    assignedCoaches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    enrolledPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    venue: String,
    status: { type: String, enum: ["scheduled", "completed"], default: "scheduled" },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
