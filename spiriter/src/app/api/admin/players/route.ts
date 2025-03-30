import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';

// GET all players (admin only)

export async function GET() {
  try {
    await connectToDatabase();
    // Retrieve all players
    const players = await Player.find().lean(); 
    if (!players || players.length === 0) {
      console.warn("⚠️ No players found in database");
      return NextResponse.json({ message: "No players found" }, { status: 404 });
    }

    const result = players.map((p) => {
      const derived = calculateDerivedAttributes({
        totalRuns: p["Total Runs"] || 0,
        totalBallsFaced: p["Balls Faced"] || 0,
        inningsPlayed: p["Innings Played"] || 0,
        totalWicketsTaken: p["Wickets"] || 0,
        totalBallsBowled: p["Overs Bowled"] || 0,
        totalRunsConceded: p["Runs Conceded"] || 0,
      });

      return {
        _id: p._id,
        name: p.Name,
        university: p.University,
        category: p.Category,

        runs: p["Total Runs"] || 0,
        ballsFaced: p["Balls Faced"] || 0,
        inningsPlayed: p["Innings Played"] || 0,
        wickets: p.Wickets || 0,
        oversBowled: p["Overs Bowled"] || 0,
        runsConceded: p["Runs Conceded"] || 0,
        battingStrikeRate: derived.battingStrikeRate,
        battingAverage: derived.battingAverage,
        bowlingStrikeRate: derived.bowlingStrikeRate,
        economyRate: derived.economyRate,
        playerPoints: derived.playerPoints,  // if you want to hide points from users, remove this
        playerValue: derived.playerValue
      };
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST create a new player (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = verifyAuthHeader(request);
    if (typeof payload === 'string' || !payload.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const user = await User.findById(payload.userId);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const newPlayer = await Player.create(body);
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

