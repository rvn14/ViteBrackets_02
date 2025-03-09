// /api/leaderboard/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ totalPoints: -1 }).limit(10).lean();

    const leaderboard = users.map(u => ({
      _id: u._id,
      username: u.username,
      totalPoints: u.totalPoints || 0,
    }));

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}