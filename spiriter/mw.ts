import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define public routes that don't require authentication
const publicRoutes = ["/chatbot", "/leaderboard", "/players"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // If route is public, allow access without checking auth
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const isAdmin = decoded.isAdmin;

    // 🔒 Protect Admin Routes (Only for Admins)
    if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // ✅ Allow access to admin if user is an admin
    if (request.nextUrl.pathname.startsWith("/admin") && isAdmin) {
      return NextResponse.next();
    }

    // 🔒 Protect API routes for Admins (`/api/admin/*`)
    if (request.nextUrl.pathname.startsWith("/api/admin") && !isAdmin) {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    // ✅ Allow authenticated users to proceed for all other routes
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
