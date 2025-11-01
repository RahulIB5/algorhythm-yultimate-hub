import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, Trophy, TrendingUp, CheckCircle, FileText, Target
} from "lucide-react";

const ReportsTab = () => {
  return (
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
  );
};

export default ReportsTab;

