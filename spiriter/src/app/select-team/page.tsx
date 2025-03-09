"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SelectTeam() {
  const [players, setPlayers] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("/api/players");
        console.log("Fetched Players in Frontend:", res.data); // ✅ Debugging Log
        setPlayers(res.data);
      } catch (err) {
        setError("Failed to load players.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const addToTeam = (player: any) => {
    if (team.length < 11 && !team.some((p) => p._id === player._id)) {
      setTeam([...team, player]);
    }
  };

  return (
    <div>
      <h2>Select Your Team</h2>
      <h4>Selected Players: {team.length}/11</h4>

      {/* Show Loading or Error */}
      {loading && <p>Loading players...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Available Players List */}
      <ul>
        {players.length > 0 ? players.map((player: any, index) => (
          <li key={player._id}>
            <strong>{player.name ? player.name : "Missing Name"}</strong> - {player.university ? player.university : "Missing University"} ({player.category ? player.category : "Missing Category"})
            <br />
            🏏 <b>Runs:</b> {player.runs ?? 0} | 🎯 <b>Wickets:</b> {player.wickets ?? 0} | ⚡ <b>SR:</b> {player.ballsFaced > 0 ? ((player.runs / player.ballsFaced) * 100).toFixed(2) : "N/A"}
            <br />
            🏆 <b>Points:</b> {player.playerPoints ?? 0} | 💰 <b>Value:</b> Rs.{(player.playerValue ?? 0).toLocaleString()}
            <br />
            <button onClick={() => addToTeam(player)}>Add</button>
          </li>
        )) : <p>No players found.</p>}
      </ul>

      {/* Selected Team Display */}
      <h3>Your Team:</h3>
      <ul>
        {team.map((player: any) => (
          <li key={player._id}>
            {player.name} - {player.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
