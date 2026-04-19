import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/libs/supabase/middleware';

const PROTECTED_ROUTES = ['/', '/awards', '/kudos', '/users'];
const AUTH_ROUTES = ['/auth/login'];

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh session — MUST call getUser() to keep session alive
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (user && AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|assets/).*)',
  ],
};
