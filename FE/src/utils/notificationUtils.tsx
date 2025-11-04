import { Bell, X, Check, AlertCircle, Trophy, Calendar, Users, Shield, Heart, Clipboard, Clock, CheckCircle, UserPlus, ArrowRight } from "lucide-react";

// Icon mapping for notification types
export const getNotificationIcon = (type: string) => {
  const iconMap: { [key: string]: any } = {
    account_request: Users,
    account_approved: CheckCircle,
    account_rejected: AlertCircle,
    volunteer_assigned: Heart,
    player_assigned: Users,
    coach_assigned: Clipboard,
    tournament_registration: Trophy,
    match_scheduled: Calendar,
    match_result: Trophy,
    spirit_score_submitted: CheckCircle,
    spirit_score_received: CheckCircle,
    player_stats_submitted: Trophy,
    attendance_recorded: CheckCircle,
    match_attendance_recorded: CheckCircle,
    session_reminder: Clock,
    tournament_reminder: Calendar,
    session_assigned: Clipboard,
    session_updated: Calendar,
    session_enrollment: Users,
    volunteer_assignment_updated: Heart,
    volunteer_unassigned: X,
    volunteer_assigned_to_tournament: UserPlus,
    transfer_requested: ArrowRight,
    transfer_approved: CheckCircle,
    transfer_rejected: AlertCircle,
  };
  return iconMap[type] || Bell;
};

// Color mapping for notification types
export const getNotificationColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    account_request: "blue",
    account_approved: "green",
    account_rejected: "red",
    volunteer_assigned: "green",
    player_assigned: "purple",
    coach_assigned: "blue",
    tournament_registration: "orange",
    match_scheduled: "blue",
    match_result: "orange",
    spirit_score_submitted: "green",
    spirit_score_received: "green",
    player_stats_submitted: "orange",
    attendance_recorded: "green",
    match_attendance_recorded: "green",
    session_reminder: "blue",
    tournament_reminder: "orange",
    session_assigned: "blue",
    session_updated: "orange",
    session_enrollment: "green",
    volunteer_assignment_updated: "orange",
    volunteer_unassigned: "red",
    volunteer_assigned_to_tournament: "blue",
    transfer_requested: "blue",
    transfer_approved: "green",
    transfer_rejected: "red",
  };
  return colorMap[type] || "blue";
};

