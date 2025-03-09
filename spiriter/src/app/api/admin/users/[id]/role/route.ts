import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    console.log("Received request to update user role");
    await connectToDatabase();

    const { id } = context.params; // ✅ Correct way to access params
    console.log("User ID from params:", id);

    // Ensure token exists
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Verify Token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing in .env");
      return NextResponse.json({ message: "Server error: Missing JWT_SECRET" }, { status: 500 });
    }
    
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    
    const requestingUser = await User.findById(decoded.userId);

    // if (!requestingUser || !requestingUser.isAdmin) {
    //   return NextResponse.json({ message: "Forbidden: Not an admin" }, { status: 403 });
    // }

    // Prevent self-demotion
    if (requestingUser._id.toString() === id) {
      return NextResponse.json({ message: "You cannot change your own admin status" }, { status: 400 });
    }

    // Find and toggle admin status
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.isAdmin = !user.isAdmin; // Toggle admin role
    await user.save();
    return NextResponse.json({ message: `User is now ${user.isAdmin ? "an Admin" : "a Normal User"}`, user }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error updating user role:", error.message);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
