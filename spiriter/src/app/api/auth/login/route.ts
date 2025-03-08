import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Server error: JWT_SECRET is missing' }, { status: 500 });
    }

     const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: '1d' }
      );

    // Store JWT in HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400, // 1 day
    });

    return NextResponse.json({ message: 'Login successful', isAdmin: user.isAdmin, user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
