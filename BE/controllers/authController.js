// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Person from "../models/personModel.js";
import RoleRequest from "../models/roleRequestModel.js";
import CredentialPool from "../models/credentialPoolModel.js";
import PlayerProfile from "../models/playerProfileModel.js";
import CoachProfile from "../models/coachProfileModel.js";
import School from "../models/schoolModel.js";
import { createNotification } from "./notificationController.js";
import sendMail from "../utils/sendMailEnhanced.js";
import sendSMS, { formatPhoneNumber } from "../utils/sendSMS.js";

const JWT_SECRET = process.env.JWT_SECRET || "tamui_secret";

/* 🧍 PLAYER / VOLUNTEER SIGNUP (with password set by user) */
export const playerSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, role, age, gender, experience, affiliationType, affiliationId } = req.body;

    // Validation
    if (!firstName || !email || !phone || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Player-specific validation
    if (role === "player") {
      if (!age || !gender || !experience) {
        return res.status(400).json({ message: "Age, gender, and experience are required for players." });
      }
      if (typeof age !== "number" || age < 1 || age > 120) {
        return res.status(400).json({ message: "Please enter a valid age." });
      }
      
      // Affiliation validation for players
      if (!affiliationType || !affiliationId) {
        return res.status(400).json({ message: "Affiliation type and institution are required for players." });
      }
      if (!["school", "community"].includes(affiliationType)) {
        return res.status(400).json({ message: "Invalid affiliation type. Must be 'school' or 'community'." });
      }

      // Validate institution exists
      const institution = await School.findById(affiliationId);
      if (!institution) {
        return res.status(400).json({ message: "Selected institution not found." });
      }
      if (institution.type !== affiliationType) {
        return res.status(400).json({ message: "Institution type mismatch." });
      }
    }

    // Check if already registered
    const existingUser = await Person.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already registered!" });

    const existingRequest = await RoleRequest.findOne({ "applicantInfo.email": email, status: "pending" });
    if (existingRequest) return res.status(400).json({ message: "Signup request already pending!" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Prepare applicant info
    const applicantInfo = { firstName, lastName, email, phone };
    
    // Add player-specific fields if role is player
    if (role === "player") {
      applicantInfo.age = age;
      applicantInfo.gender = gender;
      applicantInfo.experience = experience;
      
      // Get institution details for affiliation
      const institution = await School.findById(affiliationId);
      applicantInfo.affiliation = {
        type: affiliationType,
        id: affiliationId,
        name: institution.name,
        location: institution.location,
      };
    }

    // Create pending request for admin approval
    const newRequest = new RoleRequest({
      applicantInfo,
      requestedRole: role,
      passwordHash,
    });
    await newRequest.save();

    // Notify all admins about the new account request
    try {
      const admins = await Person.find({ roles: { $in: ["admin"] } });
      const adminIds = admins.map(admin => admin._id);
      
      const roleLabel = role === "player" ? "Player" : role === "volunteer" ? "Volunteer" : "Coach";
      await Promise.all(adminIds.map(adminId => 
        createNotification(
          adminId,
          "account_request",
          "New Account Request",
          `${firstName} ${lastName} has applied for ${roleLabel} account.`,
          { relatedEntityId: newRequest._id, relatedEntityType: "role_request" }
        )
      ));
    } catch (notificationError) {
      console.error("Error creating notification for account request:", notificationError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      message: "Signup request submitted successfully. Wait for admin approval.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

/* 🧑‍💼 ADMIN APPROVES PLAYER / COACH / VOLUNTEER */
export const approvePlayer = async (req, res) => {
  try {
    const { requestId, coachId } = req.body;

    const request = await RoleRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    let finalCoachId = coachId;

    // Auto-link coach based on affiliation if coachId not provided and player has affiliation
    if (request.requestedRole === "player" && !coachId && request.applicantInfo.affiliation) {
      const { type, id: affiliationId } = request.applicantInfo.affiliation;
      
      // Find coaches linked to the same institution
      const institution = await School.findById(affiliationId);
      if (institution && institution.coachIds.length > 0) {
        // Get coaches with matching affiliation
        const coachProfiles = await CoachProfile.find({
          "affiliation.id": affiliationId,
          "affiliation.type": type,
        }).populate("personId");

        // Prefer coaches already linked to institution
        const preferredCoaches = coachProfiles.filter((cp) =>
          institution.coachIds.some((cid) => cid.toString() === cp.personId._id.toString())
        );

        if (preferredCoaches.length > 0) {
          // Use first coach from preferred list
          finalCoachId = preferredCoaches[0].personId._id;
        } else if (coachProfiles.length > 0) {
          // Fallback to any coach with matching affiliation
          finalCoachId = coachProfiles[0].personId._id;
        }
      }
    }

    // Validate coach if role is player and coach is selected
    if (request.requestedRole === "player" && finalCoachId) {
      const coach = await Person.findById(finalCoachId);
      if (!coach || !coach.roles.includes("coach")) {
        return res.status(400).json({ message: "Invalid coach selected." });
      }
    }

    // Generate unique code
    const uniqueUserId = `${request.requestedRole.substring(0, 3).toUpperCase()}-${Date.now()}`;

    // Check if user already exists with this email
    let existingPerson = await Person.findOne({ email: request.applicantInfo.email });
    
    let newPerson;
    if (existingPerson) {
      // If person exists, update their roles and info instead of creating new
      if (!existingPerson.roles.includes(request.requestedRole)) {
        existingPerson.roles.push(request.requestedRole);
      }
      
      // Update other fields if they're empty or different
      existingPerson.firstName = existingPerson.firstName || request.applicantInfo.firstName;
      existingPerson.lastName = existingPerson.lastName || request.applicantInfo.lastName;
      existingPerson.phone = existingPerson.phone || request.applicantInfo.phone;
      existingPerson.passwordHash = existingPerson.passwordHash || request.passwordHash;
      
      // Update unique ID if not set
      if (!existingPerson.uniqueUserId) {
        existingPerson.uniqueUserId = uniqueUserId;
      }
      
      await existingPerson.save();
      newPerson = existingPerson;
      console.log("Updated existing person:", { id: newPerson._id, uniqueUserId: newPerson.uniqueUserId });
    } else {
      // Create new user in Person
      newPerson = new Person({
        firstName: request.applicantInfo.firstName,
        lastName: request.applicantInfo.lastName,
        email: request.applicantInfo.email,
        phone: request.applicantInfo.phone,
        uniqueUserId,
        passwordHash: request.passwordHash,
        roles: [request.requestedRole],
      });
      await newPerson.save();
      console.log("Created new person:", { id: newPerson._id, uniqueUserId: newPerson.uniqueUserId });
    }

    // Create PlayerProfile if role is player
    if (request.requestedRole === "player") {
      // Check if player profile already exists
      const existingPlayerProfile = await PlayerProfile.findOne({ personId: newPerson._id });
      
      if (!existingPlayerProfile) {
        const profileData = {
          personId: newPerson._id,
          age: request.applicantInfo.age,
          gender: request.applicantInfo.gender,
          experience: request.applicantInfo.experience,
          assignedCoachId: finalCoachId || undefined,
        };

        // Add affiliation if present
        if (request.applicantInfo.affiliation) {
          profileData.affiliation = request.applicantInfo.affiliation;
        }

        await PlayerProfile.create(profileData);
      } else if (finalCoachId && !existingPlayerProfile.assignedCoachId) {
        // Update existing profile with coach if not already assigned
        existingPlayerProfile.assignedCoachId = finalCoachId;
        await existingPlayerProfile.save();
      }

      // Add coach to institution's coachIds if not already there
      if (finalCoachId && request.applicantInfo.affiliation) {
        const institution = await School.findById(request.applicantInfo.affiliation.id);
        if (institution && !institution.coachIds.includes(finalCoachId)) {
          institution.coachIds.push(finalCoachId);
          await institution.save();
        }
      }

      // Create notification for coach if assigned
      if (finalCoachId) {
        const coach = await Person.findById(finalCoachId);
        if (coach) {
          // Create in-app notification for coach
          if (finalCoachId) {
            await createNotification(
              finalCoachId,
              "player_assigned",
              "New Player Assigned",
              `A new player ${request.applicantInfo.firstName} ${request.applicantInfo.lastName} has been assigned to you.`,
              { relatedEntityId: newPerson._id, relatedEntityType: "player" }
            );
          }

          // Email sending disabled to prevent blocking approvals
          try {
            const coachEmailSubject = "New Player Assigned - YUltimate Hub";
            const coachEmailMessage = `Hello Coach ${coach.firstName},\n\nA new player has been assigned to you:\n\nPlayer: ${request.applicantInfo.firstName} ${request.applicantInfo.lastName}\nEmail: ${request.applicantInfo.email}\nPhone: ${request.applicantInfo.phone}\n\nPlease welcome them to your team!\n\nBest regards,\nYUltimate Hub Team`;
            
            await sendMail(
              coach.email,
              coachEmailSubject,
              coachEmailMessage
            );
          } catch (emailError) {
            console.log("📧 Email notification failed for coach assignment:", emailError.message);
          }

          // Send SMS to coach
          try {
            const formattedCoachPhone = formatPhoneNumber(coach.phone);
            if (formattedCoachPhone) {
              const coachSMSMessage = `YUltimate Hub: New player ${request.applicantInfo.firstName} ${request.applicantInfo.lastName} assigned to you. Check your email for details.`;
              
              await sendSMS(formattedCoachPhone, coachSMSMessage);
              console.log("✅ Coach assignment SMS sent to:", formattedCoachPhone);
            }
          } catch (smsError) {
            console.error("❌ Coach assignment SMS failed:", smsError.message);
          }
        }
      }

      // Notify the player that they've been assigned to a coach
      if (finalCoachId) {
        const coach = await Person.findById(finalCoachId);
        if (coach) {
          await createNotification(
            newPerson._id,
            "coach_assigned",
            "Coach Assigned",
            `You have been assigned to Coach ${coach.firstName} ${coach.lastName}.`,
            { relatedEntityId: finalCoachId, relatedEntityType: "coach" }
          );
        }
      }
    }

    // Create CoachProfile if role is coach
    if (request.requestedRole === "coach") {
      // Check if coach profile already exists
      const existingCoachProfile = await CoachProfile.findOne({ personId: newPerson._id });
      
      if (!existingCoachProfile) {
        const coachProfileData = {
          personId: newPerson._id,
          experienceYears: 0, // Default value, can be updated later
          certifications: [], // Empty initially, can be updated later
          totalSessionsConducted: 0,
          averageFeedbackScore: 0,
          currentSessions: [],
          upcomingSessions: [],
          feedbackReceived: [],
        };

        // Add affiliation if present in the request
        if (request.applicantInfo.affiliation) {
          coachProfileData.affiliation = request.applicantInfo.affiliation;
        }

        await CoachProfile.create(coachProfileData);
      }
    }

    // Update request
    request.status = "approved";
    request.reviewedAt = new Date();
    await request.save();

    // Notify the user that their account has been approved
    try {
      // Validate that newPerson has an _id before creating notification
      if (!newPerson || !newPerson._id) {
        console.error("Cannot create notification: newPerson or newPerson._id is undefined");
        console.error("newPerson:", newPerson);
        throw new Error("Person record not properly created");
      }

      console.log("Creating notification for user:", {
        userId: newPerson._id,
        type: "account_approved",
        title: "Account Approved",
        message: `Your ${request.requestedRole} account has been approved! Your User ID is ${newPerson.uniqueUserId}.`
      });

      const notification = await createNotification(
        newPerson._id,
        "account_approved",
        "Account Approved",
        `Your ${request.requestedRole} account has been approved! Your User ID is ${newPerson.uniqueUserId}.`,
        { relatedEntityId: newPerson._id, relatedEntityType: "account" }
      );

      if (!notification) {
        console.error("Failed to create notification");
      } else {
        console.log("Notification created successfully:", notification._id);
      }
    } catch (notificationError) {
      console.error("Error creating notification for account approval:", notificationError);
    }

    // Save credentials (only ID) - check if already exists
    const existingCredential = await CredentialPool.findOne({ personId: newPerson._id });
    if (!existingCredential) {
      await CredentialPool.create({
        personId: newPerson._id,
        uniqueUserId: newPerson.uniqueUserId,
        sentVia: "email",
      });
    }

    // Send comprehensive approval notifications (Email + SMS)
    const approvalMessage = `🎉 Congratulations! Your ${request.requestedRole.toUpperCase()} account has been approved!\n\nYour User ID: ${newPerson.uniqueUserId}\n\nYou can now login to YUltimate Hub with your User ID and password.\n\nWelcome to the team!`;
    
    const emailSubject = `Account Approved - Welcome to YUltimate Hub!`;
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #4CAF50; text-align: center; margin-bottom: 30px;">🎉 Account Approved!</h1>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
            <h2 style="color: #2d5a2d; margin: 0 0 10px 0;">Welcome to YUltimate Hub!</h2>
            <p style="color: #555; margin: 0; font-size: 16px;">Your ${request.requestedRole.toUpperCase()} account has been successfully approved.</p>
          </div>
          
          <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e3a8a; margin: 0 0 15px 0;">Your Login Credentials:</h3>
            <p style="font-size: 18px; margin: 5px 0;"><strong>User ID:</strong> <span style="background-color: #fffacd; padding: 5px 10px; border-radius: 4px; font-family: monospace; color: #b8860b;">${newPerson.uniqueUserId}</span></p>
            <p style="font-size: 16px; margin: 5px 0; color: #666;"><strong>Email:</strong> ${newPerson.email}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Login to YUltimate Hub</a>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #888; font-size: 14px;">
            <p>Thank you for joining YUltimate Hub! If you have any questions, please contact our support team.</p>
            <p><strong>YUltimate Hub Team</strong></p>
          </div>
        </div>
      </div>
    `;

    // Send Email Notification
    try {
      const emailResult = await sendMail(
        newPerson.email,
        emailSubject,
        approvalMessage,
        emailHTML
      );
      
      if (emailResult) {
        console.log("✅ Approval email sent successfully to:", newPerson.email);
      }
    } catch (emailError) {
      console.error("❌ Approval email failed:", emailError.message);
    }

    // Send SMS Notification
    try {
      const formattedPhone = formatPhoneNumber(newPerson.phone);
      if (formattedPhone) {
        const smsMessage = `🎉 YUltimate Hub: Your ${request.requestedRole.toUpperCase()} account is approved! User ID: ${newPerson.uniqueUserId}. Welcome to the team!`;
        
        const smsResult = await sendSMS(formattedPhone, smsMessage);
        
        if (smsResult) {
          console.log("✅ Approval SMS sent successfully to:", formattedPhone);
        }
      } else {
        console.warn("⚠️  Invalid phone number for SMS:", newPerson.phone);
      }
    } catch (smsError) {
      console.error("❌ Approval SMS failed:", smsError.message);
    }
    console.log("✅ User credentials:", { 
      email: newPerson.email, 
      uniqueUserId: newPerson.uniqueUserId 
    });

    const message = "Account approved successfully. User credentials created.";
      
    res.status(200).json({ message });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ message: "Approval failed", error: error.message });
  }
};

/* 🧑‍💻 LOGIN (Admin, Player, Coach, Volunteer) */
export const loginUser = async (req, res) => {
  try {
    const { uniqueUserId, password, role } = req.body;

    if (!uniqueUserId) return res.status(400).json({ message: "User ID is required." });

    const person = await Person.findOne({ uniqueUserId });
    if (!person) return res.status(404).json({ message: "Account not found!" });

    // 🔹 ADMIN LOGIN
    if (role === "admin" && person.roles.includes("admin")) {
      if (uniqueUserId !== "admin123") return res.status(401).json({ message: "Invalid Admin Code!" });

      const token = jwt.sign({ userId: person._id, role: person.roles }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).json({
        message: "Admin login successful!",
        user: {
          id: person._id,
          name: `${person.firstName} ${person.lastName}`,
          role: person.roles,
          uniqueUserId: person.uniqueUserId,
        },
        token,
      });
    }

    // 🔹 COACH LOGIN (has credentials created directly by admin)
    if (role === "coach") {
      if (!password) return res.status(400).json({ message: "Password is required for coach login." });

      const isMatch = await bcrypt.compare(password, person.passwordHash);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

      const token = jwt.sign({ userId: person._id, role: person.roles }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(200).json({
        message: "Coach login successful!",
        user: {
          id: person._id,
          name: `${person.firstName} ${person.lastName}`,
          role: person.roles,
          uniqueUserId: person.uniqueUserId,
        },
        token,
      });
    }

    // 🔹 PLAYER / VOLUNTEER LOGIN
    if (!password) return res.status(400).json({ message: "Password is required for login." });
    if (!person.passwordHash) return res.status(400).json({ message: "Password not set for this account." });

    const isMatch = await bcrypt.compare(password, person.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ userId: person._id, role: person.roles }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: person._id,
        name: `${person.firstName} ${person.lastName}`,
        role: person.roles,
        uniqueUserId: person.uniqueUserId,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/* 📋 GET PENDING REQUESTS */
export const getPendingRequests = async (req, res) => {
  try {
    const pending = await RoleRequest.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending requests", error: error.message });
  }
};

/* ❌ REJECT REQUEST */
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await RoleRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    request.reviewedAt = new Date();
    await request.save();

    // Notify the user if they have an account (in case they registered before rejection)
    try {
      const person = await Person.findOne({ email: request.applicantInfo.email });
      if (person) {
        await createNotification(
          person._id,
          "account_rejected",
          "Account Request Rejected",
          `Your ${request.requestedRole} account request has been rejected. Please contact admin for more information.`,
          { relatedEntityId: request._id, relatedEntityType: "role_request" }
        );
      }
    } catch (notificationError) {
      console.error("Error creating notification for account rejection:", notificationError);
    }

    res.status(200).json({ message: "Request rejected successfully." });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed", error: error.message });
  }
};

/* 👨‍🏫 GET ACTIVE COACHES */
export const getActiveCoaches = async (req, res) => {
  try {
    const coaches = await Person.find({
      roles: { $in: ["coach"] },
      accountStatus: "active"
    }).select("firstName lastName email uniqueUserId _id");

    res.status(200).json(coaches);
  } catch (error) {
    console.error("Get coaches error:", error);
    res.status(500).json({ message: "Failed to fetch coaches", error: error.message });
  }
};

/* ✅ APPROVE TRANSFER REQUEST */
export const approveTransfer = async (req, res) => {
  try {
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({ message: "Player ID is required" });
    }

    const profile = await PlayerProfile.findOne({ personId: playerId }).populate("personId");

    if (!profile) {
      return res.status(404).json({ message: "Player profile not found" });
    }

    if (!profile.transferRequest || profile.transferRequest.status !== "pending") {
      return res.status(400).json({ message: "No pending transfer request found" });
    }

    // Update transfer request status
    profile.transferRequest.status = "approved";
    profile.transferRequest.approvedOn = new Date();

    // Add to transfer history
    if (!profile.transferHistory) {
      profile.transferHistory = [];
    }
    profile.transferHistory.push({
      ...profile.transferRequest.toObject(),
      completedOn: new Date()
    });

    // Update current affiliation
    profile.affiliation = {
      type: profile.transferRequest.to.affiliationType,
      id: profile.transferRequest.to.id,
      name: profile.transferRequest.to.name,
      location: profile.transferRequest.to.location,
      joinedOn: new Date()
    };

    await profile.save();

    // Notify the player
    try {
      await createNotification(
        profile.personId._id,
        "transfer_approved",
        "Transfer Request Approved",
        `Your transfer request to ${profile.transferRequest.to.name} has been approved!`,
        { relatedEntityId: profile.transferRequest.to.id, relatedEntityType: "institution" }
      );
    } catch (notificationError) {
      console.error("Error creating notification for transfer approval:", notificationError);
    }

    res.status(200).json({
      message: "Transfer request approved successfully",
      transferRequest: profile.transferRequest
    });
  } catch (error) {
    console.error("Approve transfer error:", error);
    res.status(500).json({ message: "Failed to approve transfer request", error: error.message });
  }
};

/* ❌ REJECT TRANSFER REQUEST */
export const rejectTransfer = async (req, res) => {
  try {
    const { playerId, reason } = req.body;

    if (!playerId) {
      return res.status(400).json({ message: "Player ID is required" });
    }

    const profile = await PlayerProfile.findOne({ personId: playerId }).populate("personId");

    if (!profile) {
      return res.status(404).json({ message: "Player profile not found" });
    }

    if (!profile.transferRequest || profile.transferRequest.status !== "pending") {
      return res.status(400).json({ message: "No pending transfer request found" });
    }

    // Update transfer request status
    profile.transferRequest.status = "rejected";
    profile.transferRequest.rejectedOn = new Date();
    if (reason) {
      profile.transferRequest.rejectionReason = reason;
    }

    await profile.save();

    // Notify the player
    try {
      const message = reason 
        ? `Your transfer request to ${profile.transferRequest.to.name} has been rejected. Reason: ${reason}`
        : `Your transfer request to ${profile.transferRequest.to.name} has been rejected. Please contact admin for more information.`;
      
      await createNotification(
        profile.personId._id,
        "transfer_rejected",
        "Transfer Request Rejected",
        message,
        { relatedEntityId: profile.transferRequest.to.id, relatedEntityType: "institution" }
      );
    } catch (notificationError) {
      console.error("Error creating notification for transfer rejection:", notificationError);
    }

    res.status(200).json({
      message: "Transfer request rejected successfully",
      transferRequest: profile.transferRequest
    });
  } catch (error) {
    console.error("Reject transfer error:", error);
    res.status(500).json({ message: "Failed to reject transfer request", error: error.message });
  }
};

/* 📋 GET PENDING TRANSFER REQUESTS */
export const getPendingTransfers = async (req, res) => {
  try {
    const pendingTransfers = await PlayerProfile.find({
      "transferRequest.status": "pending"
    }).populate("personId", "firstName lastName email uniqueUserId");

    const formattedTransfers = pendingTransfers.map(profile => ({
      playerId: profile.personId._id,
      playerName: `${profile.personId.firstName} ${profile.personId.lastName}`,
      playerEmail: profile.personId.email,
      playerUserId: profile.personId.uniqueUserId,
      transferRequest: profile.transferRequest
    }));

    res.status(200).json(formattedTransfers);
  } catch (error) {
    console.error("Get pending transfers error:", error);
    res.status(500).json({ message: "Failed to fetch pending transfer requests", error: error.message });
  }
};
