import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public and protected route patterns
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_PREFIXES = ["/dashboard", "/users", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session token from cookies
  const token = request.cookies.get("session_token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // 1. Unauthenticated user trying to access a protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // Redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access auth pages
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except static files, images, and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};