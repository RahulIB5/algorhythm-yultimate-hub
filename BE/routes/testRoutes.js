import express from "express";
import sendMail from "../utils/sendMailEnhanced.js";
import sendSMS, { formatPhoneNumber } from "../utils/sendSMS.js";

const router = express.Router();

/**
 * Test Email functionality
 * POST /api/test/email
 * Body: { email, subject, message }
 */
router.post("/email", async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, subject, and message are required" 
      });
    }

    const result = await sendMail(email, subject, message);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Email sending failed - check server logs"
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message
    });
  }
});

/**
 * Test SMS functionality
 * POST /api/test/sms
 * Body: { phone, message }
 */
router.post("/sms", async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone and message are required" 
      });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const result = await sendSMS(formattedPhone, message);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: "SMS sent successfully",
        sid: result.sid,
        to: formattedPhone,
        status: result.status
      });
    } else {
      res.status(500).json({
        success: false,
        message: "SMS sending failed - check server logs"
      });
    }
  } catch (error) {
    console.error("Test SMS error:", error);
    res.status(500).json({
      success: false,
      message: "SMS sending failed",
      error: error.message
    });
  }
});

/**
 * Test both Email and SMS
 * POST /api/test/notifications
 * Body: { email, phone, subject, message }
 */
router.post("/notifications", async (req, res) => {
  try {
    const { email, phone, subject, message } = req.body;

    if (!email || !phone || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, phone, subject, and message are required" 
      });
    }

    const results = {
      email: null,
      sms: null
    };

    // Send Email
    try {
      const emailResult = await sendMail(email, subject, message);
      results.email = {
        success: !!emailResult,
        messageId: emailResult?.messageId || null
      };
    } catch (emailError) {
      results.email = {
        success: false,
        error: emailError.message
      };
    }

    // Send SMS
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const smsResult = await sendSMS(formattedPhone, message);
      results.sms = {
        success: !!smsResult,
        sid: smsResult?.sid || null,
        to: formattedPhone,
        status: smsResult?.status || null
      };
    } catch (smsError) {
      results.sms = {
        success: false,
        error: smsError.message
      };
    }

    const overallSuccess = results.email.success || results.sms.success;

    res.status(overallSuccess ? 200 : 500).json({
      success: overallSuccess,
      message: overallSuccess ? "At least one notification sent successfully" : "All notifications failed",
      results
    });
  } catch (error) {
    console.error("Test notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Notification testing failed",
      error: error.message
    });
  }
});

export default router;