'use client';

import React, { useState, useEffect } from 'react';
import PlayerStatsCard, { PlayerStats } from '@/components/PlayerStatsCard';

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");
  const [valueRange, setValueRange] = useState<[number, number]>([0, Infinity]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/admin/players');
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchPlayers();
  }, []);

  // Filter players based on name, category, university, and value range.
  const filteredPlayers = players.filter(player => {
    const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = filterCategory ? player.category === filterCategory : true;
    const universityMatch = filterUniversity
      ? player.university.toLowerCase().includes(filterUniversity.toLowerCase())
      : true;
    const value = player.playerValue ?? 0;
    const valueMatch = value >= valueRange[0] && value <= valueRange[1];
    return nameMatch && categoryMatch && universityMatch && valueMatch;
  });

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Error Loading Players</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-black text-white text-center mb-6">Player Stats</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 mb-8">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by player name..."
          className="border border-white/40 bg-blue-200/40 text-white/60 rounded p-3 flex-1 min-w-[180px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Category Filter */}
        <select
          className="border border-white/40 bg-blue-200/40 text-white/60 rounded p-3 flex-1 min-w-[180px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-rounder">All-rounder</option>
        </select>
        {/* University Filter */}
        <input
          type="text"
          placeholder="Filter by university..."
          className="border border-white/40 bg-blue-200/40 text-white/60 rounded p-3 flex-1 min-w-[200px]"
          value={filterUniversity}
          onChange={(e) => setFilterUniversity(e.target.value)}
        />
        {/* Value Range Filters */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-white">Value:</span>
          <input
            type="number"
            className="border rounded p-3 w-20 border-white/40 bg-blue-200/40 text-white/60"
            placeholder="Min"
            value={valueRange[0]}
            onChange={(e) => setValueRange([Number(e.target.value), valueRange[1]])}
          />
          <span className="text-white">-</span>
          <input
            type="number"
            className="border rounded p-3 w-20 border-white/40 bg-blue-200/40 text-white/60"
            placeholder="Max"
            value={valueRange[1]}
            onChange={(e) => setValueRange([valueRange[0], Number(e.target.value)])}
          />
        </div>
      </div>

      {/* Players List */}
      {filteredPlayers.length === 0 ? (
        <p className="text-center text-gray-500">No players found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPlayers.map((player) => (
            <PlayerStatsCard key={player._id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}