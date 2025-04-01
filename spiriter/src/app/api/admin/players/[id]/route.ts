import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = await params;

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

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = context.params;

    // Check if user is an admin
    const payload = verifyAuthHeader(request);
    if (typeof payload !== 'string' && 'id' in payload) {
      const user = await User.findById(payload.id);
      if (!user || user.isAdmin !== true) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();

    // Only update base stats in the DB; do not persist derived attributes
    const updateObj = {
      Name: body.name,
      University: body.university,
      Category: body.category,
      "Total Runs": body.runs,
      "Balls Faced": body.ballsFaced,
      "Innings Played": body.inningsPlayed,
      Wickets: body.wickets,
      "Overs Bowled": body.oversBowled,
      "Runs Conceded": body.runsConceded,
    };

    await Player.findByIdAndUpdate(id, updateObj, { new: false });

    // Fetch updated document to compute derived attributes on the fly
    let updatedPlayerDoc = await Player.findById(id).lean();
    if (!updatedPlayerDoc) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }
    if (Array.isArray(updatedPlayerDoc)) {
      updatedPlayerDoc = updatedPlayerDoc[0];
    }

    const derived = calculateDerivedAttributes({
      totalRuns: updatedPlayerDoc["Total Runs"] || 0,
      totalBallsFaced: updatedPlayerDoc["Balls Faced"] || 0,
      inningsPlayed: updatedPlayerDoc["Innings Played"] || 0,
      totalWicketsTaken: updatedPlayerDoc["Wickets"] || 0,
      totalBallsBowled: updatedPlayerDoc["Overs Bowled"] || 0,
      totalRunsConceded: updatedPlayerDoc["Runs Conceded"] || 0,
    });

    const responsePlayer = {
      _id: updatedPlayerDoc._id,
      name: updatedPlayerDoc.Name,
      university: updatedPlayerDoc.University,
      category: updatedPlayerDoc.Category,
      runs: updatedPlayerDoc["Total Runs"] || 0,
      ballsFaced: updatedPlayerDoc["Balls Faced"] || 0,
      inningsPlayed: updatedPlayerDoc["Innings Played"] || 0,
      wickets: updatedPlayerDoc.Wickets || 0,
      oversBowled: updatedPlayerDoc["Overs Bowled"] || 0,
      runsConceded: updatedPlayerDoc["Runs Conceded"] || 0,
      battingStrikeRate: derived.battingStrikeRate,
      battingAverage: derived.battingAverage,
      bowlingStrikeRate: derived.bowlingStrikeRate,
      economyRate: derived.economyRate,
      playerPoints: derived.playerPoints,
      playerValue: derived.playerValue,
    };

    return NextResponse.json(responsePlayer, { status: 200 });
  } catch (error: any) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE a player (Admin Only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    console.log('Received DELETE request for player ID:', params.id);

    // Check if user is an admin
    const payload = verifyAuthHeader(request);
    console.log('Payload:', payload);

    if (typeof payload !== 'string' && 'userId' in payload) {
      const user = await User.findById(payload.userId);
      console.log('Payload:', payload);

      console.log('User:', user);
      if (!user || user.isAdmin !== true) {
        console.log('User is not an admin');
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else {
      console.log('Invalid token or payload');
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
