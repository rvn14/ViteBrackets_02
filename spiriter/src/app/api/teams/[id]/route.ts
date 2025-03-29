// src/app/api/teams/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";
import Player from "@/models/Player";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { calculateDerivedAttributes } from "@/lib/calculateDerivedAttributes";

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

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If user has no team or team is empty, return empty array
    if (!user.team || user.team.length === 0) {
      return NextResponse.json({ players: [] }, { status: 200 });
    }

    // Explicitly fetch complete player details for each player ID in the team
    const fullPlayerDetails = await Player.find({
      _id: { $in: user.team }
    });
    const result = fullPlayerDetails.map((p) => {
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

    return NextResponse.json({ players: result }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching team:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

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
    const { players, totalPoints, budget } = body;

    console.log(
      "Received team save request => players:",
      players,
      " totalPoints:",
      totalPoints,
      " budget:",
      budget
    );

    if (!Array.isArray(players)) {
      return NextResponse.json(
        { message: "Players must be an array" },
        { status: 400 }
      );
    }

    // Fetch all the player objects from the database based on the provided IDs
    const validPlayers = await Player.find({ _id: { $in: players } }).lean();
    if (validPlayers.length !== players.length) {
      return NextResponse.json(
      { message: "Some players not found or invalid player IDs provided" },
      { status: 400 }
      );
    }

    // 1) Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.budget = budget || user.budget; // Update budget if provided, else keep the old one
    user.team = validPlayers; // overwrite old team with new team
    user.totalPoints = totalPoints || 0;

    // Update the user's cookie with new budget and total points
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username, 
        budget: user.budget, 
        totalPoints: user.totalPoints, 
        isAdmin: user.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400, // 1 day
    });

    // Save the user ONCE after all changes
    await user.save();

    // console.log(
    //   `✅ Team updated. OldCost=${oldTeamCost}, NewCost=${newTeamCost}, Budget=${user.budget}`
    // );

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