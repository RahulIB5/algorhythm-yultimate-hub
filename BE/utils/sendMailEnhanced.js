import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Check if email credentials are configured
const isEmailConfigured = process.env.MAIL_USER && process.env.MAIL_PASS;

if (!isEmailConfigured) {
  console.warn("⚠️  Email credentials not configured. Email notifications will be disabled.");
} else {
  console.log("✅ Email credentials configured for:", process.env.MAIL_USER);
}

// Initialize transporter
let transporter = null;
if (isEmailConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL port
      secure: true, // use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    console.log("✅ Email transporter initialized successfully");
  } catch (error) {
    console.error("❌ Email transporter initialization failed:", error.message);
  }
}

/**
 * Send email notification
 * @param {string} to - Email address to send to
 * @param {string} subject - Email subject
 * @param {string} text - Email content (plain text)
 * @param {string} html - Email content (HTML) - optional
 * @returns {Promise} - Nodemailer response or null
 */
export default async function sendMail(to, subject, text, html = null) {
  // Skip email sending if not configured
  if (!isEmailConfigured || !transporter) {
    console.log("📧 Email skipped (not configured):", { to, subject });
    return null;
  }

  try {
    const mailOptions = {
      from: `"YUltimate Hub" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Add HTML content if provided
    if (html) {
      mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", {
      messageId: info.messageId,
      to: to,
      subject: subject,
      response: info.response
    });
    return info;
  } catch (error) {
    console.error("❌ Email send error (continuing without email):", {
      error: error.message,
      code: error.code,
      to: to,
      subject: subject
    });
    // Don't throw error - just log it and continue
    return null;
  }
}