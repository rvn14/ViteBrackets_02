import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";
import Player from "@/models/Player";

// GET: Return the user's team
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = params.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    console.log("Fetching team for user:", userId);

    // ✅ Fetch user and populate the "team" array
    const user = await User.findById(userId).populate("team");
    if (!user) {
      return NextResponse.json({ players: [] }, { status: 200 });
    }

    // If user.team is null or empty, return players: []
    return NextResponse.json(
      { players: user.team || [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching team:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Update the user's "team" field with Player IDs
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    console.log("🔍 Received Request to Save Team =>", body.players);

    // "players" must be a non-empty array of valid player IDs
    if (!Array.isArray(body.players) || body.players.length === 0) {
      return NextResponse.json({ message: "Invalid players data" }, { status: 400 });
    }

    // Ensure the requested players exist
    const validPlayers = await Player.find({ _id: { $in: body.players } });
    if (validPlayers.length !== body.players.length) {
      return NextResponse.json({ message: "Some players not found" }, { status: 400 });
    }

    // ✅ Upsert the user's "team" field with these players
    //    (We only do findByIdAndUpdate for the user doc)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { team: validPlayers }, // you can also do { team: body.players } if you want raw IDs
      { new: true }
    ).populate("team");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("✅ Team saved successfully for user:", updatedUser.username);
    return NextResponse.json(
      { message: "Team saved successfully", team: updatedUser.team },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error saving team:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
