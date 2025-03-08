import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';

// GET a specific player by ID (Admin Only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload !== 'string' && 'id' in payload) {
      const user = await User.findById(payload.id);
      if (!user || user.isAdmin !== true) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const player = await Player.findById(params.id);
    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// UPDATE a player (Admin Only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = verifyAuthHeader(request);
    if (typeof payload !== 'string' && 'id' in payload) {
      const user = await User.findById(payload.id);
      if (!user || user.isAdmin !== true) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();
    const updatedPlayer = await Player.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE a player (Admin Only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Check if user is an admin
    const payload = await verifyAuthHeader(request);
    if (typeof payload !== 'string' && 'id' in payload) {
      const user = await User.findById(payload.id);
      if (!user || user.username !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const deletedPlayer = await Player.findByIdAndDelete(params.id);
    if (!deletedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Player deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
