import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    fieldName: String,
    teamAId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamBId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    startTime: Date,
    endTime: Date,
    status: { type: String, enum: ["scheduled", "ongoing", "completed"], default: "scheduled" },
    score: { teamA: Number, teamB: Number },
    winnerTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
