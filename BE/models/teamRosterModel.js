import mongoose from "mongoose";

const teamRosterSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    jerseyNumber: Number,
    status: { type: String, enum: ["active", "pending", "approved"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("TeamRoster", teamRosterSchema);
