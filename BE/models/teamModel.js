import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    playerId: { type: String, required: true },
    email: { type: String },
    age: { type: Number },
    position: { type: String },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    totalMembers: { type: Number, required: true },
    players: { type: [playerSchema], default: [] },
    tournamentId: { type: String },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
    contactPhone: { type: String },
    contactEmail: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
