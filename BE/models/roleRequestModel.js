import mongoose from "mongoose";

const roleRequestSchema = new mongoose.Schema(
  {
    applicantInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      passwordHash: String,
    },
    requestedRole: {
      type: String,
      enum: ["player", "coach", "volunteer"],
      required: true,
    },
        passwordHash: { type: String, required: true }, // ✅ ADD THIS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    reviewedAt: Date,
    remarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("RoleRequest", roleRequestSchema);
