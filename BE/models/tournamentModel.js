import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    location: String,
    sponsors: [String],
    bannerUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", tournamentSchema);
