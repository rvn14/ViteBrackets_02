import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose/jwt/verify";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  const openPaths = ["/", "/players", "/leaderbord"];

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
    console.log("✅ Token Verified:", payload);

    // Admin Protection
    if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      console.log("❌ Access Denied: User is not an admin.");
      return NextResponse.redirect(new URL("/dashboard", request.url));
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
    "/budget/:path*",
    "/dashboard/:path*",
    "/teams/:path*",
    "/select-team/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ],
};
