import {  NextResponse } from 'next/server';
import { verifyAuthHeader } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Player from '@/models/Player';


export async function POST(request) {
  // Example: user asks a question about a player
  try {
    await connectToDatabase();
    verifyAuthHeader(request);
    const { question } = await request.json();

    // Very naive approach: look for a player name substring
    if (!question) {
      return NextResponse.json({ response: "I don't have enough knowledge to answer that question." });
    }
    const players = await Player.find();
    const match = players.find((p) => question.toLowerCase().includes(p.name.toLowerCase()));
    if (match) {
      const { name, university, category, stats } = match;
      // do NOT reveal points
      return NextResponse.json({
        response: `Player: ${name}, University: ${university}, Category: ${category}, Stats: runs=${stats.runs}, wickets=${stats.wickets}`
      });
    } else {
      return NextResponse.json({
        response: "I don't have enough knowledge to answer that question."
      });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * GET => Suggest best team (top 11 by points)
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    verifyAuthHeader(request);

    const players = await Player.find().sort({ points: -1 }).limit(11);
    // Return just names/universities, do NOT reveal points
    const minimal = players.map((p) => ({
      name: p.name,
      university: p.university,
      category: p.category
    }));
    return NextResponse.json(minimal);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
