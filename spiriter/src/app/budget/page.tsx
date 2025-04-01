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

  return (
    <div className="budget min-h-screen w-full bg-[#000018] px-4 sm:px-6 lg:px-8">
      {/* More responsive background effect */}
      <div className="fixed top-0 left-1/4 w-1/2 h-[300px] sm:h-[500px] bg-[#1789DC] blur-[100px] sm:blur-[150px] transform -translate-y-1/2 z-0 rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-6 sm:py-10 mt-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 sm:mb-8 text-center">
          Team & Budget Overview
        </h1>

        {/* Responsive Budget Overview Section */}
        {userData && (
          <div className="bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl mb-6 sm:mb-10 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">
              Budget Overview
            </h2>

            {/* Fully responsive flex layout - stacks on mobile */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center w-full sm:w-auto">
                <span className="text-base sm:text-lg text-white font-medium">
                  Remaining
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">
                  Rs. {userData.budget.toLocaleString()}
                </span>
              </div>

              {/* Responsive dividers that only appear on tablet+ */}
              <div className="hidden sm:flex flex-col items-center border-l border-r border-white/40 px-6 h-16">
                <span className="text-base sm:text-lg text-white font-medium">
                  Spent
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">
                  Rs. {(initialBudget - userData.budget).toLocaleString()}
                </span>
              </div>

              {/* Mobile-only spent section without borders */}
              <div className="flex sm:hidden flex-col items-center w-full">
                <span className="text-base text-white font-medium">Spent</span>
                <span className="text-xl font-bold text-white mt-1">
                  Rs. {(initialBudget - userData.budget).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col items-center w-full sm:w-auto">
                <span className="text-base sm:text-lg text-white font-medium">
                  Total Points
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {totalPoints.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 sm:border-t-4 border-cyan-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/30 border border-red-500 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {team.length === 0 && !loading && !error ? (
          <div className="text-center py-6 sm:py-10">
            <p className="text-gray-400 text-base sm:text-lg">
              No team data available.
            </p>
            <button
              onClick={() => router.push("/select-team")}
              className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition-colors text-sm sm:text-base"
            >
              Select Your Team
            </button>
          </div>
        ) : (
          // Responsive player list with styled cards
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {team.map((player) => (
              <div
                key={player._id}
                className="bg-white/10 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-none">
                    {player.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1">
                    {player.category} - {player.university}
                  </p>
                </div>
                <div className="text-right sm:ml-4">
                  <p className="text-base sm:text-lg text-white">
                    Rs. {player.playerValue.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1">
                    Points: {player.playerPoints.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6 sm:mt-10">
          <button
            onClick={() => router.push("/select-team")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition-colors text-sm sm:text-base"
          >
            Manage Team
          </button>
        </div>
      </div>
    </div>
  );
}
