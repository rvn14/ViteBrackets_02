import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';

/**
 * GET =>
 *  - If "userId" is provided as a query parameter, return the corresponding user.
 *  - Otherwise, list players (public info only: name, uni, category).
 */

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch all players
    const players = await Player.find().lean(); // Use .lean() to return plain objects
    if (!players || players.length === 0) {
      console.warn("⚠️ No players found in database");
      return NextResponse.json({ message: "No players found" }, { status: 404 });
    }

    // Map fields correctly
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
        playerPoints: derived.playerPoints,
        playerValue: derived.playerValue,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


/**
 * Example of POST with "action": "add" or "remove" in request body.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = verifyAuthHeader(request);
    const userId = typeof payload === 'string' ? payload : payload.id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const body = await request.json();
    const { action, playerId } = body;
    if (!action || !playerId) {
      return NextResponse.json({ message: 'Missing action or playerId' }, { status: 400 });
    }

    // 1) Add a player
    if (action === 'add') {
      if (user.team.includes(playerId)) {
        return NextResponse.json({ message: 'Player already in team' }, { status: 400 });
      }
      const player = await Player.findById(playerId);
      if (!player) {
        return NextResponse.json({ message: 'Player not found' }, { status: 404 });
      }
      // Check budget
      if (user.budget < player.value) {
        return NextResponse.json({ message: 'Insufficient budget' }, { status: 400 });
      }
      user.team.push(playerId);
      user.budget -= player.value;
      await user.save();
      return NextResponse.json({ message: 'Player added', user }, { status: 200 });
    }

    // 2) Remove a player
    if (action === 'remove') {
      const idx = user.team.indexOf(playerId);
      if (idx === -1) {
        return NextResponse.json({ message: 'Player not in team' }, { status: 400 });
      }
      const player = await Player.findById(playerId);
      user.budget += player.value;
      user.team.splice(idx, 1);
      await user.save();
      return NextResponse.json({ message: 'Player removed', user }, { status: 200 });
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
