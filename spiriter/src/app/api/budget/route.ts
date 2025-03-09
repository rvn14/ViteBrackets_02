import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// ✅ GET: Fetch User's Budget
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ budget: user.budget }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}
