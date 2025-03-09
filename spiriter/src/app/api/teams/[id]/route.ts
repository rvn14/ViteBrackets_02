// src/app/api/teams/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";
import Player from "@/models/Player";

// GET /api/teams/[id]: Return the user's team
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

    const user = await User.findById(userId).populate("team");
    if (!user || !user.team) {
      return NextResponse.json({ players: [] }, { status: 200 });
    }

    // Return the user's team array
    return NextResponse.json({ players: user.team }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching team:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/teams/[id]: Save or update user's team & adjust budget
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

    // Parse the request body: { players: [...], totalPoints: number }
    const body = await request.json();
    const { players, totalPoints } = body;

    console.log(
      "Received team save request => players:",
      players,
      " totalPoints:",
      totalPoints
    );

    if (!Array.isArray(players)) {
      return NextResponse.json(
        { message: "Players must be an array" },
        { status: 400 }
      );
    }

    // Find all the new team players in DB
    const validPlayers = await Player.find({ _id: { $in: players } });
    if (validPlayers.length !== players.length) {
      return NextResponse.json(
        { message: "Some players not found" },
        { status: 400 }
      );
    }

    // 1) Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2) Find the old team's players (to compute old cost)
    const oldTeamPlayers = await Player.find({ _id: { $in: user.team } });
    const oldTeamCost = oldTeamPlayers.reduce(
      (acc, p) => acc + (p.playerValue || 0),
      0
    );

    // 3) Compute the new team's total cost
    const newTeamCost = validPlayers.reduce(
      (acc, p) => acc + (p.playerValue || 0),
      0
    );

    // 4) Budget difference: (oldTeamCost - newTeamCost)
    // If negative => new team is more expensive => budget goes down
    // If positive => new team is cheaper => budget goes up
    const costDifference = oldTeamCost - newTeamCost;
    const updatedBudget = user.budget + costDifference;

    // (Optional) If you want to prevent budget going below 0:
    // if (updatedBudget < 0) {
    //   return NextResponse.json({ message: "Insufficient budget" }, { status: 400 });
    // }

    user.budget = updatedBudget;
    user.team = validPlayers; // overwrite old team with new team
    user.totalPoints = totalPoints || 0;

    await user.save();

    console.log(
      `✅ Team updated. OldCost=${oldTeamCost}, NewCost=${newTeamCost}, Budget=${user.budget}`
    );

    return NextResponse.json(
      {
        message: "Team saved successfully",
        team: user.team,
        totalPoints: user.totalPoints,
        budget: user.budget,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error saving team:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
