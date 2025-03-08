import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';

// GET a specific player's stats (Admin Only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload === 'string' || !payload.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const user = await User.findById(payload.id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const player = await Player.findById(params.id).select('name stats');
    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// UPDATE player stats (Admin Only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload === 'string' || !payload.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const user = await User.findById(payload.id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updatedPlayer = await Player.findByIdAndUpdate(
      params.id,
      { stats: body.stats },
      { new: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE player stats (Admin Only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload === 'string' || !payload.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const user = await User.findById(payload.id);
    if (!user || user.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const player = await Player.findById(params.id);
    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    player.stats = {};
    await player.save();

    return NextResponse.json({ message: 'Player stats deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
