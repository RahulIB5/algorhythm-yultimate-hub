import mongoose from "mongoose";

const coachTimeLogSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    category: { type: String, enum: ["coaching", "travel", "home_visit"] },
    startTime: Date,
    endTime: Date,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("CoachTimeLog", coachTimeLogSchema);
