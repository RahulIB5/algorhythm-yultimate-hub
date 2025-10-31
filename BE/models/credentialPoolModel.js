import mongoose from "mongoose";

const credentialPoolSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    uniqueUserId: { type: String, unique: true },
    tempPassword :String,
    status: { type: String, enum: ["active", "used", "expired"], default: "active" },
    sentVia: { type: String, enum: ["sms", "email", "both"], default: "email" },
  },
  { timestamps: true }
);

export default mongoose.model("CredentialPool", credentialPoolSchema);
