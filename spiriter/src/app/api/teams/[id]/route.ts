import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyAuthHeader } from "@/lib/auth";
import Team from "@/models/Team";
import { calculateDerivedAttributes } from "@/lib/calculateDerivedAttributes";
import Player from "@/models/Player";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    // ✅ Verify authentication
    const user = verifyAuthHeader(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // ✅ Fetch the team based on User ID, NOT team ID (Ensures users only access their team)
    const team = await Team.findOne({ user: userId }).populate("players");
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // ✅ If needed, compute derived stats for each player
    const playersWithDerived = (team.players as any[]).map((player) => {
      const derivedStats = calculateDerivedAttributes(player.stats);
      return {
        _id: player._id,
        name: player.name,
        university: player.university,
        category: player.category,
        stats: player.stats,
        derived: derivedStats,
      };
    });

    // ✅ Response Object
    interface PlayerStats {
      points?: number;
      [key: string]: any;
    }

    interface DerivedStats {
      [key: string]: any;
    }

    interface PlayerWithDerived {
      _id: string;
      name: string;
      university: string;
      category: string;
      stats: PlayerStats;
      derived: DerivedStats;
    }

    interface TeamResponse {
      _id: string;
      name: string;
      user: string;
      players: PlayerWithDerived[];
      totalPoints: number;
    }

    const response: TeamResponse = {
      _id: team._id as string,
      name: team.name as string,
      user: team.user as string,
      players: playersWithDerived as PlayerWithDerived[],
      totalPoints: (team.players as any[]).reduce((acc: number, player: any) => acc + (player.stats.points || 0), 0), // Summing up total points
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
