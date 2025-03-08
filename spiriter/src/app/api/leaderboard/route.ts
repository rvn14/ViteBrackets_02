import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// ✅ GET: Fetch Leaderboard
export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Fetch users and sort by points
    const users = await User.find().sort({ totalPoints: -1 }).limit(10);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
