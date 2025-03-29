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

export default function Players() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<"card" | "stats">("card");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

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

    // Execute both fetch operations
    Promise.all([fetchPlayers()]);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#000018] px-4 sm:px-6 lg:px-8 lg:mt-8">
      <div className="fixed top-0 left-1/4 w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0 rounded-full"></div>
      <div className="relative z-10 max-w-7xl mx-auto py-8"></div>
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Players</h1>
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

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`px-4 py-2 rounded ${
            categoryFilter === null
              ? "bg-cyan-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          All Players
        </button>
        <button
          onClick={() => setCategoryFilter("Batsman")}
          className={`px-4 py-2 rounded ${
            categoryFilter === "Batsman"
              ? "bg-cyan-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          Batsmen
        </button>
        <button
          onClick={() => setCategoryFilter("Bowler")}
          className={`px-4 py-2 rounded ${
            categoryFilter === "Bowler"
              ? "bg-cyan-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          Bowlers
        </button>
        <button
          onClick={() => setCategoryFilter("All-Rounder")}
          className={`px-4 py-2 rounded ${
            categoryFilter === "All-Rounder"
              ? "bg-cyan-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          All-Rounders
        </button>
      </div>
      {/* Available Players Section */}
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
        Available Players
      </h2>
      <div
        className={
          activeView === "card"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            : "space-y-4"
        }
      >
        {players
          .filter((player) =>
            categoryFilter ? player.category === categoryFilter : true
          )
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
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
