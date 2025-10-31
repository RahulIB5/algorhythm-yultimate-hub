import express from "express";
import {
  playerSignup,
  approvePlayer,
  loginUser,
  getPendingRequests,
  rejectRequest
} from "../controllers/authController.js";

const router = express.Router();

// Player signup
router.post("/signup/player", playerSignup);

// Admin approves a player
router.post("/approve/player", approvePlayer);

// Login (admin, player, etc.)
router.post("/login", loginUser);

// 🆕 Match frontend call exactly
router.get("/requests", getPendingRequests);
router.post("/reject", rejectRequest);

export default router;
