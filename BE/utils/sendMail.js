import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load .env from the current working directory explicitly so nodemon / different cwd won't break it
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Create transporter lazily inside the function so we can detect env vars at runtime
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // SSL port
    secure: true, // use SSL
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

export default async function sendMail(to, subject, text) {
  // Re-check configuration at call time (avoid stale false negatives)
  const isEmailConfigured = !!(process.env.MAIL_USER && process.env.MAIL_PASS);

  console.log("Email configuration status at send time:", {
    MAIL_USER: process.env.MAIL_USER ? "✅ Set" : "❌ Missing",
    MAIL_PASS: process.env.MAIL_PASS ? "✅ Set" : "❌ Missing",
    isConfigured: isEmailConfigured,
  });

  // Skip email sending if not configured
  if (!isEmailConfigured) {
    console.log("📧 Email skipped (not configured):", { to, subject });
    return null;
  }

  try {
    const transporter = createTransporter();

    console.log("📧 Attempting to send email:", { from: process.env.MAIL_USER, to, subject });

    const info = await transporter.sendMail({
      from: `"YUltimate Hub" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c5aa0; margin: 0;">YUltimate Hub</h1>
              <p style="color: #666; margin: 5px 0;">Your Ultimate Frisbee Community</p>
            </div>

            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2c5aa0; margin-top: 0;">${subject}</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 0;">${text}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                Welcome to the YUltimate Hub community!<br>
                <strong>Keep playing, keep improving! 🥏</strong>
              </p>
            </div>
          </div>
        </div>
      `,
      text: text // fallback plain text
    });

    console.log("✅ Email sent successfully:", info.response || info);
    return info;
  } catch (error) {
    console.error("❌ Email send error (continuing without email):", error && error.message ? error.message : error);
    // Don't throw error - just log it and continue
    return null;
  }
}
