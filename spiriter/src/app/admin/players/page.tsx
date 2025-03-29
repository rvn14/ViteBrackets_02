"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PlayerCard, { Player } from "@/components/playerCard";


export default function PlayersPage() {
  const router = useRouter();
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // ** Fetch Players on Mount **
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await response.json();
        if (!data.user.isAdmin) {
          toast.error("Unauthorized action: you do not have permission to access this page.");
          router.push("/");
          return;
        }
        setUser(data.user);
      }
        catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    }

    async function fetchPlayers() {
      try {
        const response = await fetch("/api/admin/players");
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
    fetchUser();
    fetchPlayers();
  }, []);

  // ** Filters **
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");

  const [valueRange, setValueRange] = useState<[number, number]>([0, Infinity]);

  // ** Apply Filters When Inputs Change **
  useEffect(() => {
    const filtered = players.filter((p) => {
      const playerName = p.name ? p.name.toLowerCase() : "";
      const playerUniversity = p.university ? p.university.toLowerCase() : "";
      const playerCategory = p.category || "";
      const playerValue = p.playerValue ?? 0; // Ensure 'value' exists

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
    <div className="p-4 text-white">
      {/* Search & Filters */}
      <h1 className="text-4xl font-black text-white text-center mb-6">All Players</h1>

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
