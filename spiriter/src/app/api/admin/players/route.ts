import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';

// GET all players (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    // Check admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload === 'string' || !payload.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const user = await User.findById(payload.id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const players = await Player.find();
    return NextResponse.json(players, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST create a new player (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await verifyAuthHeader(request);
    if (typeof payload === 'string' || !payload.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const user = await User.findById(payload.id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const newPlayer = await Player.create(body);
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

