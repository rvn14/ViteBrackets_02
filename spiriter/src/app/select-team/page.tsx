"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Player = {
  _id: string;
  name: string;
  university: string;
  category: string;
  runs: number;
  wickets: number;
  ballsFaced: number;
  playerPoints: number;
  playerValue: number;
};

export default function SelectTeam() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [team, setTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch players from DB
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("/api/players");
        setPlayers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load players.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();

    // Restore local 'team' from localStorage (optional)
    const savedTeam = JSON.parse(localStorage.getItem("selectedTeam") || "[]");
    setTeam(savedTeam);
  }, []);

  // Add a player
  const addPlayer = (player: Player) => {
    if (team.length < 11 && !team.some((p) => p._id === player._id)) {
      const newTeam = [...team, player];
      setTeam(newTeam);
      localStorage.setItem("selectedTeam", JSON.stringify(newTeam));
    }
  };

  // Remove a player
  const removePlayer = (playerId: string) => {
    const newTeam = team.filter((p) => p._id !== playerId);
    setTeam(newTeam);
    localStorage.setItem("selectedTeam", JSON.stringify(newTeam));
  };

  // Save the team to the user's doc in DB
  const saveTeam = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setError("User not found.");
      return;
    }
    try {
      // We only send array of IDs
      const playerIds = team.map((p) => p._id);
      const res = await axios.post(`/api/teams/${user.id}`, { players: playerIds });
      console.log("Team saved in DB:", res.data);
      alert("Team saved successfully!");
      router.push("/team");
    } catch (err) {
      console.error("Error saving team:", err);
      setError("Failed to save team.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Your Team</h2>
      <h4>Selected Players: {team.length}/11</h4>

      {loading && <p>Loading players...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {players.map((player) => (
          <li key={player._id} style={{ margin: "10px 0" }}>
            <strong>{player.name}</strong> - {player.university} ({player.category})
            <br />
            Runs: {player.runs} | Wickets: {player.wickets}
            <br />
            <button onClick={() => addPlayer(player)}>Add</button>
          </li>
        ))}
      </ul>

      <h3>Your Team</h3>
      <ul>
        {team.map((p) => (
          <li key={p._id} style={{ margin: "10px 0" }}>
            {p.name} ({p.category})
            <button onClick={() => removePlayer(p._id)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* “Save Team” button */}
      <button
        onClick={saveTeam}
        disabled={team.length !== 11}
        style={{ marginRight: "10px" }}
      >
        Save Team
      </button>

      {/* “View Team” button */}
      <button onClick={() => router.push("/team")}>View Team</button>
    </div>
  );
}
