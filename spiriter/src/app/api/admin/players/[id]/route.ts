import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Player from '@/models/Player';
import User from '@/models/User';
import Team from '@/models/Team';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectToDatabase();
      verifyAuthHeader(request);
  
      const teamId = params.id;
      const team = await Team.findById(teamId).populate('players');
      if (!team) {
        return NextResponse.json({ message: 'Team not found' }, { status: 404 });
      }
  
      // For each player, compute derived attributes
      const playersWithDerived = (team.players as any[]).map((p) => {
        const derived = calculateDerivedAttributes(p.stats);
        return {
          _id: p._id,
          name: p.name,
          university: p.university,
          category: p.category,
          stats: p.stats,
          derived  // include all computed derived attributes
        };
      });
  
      const response = {
        _id: team._id,
        name: team.name,
        user: team.user,
        players: playersWithDerived
      };
      return NextResponse.json(response, { status: 200 });
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
