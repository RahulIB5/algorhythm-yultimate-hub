import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" }); // ensure env variables are loaded

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL port
  secure: true, // use SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default async function sendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"AlgoRhythm Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
}
