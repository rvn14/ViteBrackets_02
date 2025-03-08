'use client';

import React from 'react';

/** Example category icons (replace with real images if desired) */
function getCategoryIcon(category: string) {
  switch (category) {
    case 'Batsman':
      return '⚾'; // or a cricket bat icon
    case 'Bowler':
      return '🏏'; // or a cricket ball icon
    case 'All-rounder':
      return '⭐'; // or any star/all-rounder icon
    default:
      return '❓';
  }
}

export interface Player {
  _id: string;
  name: string;
  university: string;
  runs: number;
  ballsFaced: number;
  inningsPlayed: number;
  wickets: number;
  oversBowled: number;
  runsConceded: number;
  category: 'Batsman' | 'Bowler' | 'All-Rounder';
  value: number;
}

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const categoryIcon = getCategoryIcon(player.category);
  const avatarSrc =  'https://www.shareicon.net/data/128x128/2016/06/27/787169_people_512x512.png'; // fallback placeholder image

  return (
    <div className="relative w-full h-[300px] bg-yellow-300 rounded-lg shadow-lg overflow-hidden flex flex-col items-center justify-end p-2">
      {/* 
        Top-left plus icon => Hover to show expanded stats 
        group + group-hover classes let you show the stats on hover 
      */}
      <div className="absolute top-1 left-1">
        <div className="relative group">
          {/* The plus icon */}
          <div className="bg-white text-black font-bold rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
            +
          </div>

          {/* Hidden popup that appears on hover */}
          <div className="absolute left-6 top-0 bg-white text-black text-sm p-2 w-48 rounded shadow-md hidden group-hover:block z-10">
            <img 
              src={avatarSrc} 
              alt="Player avatar" 
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
            <p><strong>Runs:</strong> {player.name}</p>
            <p><strong>Balls Faced:</strong> {player.university}</p>
            <p><strong>Runs:</strong> {player.runs}</p>
            <p><strong>Balls Faced:</strong> {player.ballsFaced}</p>
            <p><strong>Innings:</strong> {player.inningsPlayed}</p>
            <p><strong>Wickets:</strong> {player.wickets}</p>
            <p><strong>Overs Bowled:</strong> {player.oversBowled}</p>
            <p><strong>Runs Conceded:</strong> {player.runsConceded}</p>
          </div>
        </div>
      </div>

      {/* Top-right category icon */}
      <div className="absolute top-1 right-1">
        <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded shadow">
          {categoryIcon}
        </div>
      </div>

      {/* Avatar image placed above the player's name */}
      <div className="absolute top-12">
        <img 
          src={avatarSrc} 
          alt="Player avatar" 
          className="w-16 h-16 rounded-full object-cover border-2 border-white"
        />
      </div>

      {/* Player name & university at the bottom */}
      <div className="text-center">
        <div className="text-lg font-bold">{player.name}</div>
        <div className="text-sm">{player.university}</div>
      </div>
    </div>
  );
}
