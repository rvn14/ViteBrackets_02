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
  budget: number; // This represents the remaining budget
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

  // Constant for the initial budget (Rs.9,000,000)
  const initialBudget = 9000000;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // First, get user data from cookies via API
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

      // Update budget: Add back the removed player's value
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
    <div className="min-h-screen w-full bg-[#000018] px-4 sm:px-6 lg:px-8">
      {/* Updated background effect */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-r from-blue-500 to-indigo-600 blur-[150px] -z-10"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-10">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Team & Budget Overview
        </h1>

        {/* Stylish Budget Overview Section */}
        {userData && (
          <div className="bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 p-8 rounded-2xl shadow-2xl mb-10 border border-white/20">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Budget Overview
            </h2>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <span className="text-lg text-white font-medium">Remaining</span>
                <span className="text-3xl font-bold text-white mt-2">
                  Rs. {userData.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-r border-white/40 px-6">
                <span className="text-lg text-white font-medium">Spent</span>
                <span className="text-3xl font-bold text-white mt-2">
                  Rs. {(initialBudget - userData.budget).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg text-white font-medium">Total Points</span>
                <span className="text-3xl font-bold text-white mt-2">
                  {totalPoints.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/30 border border-red-500 text-white p-4 rounded-lg mb-6">
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
          // Single column players list with styled cards
          <div className="grid grid-cols-1 gap-6">
            {team.map((player) => (
              <div
                key={player._id}
                className="bg-white/10 rounded-xl shadow-lg p-6 hover:bg-white/20 transition-all duration-300 flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white">
                    {player.name}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {player.category} - {player.university}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-white">
                    Rs. {player.playerValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Points: {player.playerPoints.toFixed(3)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          {/* Optionally, you can add a view toggle or other actions here */}
        </div>
      </div>
    </div>
  );
}
