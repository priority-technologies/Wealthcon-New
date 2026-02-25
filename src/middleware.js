import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  const response = NextResponse.next();

  if (token) {
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

      // Set headers for API routes to use
      // In Next.js 14, we need to set on request headers before cloning
      response.headers.set('x-user-id', decoded.id);
      response.headers.set('x-user-role', decoded.role);
      response.headers.set('x-user-email', decoded.email);
    } catch (error) {
      console.error('JWT verification error:', error.message);
    }
  }

  return response;
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
