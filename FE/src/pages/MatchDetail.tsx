// MatchDetail.tsx
import React from 'react';
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Calendar, MapPin, Users, Trophy, Clock, Play } from 'lucide-react';

interface Player {
  name: string;
  position: string;
  points: number;
  assists: number;
  blocks: number;
}

interface Team {
  name: string;
  score: number;
}

interface MatchDetails {
  duration: string;
  attendance: number | string;
  weather: string;
}

interface Match {
  id: number;
  date: string;
  time: string;
  venue: string;
  status: string;
  teamA: Team;
  teamB: Team;
  youtubeId: string;
  details: MatchDetails;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  highlights: string[];
}

interface MatchDetailProps {
  match: Match;
  onBack: () => void;
}

const MatchDetail: React.FC<MatchDetailProps> = ({ match, onBack }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-6 hover:text-primary transition-colors"
        >
          <ChevronLeft size={24} />
          Back to Schedule
        </button>

        {/* Match Header Card */}
        <Card className="glass-card p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Match {match.id}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {match.date} • {match.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={18} />
                  {match.venue}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={18} />
                  {match.details.duration}
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              match.status === 'completed' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {match.status === 'completed' ? 'Final' : 'Scheduled'}
            </span>
          </div>

          {/* Score Display */}
          <div className="grid md:grid-cols-3 gap-6 items-center mb-6">
            <div className="text-center p-6 bg-secondary/20 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{match.teamA.name}</h2>
              <div className="text-5xl font-bold text-primary">{match.teamA.score}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">VS</div>
            </div>
            <div className="text-center p-6 bg-secondary/20 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{match.teamB.name}</h2>
              <div className="text-5xl font-bold text-primary">{match.teamB.score}</div>
            </div>
          </div>

          {/* Match Info */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="text-center">
              <Users className="mx-auto mb-2" size={24} />
              <div className="text-sm text-muted-foreground">Attendance</div>
              <div className="text-xl font-bold">{match.details.attendance}</div>
            </div>
            <div className="text-center">
              <Trophy className="mx-auto mb-2" size={24} />
              <div className="text-sm text-muted-foreground">Weather</div>
              <div className="text-xl font-bold">{match.details.weather}</div>
            </div>
            <div className="text-center">
              <Clock className="mx-auto mb-2" size={24} />
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="text-xl font-bold">{match.details.duration}</div>
            </div>
          </div>
        </Card>

        {/* YouTube Video Card */}
        <Card className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Play size={24} />
            {match.status === 'completed' ? 'Match Highlights' : 'Match Preview'}
          </h2>
          <div className="aspect-video rounded-lg overflow-hidden bg-secondary/20">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${match.youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </Card>

        {/* Highlights Card */}
        {match.highlights.length > 0 && (
          <Card className="glass-card p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Key Moments</h2>
            <ul className="space-y-3">
              {match.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Team Statistics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Team A Stats */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">{match.teamA.name}</h2>
            <div className="space-y-4">
              {match.teamAPlayers.map((player, index) => (
                <div key={index} className="p-4 bg-secondary/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">{player.position}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mt-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Points</div>
                      <div className="text-lg font-bold">{player.points}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Assists</div>
                      <div className="text-lg font-bold">{player.assists}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Blocks</div>
                      <div className="text-lg font-bold">{player.blocks}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Team B Stats */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">{match.teamB.name}</h2>
            <div className="space-y-4">
              {match.teamBPlayers.map((player, index) => (
                <div key={index} className="p-4 bg-secondary/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">{player.position}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mt-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Points</div>
                      <div className="text-lg font-bold">{player.points}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Assists</div>
                      <div className="text-lg font-bold">{player.assists}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Blocks</div>
                      <div className="text-lg font-bold">{player.blocks}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MatchDetail;