import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    assessorId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    assessmentType: { type: String, enum: ["baseline", "endline", "followup"] },
    assessmentDate: Date,
    formResponses: Object,
    score: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);
