import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Program", programSchema);
