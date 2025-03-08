'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerCard, { Player } from '@/app/components/PlayerCard';

export default function () {
  const router = useRouter();
  
  const [players, setPlayers] = useState<Player[]>([]);

  // // In a real app, fetch from your DB or API
  // const [players, setPlayers] = useState<Player[]>([
  //   {
  //     _id: '1',
  //     name: 'Virat Kohli',
  //     university: 'Delhi Uni',
  //     runs: 12000,
  //     balls_faced: 11000,
  //     innings_played: 250,
  //     wickets: 0,
  //     overs_bowled: 0,
  //     runs_conceded: 0,
  //     category: 'Batsman',
  //     value: 500000,
  //     points: 120
  //   },
  //   {
  //     _id: '2',
  //     name: 'Lasith Malinga',
  //     university: 'Colombo Uni',
  //     runs: 600,
  //     balls_faced: 800,
  //     innings_played: 40,
  //     wickets: 200,
  //     overs_bowled: 1500,
  //     runs_conceded: 1200,
  //     category: 'Bowler',
  //     value: 400000,
  //     points: 90
  //   },
  //   {
  //     _id: '3',
  //     name: 'Ben Stokes',
  //     university: 'Leeds Uni',
  //     runs: 5000,
  //     balls_faced: 5200,
  //     innings_played: 120,
  //     wickets: 150,
  //     overs_bowled: 2400,
  //     runs_conceded: 2200,
  //     category: 'All-rounder',
  //     value: 800000,
  //     points: 180
  //   }
  // ]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('/api/players');
        const data = await response.json();
        // Handle different response formats
        if (Array.isArray(data)) {
          setPlayers(data);
        } else if (Array.isArray(data.players)) {
          setPlayers(data.players);
        } else if (data && Object.keys(data).length === 0) {
          // If data is an empty object, assume there are no players
          setPlayers([]);
        } else {
          console.error('Unexpected players data format:', data);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }

    fetchPlayers();
  }, []);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [valueRange, setValueRange] = useState<[number, number]>([0, 1000000]);

  // Filter logic
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    const matchesUni = filterUniversity
      ? p.university.toLowerCase().includes(filterUniversity.toLowerCase())
      : true;
    const matchesValue = p.value >= valueRange[0] && p.value <= valueRange[1];
    return matchesSearch && matchesCategory && matchesUni && matchesValue;
  });

  return (
    <div className="p-4">
      {/* Top bar: search, filters, add player button */}
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
            onChange={(e) =>
              setValueRange([Number(e.target.value), valueRange[1]])
            }
          />
          <span>-</span>
          <input
            type="number"
            className="border p-1 w-20"
            placeholder="Max"
            value={valueRange[1]}
            onChange={(e) =>
              setValueRange([valueRange[0], Number(e.target.value)])
            }
          />
        </div>

        {/* Add New Player => navigates to /players/add */}
        <button
          onClick={() => router.push('players/add')}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Add New Player
        </button>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers.map((player) => (
          <div
            key={player._id}
            className="cursor-pointer"
            onClick={() => router.push(`/admin/players/${player._id}`)}
          >
            <PlayerCard player={player} />
          </div>
        ))}
      </div>
    </div>
  );
}
