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

  // ✅ Track leftover budget in state
  const [leftoverBudget, setLeftoverBudget] = useState<number>(9000000); // Default or from user

  useEffect(() => {
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

    // ✅ Load saved team & leftover budget from localStorage (optional)
    const savedTeam = JSON.parse(localStorage.getItem("selectedTeam") || "[]");
    setTeam(savedTeam);

    // If the user is stored in localStorage, take budget from there
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.budget) {
      setLeftoverBudget(user.budget);
    }
  }, []);

  // ✅ Add a player if:
  //    - Team is under 11 players
  //    - Player isn't already in the team
  //    - We have enough leftover budget
  const addPlayer = (player: Player) => {
    if (team.length >= 11) {
      alert("Your team already has 11 players.");
      return;
    }
    if (team.some((p) => p._id === player._id)) {
      alert("This player is already in your team.");
      return;
    }

    const newCost = leftoverBudget - (player.playerValue || 0);
    if (newCost < 0) {
      alert("Not enough budget to add this player!");
      return;
    }

    const newTeam = [...team, player];
    setTeam(newTeam);
    setLeftoverBudget(newCost);

    // Save to localStorage
    localStorage.setItem("selectedTeam", JSON.stringify(newTeam));
  };

  // ✅ Remove a player, updating leftover budget
  const removePlayer = (playerId: string) => {
    const playerToRemove = team.find((p) => p._id === playerId);
    if (!playerToRemove) return;

    const newTeam = team.filter((p) => p._id !== playerId);
    setTeam(newTeam);
    setLeftoverBudget(leftoverBudget + (playerToRemove.playerValue || 0));

    // Save updated team to localStorage
    localStorage.setItem("selectedTeam", JSON.stringify(newTeam));
  };

  // ✅ Save team to database (final check on server)
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

      // If the server returns leftoverBudget, you could set leftoverBudget here
      if (res.data.leftoverBudget !== undefined) {
        setLeftoverBudget(res.data.leftoverBudget);
      }

      alert("Team saved successfully!");
      router.push("/team");
    } catch (err: any) {
      console.error("Error saving team:", err);
      setError(err.response?.data?.message || "Failed to save team.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Your Team</h2>
      <h4>Selected Players: {team.length}/11</h4>
      <p>Leftover Budget: Rs.{leftoverBudget.toLocaleString()}</p>

      {loading && <p>Loading players...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Available Players List */}
      <ul>
        {players.map((player) => (
          <li key={player._id} style={{ margin: "10px 0" }}>
            <strong>{player.name}</strong> - {player.university} ({player.category})
            <br />
            Runs: {player.runs}, Wickets: {player.wickets}, Value: Rs.{player.playerValue?.toLocaleString()}
            <br />
            <button onClick={() => addPlayer(player)}>Add</button>
          </li>
        ))}
      </ul>

      <h3>Your Team</h3>
      <ul>
        {team.map((p) => (
          <li key={p._id} style={{ margin: "10px 0" }}>
            {p.name} ({p.category}) - Value: Rs.{p.playerValue?.toLocaleString()}
            <button onClick={() => removePlayer(p._id)} style={{ marginLeft: "10px" }}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* “Save Team” button (server final check) */}
      <button
        onClick={saveTeam}
        disabled={team.length !== 11}
        style={{ marginRight: "10px", marginTop: "20px" }}
      >
        Save Team
      </button>

      {/* “View Team” button */}
      <button onClick={() => router.push("/team")} style={{ marginTop: "20px" }}>
        View Team
      </button>
    </div>
  );
}
