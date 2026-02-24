import { NextResponse } from "next/server";
import isAuthenticated from "./auth/isAuthenticated";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value || "";
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/forgot-password";

  const isAuth = await isAuthenticated(request);

  // Authenticate API calls
  if (
    !isPublicPath &&
    path.startsWith("/api/") &&
    !path.endsWith("login") &&
    !path.endsWith("live") &&
    !path.endsWith("register") &&
    !path.endsWith("generate-otp") &&
    !path.endsWith("verify-otp") &&
    !path.endsWith("reset-password") &&
    !path.endsWith("check-device") &&
    !path.endsWith("bg-images") &&
    !path.endsWith("categories")
  ) {
    if (!isAuth) {
      const headers = {
        "Set-Cookie": `token=; HttpOnly; Path=/; Expires=${new Date(
          0
        ).toUTCString()}`,
      };
      return Response.json(
        { success: false, message: "authentication failed" },
        { status: 401, headers }
      );
    }

    // JWT verification is sufficient - skip device check for now
    // Device check can be re-enabled later if needed

    if (
      isAuth?.role !== "admin" &&
      isAuth?.role !== "superAdmin" &&
      path.startsWith("/api/admin")
    ) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", isAuth.id);
    requestHeaders.set("x-user-role", isAuth.role);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Handle non-API routes
  if (!path.startsWith("/api/")) {
    if (
      path.startsWith("/admin") &&
      (!isAuth || (isAuth?.role !== "admin" && isAuth?.role !== "superAdmin"))
    ) {
      return NextResponse.redirect(new URL("/home", request.nextUrl));
    }

    if (
      isPublicPath &&
      token &&
      isAuth?.role !== "admin" &&
      isAuth?.role !== "superAdmin"
    ) {
      return NextResponse.redirect(new URL("/home", request.nextUrl));
    }

    if (
      isPublicPath &&
      token &&
      (isAuth?.role === "admin" || isAuth?.role === "superAdmin")
    ) {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }

    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/home",
    "/login",
    "/register",
    "/forgot-password",
    "/live_session",
    "/live_session/:path*",
    "/shorts",
    "/shorts/:path*",
    "/notes",
    "/notes/:path*",
    "/gallery",
    "/admin/:path*",
    "/api/:path*",
  ],
};
