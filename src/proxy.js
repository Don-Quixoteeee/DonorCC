// Next.js Middleware - Route protection and authentication
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/donors', '/campaigns', '/donations', '/segments', '/workflows', '/tasks']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register']

export async function proxy(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const hasSession = cookieHeader.split(';').map(s => s.trim()).some(s => s.startsWith('donor_session='))
    const pathname = new URL(request.url).pathname

    // If accessing protected path without session, redirect to login
    if (protectedRoutes.some(p => pathname === p || pathname.startsWith(p + '/')) && !hasSession) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If accessing auth pages while authenticated, redirect to dashboard
    if (authRoutes.includes(pathname) && hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (e) {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (except auth check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}