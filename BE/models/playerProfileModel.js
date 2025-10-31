import mongoose from "mongoose";

const playerProfileSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person", unique: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    totalMatchesPlayed: { type: Number, default: 0 },
    totalGoals: { type: Number, default: 0 },
    totalAssists: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    spiritAverage: { type: Number, default: 0 },
    pastTournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }],
    currentTournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    upcomingMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    feedback: [
      {
        coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
        rating: Number,
        comments: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PlayerProfile", playerProfileSchema);
