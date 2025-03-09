import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    await connectToDatabase();

    // ✅ Check if User Already Exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create & Save User
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}