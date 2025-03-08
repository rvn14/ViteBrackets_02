import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    await connectToDatabase(); // ✅ Connect to MongoDB

    // ✅ Fetch User from MongoDB
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password!" }, { status: 400 });
    }

    // ✅ Compare Passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password!" }, { status: 400 });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return NextResponse.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        budget: user.budget,
        totalPoints: user.totalPoints,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
