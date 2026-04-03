import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: The app currently uses localStorage for auth (visitor_id, visitor_role).
// Middleware runs server-side and cannot access localStorage.
// This middleware is transparent for now — client-side redirects handle auth.
// To activate server-side protection, migrate to httpOnly cookies in the login flow,
// then uncomment the block below.

export function middleware(request: NextRequest) {
  // Future: uncomment when cookies are set on login
  // const role = request.cookies.get('visitor_role')?.value;
  // const id   = request.cookies.get('visitor_id')?.value;
  // if (!id || !['instructor', 'admin'].includes(role ?? '')) {
  //   return NextResponse.redirect(new URL('/instructor/login', request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/instructor/dashboard/:path*', '/instructor/session/:path*'],
};
