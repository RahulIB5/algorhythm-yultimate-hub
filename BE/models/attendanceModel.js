import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    status: { type: String, enum: ["present", "absent", "late"] },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    recordedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
