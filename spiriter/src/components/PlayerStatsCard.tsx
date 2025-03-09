'use client';

import React from 'react';

/**
 * Interface matching the data returned from /api/players
 * Adjust if your actual field names differ (e.g. 'ballsFaced' vs 'balls_faced').
 */
export interface PlayerStats {
  _id: string;
  name: string;
  university: string;
  category: string;
  runs: number;
  ballsFaced: number;
  inningsPlayed: number;
  wickets: number;
  oversBowled: number;
  runsConceded: number;
  battingStrikeRate: number;
  battingAverage: number;
  bowlingStrikeRate: number;
  economyRate: number;
  playerPoints: number;
  playerValue: number;
}

interface PlayerStatsCardProps {
  player: PlayerStats;
}

/**
 * A row-like card that displays a player's stats
 */
export default function PlayerStatsCard({ player }: PlayerStatsCardProps) {
  return (
    <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded shadow">
      {/* Left section: name, university, category */}
      <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
        <h2 className="font-semibold text-lg">{player.name}</h2>
        <p className="text-sm text-gray-500">{player.university}</p>
        <p className="text-sm text-gray-500">{player.category}</p>
      </div>

      {/* Right section: stats in small columns */}
      <div className="w-full sm:w-2/3 flex flex-wrap gap-4 sm:gap-2 items-center justify-around sm:justify-end">
        <StatBox label="Runs" value={player.runs} />
        <StatBox label="Balls Faced" value={player.ballsFaced} />
        <StatBox label="Wickets" value={player.wickets} />
        <StatBox label="Overs Bowled" value={player.oversBowled} />
        <StatBox label="Innings" value={player.inningsPlayed} />
        <StatBox label="Bat SR" value={player.battingStrikeRate.toFixed(2)} />
        <StatBox label="Econ" value={player.economyRate.toFixed(2)} />
        <StatBox label="Value" value={player.playerValue} />
      </div>
    </div>
  );
}

/** A small sub-component for each stat column. */
function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center min-w-[80px]">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
