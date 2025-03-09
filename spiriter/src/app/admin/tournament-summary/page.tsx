'use client';

import React, { useEffect, useState } from 'react';

interface Player {
  _id: string;
  name: string;
  university: string;
  category: string;
  runs: number;
  wickets: number;
  battingStrikeRate: number;
  economyRate: number;
  // ... plus any other fields you return (oversBowled, etc.)
}

export default function TournamentSummaryPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/admin/players');
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        if (data.message) {
          // e.g. { message: "No players found" }
          setError(data.message);
        } else {
          setPlayers(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading tournament summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Tournament Summary</h1>
        <p>No players found.</p>
      </div>
    );
  }

  // 1) Calculate total runs & total wickets
  const totalRuns = players.reduce((acc, p) => acc + p.runs, 0);
  const totalWickets = players.reduce((acc, p) => acc + p.wickets, 0);

  // 2) Identify highest run scorer
  const highestRunScorer = players.reduce((prev, curr) =>
    curr.runs > prev.runs ? curr : prev
  );

  // 3) Identify highest wicket taker
  const highestWicketTaker = players.reduce((prev, curr) =>
    curr.wickets > prev.wickets ? curr : prev
  );

  // 4) Identify highest batting strike rate
  const highestBattingSR = players.reduce((prev, curr) =>
    curr.battingStrikeRate > prev.battingStrikeRate ? curr : prev
  );

  // 5) Identify highest bowling economy
  const highestBowlingEcon = players.reduce((prev, curr) =>
    curr.economyRate > prev.economyRate ? curr : prev
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tournament Summary</h1>

      {/* Display summary in a grid of 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Runs */}
        <SummaryCard
          title="Total Runs"
          value={totalRuns.toString()}
          highlight={false}
        />

        {/* Total Wickets */}
        <SummaryCard
          title="Total Wickets"
          value={totalWickets.toString()}
          highlight={false}
        />

        {/* Highest Run Scorer */}
        <SummaryCard
          title="Highest Run Scorer"
          value={`${highestRunScorer.name} (${highestRunScorer.runs} runs)`}
          highlight
        />

        {/* Highest Wicket Taker */}
        <SummaryCard
          title="Highest Wicket Taker"
          value={`${highestWicketTaker.name} (${highestWicketTaker.wickets} wickets)`}
          highlight
        />

        {/* Highest Batting SR */}
        <SummaryCard
          title="Highest Bat SR"
          value={`${highestBattingSR.name} (${highestBattingSR.battingStrikeRate.toFixed(2)})`}
          highlight
        />

        {/* Highest Economy */}
        <SummaryCard
          title="Highest Economy"
          value={`${highestBowlingEcon.name} (${highestBowlingEcon.economyRate.toFixed(2)})`}
          highlight
        />
      </div>
    </div>
  );
}

/** A small reusable card for each summary item. */
function SummaryCard({
  title,
  value,
  highlight
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded shadow p-4 flex flex-col items-center ${highlight ? 'border-2 border-blue-500' : ''}`}
    >
      <h2 className="text-sm font-semibold text-gray-600 mb-1">{title}</h2>
      <p className="text-md font-bold text-center">{value}</p>
    </div>
  );
}