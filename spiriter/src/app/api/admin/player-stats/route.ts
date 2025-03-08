import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import { JwtPayload } from 'jsonwebtoken';

// GET all player stats (Admin Only)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    const user = await User.findById((payload as JwtPayload).id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const players = await Player.find().select('name stats');
    return NextResponse.json(players, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST new player stats (Admin Only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    const user = await User.findById((payload as JwtPayload).id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { playerId, stats } = body;

    if (!playerId || !stats) {
      return NextResponse.json({ message: 'Missing player ID or stats data' }, { status: 400 });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    player.stats = stats;
    await player.save();

    return NextResponse.json(player, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
