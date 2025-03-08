// app/api/teams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import Team from '@/models/Team';
import { calculateDerivedAttributes } from '@/lib/calculateDerivedAttributes';
import Player from '@/models/Player';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Return the team info, including derived stats for each player
  try {
    await connectToDatabase();
    verifyAuthHeader(request);

    const teamId = params.id;
    const team = await Team.findById(teamId).populate('players');
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    // If needed, transform each player with derived stats
    const playersWithDerived = (team.players as any[]).map((p) => {
      const derived = calculateDerivedAttributes(p.stats);
      return {
        _id: p._id,
        name: p.name,
        university: p.university,
        category: p.category,
        stats: p.stats,
        derived
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
