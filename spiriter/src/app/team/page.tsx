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

type UserData = {
  userId: string;
  username: string;
  budget: number;
  totalPoints: number;
  isAdmin: boolean;
};

export default function TeamPage() {
  const router = useRouter();
  const [team, setTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<"card" | "stats">("card");
  const [totalPoints, setTotalPoints] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // First get user data from cookies via API
        const userRes = await axios.get("/api/user/me");
        const userData = userRes.data;
        setUserData(userData);

        if (!userData || !userData.userId) {
          setError("User not found. Please log in again.");
          setLoading(false);
          return;
        }
        // Now fetch team using user ID from cookie
        const res = await axios.get(`/api/teams/${userData.userId}`);
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
          // Handle case where no team data exists yet
          setTeam([]);
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

  // Calculate total points whenever team changes
  useEffect(() => {
    if (team.length > 0) {
      console.log("Calculating total points for team:");
      const calculatedPoints = team.reduce(
        (total, player) => total + (player.playerPoints || 0),
        0
      );
      setTotalPoints(calculatedPoints);
      console.log("Total points calculated:", calculatedPoints);
    }
  }, [team]);

  // Function to remove a player from the team
  const removePlayer = async (playerId: string) => {
    if (!userData?.userId) {
      setError("User not found. Please log in again.");
      return;
    }

    try {
      // Remove player from local state first for immediate UI feedback
      const playerToRemove = team.find((p) => p._id === playerId);
      if (!playerToRemove) return;

      const newTeam = team.filter((p) => p._id !== playerId);
      setTeam(newTeam);

      // Calculate new points total
      const newTotalPoints = newTeam.reduce(
        (total, player) => total + (player.playerPoints || 0),
        0
      );

      // Calculate updated budget (we need to add back the player's value)
      const updatedBudget = userData.budget + (playerToRemove.playerValue || 0);

      // Send the updated team to the server
      await axios.post(`/api/teams/${userData.userId}`, {
        players: newTeam.map((p) => p._id),
        totalPoints: newTotalPoints,
        budget: updatedBudget,
      });

      // Update user data state with new budget
      setUserData({
        ...userData,
        budget: updatedBudget,
      });
    } catch (err) {
      console.error("Error removing player:", err);
      setError("Failed to update team. Please try again.");

      // Fetch the team again to reset the state
      const res = await axios.get(`/api/teams/${userData.userId}`);
      if (res.data.players) {
        setTeam(res.data.players);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000018] px-4 sm:px-6 lg:px-8 mt-16">
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
              <button
                onClick={() => setActiveView("stats")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  activeView === "stats" ? "bg-cyan-600" : "bg-gray-700"
                }`}
              >
                Stats View
              </button>
            </div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold">
              Team Size: {team.length} Players
            </h2>
            {team.length === 11 && (
              <p className="text-lg mt-2">
                Total Points:{" "}
                <span className="text-green-400 font-bold">
                  {totalPoints.toFixed(3)}
                </span>
              </p>
            )}
            {userData && (
              <p className="text-lg mt-2">
                Budget:{" "}
                <span className="text-green-400 font-bold">
                  Rs.{userData.budget.toLocaleString()}
                </span>
              </p>
            )}
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
                      className="absolute cursor-pointer bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                      aria-label="Remove player"
                    >
                      ×
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
                      onClick={() => removePlayer(player._id)}
                      className="absolute cursor-pointer top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                      aria-label="Remove player"
                    >
                      ×
                    </button>
                  </div>
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
