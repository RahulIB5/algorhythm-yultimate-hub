import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    name: String,
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    logoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
