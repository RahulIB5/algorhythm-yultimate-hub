import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    name: String,
    type: { type: String, enum: ["school", "community", "venue"] },
    address: String,
    geo: { lat: Number, lng: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Site", siteSchema);
