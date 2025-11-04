import Notification from "../models/notificationModel.js";
import Person from "../models/personModel.js";
import Team from "../models/teamModel.js";
import TeamRoster from "../models/teamRosterModel.js";
import VolunteerTournamentAssignment from "../models/volunteerTournamentAssignmentModel.js";

/**
 * Get all notifications for the current user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      });
    }

    const { limit = 50, offset = 0 } = req.query;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.status(200).json({
      success: true,
      data: {
        notifications: notifications.map(n => ({
          _id: n._id,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          readAt: n.readAt,
          relatedEntityId: n.relatedEntityId,
          relatedEntityType: n.relatedEntityType,
          createdAt: n.createdAt,
          time: formatTimeAgo(n.createdAt)
        })),
        unreadCount,
        total: notifications.length
      }
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: { notification }
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking notification as read",
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read for the current user
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: { updatedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking all notifications as read",
      error: error.message
    });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
      error: error.message
    });
  }
};

/**
 * Get unread count for the current user
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required"
      });
    }

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching unread count",
      error: error.message
    });
  }
};

/**
 * Helper function to format time ago
 */
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

/**
 * Helper function to create a notification
 * This can be used by other controllers
 */
export const createNotification = async (userId, type, title, message, options = {}) => {
  try {
    console.log("createNotification called with:", {
      userId: userId,
      type: type,
      title: title,
      message: message,
      options: options
    });

    if (!userId || !type || !title || !message) {
      throw new Error(`Missing required fields: userId=${userId}, type=${type}, title=${title}, message=${message}`);
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedEntityId: options.relatedEntityId,
      relatedEntityType: options.relatedEntityType,
      read: false
    });
    
    console.log("Notification created successfully:", notification._id);
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

/**
 * Helper function to create notifications for multiple users
 */
export const createNotificationsForUsers = async (userIds, type, title, message, options = {}) => {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      relatedEntityId: options.relatedEntityId,
      relatedEntityType: options.relatedEntityType,
      read: false
    }));

    const result = await Notification.insertMany(notifications);
    return result;
  } catch (error) {
    console.error("Create notifications for users error:", error);
    return [];
  }
};

/**
 * Notify all stakeholders linked to a tournament
 * targets: { admins?: boolean, coaches?: boolean, players?: boolean, volunteers?: boolean }
 */
export const notifyTournamentStakeholders = async (
  tournamentId,
  type,
  title,
  message,
  targets = { admins: true, coaches: true, players: true, volunteers: true }
) => {
  try {
    const recipientIds = new Set();

    // Admins
    if (targets.admins) {
      const admins = await Person.find({ roles: { $in: ["admin"] } }).select("_id");
      admins.forEach(a => recipientIds.add(a._id.toString()));
    }

    // Coaches from teams in this tournament
    let teams = [];
    if (targets.coaches || targets.players) {
      teams = await Team.find({ tournamentId }).select("_id coachId players");
    }
    if (targets.coaches) {
      teams.forEach(t => { if (t.coachId) recipientIds.add(t.coachId.toString()); });
    }

    // Players from TeamRoster and legacy team.players
    if (targets.players) {
      for (const team of teams) {
        const rosterPlayers = await TeamRoster.find({ teamId: team._id, status: 'active' }).select('playerId');
        rosterPlayers.forEach(r => { if (r.playerId) recipientIds.add(r.playerId.toString()); });
        if (Array.isArray(team.players)) {
          team.players.forEach(p => { if (p?.playerId) recipientIds.add(p.playerId.toString()); });
        }
      }
    }

    // Volunteers assigned to this tournament
    if (targets.volunteers) {
      const volunteerAssignments = await VolunteerTournamentAssignment.find({ tournamentId }).select('volunteerId');
      volunteerAssignments.forEach(v => { if (v.volunteerId) recipientIds.add(v.volunteerId.toString()); });
    }

    const ids = Array.from(recipientIds);
    if (ids.length === 0) return [];

    return await createNotificationsForUsers(
      ids,
      type,
      title,
      message,
      { relatedEntityId: tournamentId, relatedEntityType: "tournament" }
    );
  } catch (error) {
    console.error("Notify tournament stakeholders error:", error);
    return [];
  }
};

