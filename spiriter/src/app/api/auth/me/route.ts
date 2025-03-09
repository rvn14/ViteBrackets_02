import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Fetch cookies and check token
    const cookiesData = await cookies();
    const token = cookiesData.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Server error: JWT_SECRET is missing");
      return NextResponse.json({ message: "Server error: JWT_SECRET is missing" }, { status: 500 });
    }

    // Verify token
    const decoded = jwt.verify(token, secret);

    // Fetch user
    const user = await User.findById((decoded as jwt.JwtPayload).userId).select("-password");

    if (!user) {
      console.warn("User not found, returning 404");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
