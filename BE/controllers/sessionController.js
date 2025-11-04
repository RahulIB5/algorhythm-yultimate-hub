import mongoose from "mongoose";
import Session from "../models/sessionModel.js";
import Person from "../models/personModel.js";
import Cohort from "../models/cohortModel.js";
import { createNotification, createNotificationsForUsers } from "./notificationController.js";

// Get all sessions
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("cohortId", "name")
      .populate("assignedCoaches", "firstName lastName email uniqueUserId")
      .populate("enrolledPlayers", "firstName lastName email uniqueUserId")
      .sort({ scheduledStart: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
  }
};

// Get a single session by ID
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("cohortId", "name")
      .populate("assignedCoaches", "firstName lastName email uniqueUserId")
      .populate("enrolledPlayers", "firstName lastName email uniqueUserId");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Failed to fetch session", error: error.message });
  }
};

// Create a new session
export const createSession = async (req, res) => {
  try {
    const { cohortId, title, type, scheduledStart, scheduledEnd, assignedCoaches, status, venue } = req.body;

    // Validation
    if (!title || !type || !scheduledStart || !scheduledEnd) {
      return res.status(400).json({ 
        message: "Title, type, scheduledStart, and scheduledEnd are required." 
      });
    }

    // Validate type
    if (!["training", "workshop"].includes(type)) {
      return res.status(400).json({ message: "Type must be either 'training' or 'workshop'" });
    }

    // Validate dates
    const startDate = new Date(scheduledStart);
    const endDate = new Date(scheduledEnd);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ message: "Invalid scheduledStart date format" });
    }

    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid scheduledEnd date format" });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ message: "scheduledEnd must be after scheduledStart" });
    }

    // Validate cohortId if provided (and not empty string)
    let validCohortId = null;
    if (cohortId && cohortId.trim() !== "") {
      // Check if it's a valid MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(cohortId)) {
        return res.status(400).json({ message: "Invalid cohortId format" });
      }
      const cohort = await Cohort.findById(cohortId);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      validCohortId = cohortId;
    }

    // Validate assignedCoaches if provided
    let validCoaches = [];
    if (assignedCoaches && Array.isArray(assignedCoaches) && assignedCoaches.length > 0) {
      // Filter out empty strings and validate ObjectIds
      const validCoachIds = assignedCoaches.filter(id => id && id.trim() !== "" && mongoose.Types.ObjectId.isValid(id));
      
      if (validCoachIds.length > 0) {
        const coaches = await Person.find({ 
          _id: { $in: validCoachIds },
          roles: { $in: ["coach"] }
        });
        
        if (coaches.length !== validCoachIds.length) {
          return res.status(400).json({ message: "One or more coaches not found or not valid coaches" });
        }
        validCoaches = validCoachIds;
      }
    }

    // Create session
    const sessionData = {
      title,
      type,
      scheduledStart: startDate,
      scheduledEnd: endDate,
      assignedCoaches: validCoaches,
      status: status || "scheduled",
    };

    // Add venue if provided
    if (venue && typeof venue === 'string' && venue.trim() !== "") {
      sessionData.venue = venue.trim();
    }

    // Only add cohortId if it's valid
    if (validCohortId) {
      sessionData.cohortId = validCohortId;
    }

    const newSession = new Session(sessionData);

    await newSession.save();

    const populatedSession = await Session.findById(newSession._id)
      .populate("cohortId", "name")
      .populate("assignedCoaches", "firstName lastName email uniqueUserId")
      .populate("enrolledPlayers", "firstName lastName email uniqueUserId");

  try {
    if (validCoaches && validCoaches.length > 0) {
      await createNotificationsForUsers(
        validCoaches,
        "session_assigned",
        "New Session Assigned",
        `You have been assigned to session "${title}".`,
        { relatedEntityId: newSession._id, relatedEntityType: "session" }
      );
    }
  } catch (notificationError) {
    console.error("Error notifying coaches for new session:", notificationError);
  }

    res.status(201).json({
      message: "Session created successfully",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ 
      message: "Failed to create session", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a session
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { cohortId, title, type, scheduledStart, scheduledEnd, assignedCoaches, status, venue } = req.body;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate type if provided
    if (type && !["training", "workshop"].includes(type)) {
      return res.status(400).json({ message: "Type must be either 'training' or 'workshop'" });
    }

    // Validate dates if provided
    if (scheduledStart && scheduledEnd) {
      const startDate = new Date(scheduledStart);
      const endDate = new Date(scheduledEnd);

      if (endDate <= startDate) {
        return res.status(400).json({ message: "scheduledEnd must be after scheduledStart" });
      }
    }

    // Validate status if provided
    if (status && !["scheduled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Status must be either 'scheduled' or 'completed'" });
    }

    // Validate cohortId if provided
    if (cohortId) {
      const cohort = await Cohort.findById(cohortId);
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      session.cohortId = cohortId;
    }

    // Validate assignedCoaches if provided
    if (assignedCoaches && assignedCoaches.length > 0) {
      const coaches = await Person.find({ 
        _id: { $in: assignedCoaches },
        roles: { $in: ["coach"] }
      });
      
      if (coaches.length !== assignedCoaches.length) {
        return res.status(400).json({ message: "One or more coaches not found or not valid coaches" });
      }
      session.assignedCoaches = assignedCoaches;
    }

    // Update fields
    if (title) session.title = title;
    if (type) session.type = type;
    if (scheduledStart) session.scheduledStart = new Date(scheduledStart);
    if (scheduledEnd) session.scheduledEnd = new Date(scheduledEnd);
    if (status) session.status = status;
    if (venue !== undefined) session.venue = venue || "";

    await session.save();

    const updatedSession = await Session.findById(id)
      .populate("cohortId", "name")
      .populate("assignedCoaches", "firstName lastName email uniqueUserId")
      .populate("enrolledPlayers", "firstName lastName email uniqueUserId");

  try {
    const coachIds = (session.assignedCoaches || []).map(id => id.toString());
    if (coachIds.length > 0) {
      await createNotificationsForUsers(
        coachIds,
        "session_updated",
        "Session Updated",
        `Session "${session.title}" details have been updated.`,
        { relatedEntityId: session._id, relatedEntityType: "session" }
      );
    }
    const playerIds = (session.enrolledPlayers || []).map(id => id.toString());
    if (playerIds.length > 0) {
      await createNotificationsForUsers(
        playerIds,
        "session_updated",
        "Session Updated",
        `Session "${session.title}" details have been updated.`,
        { relatedEntityId: session._id, relatedEntityType: "session" }
      );
    }
  } catch (notificationError) {
    console.error("Error notifying users for session update:", notificationError);
  }

    res.status(200).json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ message: "Failed to update session", error: error.message });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await Session.findByIdAndDelete(id);

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Failed to delete session", error: error.message });
  }
};

