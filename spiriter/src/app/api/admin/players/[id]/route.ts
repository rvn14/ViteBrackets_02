import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import Team from '@/models/Team';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Player ID is required" }, { status: 400 });
    }

    let player: any = await Player.findById(id).lean(); // Ensure it returns a plain object

    if (Array.isArray(player)) {
      player = player[0];
    }
    if (!player) {
      return NextResponse.json({ message: "Player not found" }, { status: 404 });
    }

    // Map MongoDB fields to Mongoose-friendly fields
    const derived = calculateDerivedAttributes({
      totalRuns: (player as any)["Total Runs"] || 0,
      totalBallsFaced: (player as any)["Balls Faced"] || 0,
      inningsPlayed: (player as any)["Innings Played"] || 0,
      totalWicketsTaken: (player as any)["Wickets"] || 0,
      totalBallsBowled: (player as any)["Overs Bowled"] || 0,
      totalRunsConceded: (player as any)["Runs Conceded"] || 0,
    });

    const formattedPlayer = {
      _id: player._id,
      name: player.Name,
      university: player.University,
      category: player.Category,
      runs: player["Total Runs"] || 0,
      ballsFaced: player["Balls Faced"] || 0,
      inningsPlayed: player["Innings Played"] || 0,
      wickets: player.Wickets || 0,
      oversBowled: player["Overs Bowled"] || 0,
      runsConceded: player["Runs Conceded"] || 0,
      battingStrikeRate: derived.battingStrikeRate,
      battingAverage: derived.battingAverage,
      bowlingStrikeRate: derived.bowlingStrikeRate,
      economyRate: derived.economyRate,
      playerPoints: derived.playerPoints,
      playerValue: derived.playerValue,
    };

    return NextResponse.json(formattedPlayer, { status: 200 });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// UPDATE a player (Admin Only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = verifyAuthHeader(request);
    if (typeof payload !== 'string' && 'id' in payload) {
      const user = await User.findById(payload.id);
      if (!user || user.isAdmin !== true) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();
    const updatedPlayer = await Player.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE a player (Admin Only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload !== 'string' && 'id' in payload) {
      const user = await User.findById(payload.id);
      if (!user || user.username !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const deletedPlayer = await Player.findByIdAndDelete(params.id);
    if (!deletedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Player deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
