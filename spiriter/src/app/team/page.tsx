"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TeamView() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setError("User not found.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`/api/teams/${user.id}`);
        if (res.data.players) {
          setTeam(res.data.players);
        } else {
          setError("No team data available.");
        }

        try {
          // Fetch the authenticated user from the auth/me endpoint
          const res = await axios.get("/api/auth/me");
          const user = res.data.user;
          if (!user?._id) {
            setError("User not found.");
            setLoading(false);
            return;
          }
          // Optionally, persist the user in state if needed for rendering (e.g., setUser(currentUser))
          const { data: teamData } = await axios.get(`/api/teams/${user._id}`);
          setTeam(teamData);


      } catch (err) {
        setError("Failed to load team.");
        console.error("❌ Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return <p>Loading team...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (team.length === 0) return <p>No players selected yet.</p>;

  return (
    <div>
      <h2>My Team</h2>
      <ul>
        {team.map((player) => (
          <li key={player._id}>
            {player.name} - {player.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
