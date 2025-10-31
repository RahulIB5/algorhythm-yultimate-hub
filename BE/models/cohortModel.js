import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema(
  {
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    name: String,
    startDate: Date,
    endDate: Date,
    capacity: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Cohort", cohortSchema);
