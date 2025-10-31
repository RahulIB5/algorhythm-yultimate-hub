import mongoose from "mongoose";

const spiritSubmissionSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    submittedByTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    forOpponentTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    categories: {
      rulesKnowledge: Number,
      foulsContact: Number,
      fairMindedness: Number,
      positiveAttitude: Number,
      communication: Number,
    },
    comments: String,
    submittedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("SpiritSubmission", spiritSubmissionSchema);
