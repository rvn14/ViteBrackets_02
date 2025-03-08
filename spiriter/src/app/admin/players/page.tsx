"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("/api/players");
        setPlayers(res.data);
      } catch (err) {
        setError("Failed to load players.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  return (
    <div>
      <h2>Admin - Manage Players</h2>
      {loading ? <p>Loading players...</p> : 
        players.length ? (
          <ul>
            {players.map((player: any) => (
              <li key={player._id}>{player.name} - {player.university} ({player.category})</li>
            ))}
          </ul>
        ) : <p>No players found.</p>
      }
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
