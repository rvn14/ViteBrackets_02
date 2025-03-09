"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TeamPage() {
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
        console.log("Team fetched from DB:", res.data);

        if (res.data.players && Array.isArray(res.data.players)) {
          setTeam(res.data.players);
        } else {
          setError("No team data available.");
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        setError("Failed to load team.");
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
    <div style={{ padding: "20px" }}>
      <h2>My Team</h2>
      <ul>
        {team.map((player) => (
          <li key={player._id} style={{ margin: "10px 0" }}>
            <strong>{player.name}</strong> - {player.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
