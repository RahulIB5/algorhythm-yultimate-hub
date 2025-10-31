import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: String, // email or phone
    messageType: String, // approvalMail, smsCredentials, reminder
    messageBody: String,
    sentAt: Date,
    status: { type: String, enum: ["sent", "failed", "pending"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
