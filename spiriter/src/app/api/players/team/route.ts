import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import User from '@/models/User';
import { JwtPayload } from 'jsonwebtoken';

// GET => return user's team
export async function GET(request: NextRequest) {
    try {
      await connectToDatabase();
      const payload = verifyAuthHeader(request) as JwtPayload;
      const user = await User.findById(payload.id).populate('team', 'name university category');
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user.team);
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }