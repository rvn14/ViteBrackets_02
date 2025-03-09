'use client';

import React, { useEffect, useState } from 'react';
import { GiCricketBat } from 'react-icons/gi';

interface Player {
  _id: string;
  name: string;
  university: string;
  category: string;
  runs: number;
  wickets: number;
  battingStrikeRate: number;
  economyRate: number;
  logoUrl?: string;
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

  // Calculate aggregate statistics and top performers.
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
    <div className="p-8 min-h-screen text-white">
      <h1 className="text-4xl font-black mb-8 text-center">Tournament Summary</h1>
      
      {/* First Row: Total Runs & Total Wickets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <SummaryCard title="Total Runs" value={totalRuns.toString()} icon={<GiCricketBat className="w-12 h-12" />} />
        <SummaryCard title="Total Wickets" value={totalWickets.toString()} icon={<img src="/images/cricket-ball.png" alt="Stumps Icon" className="w-12 h-12 rounded-full bg-white" />} />
      </div>

      {/* Second Row: Top Performers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <TopPlayerCard
          title="Highest Run Scorer"
          playerName={highestRunScorer.name}
          value={`${highestRunScorer.runs} runs`}
        />
        <TopPlayerCard
          title="Highest Wicket Taker"
          playerName={highestWicketTaker.name}
          value={`${highestWicketTaker.wickets} wickets`}
        />
        <TopPlayerCard
          title="Best Batting SR"
          playerName={highestBattingSR.name}
          value={highestBattingSR.battingStrikeRate.toFixed(2)}
        />
        <TopPlayerCard
          title="Best Economy"
          playerName={highestBowlingEcon.name}
          value={highestBowlingEcon.economyRate.toFixed(2)}
        />
      </div>
    </div>
  );
}

/** 🏆 Summary Card (Left-Aligned Icon for Total Runs & Wickets) */
function SummaryCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-around  bg-blue-200/50 rounded-lg shadow-xl p-6 border text-center border-cyan-500/60">
      <div className="text-white">{icon}</div>
      <div className="ml-4 ">
        <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
        <p className="text-3xl font-extrabold text-white">{value}</p>
      </div>
    </div>
  );
}

/** 🏅 Top Player Card (Bigger First Name, Smaller Last Name) */
function TopPlayerCard({ title, playerName, value }: { title: string; playerName: string; value: string }) {
  const [firstName, ...lastNameParts] = playerName.split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-6  bg-blue-200/50 rounded-lg shadow-xl border border-cyan-500/60 transition-transform transform hover:scale-105">
      <img
        src="https://www.shareicon.net/data/128x128/2016/06/27/787169_people_512x512.png"
        alt="player"
        className="w-32 h-32 mb-3 rounded-full"
      />
      <h2 className="text-md font-semibold text-gray-300 mb-2.5">{title}</h2>
      <p className="text-xl font-bold text-white">
        {firstName} <span className="text-sm font-light">{lastName}</span>
      </p>
      <p className="text-3xl font-semibold text-cyan-400 mt-2">{value}</p>
    </div>
  );
}