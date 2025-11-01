import { useState, useEffect } from "react";
import {
  Trophy, BarChart3, Calendar, UserCheck, Users, FileText
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import OverviewTab from "./OverviewTab";
import TournamentsTab from "./TournamentsTab";
import SessionsTab from "./SessionsTab";
import AccountsTab from "./AccountsTab";
import VolunteersTab from "./VolunteersTab";
import ReportsTab from "./ReportsTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [accountRequests, setAccountRequests] = useState([]);
  const [volunteerRequests] = useState([
    { id: 1, volunteer: "Vikram Singh", tournament: "Summer Championship 2025", role: "Score Keeper", date: "2025-10-30" },
    { id: 2, volunteer: "Anjali Mehta", tournament: "Youth Development League", role: "Field Marshal", date: "2025-10-29" },
    { id: 3, volunteer: "Rohan Gupta", tournament: "Summer Championship 2025", role: "Medical Support", date: "2025-10-28" }
  ]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/requests");
      const data = await response.json();
      if (response.ok) {
        setAccountRequests(data);
      } else {
        toast.error(data.message || "Failed to load requests");
      }
    } catch {
      toast.error("Server error while loading requests");
    }
  };

  const handleApprove = async (id: string | number, type: 'account' | 'volunteer' = 'account') => {
    try {
      const endpoint = type === 'account' ? 'player' : 'volunteer';
      const response = await fetch(`http://localhost:5000/api/auth/approve/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${type === 'account' ? 'Player' : 'Volunteer'} approved successfully!`);
        fetchPendingRequests();
      } else {
        toast.error(data.message || "Approval failed");
      }
    } catch {
      toast.error("Server error during approval");
    }
  };

  const handleReject = async (id: string | number, type: 'account' | 'volunteer' = 'account') => {
    try {
      const endpoint = type === 'account' ? 'player' : 'volunteer';
      const response = await fetch(`http://localhost:5000/api/auth/reject/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${type === 'account' ? 'Request' : 'Volunteer'} rejected!`);
        fetchPendingRequests();
      } else {
        toast.error(data.message || "Rejection failed");
      }
    } catch {
      toast.error("Server error during rejection");
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-lg"
          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar/>
      
      <div className="pt-20 px-4 pb-32">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-2 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Tournament Director & System Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            <TabButton id="overview" label="Overview" icon={BarChart3} />
            <TabButton id="tournaments" label="Tournaments" icon={Trophy} />
            <TabButton id="sessions" label="Coaching Sessions" icon={Calendar} />
            <TabButton id="accounts" label="Account Requests" icon={UserCheck} />
            <TabButton id="volunteers" label="Volunteers" icon={Users} />
            <TabButton id="reports" label="Reports & Analysis" icon={FileText} />
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === "tournaments" && <TournamentsTab />}
          {activeTab === "sessions" && <SessionsTab />}
          {activeTab === "accounts" && (
            <AccountsTab 
              accountRequests={accountRequests}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          )}
          {activeTab === "volunteers" && (
            <VolunteersTab 
              volunteerRequests={volunteerRequests}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          )}
          {activeTab === "reports" && <ReportsTab />}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AdminDashboard;

