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
          toast.error(
            "Unauthorized action: you do not have permission to access this page."
          );
          router.push("/");
          return;
        }
        setUser(data.user);
      } catch (error) {
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
      } finally {
        setLoading(false);
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
      const matchesCategory = filterCategory
        ? playerCategory === filterCategory
        : true;
      const matchesUniversity = filterUniversity
        ? playerUniversity.includes(filterUniversity.toLowerCase())
        : true;
      const matchesValue =
        playerValue >= valueRange[0] && playerValue <= valueRange[1];

      return (
        matchesSearch && matchesCategory && matchesUniversity && matchesValue
      );
    });

    setFilteredPlayers(filtered);
  }, [searchTerm, filterCategory, filterUniversity, valueRange, players]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="ml-3 text-white/80">Loading players...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white text-center sm:text-left mb-4 sm:mb-0">
          All Players
        </h1>
        <button
          onClick={() => router.push("players/add")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
        >
          Add New Player
        </button>
      </div>

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
          <option value="All-Rounder">All-Rounder</option>
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

      {/* Player Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div
              key={player._id}
              className="cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => router.push(`/admin/players/${player._id}`)}
            >
              <PlayerCard player={player} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-40 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-center">
              No players found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
