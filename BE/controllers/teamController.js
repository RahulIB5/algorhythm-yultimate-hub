import Team from "../models/teamModel.js";
import Person from "../models/personModel.js";
import PlayerProfile from "../models/playerProfileModel.js";
import Match from "../models/matchModel.js";
import TeamRoster from "../models/teamRosterModel.js";

// Create a new team (coach registers on behalf of a team)
export const createTeam = async (req, res) => {
  try {
    const {
      teamName,
      totalMembers,
      players,
      tournamentId,
      contactPhone,
      contactEmail,
      notes,
    } = req.body;

    // Basic validation
    if (!teamName || !totalMembers || !players || !Array.isArray(players) || players.length === 0) {
      return res.status(400).json({ message: "teamName, totalMembers and players are required" });
    }

    // coachId should be available on req.user from auth middleware
    const coachId = req.user ? req.user.id : req.body.coachId;
    if (!coachId) return res.status(400).json({ message: "coachId not provided" });

    // Optionally verify coach exists
    const coach = await Person.findById(coachId);
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    // Validate that all players are assigned to this coach
    if (players && Array.isArray(players) && players.length > 0) {
      const playerIds = players.map(p => p.playerId || p._id).filter(id => id);
      if (playerIds.length > 0) {
        const assignedPlayers = await PlayerProfile.find({
          assignedCoachId: coachId,
          personId: { $in: playerIds }
        }).select("personId");

        const assignedPlayerIds = assignedPlayers.map(ap => ap.personId.toString());
        const invalidPlayers = playerIds.filter(id => !assignedPlayerIds.includes(id.toString()));
        
        if (invalidPlayers.length > 0) {
          return res.status(400).json({ 
            message: "Some selected players are not assigned to you. Please select only players assigned to your coach account." 
          });
        }
      }
    }

    const team = new Team({
      teamName,
      totalMembers,
      players,
      tournamentId,
      coachId,
      contactPhone,
      contactEmail,
      notes,
    });

    await team.save();
    res.status(201).json({ message: "Team created", team });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get teams for the logged-in coach
export const getMyTeams = async (req, res) => {
  try {
    const coachId = req.user ? req.user.id : req.query.coachId;
    if (!coachId) return res.status(400).json({ message: "coachId not provided" });

    const teams = await Team.find({ coachId }).sort({ createdAt: -1 });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Get teams error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all teams with wins/losses and player names
export const getAllTeams = async (req, res) => {
  try {
    // Get all teams
    const teams = await Team.find().sort({ teamName: 1 });
    
    // Get all completed matches
    const completedMatches = await Match.find({
      status: 'completed'
    }).populate('teamAId', 'teamName').populate('teamBId', 'teamName');

    // Calculate wins and losses for each team
    const teamStats = {};
    
    // Initialize stats for all teams
    teams.forEach(team => {
      teamStats[team._id.toString()] = {
        wins: 0,
        losses: 0
      };
    });

    // Calculate wins/losses from matches
    completedMatches.forEach(match => {
      if (!match.teamAId || !match.teamBId) return;
      
      const teamAId = match.teamAId._id.toString();
      const teamBId = match.teamBId._id.toString();

      if (match.winnerTeamId) {
        const winnerId = match.winnerTeamId.toString();
        
        // Update team A stats
        if (teamStats[teamAId]) {
          if (teamAId === winnerId) {
            teamStats[teamAId].wins += 1;
          } else {
            teamStats[teamAId].losses += 1;
          }
        }
        
        // Update team B stats
        if (teamStats[teamBId]) {
          if (teamBId === winnerId) {
            teamStats[teamBId].wins += 1;
          } else {
            teamStats[teamBId].losses += 1;
          }
        }
      }
    });

    // Prepare response with team details
    const teamsWithStats = await Promise.all(teams.map(async (team) => {
      // Get player names from TeamRoster
      const rosterPlayers = await TeamRoster.find({ 
        teamId: team._id,
        status: 'active'
      }).populate('playerId', 'firstName lastName');

      // Get player names
      const playerNames = [];
      
      // Add players from TeamRoster
      rosterPlayers.forEach(roster => {
        if (roster.playerId) {
          playerNames.push(`${roster.playerId.firstName} ${roster.playerId.lastName}`);
        }
      });

      // Add legacy players from team.players array if they exist and not already included
      if (team.players && Array.isArray(team.players)) {
        team.players.forEach(player => {
          if (player.name && !playerNames.includes(player.name)) {
            playerNames.push(player.name);
          }
        });
      }

      const stats = teamStats[team._id.toString()] || { wins: 0, losses: 0 };

      return {
        teamName: team.teamName,
        players: playerNames,
        wins: stats.wins,
        losses: stats.losses
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        teams: teamsWithStats,
        count: teamsWithStats.length
      }
    });
  } catch (error) {
    console.error("Get all teams error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

export default { createTeam, getMyTeams, getAllTeams };
