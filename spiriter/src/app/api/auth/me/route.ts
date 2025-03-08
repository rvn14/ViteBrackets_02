import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const cookiesData = await cookies();
    const token = cookiesData.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Server error: JWT_SECRET is missing' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findById((decoded as jwt.JwtPayload).id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
