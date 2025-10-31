import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    table: String,
    recordId: mongoose.Schema.Types.ObjectId,
    action: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    oldValue: Object,
    newValue: Object,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
