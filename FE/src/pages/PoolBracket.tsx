import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const PoolBracket = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32">
        <h1 className="text-4xl font-bold mb-8">Pool & Bracket</h1>
        
        {/* Pools Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          <Card className="glass-card glass-hover p-6">
            <h3 className="text-2xl font-semibold mb-4">Pool A</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((team) => (
                <div key={team} className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                  <span>Team {team}</span>
                  <span className="font-bold">0 pts</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass-card glass-hover p-6">
            <h3 className="text-2xl font-semibold mb-4">Pool B</h3>
            <div className="space-y-3">
              {[5, 6, 7, 8].map((team) => (
                <div key={team} className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                  <span>Team {team}</span>
                  <span className="font-bold">0 pts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tournament Bracket Tree Structure */}
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-3xl font-bold mb-8">Tournament Bracket</h2>
          
          <div className="overflow-x-auto">
            <div className="min-w-max pb-8">
              {/* Tournament Tree Grid */}
              <div className="grid grid-cols-5 gap-12">
                
                {/* Column 1 - Quarterfinals Left */}
                <div className="space-y-24">
                  <div className="relative">
                    <Card className="glass-card p-4 hover:shadow-lg transition-all">
                      <div className="font-semibold">Team 1</div>
                      <div className="text-sm text-muted-foreground">Pool A</div>
                    </Card>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-border"></div>
                  </div>

                  <div className="relative">
                    <Card className="glass-card p-4 hover:shadow-lg transition-all">
                      <div className="font-semibold">Team 4</div>
                      <div className="text-sm text-muted-foreground">Pool B</div>
                    </Card>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-border"></div>
                  </div>

                  <div className="relative">
                    <Card className="glass-card p-4 hover:shadow-lg transition-all">
                      <div className="font-semibold">Team 2</div>
                      <div className="text-sm text-muted-foreground">Pool A</div>
                    </Card>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-border"></div>
                  </div>

                  <div className="relative">
                    <Card className="glass-card p-4 hover:shadow-lg transition-all">
                      <div className="font-semibold">Team 3</div>
                      <div className="text-sm text-muted-foreground">Pool B</div>
                    </Card>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-border"></div>
                  </div>
                </div>

                {/* Column 2 - Semifinals */}
                <div className="flex flex-col justify-around py-12">
                  <div className="relative">
                    <Card className="glass-card p-4 hover:shadow-lg transition-all min-w-[180px]">
                      <div className="text-center text-xs text-muted-foreground mb-2">Semi-Final 1</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Team 1</span>
                          <span className="text-sm">-</span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground">vs</div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Team 4</span>
                          <span className="text-sm">-</span>
                        </div>
                      </div>
                    </Card>
                    <div className="absolute right-full top-[30%] w-12 h-0.5 bg-border"></div>
                    <div className="absolute right-full top-[70%] w-12 h-0.5 bg-border"></div>
                    <div className="absolute right-full top-[30%] w-0.5 bg-border" style={{right: 'calc(100% + 3rem)', height: '40%'}}></div>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-border"></div>
                  </div>

                  <div className="relative">
                    <Card className="glass-card p-4 hover:shadow-lg transition-all min-w-[180px]">
                      <div className="text-center text-xs text-muted-foreground mb-2">Semi-Final 2</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Team 2</span>
                          <span className="text-sm">-</span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground">vs</div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Team 3</span>
                          <span className="text-sm">-</span>
                        </div>
                      </div>
                    </Card>
                    <div className="absolute right-full top-[30%] w-12 h-0.5 bg-border"></div>
                    <div className="absolute right-full top-[70%] w-12 h-0.5 bg-border"></div>
                    <div className="absolute right-full top-[30%] w-0.5 bg-border" style={{right: 'calc(100% + 3rem)', height: '40%'}}></div>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-border"></div>
                  </div>
                </div>

                {/* Column 3 - Finals */}
                <div className="flex items-center">
                  <div className="relative">
                    <Card className="glass-card glass-hover p-6 min-w-[200px] border-2">
                      <div className="text-center text-sm font-semibold mb-4">FINAL</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="font-semibold">Winner SF1</span>
                          <span>-</span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground">vs</div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="font-semibold">Winner SF2</span>
                          <span>-</span>
                        </div>
                      </div>
                    </Card>
                    <div className="absolute right-full top-[35%] w-12 h-0.5 bg-border"></div>
                    <div className="absolute right-full top-[65%] w-12 h-0.5 bg-border"></div>
                    <div className="absolute right-full top-[35%] w-0.5 bg-border" style={{right: 'calc(100% + 3rem)', height: '30%'}}></div>
                    <div className="absolute left-full top-1/2 w-12 h-0.5 bg-primary"></div>
                  </div>
                </div>

                {/* Column 4 - Champion */}
                <div className="flex items-center">
                  <div className="relative">
                    <Card className="glass-card glass-hover p-6 min-w-[160px] border-2 border-primary/50">
                      <div className="text-center">
                        <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-semibold text-muted-foreground mb-2">CHAMPION</div>
                        <div className="font-bold text-lg">TBD</div>
                      </div>
                    </Card>
                    <div className="absolute right-full top-1/2 w-12 h-0.5 bg-primary"></div>
                  </div>
                </div>

                {/* Column 5 - Final Placement */}
                <div className="flex items-center">
                  <Card className="glass-card p-6 min-w-[140px]">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">🥇</div>
                      <div className="text-2xl font-bold text-primary mb-1">1st</div>
                      <div className="text-sm text-muted-foreground">Gold Medal</div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Third Place Branch */}
              <div className="grid grid-cols-5 gap-12 mt-16">
                <div className="col-start-3">
                  <div className="relative">
                    <div className="absolute left-1/2 bottom-full w-0.5 h-16 bg-border -translate-x-1/2"></div>
                    <Card className="glass-card p-5 min-w-[200px]">
                      <div className="text-center text-sm font-semibold mb-3">3rd PLACE</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="font-semibold text-sm">Loser SF1</span>
                          <span className="text-sm">-</span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground">vs</div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="font-semibold text-sm">Loser SF2</span>
                          <span className="text-sm">-</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex items-center">
                  <Card className="glass-card p-5 min-w-[140px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">🥉</div>
                      <div className="text-xl font-bold mb-1">3rd</div>
                      <div className="text-sm text-muted-foreground">Bronze Medal</div>
                    </div>
                  </Card>
                </div>

                <div className="flex items-center">
                  <Card className="glass-card p-6 min-w-[140px]">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">🥈</div>
                      <div className="text-2xl font-bold mb-1">2nd</div>
                      <div className="text-sm text-muted-foreground">Silver Medal</div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default PoolBracket;