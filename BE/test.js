// testMail.js
import dotenv from "dotenv";
import sendMail from "./utils/sendMail.js";

 // Loads your .env file
dotenv.config({ path: "./.env" }); 
(async () => {
  try {
    await sendMail(
      "thanyatp2005@gmail.com", // 👈 replace with your actual email
      "Test Email from AlgoRhythm",
      "Hello! This is a test email from the AlgoRhythm backend."
    );
    console.log("✅ Test mail sent successfully!");
  } catch (err) {
    console.error("❌ Mail test failed:", err);
  }
  console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "****hidden****" : "❌ missing");

})();
