import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clipboard, Calendar, Check, X } from "lucide-react";

interface VolunteersTabProps {
  volunteerRequests: any[];
  handleApprove: (id: string | number, type: 'account' | 'volunteer') => void;
  handleReject: (id: string | number, type: 'account' | 'volunteer') => void;
}

const VolunteersTab = ({ volunteerRequests, handleApprove, handleReject }: VolunteersTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Volunteer Requests</h2>
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {volunteerRequests.map((request) => (
              <div key={request.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{request.volunteer}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {request.tournament}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clipboard className="h-4 w-4" />
                      Role: {request.role}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Applied: {request.date}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(request.id, 'volunteer')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(request.id, 'volunteer')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteersTab;

