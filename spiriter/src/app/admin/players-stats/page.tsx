'use client';

import React, { useState, useEffect } from 'react';
import PlayerStatsCard, { PlayerStats } from '@/components/PlayerStatsCard';

/**
 * Page that fetches all players from /api/players and displays them
 * as row-like cards using the PlayerStatsCard component.
 */
export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/players');
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
      <h1 className="text-2xl font-bold mb-4">Player Stats</h1>

      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {players.map((player) => (
            <PlayerStatsCard key={player._id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
