"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/api/leaderboard", {
          withCredentials: true,
        });
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center flex-col text-white">
        <div className="fixed top-0 left-0 sm:left-1/4 w-full sm:w-1/2 h-[300px] sm:h-[500px] bg-[#1789DC] blur-[100px] sm:blur-[150px] transform -translate-y-1/2 z-0 rounded-full"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-lg sm:text-xl animate-pulse">
            Loading leaderboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white px-4">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (!leaderboard.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white px-4">
        <p className="text-center">No users in leaderboard yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center pt-8 sm:pt-16 px-4 overflow-x-hidden lg:mt-8">
      {/* Background effect - more responsive */}
      <div className="fixed top-0 left-0 sm:left-1/4 w-full sm:w-1/2 h-[300px] sm:h-[500px] bg-[#1789DC] blur-[100px] sm:blur-[150px] transform -translate-y-1/2 z-0 rounded-full"></div>

      {/* Heading / Hero */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-200 text-sm sm:text-base md:text-lg">
          Top Performers in Spirit11 Fantasy Cricket
        </p>
      </div>

      {/* Glassmorphic Container */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 z-10">
        <ul className="divide-y divide-white/10">
          {leaderboard.map((user, index) => {
            // Special styling for the top 3 ranks
            let rankColor = "text-white";
            if (index === 0) rankColor = "text-yellow-400";
            if (index === 1) rankColor = "text-gray-300";
            if (index === 2) rankColor = "text-amber-600";

            return (
              <li
                key={user._id}
                className="flex items-center justify-between py-3 sm:py-4 px-1 sm:px-2 hover:bg-white/5 transition-colors rounded-md"
              >
                {/* Rank + Username */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <span
                    className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${rankColor} w-8 sm:w-12 text-center`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm sm:text-base font-semibold truncate max-w-[120px] sm:max-w-full">
                      {user.username}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <p className="text-sm sm:text-base font-medium text-white/70">
                  {user.totalPoints.toFixed(2)} pts
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
