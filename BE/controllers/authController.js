// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Person from "../models/personModel.js";
import RoleRequest from "../models/roleRequestModel.js";
import CredentialPool from "../models/credentialPoolModel.js";
import sendMail from "../utils/sendMail.js";

const JWT_SECRET = process.env.JWT_SECRET || "tamui_secret";

/* 🧍 PLAYER / VOLUNTEER SIGNUP (with password set by user) */
export const playerSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, role } = req.body;

    // Validation
    if (!firstName || !email || !phone || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if already registered
    const existingUser = await Person.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already registered!" });

    const existingRequest = await RoleRequest.findOne({ "applicantInfo.email": email, status: "pending" });
    if (existingRequest) return res.status(400).json({ message: "Signup request already pending!" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create pending request for admin approval
    const newRequest = new RoleRequest({
      applicantInfo: { firstName, lastName, email, phone },
      requestedRole: role,
      passwordHash,
    });
    await newRequest.save();

    res.status(201).json({
      message: "Signup request submitted successfully. Wait for admin approval.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

/* 🧑‍💼 ADMIN APPROVES PLAYER / VOLUNTEER */
export const approvePlayer = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await RoleRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Generate unique code
    const uniqueUserId = `${request.requestedRole.substring(0, 3).toUpperCase()}-${Date.now()}`;

    // Create user in Person
    const newPerson = new Person({
      firstName: request.applicantInfo.firstName,
      lastName: request.applicantInfo.lastName,
      email: request.applicantInfo.email,
      phone: request.applicantInfo.phone,
      uniqueUserId,
      passwordHash: request.passwordHash, // ✅ copy from request
      roles: [request.requestedRole],
    });
    await newPerson.save();

    // Update request
    request.status = "approved";
    request.reviewedAt = new Date();
    await request.save();

    // Save credentials (only ID)
    await CredentialPool.create({
      personId: newPerson._id,
      uniqueUserId,
      sentVia: "email",
    });

    // Send only unique ID in mail
    await sendMail(
      newPerson.email,
      "TAMUI Account Approved",
      `Your account has been approved!\nUser ID: ${uniqueUserId}\nUse your password created during registration to log in.`
    );

    res.status(200).json({ message: "Account approved & Unique ID sent to user." });
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

    res.status(200).json({ message: "Request rejected successfully." });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed", error: error.message });
  }
};
