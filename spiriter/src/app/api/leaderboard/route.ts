import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const users = await User.find().sort({ points: -1 }).select("username points").lean();

  return NextResponse.json(users);
}
