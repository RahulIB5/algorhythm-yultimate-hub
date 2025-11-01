import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, TrendingUp, BookOpen } from "lucide-react";

const QuickActionsTab = () => {
  const actions = [
    { title: "Mark Attendance", icon: CheckCircle, count: 2, desc: "sessions pending" },
    { title: "Log Home Visits", icon: Home, count: 3, desc: "visits to record" },
    { title: "Update Assessments", icon: TrendingUp, count: 5, desc: "students due" }
  ];

  return (
    <Card className="glass-card glass-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.count} {action.desc}</p>
              </div>
            </div>
            <button className="text-sm px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Open
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActionsTab;

