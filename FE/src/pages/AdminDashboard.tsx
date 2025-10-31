import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Target, TrendingUp, Calendar, CheckCircle, Plus, X, Check, Clock, AlertCircle, FileText, BarChart3, Settings, UserCheck, Clipboard } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AdminNavbar from "@/components/AdminNavbar";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);

  const stats = [
    { icon: Users, label: "Total Players", value: "1,247", change: "+12%" },
    { icon: Trophy, label: "Active Tournaments", value: "8", change: "+2" },
    { icon: Target, label: "Teams Registered", value: "156", change: "+18%" },
    { icon: TrendingUp, label: "Avg Spirit Score", value: "14.2", change: "+0.8" },
    { icon: Calendar, label: "Sessions This Month", value: "42", change: "+5" },
    { icon: CheckCircle, label: "Attendance Rate", value: "87%", change: "+3%" }
  ];

  const accountRequests = [
    { id: 1, name: "Rahul Sharma", type: "Player", email: "rahul@email.com", date: "2025-10-29", status: "pending" },
    { id: 2, name: "Priya Patel", type: "Player", email: "priya@email.com", date: "2025-10-28", status: "pending" },
    { id: 3, name: "Amit Kumar", type: "Volunteer", email: "amit@email.com", date: "2025-10-27", status: "pending" },
    { id: 4, name: "Sneha Reddy", type: "Player", email: "sneha@email.com", date: "2025-10-26", status: "pending" }
  ];

  const volunteerRequests = [
    { id: 1, volunteer: "Vikram Singh", tournament: "Summer Championship 2025", role: "Score Keeper", date: "2025-10-30" },
    { id: 2, volunteer: "Anjali Mehta", tournament: "Youth Development League", role: "Field Marshal", date: "2025-10-29" },
    { id: 3, volunteer: "Rohan Gupta", tournament: "Summer Championship 2025", role: "Medical Support", date: "2025-10-28" }
  ];

  const coaches = [
    { id: 1, name: "Coach Rajesh", specialty: "Throwing", sessions: 12 },
    { id: 2, name: "Coach Meera", specialty: "Cutting", sessions: 15 },
    { id: 3, name: "Coach Arjun", specialty: "Defense", sessions: 10 }
  ];

  const tournaments = [
    { id: 1, name: "Summer Championship 2025", teams: 24, status: "Upcoming", date: "2025-11-15" },
    { id: 2, name: "Youth Development League", teams: 16, status: "In Progress", date: "2025-11-01" },
    { id: 3, name: "Spring Open Tournament", teams: 20, status: "Completed", date: "2025-10-15" }
  ];

  const upcomingSessions = [
    { id: 1, title: "Advanced Throwing Workshop", coach: "Coach Rajesh", date: "2025-11-05", time: "10:00 AM", spots: "12/15" },
    { id: 2, title: "Cutting Fundamentals", coach: "Coach Meera", date: "2025-11-06", time: "2:00 PM", spots: "8/15" },
    { id: 3, title: "Defensive Strategies", coach: "Coach Arjun", date: "2025-11-07", time: "4:00 PM", spots: "15/15" }
  ];

  const handleApprove = (id, type) => {
    console.log(`Approved ${type} request ID: ${id}`);
  };

  const handleReject = (id, type) => {
    console.log(`Rejected ${type} request ID: ${id}`);
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-lg"
          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar/>
      
      <div className="pt-20 px-4 pb-32">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-2 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Tournament Director & System Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            <TabButton id="overview" label="Overview" icon={BarChart3} />
            <TabButton id="tournaments" label="Tournaments" icon={Trophy} />
            <TabButton id="sessions" label="Coaching Sessions" icon={Calendar} />
            <TabButton id="accounts" label="Account Requests" icon={UserCheck} />
            <TabButton id="volunteers" label="Volunteers" icon={Users} />
            <TabButton id="reports" label="Reports & Analysis" icon={FileText} />
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card 
                    key={index} 
                    className="glass-card glass-hover hover:-translate-y-1 animate-slide-up glow-blue"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                        <stat.icon className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline justify-between">
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm text-blue-600 font-medium">{stat.change}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card glass-hover animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Pending Actions</span>
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { title: "Account Requests", count: 4, action: "Review", tab: "accounts" },
                      { title: "Volunteer Applications", count: 3, action: "Review", tab: "volunteers" },
                      { title: "Tournament Approvals", count: 2, action: "Approve", tab: "tournaments" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/5 to-orange-600/5 hover:from-orange-500/10 hover:to-orange-600/10 transition-all">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.count} pending</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab(item.tab)}
                          className="text-sm px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card glass-hover animate-slide-up">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Active Users</span>
                        <span className="text-2xl font-bold">892</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "71%" }}></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Sessions Booked</span>
                        <span className="text-2xl font-bold">35/42</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "83%" }}></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Tournament Capacity</span>
                        <span className="text-2xl font-bold">156/200</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tournament Management</h2>
                <button 
                  onClick={() => setShowCreateTournament(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Tournament
                </button>
              </div>

              {showCreateTournament && (
                <Card className="glass-card border-2 border-blue-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Create New Tournament</span>
                      <button onClick={() => setShowCreateTournament(false)}>
                        <X className="h-5 w-5" />
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tournament Name</label>
                          <input type="text" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="Enter tournament name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Date</label>
                          <input type="date" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Max Teams</label>
                          <input type="number" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="24" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Format</label>
                          <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none">
                            <option>Pool Play + Bracket</option>
                            <option>Round Robin</option>
                            <option>Single Elimination</option>
                            <option>Swiss System</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Rules & Guidelines</label>
                        <textarea className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none h-32" placeholder="Enter tournament rules, eligibility criteria, and guidelines..."></textarea>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Create Tournament
                        </button>
                        <button type="button" onClick={() => setShowCreateTournament(false)} className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-4">
                {tournaments.map((tournament) => (
                  <Card key={tournament.id} className="glass-card glass-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{tournament.name}</h3>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              tournament.status === 'In Progress' 
                                ? 'bg-blue-500/10 text-blue-600' 
                                : tournament.status === 'Upcoming'
                                ? 'bg-orange-500/10 text-orange-600'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {tournament.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {tournament.teams} teams
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {tournament.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Settings className="h-4 w-4 inline mr-2" />
                            Manage
                          </button>
                          <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Coaching Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Coaching Sessions</h2>
                <button 
                  onClick={() => setShowCreateSession(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Session
                </button>
              </div>

              {showCreateSession && (
                <Card className="glass-card border-2 border-blue-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Create New Session</span>
                      <button onClick={() => setShowCreateSession(false)}>
                        <X className="h-5 w-5" />
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Session Title</label>
                          <input type="text" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="Enter session title" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Assign Coach</label>
                          <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none">
                            <option value="">Select a coach</option>
                            {coaches.map(coach => (
                              <option key={coach.id} value={coach.id}>{coach.name} - {coach.specialty}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Date</label>
                          <input type="date" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Time</label>
                          <input type="time" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Max Participants</label>
                          <input type="number" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="15" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                          <input type="number" step="0.5" className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none" placeholder="2" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none h-24" placeholder="Session description and objectives..."></textarea>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Create Session
                        </button>
                        <button type="button" onClick={() => setShowCreateSession(false)} className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Available Coaches</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {coaches.map(coach => (
                      <div key={coach.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{coach.name}</p>
                          <p className="text-sm text-muted-foreground">{coach.specialty} • {coach.sessions} sessions</p>
                        </div>
                        <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          Assign
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingSessions.map(session => (
                      <div key={session.id} className="p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-blue-600/5 hover:from-blue-500/10 hover:to-blue-600/10 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{session.title}</p>
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">{session.spots}</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{session.coach}</p>
                          <p>{session.date} at {session.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Account Requests Tab */}
          {activeTab === "accounts" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Approval Requests</h2>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {accountRequests.map((request) => (
                      <div key={request.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{request.name}</h3>
                            <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-600">
                              {request.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">Applied: {request.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(request.id, 'account')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(request.id, 'account')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Volunteers Tab */}
          {activeTab === "volunteers" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Volunteer Requests</h2>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {volunteerRequests.map((request) => (
                      <div key={request.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{request.volunteer}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              {request.tournament}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clipboard className="h-4 w-4" />
                              Role: {request.role}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Applied: {request.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(request.id, 'volunteer')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(request.id, 'volunteer')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports & Analysis Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Reports & Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Player Statistics", description: "Comprehensive player performance metrics", icon: Users, color: "blue" },
                  { title: "Tournament Reports", description: "Detailed tournament outcomes and data", icon: Trophy, color: "purple" },
                  { title: "Spirit Score Analysis", description: "SOTG trends and team behavior", icon: TrendingUp, color: "green" },
                  { title: "Attendance Reports", description: "Session and tournament attendance", icon: CheckCircle, color: "orange" },
                  { title: "Financial Summary", description: "Registration fees and expenses", icon: FileText, color: "red" },
                  { title: "Team Performance", description: "Win rates and progression tracking", icon: Target, color: "indigo" }
                ].map((report, index) => (
                  <Card key={index} className="glass-card glass-hover hover:-translate-y-1 transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`p-3 bg-gradient-to-br from-${report.color}-500/10 to-${report.color}-600/10 rounded-lg w-fit mb-4`}>
                        <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                      </div>
                      <h3 className="font-bold mb-2">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                        Generate Report
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Reports */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Q3 Tournament Summary", date: "2025-10-28", size: "2.4 MB", type: "PDF" },
                      { name: "September Attendance", date: "2025-10-15", size: "1.1 MB", type: "Excel" },
                      { name: "Spirit Score Trends", date: "2025-10-10", size: "856 KB", type: "PDF" }
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.date} • {file.size} • {file.type}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Growth Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Player Registration Growth</span>
                        <span className="text-sm font-bold text-green-600">+24%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Session Attendance Rate</span>
                        <span className="text-sm font-bold text-blue-600">87%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Tournament Participation</span>
                        <span className="text-sm font-bold text-purple-600">92%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Top Performing Teams</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { rank: 1, team: "Lightning Strikes", wins: 28, spirit: 15.2 },
                      { rank: 2, team: "Sky Warriors", wins: 24, spirit: 14.8 },
                      { rank: 3, team: "Thunder Cats", wins: 22, spirit: 14.5 },
                      { rank: 4, team: "Wind Runners", wins: 20, spirit: 14.3 },
                      { rank: 5, team: "Storm Chasers", wins: 18, spirit: 14.0 }
                    ].map((team) => (
                      <div key={team.rank} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-blue-600/5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            team.rank === 1 ? 'bg-yellow-500 text-white' :
                            team.rank === 2 ? 'bg-gray-400 text-white' :
                            team.rank === 3 ? 'bg-orange-600 text-white' :
                            'bg-muted text-foreground'
                          }`}>
                            {team.rank}
                          </div>
                          <div>
                            <p className="font-medium">{team.team}</p>
                            <p className="text-xs text-muted-foreground">{team.wins} wins • Spirit: {team.spirit}</p>
                          </div>
                        </div>
                        {team.rank <= 3 && <Trophy className="h-5 w-5 text-yellow-500" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AdminDashboard;