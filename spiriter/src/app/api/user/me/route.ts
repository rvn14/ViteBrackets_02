import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      budget: number;
      totalPoints: number;
      isAdmin: boolean;
    };

    // Return user data from token
    return NextResponse.json({
      userId: decoded.userId,
      username: decoded.username,
      budget: decoded.budget,
      totalPoints: decoded.totalPoints,
      isAdmin: decoded.isAdmin
    });
  } catch (error: any) {
    console.error("Error fetching user data:", error.message);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
}