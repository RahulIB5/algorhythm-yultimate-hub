import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Target, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const stats = [
    { icon: Users, label: "Total Players", value: "1,247", change: "+12%" },
    { icon: Trophy, label: "Active Tournaments", value: "8", change: "+2" },
    { icon: Target, label: "Teams Registered", value: "156", change: "+18%" },
    { icon: TrendingUp, label: "Avg Spirit Score", value: "14.2", change: "+0.8" },
    { icon: Calendar, label: "Sessions This Month", value: "42", change: "+5" },
    { icon: CheckCircle, label: "Attendance Rate", value: "87%", change: "+3%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-4 pb-12">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 space-y-2 animate-slide-up">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's what's happening with your programs.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-primary font-medium">{stat.change}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Recent Tournaments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Summer Championship 2025", date: "May 15-17", status: "Upcoming" },
                  { name: "Youth Development League", date: "May 8-10", status: "In Progress" },
                  { name: "Spring Open Tournament", date: "Apr 20-22", status: "Completed" }
                ].map((tournament, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium">{tournament.name}</p>
                      <p className="text-sm text-muted-foreground">{tournament.date}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      tournament.status === 'In Progress' 
                        ? 'bg-primary/10 text-primary' 
                        : tournament.status === 'Upcoming'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Program Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "New Teams Registered", count: 12, icon: Users },
                  { title: "Spirit Scores Submitted", count: 84, icon: CheckCircle },
                  { title: "Coaching Sessions", count: 28, icon: Target }
                ].map((highlight, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all">
                    <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                      <highlight.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{highlight.title}</p>
                      <p className="text-sm text-muted-foreground">This week</p>
                    </div>
                    <div className="text-2xl font-bold">{highlight.count}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
