import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Calendar, Settings, Plus, X } from "lucide-react";

const TournamentsTab = () => {
  const [showCreateTournament, setShowCreateTournament] = useState(false);

  const tournaments = [
    { id: 1, name: "Summer Championship 2025", teams: 24, status: "Upcoming", date: "2025-11-15" },
    { id: 2, name: "Youth Development League", teams: 16, status: "In Progress", date: "2025-11-01" },
    { id: 3, name: "Spring Open Tournament", teams: 20, status: "Completed", date: "2025-10-15" }
  ];

  return (
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
  );
};

export default TournamentsTab;

