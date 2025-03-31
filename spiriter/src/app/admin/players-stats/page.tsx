"use client";

import React, { useState, useEffect } from "react";
import PlayerStatsCard, { PlayerStats } from "@/components/PlayerStatsCard";

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");
  const [valueRange, setValueRange] = useState<[number, number]>([0, Infinity]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/admin/players");
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      }finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  // Filter players based on name, category, university, and value range.
  const filteredPlayers = players.filter((player) => {
    const nameMatch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch = filterCategory
      ? player.category === filterCategory
      : true;
    const universityMatch = filterUniversity
      ? player.university.toLowerCase().includes(filterUniversity.toLowerCase())
      : true;
    const value = player.playerValue ?? 0;
    const valueMatch = value >= valueRange[0] && value <= valueRange[1];
    return nameMatch && categoryMatch && universityMatch && valueMatch;
  });

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-xl font-bold text-white">Error Loading Players</h1>
        <p className="text-red-600 mt-4">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="ml-3 text-white/80">Loading players...</p>
      </div>
    );
  }

  

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-black text-white text-center mb-6 sm:mb-8">
        Player Stats
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 bg-blue-200/5 backdrop-blur-sm p-3 sm:p-4 rounded-lg">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by player name..."
          className="border border-white/40 bg-blue-200/40 text-white rounded p-2 sm:p-3 flex-1 min-w-[180px] placeholder-white/60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border border-white/40 bg-blue-200/40 text-white rounded p-2 sm:p-3 flex-1 min-w-[180px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-rounder">All-Rounder</option>
        </select>

        {/* University Filter */}
        <input
          type="text"
          placeholder="Filter by university..."
          className="border border-white/40 bg-blue-200/40 text-white rounded p-2 sm:p-3 flex-1 min-w-[180px] placeholder-white/60"
          value={filterUniversity}
          onChange={(e) => setFilterUniversity(e.target.value)}
        />

        {/* Value Range Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-white">Value:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="border rounded p-2 w-16 sm:w-20 border-white/40 bg-blue-200/40 text-white"
              placeholder="Min"
              value={valueRange[0]}
              onChange={(e) =>
                setValueRange([Number(e.target.value), valueRange[1]])
              }
            />
            <span className="text-white">-</span>
            <input
              type="number"
              className="border rounded p-2 w-16 sm:w-20 border-white/40 bg-blue-200/40 text-white"
              placeholder="Max"
              value={valueRange[1] === Infinity ? "" : valueRange[1]}
              onChange={(e) =>
                setValueRange([
                  valueRange[0],
                  e.target.value ? Number(e.target.value) : Infinity,
                ])
              }
            />
          </div>
        </div>
      </div>

      {/* Players List */}
      {filteredPlayers.length === 0 ? (
        <div className="flex justify-center items-center h-40 bg-white/5 rounded-lg">
          <p className="text-center text-gray-400">
            No players found matching your filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {filteredPlayers.map((player) => (
            <PlayerStatsCard key={player._id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
