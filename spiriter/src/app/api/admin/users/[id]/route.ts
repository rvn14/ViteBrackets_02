// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAuthHeader } from '@/lib/auth';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // 1) Check caller is admin
    const payload = verifyAuthHeader(request);
    let adminUser;
    if (typeof payload !== 'string' && 'id' in payload) {
      adminUser = await User.findById(payload.id);
    } else {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 });
    }
    if (!adminUser || adminUser.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    // 2) Fetch the requested user by ID
    const userId = params.id;
    const foundUser = await User.findById(userId).select('-password');
    if (!foundUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(foundUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * PUT => Promote/demote user, or update other fields.
 * Body might be: { role: "admin" } or { role: "user" }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // 1) Check caller is admin
    const payload = verifyAuthHeader(request);
    let adminUser;
    if (typeof payload !== 'string' && 'id' in payload) {
      adminUser = await User.findById(payload.id);
    } else {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 });
    }
    if (!adminUser || adminUser.isAdmin !== true) {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    // 2) Extract the body
    const userId = params.id;
    const body = await request.json(); // e.g. { role: "admin" }

    // 3) Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true
    }).select('-password');
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated', updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * DELETE => Remove a user from the system entirely
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // 1) Check caller is admin
    const payload = verifyAuthHeader(request);
    let adminUser;
    if (typeof payload !== 'string' && 'id' in payload) {
      adminUser = await User.findById(payload.id);
    } else {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 });
    }
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    // 2) Delete the user
    const userId = params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
