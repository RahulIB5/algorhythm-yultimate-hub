import express from "express";
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getAllCoaches,
  getAllCohorts,
  getSessionsByCoach,
  getAllPlayers,
  addPlayersToSession
} from "../controllers/sessionController.js";

const router = express.Router();

// Specific routes must come before dynamic routes
// Get all coaches (for selection)
router.get("/coaches/list", getAllCoaches);

// Get all cohorts (for selection)
router.get("/cohorts/list", getAllCohorts);

// Get all players (for selection)
router.get("/players/list", getAllPlayers);

// Get sessions by coach ID
router.get("/coach/:coachId", getSessionsByCoach);

// Get all sessions
router.get("/", getAllSessions);

// Create a new session
router.post("/", createSession);

// Add players to a session
router.put("/:id/players", addPlayersToSession);

// Get a single session by ID
router.get("/:id", getSessionById);

// Update a session
router.put("/:id", updateSession);

// Delete a session
router.delete("/:id", deleteSession);

export default router;

