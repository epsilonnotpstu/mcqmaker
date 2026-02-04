import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, STUDENT_COOKIE_NAME } from '@/lib/constants';

export const config = {
  matcher: ['/admin/:path*', '/exam'],
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Student protection for /exam
  if (pathname === '/exam') {
    const attemptId = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    if (!attemptId) {
      const url = req.nextUrl.clone();
      url.pathname = '/enter';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Admin protection for /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow visiting login page without token
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
