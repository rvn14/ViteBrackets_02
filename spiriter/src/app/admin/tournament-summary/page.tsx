'use client';

import React, { useEffect, useState } from 'react';
import { GiCricketBat, GiSoccerBall } from 'react-icons/gi';

interface Player {
  _id: string;
  name: string;
  university: string;
  category: string;
  runs: number;
  wickets: number;
  battingStrikeRate: number;
  economyRate: number;
  logoUrl?: string; // Optional team logo URL (not used for top performer cards)
}

export default function TournamentSummaryPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/admin/players', { credentials: 'include' });
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (data.message) {
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <p className="text-xl animate-pulse">Loading tournament summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold text-red-400">Error</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Tournament Summary</h1>
          <p className="mt-2">No players found.</p>
        </div>
      </div>
    );
  }

  // Calculate aggregate statistics and top performers
  const totalRuns = players.reduce((acc, p) => acc + p.runs, 0);
  const totalWickets = players.reduce((acc, p) => acc + p.wickets, 0);

  const highestRunScorer = players.reduce((prev, curr) =>
    curr.runs > prev.runs ? curr : prev
  );
  const highestWicketTaker = players.reduce((prev, curr) =>
    curr.wickets > prev.wickets ? curr : prev
  );
  const highestBattingSR = players.reduce((prev, curr) =>
    curr.battingStrikeRate > prev.battingStrikeRate ? curr : prev
  );
  const highestBowlingEcon = players.reduce((prev, curr) =>
    curr.economyRate > prev.economyRate ? curr : prev
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Tournament Summary</h1>
      
      {/* First Row: Total Runs & Total Wickets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <SummaryCard title="Total Runs" value={totalRuns.toString()} />
        <SummaryCard title="Total Wickets" value={totalWickets.toString()} />
      </div>

      {/* Second Row: Top Performers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Highest Run Scorer"
          value={`${highestRunScorer.name} (${highestRunScorer.runs} runs)`}
          highlight
        />
        <SummaryCard
          title="Highest Wicket Taker"
          value={`${highestWicketTaker.name} (${highestWicketTaker.wickets} wickets)`}
          highlight
        />
        <SummaryCard
          title="Best Batting SR"
          value={`${highestBattingSR.name} (${highestBattingSR.battingStrikeRate.toFixed(2)})`}
          highlight
        />
        <SummaryCard
          title="Best Economy"
          value={`${highestBowlingEcon.name} (${highestBowlingEcon.economyRate.toFixed(2)})`}
          highlight
        />
      </div>
    </div>
  );
}

/** A reusable stat card component with premium styling and hover effects */
interface SummaryCardProps {
  title: string;
  value: string;
  highlight?: boolean;
}

function SummaryCard({ title, value, highlight = false }: SummaryCardProps) {
  // For the "Total Runs" and "Total Wickets" cards, display specific icons.
  // For the other four cards, always display the fallback image.
  let content;
  if (title === 'Total Runs') {
    content = (<GiCricketBat className="w-12 h-12 mb-2 text-white" />);
  } else if (title === 'Total Wickets') {
    content = (<img src='/images/cricket-ball.png' className='w-12 h-12 mb-2 object-contain' />);
  } else {
    content = (
      <img
        src="https://www.shareicon.net/data/128x128/2016/06/27/787169_people_512x512.png"
        alt="default"
        className="w-12 h-12 mb-2 object-contain rounded-full"
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 ${
        highlight ? 'border-2 border-blue-500' : 'border border-gray-700'
      } bg-black bg-opacity-30`}
    >
      {content}
      <h2 className="text-sm font-semibold text-gray-300 mb-1">{title}</h2>
      <p className="text-xl font-bold text-white text-center">{value}</p>
    </div>
  );
}