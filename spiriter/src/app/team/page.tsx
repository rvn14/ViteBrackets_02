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
  inningsPlayed?: number;
  oversBowled?: number;
  runsConceded?: number;
  battingStrikeRate?: number;
  battingAverage?: number;
  bowlingStrikeRate?: number;
  economyRate?: number;
};

export default function TeamPage() {
  const router = useRouter();
  const [team, setTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<"card" | "stats">("card");
  
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
          const processedPlayers = res.data.players.map((player: Player) => ({
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
          }));
          setTeam(processedPlayers);
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

  return (
    <div className="min-h-screen w-full bg-[#000018] px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-1/4 w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0 rounded-full"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-8">
        <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">My Team</h1>
            <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveView("card")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  activeView === "card" ? "bg-cyan-600" : "bg-gray-700"
                }`}
              >
                Card View
              </button>
            </div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold">
              Team Size: {team.length} Players
            </h2>
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

        {team.length === 0 && !loading && !error ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">No team data available.</p>
            <button
              onClick={() => router.push("/select-team")}
              className="mt-4 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition-colors"
            >
              Select Your Team
            </button>
          </div>
        ) : (
          <div className={
            activeView === "card"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }>
            {team.map((player) => (
              <div key={player._id} className="relative">
                {activeView === "card" ? (
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
                ) : (
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
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/select-team")}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition-colors"
          >
            Back to Selection
          </button>
        </div>
      </div>
    </div>
  );
}