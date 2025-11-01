import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, TrendingUp } from "lucide-react";

const OverviewTab = () => {
  const stats = [
    { icon: Users, label: "Active Students", value: "42", change: "+3" },
    { icon: Calendar, label: "Sessions This Week", value: "6", change: "2 upcoming" },
    { icon: CheckCircle, label: "Attendance Rate", value: "91%", change: "+5%" },
    { icon: TrendingUp, label: "Avg Progress Score", value: "8.4", change: "+0.6" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="glass-card glass-hover hover:-translate-y-1 animate-slide-up glow-orange"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                <stat.icon className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-orange-600 font-medium">{stat.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;

