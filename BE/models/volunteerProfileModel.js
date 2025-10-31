import mongoose from "mongoose";

const volunteerProfileSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person", unique: true },
    totalHours: { type: Number, default: 0 },
    eventsParticipated: [String],
    feedback: String,
  },
  { timestamps: true }
);

export default mongoose.model("VolunteerProfile", volunteerProfileSchema);