// Get all coaches (for dropdown/selection)
export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Person.find({ roles: { $in: ["coach"] } })
      .select("firstName lastName email uniqueUserId")
      .sort({ firstName: 1 });

    res.status(200).json(coaches);
  } catch (error) {
    console.error("Get coaches error:", error);
    res.status(500).json({ message: "Failed to fetch coaches", error: error.message });
  }
};

// Get all cohorts (for dropdown/selection)
export const getAllCohorts = async (req, res) => {
  try {
    const cohorts = await Cohort.find()
      .select("name startDate endDate capacity")
      .sort({ startDate: -1 });

    res.status(200).json(cohorts);
  } catch (error) {
    console.error("Get cohorts error:", error);
    res.status(500).json({ message: "Failed to fetch cohorts", error: error.message });
  }
};

// Get sessions by coach ID
export const getSessionsByCoach = async (req, res) => {
  try {
    const { coachId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({ message: "Invalid coach ID format" });
    }

    const sessions = await Session.find({ assignedCoaches: coachId })
      .populate("cohortId", "name")
      .populate("assignedCoaches", "firstName lastName email uniqueUserId")
      .populate("enrolledPlayers", "firstName lastName email uniqueUserId")
      .sort({ scheduledStart: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Get sessions by coach error:", error);
    res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
  }
};

// Get all players (for selection)
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Person.find({ roles: { $in: ["player"] } })
      .select("firstName lastName email uniqueUserId")
      .sort({ firstName: 1 });

    res.status(200).json(players);
  } catch (error) {
    console.error("Get players error:", error);
    res.status(500).json({ message: "Failed to fetch players", error: error.message });
  }
};

// Add players to a session
export const addPlayersToSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { playerIds } = req.body;

    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({ message: "playerIds must be a non-empty array" });
    }

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate player IDs
    const validPlayerIds = playerIds.filter(id => 
      id && typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)
    );

    if (validPlayerIds.length === 0) {
      return res.status(400).json({ message: "No valid player IDs provided" });
    }

    // Verify all IDs are valid players
    const players = await Person.find({
      _id: { $in: validPlayerIds },
      roles: { $in: ["player"] }
    });

    if (players.length !== validPlayerIds.length) {
      return res.status(400).json({ message: "One or more players not found or not valid players" });
    }

    // Add players to session (avoid duplicates)
    const existingPlayerIds = session.enrolledPlayers.map(id => id.toString());
    const newPlayerIds = validPlayerIds.filter(id => !existingPlayerIds.includes(id.toString()));
    
    if (newPlayerIds.length === 0) {
      return res.status(400).json({ message: "All selected players are already enrolled in this session" });
    }

    session.enrolledPlayers = [...session.enrolledPlayers, ...newPlayerIds];
    await session.save();

    const updatedSession = await Session.findById(id)
      .populate("cohortId", "name")
      .populate("assignedCoaches", "firstName lastName email uniqueUserId")
      .populate("enrolledPlayers", "firstName lastName email uniqueUserId");

  try {
    await createNotificationsForUsers(
      newPlayerIds,
      "session_enrollment",
      "Added To Session",
      `You have been added to session "${session.title}".`,
      { relatedEntityId: session._id, relatedEntityType: "session" }
    );
  } catch (notificationError) {
    console.error("Error notifying players added to session:", notificationError);
  }

    res.status(200).json({
      message: `${newPlayerIds.length} player(s) added successfully`,
      session: updatedSession,
    });
  } catch (error) {
    console.error("Add players to session error:", error);
    res.status(500).json({ message: "Failed to add players to session", error: error.message });
  }
};

