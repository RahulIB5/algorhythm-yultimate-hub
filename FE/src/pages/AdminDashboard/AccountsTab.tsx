import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface AccountsTabProps {
  accountRequests: any[];
  handleApprove: (id: string | number) => void;
  handleReject: (id: string | number) => void;
}

const AccountsTab = ({ accountRequests, handleApprove, handleReject }: AccountsTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Approval Requests</h2>
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {accountRequests.map((request) => (
              <div
                key={request._id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">
                      {request.applicantInfo?.firstName} {request.applicantInfo?.lastName}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-600">
                      {request.requestedRole || "player"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.applicantInfo?.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Applied: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
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

export default AccountsTab;

