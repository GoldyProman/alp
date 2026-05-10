import { NextResponse } from 'next/server';
import { validateSessionToken, SESSION_COOKIE } from '@/lib/session';

// Protect all /admin routes EXCEPT the login page and API login endpoint
export default function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Allow: login page, login API, logout API
  const publicPaths = ['/admin', '/api/admin/login', '/api/admin/logout'];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // Allow public enquiry POST (contact form submissions)
  if (pathname === '/api/admin/enquiries' && request.method === 'POST') {
    return NextResponse.next();
  }

  // For admin dashboard pages (not API routes), check session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token || !validateSessionToken(token)) {
    // Redirect browser requests to login
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Return 401 for API requests
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
