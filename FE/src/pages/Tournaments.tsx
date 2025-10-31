import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

// Mock data for tournaments
const tournamentsData = [
  {
    id: 1,
    name: "National Championship 2024",
    status: "live",
    date: "Oct 28 - Nov 5, 2024",
    location: "Mumbai, Maharashtra",
    teams: 24,
    format: "Mixed Division",
    registrationDeadline: "Closed",
    prizePool: "₹5,00,000",
    description: "The premier national ultimate frisbee championship featuring top teams from across India.",
    currentRound: "Quarter Finals"
  },
  {
    id: 2,
    name: "Bangalore Open Tournament",
    status: "live",
    date: "Oct 30 - Nov 3, 2024",
    location: "Bangalore, Karnataka",
    teams: 16,
    format: "Open Division",
    registrationDeadline: "Closed",
    prizePool: "₹2,50,000",
    description: "Annual open division tournament showcasing competitive ultimate frisbee in South India.",
    currentRound: "Pool Play - Day 3"
  },
  {
    id: 3,
    name: "Winter Cup 2024",
    status: "upcoming",
    date: "Dec 15 - Dec 18, 2024",
    location: "Pune, Maharashtra",
    teams: 20,
    format: "Mixed Division",
    registrationDeadline: "Nov 30, 2024",
    prizePool: "₹3,00,000",
    description: "Premier winter tournament featuring mixed division teams competing for the championship title.",
    registrationOpen: true
  },
  {
    id: 4,
    name: "Coastal Classic",
    status: "upcoming",
    date: "Jan 10 - Jan 14, 2025",
    location: "Goa",
    teams: 18,
    format: "Open & Women's",
    registrationDeadline: "Dec 20, 2024",
    prizePool: "₹4,00,000",
    description: "Beach ultimate tournament with separate divisions for open and women's teams.",
    registrationOpen: true
  },
  {
    id: 5,
    name: "Delhi Invitational",
    status: "upcoming",
    date: "Feb 5 - Feb 9, 2025",
    location: "New Delhi",
    teams: 16,
    format: "Mixed Division",
    registrationDeadline: "Jan 15, 2025",
    prizePool: "₹2,00,000",
    description: "Invitational tournament bringing together elite mixed division teams from North India.",
    registrationOpen: true
  },
  {
    id: 6,
    name: "Spring Championship",
    status: "upcoming",
    date: "Mar 20 - Mar 24, 2025",
    location: "Hyderabad, Telangana",
    teams: 22,
    format: "Open Division",
    registrationDeadline: "Feb 28, 2025",
    prizePool: "₹3,50,000",
    description: "Major spring season tournament featuring competitive open division play.",
    registrationOpen: true
  }
];

const TournamentCard = ({ tournament }) => {
  const isLive = tournament.status === "live";
  
  return (
    <Card className="glass-card glass-hover p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold pr-2">{tournament.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          isLive
            ? 'bg-red-500/20 text-red-400 animate-pulse' 
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {isLive ? 'LIVE' : 'Upcoming'}
        </span>
      </div>

      {isLive && tournament.currentRound && (
        <div className="mb-3 px-3 py-2 bg-accent/50 rounded-lg">
          <p className="text-sm font-medium text-primary">{tournament.currentRound}</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {tournament.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{tournament.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{tournament.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{tournament.teams} Teams</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span>{tournament.format}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Prize Pool</span>
          <span className="font-semibold text-primary">{tournament.prizePool}</span>
        </div>
        
        {!isLive && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Registration</span>
            <span className={`font-semibold ${
              tournament.registrationOpen ? 'text-green-400' : 'text-red-400'
            }`}>
              {tournament.registrationOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        )}

        <Button 
          className="w-full rounded-full group"
          variant={isLive ? "default" : "outline"}
        >
          {isLive ? 'View Live Scores' : 'View Details'}
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};

const Tournaments = () => {
  const [filter, setFilter] = useState("all");

  const filteredTournaments = tournamentsData.filter(tournament => {
    if (filter === "all") return true;
    return tournament.status === filter;
  });

  const liveCount = tournamentsData.filter(t => t.status === "live").length;
  const upcomingCount = tournamentsData.filter(t => t.status === "upcoming").length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Tournaments</h1>
          <p className="text-muted-foreground">
            Discover and follow ultimate frisbee tournaments across India
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            All Tournaments
            <span className="ml-2 px-2 py-0.5 bg-background/20 rounded-full text-xs">
              {tournamentsData.length}
            </span>
          </Button>
          <Button
            variant={filter === "live" ? "default" : "outline"}
            onClick={() => setFilter("live")}
            className="rounded-full"
          >
            Live Now
            <span className="ml-2 px-2 py-0.5 bg-background/20 rounded-full text-xs">
              {liveCount}
            </span>
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            className="rounded-full"
          >
            Upcoming
            <span className="ml-2 px-2 py-0.5 bg-background/20 rounded-full text-xs">
              {upcomingCount}
            </span>
          </Button>
        </div>

        {filteredTournaments.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No tournaments found for this filter</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Tournaments;