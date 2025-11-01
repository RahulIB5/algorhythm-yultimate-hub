import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TeamRegisterForm = ({ open, onOpenChange, tournament }) => {
  const [teamName, setTeamName] = useState("");
  const [totalMembers, setTotalMembers] = useState(5);
  const [players, setPlayers] = useState([]);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // initialize players array when totalMembers changes
    const arr = Array.from({ length: totalMembers }, (_, i) => players[i] || { name: "", playerId: "", email: "" });
    setPlayers(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalMembers]);

  useEffect(() => {
    if (!open) {
      // reset form on close
      setTeamName("");
      setTotalMembers(5);
      setPlayers([]);
      setContactPhone("");
      setContactEmail("");
      setNotes("");
    }
  }, [open]);

  const handlePlayerChange = (index, key, value) => {
    const copy = [...players];
    copy[index] = { ...copy[index], [key]: value };
    setPlayers(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const coachId = localStorage.getItem("userId");
      const payload = {
        teamName,
        totalMembers,
        players,
        tournamentId: tournament?.id || tournament?._id,
        contactPhone,
        contactEmail,
        notes,
        coachId,
      };

      const res = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Team registered successfully");
        onOpenChange(false);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register team error:", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Team {tournament ? `- ${tournament.name}` : ""}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Team Name</Label>
            <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
          </div>

          <div>
            <Label>Total Members</Label>
            <Input type="number" min={1} max={50} value={totalMembers} onChange={(e) => setTotalMembers(Number(e.target.value))} required />
          </div>

          <div className="space-y-2">
            <Label>Players</Label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
              {players.map((p, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                  <Input placeholder="Player Name" value={p.name} onChange={(e) => handlePlayerChange(idx, "name", e.target.value)} required />
                  <Input placeholder="Player ID" value={p.playerId} onChange={(e) => handlePlayerChange(idx, "playerId", e.target.value)} required />
                  <Input placeholder="Email (optional)" value={p.email} onChange={(e) => handlePlayerChange(idx, "email", e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Contact Phone</Label>
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>

          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <DialogFooter>
            <div className="w-full flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-orange-500 text-white" disabled={loading}>{loading ? "Registering..." : "Submit"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRegisterForm;
