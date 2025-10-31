import mongoose from "mongoose";

const matchScoreEventSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    points: Number,
    timestamp: Date,
  },
  { timestamps: true }
);

export default mongoose.model("MatchScoreEvent", matchScoreEventSchema);
