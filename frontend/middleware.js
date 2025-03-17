// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected and public paths
  const protectedPaths = ['/dashboard'];
  const authPaths = ['/login', '/register'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname === path);

  // Redirect to login if accessing protected route without token
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if already logged in but accessing login/register
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to dashboard when logged in
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};