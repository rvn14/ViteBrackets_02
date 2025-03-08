"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TeamView() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setError("User not found.");
        return;
      }

      try {
        const res = await axios.get(`/api/teams/${user.id}`);
        setTeam(res.data);
      } catch (err) {
        setError("Failed to load team.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div>
      <h2>My Team</h2>
      {loading ? <p>Loading team...</p> :
        team.length ? (
          <ul>
            {team.map((player: any) => (
              <li key={player._id}>{player.name} - {player.university} ({player.category})</li>
            ))}
          </ul>
        ) : <p>No players selected yet.</p>
      }
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
