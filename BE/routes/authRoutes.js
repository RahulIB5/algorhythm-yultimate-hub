import express from "express";
import {
  playerSignup,
  approvePlayer,
  loginUser,
  getPendingRequests,
  rejectRequest,
  getActiveCoaches,
  approveTransfer,
  rejectTransfer,
  getPendingTransfers
} from "../controllers/authController.js";
import { getAssignedStudents } from "../controllers/coachController.js";

const router = express.Router();

// Player signup
router.post("/signup/player", playerSignup);

// Admin approves a player
router.post("/approve/player", approvePlayer);

// Login (admin, player, etc.)
router.post("/login", loginUser);

// 🆕 Match frontend call exactly
router.get("/requests", getPendingRequests);
router.post("/reject/player", rejectRequest);

// Get active coaches
router.get("/coaches/active", getActiveCoaches);

// Get assigned students for a coach
router.get("/coach/:coachId/students", getAssignedStudents);

// Transfer request management
router.get("/transfers/pending", getPendingTransfers);
router.post("/transfers/approve", approveTransfer);
router.post("/transfers/reject", rejectTransfer);

export default router;
