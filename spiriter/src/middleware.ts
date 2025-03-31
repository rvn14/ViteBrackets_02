import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const openPaths = ["/", "/players", "/leaderboard"];

  // Fix typo in openPaths
  if (!token && !openPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const isAdmin = payload.isAdmin;


    // Admin Protection
    if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      console.log("❌ Access Denied: User is not an admin.");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // NEW: Check if admin user has just logged in and is on the homepage
    // or is trying to access a non-admin-specific page
    if (
      isAdmin &&
      (request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname === "/team" ||
        request.nextUrl.pathname === "/select-team")
    ) {
      console.log("✅ Admin login detected - redirecting to admin dashboard");
      return NextResponse.redirect(new URL("/admin/players", request.url));
    }

    console.log("✅ Access Granted");
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Middleware Error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/team", // Add team page to matcher
    "/budget/:path*",
    "/teams/:path*",
    "/select-team/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ],
};
