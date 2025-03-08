import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log("connectToDatabase called");

  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new connection promise");
    cached.promise = mongoose.connect(MONGODB_URI as string).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  } else {
    console.log("Using existing connection promise");
  }

  cached.conn = await cached.promise;
  console.log("Connection established");
  return cached.conn;
}
