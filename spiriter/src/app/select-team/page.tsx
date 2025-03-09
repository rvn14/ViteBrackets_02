"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PlayerCard from "@/components/playerCard";
import PlayerStatsCard from "@/components/PlayerStatsCard";

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
  // Additional fields expected by the components
  inningsPlayed?: number;
  oversBowled?: number;
  runsConceded?: number;
  battingStrikeRate?: number;
  battingAverage?: number;
  bowlingStrikeRate?: number;
  economyRate?: number;
};

export default function SelectTeam() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [team, setTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<"card" | "stats">("card");

  // Track leftover budget in state
  const [leftoverBudget, setLeftoverBudget] = useState<number>(9000000);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("/api/players");
        // Calculate additional stats if needed
        const processedPlayers = (Array.isArray(res.data) ? res.data : []).map(
          (player: Player) => ({
            ...player,
            battingStrikeRate: player.ballsFaced
              ? (player.runs / player.ballsFaced) * 100
              : 0,
            economyRate:
              player.oversBowled && player.runsConceded
                ? player.runsConceded / player.oversBowled
                : 0,
            inningsPlayed: player.inningsPlayed || 1,
            oversBowled: player.oversBowled || 0,
            runsConceded: player.runsConceded || 0,
          })
        );
        setPlayers(processedPlayers);
      } catch (err) {
        setError("Failed to load players.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();

    // Load saved team & leftover budget from localStorage
    const savedTeam = JSON.parse(localStorage.getItem("selectedTeam") || "[]");
    setTeam(savedTeam);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.budget) {
      setLeftoverBudget(user.budget);
    }
  }, []);

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

  const removePlayer = (playerId: string) => {
    const playerToRemove = team.find((p) => p._id === playerId);
    if (!playerToRemove) return;

    const newTeam = team.filter((p) => p._id !== playerId);
    setTeam(newTeam);
    setLeftoverBudget(leftoverBudget + (playerToRemove.playerValue || 0));

    // Save updated team to localStorage
    localStorage.setItem("selectedTeam", JSON.stringify(newTeam));
  };

  const saveTeam = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setError("User not found.");
      return;
    }

    try {
      const playerIds = team.map((p) => p._id);
      const res = await axios.post(`/api/teams/${user.id}`, {
        players: playerIds,
      });

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
    <div className="min-h-screen w-full bg-[#000018] px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-1/4 w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0 rounded-full"></div>    
      <div className="relative z-10 max-w-7xl mx-auto py-8"></div>  
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Select Your Team</h1>
          <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => setActiveView("card")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                activeView === "card" ? "bg-cyan-600" : "bg-gray-700"
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setActiveView("stats")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base  ${
                activeView === "stats" ? "bg-cyan-600" : "bg-gray-700"
              }`}
            >
              Stats View
            </button>
          </div>
        </div>

        <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold">
            Selected: {team.length}/11 Players
          </h2>
          <p className="text-base sm:text-lg">
            Budget:{" "}
            <span className="text-green-400 font-bold">
              Rs.{leftoverBudget.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Your Team Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">
          Your Team ({team.length}/11)
        </h2>

        {team.length === 0 ? (
          <p className="text-gray-400 italic">
            No players selected yet. Add players from below.
          </p>
        ) : (
          <div
            className={
              activeView === "card"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
                : "space-y-4"
            }
          >
            {team.map((player) => (
              <div key={player._id} className="relative">
                {activeView === "card" ? (
                  <div className="relative group">
                    <PlayerCard
                      player={{
                        _id: player._id,
                        name: player.name,
                        university: player.university,
                        category: player.category as
                          | "Batsman"
                          | "Bowler"
                          | "All-Rounder",
                        runs: player.runs,
                        ballsFaced: player.ballsFaced,
                        inningsPlayed: player.inningsPlayed || 1,
                        wickets: player.wickets,
                        oversBowled: player.oversBowled || 0,
                        runsConceded: player.runsConceded || 0,
                        playerValue: player.playerValue,
                      }}
                    />
                    <button
                      onClick={() => removePlayer(player._id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="relative group" >
                    <PlayerStatsCard
                      player={{
                        _id: player._id,
                        name: player.name,
                        university: player.university,
                        category: player.category,
                        runs: player.runs,
                        ballsFaced: player.ballsFaced,
                        inningsPlayed: player.inningsPlayed || 1,
                        wickets: player.wickets,
                        oversBowled: player.oversBowled || 0,
                        runsConceded: player.runsConceded || 0,
                        battingStrikeRate: player.battingStrikeRate || 0,
                        battingAverage: player.battingAverage || 0,
                        bowlingStrikeRate: player.bowlingStrikeRate || 0,
                        economyRate: player.economyRate || 0,
                        playerPoints: player.playerPoints,
                        playerValue: player.playerValue,
                      }}
                    />
                    <button
                      onClick={() => removePlayer(player._id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Players Section */}
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Available Players</h2>
      <div
        className={
          activeView === "card"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            : "space-y-4"
        }
      >
        {players
          .filter((player) => !team.some((p) => p._id === player._id))
          .map((player) => (
            <div key={player._id} className="relative">
              {activeView === "card" ? (
                <div className="relative group">
                  <PlayerCard
                    player={{
                      _id: player._id,
                      name: player.name,
                      university: player.university,
                      category: player.category as
                        | "Batsman"
                        | "Bowler"
                        | "All-Rounder",
                      runs: player.runs,
                      ballsFaced: player.ballsFaced,
                      inningsPlayed: player.inningsPlayed || 1,
                      wickets: player.wickets,
                      oversBowled: player.oversBowled || 0,
                      runsConceded: player.runsConceded || 0,
                      playerValue: player.playerValue,
                    }}
                  />
                  <button
                    onClick={() => addPlayer(player)}
                    className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md transition-colors"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="relative group">
                  <PlayerStatsCard
                    player={{
                      _id: player._id,
                      name: player.name,
                      university: player.university,
                      category: player.category,
                      runs: player.runs,
                      ballsFaced: player.ballsFaced,
                      inningsPlayed: player.inningsPlayed || 1,
                      wickets: player.wickets,
                      oversBowled: player.oversBowled || 0,
                      runsConceded: player.runsConceded || 0,
                      battingStrikeRate: player.battingStrikeRate || 0,
                      battingAverage: player.battingAverage || 0,
                      bowlingStrikeRate: player.bowlingStrikeRate || 0,
                      economyRate: player.economyRate || 0,
                      playerPoints: player.playerPoints,
                      playerValue: player.playerValue,
                    }}
                  />
                  <button
                    onClick={() => addPlayer(player)}
                    className="top-1/2 right-4 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button
          onClick={saveTeam}
          disabled={team.length !== 11}
          className={`w-full sm:w-auto px-6 py-3 rounded font-semibold transition-colors {
            team.length !== 11
              ? " bg-gray-500 cursor-not-allowed"
              : " hover:bg-green-700 text-white"
          }`}
        >
          {team.length !== 11
            ? `Need ${11 - team.length} more players`
            : "Save Team"}
        </button>

        <button
          onClick={() => router.push("/team")}
          className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-700 text-white rounded font-semibold transition-colors"
        >
          View Team
        </button>
      </div>
    </div>
  );
}
