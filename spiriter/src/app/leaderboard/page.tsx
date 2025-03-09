"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/api/leaderboard", { withCredentials: true });
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white">
        <p className="text-xl animate-pulse">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!leaderboard.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white">
        <p>No users in leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col items-center pt-16 px-4">
      {/* Heading / Hero */}
      <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-white">
        Leaderboard
      </h1>
      <p className="text-gray-200 text-lg mb-8">
        Top Performers in Spirit11 Fantasy Cricket
      </p>

      {/* Glassmorphic Container */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
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
                className="flex items-center justify-between py-4 px-2 hover:bg-white/5 transition-colors"
              >
                {/* Rank + Username */}
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-extrabold ${rankColor} w-12 text-center`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-base font-semibold">{user.username}</p>
                  </div>
                </div>

                {/* Points */}
                <p className="text-base font-medium text-white/70">
                  {user.totalPoints} points
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
