import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';

/**
 * GET => list players (public info only: name, uni, category)
 * POST => add or remove players from team, etc. 
 * (Alternatively, you might break them into subroutes.)
 */

export async function GET(request: NextRequest) {
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
        totalRuns: p['Total Runs'],
        totalBallsFaced: p['Balls Faced'] ,
        inningsPlayed: p['Innings Played'] ,
        totalWicketsTaken: p['Wickets'] ,
        totalBallsBowled: p['Overs Bowled'],
        totalRunsConceded: p['Runs Conceded']
      });

      return {
        _id: p._id,
        name: p.Name,
        university: p.University,
        category: p.Category,
        runs: p['Total Runs'],
        ballsFaced: p['Balls Faced'],
        inningsPlayed: p['Innings Played'],
        wickets: p.Wickets,
        oversBowled: p['Overs Bowled'],
        runsConceded: p['Runs Conceded'],
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

/**
 * Example of POST with "action": "add" or "remove" in request body
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
