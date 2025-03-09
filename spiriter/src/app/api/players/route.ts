import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';


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

// ✅ POST: Add a New Player
export async function POST(req: Request) {
  try {
    const playerData = await req.json();
    await connectToDatabase();
    
    const newPlayer = new Player(playerData);
    await newPlayer.save();

/**
 * Example of POST with "action": "add" or "remove" in request body.
 */
export async function POST(request: NextRequest) {
    return NextResponse.json({ message: "Player added successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }
}

// ✅ PUT: Update Player (Requires `id` in request body)
export async function PUT(req: Request) {
  try {
    const { id, ...updatedData } = await req.json();
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

    const updatedPlayer = await Player.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPlayer) return NextResponse.json({ error: "Player not found" }, { status: 404 });

    return NextResponse.json({ message: "Player updated successfully!", updatedPlayer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}

// ✅ DELETE: Remove Player (Requires `id` in request body)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    const deletedPlayer = await Player.findByIdAndDelete(id);
    if (!deletedPlayer) return NextResponse.json({ error: "Player not found" }, { status: 404 });

    return NextResponse.json({ message: "Player deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
