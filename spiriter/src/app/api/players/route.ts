import { calculateDerivedAttributes } from "@/lib/calculateDerivedAttributes";
import { connectToDatabase } from "@/lib/mongodb";
import Player from "@/models/Player";
import { NextRequest, NextResponse } from "next/server";

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

// ✅ POST: Add a New Player
export async function POST(req: Request) {
  try {
    const playerData = await req.json();
    await connectToDatabase();
    
    const newPlayer = new Player(playerData);
    await newPlayer.save();

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
