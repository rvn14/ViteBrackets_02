import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";
import Player from "@/models/Player";
import { calculateDerivedAttributes } from "@/lib/calculateDerivedAttributes";

// ----------------------------------
// GET /api/teams/[id]
// Fetch the user’s team
// ----------------------------------
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = context.params.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    console.log("Fetching team for user:", userId);

    // 🔹 Find user by ID & populate the "team" array
    const user = await User.findById(userId).populate("team");
    if (!user) {
      // Return empty array if user not found or team is null
      return NextResponse.json({ players: [] }, { status: 200 });
    }

    // If the user has no team or team is null, return empty
    if (!user.team) {
      return NextResponse.json({ players: [] }, { status: 200 });
    }

    // Return the user's team
    return NextResponse.json({ players: user.team }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching team:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ----------------------------------
// POST /api/teams/[id]
// Save or update user’s team
// Now uses calculateDerivedAttributes for
// playerValue & playerPoints
// ----------------------------------
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = context.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Parse the request body { players: [ "playerId1", "playerId2", ... ] }
    const body = await request.json();
    const { players } = body;
    console.log("🔍 Received request to save team =>", players);

    if (!Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        { message: "Invalid players data" },
        { status: 400 }
      );
    }

    // 1️⃣ Check that these players exist
    const validPlayers = await Player.find({ _id: { $in: players } });
    if (validPlayers.length !== players.length) {
      return NextResponse.json(
        { message: "Some players not found" },
        { status: 400 }
      );
    }

    // 2️⃣ Compute derived cost & points for each player
    let totalCost = 0;
    let totalPlayerPoints = 0;

    for (const p of validPlayers) {
      // Convert your raw fields to match the function’s expected input
      const derived = calculateDerivedAttributes({
        totalRuns: p.runs,
        totalBallsFaced: p.balls_faced,
        inningsPlayed: p.innings_played,
        totalBallsBowled: p.overs_bowled * 6, // overs → balls
        totalWicketsTaken: p.wickets,
        totalRunsConceded: p.runs_conceded,
      });

      totalCost += derived.playerValue;
      totalPlayerPoints += derived.playerPoints;
    }

    // 3️⃣ Fetch user to check budget
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4️⃣ Compare total cost with user’s budget
    if (totalCost > user.budget) {
      console.error("❌ Team cost exceeds budget:", totalCost, ">", user.budget);
      return NextResponse.json(
        {
          message: "Team cost exceeds your budget!",
          teamCost: totalCost,
          budget: user.budget,
        },
        { status: 400 }
      );
    }

    // 5️⃣ If under budget, update user doc's team
    //    (storing the references)
    user.team = validPlayers;
    user.totalPoints = totalPlayerPoints;

    // (Optionally, leftover budget if you want to update user.budget)
    const leftoverBudget = user.budget - totalCost;
    // user.budget = leftoverBudget;

    await user.save();

    console.log("✅ Team saved successfully for user:", user.username);

    return NextResponse.json(
      {
        message: "Team saved successfully",
        team: user.team,
        leftoverBudget,
        totalPoints: user.totalPoints,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error saving team:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
