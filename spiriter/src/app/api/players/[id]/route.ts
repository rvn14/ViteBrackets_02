import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Player from "@/models/Player";
import { calculateDerivedAttributes } from "@/lib/calculateDerivedAttributes";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Player ID is required" }, { status: 400 });
    }

    let player = await Player.findById(id).lean(); // Ensure it returns a plain object
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
      runs: (player as any)["Total Runs"] || 0,
      ballsFaced: (player as any)["Balls Faced"] || 0,
      inningsPlayed: (player as any)["Innings Played"] || 0,
      wickets: (player as any)["Wickets"] || 0,
      oversBowled: (player as any)["Overs Bowled"] || 0,
      runsConceded: (player as any)["Runs Conceded"] || 0,
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
