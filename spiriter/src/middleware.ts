import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const openPaths = ["/", "/players", "/leaderboard"];
  
  const adminPaths =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/admin");

  // Check if this is an open path
  if (openPaths.includes(request.nextUrl.pathname)) {
    // For open paths with a token (logged in user who is admin)
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const isAdmin = payload.isAdmin;

        // Redirect admin to admin dashboard if they visit open paths
        if (isAdmin && request.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/admin/players", request.url));
        }
      } catch (error) {
        // Token error but on open path - just continue
        console.error("Token error on open path:", error);
      }
    }

    // Allow access to open paths regardless of login
    return NextResponse.next();
  }

  // For protected paths - require token
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const isAdmin = payload.isAdmin;

    // Admin Protection
    if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      console.log("❌ Access Denied: User is not an admin.");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect admin to admin dashboard for user pages
    if (isAdmin && !adminPaths) {
      console.log("✅ Admin on user page - redirecting to admin dashboard");
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
    "/",
    "/players",
    "/leaderboard",
    "/admin/:path*",
    "/team",
    "/budget/:path*",
    "/teams/:path*",
    "/select-team/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ],
};
