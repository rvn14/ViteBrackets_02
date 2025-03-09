import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Ensure only admin can access this
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const requestingUser = await User.findById((decoded as jwt.JwtPayload).id);
    
    // if (!requestingUser || !requestingUser.isAdmin) {
    //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    // }

    // Get all users, excluding passwords
    const users = await User.find().select("-password");
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
