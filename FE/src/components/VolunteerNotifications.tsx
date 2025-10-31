import { useState } from "react";
import { Bell, X, Check, AlertCircle, Trophy, Calendar, Users, Shield, Heart, Clipboard, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export const VolunteerNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "assignment", icon: CheckCircle, title: "Assignment Approved", message: "You're assigned as Score Keeper for Summer Championship", time: "5 min ago", unread: true, color: "green" },
    { id: 2, type: "shift", icon: Clock, title: "Shift Reminder", message: "Your volunteer shift starts in 1 hour", time: "20 min ago", unread: true, color: "orange" },
    { id: 3, type: "opportunity", icon: Heart, title: "New Volunteer Opportunity", message: "Youth Development League needs Field Marshal", time: "2 hours ago", unread: true, color: "green" },
    { id: 4, type: "thanks", icon: Trophy, title: "Thank You!", message: "Tournament organizers appreciated your service", time: "1 day ago", unread: false, color: "purple" },
    { id: 5, type: "update", icon: AlertCircle, title: "Schedule Update", message: "Tournament start time changed to 9:00 AM", time: "2 days ago", unread: false, color: "blue" }
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
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
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
                <Heart className="h-5 w-5 text-green-600" />
                Volunteer Notifications
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
                      className={`p-4 hover:bg-muted/50 transition-colors ${notif.unread ? 'bg-green-500/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-${notif.color}-500/10 to-${notif.color}-600/10 h-fit`}>
                          <notif.icon className={`h-4 w-4 text-${notif.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">{notif.title}</h4>
                            {notif.unread && (
                              <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{notif.time}</span>
                            <div className="flex gap-1">
                              {notif.unread && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20"
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
export default VolunteerNotifications;