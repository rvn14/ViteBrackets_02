"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlayerCard, { Player } from "@/components/playerCard";

export default function PlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);

  // ** Fetch Players on Mount **
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch("/api/players");
        const data = await response.json();

        if (Array.isArray(data)) {
          setPlayers(data);
          setFilteredPlayers(data); // Initialize filters
        } else {
          console.error("Unexpected data format:", data);
          setPlayers([]);
          setFilteredPlayers([]);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }

    fetchPlayers();
  }, []);

  // ** Filters **
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");
  const [valueRange, setValueRange] = useState<[number, number]>([0, 1000000]);

  // ** Apply Filters When Inputs Change **
  useEffect(() => {
    const filtered = players.filter((p) => {
      const playerName = p.name ? p.name.toLowerCase() : "";
      const playerUniversity = p.university ? p.university.toLowerCase() : "";
      const playerCategory = p.category || "";
      const playerValue = p.value ?? 0; // Ensure 'value' exists

      const matchesSearch = playerName.includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? playerCategory === filterCategory : true;
      const matchesUniversity = filterUniversity
        ? playerUniversity.includes(filterUniversity.toLowerCase())
        : true;
      const matchesValue = playerValue >= valueRange[0] && playerValue <= valueRange[1];

      return matchesSearch && matchesCategory && matchesUniversity && matchesValue;
    });

    setFilteredPlayers(filtered);
  }, [searchTerm, filterCategory, filterUniversity, valueRange, players]);

  return (
    <div className="p-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by player name..."
          className="border p-2 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border p-2"
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
          placeholder="Filter by University"
          className="border p-2"
          value={filterUniversity}
          onChange={(e) => setFilterUniversity(e.target.value)}
        />

        {/* Value Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Value:</span>
          <input
            type="number"
            className="border p-1 w-20"
            placeholder="Min"
            value={valueRange[0]}
            onChange={(e) => setValueRange([Number(e.target.value), valueRange[1]])}
          />
          <span>-</span>
          <input
            type="number"
            className="border p-1 w-20"
            placeholder="Max"
            value={valueRange[1]}
            onChange={(e) => setValueRange([valueRange[0], Number(e.target.value)])}
          />
        </div>

        {/* Add New Player Button */}
        <button
          onClick={() => router.push("players/add")}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Add New Player
        </button>
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div
              key={player._id}
              className="cursor-pointer"
              onClick={() => router.push(`/admin/players/${player._id}`)}
            >
              <PlayerCard player={player} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No players found.</p>
        )}
      </div>
    </div>
  );
}
