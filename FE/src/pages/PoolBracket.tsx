import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

// Custom Node Components
const TeamNode = ({ data }) => (
  <div className="glass-card p-4 hover:shadow-lg transition-all min-w-[140px]">
    <Handle type="source" position={Position.Right} className="w-2 h-2 opacity-0" />
    <div className="font-semibold">{data.label}</div>
    <div className="text-sm text-muted-foreground">{data.pool}</div>
  </div>
);

const SemiFinalNode = ({ data }) => (
  <div className="glass-card p-4 hover:shadow-lg transition-all min-w-[180px]">
    <Handle type="target" position={Position.Left} className="w-2 h-2 opacity-0" />
    <Handle type="source" position={Position.Right} className="w-2 h-2 opacity-0" />
    <div className="text-center text-xs text-muted-foreground mb-2">{data.label}</div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{data.team1}</span>
        <span className="text-sm">-</span>
      </div>
      <div className="text-center text-xs text-muted-foreground">vs</div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">{data.team2}</span>
        <span className="text-sm">-</span>
      </div>
    </div>
  </div>
);

const FinalNode = ({ data }) => (
  <div className="glass-card glass-hover p-6 min-w-[200px] border-2">
    <Handle type="target" position={Position.Left} className="w-2 h-2 opacity-0" />
    <Handle type="source" position={Position.Right} className="w-2 h-2 opacity-0" />
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
  </div>
);

const ChampionNode = ({ data }) => (
  <div className="glass-card glass-hover p-6 min-w-[160px] border-2 border-primary/50">
    <Handle type="target" position={Position.Left} className="w-2 h-2 opacity-0" />
    <div className="text-center">
      <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
      <div className="text-sm font-semibold text-muted-foreground mb-2">CHAMPION</div>
      <div className="font-bold text-lg">{data.label || 'TBD'}</div>
    </div>
  </div>
);

const ThirdPlaceNode = ({ data }) => (
  <div className="glass-card p-5 min-w-[200px]">
    <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />
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
  </div>
);

const MedalNode = ({ data }) => (
  <div className="glass-card p-6 min-w-[140px]">
    <div className="text-center">
      <div className={`${data.size || 'text-3xl'} font-bold mb-2`}>{data.emoji}</div>
      <div className={`${data.textSize || 'text-2xl'} font-bold mb-1 ${data.color || ''}`}>{data.place}</div>
      <div className="text-sm text-muted-foreground">{data.medal}</div>
    </div>
  </div>
);

const nodeTypes = {
  team: TeamNode,
  semifinal: SemiFinalNode,
  final: FinalNode,
  champion: ChampionNode,
  thirdPlace: ThirdPlaceNode,
  medal: MedalNode,
};

const PoolBracket = () => {
  const initialNodes = [
    // Quarterfinal Teams
    { id: 'team1', type: 'team', position: { x: 50, y: 50 }, data: { label: 'Team 1', pool: 'Pool A' } },
    { id: 'team4', type: 'team', position: { x: 50, y: 200 }, data: { label: 'Team 4', pool: 'Pool B' } },
    { id: 'team2', type: 'team', position: { x: 50, y: 400 }, data: { label: 'Team 2', pool: 'Pool A' } },
    { id: 'team3', type: 'team', position: { x: 50, y: 550 }, data: { label: 'Team 3', pool: 'Pool B' } },
    
    // Semi-finals
    { id: 'sf1', type: 'semifinal', position: { x: 300, y: 100 }, data: { label: 'Semi-Final 1', team1: 'Team 1', team2: 'Team 4' } },
    { id: 'sf2', type: 'semifinal', position: { x: 300, y: 450 }, data: { label: 'Semi-Final 2', team1: 'Team 2', team2: 'Team 3' } },
    
    // Final
    { id: 'final', type: 'final', position: { x: 580, y: 250 }, data: {} },
    
    // Champion
    { id: 'champion', type: 'champion', position: { x: 880, y: 270 }, data: { label: 'TBD' } },
    
    // Third Place
    { id: 'third', type: 'thirdPlace', position: { x: 580, y: 700 }, data: {} },
    
    // Medals
    { id: 'gold', type: 'medal', position: { x: 1180, y: 270 }, data: { emoji: '🥇', place: '1st', medal: 'Gold Medal', color: 'text-primary', size: 'text-3xl', textSize: 'text-2xl' } },
    { id: 'bronze', type: 'medal', position: { x: 880, y: 700 }, data: { emoji: '🥉', place: '3rd', medal: 'Bronze Medal', size: 'text-2xl', textSize: 'text-xl' } },
    { id: 'silver', type: 'medal', position: { x: 1180, y: 700 }, data: { emoji: '🥈', place: '2nd', medal: 'Silver Medal', size: 'text-3xl', textSize: 'text-2xl' } },
  ];

  const initialEdges = [
    // To Semi-finals
    { id: 'e1-sf1', source: 'team1', target: 'sf1', animated: false, style: { stroke: 'hsl(var(--border))' } },
    { id: 'e4-sf1', source: 'team4', target: 'sf1', animated: false, style: { stroke: 'hsl(var(--border))' } },
    { id: 'e2-sf2', source: 'team2', target: 'sf2', animated: false, style: { stroke: 'hsl(var(--border))' } },
    { id: 'e3-sf2', source: 'team3', target: 'sf2', animated: false, style: { stroke: 'hsl(var(--border))' } },
    
    // To Final
    { id: 'esf1-final', source: 'sf1', target: 'final', animated: false, style: { stroke: 'hsl(var(--border))' } },
    { id: 'esf2-final', source: 'sf2', target: 'final', animated: false, style: { stroke: 'hsl(var(--border))' } },
    
    // To Champion
    { id: 'efinal-champ', source: 'final', target: 'champion', animated: false, style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 } },
    
    // To Gold Medal
    { id: 'echamp-gold', source: 'champion', target: 'gold', animated: false, style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 } },
    
    // To Third Place
    { id: 'esf1-third', source: 'sf1', target: 'third', sourceHandle: 'bottom', animated: false, style: { stroke: 'hsl(var(--border))', strokeDasharray: '5,5' } },
    { id: 'esf2-third', source: 'sf2', target: 'third', sourceHandle: 'bottom', animated: false, style: { stroke: 'hsl(var(--border))', strokeDasharray: '5,5' } },
    
    // To Bronze Medal
    { id: 'ethird-bronze', source: 'third', target: 'bronze', animated: false, style: { stroke: 'hsl(var(--border))' } },
    
    // Final to Silver (loser)
    { id: 'efinal-silver', source: 'final', target: 'silver', sourceHandle: 'bottom', animated: false, style: { stroke: 'hsl(var(--border))', strokeDasharray: '5,5' } },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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

        {/* Tournament Bracket with React Flow */}
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-3xl font-bold mb-8">Tournament Bracket</h2>
          
          <div className="h-[900px] rounded-lg border border-border/50 bg-background/30">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.5}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnScroll={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              panOnDrag={true}
              attributionPosition="bottom-right"
            >
              <Background 
                gap={20} 
                size={1} 
                color="hsl(var(--border))" 
                style={{ opacity: 0.3 }}
              />
              <Controls 
                showZoom={true}
                showFitView={true}
                showInteractive={false}
                className="bg-background border border-border rounded-lg shadow-lg"
              />
            </ReactFlow>
          </div>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default PoolBracket;