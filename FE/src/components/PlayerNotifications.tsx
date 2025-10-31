import { useState } from "react";
import { Bell, X, Check, AlertCircle, Trophy, Calendar, Users, Shield, Heart, Clipboard, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export const PlayerNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "tournament", icon: Trophy, title: "Tournament Registration Open", message: "Summer Championship 2025 registration is now open", time: "10 min ago", unread: true, color: "blue" },
    { id: 2, type: "session", icon: Calendar, title: "Upcoming Training Session", message: "Advanced Throwing Workshop tomorrow at 10:00 AM", time: "30 min ago", unread: true, color: "green" },
    { id: 3, type: "team", icon: Users, title: "Team Invitation", message: "Lightning Strikes invited you to join their team", time: "1 hour ago", unread: true, color: "purple" },
    { id: 4, type: "result", icon: Trophy, title: "Match Result Posted", message: "Your team won 15-12 against Sky Warriors", time: "3 hours ago", unread: false, color: "orange" },
    { id: 5, type: "reminder", icon: Clock, title: "Session Reminder", message: "Cutting Fundamentals starts in 2 hours", time: "5 hours ago", unread: false, color: "blue" }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full bg-card/95 backdrop-blur-xl border border-border hover:bg-accent transition-all shadow-lg hover:shadow-xl"
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <Card className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden z-50 glass-card border-2 animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border sticky top-0 bg-card/95 backdrop-blur-xl z-10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                Player Notifications
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <button onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${notif.unread ? 'bg-blue-500/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-${notif.color}-500/10 to-${notif.color}-600/10 h-fit`}>
                          <notif.icon className={`h-4 w-4 text-${notif.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">{notif.title}</h4>
                            {notif.unread && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{notif.time}</span>
                            <div className="flex gap-1">
                              {notif.unread && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
export default PlayerNotifications;