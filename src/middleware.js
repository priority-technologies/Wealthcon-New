import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  if (token) {
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

      // Clone request and set headers on the request object
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.id);
      requestHeaders.set('x-user-role', decoded.role);
      requestHeaders.set('x-user-email', decoded.email);

      // Create new request with updated headers
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      return response;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      // Return 401 Unauthorized response on token verification failure
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  // No token provided - continue without auth headers
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
