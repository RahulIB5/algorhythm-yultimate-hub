import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Check if Twilio credentials are configured
const isTwilioConfigured = process.env.TWILIO_ACCOUNT_SID && 
                          process.env.TWILIO_AUTH_TOKEN && 
                          process.env.TWILIO_PHONE_NUMBER;

console.log("Twilio configuration status:", {
  ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✅ Set" : "❌ Missing",
  AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✅ Set" : "❌ Missing",
  PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? "✅ Set" : "❌ Missing",
  isConfigured: isTwilioConfigured
});

if (!isTwilioConfigured) {
  console.warn("⚠️  Twilio credentials not configured. SMS notifications will be disabled.");
}

// Initialize Twilio client
let twilioClient = null;
if (isTwilioConfigured) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio client initialized successfully");
  } catch (error) {
    console.error("❌ Twilio client initialization failed:", error.message);
  }
}

/**
 * Send SMS notification
 * @param {string} to - Phone number to send SMS to (must include country code, e.g., +1234567890)
 * @param {string} message - Message content
 * @returns {Promise} - Twilio message response or null
 */
export default async function sendSMS(to, message) {
  // Skip SMS sending if not configured
  if (!isTwilioConfigured || !twilioClient) {
    console.log("📱 SMS skipped (Twilio not configured):", { to, message });
    return null;
  }

  try {
    // Ensure phone number has country code
    let formattedNumber = to;
    if (!to.startsWith('+')) {
      // For Indian numbers, add +91
      if (to.length === 10 && to.match(/^[6-9]/)) {
        formattedNumber = `+91${to}`;
      } else {
        // Assuming US numbers if no country code provided
        formattedNumber = `+1${to.replace(/\D/g, '')}`;
      }
    }

    console.log("📱 Attempting to send SMS:", { 
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: formattedNumber, 
      message: message.substring(0, 50) + "..." 
    });

    const messageResponse = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    console.log("✅ SMS sent successfully:", {
      sid: messageResponse.sid,
      to: formattedNumber,
      status: messageResponse.status
    });

    return messageResponse;
  } catch (error) {
    if (error.code === 21608) {
      console.error("❌ SMS VERIFICATION ERROR:", {
        message: "This phone number needs to be verified in your Twilio trial account",
        instructions: [
          "1. Go to https://console.twilio.com/",
          "2. Navigate to Phone Numbers > Manage > Verified Caller IDs",
          "3. Click 'Add a new number' and verify the phone number",
          "4. OR upgrade to a paid Twilio account to send to unverified numbers"
        ],
        phoneNumber: to,
        error: error.message
      });
    } else {
      console.error("❌ SMS send error (continuing without SMS):", {
        error: error.message,
        code: error.code,
        to: to
      });
    }
    // Don't throw error - just log it and continue
    return null;
  }
}

/**
 * Format phone number for SMS
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number with country code
 */
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // For Indian numbers (10 digits starting with 6-9)
  if (cleaned.length === 10 && cleaned.match(/^[6-9]/)) {
    return `+91${cleaned}`;
  }
  
  // If already has country code (11 digits for US), return with +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // If 10 digits, assume US and add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If other length, assume international and add +
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  // If less than 10 digits, might be invalid
  console.warn("⚠️  Phone number might be invalid:", phone);
  return `+91${cleaned}`;
}