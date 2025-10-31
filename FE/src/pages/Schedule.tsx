// Schedule.tsx
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from 'lucide-react';
import MatchDetail from './MatchDetail';

// Mock data for matches
export const matchesData = [
  {
    id: 1,
    date: "Nov 15, 2024",
    time: "14:00",
    venue: "Central Sports Complex",
    status: "completed",
    teamA: { name: "Thunder Strikers", score: 15 },
    teamB: { name: "Sky Warriors", score: 12 },
    youtubeId: "dQw4w9WgXcQ",
    details: { duration: "90 mins", attendance: 450, weather: "Sunny, 24°C" },
    teamAPlayers: [
      { name: "John Smith", position: "Handler", points: 4, assists: 3, blocks: 2 },
      { name: "Sarah Johnson", position: "Cutter", points: 6, assists: 2, blocks: 1 },
      { name: "Mike Davis", position: "Handler", points: 3, assists: 5, blocks: 0 },
      { name: "Emily Brown", position: "Cutter", points: 2, assists: 1, blocks: 3 }
    ],
    teamBPlayers: [
      { name: "Alex Turner", position: "Handler", points: 5, assists: 4, blocks: 1 },
      { name: "Jessica Lee", position: "Cutter", points: 4, assists: 2, blocks: 2 },
      { name: "Chris Wilson", position: "Handler", points: 2, assists: 3, blocks: 1 },
      { name: "Rachel Green", position: "Cutter", points: 1, assists: 2, blocks: 4 }
    ],
    highlights: [
      "Amazing layout catch by Sarah Johnson at 23:45",
      "Spectacular hammer throw by Alex Turner at 45:12",
      "Game-winning point by Thunder Strikers at 87:30"
    ]
  },
  {
    id: 2,
    date: "Nov 18, 2024",
    time: "16:30",
    venue: "Riverside Park",
    status: "completed",
    teamA: { name: "Phoenix Rising", score: 13 },
    teamB: { name: "Wave Riders", score: 13 },
    youtubeId: "jNQXAC9IVRw",
    details: { duration: "105 mins", attendance: 380, weather: "Cloudy, 20°C" },
    teamAPlayers: [
      { name: "David Martinez", position: "Handler", points: 5, assists: 3, blocks: 1 },
      { name: "Lisa Anderson", position: "Cutter", points: 4, assists: 2, blocks: 2 },
      { name: "Tom Roberts", position: "Handler", points: 2, assists: 4, blocks: 1 },
      { name: "Nina Patel", position: "Cutter", points: 2, assists: 1, blocks: 3 }
    ],
    teamBPlayers: [
      { name: "Kevin Chang", position: "Handler", points: 6, assists: 3, blocks: 0 },
      { name: "Amanda White", position: "Cutter", points: 3, assists: 3, blocks: 2 },
      { name: "Brian Foster", position: "Handler", points: 2, assists: 2, blocks: 2 },
      { name: "Sophie Miller", position: "Cutter", points: 2, assists: 1, blocks: 3 }
    ],
    highlights: [
      "Incredible bid save by Nina Patel at 34:20",
      "Perfect huck by Kevin Chang at 56:40",
      "Dramatic tie at the final whistle"
    ]
  },
  {
    id: 3,
    date: "Nov 22, 2024",
    time: "15:00",
    venue: "University Stadium",
    status: "upcoming",
    teamA: { name: "Storm Chasers", score: 0 },
    teamB: { name: "Wind Runners", score: 0 },
    youtubeId: "M7lc1UVf-VE",
    details: { duration: "TBD", attendance: "Expected 500+", weather: "Forecast: Partly Cloudy" },
    teamAPlayers: [
      { name: "Marcus Brown", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Julia Chen", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Ryan Taylor", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Olivia Moore", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    teamBPlayers: [
      { name: "Daniel Kim", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Emma Scott", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Jason Lee", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Maria Garcia", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    highlights: []
  },
  {
    id: 4,
    date: "Nov 25, 2024",
    time: "13:00",
    venue: "Metro Sports Arena",
    status: "upcoming",
    teamA: { name: "Lightning Bolts", score: 0 },
    teamB: { name: "Thunder Strikers", score: 0 },
    youtubeId: "9bZkp7q19f0",
    details: { duration: "TBD", attendance: "Expected 600+", weather: "Forecast: Sunny" },
    teamAPlayers: [
      { name: "Peter Johnson", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Grace Liu", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Sam Wilson", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Hannah Davis", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    teamBPlayers: [
      { name: "John Smith", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Sarah Johnson", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Mike Davis", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Emily Brown", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    highlights: []
  },
  {
    id: 5,
    date: "Nov 28, 2024",
    time: "17:00",
    venue: "Coastal Field",
    status: "upcoming",
    teamA: { name: "Wave Riders", score: 0 },
    teamB: { name: "Phoenix Rising", score: 0 },
    youtubeId: "kJQP7kiw5Fk",
    details: { duration: "TBD", attendance: "Expected 400+", weather: "Forecast: Windy" },
    teamAPlayers: [
      { name: "Kevin Chang", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Amanda White", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Brian Foster", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Sophie Miller", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    teamBPlayers: [
      { name: "David Martinez", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Lisa Anderson", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Tom Roberts", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Nina Patel", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    highlights: []
  },
  {
    id: 6,
    date: "Dec 2, 2024",
    time: "14:30",
    venue: "Championship Grounds",
    status: "upcoming",
    teamA: { name: "Sky Warriors", score: 0 },
    teamB: { name: "Storm Chasers", score: 0 },
    youtubeId: "L_jWHffIx5E",
    details: { duration: "TBD", attendance: "Expected 700+", weather: "Forecast: Clear" },
    teamAPlayers: [
      { name: "Alex Turner", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Jessica Lee", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Chris Wilson", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Rachel Green", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    teamBPlayers: [
      { name: "Marcus Brown", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Julia Chen", position: "Cutter", points: 0, assists: 0, blocks: 0 },
      { name: "Ryan Taylor", position: "Handler", points: 0, assists: 0, blocks: 0 },
      { name: "Olivia Moore", position: "Cutter", points: 0, assists: 0, blocks: 0 }
    ],
    highlights: []
  }
];

const Schedule = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (selectedMatch) {
    return <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32">
        <h1 className="text-4xl font-bold mb-8">Schedule & Results</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matchesData.map((match) => (
            <Card 
              key={match.id} 
              className="glass-card glass-hover p-6 cursor-pointer"
              onClick={() => setSelectedMatch(match)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Match {match.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  match.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {match.status === 'completed' ? 'Final' : 'Upcoming'}
                </span>
              </div>
              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar size={16} />
                {match.date} • {match.time}
              </p>
              <p className="text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin size={16} />
                {match.venue}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <span>{match.teamA.name}</span>
                  <span className="font-bold">{match.teamA.score}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <span>{match.teamB.name}</span>
                  <span className="font-bold">{match.teamB.score}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Schedule;